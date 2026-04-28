from fastapi import APIRouter, Depends, Query, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional

from app.db.session import get_db
from app.core.security import get_current_user
from app.core.exceptions import NotFoundException, DuplicateRequestException
from app.core.pagination import get_pagination, paginated_response, PaginationParams
from app.models import Order, Customer, Staff
from app.schemas import (
    OrderCreate, OrderOut, OrderStatusUpdate,
    CustomerCreate, CustomerUpdate, CustomerOut,
)

order_router = APIRouter(prefix="/order", tags=["Order"])
customer_router = APIRouter(prefix="/customer", tags=["Customer"])

# Simple in-memory idempotency store — in production use Redis
_idempotency_cache: dict = {}


# ── Orders ────────────────────────────────────────────────────────────────────
@order_router.get("")
async def list_orders(
    status: Optional[str] = Query(None),
    sales_platform: Optional[str] = Query(None),
    customer_id: Optional[int] = Query(None),
    pagination: PaginationParams = Depends(get_pagination),
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(get_current_user),
):
    query = select(Order)
    if status:
        query = query.where(Order.status == status)
    if sales_platform:
        query = query.where(Order.sales_platform == sales_platform)
    if customer_id:
        query = query.where(Order.customer_id == customer_id)

    total = await db.scalar(select(func.count()).select_from(query.subquery()))
    query = query.offset((pagination.page - 1) * pagination.limit).limit(pagination.limit)
    result = await db.execute(query)
    items = result.scalars().all()
    return paginated_response([OrderOut.model_validate(o) for o in items], total, pagination)


@order_router.post("", response_model=OrderOut, status_code=201)
async def create_order(
    payload: OrderCreate,
    idempotency_key: Optional[str] = Header(None, alias="Idempotency-Key"),
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(get_current_user),
):
    # Idempotency check
    if idempotency_key:
        if idempotency_key in _idempotency_cache:
            raise DuplicateRequestException(idempotency_key, _idempotency_cache[idempotency_key])

    customer = await db.get(Customer, payload.customer_id)
    if not customer:
        raise NotFoundException("Customer", str(payload.customer_id))

    order = Order(
        tracking_number=payload.tracking_number,
        customer_id=payload.customer_id,
        sales_platform=payload.sales_platform,
        purchase_date=payload.purchase_date,
        total=payload.total,
        status="PENDING",
    )
    db.add(order)
    await db.flush()

    if idempotency_key:
        _idempotency_cache[idempotency_key] = payload.tracking_number

    return OrderOut.model_validate(order)


@order_router.get("/track/{tracking_number}", response_model=OrderOut)
async def track_order(
    tracking_number: str,
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(get_current_user),
):
    order = await db.get(Order, tracking_number)
    if not order:
        raise NotFoundException("Order", tracking_number)
    return OrderOut.model_validate(order)


@order_router.put("/{tracking_number}/status", response_model=OrderOut)
async def update_order_status(
    tracking_number: str,
    payload: OrderStatusUpdate,
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(get_current_user),
):
    order = await db.get(Order, tracking_number)
    if not order:
        raise NotFoundException("Order", tracking_number)
    order.status = payload.status
    db.add(order)
    return OrderOut.model_validate(order)


@order_router.post("/{tracking_number}/fulfill", status_code=200)
async def fulfill_order(
    tracking_number: str,
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(get_current_user),
):
    """Shortcut: fulfills all reserved stock for an order and marks it FULFILLED."""
    from app.api.v1.endpoints.stock import fulfill_stock
    from app.schemas import StockFulfillRequest

    order = await db.get(Order, tracking_number)
    if not order:
        raise NotFoundException("Order", tracking_number)

    await fulfill_stock(StockFulfillRequest(tracking_number=tracking_number), db=db)
    order.status = "FULFILLED"
    db.add(order)
    return {"message": f"Order {tracking_number} fulfilled successfully"}


@order_router.post("/{tracking_number}/return", status_code=200)
async def return_order(
    tracking_number: str,
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(get_current_user),
):
    """
    Process a return: mark order RETURNED and move stock back to AVAILABLE.
    COGS reversal should be handled in the P&L service.
    """
    from app.models import Check, Stock, Inventory

    order = await db.get(Order, tracking_number)
    if not order:
        raise NotFoundException("Order", tracking_number)

    result = await db.execute(select(Check).where(Check.tracking_number == tracking_number))
    checks = result.scalars().all()

    for check in checks:
        stock = await db.get(Stock, check.serial_number)
        if stock:
            stock.status = "AVAILABLE"
            stock.stock_out = None
            db.add(stock)

            inv = await db.get(Inventory, stock.sku)
            if inv:
                inv.quantity_on_hand += 1
                db.add(inv)

    order.status = "RETURNED"
    db.add(order)
    return {"message": f"Order {tracking_number} returned"}


# ── Customers ─────────────────────────────────────────────────────────────────
@customer_router.get("")
async def list_customers(
    search: Optional[str] = Query(None),
    pagination: PaginationParams = Depends(get_pagination),
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(get_current_user),
):
    query = select(Customer)
    if search:
        query = query.where(Customer.customer_name.ilike(f"%{search}%"))
    total = await db.scalar(select(func.count()).select_from(query.subquery()))
    query = query.offset((pagination.page - 1) * pagination.limit).limit(pagination.limit)
    result = await db.execute(query)
    items = result.scalars().all()
    return paginated_response([CustomerOut.model_validate(c) for c in items], total, pagination)


@customer_router.post("", response_model=CustomerOut, status_code=201)
async def create_customer(
    payload: CustomerCreate,
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(get_current_user),
):
    customer = Customer(**payload.model_dump())
    db.add(customer)
    await db.flush()
    return CustomerOut.model_validate(customer)


@customer_router.get("/{customer_id}", response_model=CustomerOut)
async def get_customer(
    customer_id: int,
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(get_current_user),
):
    customer = await db.get(Customer, customer_id)
    if not customer:
        raise NotFoundException("Customer", str(customer_id))
    return CustomerOut.model_validate(customer)


@customer_router.put("/{customer_id}", response_model=CustomerOut)
async def update_customer(
    customer_id: int,
    payload: CustomerUpdate,
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(get_current_user),
):
    customer = await db.get(Customer, customer_id)
    if not customer:
        raise NotFoundException("Customer", str(customer_id))
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(customer, field, value)
    db.add(customer)
    return CustomerOut.model_validate(customer)
