"""Lesson schemas."""
from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime


class LessonCreate(BaseModel):
    title: str
    slug: str
    description: Optional[str] = None
    content: str
    difficulty: str
    category: str
    order_index: int = 0
    examples: Optional[List[dict]] = None
    syntax: Optional[str] = None
    tips: Optional[List[str]] = None
    estimated_time: int = 10


class LessonResponse(BaseModel):
    id: int
    title: str
    slug: str
    description: Optional[str] = None
    content: str
    difficulty: str
    category: str
    order_index: int
    examples: Optional[List[dict]] = None
    syntax: Optional[str] = None
    tips: Optional[List[str]] = None
    is_published: bool
    estimated_time: int
    created_at: datetime

    class Config:
        from_attributes = True


class LessonListResponse(BaseModel):
    id: int
    title: str
    slug: str
    description: Optional[str] = None
    difficulty: str
    category: str
    order_index: int
    estimated_time: int
    is_completed: bool = False

    class Config:
        from_attributes = True


class LessonProgressUpdate(BaseModel):
    is_completed: bool = False
    notes: Optional[str] = None
    bookmarked: bool = False
