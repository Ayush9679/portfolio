"""Common/shared Pydantic schemas."""
from pydantic import BaseModel
from typing import Any


class HealthResponse(BaseModel):
    status: str = "ok"
    api: str = "online"
    database: str = "connected"
    version: str = "1.0.0"
    uptime_seconds: float
    records: int = 0
    message_count: int = 0


class DatabaseStats(BaseModel):
    type: str = "SQLite"
    status: str = "connected"
    records: int = 0


class StatsResponse(BaseModel):
    success: bool = True
    messages: int = 0
    total_messages: int = 0
    unread_messages: int = 0
    read_messages: int = 0
    recent_messages: int = 0
    projects: int = 4
    skills: int = 32
    experience: int = 4
    database: DatabaseStats
    api: str = "online"
