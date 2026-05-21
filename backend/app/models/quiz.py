"""Quiz models."""
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from app.database.session import Base


class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=True)
    difficulty = Column(String(20), nullable=False)
    category = Column(String(100), nullable=False)
    time_limit = Column(Integer, default=300)  # seconds
    passing_score = Column(Integer, default=70)  # percentage
    is_published = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class QuizQuestion(Base):
    __tablename__ = "quiz_questions"

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"), nullable=False)
    question = Column(Text, nullable=False)
    question_type = Column(String(30), nullable=False)  # mcq, output_prediction, query_correction
    options = Column(JSON, nullable=True)  # For MCQs
    correct_answer = Column(Text, nullable=False)
    explanation = Column(Text, nullable=True)
    code_snippet = Column(Text, nullable=True)
    points = Column(Integer, default=10)
    order_index = Column(Integer, default=0)


class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"), nullable=False)
    score = Column(Integer, default=0)
    total_points = Column(Integer, default=0)
    answers = Column(JSON, nullable=True)
    time_taken = Column(Integer, default=0)  # seconds
    passed = Column(Boolean, default=False)
    completed_at = Column(DateTime(timezone=True), server_default=func.now())
