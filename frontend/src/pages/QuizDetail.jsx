import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { quizAPI } from '../services/api';
import { Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function QuizDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    loadQuiz();
  }, [id]);

  useEffect(() => {
    if (quiz && !submitted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            handleSubmit();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [quiz, submitted, timeLeft]);

  const loadQuiz = async () => {
    try {
      const res = await quizAPI.getById(id);
      setQuiz(res.data);
      setTimeLeft(res.data.time_limit);
    } catch (err) {
      console.error('Failed to load quiz:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectAnswer = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleSubmit = async () => {
    try {
      const res = await quizAPI.submit(id, {
        answers,
        time_taken: quiz.time_limit - timeLeft,
      });
      setResult(res.data);
      setSubmitted(true);
      if (res.data.passed) {
        toast.success('Quiz passed! Great job!');
      } else {
        toast('Keep practicing! You can try again.', { icon: '💪' });
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Submission failed. Please login first.');
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-primary-500" size={32} /></div>;
  if (!quiz) return <div className="text-center py-20 text-gray-400">Quiz not found</div>;

  if (submitted && result) {
    const percentage = Math.round((result.score / result.total_points) * 100);
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-8 text-center">
          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
            result.passed ? 'bg-green-500/20' : 'bg-red-500/20'
          }`}>
            {result.passed ? <CheckCircle size={40} className="text-green-400" /> : <XCircle size={40} className="text-red-400" />}
          </div>
          <h2 className="text-2xl font-display font-bold text-white mb-2">
            {result.passed ? 'Quiz Passed!' : 'Not Quite!'}
          </h2>
          <p className="text-4xl font-bold gradient-text mb-2">{percentage}%</p>
          <p className="text-gray-400 mb-6">{result.score}/{result.total_points} points</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate('/quizzes')} className="btn-secondary">Back to Quizzes</button>
            <button onClick={() => { setSubmitted(false); setAnswers({}); setCurrentQ(0); setTimeLeft(quiz.time_limit); setResult(null); }} className="btn-primary">Try Again</button>
          </div>
        </motion.div>
      </div>
    );
  }

  const question = quiz.questions[currentQ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-display font-bold text-white">{quiz.title}</h1>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
          timeLeft < 60 ? 'bg-red-500/20 text-red-400' : 'bg-dark-800 text-gray-300'
        }`}>
          <Clock size={16} />
          <span className="font-mono text-sm">{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="flex gap-1 mb-6">
        {quiz.questions.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all ${
              i === currentQ ? 'bg-primary-500' : answers[quiz.questions[i]?.id] ? 'bg-green-500' : 'bg-dark-700'
            }`}
          />
        ))}
      </div>

      {/* Question */}
      <motion.div key={currentQ} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6">
        <div className="text-sm text-gray-500 mb-2">Question {currentQ + 1} of {quiz.questions.length}</div>
        <h2 className="text-lg font-semibold text-white mb-4">{question.question}</h2>

        {question.code_snippet && (
          <pre className="bg-dark-900 border border-dark-700 rounded-lg p-4 mb-4 text-sm text-accent-400 font-mono overflow-x-auto">
            {question.code_snippet}
          </pre>
        )}

        <div className="space-y-3">
          {question.options?.map((option, i) => (
            <button
              key={i}
              onClick={() => selectAnswer(question.id, option)}
              className={`w-full text-left p-4 rounded-lg border transition-all ${
                answers[question.id] === option
                  ? 'border-primary-500 bg-primary-500/10 text-white'
                  : 'border-dark-700 bg-dark-800 text-gray-300 hover:border-dark-600'
              }`}
            >
              <span className="text-sm">{option}</span>
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
            disabled={currentQ === 0}
            className="btn-secondary py-2 px-4 text-sm disabled:opacity-50"
          >
            Previous
          </button>
          {currentQ === quiz.questions.length - 1 ? (
            <button onClick={handleSubmit} className="btn-primary py-2 px-4 text-sm">
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={() => setCurrentQ(currentQ + 1)}
              className="btn-primary py-2 px-4 text-sm"
            >
              Next
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
