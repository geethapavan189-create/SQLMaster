import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { quizAPI } from '../services/api';
import DifficultyBadge from '../components/DifficultyBadge';
import { CardSkeleton } from '../components/LoadingSkeleton';
import { Clock, HelpCircle, Trophy } from 'lucide-react';

export default function Quizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      const res = await quizAPI.getAll();
      setQuizzes(res.data);
    } catch (err) {
      console.error('Failed to load quizzes:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold text-white mb-2">Quizzes</h1>
        <p className="text-gray-400 mb-8">Test your SQL knowledge with topic-wise quizzes</p>
      </motion.div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizzes.map((quiz, i) => (
            <motion.div
              key={quiz.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={`/quizzes/${quiz.id}`}
                className="glass-card p-6 block hover:border-primary-500/50 transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <DifficultyBadge difficulty={quiz.difficulty} />
                  {quiz.best_score !== null && (
                    <span className="text-xs text-green-400 flex items-center gap-1">
                      <Trophy size={12} /> Best: {quiz.best_score}%
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-white group-hover:text-primary-300 transition-colors mb-2">
                  {quiz.title}
                </h3>
                <p className="text-sm text-gray-400 mb-4">{quiz.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <HelpCircle size={12} /> {quiz.question_count} questions
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {Math.floor(quiz.time_limit / 60)} min
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
