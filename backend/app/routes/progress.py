"""Progress and leaderboard routes."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from typing import List
from datetime import date
from app.database.session import get_db
from app.models.user import User
from app.models.progress import UserProgress, Achievement, UserAchievement
from app.models.challenge import DailyChallenge, ChallengeSubmission
from app.models.problem import ProblemSubmission
from app.models.lesson import LessonProgress
from app.schemas.progress import ProgressResponse, AchievementResponse, LeaderboardEntry, DailyChallengeResponse
from app.middleware.auth import get_current_user, get_optional_user

router = APIRouter(prefix="/progress", tags=["Progress"])


@router.get("/me", response_model=ProgressResponse)
async def get_my_progress(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get current user's progress."""
    result = await db.execute(
        select(UserProgress).where(UserProgress.user_id == current_user.id)
    )
    progress = result.scalar_one_or_none()
    
    if not progress:
        progress = UserProgress(user_id=current_user.id)
        db.add(progress)
        await db.commit()
        await db.refresh(progress)
    
    # Count actual completions
    lessons_count = await db.execute(
        select(func.count(LessonProgress.id)).where(
            LessonProgress.user_id == current_user.id,
            LessonProgress.is_completed == True,
        )
    )
    problems_count = await db.execute(
        select(func.count(func.distinct(ProblemSubmission.problem_id))).where(
            ProblemSubmission.user_id == current_user.id,
            ProblemSubmission.is_correct == True,
        )
    )
    
    return ProgressResponse(
        lessons_completed=lessons_count.scalar() or 0,
        quizzes_completed=progress.quizzes_completed,
        problems_solved=problems_count.scalar() or 0,
        total_xp=current_user.xp_points,
        current_streak=current_user.streak_days,
        longest_streak=progress.longest_streak,
        level=current_user.level,
        last_activity=progress.last_activity,
    )


@router.get("/leaderboard", response_model=List[LeaderboardEntry])
async def get_leaderboard(
    db: AsyncSession = Depends(get_db),
):
    """Get the global leaderboard."""
    result = await db.execute(
        select(User)
        .where(User.is_active == True)
        .order_by(desc(User.xp_points))
        .limit(50)
    )
    users = result.scalars().all()
    
    leaderboard = []
    for rank, user in enumerate(users, 1):
        # Get problems solved count
        problems_result = await db.execute(
            select(func.count(func.distinct(ProblemSubmission.problem_id))).where(
                ProblemSubmission.user_id == user.id,
                ProblemSubmission.is_correct == True,
            )
        )
        problems_solved = problems_result.scalar() or 0
        
        leaderboard.append(LeaderboardEntry(
            rank=rank,
            user_id=user.id,
            username=user.username,
            avatar_url=user.avatar_url,
            xp_points=user.xp_points,
            level=user.level,
            problems_solved=problems_solved,
        ))
    
    return leaderboard


@router.get("/achievements", response_model=List[AchievementResponse])
async def get_achievements(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get all achievements with user's earned status."""
    result = await db.execute(select(Achievement))
    achievements = result.scalars().all()
    
    # Get user's earned achievements
    earned_result = await db.execute(
        select(UserAchievement).where(UserAchievement.user_id == current_user.id)
    )
    earned = {ua.achievement_id: ua.earned_at for ua in earned_result.scalars().all()}
    
    return [
        AchievementResponse(
            id=a.id,
            name=a.name,
            description=a.description,
            icon=a.icon,
            xp_reward=a.xp_reward,
            earned=a.id in earned,
            earned_at=earned.get(a.id),
        )
        for a in achievements
    ]


@router.get("/daily-challenge", response_model=DailyChallengeResponse)
async def get_daily_challenge(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_optional_user),
):
    """Get today's daily challenge."""
    today = date.today()
    result = await db.execute(
        select(DailyChallenge).where(DailyChallenge.challenge_date == today)
    )
    challenge = result.scalar_one_or_none()
    
    if not challenge:
        # Return the latest challenge
        result = await db.execute(
            select(DailyChallenge).order_by(desc(DailyChallenge.challenge_date)).limit(1)
        )
        challenge = result.scalar_one_or_none()
    
    if not challenge:
        raise HTTPException(status_code=404, detail="No challenge available")
    
    is_completed = False
    if current_user:
        sub_result = await db.execute(
            select(ChallengeSubmission).where(
                ChallengeSubmission.user_id == current_user.id,
                ChallengeSubmission.challenge_id == challenge.id,
                ChallengeSubmission.is_correct == True,
            )
        )
        is_completed = sub_result.scalar_one_or_none() is not None
    
    return DailyChallengeResponse(
        id=challenge.id,
        title=challenge.title,
        description=challenge.description,
        difficulty=challenge.difficulty,
        dataset=challenge.dataset,
        hint=challenge.hint,
        xp_reward=challenge.xp_reward,
        is_completed=is_completed,
    )
