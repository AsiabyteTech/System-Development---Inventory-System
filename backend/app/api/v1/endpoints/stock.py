from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional, List
from datetime import datetime

from app.db.session import get_db
from app.core.security import get_current_user, require_admin
from app.core.exceptions import NotFoundException, InsufficientStockException
from app.core.pagination import get_pagination, paginated_response, PaginationParams
from app.models import Stock, Inventory, Order, Check, StockMovement, Staff
from app.schemas import (
    StockCreate, StockUpdate, StockOut,
    StockReserveRequest, StockReserveResponse,
    StockReleaseRequest, StockAdjustRequest, StockFulfillRequest,
)

router = APIRouter(prefix="/stock", tags=["Stock"])


@router.get("")
async def list_stock(
    sku: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    pagination: PaginationParams = Depends(get_pagination),
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(get_current_user),
):
    query = select(Stock)
    if sku:
        query = query.where(Stock.sku == sku)
    if status:
        query = query.where(Stock.status == status)
    total = await db.scalar(select(func.count()).select_from(query.subquery()))
    query = query.offset((pagination.page - 1) * pagination.limit).limit(pagination.limit)
    result = await db.execute(query)
    items = result.scalars().all()
    return paginated_response([StockOut.model_validate(s) for s in items], total, pagination)


@router.post("", response_model=StockOut, status_code=201)
async def create_stock(
    payload: StockCreate,
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(require_admin()),
):
    """
    Register a new stock unit (physical item) into the system.
    This is called when goods arrive from a supplier before linking to an invoice via Load.
    """
    # Check serial number doesn't already exist
    existing = await db.get(Stock, payload.serial_number)
    if existing:
        from app.core.exceptions import AppException
        raise AppException(409, "SERIAL_NUMBER_EXISTS", f"Stock with serial number '{payload.serial_number}' already exists")

    # Validate SKU exists
    inv = await db.get(Inventory, payload.sku)
    if not inv:
        raise NotFoundException("Product", payload.sku)

    stock = Stock(
        serial_number=payload.serial_number,
        sku=payload.sku,
        status="AVAILABLE",
        remark=payload.remark,
        package_id=payload.package_id or None,
        promo_id=payload.promo_id or None,
    )
    db.add(stock)

    # Update inventory quantity
    inv.quantity_on_hand += 1
    db.add(inv)

    # Log movement
    movement = StockMovement(
        serial_number=payload.serial_number,
        action_type="STOCK_IN",
        ref_id=None,
        datetime=datetime.utcnow(),
    )
    db.add(movement)

    await db.flush()
    return StockOut.model_validate(stock)


@router.get("/available")
async def list_available_stock(
    sku: Optional[str] = Query(None),
    pagination: PaginationParams = Depends(get_pagination),
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(get_current_user),
):
    query = select(Stock).where(Stock.status == "AVAILABLE")
    if sku:
        query = query.where(Stock.sku == sku)
    total = await db.scalar(select(func.count()).select_from(query.subquery()))
    query = query.offset((pagination.page - 1) * pagination.limit).limit(pagination.limit)
    result = await db.execute(query)
    items = result.scalars().all()
    return paginated_response([StockOut.model_validate(s) for s in items], total, pagination)


@router.get("/reserved")
async def list_reserved_stock(
    pagination: PaginationParams = Depends(get_pagination),
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(get_current_user),
):
    query = select(Stock).where(Stock.status == "RESERVED")
    total = await db.scalar(select(func.count()).select_from(query.subquery()))
    query = query.offset((pagination.page - 1) * pagination.limit).limit(pagination.limit)
    result = await db.execute(query)
    items = result.scalars().all()
    return paginated_response([StockOut.model_validate(s) for s in items], total, pagination)


@router.get("/{serial_number}", response_model=StockOut)
async def get_stock(
    serial_number: str,
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(get_current_user),
):
    stock = await db.get(Stock, serial_number)
    if not stock:
        raise NotFoundException("Stock", serial_number)
    return StockOut.model_validate(stock)


@router.put("/{serial_number}", response_model=StockOut)
async def update_stock(
    serial_number: str,
    payload: StockUpdate,
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(require_admin()),
):
    """Update stock metadata (SKU, remark, package, promo). Does not change status."""
    stock = await db.get(Stock, serial_number)
    if not stock:
        raise NotFoundException("Stock", serial_number)
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(stock, field, value)
    db.add(stock)
    return StockOut.model_validate(stock)


@router.post("/reserve", response_model=StockReserveResponse)
async def reserve_stock(
    payload: StockReserveRequest,
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(get_current_user),
):
    """Mark stock items as RESERVED for a given order tracking number."""
    reserved_serials: List[str] = []

    for sn in payload.items:
        stock = await db.get(Stock, sn)
        if not stock:
            raise NotFoundException("Stock", sn)
        if stock.status != "AVAILABLE":
            raise InsufficientStockException(stock.sku, 1, 0)

        stock.status = "RESERVED"
        db.add(stock)

        check = Check(serial_number=sn, tracking_number=payload.tracking_number)
        db.add(check)

        inv = await db.get(Inventory, stock.sku)
        if inv:
            inv.reserved_quantity += 1
            db.add(inv)

        movement = StockMovement(
            serial_number=sn,
            action_type="RESERVED",
            ref_id=payload.tracking_number,
            datetime=datetime.utcnow(),
        )
        db.add(movement)

        reserved_serials.append(sn)

    return StockReserveResponse(
        tracking_number=payload.tracking_number,
        reserved=reserved_serials,
        message=f"{len(reserved_serials)} item(s) reserved for order {payload.tracking_number}",
    )


@router.post("/release", status_code=200)
async def release_stock(
    payload: StockReleaseRequest,
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(get_current_user),
):
    """Cancel reservation — move RESERVED → AVAILABLE."""
    result = await db.execute(
        select(Check).where(Check.tracking_number == payload.tracking_number)
    )
    checks = result.scalars().all()

    for check in checks:
        stock = await db.get(Stock, check.serial_number)
        if stock and stock.status == "RESERVED":
            stock.status = "AVAILABLE"
            db.add(stock)

            inv = await db.get(Inventory, stock.sku)
            if inv:
                inv.reserved_quantity = max(0, inv.reserved_quantity - 1)
                db.add(inv)

            movement = StockMovement(
                serial_number=check.serial_number,
                action_type="RELEASED",
                ref_id=payload.tracking_number,
                datetime=datetime.utcnow(),
            )
            db.add(movement)

        await db.delete(check)

    return {"message": f"Reservation for {payload.tracking_number} released"}


@router.post("/fulfill", status_code=200)
async def fulfill_stock(
    payload: StockFulfillRequest,
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(get_current_user),
):
    """Confirm sale: RESERVED → SOLD. Decrements quantity_on_hand and reserved_quantity."""
    result = await db.execute(
        select(Check).where(Check.tracking_number == payload.tracking_number)
    )
    checks = result.scalars().all()

    for check in checks:
        stock = await db.get(Stock, check.serial_number)
        if stock and stock.status == "RESERVED":
            stock.status = "SOLD"
            stock.stock_out = datetime.utcnow()
            db.add(stock)

            inv = await db.get(Inventory, stock.sku)
            if inv:
                inv.quantity_on_hand = max(0, inv.quantity_on_hand - 1)
                inv.reserved_quantity = max(0, inv.reserved_quantity - 1)
                db.add(inv)

            movement = StockMovement(
                serial_number=check.serial_number,
                action_type="SOLD",
                ref_id=payload.tracking_number,
                datetime=datetime.utcnow(),
            )
            db.add(movement)

    return {"message": f"Order {payload.tracking_number} fulfilled"}


@router.post("/adjust", status_code=200)
async def adjust_stock(
    payload: StockAdjustRequest,
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(require_admin()),
):
    """Manual stock adjustment — e.g. mark a unit as DAMAGED."""
    stock = await db.get(Stock, payload.serial_number)
    if not stock:
        raise NotFoundException("Stock", payload.serial_number)

    old_status = stock.status
    stock.status = payload.new_status
    if payload.remark:
        stock.remark = payload.remark
    db.add(stock)

    movement = StockMovement(
        serial_number=payload.serial_number,
        action_type=f"ADJUSTED_TO_{payload.new_status}",
        ref_id=None,
        datetime=datetime.utcnow(),
    )
    db.add(movement)

    return {
        "serial_number": payload.serial_number,
        "old_status": old_status,
        "new_status": payload.new_status,
    }
