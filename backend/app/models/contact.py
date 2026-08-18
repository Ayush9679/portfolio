"""SQLAlchemy model for contact/dispatch messages."""
from datetime import datetime
from sqlalchemy import Boolean, DateTime, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column
from ..database import Base


class Message(Base):
    __tablename__ = "messages"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    sender: Mapped[str] = mapped_column(String(120), nullable=False)
    channel: Mapped[str] = mapped_column(String(254), nullable=False)
    payload: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="received", nullable=False)
    read: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    ip_address: Mapped[str | None] = mapped_column(String(45), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), nullable=False
    )

    # Aliases for compatibility
    @property
    def name(self) -> str:
        return self.sender

    @property
    def email(self) -> str:
        return self.channel

    @property
    def message(self) -> str:
        return self.payload

    @property
    def is_read(self) -> bool:
        return self.read

    @is_read.setter
    def is_read(self, val: bool) -> None:
        self.read = val


# Backwards compatibility alias
ContactMessage = Message
