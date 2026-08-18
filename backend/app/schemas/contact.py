"""Pydantic schemas for contact and dispatch messages."""
from datetime import datetime
from pydantic import BaseModel, Field, model_validator
from typing import Any


class MessageCreate(BaseModel):
    sender: str | None = Field(default=None, min_length=2, max_length=120, description="Sender's name or identity")
    channel: str | None = Field(default=None, min_length=3, max_length=254, description="Contact channel or email")
    payload: str | None = Field(default=None, min_length=5, max_length=5000, description="Message payload")

    # Fallback fields for legacy/alternate requests
    name: str | None = None
    email: str | None = None
    message: str | None = None

    @model_validator(mode="before")
    @classmethod
    def reconcile_fields(cls, data: Any) -> Any:
        if isinstance(data, dict):
            # Normalize sender / name
            sender_val = data.get("sender") or data.get("name")
            # Normalize channel / email
            channel_val = data.get("channel") or data.get("email")
            # Normalize payload / message
            payload_val = data.get("payload") or data.get("message")

            if not sender_val or not str(sender_val).strip():
                raise ValueError("Sender name is required")
            if not channel_val or not str(channel_val).strip():
                raise ValueError("Contact channel or email is required")
            if not payload_val or not str(payload_val).strip():
                raise ValueError("Message payload is required")

            data["sender"] = str(sender_val).strip()
            data["channel"] = str(channel_val).strip()
            data["payload"] = str(payload_val).strip()
        return data


class MessageData(BaseModel):
    id: int
    sender: str
    channel: str
    payload: str
    status: str
    read: bool
    ip_address: str | None = None
    created_at: datetime

    # Compatibility fields
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

    model_config = {"from_attributes": True}


class MessageSingleResponse(BaseModel):
    success: bool = True
    message: str = "Message stored successfully"
    data: MessageData


class MessageListResponse(BaseModel):
    success: bool = True
    data: list[MessageData]
    total: int
    page: int = 1
    limit: int = 20


class MessageUpdate(BaseModel):
    read: bool | None = None
    is_read: bool | None = None
    status: str | None = None

    @model_validator(mode="before")
    @classmethod
    def reconcile_read(cls, data: Any) -> Any:
        if isinstance(data, dict):
            if "is_read" in data and "read" not in data:
                data["read"] = data["is_read"]
        return data


# Compatibility aliases
ContactCreate = MessageCreate
ContactResponse = MessageData
ContactPublicResponse = MessageSingleResponse
ContactUpdateRead = MessageUpdate
