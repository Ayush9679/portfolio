"""SQLAlchemy database engine, session, and base setup.

SQLite path resolution strategy:
  - If DATABASE_URL is an absolute sqlite:/// path (four slashes), use it as-is.
  - If it is a relative path (three slashes), resolve it relative to the
    backend/ directory (i.e., this file's grandparent), NOT the process cwd.
    This ensures the database is always found regardless of which directory
    gunicorn/uvicorn is started from.
"""
import os
from sqlalchemy import create_engine, event
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from .config import get_settings

settings = get_settings()

# ── Resolve the database URL to an absolute path for SQLite ───────────────────
_DB_URL: str = settings.database_url

if _DB_URL.startswith("sqlite:///") and not _DB_URL.startswith("sqlite:////"):
    # Relative sqlite path — make it absolute relative to backend/
    _rel_path = _DB_URL[len("sqlite:///"):]  # strip prefix
    _backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    _abs_path = os.path.normpath(os.path.join(_backend_dir, _rel_path))
    _DB_URL = f"sqlite:///{_abs_path}"

engine = create_engine(
    _DB_URL,
    connect_args={"check_same_thread": False},
)


@event.listens_for(engine, "connect")
def set_sqlite_pragma(dbapi_connection, _connection_record):
    """Enable WAL journal mode and foreign key enforcement on every connection."""
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA journal_mode=WAL")
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    """FastAPI dependency that yields a database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    """Create all tables. Called on application startup."""
    # Import models here so Base.metadata is populated before create_all
    from .models import contact, admin  # noqa: F401
    Base.metadata.create_all(bind=engine)
