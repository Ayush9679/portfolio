"""Application configuration loaded from environment variables.

In production:
  - Copy backend/.env.example to backend/.env
  - Generate a real SECRET_KEY:  python -c "import secrets; print(secrets.token_hex(32))"
  - Set strong ADMIN_PASSWORD
  - Set DATABASE_URL to an absolute path:  sqlite:////home/user/portfolio/backend/data/portfolio.db
  - Set ALLOWED_ORIGINS to your Vercel deployment URL
  - Set DEBUG=false
"""
import os
import sys
from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict

# ── Resolve .env path relative to THIS file, not cwd ─────────────────────────────
_BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_ENV_PATH = os.path.join(_BASE_DIR, ".env")


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=_ENV_PATH,
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # ── App ──────────────────────────────────────────────────────────────────────
    app_name: str = "Ayush Kumar Dubey Portfolio API"
    app_version: str = "1.0.0"
    debug: bool = False  # Default to safe/off; must explicitly enable in dev .env

    # ── Security ─────────────────────────────────────────────────────────────────
    # MUST be overridden in .env with a cryptographically random value.
    secret_key: str = "INSECURE_DEFAULT_DO_NOT_USE_IN_PRODUCTION"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 480

    # ── Admin credentials (bootstrapped on first run) ─────────────────────────────
    admin_username: str = "admin"
    admin_password: str = "INSECURE_DEFAULT_CHANGE_BEFORE_DEPLOY"

    # ── Database ─────────────────────────────────────────────────────────────────
    # Default: relative path suitable for local dev.
    # Production: use absolute path in .env, e.g.:
    #   DATABASE_URL=sqlite:////home/deploy/portfolio/backend/data/portfolio.db
    database_url: str = "sqlite:///./data/portfolio.db"

    # ── CORS ─────────────────────────────────────────────────────────────────────
    allowed_origins: str = (
        "http://localhost:5173,http://127.0.0.1:5173,"
        "http://localhost:4173,http://127.0.0.1:4173,"
        "http://localhost:3000,http://127.0.0.1:3000"
    )
    frontend_url: str = "http://localhost:5173"

    @property
    def allowed_origins_list(self) -> list[str]:
        origins = [o.strip() for o in self.allowed_origins.split(",") if o.strip()]
        if self.frontend_url and self.frontend_url.strip() not in origins:
            origins.append(self.frontend_url.strip())
        return origins

    def validate_production_secrets(self) -> None:
        """Abort startup if insecure default secrets are used in non-debug mode."""
        insecure_keys = {
            "INSECURE_DEFAULT_DO_NOT_USE_IN_PRODUCTION",
            "CHANGE_ME_generate_a_secure_random_hex_string_here",
        }
        insecure_passwords = {
            "INSECURE_DEFAULT_CHANGE_BEFORE_DEPLOY",
            "CHANGE_ME_use_a_strong_password_here",
            "adminpassword123",
        }
        if not self.debug:
            if self.secret_key in insecure_keys:
                print(
                    "FATAL: SECRET_KEY is set to an insecure default value. "
                    "Generate a real key with:  python -c \"import secrets; print(secrets.token_hex(32))\"\n"
                    "Then set it in backend/.env",
                    file=sys.stderr,
                )
                sys.exit(1)
            if self.admin_password in insecure_passwords:
                print(
                    "FATAL: ADMIN_PASSWORD is set to an insecure default value. "
                    "Set a strong password in backend/.env",
                    file=sys.stderr,
                )
                sys.exit(1)


@lru_cache
def get_settings() -> Settings:
    return Settings()
