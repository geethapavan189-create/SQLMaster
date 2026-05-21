"""Quiz routes."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List, Optional
from app.database.session import get_db
from app.models.user import User
from app.models.quiz import Quiz, QuizQuestion, QuizAttempt
from app.schemas.quiz import QuizResponse, QuizListResponse, QuizSubmit, QuizAttemptResponse, QuizQuestionResponse
from app.middleware.auth import get_current_user, get_optional_user

router = APIRouter(prefix="/quizzes", tags=["Quizzes"])


@router.get("/", response_model=List[QuizListResponse])
async def get_quizzes(
    difficulty: Optional[str] = None,
    category: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user),
):
    """Get all quizzes."""
    query = select(Quiz).where(Quiz.is_published == True)
    
    if difficulty:
        query = query.where(Quiz.difficulty == difficulty)
    if category:
        query = query.where(Quiz.category == category)
    
    result = await db.execute(query)
    quizzes = result.scalars().all()
    
    response = []
    for quiz in quizzes:
        # Count questions
        q_count = await db.execute(
            select(func.count(QuizQuestion.id)).where(QuizQuestion.quiz_id == quiz.id)
        )
        question_count = q_count.scalar() or 0
        
        # Get best score
        best_score = None
        if current_user:
            score_result = await db.execute(
                select(func.max(QuizAttempt.score)).where(
                    QuizAttempt.user_id == current_user.id,
                    QuizAttempt.quiz_id == quiz.id,
                )
            )
            best_score = score_result.scalar()
        
        response.append(QuizListResponse(
            id=quiz.id,
            title=quiz.title,
            description=quiz.description,
            difficulty=quiz.difficulty,
            category=quiz.category,
            time_limit=quiz.time_limit,
            question_count=question_count,
            best_score=best_score,
        ))
    
    return response


@router.get("/{quiz_id}", response_model=QuizResponse)
async def get_quiz(quiz_id: int, db: AsyncSession = Depends(get_db)):
    """Get quiz with questions."""
    result = await db.execute(select(Quiz).where(Quiz.id == quiz_id, Quiz.is_published == True))
    quiz = result.scalar_one_or_none()
    
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    # Get questions (without correct answers)
    q_result = await db.execute(
        select(QuizQuestion).where(QuizQuestion.quiz_id == quiz_id).order_by(QuizQuestion.order_index)
    )
    questions = q_result.scalars().all()
    
    return QuizResponse(
        id=quiz.id,
        title=quiz.title,
        description=quiz.description,
        difficulty=quiz.difficulty,
        category=quiz.category,
        time_limit=quiz.time_limit,
        passing_score=quiz.passing_score,
        questions=[QuizQuestionResponse.model_validate(q) for q in questions],
    )


@router.post("/{quiz_id}/submit", response_model=QuizAttemptResponse)
async def submit_quiz(
    quiz_id: int,
    submission: QuizSubmit,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Submit quiz answers."""
    # Get quiz
    result = await db.execute(select(Quiz).where(Quiz.id == quiz_id))
    quiz = result.scalar_one_or_none()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    # Get questions
    q_result = await db.execute(
        select(QuizQuestion).where(QuizQuestion.quiz_id == quiz_id)
    )
    questions = q_result.scalars().all()
    
    # Calculate score
    total_points = sum(q.points for q in questions)
    score = 0
    for q in questions:
        user_answer = submission.answers.get(str(q.id))
        if user_answer and str(user_answer).strip().lower() == str(q.correct_answer).strip().lower():
            score += q.points
    
    passed = (score / total_points * 100) >= quiz.passing_score if total_points > 0 else False
    
    # Save attempt
    attempt = QuizAttempt(
        user_id=current_user.id,
        quiz_id=quiz_id,
        score=score,
        total_points=total_points,
        answers=submission.answers,
        time_taken=submission.time_taken,
        passed=passed,
    )
    db.add(attempt)
    
    # Award XP
    xp_earned = score // 2
    current_user.xp_points += xp_earned
    
    await db.commit()
    await db.refresh(attempt)
    
    return QuizAttemptResponse.model_validate(attempt)
