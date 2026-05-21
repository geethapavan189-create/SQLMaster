"""Authentication middleware."""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.security import verify_token
from app.database.session import get_db
from app.models.user import User

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db),
) -> User:
    """Get the current authenticated user."""
    token = credentials.credentials
    payload = verify_token(token)
    
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )
    
    result = await db.execute(select(User).where(User.id == int(user_id)))
    user = result.scalar_one_or_none()
    
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is disabled",
        )
    
    return user


async def get_current_admin(
    current_user: User = Depends(get_current_user),
) -> User:
    """Get the current admin user."""
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return current_user


async def get_optional_user(
    credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer(auto_error=False)),
    db: AsyncSession = Depends(get_db),
) -> User | None:
    """Get the current user if authenticated, otherwise None."""
    if credentials is None:
        return None
    
    payload = verify_token(credentials.credentials)
    if payload is None:
        return None
    
    user_id = payload.get("sub")
    if user_id is None:
        return None
    
    result = await db.execute(select(User).where(User.id == int(user_id)))
    return result.scalar_one_or_none()
