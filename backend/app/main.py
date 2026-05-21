"""SQLMaster Backend - Main Application."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from pathlib import Path
from app.core.config import settings
from app.database.session import init_db
from app.routes import auth, lessons, quizzes, problems, playground, progress, admin


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    await init_db()
    yield


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Interactive SQL Learning Platform API",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api")
app.include_router(lessons.router, prefix="/api")
app.include_router(quizzes.router, prefix="/api")
app.include_router(problems.router, prefix="/api")
app.include_router(playground.router, prefix="/api")
app.include_router(progress.router, prefix="/api")
app.include_router(admin.router, prefix="/api")


@app.get("/api")
async def api_root():
    """API root endpoint."""
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running",
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


# Serve frontend static files in production
static_dir = Path(__file__).parent.parent / "static"
if static_dir.exists():
    app.mount("/", StaticFiles(directory=str(static_dir), html=True), name="static")
