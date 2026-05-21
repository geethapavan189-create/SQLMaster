import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { progressAPI } from '../services/api';
import { BookOpen, Code2, Trophy, Zap, Target, Flame, TrendingUp, Award } from 'lucide-react';
import { CardSkeleton } from '../components/LoadingSkeleton';

export default function Dashboard() {
  const { user } = useAuth();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const res = await progressAPI.getMyProgress();
      setProgress(res.data);
    } catch (err) {
      console.error('Failed to load progress:', err);
      // Fallback
      setProgress({ lessons_completed: 0, problems_solved: 0, total_xp: 0, current_streak: 0, longest_streak: 0, level: 1 });
    } finally {
      setLoading(false);
    }
  };

  const stats = progress ? [
    { label: 'Lessons Completed', value: progress.lessons_completed, icon: BookOpen, color: 'text-blue-400' },
    { label: 'Problems Solved', value: progress.problems_solved, icon: Code2, color: 'text-green-400' },
    { label: 'Total XP', value: progress.total_xp, icon: Zap, color: 'text-yellow-400' },
    { label: 'Current Streak', value: `${progress.current_streak} days`, icon: Flame, color: 'text-orange-400' },
  ] : [];

  const quickActions = [
    { to: '/learn', label: 'Continue Learning', icon: BookOpen, desc: 'Pick up where you left off' },
    { to: '/playground', label: 'SQL Playground', icon: Code2, desc: 'Practice queries live' },
    { to: '/problems', label: 'Solve Problems', icon: Target, desc: 'Challenge yourself' },
    { to: '/quizzes', label: 'Take a Quiz', icon: Trophy, desc: 'Test your knowledge' },
    { to: '/daily-challenge', label: 'Daily Challenge', icon: Zap, desc: "Today's challenge" },
    { to: '/leaderboard', label: 'Leaderboard', icon: TrendingUp, desc: 'See your ranking' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-display font-bold text-white">
          Welcome back, <span className="gradient-text">{user?.full_name || user?.username}</span>!
        </h1>
        <p className="text-gray-400 mt-1">Continue your SQL learning journey</p>
      </motion.div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1,2,3,4].map(i => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-5"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-dark-700 ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Level Progress */}
      {progress && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Award size={20} className="text-primary-400" />
              <span className="font-semibold text-white">Level {user?.level || 1}</span>
            </div>
            <span className="text-sm text-gray-400">{progress.total_xp} / {(user?.level || 1) * 500} XP</span>
          </div>
          <div className="w-full h-3 bg-dark-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((progress.total_xp / ((user?.level || 1) * 500)) * 100, 100)}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
            />
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-xl font-display font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, i) => (
            <Link
              key={i}
              to={action.to}
              className="glass-card p-5 hover:border-primary-500/50 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary-500/10 group-hover:bg-primary-500/20 transition-all">
                  <action.icon size={20} className="text-primary-400" />
                </div>
                <div>
                  <div className="font-medium text-white group-hover:text-primary-300 transition-colors">{action.label}</div>
                  <div className="text-xs text-gray-500">{action.desc}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
