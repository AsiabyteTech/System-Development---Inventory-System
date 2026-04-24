# Inventory Management System — FastAPI Backend

## Project Structure

```
inventory_api/
├── app/
│   ├── main.py                  # FastAPI app, CORS, exception handlers
│   ├── api/v1/
│   │   ├── router.py            # Wires all endpoint routers
│   │   └── endpoints/
│   │       ├── auth.py          # Login / refresh / logout / change-password
│   │       ├── staff.py         # Register staff (admin-only)
│   │       ├── product.py       # Inventory / SKU CRUD
│   │       ├── stock.py         # Stock units + reserve / release / fulfill / adjust
│   │       ├── supplier.py      # Supplier CRUD + image upload
│   │       ├── invoice.py       # Invoice CRUD + scan + file upload
│   │       ├── order.py         # Order + Customer CRUD + fulfill / return
│   │       ├── promo_package.py # Promo + Package CRUD
│   │       └── dashboard.py     # Dashboard metrics + P&L reports
│   ├── core/
│   │   ├── config.py            # Pydantic settings (reads .env)
│   │   ├── security.py          # JWT, password hashing, RBAC dependencies
│   │   ├── exceptions.py        # Typed AppException subclasses with error codes
│   │   └── pagination.py        # Reusable pagination dependency + response helper
│   ├── db/
│   │   └── session.py           # Async SQLAlchemy engine + get_db dependency
│   ├── models/
│   │   └── __init__.py          # All ORM models (mirrors ERD exactly)
│   └── schemas/
│       └── __init__.py          # All Pydantic request/response schemas
├── alembic/
│   └── env.py                   # Async Alembic migration env
├── tests/
│   └── test_api.py              # Integration test suite
├── alembic.ini
├── requirements.txt
└── .env.example
```

---

## Quick Start

```bash
# 1. Clone and create virtualenv
python -m venv .venv && source .venv/bin/activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Configure environment
cp .env.example .env
# Edit .env with your RDS credentials and SECRET_KEY

# 4. Run migrations
alembic upgrade head

# 5. Start the server
uvicorn app.main:app --reload

# 6. Open Swagger docs
# http://localhost:8000/api/v1/docs
```

---

## API Endpoint Summary

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/v1/auth/login` | Public |
| POST | `/api/v1/auth/refresh` | Public |
| POST | `/api/v1/auth/logout` | Authenticated |
| POST | `/api/v1/auth/change-password` | Authenticated |

### Staff
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/v1/staff/register` | Admin only |
| GET | `/api/v1/staff/me` | Admin only |

### Product (Inventory / SKU)
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/v1/product` | All staff |
| POST | `/api/v1/product` | Admin only |
| GET | `/api/v1/product/{sku}` | All staff |
| PUT | `/api/v1/product/{sku}` | Admin only |
| DELETE | `/api/v1/product/{sku}` | Admin only (soft delete) |

### Stock
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/v1/stock` | All staff |
| GET | `/api/v1/stock/available` | All staff |
| GET | `/api/v1/stock/reserved` | All staff |
| GET | `/api/v1/stock/{serial_number}` | All staff |
| POST | `/api/v1/stock/reserve` | All staff |
| POST | `/api/v1/stock/release` | All staff |
| POST | `/api/v1/stock/fulfill` | All staff |
| POST | `/api/v1/stock/adjust` | Admin only |

### Supplier
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/v1/supplier` | All staff |
| POST | `/api/v1/supplier` | Admin only |
| GET | `/api/v1/supplier/{id}` | All staff |
| PUT | `/api/v1/supplier/{id}` | Admin only |
| DELETE | `/api/v1/supplier/{id}` | Admin only |
| POST | `/api/v1/supplier/{id}/image` | Admin only |

### Invoice
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/v1/invoice` | All staff |
| POST | `/api/v1/invoice` | Admin only |
| GET | `/api/v1/invoice/{ref_no}` | All staff |
| GET | `/api/v1/invoice/{ref_no}/items` | All staff |
| POST | `/api/v1/invoice/scan` | All staff |
| POST | `/api/v1/invoice/{ref_no}/file` | Admin only |

### Order & Customer
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/v1/order` | All staff |
| POST | `/api/v1/order` | All staff |
| GET | `/api/v1/order/track/{tracking}` | All staff |
| PUT | `/api/v1/order/{tracking}/status` | All staff |
| POST | `/api/v1/order/{tracking}/fulfill` | All staff |
| POST | `/api/v1/order/{tracking}/return` | All staff |
| GET/POST | `/api/v1/customer` | All staff |
| GET/PUT | `/api/v1/customer/{id}` | All staff |

### Promotions & Packages
| Method | Endpoint | Access |
|--------|----------|--------|
| GET/POST | `/api/v1/promotion` | GET: All, POST: Admin |
| GET/PUT/DELETE | `/api/v1/promotion/{id}` | GET: All, others: Admin |
| GET/POST | `/api/v1/package` | GET: All, POST: Admin |
| GET/PUT | `/api/v1/package/{id}` | GET: All, PUT: Admin |
| GET | `/api/v1/package/{id}/products` | All staff |

### Dashboard & Reports
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/v1/dashboard/metrics` | All staff |
| GET | `/api/v1/dashboard/order-volume` | All staff |
| GET | `/api/v1/dashboard/inventory-value` | All staff |
| GET | `/api/v1/dashboard/low-stock` | All staff |
| GET | `/api/v1/reports/pnl?from_date=&to_date=` | All staff |
| GET | `/api/v1/reports/order-volume` | All staff |
| GET | `/api/v1/reports/inventory-value` | All staff |

---

## Running Tests

```bash
pytest tests/ -v
```

Tests use an in-memory SQLite database — no RDS connection needed.

---

## Production Checklist

- [ ] Set a strong random `SECRET_KEY` in `.env`
- [ ] Enable Redis and replace in-memory idempotency dict with Redis store
- [ ] Enable Redis token blacklist in `auth.py` logout endpoint
- [ ] Configure S3 (or equivalent) for file uploads instead of local paths
- [ ] Set `echo=False` and configure connection pool size in `db/session.py`
- [ ] Add rate limiting middleware (e.g., `slowapi`)
- [ ] Enable HTTPS — never run JWT auth over plain HTTP
- [ ] Restrict `CORS_ORIGINS` to your actual frontend domain
- [ ] Set up Alembic autogenerate workflow for all schema changes
- [ ] Add structured logging (e.g., `structlog`) with request IDs
