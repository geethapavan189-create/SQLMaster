"""Daily challenge models."""
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, JSON, Date
from sqlalchemy.sql import func
from app.database.session import Base


class DailyChallenge(Base):
    __tablename__ = "daily_challenges"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    difficulty = Column(String(20), nullable=False)
    dataset = Column(String(50), nullable=False)
    solution = Column(Text, nullable=False)
    hint = Column(Text, nullable=True)
    explanation = Column(Text, nullable=True)
    xp_reward = Column(Integer, default=50)
    challenge_date = Column(Date, unique=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ChallengeSubmission(Base):
    __tablename__ = "challenge_submissions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    challenge_id = Column(Integer, ForeignKey("daily_challenges.id"), nullable=False)
    query = Column(Text, nullable=False)
    is_correct = Column(Boolean, default=False)
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())
