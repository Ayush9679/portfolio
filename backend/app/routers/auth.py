"""Authentication router — admin login endpoint."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..schemas.auth import LoginRequest, TokenResponse
from ..services.auth_service import AuthService
from ..config import get_settings

settings = get_settings()
router = APIRouter(tags=["Authentication"])


@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Authenticate administrator and issue JWT token",
)
def admin_login(payload: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate administrator credentials and return a Bearer JWT access token."""
    auth_service = AuthService(db)
    admin = auth_service.authenticate_admin(payload.username, payload.password)

    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid administrator credentials",
        )

    token = auth_service.create_access_token({"sub": admin.username})
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        expires_in=settings.access_token_expire_minutes * 60,
    )
