"""Lesson models."""
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from app.database.session import Base


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    slug = Column(String(200), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    content = Column(Text, nullable=False)  # Markdown content
    difficulty = Column(String(20), nullable=False)  # beginner, intermediate, advanced
    category = Column(String(100), nullable=False)
    order_index = Column(Integer, default=0)
    examples = Column(JSON, nullable=True)  # List of SQL examples
    syntax = Column(Text, nullable=True)
    tips = Column(JSON, nullable=True)
    is_published = Column(Boolean, default=True)
    estimated_time = Column(Integer, default=10)  # minutes
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class LessonProgress(Base):
    __tablename__ = "lesson_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    is_completed = Column(Boolean, default=False)
    notes = Column(Text, nullable=True)
    bookmarked = Column(Boolean, default=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
