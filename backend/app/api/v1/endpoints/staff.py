from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.session import get_db
from app.core.security import hash_password, require_admin
from app.core.exceptions import AppException
from app.models import Staff
from app.schemas import StaffCreate, StaffOut

router = APIRouter(prefix="/staff", tags=["Staff"])


@router.post("/register", response_model=StaffOut, status_code=201)
async def register_staff(
    payload: StaffCreate,
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(require_admin()),
):
    """Only administrators can register new staff accounts."""
    existing = await db.execute(select(Staff).where(Staff.email == payload.email))
    if existing.scalar_one_or_none():
        raise AppException(409, "EMAIL_ALREADY_EXISTS", f"Staff with email '{payload.email}' already exists")

    staff = Staff(
        name=payload.name,
        email=payload.email,
        password=hash_password(payload.password),
        role=payload.role,
    )
    db.add(staff)
    await db.flush()
    return StaffOut.model_validate(staff)


@router.get("/me", response_model=StaffOut)
async def get_me(current_user: Staff = Depends(require_admin())):
    return StaffOut.model_validate(current_user)
