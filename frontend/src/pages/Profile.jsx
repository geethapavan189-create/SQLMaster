import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { progressAPI, authAPI } from '../services/api';
import { User, Mail, Calendar, Zap, Award, Flame, BookOpen, Code2, Trophy } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [progress, setProgress] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ full_name: '', bio: '' });

  useEffect(() => {
    if (user) {
      setFormData({ full_name: user.full_name || '', bio: user.bio || '' });
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const [progressRes, achievementsRes] = await Promise.all([
        progressAPI.getMyProgress(),
        progressAPI.getAchievements(),
      ]);
      setProgress(progressRes.data);
      setAchievements(achievementsRes.data);
    } catch (err) {
      console.error('Failed to load profile data:', err);
    }
  };

  const handleSave = async () => {
    try {
      const res = await authAPI.updateMe(formData);
      updateUser(res.data);
      setEditing(false);
      toast.success('Profile updated');
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Profile Card */}
        <div className="glass-card p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-white">{user.username?.[0]?.toUpperCase()}</span>
            </div>
            <div className="flex-1 text-center sm:text-left">
              {editing ? (
                <div className="space-y-3">
                  <input
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    className="input-field"
                    placeholder="Full Name"
                  />
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    className="input-field"
                    placeholder="Bio"
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <button onClick={handleSave} className="btn-primary py-2 px-4 text-sm">Save</button>
                    <button onClick={() => setEditing(false)} className="btn-secondary py-2 px-4 text-sm">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-display font-bold text-white">{user.full_name || user.username}</h1>
                  <p className="text-gray-400">@{user.username}</p>
                  {user.bio && <p className="text-gray-300 mt-2 text-sm">{user.bio}</p>}
                  <button onClick={() => setEditing(true)} className="mt-3 text-sm text-primary-400 hover:text-primary-300">
                    Edit Profile
                  </button>
                </>
              )}
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text">{user.xp_points}</div>
              <div className="text-sm text-gray-500">Total XP</div>
              <div className="text-sm text-primary-400 mt-1">Level {user.level}</div>
            </div>
          </div>
        </div>

        {/* Stats */}
        {progress && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { icon: BookOpen, label: 'Lessons', value: progress.lessons_completed, color: 'text-blue-400' },
              { icon: Code2, label: 'Problems', value: progress.problems_solved, color: 'text-green-400' },
              { icon: Trophy, label: 'Quizzes', value: progress.quizzes_completed, color: 'text-purple-400' },
              { icon: Flame, label: 'Streak', value: `${progress.current_streak}d`, color: 'text-orange-400' },
            ].map((stat, i) => (
              <div key={i} className="glass-card p-4 text-center">
                <stat.icon size={20} className={`mx-auto mb-2 ${stat.color}`} />
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Achievements */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-display font-semibold text-white mb-4 flex items-center gap-2">
            <Award size={20} className="text-yellow-400" /> Achievements
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {achievements.map((achievement, i) => (
              <div
                key={i}
                className={`p-4 rounded-lg border text-center ${
                  achievement.earned
                    ? 'bg-primary-500/10 border-primary-500/30'
                    : 'bg-dark-800 border-dark-700 opacity-50'
                }`}
              >
                <div className="text-2xl mb-1">{achievement.icon}</div>
                <div className="text-sm font-medium text-white">{achievement.name}</div>
                <div className="text-xs text-gray-500 mt-1">{achievement.description}</div>
                {achievement.earned && (
                  <div className="text-xs text-primary-400 mt-1">+{achievement.xp_reward} XP</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
