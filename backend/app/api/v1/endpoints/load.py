from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from decimal import Decimal
from typing import Optional

from app.db.session import get_db
from app.core.security import get_current_user, require_admin
from app.core.exceptions import NotFoundException, AppException
from app.core.pagination import get_pagination, paginated_response, PaginationParams
from app.models import Load, Stock, Invoice, Inventory, Staff
from app.schemas import LoadCreate, LoadOut

router = APIRouter(prefix="/load", tags=["Load"])


@router.get("")
async def list_loads(
    ref_no: Optional[str] = Query(None, description="Filter by invoice reference number"),
    sku: Optional[str] = Query(None, description="Filter by SKU"),
    pagination: PaginationParams = Depends(get_pagination),
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(get_current_user),
):
    """List all Load records — optionally filter by invoice or SKU."""
    query = select(Load)
    if ref_no:
        query = query.where(Load.ref_no == ref_no)
    if sku:
        query = query.join(Stock, Stock.serial_number == Load.serial_number).where(Stock.sku == sku)

    total = await db.scalar(select(func.count()).select_from(query.subquery()))
    query = query.offset((pagination.page - 1) * pagination.limit).limit(pagination.limit)
    result = await db.execute(query)
    items = result.scalars().all()
    return paginated_response([LoadOut.model_validate(l) for l in items], total, pagination)


@router.post("", response_model=LoadOut, status_code=201)
async def create_load(
    payload: LoadCreate,
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(require_admin()),
):
    """
    Link a stock unit to an invoice with cost details.
    Also updates the weighted-average cost on the Inventory row.

    Flow:
      1. POST /api/v1/stock  → register the physical item
      2. POST /api/v1/invoice → create the invoice record
      3. POST /api/v1/load   → link them together with cost
    """
    # Validate stock exists
    stock = await db.get(Stock, payload.serial_number)
    if not stock:
        raise NotFoundException("Stock", payload.serial_number)

    # Validate invoice exists
    invoice = await db.get(Invoice, payload.ref_no)
    if not invoice:
        raise NotFoundException("Invoice", payload.ref_no)

    # Check not already linked
    existing = await db.get(Load, (payload.serial_number, payload.ref_no))
    if existing:
        raise AppException(
            409,
            "LOAD_ALREADY_EXISTS",
            f"Stock '{payload.serial_number}' is already linked to invoice '{payload.ref_no}'",
        )

    total_cost = (payload.purchase_cost or Decimal(0)) + (payload.additional_cost or Decimal(0))

    load = Load(
        serial_number=payload.serial_number,
        ref_no=payload.ref_no,
        purchase_cost=payload.purchase_cost,
        additional_cost=payload.additional_cost,
        total_cost=total_cost,
    )
    db.add(load)

    # Update weighted-average cost on Inventory
    if payload.purchase_cost and stock.sku:
        inv = await db.get(Inventory, stock.sku)
        if inv:
            current_qty = inv.quantity_on_hand
            current_value = inv.current_stock_value or Decimal(0)
            new_value = current_value + payload.purchase_cost

            inv.current_stock_value = new_value
            inv.current_avg_cost = new_value / current_qty if current_qty > 0 else payload.purchase_cost
            db.add(inv)

    await db.flush()
    return LoadOut.model_validate(load)


@router.get("/{serial_number}/{ref_no}", response_model=LoadOut)
async def get_load(
    serial_number: str,
    ref_no: str,
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(get_current_user),
):
    load = await db.get(Load, (serial_number, ref_no))
    if not load:
        raise NotFoundException("Load", f"{serial_number}/{ref_no}")
    return LoadOut.model_validate(load)


@router.delete("/{serial_number}/{ref_no}", status_code=204)
async def delete_load(
    serial_number: str,
    ref_no: str,
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(require_admin()),
):
    load = await db.get(Load, (serial_number, ref_no))
    if not load:
        raise NotFoundException("Load", f"{serial_number}/{ref_no}")
    await db.delete(load)
