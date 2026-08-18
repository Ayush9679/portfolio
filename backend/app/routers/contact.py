"""Message router — endpoints for dispatching, listing, updating, and deleting contact messages."""
from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.admin import AdminUser
from ..schemas.contact import (
    MessageCreate,
    MessageData,
    MessageSingleResponse,
    MessageListResponse,
    MessageUpdate,
)
from ..services.contact_service import ContactService
from ..utils.auth_deps import get_current_admin
from ..utils.request_utils import get_client_ip

router = APIRouter(tags=["Messages"])


@router.post(
    "/messages",
    response_model=MessageSingleResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Submit a dispatch / contact message",
)
def create_message(
    payload: MessageCreate,
    request: Request,
    db: Session = Depends(get_db),
):
    """
    Accepts a dispatch form submission and persists it directly into the SQLite database.
    Returns the created message details with its unique ID and timestamp.
    """
    try:
        ip = get_client_ip(request)
        service = ContactService(db)
        saved = service.create_message(payload, ip_address=ip)
        return MessageSingleResponse(
            success=True,
            message="Message stored successfully",
            data=MessageData.model_validate(saved),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to persist message to database: {str(e)}",
        )


# Compatibility alias for /contact
@router.post(
    "/contact",
    response_model=MessageSingleResponse,
    status_code=status.HTTP_201_CREATED,
    include_in_schema=False,
)
def submit_contact_alias(
    payload: MessageCreate,
    request: Request,
    db: Session = Depends(get_db),
):
    return create_message(payload, request, db)


@router.get(
    "/messages",
    response_model=MessageListResponse,
    summary="List all submitted messages (Admin protected)",
)
def list_messages(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    search: str | None = Query(None, description="Search across sender, channel, and payload"),
    read: bool | None = Query(None, description="Filter by read status"),
    status: str | None = Query(None, description="Filter by message status"),
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
):
    """
    Returns paginated contact messages retrieved directly from SQLite.
    Protected by Bearer JWT authentication.
    """
    service = ContactService(db)
    items, total = service.get_messages(
        page=page,
        limit=limit,
        search=search,
        read=read,
        status=status,
    )
    return MessageListResponse(
        success=True,
        data=[MessageData.model_validate(m) for m in items],
        total=total,
        page=page,
        limit=limit,
    )


@router.get(
    "/messages/{message_id}",
    response_model=MessageSingleResponse,
    summary="Retrieve single message detail (Admin protected)",
)
def get_message(
    message_id: int,
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
):
    """Returns full payload details for a single message record."""
    service = ContactService(db)
    msg = service.get_message_by_id(message_id)
    if not msg:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Message #{message_id} not found in database",
        )
    return MessageSingleResponse(
        success=True,
        message="Message retrieved successfully",
        data=MessageData.model_validate(msg),
    )


@router.patch(
    "/messages/{message_id}",
    response_model=MessageSingleResponse,
    summary="Update message status or read/unread state (Admin protected)",
)
def update_message(
    message_id: int,
    payload: MessageUpdate,
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
):
    """Updates read status or workflow status for a specific message."""
    service = ContactService(db)
    updated = service.update_message(message_id, payload)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Message #{message_id} not found in database",
        )
    return MessageSingleResponse(
        success=True,
        message="Message updated successfully",
        data=MessageData.model_validate(updated),
    )


@router.delete(
    "/messages/{message_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Permanently delete a message (Admin protected)",
)
def delete_message(
    message_id: int,
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
):
    """Deletes a message record from the SQLite database."""
    service = ContactService(db)
    deleted = service.delete_message(message_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Message #{message_id} not found in database",
        )
    return None
