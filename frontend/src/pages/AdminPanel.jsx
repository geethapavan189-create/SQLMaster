import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';
import { Users, BookOpen, HelpCircle, Code2, Shield, ToggleLeft, ToggleRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminPanel() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user?.is_admin) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getUsers(),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleUser = async (userId) => {
    try {
      await adminAPI.toggleUser(userId);
      setUsers(users.map(u => u.id === userId ? { ...u, is_active: !u.is_active } : u));
      toast.success('User status updated');
    } catch (err) {
      toast.error('Failed to update user');
    }
  };

  if (!user?.is_admin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Shield size={48} className="mx-auto text-red-400 mb-4" />
          <h2 className="text-xl font-bold text-white">Access Denied</h2>
          <p className="text-gray-400">Admin privileges required</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'users', label: 'Users' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold text-white mb-6 flex items-center gap-3">
          <Shield size={28} className="text-primary-400" /> Admin Panel
        </h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id ? 'bg-primary-500 text-white' : 'bg-dark-800 text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Users', value: stats.total_users, icon: Users, color: 'text-blue-400' },
              { label: 'Total Lessons', value: stats.total_lessons, icon: BookOpen, color: 'text-green-400' },
              { label: 'Total Quizzes', value: stats.total_quizzes, icon: HelpCircle, color: 'text-purple-400' },
              { label: 'Total Problems', value: stats.total_problems, icon: Code2, color: 'text-orange-400' },
            ].map((stat, i) => (
              <div key={i} className="glass-card p-5">
                <stat.icon size={24} className={`${stat.color} mb-3`} />
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-dark-700">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">User</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Email</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">XP</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="border-b border-dark-800 hover:bg-dark-800/50">
                      <td className="py-3 px-4 text-white">{u.username}</td>
                      <td className="py-3 px-4 text-gray-400">{u.email}</td>
                      <td className="py-3 px-4 text-yellow-400">{u.xp_points}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${u.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {u.is_active ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button onClick={() => toggleUser(u.id)} className="text-gray-400 hover:text-white">
                          {u.is_active ? <ToggleRight size={20} className="text-green-400" /> : <ToggleLeft size={20} />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
