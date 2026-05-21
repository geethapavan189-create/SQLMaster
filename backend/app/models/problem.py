"""Practice problem models."""
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from app.database.session import Base


class Problem(Base):
    __tablename__ = "problems"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    slug = Column(String(200), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=False)
    difficulty = Column(String(20), nullable=False)  # easy, medium, hard
    category = Column(String(100), nullable=False)
    dataset = Column(String(50), nullable=False)  # employees, ecommerce, students
    expected_output = Column(JSON, nullable=True)
    hint = Column(Text, nullable=True)
    solution = Column(Text, nullable=False)
    explanation = Column(Text, nullable=True)
    starter_code = Column(Text, nullable=True)
    test_query = Column(Text, nullable=True)  # Query to validate user's answer
    tags = Column(JSON, nullable=True)
    is_published = Column(Boolean, default=True)
    order_index = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ProblemSubmission(Base):
    __tablename__ = "problem_submissions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    problem_id = Column(Integer, ForeignKey("problems.id"), nullable=False)
    query = Column(Text, nullable=False)
    is_correct = Column(Boolean, default=False)
    execution_time = Column(Integer, default=0)  # ms
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())
