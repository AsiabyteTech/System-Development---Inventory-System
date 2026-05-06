from fastapi import Query
from fastapi.responses import JSONResponse
from typing import Any, List, Optional
from dataclasses import dataclass
from app.core.config import settings


@dataclass
class PaginationParams:
    page: int
    limit: int
    sort: Optional[str]


def get_pagination(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(
        settings.DEFAULT_PAGE_SIZE,
        ge=1,
        le=settings.MAX_PAGE_SIZE,
        description="Items per page",
    ),
    sort: Optional[str] = Query(None, description="Sort field, prefix with - for desc (e.g. -created_at)"),
) -> PaginationParams:
    return PaginationParams(page=page, limit=limit, sort=sort)


def paginated_response(data: List[Any], total: int, params: PaginationParams) -> dict:
    return {
        "data": data,
        "pagination": {
            "total": total,
            "page": params.page,
            "limit": params.limit,
            "total_pages": (total + params.limit - 1) // params.limit,
        },
    }
