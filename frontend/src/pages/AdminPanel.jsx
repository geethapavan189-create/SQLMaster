import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';
import {
  Users, BookOpen, HelpCircle, Code2, Shield, ToggleLeft, ToggleRight,
  Trash2, Eye, X, Zap, Flame, Trophy, Calendar, Mail, User
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminPanel() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

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

  const deleteUser = async (userId) => {
    try {
      await adminAPI.deleteUser(userId);
      setUsers(users.filter(u => u.id !== userId));
      setShowDeleteConfirm(null);
      setSelectedUser(null);
      toast.success('User deleted successfully');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to delete user');
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
    { id: 'overview', label: 'Overview', icon: Shield },
    { id: 'users', label: 'Users', icon: Users },
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
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id ? 'bg-primary-500 text-white' : 'bg-dark-800 text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Users', value: stats.total_users, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                { label: 'Total Lessons', value: stats.total_lessons, icon: BookOpen, color: 'text-green-400', bg: 'bg-green-500/10' },
                { label: 'Total Quizzes', value: stats.total_quizzes, icon: HelpCircle, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                { label: 'Total Problems', value: stats.total_problems, icon: Code2, color: 'text-orange-400', bg: 'bg-orange-500/10' },
              ].map((stat, i) => (
                <div key={i} className="glass-card p-5">
                  <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center mb-3`}>
                    <stat.icon size={20} className={stat.color} />
                  </div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Recent Users */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Recent Users</h2>
              <div className="space-y-3">
                {users.slice(0, 5).map(u => (
                  <div key={u.id} className="flex items-center justify-between p-3 bg-dark-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-white">{u.username?.[0]?.toUpperCase()}</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{u.username}</div>
                        <div className="text-xs text-gray-500">{u.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-yellow-400 flex items-center gap-1"><Zap size={12} />{u.xp_points} XP</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${u.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {u.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            {/* User count */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">{users.length} total users</span>
            </div>

            {/* Users Table */}
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-dark-700 bg-dark-800/50">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">User</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium hidden sm:table-cell">Email</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">XP</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Level</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Streak</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} className="border-b border-dark-800 hover:bg-dark-800/30 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-bold text-white">{u.username?.[0]?.toUpperCase()}</span>
                            </div>
                            <div>
                              <div className="text-white font-medium">{u.username}</div>
                              <div className="text-xs text-gray-500 sm:hidden">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-400 hidden sm:table-cell">{u.email}</td>
                        <td className="py-3 px-4">
                          <span className="text-yellow-400 flex items-center gap-1"><Zap size={12} />{u.xp_points}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-primary-400 font-medium">{u.level}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-orange-400 flex items-center gap-1"><Flame size={12} />{u.streak_days}d</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${u.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {u.is_active ? 'Active' : 'Disabled'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedUser(u)}
                              className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-all"
                              title="View details"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => toggleUser(u.id)}
                              className="p-1.5 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded transition-all"
                              title={u.is_active ? 'Disable' : 'Enable'}
                            >
                              {u.is_active ? <ToggleRight size={16} className="text-green-400" /> : <ToggleLeft size={16} />}
                            </button>
                            {!u.is_admin && (
                              <button
                                onClick={() => setShowDeleteConfirm(u.id)}
                                className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-all"
                                title="Delete user"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* User Detail Modal */}
        <AnimatePresence>
          {selectedUser && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedUser(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="glass-card p-6 w-full max-w-md"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">User Details</h3>
                  <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-white">
                    <X size={20} />
                  </button>
                </div>

                {/* User Avatar & Name */}
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-white">{selectedUser.username?.[0]?.toUpperCase()}</span>
                  </div>
                  <h4 className="text-xl font-bold text-white">{selectedUser.full_name || selectedUser.username}</h4>
                  <p className="text-gray-400">@{selectedUser.username}</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-dark-800 rounded-lg p-3 text-center">
                    <Zap size={16} className="mx-auto text-yellow-400 mb-1" />
                    <div className="text-lg font-bold text-white">{selectedUser.xp_points}</div>
                    <div className="text-xs text-gray-500">XP</div>
                  </div>
                  <div className="bg-dark-800 rounded-lg p-3 text-center">
                    <Trophy size={16} className="mx-auto text-primary-400 mb-1" />
                    <div className="text-lg font-bold text-white">{selectedUser.level}</div>
                    <div className="text-xs text-gray-500">Level</div>
                  </div>
                  <div className="bg-dark-800 rounded-lg p-3 text-center">
                    <Flame size={16} className="mx-auto text-orange-400 mb-1" />
                    <div className="text-lg font-bold text-white">{selectedUser.streak_days}</div>
                    <div className="text-xs text-gray-500">Streak</div>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail size={14} className="text-gray-500" />
                    <span className="text-gray-300">{selectedUser.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar size={14} className="text-gray-500" />
                    <span className="text-gray-300">Joined: {new Date(selectedUser.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <User size={14} className="text-gray-500" />
                    <span className="text-gray-300">Role: {selectedUser.is_admin ? 'Admin' : 'User'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Shield size={14} className="text-gray-500" />
                    <span className={selectedUser.is_active ? 'text-green-400' : 'text-red-400'}>
                      {selectedUser.is_active ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => { toggleUser(selectedUser.id); setSelectedUser({...selectedUser, is_active: !selectedUser.is_active}); }}
                    className="flex-1 btn-secondary py-2 text-sm flex items-center justify-center gap-2"
                  >
                    {selectedUser.is_active ? <ToggleLeft size={14} /> : <ToggleRight size={14} />}
                    {selectedUser.is_active ? 'Disable' : 'Enable'}
                  </button>
                  {!selectedUser.is_admin && (
                    <button
                      onClick={() => { setShowDeleteConfirm(selectedUser.id); }}
                      className="flex-1 py-2 text-sm bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
              onClick={() => setShowDeleteConfirm(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="glass-card p-6 w-full max-w-sm text-center"
                onClick={e => e.stopPropagation()}
              >
                <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 size={24} className="text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Delete User?</h3>
                <p className="text-sm text-gray-400 mb-6">
                  This action cannot be undone. All user data, progress, and submissions will be permanently deleted.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 btn-secondary py-2 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => deleteUser(showDeleteConfirm)}
                    className="flex-1 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all font-medium"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
