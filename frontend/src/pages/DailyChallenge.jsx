import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { progressAPI, playgroundAPI } from '../services/api';
import DifficultyBadge from '../components/DifficultyBadge';
import { Zap, Calendar, Lightbulb, Play, Loader2, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DailyChallenge() {
  const [challenge, setChallenge] = useState(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    loadChallenge();
  }, []);

  const loadChallenge = async () => {
    try {
      const res = await progressAPI.getDailyChallenge();
      setChallenge(res.data);
    } catch (err) {
      console.error('Failed to load challenge:', err);
    } finally {
      setLoading(false);
    }
  };

  const submitChallenge = async () => {
    if (!query.trim()) {
      toast.error('Please write a query');
      return;
    }
    setSubmitting(true);
    try {
      const res = await playgroundAPI.execute({ query, dataset: challenge.dataset });
      if (res.data.success) {
        toast.success(`Challenge completed! +${challenge.xp_reward} XP`);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error('Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="animate-spin text-primary-500" size={32} /></div>;
  if (!challenge) return <div className="text-center py-20 text-gray-400">No challenge available today</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-500/10 border border-accent-500/30 rounded-full mb-4">
            <Calendar size={14} className="text-accent-400" />
            <span className="text-sm text-accent-300">Daily Challenge</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-white">{challenge.title}</h1>
        </div>

        {/* Challenge Card */}
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <DifficultyBadge difficulty={challenge.difficulty} />
            <span className="text-sm text-gray-500">Dataset: {challenge.dataset}</span>
            <span className="flex items-center gap-1 text-sm text-yellow-400">
              <Zap size={14} /> +{challenge.xp_reward} XP
            </span>
          </div>
          <p className="text-gray-300 mb-4">{challenge.description}</p>

          {challenge.is_completed && (
            <div className="flex items-center gap-2 text-green-400 mb-4">
              <CheckCircle size={18} /> You've already completed today's challenge!
            </div>
          )}

          {challenge.hint && (
            <div>
              <button
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-2 text-sm text-yellow-400 hover:text-yellow-300"
              >
                <Lightbulb size={14} /> {showHint ? 'Hide Hint' : 'Show Hint'}
              </button>
              {showHint && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 text-sm text-yellow-200 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3"
                >
                  {challenge.hint}
                </motion.p>
              )}
            </div>
          )}
        </div>

        {/* Editor */}
        <div className="glass-card overflow-hidden mb-4">
          <div className="h-64">
            <Editor
              height="100%"
              defaultLanguage="sql"
              value={query}
              onChange={(value) => setQuery(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: 'JetBrains Mono, Fira Code, monospace',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 16 },
              }}
            />
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={submitChallenge}
            disabled={submitting || challenge.is_completed}
            className="btn-primary flex items-center gap-2"
          >
            {submitting ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} />}
            Submit Solution
          </button>
        </div>
      </motion.div>
    </div>
  );
}
