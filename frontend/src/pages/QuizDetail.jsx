import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { quizAPI } from '../services/api';
import { Clock, CheckCircle, XCircle, Loader2, RotateCcw, ArrowRight, Trophy } from 'lucide-react';
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
  const [showReview, setShowReview] = useState(false);

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
        toast.success('Quiz passed! 🎉');
      } else {
        toast('You need 75% to pass. Try again!', { icon: '💪' });
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Please login first to submit quiz.');
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const resetQuiz = () => {
    setSubmitted(false);
    setAnswers({});
    setCurrentQ(0);
    setTimeLeft(quiz.time_limit);
    setResult(null);
    setShowReview(false);
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-primary-500" size={32} /></div>;
  if (!quiz) return <div className="text-center py-20 text-gray-400">Quiz not found</div>;

  // Results Screen
  if (submitted && result) {
    const percentage = Math.round((result.score / result.total_points) * 100);
    const passed = percentage >= 75;

    if (showReview) {
      // Show all questions with correct answers
      return (
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-display font-bold text-white">Review Answers</h1>
            <div className="text-sm text-gray-400">{percentage}% Score</div>
          </div>

          <div className="space-y-4">
            {quiz.questions.map((q, i) => {
              const userAnswer = answers[q.id];
              const isCorrect = userAnswer === q.correct_answer;
              return (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`glass-card p-5 border-l-4 ${isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                      {isCorrect ? <CheckCircle size={14} className="text-green-400" /> : <XCircle size={14} className="text-red-400" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-400 mb-1">Question {i + 1}</p>
                      <p className="text-white font-medium">{q.question}</p>
                    </div>
                  </div>

                  {q.code_snippet && (
                    <pre className="bg-dark-900 border border-dark-700 rounded-lg p-3 mb-3 text-xs text-accent-400 font-mono overflow-x-auto ml-9">
                      {q.code_snippet}
                    </pre>
                  )}

                  <div className="ml-9 space-y-2">
                    {q.options?.map((option, j) => {
                      const isUserChoice = userAnswer === option;
                      const isCorrectAnswer = q.correct_answer === option;
                      let style = 'border-dark-700 bg-dark-800 text-gray-400';
                      if (isCorrectAnswer) style = 'border-green-500/50 bg-green-500/10 text-green-300';
                      else if (isUserChoice && !isCorrect) style = 'border-red-500/50 bg-red-500/10 text-red-300 line-through';

                      return (
                        <div key={j} className={`p-3 rounded-lg border text-sm ${style}`}>
                          <div className="flex items-center justify-between">
                            <span>{option}</span>
                            {isCorrectAnswer && <span className="text-xs text-green-400 font-medium">✓ Correct</span>}
                            {isUserChoice && !isCorrect && <span className="text-xs text-red-400">Your answer</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {q.explanation && (
                    <div className="ml-9 mt-3 p-3 bg-primary-500/5 border border-primary-500/20 rounded-lg">
                      <p className="text-xs text-primary-300"><strong>Explanation:</strong> {q.explanation}</p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          <div className="flex gap-3 justify-center mt-8">
            <button onClick={() => navigate('/quizzes')} className="btn-secondary">Back to Quizzes</button>
            <button onClick={resetQuiz} className="btn-primary flex items-center gap-2">
              <RotateCcw size={16} /> Try Again
            </button>
          </div>
        </div>
      );
    }

    // Score Summary Screen
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-8 text-center">
          <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 ${
            passed ? 'bg-green-500/20' : 'bg-red-500/20'
          }`}>
            {passed ? <Trophy size={48} className="text-green-400" /> : <XCircle size={48} className="text-red-400" />}
          </div>

          <h2 className="text-2xl font-display font-bold text-white mb-2">
            {passed ? '🎉 Quiz Passed!' : '❌ Not Passed'}
          </h2>

          <p className="text-5xl font-bold gradient-text mb-2">{percentage}%</p>
          <p className="text-gray-400 mb-2">{result.score}/{result.total_points} points</p>
          <p className="text-sm text-gray-500 mb-6">
            {passed ? 'Great job! You can proceed to the next chapter.' : 'You need at least 75% to pass. Review your answers and try again.'}
          </p>

          {/* Score breakdown */}
          <div className="flex justify-center gap-6 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{quiz.questions.filter(q => answers[q.id] === q.correct_answer).length}</div>
              <div className="text-xs text-gray-500">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{quiz.questions.filter(q => answers[q.id] && answers[q.id] !== q.correct_answer).length}</div>
              <div className="text-xs text-gray-500">Wrong</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-400">{quiz.questions.filter(q => !answers[q.id]).length}</div>
              <div className="text-xs text-gray-500">Skipped</div>
            </div>
          </div>

          {/* Pass requirement */}
          <div className="mb-6 p-3 rounded-lg bg-dark-800 border border-dark-700">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Pass requirement: 75%</span>
              <span className={passed ? 'text-green-400' : 'text-red-400'}>{passed ? '✓ Passed' : '✗ Not met'}</span>
            </div>
            <div className="w-full h-2 bg-dark-700 rounded-full mt-2 overflow-hidden">
              <div className={`h-full rounded-full transition-all ${passed ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${percentage}%` }} />
            </div>
          </div>

          <div className="flex gap-3 justify-center flex-wrap">
            <button onClick={() => setShowReview(true)} className="btn-secondary flex items-center gap-2">
              <CheckCircle size={16} /> Review Answers
            </button>
            <button onClick={resetQuiz} className="btn-secondary flex items-center gap-2">
              <RotateCcw size={16} /> Try Again
            </button>
            {passed && (
              <button onClick={() => navigate('/quizzes')} className="btn-primary flex items-center gap-2">
                Next Chapter <ArrowRight size={16} />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // Quiz Taking Screen
  const question = quiz.questions[currentQ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
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
            <button onClick={() => setCurrentQ(currentQ + 1)} className="btn-primary py-2 px-4 text-sm">
              Next
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
