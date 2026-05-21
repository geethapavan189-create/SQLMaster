"""Problem schemas."""
from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime


class ProblemResponse(BaseModel):
    id: int
    title: str
    slug: str
    description: str
    difficulty: str
    category: str
    dataset: str
    hint: Optional[str] = None
    starter_code: Optional[str] = None
    tags: Optional[List[str]] = None
    is_solved: bool = False

    class Config:
        from_attributes = True


class ProblemDetailResponse(ProblemResponse):
    expected_output: Optional[Any] = None
    solution: Optional[str] = None
    explanation: Optional[str] = None


class ProblemListResponse(BaseModel):
    id: int
    title: str
    slug: str
    difficulty: str
    category: str
    tags: Optional[List[str]] = None
    is_solved: bool = False

    class Config:
        from_attributes = True


class ProblemSubmit(BaseModel):
    query: str


class SubmissionResponse(BaseModel):
    is_correct: bool
    message: str
    expected_output: Optional[Any] = None
    actual_output: Optional[Any] = None
    execution_time: int = 0
