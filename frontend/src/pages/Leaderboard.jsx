import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { progressAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Trophy, Medal, Crown, Zap } from 'lucide-react';
import { CardSkeleton } from '../components/LoadingSkeleton';

export default function Leaderboard() {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const res = await progressAPI.getLeaderboard();
      setEntries(res.data);
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown size={20} className="text-yellow-400" />;
    if (rank === 2) return <Medal size={20} className="text-gray-300" />;
    if (rank === 3) return <Medal size={20} className="text-amber-600" />;
    return <span className="text-sm text-gray-500 w-5 text-center">{rank}</span>;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-8">
          <Trophy size={40} className="mx-auto text-yellow-400 mb-3" />
          <h1 className="text-3xl font-display font-bold text-white">Leaderboard</h1>
          <p className="text-gray-400 mt-1">Top SQL learners ranked by XP</p>
        </div>
      </motion.div>

      {loading ? (
        <div className="space-y-3">{[1,2,3,4,5].map(i => <CardSkeleton key={i} />)}</div>
      ) : (
        <div className="space-y-2">
          {entries.map((entry, i) => (
            <motion.div
              key={entry.user_id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`glass-card p-4 flex items-center gap-4 ${
                entry.user_id === user?.id ? 'border-primary-500/50 bg-primary-500/5' : ''
              }`}
            >
              <div className="w-8 flex justify-center">{getRankIcon(entry.rank)}</div>
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-white">
                  {entry.username?.[0]?.toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-white truncate">
                  {entry.username}
                  {entry.user_id === user?.id && <span className="text-xs text-primary-400 ml-2">(You)</span>}
                </div>
                <div className="text-xs text-gray-500">Level {entry.level} • {entry.problems_solved} problems solved</div>
              </div>
              <div className="flex items-center gap-1 text-yellow-400 font-semibold">
                <Zap size={14} />
                {entry.xp_points}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
