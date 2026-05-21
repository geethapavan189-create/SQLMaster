"""Quiz schemas."""
from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime


class QuizQuestionResponse(BaseModel):
    id: int
    question: str
    question_type: str
    options: Optional[List[str]] = None
    code_snippet: Optional[str] = None
    correct_answer: Optional[str] = None
    explanation: Optional[str] = None
    points: int

    class Config:
        from_attributes = True


class QuizResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    difficulty: str
    category: str
    time_limit: int
    passing_score: int
    questions: List[QuizQuestionResponse] = []

    class Config:
        from_attributes = True


class QuizListResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    difficulty: str
    category: str
    time_limit: int
    question_count: int = 0
    best_score: Optional[int] = None

    class Config:
        from_attributes = True


class QuizSubmit(BaseModel):
    answers: dict  # {question_id: answer}
    time_taken: int = 0


class QuizAttemptResponse(BaseModel):
    id: int
    quiz_id: int
    score: int
    total_points: int
    passed: bool
    time_taken: int
    completed_at: datetime

    class Config:
        from_attributes = True
