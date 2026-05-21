"""Progress schemas."""
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class ProgressResponse(BaseModel):
    lessons_completed: int
    quizzes_completed: int
    problems_solved: int
    total_xp: int
    current_streak: int
    longest_streak: int
    level: int
    last_activity: Optional[datetime] = None

    class Config:
        from_attributes = True


class AchievementResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    icon: Optional[str] = None
    xp_reward: int
    earned: bool = False
    earned_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class LeaderboardEntry(BaseModel):
    rank: int
    user_id: int
    username: str
    avatar_url: Optional[str] = None
    xp_points: int
    level: int
    problems_solved: int

    class Config:
        from_attributes = True


class DailyChallengeResponse(BaseModel):
    id: int
    title: str
    description: str
    difficulty: str
    dataset: str
    hint: Optional[str] = None
    xp_reward: int
    is_completed: bool = False

    class Config:
        from_attributes = True
