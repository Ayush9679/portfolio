"""Admin-protected router for administrative telemetry and stats."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.admin import AdminUser
from ..schemas.common import StatsResponse, DatabaseStats
from ..services.contact_service import ContactService
from ..utils.auth_deps import get_current_admin

router = APIRouter(tags=["Admin"])


@router.get(
    "/stats",
    response_model=StatsResponse,
    summary="Get aggregated system and database telemetry (Admin protected)",
)
def get_stats(
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
):
    """Returns real metrics and SQLite statistics for the admin dashboard."""
    service = ContactService(db)
    total = service.get_total_count()
    unread = service.get_unread_count()
    recent = service.get_recent_count(hours=24)

    return StatsResponse(
        success=True,
        messages=total,
        total_messages=total,
        unread_messages=unread,
        read_messages=total - unread,
        recent_messages=recent,
        projects=4,
        skills=32,
        experience=4,
        database=DatabaseStats(
            type="SQLite",
            status="connected",
            records=total,
        ),
        api="online",
    )
