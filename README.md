# SQLMaster - Interactive SQL Learning Platform

A modern, full-stack SQL learning platform for beginners to advanced learners. Built with React, FastAPI, and PostgreSQL.

![SQLMaster](https://img.shields.io/badge/SQLMaster-v1.0.0-8B5CF6)
![React](https://img.shields.io/badge/React-18-61DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791)

## Features

- **Structured Lessons** - From SQL basics to advanced topics
- **Live SQL Playground** - Write and execute queries in real-time
- **300+ Practice Problems** - Easy, Medium, and Hard difficulty
- **Quizzes** - Topic-wise assessments with scoring
- **Daily Challenges** - New SQL challenges every day
- **Interview Preparation** - Top SQL interview questions
- **Gamification** - XP system, achievements, leaderboard
- **Progress Tracking** - Track lessons, problems, and streaks
- **Admin Panel** - Manage content and users

## Tech Stack

### Frontend
- React 18 + Vite
- Tailwind CSS
- React Router v6
- Framer Motion
- Monaco Editor
- Axios

### Backend
- Python FastAPI
- SQLAlchemy (async)
- PostgreSQL
- JWT Authentication
- Pydantic

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL 15+

### Option 1: Docker (Recommended)

```bash
docker-compose up -d
```

The app will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Option 2: Manual Setup

#### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Set up environment
cp .env.example .env
# Edit .env with your database credentials

# Run the server
uvicorn app.main:app --reload --port 8000

# Seed the database (in another terminal)
python seed.py
```

#### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## Project Structure

```
sqlmaster/
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── layouts/       # Layout wrappers
│   │   ├── context/       # React context providers
│   │   ├── services/      # API service layer
│   │   ├── hooks/         # Custom React hooks
│   │   └── utils/         # Utility functions
│   ├── public/
│   └── package.json
├── backend/
│   ├── app/
│   │   ├── routes/        # API route handlers
│   │   ├── models/        # SQLAlchemy models
│   │   ├── schemas/       # Pydantic schemas
│   │   ├── services/      # Business logic
│   │   ├── middleware/    # Auth middleware
│   │   ├── database/     # DB session management
│   │   ├── core/         # Config and security
│   │   └── utils/        # Utilities
│   ├── seed.py
│   └── requirements.txt
├── docker-compose.yml
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/me | Get current user |
| GET | /api/lessons | List all lessons |
| GET | /api/lessons/:slug | Get lesson detail |
| POST | /api/lessons/:id/progress | Update progress |
| GET | /api/quizzes | List quizzes |
| POST | /api/quizzes/:id/submit | Submit quiz |
| GET | /api/problems | List problems |
| POST | /api/problems/:id/submit | Submit solution |
| POST | /api/playground/execute | Execute SQL |
| POST | /api/playground/explain | Explain query |
| GET | /api/progress/me | Get user progress |
| GET | /api/progress/leaderboard | Get leaderboard |
| GET | /api/progress/daily-challenge | Get daily challenge |

## Default Admin Account

- Email: admin@sqlmaster.com
- Password: admin123

## Deployment

### Frontend (Vercel)
1. Connect your GitHub repo to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variable: `VITE_API_URL`

### Backend (Render)
1. Create a new Web Service on Render
2. Set build command: `pip install -r requirements.txt`
3. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add environment variables from `.env.example`

### Database (Supabase)
1. Create a new project on Supabase
2. Get the connection string from Settings > Database
3. Update `DATABASE_URL` in your backend environment

## License

MIT
