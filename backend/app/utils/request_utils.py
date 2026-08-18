"""Utilities for extracting request metadata."""
from fastapi import Request


def get_client_ip(request: Request) -> str | None:
    """Extract client IP respecting X-Forwarded-For proxy headers."""
    forwarded_for = request.headers.get("X-Forwarded-For")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()
    if request.client:
        return request.client.host
    return None
