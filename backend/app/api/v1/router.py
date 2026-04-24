from fastapi import APIRouter

from app.api.v1.endpoints.auth import router as auth_router
from app.api.v1.endpoints.staff import router as staff_router
from app.api.v1.endpoints.product import router as product_router
from app.api.v1.endpoints.stock import router as stock_router
from app.api.v1.endpoints.load import router as load_router
from app.api.v1.endpoints.supplier import router as supplier_router
from app.api.v1.endpoints.invoice import router as invoice_router
from app.api.v1.endpoints.order import order_router, customer_router
from app.api.v1.endpoints.promo_package import promo_router, package_router
from app.api.v1.endpoints.dashboard import router as dashboard_router, reports_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(staff_router)
api_router.include_router(product_router)
api_router.include_router(stock_router)
api_router.include_router(load_router)
api_router.include_router(supplier_router)
api_router.include_router(invoice_router)
api_router.include_router(order_router)
api_router.include_router(customer_router)
api_router.include_router(promo_router)
api_router.include_router(package_router)
api_router.include_router(dashboard_router)
api_router.include_router(reports_router)
