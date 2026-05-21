import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Learn from './pages/Learn';
import LessonDetail from './pages/LessonDetail';
import Playground from './pages/Playground';
import Problems from './pages/Problems';
import ProblemDetail from './pages/ProblemDetail';
import Quizzes from './pages/Quizzes';
import QuizDetail from './pages/QuizDetail';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import DailyChallenge from './pages/DailyChallenge';
import InterviewPrep from './pages/InterviewPrep';
import Roadmap from './pages/Roadmap';
import AdminPanel from './pages/AdminPanel';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

export default function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <AuthProvider>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1E293B',
              color: '#F8FAFC',
              border: '1px solid #334155',
            },
          }}
        />
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/learn/:slug" element={<LessonDetail />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/playground" element={<Playground />} />
            <Route path="/problems" element={<Problems />} />
            <Route path="/problems/:slug" element={<ProblemDetail />} />
            <Route path="/quizzes" element={<Quizzes />} />
            <Route path="/quizzes/:id" element={<QuizDetail />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/interview-prep" element={<InterviewPrep />} />
            <Route path="/daily-challenge" element={<DailyChallenge />} />
            <Route
              path="/dashboard"
              element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
            />
            <Route
              path="/profile"
              element={<ProtectedRoute><Profile /></ProtectedRoute>}
            />
            <Route
              path="/admin"
              element={<ProtectedRoute><AdminPanel /></ProtectedRoute>}
            />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
    </GoogleOAuthProvider>
  );
}
