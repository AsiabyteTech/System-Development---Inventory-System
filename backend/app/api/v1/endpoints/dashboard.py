from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from decimal import Decimal
from datetime import datetime, date
from typing import Optional

from app.db.session import get_db
from app.core.security import get_current_user
from app.core.config import settings
from app.models import Inventory, Order, Stock, Load, Staff
from app.schemas import (
    DashboardMetrics, LowStockItem,
    PnLResponse, PnLSummary, PnLProductBreakdown, CostFlowSummary,
)

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])
reports_router = APIRouter(prefix="/reports", tags=["Reports"])

LOW_STOCK_THRESHOLD = 5  # items with qty <= this are "LOW"


@router.get("/metrics", response_model=DashboardMetrics)
async def get_dashboard_metrics(
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(get_current_user),
):
    total_orders = await db.scalar(select(func.count(Order.tracking_number))) or 0
    total_products = await db.scalar(select(func.count(Inventory.sku))) or 0

    low_stock = await db.scalar(
        select(func.count(Inventory.sku)).where(Inventory.quantity_on_hand <= LOW_STOCK_THRESHOLD)
    ) or 0

    inv_value = await db.scalar(
        select(func.sum(Inventory.current_stock_value))
    ) or Decimal(0)

    return DashboardMetrics(
        total_orders=total_orders,
        low_stock_items=low_stock,
        total_inventory_value=inv_value,
        total_products=total_products,
    )


@router.get("/order-volume")
async def get_order_volume(
    sales_platform: Optional[str] = Query(None),
    month: Optional[int] = Query(None, ge=1, le=12),
    year: Optional[int] = Query(None),
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(get_current_user),
):
    """
    Returns order count grouped by product (SKU).
    Filters by sales_platform, month, year.
    """
    from app.models import Check

    query = (
        select(Inventory.sku, Inventory.product_name, func.count(Check.tracking_number).label("total_orders"))
        .join(Stock, Stock.sku == Inventory.sku)
        .join(Check, Check.serial_number == Stock.serial_number)
        .join(Order, Order.tracking_number == Check.tracking_number)
    )
    if sales_platform:
        query = query.where(Order.sales_platform == sales_platform)
    if month:
        query = query.where(func.month(Order.purchase_date) == month)
    if year:
        query = query.where(func.year(Order.purchase_date) == year)

    query = query.group_by(Inventory.sku, Inventory.product_name)
    result = await db.execute(query)
    rows = result.all()

    return {
        "data": [
            {"sku": r.sku, "product_name": r.product_name, "total_orders": r.total_orders}
            for r in rows
        ]
    }


@router.get("/inventory-value")
async def get_inventory_value_chart(
    sku: Optional[str] = Query(None),
    month: Optional[int] = Query(None, ge=1, le=12),
    year: Optional[int] = Query(None),
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(get_current_user),
):
    """Line chart data: inventory value per product."""
    query = select(Inventory.sku, Inventory.product_name, Inventory.current_stock_value)
    if sku:
        query = query.where(Inventory.sku == sku)
    result = await db.execute(query)
    rows = result.all()

    return {
        "data": [
            {"sku": r.sku, "product_name": r.product_name, "stock_value": r.current_stock_value or 0}
            for r in rows
        ]
    }


@router.get("/low-stock")
async def get_low_stock(
    status_filter: Optional[str] = Query(None, description="GOOD | LOW | OUT"),
    sku: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(get_current_user),
):
    query = select(Inventory)
    if sku:
        query = query.where(Inventory.sku == sku)
    result = await db.execute(query)
    items = result.scalars().all()

    def stock_status(qty: int) -> str:
        if qty == 0:
            return "OUT"
        if qty <= LOW_STOCK_THRESHOLD:
            return "LOW"
        return "GOOD"

    data = [
        LowStockItem(
            sku=inv.sku,
            product_name=inv.product_name,
            quantity_on_hand=inv.quantity_on_hand,
            status=stock_status(inv.quantity_on_hand),
        )
        for inv in items
    ]

    if status_filter:
        data = [d for d in data if d.status == status_filter]

    return {"data": data}


# ── P&L Report ────────────────────────────────────────────────────────────────
@reports_router.get("/pnl", response_model=PnLResponse)
async def get_pnl_report(
    from_date: date = Query(...),
    to_date: date = Query(...),
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(get_current_user),
):
    """
    Weighted-Average cost P&L report.

    Revenue  = sum of (Order.total) for fulfilled orders in range
    COGS     = sum of (units_sold × avg_cost_at_time_of_sale)
    Gross P  = Revenue - COGS
    """
    from app.models import Check

    # Revenue: fulfilled orders in date range
    revenue_result = await db.execute(
        select(func.sum(Order.total)).where(
            and_(
                Order.status == "FULFILLED",
                Order.purchase_date >= datetime.combine(from_date, datetime.min.time()),
                Order.purchase_date <= datetime.combine(to_date, datetime.max.time()),
            )
        )
    )
    total_revenue = revenue_result.scalar() or Decimal(0)

    # Per-product breakdown using current avg cost as proxy
    inv_result = await db.execute(select(Inventory))
    inventories = inv_result.scalars().all()

    breakdown = []
    total_cogs = Decimal(0)

    for inv in inventories:
        # Count sold units in period
        sold_count = await db.scalar(
            select(func.count(Stock.serial_number))
            .join(Check, Check.serial_number == Stock.serial_number)
            .join(Order, Order.tracking_number == Check.tracking_number)
            .where(
                and_(
                    Stock.sku == inv.sku,
                    Stock.status == "SOLD",
                    Order.purchase_date >= datetime.combine(from_date, datetime.min.time()),
                    Order.purchase_date <= datetime.combine(to_date, datetime.max.time()),
                )
            )
        ) or 0

        if sold_count == 0:
            continue

        avg_cost = inv.current_avg_cost or Decimal(0)
        cogs = avg_cost * sold_count
        rev = (inv.initial_selling_price or Decimal(0)) * sold_count
        gp = rev - cogs
        margin = float(gp / rev * 100) if rev else 0.0

        total_cogs += cogs
        breakdown.append(
            PnLProductBreakdown(
                sku=inv.sku,
                product_name=inv.product_name,
                units_sold=sold_count,
                revenue=rev,
                avg_cost=avg_cost,
                cogs=cogs,
                gross_profit=gp,
                margin=round(margin, 2),
            )
        )

    gross_profit = total_revenue - total_cogs
    gross_margin = float(gross_profit / total_revenue * 100) if total_revenue else 0.0

    # Cost flow
    purchases_value = await db.scalar(select(func.sum(Load.purchase_cost))) or Decimal(0)
    ending_inv_value = await db.scalar(select(func.sum(Inventory.current_stock_value))) or Decimal(0)

    return PnLResponse(
        period={"from": str(from_date), "to": str(to_date)},
        costing_method=settings.COSTING_METHOD,
        summary=PnLSummary(
            total_revenue=total_revenue,
            total_cogs=total_cogs,
            gross_profit=gross_profit,
            gross_margin_percentage=round(gross_margin, 2),
            net_income=gross_profit,  # extend with operating expenses when available
        ),
        breakdown_by_product=breakdown,
        cost_flow_summary=CostFlowSummary(
            beginning_inventory_value=Decimal(0),  # requires period-start snapshot
            purchases_value=purchases_value,
            ending_inventory_value=ending_inv_value,
            calculated_cogs=total_cogs,
        ),
    )


@reports_router.get("/order-volume")
async def report_order_volume(
    month: Optional[int] = Query(None),
    year: Optional[int] = Query(None),
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(get_current_user),
):
    query = select(
        func.year(Order.purchase_date).label("year"),
        func.month(Order.purchase_date).label("month"),
        func.count(Order.tracking_number).label("total"),
    ).group_by("year", "month").order_by("year", "month")

    if year:
        query = query.where(func.year(Order.purchase_date) == year)
    if month:
        query = query.where(func.month(Order.purchase_date) == month)

    result = await db.execute(query)
    return {"data": [{"year": r.year, "month": r.month, "total": r.total} for r in result.all()]}


@reports_router.get("/inventory-value")
async def report_inventory_value(
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(get_current_user),
):
    result = await db.execute(
        select(Inventory.sku, Inventory.product_name, Inventory.current_stock_value, Inventory.quantity_on_hand)
    )
    return {
        "data": [
            {
                "sku": r.sku,
                "product_name": r.product_name,
                "stock_value": r.current_stock_value or 0,
                "quantity": r.quantity_on_hand,
            }
            for r in result.all()
        ]
    }
