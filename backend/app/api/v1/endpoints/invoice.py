from fastapi import APIRouter, Depends, Query, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional

from app.db.session import get_db
from app.core.security import get_current_user, require_admin
from app.core.exceptions import NotFoundException
from app.core.pagination import get_pagination, paginated_response, PaginationParams
from app.models import Invoice, Stock, Inventory, Media, Supplier, Staff
from app.schemas import InvoiceCreate, InvoiceUpdate, InvoiceOut, InvoiceScanRequest, InvoiceScanResponse

router = APIRouter(prefix="/invoice", tags=["Invoice"])


@router.get("")
async def list_invoices(
    supplier_id: Optional[int] = Query(None),
    pagination: PaginationParams = Depends(get_pagination),
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(get_current_user),
):
    query = select(Invoice)
    if supplier_id:
        query = query.where(Invoice.supplier_id == supplier_id)
    total = await db.scalar(select(func.count()).select_from(query.subquery()))
    query = query.offset((pagination.page - 1) * pagination.limit).limit(pagination.limit)
    result = await db.execute(query)
    items = result.scalars().all()
    return paginated_response([InvoiceOut.model_validate(i) for i in items], total, pagination)


@router.post("", response_model=InvoiceOut, status_code=201)
async def create_invoice(
    payload: InvoiceCreate,
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(require_admin()),
):
    supplier = await db.get(Supplier, payload.supplier_id)
    if not supplier:
        raise NotFoundException("Supplier", str(payload.supplier_id))

    invoice = Invoice(
        ref_no=payload.ref_no,
        supplier_id=payload.supplier_id,
        invoice_date=payload.invoice_date,
        amount=payload.amount,
        remark=payload.remark,
    )
    db.add(invoice)
    await db.flush()
    return InvoiceOut.model_validate(invoice)


@router.get("/{ref_no}", response_model=InvoiceOut)
async def get_invoice(
    ref_no: str,
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(get_current_user),
):
    invoice = await db.get(Invoice, ref_no)
    if not invoice:
        raise NotFoundException("Invoice", ref_no)
    return InvoiceOut.model_validate(invoice)


@router.put("/{ref_no}", response_model=InvoiceOut)
async def update_invoice(
    ref_no: str,
    payload: InvoiceUpdate,
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(require_admin()),
):
    invoice = await db.get(Invoice, ref_no)
    if not invoice:
        raise NotFoundException("Invoice", ref_no)
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(invoice, field, value)
    db.add(invoice)
    return InvoiceOut.model_validate(invoice)


@router.delete("/{ref_no}", status_code=204)
async def delete_invoice(
    ref_no: str,
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(require_admin()),
):
    invoice = await db.get(Invoice, ref_no)
    if not invoice:
        raise NotFoundException("Invoice", ref_no)
    await db.delete(invoice)


@router.get("/{ref_no}/items")
async def get_invoice_items(
    ref_no: str,
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(get_current_user),
):
    """List all stock items (via Load) linked to this invoice."""
    from app.models import Load
    from app.schemas import LoadOut

    invoice = await db.get(Invoice, ref_no)
    if not invoice:
        raise NotFoundException("Invoice", ref_no)

    result = await db.execute(select(Load).where(Load.ref_no == ref_no))
    loads = result.scalars().all()
    return {
        "ref_no": ref_no,
        "items": [LoadOut.model_validate(l) for l in loads],
    }


@router.post("/scan", response_model=InvoiceScanResponse)
async def scan_serial(
    payload: InvoiceScanRequest,
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(get_current_user),
):
    """
    Barcode/serial scan — checks if serial number already exists in Stock
    and suggests the SKU. Use this before creating a Load record.
    """
    stock = await db.get(Stock, payload.serial_number)
    if stock:
        inv = await db.get(Inventory, stock.sku) if stock.sku else None
        return InvoiceScanResponse(
            serial_number=payload.serial_number,
            ref_no=payload.ref_no,
            suggested_sku=stock.sku,
            product_name=inv.product_name if inv else None,
            status="FOUND",
        )
    return InvoiceScanResponse(
        serial_number=payload.serial_number,
        ref_no=payload.ref_no,
        suggested_sku=None,
        product_name=None,
        status="NEW",
    )


@router.post("/{ref_no}/file", status_code=200)
async def upload_invoice_file(
    ref_no: str,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    _: Staff = Depends(require_admin()),
):
    """Attach a PDF/image file to an invoice (stored in Media table)."""
    invoice = await db.get(Invoice, ref_no)
    if not invoice:
        raise NotFoundException("Invoice", ref_no)

    file_path = f"media/invoice/{ref_no}/{file.filename}"
    media = Media(
        entity_type="Invoice",
        entity_id=ref_no,
        file_name=file.filename,
        file_path=file_path,
        file_type=file.content_type,
    )
    db.add(media)
    await db.flush()
    return {"media_id": media.media_id, "file_path": file_path}
