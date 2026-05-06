from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.exceptions import UnauthorizedException, ForbiddenException, TokenExpiredException
from app.db.session import get_db

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
bearer_scheme = HTTPBearer()

# ── Role permissions ─────────────────────────────────────────────────────────
PERMISSIONS = {
    "ADMINISTRATOR": {
        "view:*", "create:*", "update:*", "delete:*",
        "reports:generate", "staff:register",
    },
    "STAFF": {
        "view:invoice", "view:supplier", "view:product", "view:stock",
        "view:order", "view:customer", "reports:generate",
    },
}


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def create_access_token(data: dict) -> str:
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    payload["type"] = "access"
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def create_refresh_token(data: dict) -> str:
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    payload["type"] = "refresh"
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise TokenExpiredException()
    except JWTError:
        raise UnauthorizedException("Invalid token")


# ── FastAPI dependencies ─────────────────────────────────────────────────────
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: AsyncSession = Depends(get_db),
):
    payload = decode_token(credentials.credentials)
    if payload.get("type") != "access":
        raise UnauthorizedException("Invalid token type")

    from app.models import Staff
    from sqlalchemy import select

    result = await db.execute(select(Staff).where(Staff.staff_id == payload.get("sub")))
    user = result.scalar_one_or_none()
    if not user:
        raise UnauthorizedException("User not found")
    return user


def require_role(*roles: str):
    """Dependency factory: require user to have one of the given roles."""
    async def dependency(current_user=Depends(get_current_user)):
        if current_user.role not in roles:
            raise ForbiddenException()
        return current_user
    return dependency


def require_admin():
    return require_role("ADMINISTRATOR")
