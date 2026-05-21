"""Admin routes."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, delete
from typing import List
from app.database.session import get_db
from app.models.user import User
from app.models.lesson import Lesson, LessonProgress
from app.models.quiz import Quiz, QuizQuestion, QuizAttempt
from app.models.problem import Problem, ProblemSubmission
from app.models.progress import UserProgress, UserAchievement
from app.models.challenge import ChallengeSubmission
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


@router.delete("/users/{user_id}")
async def delete_user(
    user_id: int,
    current_user: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    """Delete a user and all their data (admin only)."""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.is_admin:
        raise HTTPException(status_code=400, detail="Cannot delete admin user")
    
    # Delete all related records
    await db.execute(delete(UserProgress).where(UserProgress.user_id == user_id))
    await db.execute(delete(UserAchievement).where(UserAchievement.user_id == user_id))
    await db.execute(delete(LessonProgress).where(LessonProgress.user_id == user_id))
    await db.execute(delete(QuizAttempt).where(QuizAttempt.user_id == user_id))
    await db.execute(delete(ProblemSubmission).where(ProblemSubmission.user_id == user_id))
    await db.execute(delete(ChallengeSubmission).where(ChallengeSubmission.user_id == user_id))
    
    # Delete the user
    await db.delete(user)
    return {"message": "User deleted successfully"}


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
