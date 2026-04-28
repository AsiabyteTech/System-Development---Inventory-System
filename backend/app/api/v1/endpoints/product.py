from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional

from app.db.session import get_db
from app.core.security import get_current_user, require_admin
from app.core.exceptions import NotFoundException, SKUAlreadyExistsException
from app.core.pagination import get_pagination, paginated_response, PaginationParams
from app.models import Inventory, Staff
from app.schemas import InventoryCreate, InventoryUpdate, InventoryOut

router = APIRouter(prefix="/product", tags=["Product / Inventory"])


@router.get("")
async def list_products(
    status: Optional[str] = Query(None),
    product_type: Optional[str] = Query(None),
    pagination: PaginationParams = Depends(get_pagination),
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(get_current_user),
):
    query = select(Inventory)
    if status:
        query = query.where(Inventory.status == status)
    if product_type:
        query = query.where(Inventory.product_type == product_type)

    total = await db.scalar(select(func.count()).select_from(query.subquery()))
    query = query.offset((pagination.page - 1) * pagination.limit).limit(pagination.limit)
    result = await db.execute(query)
    items = result.scalars().all()

    return paginated_response([InventoryOut.model_validate(i) for i in items], total, pagination)


@router.post("", response_model=InventoryOut, status_code=201)
async def create_product(
    payload: InventoryCreate,
    db: AsyncSession = Depends(get_db),
    current_user: Staff = Depends(require_admin()),
):
    existing = await db.get(Inventory, payload.sku)
    if existing:
        raise SKUAlreadyExistsException(payload.sku)

    product = Inventory(**payload.model_dump(), staff_id=current_user.staff_id)
    db.add(product)
    await db.flush()
    return InventoryOut.model_validate(product)


@router.get("/{sku}", response_model=InventoryOut)
async def get_product(
    sku: str,
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(get_current_user),
):
    product = await db.get(Inventory, sku)
    if not product:
        raise NotFoundException("Product", sku)
    return InventoryOut.model_validate(product)


@router.put("/{sku}", response_model=InventoryOut)
async def update_product(
    sku: str,
    payload: InventoryUpdate,
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(require_admin()),
):
    product = await db.get(Inventory, sku)
    if not product:
        raise NotFoundException("Product", sku)

    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(product, field, value)
    db.add(product)
    return InventoryOut.model_validate(product)


@router.delete("/{sku}", status_code=204)
async def delete_product(
    sku: str,
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(require_admin()),
):
    product = await db.get(Inventory, sku)
    if not product:
        raise NotFoundException("Product", sku)
    # Soft delete: set status INACTIVE rather than hard-delete to preserve history
    product.status = "INACTIVE"
    db.add(product)
