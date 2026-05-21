"""Admin routes."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List
from app.database.session import get_db
from app.models.user import User
from app.models.lesson import Lesson
from app.models.quiz import Quiz, QuizQuestion
from app.models.problem import Problem
from app.schemas.user import UserResponse
from app.middleware.auth import get_current_admin

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/stats")
async def get_admin_stats(
    current_user: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    """Get platform statistics."""
    users_count = await db.execute(select(func.count(User.id)))
    lessons_count = await db.execute(select(func.count(Lesson.id)))
    quizzes_count = await db.execute(select(func.count(Quiz.id)))
    problems_count = await db.execute(select(func.count(Problem.id)))
    
    return {
        "total_users": users_count.scalar() or 0,
        "total_lessons": lessons_count.scalar() or 0,
        "total_quizzes": quizzes_count.scalar() or 0,
        "total_problems": problems_count.scalar() or 0,
    }


@router.get("/users", response_model=List[UserResponse])
async def get_all_users(
    current_user: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    """Get all users (admin only)."""
    result = await db.execute(select(User).order_by(User.created_at.desc()))
    users = result.scalars().all()
    return [UserResponse.model_validate(u) for u in users]


@router.put("/users/{user_id}/toggle-active")
async def toggle_user_active(
    user_id: int,
    current_user: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    """Toggle user active status."""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.is_active = not user.is_active
    await db.commit()
    
    return {"message": f"User {'activated' if user.is_active else 'deactivated'}"}


@router.delete("/lessons/{lesson_id}")
async def delete_lesson(
    lesson_id: int,
    current_user: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    """Delete a lesson."""
    result = await db.execute(select(Lesson).where(Lesson.id == lesson_id))
    lesson = result.scalar_one_or_none()
    
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    await db.delete(lesson)
    await db.commit()
    return {"message": "Lesson deleted"}
