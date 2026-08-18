"""Business logic for contact and dispatch message operations."""
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from ..models.contact import Message
from ..schemas.contact import MessageCreate, MessageUpdate


class ContactService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create_message(self, data: MessageCreate, ip_address: str | None = None) -> Message:
        """Persist a new dispatch/contact message to SQLite."""
        msg = Message(
            sender=data.sender,
            channel=data.channel,
            payload=data.payload,
            status="received",
            read=False,
            ip_address=ip_address,
        )
        self.db.add(msg)
        self.db.commit()
        self.db.refresh(msg)
        return msg

    def get_messages(
        self,
        page: int = 1,
        limit: int = 20,
        search: str | None = None,
        read: bool | None = None,
        status: str | None = None,
    ) -> tuple[list[Message], int]:
        """Paginated and filterable query for messages."""
        query = self.db.query(Message)

        if read is not None:
            query = query.filter(Message.read == read)

        if status:
            query = query.filter(Message.status == status)

        if search:
            pattern = f"%{search.strip()}%"
            query = query.filter(
                or_(
                    Message.sender.ilike(pattern),
                    Message.channel.ilike(pattern),
                    Message.payload.ilike(pattern),
                )
            )

        total = query.count()
        skip = (max(1, page) - 1) * limit
        items = query.order_by(Message.created_at.desc()).offset(skip).limit(limit).all()
        return items, total

    def get_all_messages(self, skip: int = 0, limit: int = 100) -> list[Message]:
        return (
            self.db.query(Message)
            .order_by(Message.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_message_by_id(self, message_id: int) -> Message | None:
        return self.db.query(Message).filter(Message.id == message_id).first()

    def update_message(self, message_id: int, update_data: MessageUpdate) -> Message | None:
        """Update read state or status of a message."""
        msg = self.get_message_by_id(message_id)
        if not msg:
            return None

        if update_data.read is not None:
            msg.read = update_data.read
        if update_data.status is not None:
            msg.status = update_data.status

        self.db.commit()
        self.db.refresh(msg)
        return msg

    def mark_read(self, message_id: int, is_read: bool) -> Message | None:
        return self.update_message(message_id, MessageUpdate(read=is_read))

    def delete_message(self, message_id: int) -> bool:
        msg = self.get_message_by_id(message_id)
        if msg:
            self.db.delete(msg)
            self.db.commit()
            return True
        return False

    def get_total_count(self) -> int:
        return self.db.query(func.count(Message.id)).scalar() or 0

    def get_unread_count(self) -> int:
        return (
            self.db.query(func.count(Message.id))
            .filter(Message.read == False)  # noqa: E712
            .scalar()
            or 0
        )

    def get_recent_count(self, hours: int = 24) -> int:
        since = datetime.utcnow() - timedelta(hours=hours)
        return (
            self.db.query(func.count(Message.id))
            .filter(Message.created_at >= since)
            .scalar()
            or 0
        )
