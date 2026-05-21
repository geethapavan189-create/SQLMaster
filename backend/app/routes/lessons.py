"""Lesson routes."""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List, Optional
from app.database.session import get_db
from app.models.user import User
from app.models.lesson import Lesson, LessonProgress
from app.schemas.lesson import LessonResponse, LessonListResponse, LessonProgressUpdate, LessonCreate
from app.middleware.auth import get_current_user, get_optional_user, get_current_admin
from datetime import datetime

router = APIRouter(prefix="/lessons", tags=["Lessons"])


@router.get("/", response_model=List[LessonListResponse])
async def get_lessons(
    difficulty: Optional[str] = None,
    category: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user),
):
    """Get all lessons with optional filtering."""
    query = select(Lesson).where(Lesson.is_published == True).order_by(Lesson.order_index)
    
    if difficulty:
        query = query.where(Lesson.difficulty == difficulty)
    if category:
        query = query.where(Lesson.category == category)
    
    result = await db.execute(query)
    lessons = result.scalars().all()
    
    # Get user progress if authenticated
    completed_ids = set()
    if current_user:
        progress_result = await db.execute(
            select(LessonProgress.lesson_id).where(
                LessonProgress.user_id == current_user.id,
                LessonProgress.is_completed == True,
            )
        )
        completed_ids = {row[0] for row in progress_result.all()}
    
    return [
        LessonListResponse(
            id=lesson.id,
            title=lesson.title,
            slug=lesson.slug,
            description=lesson.description,
            difficulty=lesson.difficulty,
            category=lesson.category,
            order_index=lesson.order_index,
            estimated_time=lesson.estimated_time,
            is_completed=lesson.id in completed_ids,
        )
        for lesson in lessons
    ]


@router.get("/categories")
async def get_categories(db: AsyncSession = Depends(get_db)):
    """Get all lesson categories."""
    result = await db.execute(
        select(Lesson.category, Lesson.difficulty, func.count(Lesson.id))
        .where(Lesson.is_published == True)
        .group_by(Lesson.category, Lesson.difficulty)
        .order_by(Lesson.category)
    )
    rows = result.all()
    
    categories = {}
    for category, difficulty, count in rows:
        if category not in categories:
            categories[category] = {"name": category, "lessons": 0, "difficulties": []}
        categories[category]["lessons"] += count
        if difficulty not in categories[category]["difficulties"]:
            categories[category]["difficulties"].append(difficulty)
    
    return list(categories.values())


@router.get("/{slug}", response_model=LessonResponse)
async def get_lesson(slug: str, db: AsyncSession = Depends(get_db)):
    """Get a single lesson by slug."""
    result = await db.execute(select(Lesson).where(Lesson.slug == slug, Lesson.is_published == True))
    lesson = result.scalar_one_or_none()
    
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    return LessonResponse.model_validate(lesson)


@router.post("/{lesson_id}/progress")
async def update_progress(
    lesson_id: int,
    progress_data: LessonProgressUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update lesson progress for current user."""
    # Check lesson exists
    result = await db.execute(select(Lesson).where(Lesson.id == lesson_id))
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    # Get or create progress
    result = await db.execute(
        select(LessonProgress).where(
            LessonProgress.user_id == current_user.id,
            LessonProgress.lesson_id == lesson_id,
        )
    )
    progress = result.scalar_one_or_none()
    
    if not progress:
        progress = LessonProgress(user_id=current_user.id, lesson_id=lesson_id)
        db.add(progress)
    
    progress.is_completed = progress_data.is_completed
    progress.notes = progress_data.notes
    progress.bookmarked = progress_data.bookmarked
    
    if progress_data.is_completed:
        progress.completed_at = datetime.utcnow()
        # Award XP
        current_user.xp_points += 20
    
    await db.commit()
    return {"message": "Progress updated", "xp_earned": 20 if progress_data.is_completed else 0}


@router.post("/", response_model=LessonResponse, status_code=status.HTTP_201_CREATED)
async def create_lesson(
    lesson_data: LessonCreate,
    current_user: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    """Create a new lesson (admin only)."""
    lesson = Lesson(**lesson_data.model_dump())
    db.add(lesson)
    await db.commit()
    await db.refresh(lesson)
    return LessonResponse.model_validate(lesson)
