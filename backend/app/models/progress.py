"""Progress and achievement models."""
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database.session import Base


class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    lessons_completed = Column(Integer, default=0)
    quizzes_completed = Column(Integer, default=0)
    problems_solved = Column(Integer, default=0)
    total_xp = Column(Integer, default=0)
    current_streak = Column(Integer, default=0)
    longest_streak = Column(Integer, default=0)
    last_activity = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    icon = Column(String(50), nullable=True)
    xp_reward = Column(Integer, default=0)
    requirement_type = Column(String(50), nullable=False)  # lessons, quizzes, problems, streak
    requirement_value = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class UserAchievement(Base):
    __tablename__ = "user_achievements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    achievement_id = Column(Integer, ForeignKey("achievements.id"), nullable=False)
    earned_at = Column(DateTime(timezone=True), server_default=func.now())
