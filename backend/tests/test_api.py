"""
Integration tests using TestClient (sync) over the full app.
Run with: pytest tests/ -v
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

# Use an in-memory SQLite database for tests (swap aiomysql driver)
TEST_DATABASE_URL = "sqlite://"

from app.db.session import Base, get_db
from app.main import app
from app.core.security import hash_password
from app.models import Staff  # noqa — registers all models

# Sync engine for SQLite tests
engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function", autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
        db.commit()
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


def seed_admin():
    db = TestingSessionLocal()
    admin = Staff(
        name="Admin",
        email="admin@test.com",
        password=hash_password("adminpass"),
        role="ADMINISTRATOR",
    )
    db.add(admin)
    db.commit()
    db.close()


def get_token(email="admin@test.com", password="adminpass"):
    r = client.post("/api/v1/auth/login", json={"email": email, "password": password})
    assert r.status_code == 200, r.text
    return r.json()["access_token"]


# ── Auth tests ────────────────────────────────────────────────────────────────
class TestAuth:
    def test_login_success(self):
        seed_admin()
        r = client.post("/api/v1/auth/login", json={"email": "admin@test.com", "password": "adminpass"})
        assert r.status_code == 200
        data = r.json()
        assert "access_token" in data
        assert data["user"]["role"] == "ADMINISTRATOR"

    def test_login_wrong_password(self):
        seed_admin()
        r = client.post("/api/v1/auth/login", json={"email": "admin@test.com", "password": "wrong"})
        assert r.status_code == 401

    def test_protected_without_token(self):
        r = client.get("/api/v1/product")
        assert r.status_code == 403  # HTTPBearer returns 403 when no credentials


# ── Product tests ─────────────────────────────────────────────────────────────
class TestProduct:
    def setup_method(self):
        seed_admin()
        self.token = get_token()
        self.headers = {"Authorization": f"Bearer {self.token}"}

    def test_create_product(self):
        r = client.post(
            "/api/v1/product",
            json={
                "sku": "EZ-C8C-2MP",
                "product_name": "EZ Cam 2MP",
                "product_type": "Camera",
                "initial_vendor_price": 50.00,
                "initial_selling_price": 99.00,
                "margin": 49.00,
                "status": "ACTIVE",
            },
            headers=self.headers,
        )
        assert r.status_code == 201
        assert r.json()["sku"] == "EZ-C8C-2MP"

    def test_create_duplicate_sku(self):
        payload = {"sku": "EZ-C8C-2MP", "product_name": "EZ Cam 2MP", "status": "ACTIVE"}
        client.post("/api/v1/product", json=payload, headers=self.headers)
        r = client.post("/api/v1/product", json=payload, headers=self.headers)
        assert r.status_code == 409
        assert r.json()["error"]["code"] == "SKU_ALREADY_EXISTS"

    def test_get_product(self):
        client.post(
            "/api/v1/product",
            json={"sku": "TEST-001", "product_name": "Test Product", "status": "ACTIVE"},
            headers=self.headers,
        )
        r = client.get("/api/v1/product/TEST-001", headers=self.headers)
        assert r.status_code == 200
        assert r.json()["product_name"] == "Test Product"

    def test_get_nonexistent_product(self):
        r = client.get("/api/v1/product/NO-SUCH-SKU", headers=self.headers)
        assert r.status_code == 404

    def test_list_products_paginated(self):
        for i in range(5):
            client.post(
                "/api/v1/product",
                json={"sku": f"SKU-{i:03d}", "product_name": f"Product {i}", "status": "ACTIVE"},
                headers=self.headers,
            )
        r = client.get("/api/v1/product?page=1&limit=3", headers=self.headers)
        assert r.status_code == 200
        data = r.json()
        assert len(data["data"]) == 3
        assert data["pagination"]["total"] == 5
        assert data["pagination"]["total_pages"] == 2


# ── Supplier tests ────────────────────────────────────────────────────────────
class TestSupplier:
    def setup_method(self):
        seed_admin()
        self.headers = {"Authorization": f"Bearer {get_token()}"}

    def test_create_and_get_supplier(self):
        r = client.post(
            "/api/v1/supplier",
            json={"supplier_name": "ACME Corp", "person_in_charge": "Alice"},
            headers=self.headers,
        )
        assert r.status_code == 201
        sid = r.json()["supplier_id"]

        r2 = client.get(f"/api/v1/supplier/{sid}", headers=self.headers)
        assert r2.status_code == 200
        assert r2.json()["supplier_name"] == "ACME Corp"


# ── Customer & Order tests ────────────────────────────────────────────────────
class TestOrder:
    def setup_method(self):
        seed_admin()
        self.headers = {"Authorization": f"Bearer {get_token()}"}

    def _create_customer(self):
        r = client.post(
            "/api/v1/customer",
            json={"customer_name": "Jane Doe", "email": "jane@example.com"},
            headers=self.headers,
        )
        assert r.status_code == 201
        return r.json()["customer_id"]

    def test_create_order(self):
        cid = self._create_customer()
        r = client.post(
            "/api/v1/order",
            json={"tracking_number": "TRK-001", "customer_id": cid, "sales_platform": "Shopee"},
            headers=self.headers,
        )
        assert r.status_code == 201
        assert r.json()["status"] == "PENDING"

    def test_track_order(self):
        cid = self._create_customer()
        client.post(
            "/api/v1/order",
            json={"tracking_number": "TRK-002", "customer_id": cid},
            headers=self.headers,
        )
        r = client.get("/api/v1/order/track/TRK-002", headers=self.headers)
        assert r.status_code == 200

    def test_idempotency(self):
        cid = self._create_customer()
        payload = {"tracking_number": "TRK-003", "customer_id": cid}
        headers = {**self.headers, "Idempotency-Key": "idem-key-abc"}
        r1 = client.post("/api/v1/order", json=payload, headers=headers)
        assert r1.status_code == 201
        r2 = client.post("/api/v1/order", json={**payload, "tracking_number": "TRK-004"}, headers=headers)
        assert r2.status_code == 409
        assert r2.json()["error"]["code"] == "DUPLICATE_REQUEST"


# ── Dashboard tests ───────────────────────────────────────────────────────────
class TestDashboard:
    def setup_method(self):
        seed_admin()
        self.headers = {"Authorization": f"Bearer {get_token()}"}

    def test_metrics(self):
        r = client.get("/api/v1/dashboard/metrics", headers=self.headers)
        assert r.status_code == 200
        data = r.json()
        assert "total_orders" in data
        assert "total_inventory_value" in data

    def test_low_stock(self):
        r = client.get("/api/v1/dashboard/low-stock", headers=self.headers)
        assert r.status_code == 200
        assert "data" in r.json()
