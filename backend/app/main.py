"""FastAPI application entry point."""
import contextlib
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import get_settings
from .database import init_db, SessionLocal
from .services.auth_service import AuthService
from .routers import health, contact, auth, admin

settings = get_settings()


def _ensure_data_dir() -> None:
    """Create the data/ directory for SQLite if it doesn't already exist."""
    db_url: str = settings.database_url
    # Only relevant for SQLite file-based databases
    if not db_url.startswith("sqlite:///"):
        return
    # Strip the sqlite:/// prefix to get the file path
    raw_path = db_url.replace("sqlite:///", "", 1)
    # Resolve relative paths relative to this file's parent (backend/)
    if not os.path.isabs(raw_path):
        base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        raw_path = os.path.join(base, raw_path)
    db_dir = os.path.dirname(raw_path)
    if db_dir:
        os.makedirs(db_dir, exist_ok=True)


@contextlib.asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan: validate secrets, initialize database, seed admin."""
    # Abort immediately in production if insecure defaults are detected
    settings.validate_production_secrets()

    # Ensure the SQLite data directory exists before SQLAlchemy tries to create the file
    _ensure_data_dir()

    init_db()

    db = SessionLocal()
    try:
        auth_service = AuthService(db)
        auth_service.seed_admin(settings.admin_username, settings.admin_password)
    finally:
        db.close()

    yield


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Portfolio API for Ayush Kumar Dubey — AI/ML + Backend Engineer",
    # Disable interactive docs in production
    docs_url="/docs" if settings.debug else None,
    redoc_url="/redoc" if settings.debug else None,
    openapi_url="/openapi.json" if settings.debug else None,
    lifespan=lifespan,
)

# ── CORS ──────────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "Accept"],
)

# ── Routers ───────────────────────────────────────────────────────────────────────
# Health endpoint -> /api/health
app.include_router(health.router, prefix="/api")

# Messages & Contact endpoints -> /api/messages, /api/contact
app.include_router(contact.router, prefix="/api")

# Authentication endpoints -> /api/admin/login and /admin/login
app.include_router(auth.router, prefix="/api/admin")
app.include_router(auth.router, prefix="/admin")

# Protected Admin endpoints -> /api/admin/stats
app.include_router(admin.router, prefix="/api/admin")


@app.get("/", include_in_schema=False)
def root():
    return {
        "name": settings.app_name,
        "version": settings.app_version,
        "status": "online",
        "docs": "/docs" if settings.debug else "disabled in production",
    }
