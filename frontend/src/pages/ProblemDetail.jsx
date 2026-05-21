import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { problemAPI } from '../services/api';
import DifficultyBadge from '../components/DifficultyBadge';
import { ChevronLeft, Play, Lightbulb, Eye, Loader2, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProblemDetail() {
  const { slug } = useParams();
  const [problem, setProblem] = useState(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  useEffect(() => {
    loadProblem();
  }, [slug]);

  const loadProblem = async () => {
    try {
      const res = await problemAPI.getBySlug(slug);
      setProblem(res.data);
      setQuery(res.data.starter_code || '');
    } catch (err) {
      console.error('Failed to load problem:', err);
    } finally {
      setLoading(false);
    }
  };

  const submitSolution = async () => {
    if (!query.trim()) {
      toast.error('Please write a query');
      return;
    }
    setSubmitting(true);
    try {
      const res = await problemAPI.submit(problem.id, { query });
      setResult(res.data);
      if (res.data.is_correct) {
        toast.success('Correct! +30 XP');
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-primary-500" size={32} /></div>;
  if (!problem) return <div className="text-center py-20 text-gray-400">Problem not found</div>;

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col lg:flex-row">
      {/* Left - Problem description */}
      <div className="lg:w-1/2 overflow-y-auto border-r border-dark-700 p-6">
        <Link to="/problems" className="inline-flex items-center gap-1 text-gray-400 hover:text-white mb-4 transition-colors">
          <ChevronLeft size={16} /> Back
        </Link>

        <div className="flex items-center gap-3 mb-4">
          <DifficultyBadge difficulty={problem.difficulty} />
          <span className="text-sm text-gray-500">{problem.category}</span>
        </div>

        <h1 className="text-2xl font-display font-bold text-white mb-4">{problem.title}</h1>
        <p className="text-gray-300 mb-6 whitespace-pre-wrap">{problem.description}</p>

        {/* Tags */}
        {problem.tags && (
          <div className="flex flex-wrap gap-2 mb-6">
            {problem.tags.map((tag, i) => (
              <span key={i} className="text-xs bg-dark-700 text-gray-400 px-2 py-1 rounded">{tag}</span>
            ))}
          </div>
        )}

        {/* Hint */}
        {problem.hint && (
          <div className="mb-4">
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-2 text-sm text-yellow-400 hover:text-yellow-300"
            >
              <Lightbulb size={14} /> {showHint ? 'Hide Hint' : 'Show Hint'}
            </button>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-sm text-yellow-200"
              >
                {problem.hint}
              </motion.div>
            )}
          </div>
        )}

        {/* Solution (only if solved) */}
        {problem.solution && (
          <div className="mb-4">
            <button
              onClick={() => setShowSolution(!showSolution)}
              className="flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300"
            >
              <Eye size={14} /> {showSolution ? 'Hide Solution' : 'View Solution'}
            </button>
            {showSolution && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-2 p-3 bg-dark-800 border border-dark-700 rounded-lg"
              >
                <pre className="text-sm text-accent-400 font-mono">{problem.solution}</pre>
                {problem.explanation && (
                  <p className="mt-2 text-sm text-gray-400">{problem.explanation}</p>
                )}
              </motion.div>
            )}
          </div>
        )}

        {/* Result */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg border ${
              result.is_correct
                ? 'bg-green-500/10 border-green-500/30'
                : 'bg-red-500/10 border-red-500/30'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {result.is_correct ? (
                <CheckCircle size={18} className="text-green-400" />
              ) : (
                <XCircle size={18} className="text-red-400" />
              )}
              <span className={`font-medium ${result.is_correct ? 'text-green-400' : 'text-red-400'}`}>
                {result.message}
              </span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Right - Editor */}
      <div className="lg:w-1/2 flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 bg-dark-800 border-b border-dark-700">
          <span className="text-sm text-gray-400">Write your SQL query</span>
          <button
            onClick={submitSolution}
            disabled={submitting}
            className="btn-primary py-1.5 px-4 text-sm flex items-center gap-1.5"
          >
            {submitting ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
            Submit
          </button>
        </div>
        <div className="flex-1">
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
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              wordWrap: 'on',
              padding: { top: 16 },
            }}
          />
        </div>
      </div>
    </div>
  );
}
