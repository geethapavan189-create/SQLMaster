"""Practice problems routes."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List, Optional
from app.database.session import get_db
from app.models.user import User
from app.models.problem import Problem, ProblemSubmission
from app.schemas.problem import ProblemResponse, ProblemDetailResponse, ProblemListResponse, ProblemSubmit, SubmissionResponse
from app.middleware.auth import get_current_user, get_optional_user

router = APIRouter(prefix="/problems", tags=["Problems"])


@router.get("/", response_model=List[ProblemListResponse])
async def get_problems(
    difficulty: Optional[str] = None,
    category: Optional[str] = None,
    dataset: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user),
):
    """Get all practice problems."""
    query = select(Problem).where(Problem.is_published == True).order_by(Problem.order_index)
    
    if difficulty:
        query = query.where(Problem.difficulty == difficulty)
    if category:
        query = query.where(Problem.category == category)
    if dataset:
        query = query.where(Problem.dataset == dataset)
    
    result = await db.execute(query)
    problems = result.scalars().all()
    
    # Get solved problems
    solved_ids = set()
    if current_user:
        solved_result = await db.execute(
            select(ProblemSubmission.problem_id).where(
                ProblemSubmission.user_id == current_user.id,
                ProblemSubmission.is_correct == True,
            ).distinct()
        )
        solved_ids = {row[0] for row in solved_result.all()}
    
    return [
        ProblemListResponse(
            id=p.id,
            title=p.title,
            slug=p.slug,
            difficulty=p.difficulty,
            category=p.category,
            tags=p.tags,
            is_solved=p.id in solved_ids,
        )
        for p in problems
    ]


@router.get("/{slug}", response_model=ProblemDetailResponse)
async def get_problem(
    slug: str,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user),
):
    """Get a single problem by slug."""
    result = await db.execute(select(Problem).where(Problem.slug == slug))
    problem = result.scalar_one_or_none()
    
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    
    is_solved = False
    if current_user:
        solved_result = await db.execute(
            select(ProblemSubmission).where(
                ProblemSubmission.user_id == current_user.id,
                ProblemSubmission.problem_id == problem.id,
                ProblemSubmission.is_correct == True,
            )
        )
        is_solved = solved_result.scalar_one_or_none() is not None
    
    return ProblemDetailResponse(
        id=problem.id,
        title=problem.title,
        slug=problem.slug,
        description=problem.description,
        difficulty=problem.difficulty,
        category=problem.category,
        dataset=problem.dataset,
        hint=problem.hint,
        starter_code=problem.starter_code,
        tags=problem.tags,
        expected_output=problem.expected_output,
        solution=problem.solution if is_solved else None,
        explanation=problem.explanation if is_solved else None,
        is_solved=is_solved,
    )


@router.post("/{problem_id}/submit", response_model=SubmissionResponse)
async def submit_problem(
    problem_id: int,
    submission: ProblemSubmit,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Submit a solution to a problem."""
    result = await db.execute(select(Problem).where(Problem.id == problem_id))
    problem = result.scalar_one_or_none()
    
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    
    # Simple validation: compare normalized queries
    user_query = submission.query.strip().lower().rstrip(";")
    solution_query = problem.solution.strip().lower().rstrip(";")
    
    is_correct = user_query == solution_query
    
    # Save submission
    sub = ProblemSubmission(
        user_id=current_user.id,
        problem_id=problem_id,
        query=submission.query,
        is_correct=is_correct,
    )
    db.add(sub)
    
    if is_correct:
        current_user.xp_points += 30
    
    await db.commit()
    
    return SubmissionResponse(
        is_correct=is_correct,
        message="Correct! Well done!" if is_correct else "Not quite right. Try again!",
        expected_output=problem.expected_output,
    )
