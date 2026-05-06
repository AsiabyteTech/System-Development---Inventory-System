from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional

from app.db.session import get_db
from app.core.security import get_current_user, require_admin
from app.core.exceptions import NotFoundException
from app.core.pagination import get_pagination, paginated_response, PaginationParams
from app.models import Promo, Package, Staff
from app.schemas import PromoCreate, PromoUpdate, PromoOut, PackageCreate, PackageUpdate, PackageOut

promo_router = APIRouter(prefix="/promotion", tags=["Promotion"])
package_router = APIRouter(prefix="/package", tags=["Package"])


# ── Promotions ────────────────────────────────────────────────────────────────
@promo_router.get("")
async def list_promos(
    pagination: PaginationParams = Depends(get_pagination),
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(get_current_user),
):
    total = await db.scalar(select(func.count(Promo.promo_id)))
    result = await db.execute(
        select(Promo).offset((pagination.page - 1) * pagination.limit).limit(pagination.limit)
    )
    items = result.scalars().all()
    return paginated_response([PromoOut.model_validate(p) for p in items], total, pagination)


@promo_router.post("", response_model=PromoOut, status_code=201)
async def create_promo(
    payload: PromoCreate,
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(require_admin()),
):
    promo = Promo(**payload.model_dump())
    db.add(promo)
    await db.flush()
    return PromoOut.model_validate(promo)


@promo_router.get("/{promo_id}", response_model=PromoOut)
async def get_promo(
    promo_id: int,
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(get_current_user),
):
    promo = await db.get(Promo, promo_id)
    if not promo:
        raise NotFoundException("Promo", str(promo_id))
    return PromoOut.model_validate(promo)


@promo_router.put("/{promo_id}", response_model=PromoOut)
async def update_promo(
    promo_id: int,
    payload: PromoUpdate,
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(require_admin()),
):
    promo = await db.get(Promo, promo_id)
    if not promo:
        raise NotFoundException("Promo", str(promo_id))
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(promo, field, value)
    db.add(promo)
    return PromoOut.model_validate(promo)


@promo_router.delete("/{promo_id}", status_code=204)
async def delete_promo(
    promo_id: int,
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(require_admin()),
):
    promo = await db.get(Promo, promo_id)
    if not promo:
        raise NotFoundException("Promo", str(promo_id))
    await db.delete(promo)


# ── Packages ──────────────────────────────────────────────────────────────────
@package_router.get("")
async def list_packages(
    pagination: PaginationParams = Depends(get_pagination),
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(get_current_user),
):
    total = await db.scalar(select(func.count(Package.package_id)))
    result = await db.execute(
        select(Package).offset((pagination.page - 1) * pagination.limit).limit(pagination.limit)
    )
    items = result.scalars().all()
    return paginated_response([PackageOut.model_validate(p) for p in items], total, pagination)


@package_router.post("", response_model=PackageOut, status_code=201)
async def create_package(
    payload: PackageCreate,
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(require_admin()),
):
    pkg = Package(**payload.model_dump())
    db.add(pkg)
    await db.flush()
    return PackageOut.model_validate(pkg)


@package_router.get("/{package_id}", response_model=PackageOut)
async def get_package(
    package_id: int,
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(get_current_user),
):
    pkg = await db.get(Package, package_id)
    if not pkg:
        raise NotFoundException("Package", str(package_id))
    return PackageOut.model_validate(pkg)


@package_router.put("/{package_id}", response_model=PackageOut)
async def update_package(
    package_id: int,
    payload: PackageUpdate,
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(require_admin()),
):
    pkg = await db.get(Package, package_id)
    if not pkg:
        raise NotFoundException("Package", str(package_id))
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(pkg, field, value)
    db.add(pkg)
    return PackageOut.model_validate(pkg)


@package_router.get("/{package_id}/products")
async def get_package_products(
    package_id: int,
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(get_current_user),
):
    """Return all stock items (and their SKUs) grouped under this package."""
    from app.models import Stock
    from app.schemas import StockOut

    pkg = await db.get(Package, package_id)
    if not pkg:
        raise NotFoundException("Package", str(package_id))

    result = await db.execute(select(Stock).where(Stock.package_id == package_id))
    stocks = result.scalars().all()
    return {
        "package_id": package_id,
        "package_name": pkg.package_name,
        "stocks": [StockOut.model_validate(s) for s in stocks],
    }
