"""Authentication service: password hashing and JWT token management."""
from datetime import datetime, timedelta, timezone
from typing import Any

from jose import JWTError, jwt
import bcrypt
from sqlalchemy.orm import Session

from ..config import get_settings
from ..models.admin import AdminUser

settings = get_settings()


class AuthService:
    def __init__(self, db: Session) -> None:
        self.db = db

    # ── Passwords ────────────────────────────────────────────────────────────────

    @staticmethod
    def hash_password(password: str) -> str:
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

    @staticmethod
    def verify_password(plain: str, hashed: str) -> bool:
        try:
            return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
        except Exception:
            return False

    # ── JWT ──────────────────────────────────────────────────────────────────────

    @staticmethod
    def create_access_token(data: dict[str, Any]) -> str:
        to_encode = data.copy()
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.access_token_expire_minutes
        )
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)

    @staticmethod
    def decode_token(token: str) -> dict[str, Any] | None:
        try:
            payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
            return payload
        except JWTError:
            return None

    # ── Admin user ───────────────────────────────────────────────────────────────

    def get_admin_by_username(self, username: str) -> AdminUser | None:
        return self.db.query(AdminUser).filter(AdminUser.username == username).first()

    def authenticate_admin(self, username: str, password: str) -> AdminUser | None:
        user = self.get_admin_by_username(username)
        if not user:
            return None
        if not self.verify_password(password, user.password_hash):
            return None
        return user

    def seed_admin(self, username: str, password: str) -> None:
        """Create admin user if not exists. Called on startup."""
        existing = self.get_admin_by_username(username)
        if not existing:
            admin = AdminUser(
                username=username,
                password_hash=self.hash_password(password),
            )
            self.db.add(admin)
            self.db.commit()
