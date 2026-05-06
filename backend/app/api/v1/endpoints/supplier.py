from fastapi import APIRouter, Depends, Query, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional

from app.db.session import get_db
from app.core.security import get_current_user, require_admin
from app.core.exceptions import NotFoundException
from app.core.pagination import get_pagination, paginated_response, PaginationParams
from app.models import Supplier, Media, Staff
from app.schemas import SupplierCreate, SupplierUpdate, SupplierOut

router = APIRouter(prefix="/supplier", tags=["Supplier"])


@router.get("")
async def list_suppliers(
    search: Optional[str] = Query(None, description="Search by name or person in charge"),
    pagination: PaginationParams = Depends(get_pagination),
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(get_current_user),
):
    query = select(Supplier)
    if search:
        query = query.where(
            Supplier.supplier_name.ilike(f"%{search}%")
            | Supplier.person_in_charge.ilike(f"%{search}%")
        )
    total = await db.scalar(select(func.count()).select_from(query.subquery()))
    query = query.offset((pagination.page - 1) * pagination.limit).limit(pagination.limit)
    result = await db.execute(query)
    items = result.scalars().all()
    return paginated_response([SupplierOut.model_validate(s) for s in items], total, pagination)


@router.post("", response_model=SupplierOut, status_code=201)
async def create_supplier(
    payload: SupplierCreate,
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(require_admin()),
):
    supplier = Supplier(**payload.model_dump())
    db.add(supplier)
    await db.flush()
    return SupplierOut.model_validate(supplier)


@router.get("/{supplier_id}", response_model=SupplierOut)
async def get_supplier(
    supplier_id: int,
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(get_current_user),
):
    supplier = await db.get(Supplier, supplier_id)
    if not supplier:
        raise NotFoundException("Supplier", str(supplier_id))
    return SupplierOut.model_validate(supplier)


@router.put("/{supplier_id}", response_model=SupplierOut)
async def update_supplier(
    supplier_id: int,
    payload: SupplierUpdate,
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(require_admin()),
):
    supplier = await db.get(Supplier, supplier_id)
    if not supplier:
        raise NotFoundException("Supplier", str(supplier_id))
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(supplier, field, value)
    db.add(supplier)
    return SupplierOut.model_validate(supplier)


@router.delete("/{supplier_id}", status_code=204)
async def delete_supplier(
    supplier_id: int,
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(require_admin()),
):
    supplier = await db.get(Supplier, supplier_id)
    if not supplier:
        raise NotFoundException("Supplier", str(supplier_id))
    await db.delete(supplier)


@router.post("/{supplier_id}/image", status_code=200)
async def upload_supplier_image(
    supplier_id: int,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(require_admin()),
):
    """Upload supplier logo/image. Store via S3/local and record in Media table."""
    supplier = await db.get(Supplier, supplier_id)
    if not supplier:
        raise NotFoundException("Supplier", str(supplier_id))

    # In production: upload to S3, get the URL back
    file_path = f"media/supplier/{supplier_id}/{file.filename}"

    media = Media(
        entity_type="Supplier",
        entity_id=str(supplier_id),
        file_name=file.filename,
        file_path=file_path,
        file_type=file.content_type,
    )
    db.add(media)
    await db.flush()
    return {"media_id": media.media_id, "file_path": file_path}
