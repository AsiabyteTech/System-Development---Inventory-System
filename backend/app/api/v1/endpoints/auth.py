from fastapi import APIRouter, Depends, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional

from app.db.session import get_db
from app.core.security import (
    verify_password, hash_password,
    create_access_token, create_refresh_token, decode_token,
    get_current_user,
)
from app.core.exceptions import UnauthorizedException
from app.models import Staff
from app.schemas import LoginRequest, TokenResponse, RefreshRequest, RefreshResponse, ChangePasswordRequest, StaffOut
from app.core.config import settings

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/login", response_model=TokenResponse)
async def login(payload: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Staff).where(Staff.email == payload.email))
    user = result.scalar_one_or_none()
    if not user or not verify_password(payload.password, user.password):
        raise UnauthorizedException("Invalid email or password")

    token_data = {"sub": str(user.staff_id), "role": user.role}
    return {
        "access_token": create_access_token(token_data),
        "refresh_token": create_refresh_token(token_data),
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        "user": StaffOut.model_validate(user),
    }


@router.post("/refresh", response_model=RefreshResponse)
async def refresh(payload: RefreshRequest):
    data = decode_token(payload.refresh_token)
    if data.get("type") != "refresh":
        raise UnauthorizedException("Invalid token type")

    new_token = create_access_token({"sub": data["sub"], "role": data["role"]})
    return {"access_token": new_token, "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60}


@router.post("/logout", status_code=204)
async def logout(current_user: Staff = Depends(get_current_user)):
    # In production: blacklist the token in Redis
    # redis_client.setex(f"blacklist:{token}", ACCESS_TOKEN_EXPIRE_MINUTES * 60, "1")
    return


@router.post("/change-password", status_code=204)
async def change_password(
    payload: ChangePasswordRequest,
    current_user: Staff = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if not verify_password(payload.current_password, current_user.password):
        raise UnauthorizedException("Current password is incorrect")
    current_user.password = hash_password(payload.new_password)
    db.add(current_user)
