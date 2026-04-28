"""
Pydantic v2 schemas — request bodies & response shapes for all modules.
Matches the ERD exactly — Invoice, Stock, and Load are fully separate.
"""
from datetime import datetime
from decimal import Decimal
from typing import Optional, List, Any
from pydantic import BaseModel, EmailStr


# ── Shared ────────────────────────────────────────────────────────────────────
class PaginationMeta(BaseModel):
    total: int
    page: int
    limit: int
    total_pages: int


class PaginatedResponse(BaseModel):
    data: List[Any]
    pagination: PaginationMeta


# ── Auth ──────────────────────────────────────────────────────────────────────
class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    expires_in: int
    user: "StaffOut"


class RefreshRequest(BaseModel):
    refresh_token: str


class RefreshResponse(BaseModel):
    access_token: str
    expires_in: int


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


# ── Staff ─────────────────────────────────────────────────────────────────────
class StaffCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "STAFF"


class StaffOut(BaseModel):
    staff_id: int
    name: str
    email: str
    role: str

    model_config = {"from_attributes": True}


# ── Customer ──────────────────────────────────────────────────────────────────
class CustomerCreate(BaseModel):
    customer_name: str
    phone_number: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None


class CustomerUpdate(CustomerCreate):
    pass


class CustomerOut(CustomerCreate):
    customer_id: int
    model_config = {"from_attributes": True}


# ── Order ─────────────────────────────────────────────────────────────────────
class OrderCreate(BaseModel):
    tracking_number: str
    customer_id: int
    sales_platform: Optional[str] = None
    purchase_date: Optional[datetime] = None
    total: Optional[Decimal] = None


class OrderStatusUpdate(BaseModel):
    status: str


class OrderOut(BaseModel):
    tracking_number: str
    sales_platform: Optional[str]
    purchase_date: Optional[datetime]
    status: str
    total: Optional[Decimal]
    customer_id: int

    model_config = {"from_attributes": True}


# ── Inventory (Product / SKU) ─────────────────────────────────────────────────
class InventoryCreate(BaseModel):
    sku: str
    product_name: str
    product_type: Optional[str] = None
    product_detail: Optional[str] = None
    initial_vendor_price: Optional[Decimal] = None
    initial_selling_price: Optional[Decimal] = None
    margin: Optional[Decimal] = None
    status: str = "ACTIVE"


class InventoryUpdate(BaseModel):
    product_name: Optional[str] = None
    product_type: Optional[str] = None
    product_detail: Optional[str] = None
    initial_vendor_price: Optional[Decimal] = None
    initial_selling_price: Optional[Decimal] = None
    margin: Optional[Decimal] = None
    status: Optional[str] = None


class InventoryOut(InventoryCreate):
    quantity_on_hand: int
    reserved_quantity: int
    current_avg_cost: Optional[Decimal]
    current_stock_value: Optional[Decimal]

    model_config = {"from_attributes": True}


# ── Supplier ──────────────────────────────────────────────────────────────────
class SupplierCreate(BaseModel):
    supplier_name: str
    supplier_phone_number: Optional[str] = None
    supplier_address: Optional[str] = None
    person_in_charge: Optional[str] = None


class SupplierUpdate(SupplierCreate):
    pass


class SupplierOut(SupplierCreate):
    supplier_id: int
    model_config = {"from_attributes": True}


# ── Invoice ───────────────────────────────────────────────────────────────────
class InvoiceCreate(BaseModel):
    ref_no: str
    supplier_id: int
    invoice_date: Optional[datetime] = None
    amount: Optional[Decimal] = None
    remark: Optional[str] = None


class InvoiceUpdate(BaseModel):
    invoice_date: Optional[datetime] = None
    amount: Optional[Decimal] = None
    remark: Optional[str] = None


class InvoiceScanRequest(BaseModel):
    serial_number: str
    ref_no: str


class InvoiceScanResponse(BaseModel):
    serial_number: str
    ref_no: str
    suggested_sku: Optional[str]
    product_name: Optional[str]
    status: str  # FOUND | NEW


class InvoiceOut(BaseModel):
    ref_no: str
    supplier_id: int
    invoice_date: Optional[datetime]
    amount: Optional[Decimal]
    remark: Optional[str]

    model_config = {"from_attributes": True}


# ── Load (Stock ↔ Invoice junction) ──────────────────────────────────────────
class LoadCreate(BaseModel):
    serial_number: str
    ref_no: str
    purchase_cost: Optional[Decimal] = None
    additional_cost: Optional[Decimal] = None


class LoadOut(BaseModel):
    serial_number: str
    ref_no: str
    purchase_cost: Optional[Decimal]
    additional_cost: Optional[Decimal]
    total_cost: Optional[Decimal]

    model_config = {"from_attributes": True}


# ── Stock ─────────────────────────────────────────────────────────────────────
class StockCreate(BaseModel):
    serial_number: str
    sku: str
    remark: Optional[str] = None
    package_id: Optional[int] = None
    promo_id: Optional[int] = None


class StockUpdate(BaseModel):
    sku: Optional[str] = None
    remark: Optional[str] = None
    package_id: Optional[int] = None
    promo_id: Optional[int] = None


class StockOut(BaseModel):
    serial_number: str
    status: str
    stock_out: Optional[datetime]
    remark: Optional[str]
    sku: str
    package_id: Optional[int]
    promo_id: Optional[int]

    model_config = {"from_attributes": True}


class StockReserveRequest(BaseModel):
    tracking_number: str
    items: List[str]  # list of serial_numbers


class StockReserveResponse(BaseModel):
    tracking_number: str
    reserved: List[str]
    message: str


class StockReleaseRequest(BaseModel):
    tracking_number: str


class StockAdjustRequest(BaseModel):
    serial_number: str
    new_status: str
    remark: Optional[str] = None


class StockFulfillRequest(BaseModel):
    tracking_number: str


# ── Package ───────────────────────────────────────────────────────────────────
class PackageCreate(BaseModel):
    package_name: str
    dateline: Optional[datetime] = None
    price: Optional[Decimal] = None
    remark: Optional[str] = None


class PackageUpdate(PackageCreate):
    pass


class PackageOut(PackageCreate):
    package_id: int
    model_config = {"from_attributes": True}


# ── Promo ─────────────────────────────────────────────────────────────────────
class PromoCreate(BaseModel):
    promo_name: str
    dateline: Optional[datetime] = None
    price: Optional[Decimal] = None
    reduction: Optional[Decimal] = None
    remark: Optional[str] = None


class PromoUpdate(PromoCreate):
    pass


class PromoOut(PromoCreate):
    promo_id: int
    model_config = {"from_attributes": True}


# ── Dashboard ─────────────────────────────────────────────────────────────────
class DashboardMetrics(BaseModel):
    total_orders: int
    low_stock_items: int
    total_inventory_value: Decimal
    total_products: int


class LowStockItem(BaseModel):
    sku: str
    product_name: str
    quantity_on_hand: int
    status: str  # GOOD | LOW | OUT


# ── Reports / P&L ─────────────────────────────────────────────────────────────
class PnLSummary(BaseModel):
    total_revenue: Decimal
    total_cogs: Decimal
    gross_profit: Decimal
    gross_margin_percentage: float
    net_income: Optional[Decimal]


class PnLProductBreakdown(BaseModel):
    sku: str
    product_name: str
    units_sold: int
    revenue: Decimal
    avg_cost: Decimal
    cogs: Decimal
    gross_profit: Decimal
    margin: float


class CostFlowSummary(BaseModel):
    beginning_inventory_value: Decimal
    purchases_value: Decimal
    ending_inventory_value: Decimal
    calculated_cogs: Decimal


class PnLResponse(BaseModel):
    period: dict
    costing_method: str
    summary: PnLSummary
    breakdown_by_product: List[PnLProductBreakdown]
    cost_flow_summary: CostFlowSummary
