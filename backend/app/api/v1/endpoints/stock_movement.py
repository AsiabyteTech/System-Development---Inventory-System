from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional
from datetime import date, datetime

from app.db.session import get_db
from app.core.security import require_admin
from app.core.exceptions import NotFoundException
from app.core.pagination import get_pagination, paginated_response, PaginationParams
from app.models import StockMovement, Stock, Inventory, Staff
from app.schemas import StockMovementOut

router = APIRouter(prefix="/stock-movement", tags=["Stock Movement (Audit)"])


@router.get("")
async def list_movements(
    action_type: Optional[str] = Query(None, description="Filter by action e.g. STOCK_IN, RESERVED, SOLD, RELEASED, ADJUSTED"),
    sku: Optional[str] = Query(None, description="Filter by SKU"),
    serial_number: Optional[str] = Query(None, description="Filter by serial number"),
    from_date: Optional[date] = Query(None, description="Filter from date"),
    to_date: Optional[date] = Query(None, description="Filter to date"),
    pagination: PaginationParams = Depends(get_pagination),
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(require_admin()),
):
    """
    Full audit log of all stock movements.
    Admin only. Filterable by action type, SKU, serial number and date range.
    """
    query = select(StockMovement)

    if action_type:
        query = query.where(StockMovement.action_type == action_type)

    if serial_number:
        query = query.where(StockMovement.serial_number == serial_number)

    if sku:
        query = (
            query.join(Stock, Stock.serial_number == StockMovement.serial_number)
            .where(Stock.sku == sku)
        )

    if from_date:
        query = query.where(
            StockMovement.datetime >= datetime.combine(from_date, datetime.min.time())
        )

    if to_date:
        query = query.where(
            StockMovement.datetime <= datetime.combine(to_date, datetime.max.time())
        )

    query = query.order_by(StockMovement.datetime.desc())

    total = await db.scalar(select(func.count()).select_from(query.subquery()))
    query = query.offset((pagination.page - 1) * pagination.limit).limit(pagination.limit)
    result = await db.execute(query)
    items = result.scalars().all()

    return paginated_response(
        [StockMovementOut.model_validate(m) for m in items], total, pagination
    )


@router.get("/serial/{serial_number}")
async def get_movements_by_serial(
    serial_number: str,
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(require_admin()),
):
    """
    Full movement history for one specific stock unit.
    Shows the complete lifecycle: STOCK_IN → RESERVED → SOLD etc.
    """
    stock = await db.get(Stock, serial_number)
    if not stock:
        raise NotFoundException("Stock", serial_number)

    result = await db.execute(
        select(StockMovement)
        .where(StockMovement.serial_number == serial_number)
        .order_by(StockMovement.datetime.asc())
    )
    movements = result.scalars().all()

    # Get product name for context
    inv = await db.get(Inventory, stock.sku)

    return {
        "serial_number": serial_number,
        "sku": stock.sku,
        "product_name": inv.product_name if inv else None,
        "current_status": stock.status,
        "movements": [StockMovementOut.model_validate(m) for m in movements],
    }


@router.get("/summary")
async def get_movement_summary(
    from_date: Optional[date] = Query(None),
    to_date: Optional[date] = Query(None),
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(require_admin()),
):
    """
    Summary count of each action type in a date range.
    Useful for a quick overview on the audit dashboard.
    """
    query = select(
        StockMovement.action_type,
        func.count(StockMovement.movement_id).label("count")
    )

    if from_date:
        query = query.where(
            StockMovement.datetime >= datetime.combine(from_date, datetime.min.time())
        )
    if to_date:
        query = query.where(
            StockMovement.datetime <= datetime.combine(to_date, datetime.max.time())
        )

    query = query.group_by(StockMovement.action_type)
    result = await db.execute(query)
    rows = result.all()

    return {
        "period": {
            "from": str(from_date) if from_date else "all time",
            "to": str(to_date) if to_date else "all time",
        },
        "summary": [
            {"action_type": r.action_type, "count": r.count}
            for r in rows
        ]
    }
