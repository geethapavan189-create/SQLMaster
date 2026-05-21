import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Database, Menu, X, User, LogOut, Trophy, BookOpen, Code2, Map } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/learn', label: 'Learn', icon: BookOpen },
    { to: '/roadmap', label: 'Roadmap', icon: Map },
    { to: '/playground', label: 'Playground', icon: Code2 },
    { to: '/problems', label: 'Problems', icon: Database },
    { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-900/80 backdrop-blur-xl border-b border-dark-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-primary-500/30 transition-all">
              <Database size={18} className="text-white" />
            </div>
            <span className="text-xl font-display font-bold gradient-text">SQLMaster</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-dark-800 rounded-lg transition-all"
              >
                <link.icon size={16} />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-dark-800 transition-all"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {user.username?.[0]?.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-gray-300">{user.username}</span>
                  <span className="text-xs text-primary-400 font-medium">{user.xp_points} XP</span>
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 glass-card p-2 shadow-xl"
                    >
                      <Link to="/dashboard" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-dark-700 rounded-lg" onClick={() => setProfileOpen(false)}>
                        <User size={16} /> Dashboard
                      </Link>
                      <Link to="/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-dark-700 rounded-lg" onClick={() => setProfileOpen(false)}>
                        <User size={16} /> Profile
                      </Link>
                      <button onClick={handleLogout} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-dark-700 rounded-lg">
                        <LogOut size={16} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-secondary text-sm py-2 px-4">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-dark-800 border-b border-dark-700"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center gap-2 px-4 py-3 text-gray-300 hover:text-white hover:bg-dark-700 rounded-lg"
                  onClick={() => setMobileOpen(false)}
                >
                  <link.icon size={18} />
                  {link.label}
                </Link>
              ))}
              {!user && (
                <div className="pt-2 border-t border-dark-700 space-y-2">
                  <Link to="/login" className="block text-center btn-secondary py-2" onClick={() => setMobileOpen(false)}>Login</Link>
                  <Link to="/register" className="block text-center btn-primary py-2" onClick={() => setMobileOpen(false)}>Sign Up</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
