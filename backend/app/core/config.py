from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    PROJECT_NAME: str = "Inventory Management System"
    API_V1_STR: str = "/api/v1"

    # Database
    DATABASE_URL: str = "mysql+aiomysql://user:password@localhost:3306/inventory_db"

    # JWT
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173"]

    # Redis (for token blacklist)
    REDIS_URL: str = "redis://localhost:6379/0"

    # Pagination
    DEFAULT_PAGE_SIZE: int = 20
    MAX_PAGE_SIZE: int = 100

    # Costing method: WEIGHTED_AVERAGE or FIFO
    COSTING_METHOD: str = "WEIGHTED_AVERAGE"

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
