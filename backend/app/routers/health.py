"""Health and system status router."""
import time
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text, func

from ..database import get_db
from ..config import get_settings
from ..schemas.common import HealthResponse
from ..models.contact import Message

settings = get_settings()
router = APIRouter(tags=["System"])

_start_time = time.time()


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Check API and SQLite database health status",
)
def health_check(db: Session = Depends(get_db)):
    """
    Verifies API operational status and validates active SQLite database connection.
    Exposed publicly for telemetry and frontend system status widgets.
    """
    db_status = "connected"
    records = 0
    try:
        db.execute(text("SELECT 1"))
        records = db.query(func.count(Message.id)).scalar() or 0
    except Exception:
        db_status = "disconnected"

    return HealthResponse(
        status="ok",
        api="online",
        database=db_status,
        version=settings.app_version,
        uptime_seconds=round(time.time() - _start_time, 2),
        records=records,
        message_count=records,
    )
