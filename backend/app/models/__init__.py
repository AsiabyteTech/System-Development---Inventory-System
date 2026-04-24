"""
ORM models — column names match the RDS database exactly (PascalCase).
Python attributes use snake_case; the actual DB column name is passed
as the first positional argument to mapped_column() where they differ.
"""
from datetime import datetime
from decimal import Decimal
from typing import Optional, List

from sqlalchemy import (
    String, Integer, Numeric, DateTime, Text, ForeignKey,
    Enum as SAEnum, func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


# ── Staff ─────────────────────────────────────────────────────────────────────
class Staff(Base):
    __tablename__ = "Staff"

    staff_id:   Mapped[int] = mapped_column("StaffID",       Integer, primary_key=True, autoincrement=True)
    name:       Mapped[str] = mapped_column("StaffName",     String(100), nullable=False)
    email:      Mapped[str] = mapped_column("Email",         String(150), unique=True, nullable=False)
    password:   Mapped[str] = mapped_column("UserPassword",  String(255), nullable=False)
    role:       Mapped[str] = mapped_column("StaffRole",     String(50),  nullable=False)

    inventories: Mapped[List["Inventory"]] = relationship(back_populates="staff")


# ── Customer ──────────────────────────────────────────────────────────────────
class Customer(Base):
    __tablename__ = "Customer"

    customer_id:   Mapped[int]           = mapped_column("CustomerID",   Integer, primary_key=True, autoincrement=True)
    customer_name: Mapped[str]           = mapped_column("CustomerName", String(150), nullable=False)
    phone_number:  Mapped[Optional[str]] = mapped_column("PhoneNumber",  String(30))
    email:         Mapped[Optional[str]] = mapped_column("Email",        String(150))
    address:       Mapped[Optional[str]] = mapped_column("Address",      Text)

    orders: Mapped[List["Order"]] = relationship(back_populates="customer")


# ── Order ─────────────────────────────────────────────────────────────────────
class Order(Base):
    __tablename__ = "Order"

    tracking_number: Mapped[str]               = mapped_column("TrackingNumber", String(100), primary_key=True)
    sales_platform:  Mapped[Optional[str]]     = mapped_column("SalesPlatform",  String(50))
    purchase_date:   Mapped[Optional[datetime]]= mapped_column("PurchaseDate",   DateTime)
    status:          Mapped[str]               = mapped_column("Stat",           String(50), nullable=False, default="PENDING")
    total:           Mapped[Optional[Decimal]] = mapped_column("Total",          Numeric(12, 2))
    customer_id:     Mapped[int]               = mapped_column("CustomerID",     ForeignKey("Customer.CustomerID"), nullable=False)

    customer: Mapped["Customer"]    = relationship(back_populates="orders")
    checks:   Mapped[List["Check"]] = relationship(back_populates="order")


# ── Inventory (Product / SKU) ─────────────────────────────────────────────────
class Inventory(Base):
    __tablename__ = "Inventory"

    sku:                   Mapped[str]               = mapped_column("SKU",                 String(50),  primary_key=True)
    product_name:          Mapped[str]               = mapped_column("ProductName",         String(150), nullable=False)
    product_type:          Mapped[Optional[str]]     = mapped_column("ProductType",         String(100))
    product_detail:        Mapped[Optional[str]]     = mapped_column("ProductDetail",       Text)
    initial_vendor_price:  Mapped[Optional[Decimal]] = mapped_column("InitialVendorPrice",  Numeric(12, 2))
    initial_selling_price: Mapped[Optional[Decimal]] = mapped_column("InitialSellingPrice", Numeric(12, 2))
    margin:                Mapped[Optional[Decimal]] = mapped_column("Margin",              Numeric(5, 2))
    status:                Mapped[str]               = mapped_column("Stat",                String(50), nullable=False, default="ACTIVE")
    staff_id:              Mapped[Optional[int]]     = mapped_column("StaffID",             ForeignKey("Staff.StaffID"))

    # Cached costing fields — see note below if these don't exist yet in your DB
    quantity_on_hand:    Mapped[int]               = mapped_column("QuantityOnHand",    Integer,        nullable=False, default=0)
    reserved_quantity:   Mapped[int]               = mapped_column("ReservedQuantity",  Integer,        nullable=False, default=0)
    current_avg_cost:    Mapped[Optional[Decimal]] = mapped_column("CurrentAvgCost",    Numeric(12, 4), nullable=True)
    current_stock_value: Mapped[Optional[Decimal]] = mapped_column("CurrentStockValue", Numeric(14, 4), nullable=True)

    staff:  Mapped[Optional["Staff"]] = relationship(back_populates="inventories")
    stocks: Mapped[List["Stock"]]     = relationship(back_populates="inventory")


# ── Supplier ──────────────────────────────────────────────────────────────────
class Supplier(Base):
    __tablename__ = "Supplier"

    supplier_id:           Mapped[int]           = mapped_column("SupplierID",          Integer, primary_key=True, autoincrement=True)
    supplier_name:         Mapped[str]           = mapped_column("SupplierName",        String(150), nullable=False)
    supplier_phone_number: Mapped[Optional[str]] = mapped_column("SupplierPhoneNumber", String(30))
    supplier_address:      Mapped[Optional[str]] = mapped_column("SupplierAddress",     Text)
    person_in_charge:      Mapped[Optional[str]] = mapped_column("PersonInCharge",      String(100))

    invoices: Mapped[List["Invoice"]] = relationship(back_populates="supplier")


# ── Invoice ───────────────────────────────────────────────────────────────────
class Invoice(Base):
    __tablename__ = "Invoice"

    ref_no:       Mapped[str]               = mapped_column("RefNo",       String(100), primary_key=True)
    invoice_date: Mapped[Optional[datetime]]= mapped_column("InvoiceDate", DateTime)
    amount:       Mapped[Optional[Decimal]] = mapped_column("Amount",      Numeric(14, 2))
    remark:       Mapped[Optional[str]]     = mapped_column("Remark",      Text)
    supplier_id:  Mapped[int]               = mapped_column("SupplierID",  ForeignKey("Supplier.SupplierID"), nullable=False)

    supplier: Mapped["Supplier"]   = relationship(back_populates="invoices")
    loads:    Mapped[List["Load"]] = relationship(back_populates="invoice")


# ── Stock ─────────────────────────────────────────────────────────────────────
class Stock(Base):
    __tablename__ = "Stock"

    serial_number: Mapped[str]               = mapped_column("SerialNumber", String(100), primary_key=True)
    status:        Mapped[str]               = mapped_column("Stat",         String(50),  nullable=False, default="AVAILABLE")
    stock_out:     Mapped[Optional[datetime]]= mapped_column("StockOut",     DateTime)
    remark:        Mapped[Optional[str]]     = mapped_column("Remark",       Text)
    sku:           Mapped[str]               = mapped_column("SKU",          ForeignKey("Inventory.SKU"), nullable=False)
    package_id:    Mapped[Optional[int]]     = mapped_column("PackageID",    ForeignKey("Package.PackageID"))
    promo_id:      Mapped[Optional[int]]     = mapped_column("PromoID",      ForeignKey("Promo.PromoID"))

    inventory: Mapped["Inventory"]           = relationship(back_populates="stocks")
    package:   Mapped[Optional["Package"]]   = relationship(back_populates="stocks")
    promo:     Mapped[Optional["Promo"]]     = relationship(back_populates="stocks")
    loads:     Mapped[List["Load"]]          = relationship(back_populates="stock")
    checks:    Mapped[List["Check"]]         = relationship(back_populates="stock")
    movements: Mapped[List["StockMovement"]] = relationship(back_populates="stock")


# ── Load (Stock ↔ Invoice junction) ──────────────────────────────────────────
class Load(Base):
    __tablename__ = "Load"

    serial_number:   Mapped[str]               = mapped_column("SerialNumber",   ForeignKey("Stock.SerialNumber"), primary_key=True)
    ref_no:          Mapped[str]               = mapped_column("RefNo",          ForeignKey("Invoice.RefNo"),      primary_key=True)
    purchase_cost:   Mapped[Optional[Decimal]] = mapped_column("PurchaseCost",   Numeric(12, 2))
    additional_cost: Mapped[Optional[Decimal]] = mapped_column("AdditionalCost", Numeric(12, 2))
    total_cost:      Mapped[Optional[Decimal]] = mapped_column("TotalCost",      Numeric(12, 2))

    stock:   Mapped["Stock"]   = relationship(back_populates="loads")
    invoice: Mapped["Invoice"] = relationship(back_populates="loads")


# ── Check (Stock ↔ Order junction) ───────────────────────────────────────────
class Check(Base):
    __tablename__ = "Check"

    serial_number:   Mapped[str] = mapped_column("SerialNumber",   ForeignKey("Stock.SerialNumber"),   primary_key=True)
    tracking_number: Mapped[str] = mapped_column("TrackingNumber", ForeignKey("Order.TrackingNumber"), primary_key=True)

    stock: Mapped["Stock"] = relationship(back_populates="checks")
    order: Mapped["Order"] = relationship(back_populates="checks")


# ── Package ───────────────────────────────────────────────────────────────────
class Package(Base):
    __tablename__ = "Package"

    package_id:   Mapped[int]               = mapped_column("PackageID",   Integer, primary_key=True, autoincrement=True)
    package_name: Mapped[str]               = mapped_column("PackageName", String(150), nullable=False)
    dateline:     Mapped[Optional[datetime]]= mapped_column("Dateline",    DateTime)
    price:        Mapped[Optional[Decimal]] = mapped_column("Price",       Numeric(12, 2))
    remark:       Mapped[Optional[str]]     = mapped_column("Remark",      Text)

    stocks: Mapped[List["Stock"]] = relationship(back_populates="package")


# ── Promo ─────────────────────────────────────────────────────────────────────
class Promo(Base):
    __tablename__ = "Promo"

    promo_id:   Mapped[int]               = mapped_column("PromoID",   Integer, primary_key=True, autoincrement=True)
    promo_name: Mapped[str]               = mapped_column("PromoName", String(150), nullable=False)
    dateline:   Mapped[Optional[datetime]]= mapped_column("Dateline",  DateTime)
    price:      Mapped[Optional[Decimal]] = mapped_column("Price",     Numeric(12, 2))
    reduction:  Mapped[Optional[Decimal]] = mapped_column("Reduction", Numeric(5, 2))
    remark:     Mapped[Optional[str]]     = mapped_column("Remark",    Text)

    stocks: Mapped[List["Stock"]] = relationship(back_populates="promo")


# ── Media ─────────────────────────────────────────────────────────────────────
class Media(Base):
    __tablename__ = "Media"

    media_id:    Mapped[int]           = mapped_column("MediaID",    Integer, primary_key=True, autoincrement=True)
    entity_type: Mapped[str]           = mapped_column("EntityType", String(50),  nullable=False)
    entity_id:   Mapped[str]           = mapped_column("EntityId",   String(100), nullable=False)
    file_name:   Mapped[str]           = mapped_column("FileName",   String(255), nullable=False)
    file_path:   Mapped[str]           = mapped_column("FilePath",   String(500), nullable=False)
    file_type:   Mapped[Optional[str]] = mapped_column("FileType",   String(50))
    upload_date: Mapped[datetime]      = mapped_column("UploadDate", DateTime, server_default=func.now())


# ── StockMovement (audit trail) ───────────────────────────────────────────────
class StockMovement(Base):
    __tablename__ = "StockMovement"

    movement_id:   Mapped[int]           = mapped_column("MovementID",   Integer, primary_key=True, autoincrement=True)
    serial_number: Mapped[str]           = mapped_column("SerialNumber", ForeignKey("Stock.SerialNumber"), nullable=False)
    action_type:   Mapped[str]           = mapped_column("ActionType",   String(50), nullable=False)
    ref_id:        Mapped[Optional[str]] = mapped_column("RefID",        String(100))
    datetime:      Mapped[datetime]      = mapped_column("Datetime",     DateTime, server_default=func.now())

    stock: Mapped["Stock"] = relationship(back_populates="movements")
