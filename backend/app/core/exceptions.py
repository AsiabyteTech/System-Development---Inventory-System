from typing import Any, Dict, Optional


class AppException(Exception):
    def __init__(
        self,
        status_code: int,
        code: str,
        message: str,
        details: Optional[Dict[str, Any]] = None,
    ):
        self.status_code = status_code
        self.code = code
        self.message = message
        self.details = details or {}


# ── 400 Bad Request ──────────────────────────────────────────────────────────
class ValidationException(AppException):
    def __init__(self, message: str, details: Optional[Dict] = None):
        super().__init__(400, "VALIDATION_ERROR", message, details)


class DuplicateRequestException(AppException):
    def __init__(self, idempotency_key: str, existing_id: str):
        super().__init__(
            409,
            "DUPLICATE_REQUEST",
            f"Request with idempotency key '{idempotency_key}' already processed",
            {"existing_id": existing_id},
        )


# ── 404 Not Found ────────────────────────────────────────────────────────────
class NotFoundException(AppException):
    def __init__(self, resource: str, identifier: str):
        super().__init__(
            404,
            f"{resource.upper()}_NOT_FOUND",
            f"{resource} '{identifier}' not found",
        )


# ── Stock-specific ───────────────────────────────────────────────────────────
class InsufficientStockException(AppException):
    def __init__(self, sku: str, requested: int, available: int):
        super().__init__(
            409,
            "INSUFFICIENT_STOCK",
            f"Requested quantity {requested} exceeds available stock {available} for SKU '{sku}'",
            {"sku": sku, "requested": requested, "available": available},
        )


class SKUAlreadyExistsException(AppException):
    def __init__(self, sku: str):
        super().__init__(
            409,
            "SKU_ALREADY_EXISTS",
            f"A product with SKU '{sku}' already exists",
            {"sku": sku},
        )


# ── Auth ─────────────────────────────────────────────────────────────────────
class UnauthorizedException(AppException):
    def __init__(self, message: str = "Invalid credentials"):
        super().__init__(401, "UNAUTHORIZED", message)


class ForbiddenException(AppException):
    def __init__(self, message: str = "You do not have permission to perform this action"):
        super().__init__(403, "FORBIDDEN", message)


class TokenExpiredException(AppException):
    def __init__(self):
        super().__init__(401, "TOKEN_EXPIRED", "Access token has expired")
