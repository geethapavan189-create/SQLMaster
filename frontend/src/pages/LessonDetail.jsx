import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { lessonAPI, playgroundAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import DifficultyBadge from '../components/DifficultyBadge';
import { PageSkeleton } from '../components/LoadingSkeleton';
import {
  Clock, CheckCircle, ChevronLeft, ChevronRight, Lightbulb,
  Code2, Play, BookOpen, Loader2, Lock, ArrowRight, Terminal
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function LessonDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [lesson, setLesson] = useState(null);
  const [allLessons, setAllLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [exercisePassed, setExercisePassed] = useState(false);
  const [tryQuery, setTryQuery] = useState('');
  const [queryResult, setQueryResult] = useState(null);
  const [executing, setExecuting] = useState(false);
  const [activeTab, setActiveTab] = useState('lesson');

  useEffect(() => {
    loadLesson();
    loadAllLessons();
    setCompleted(false);
    setExercisePassed(false);
    setQueryResult(null);
    setActiveTab('lesson');
    window.scrollTo(0, 0);
  }, [slug]);

  const loadLesson = async () => {
    setLoading(true);
    try {
      const res = await lessonAPI.getBySlug(slug);
      setLesson(res.data);
      // Set a safe default query for practice
      setTryQuery('SELECT * FROM employees LIMIT 10;');
    } catch (err) {
      console.error('Failed to load lesson:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadAllLessons = async () => {
    try {
      const res = await lessonAPI.getAll();
      setAllLessons(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const currentIndex = allLessons.findIndex(l => l.slug === slug);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const markComplete = async () => {
    if (!user) {
      toast.error('Please login to track progress');
      return;
    }
    try {
      await lessonAPI.updateProgress(lesson.id, { is_completed: true });
      setCompleted(true);
      toast.success('Lesson completed! +20 XP 🎉');
    } catch (err) {
      toast.error('Failed to update progress');
    }
  };

  const runTryQuery = async () => {
    if (!tryQuery.trim()) return;
    setExecuting(true);
    try {
      const res = await playgroundAPI.execute({ query: tryQuery, dataset: 'employees' });
      setQueryResult(res.data);
      if (res.data.success && res.data.row_count > 0) {
        setExercisePassed(true);
        if (!completed) {
          toast.success('Great job! You can now proceed to the next lesson.');
        }
      }
    } catch (err) {
      setQueryResult({ success: false, message: 'Execution failed' });
    } finally {
      setExecuting(false);
    }
  };

  const goToNext = () => {
    if (nextLesson) {
      navigate(`/learn/${nextLesson.slug}`);
    }
  };

  // Render markdown content as formatted HTML
  const renderContent = (content) => {
    if (!content) return null;
    const lines = content.split('\n');
    const elements = [];
    let i = 0;
    let inCodeBlock = false;
    let codeLines = [];
    let inTable = false;
    let tableRows = [];

    while (i < lines.length) {
      const line = lines[i];

      // Code blocks
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <pre key={`code-${i}`} className="bg-dark-900 border border-dark-700 rounded-lg p-4 my-4 overflow-x-auto">
              <code className="text-sm font-mono text-accent-400">{codeLines.join('\n')}</code>
            </pre>
          );
          codeLines = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        i++;
        continue;
      }

      if (inCodeBlock) {
        codeLines.push(line);
        i++;
        continue;
      }

      // Tables
      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        if (!inTable) {
          inTable = true;
          tableRows = [];
        }
        // Skip separator rows
        if (!line.match(/^\|[\s\-:|]+\|$/)) {
          const cells = line.split('|').filter(c => c.trim() !== '').map(c => c.trim());
          tableRows.push(cells);
        }
        // Check if next line is not a table
        if (i + 1 >= lines.length || !lines[i + 1].trim().startsWith('|')) {
          inTable = false;
          const header = tableRows[0];
          const body = tableRows.slice(1);
          elements.push(
            <div key={`table-${i}`} className="overflow-x-auto my-4 rounded-lg border border-dark-700">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-dark-800">
                    {header?.map((h, j) => (
                      <th key={j} className="text-left px-4 py-2.5 text-gray-200 font-semibold border-b border-dark-700">{renderInline(h)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {body.map((row, ri) => (
                    <tr key={ri} className="border-b border-dark-800 hover:bg-dark-800/30">
                      {row.map((cell, ci) => (
                        <td key={ci} className="px-4 py-2 text-gray-300">{renderInline(cell)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        i++;
        continue;
      }

      // Headers
      if (line.startsWith('# ')) {
        elements.push(<h1 key={`h1-${i}`} className="text-2xl font-display font-bold text-white mt-8 mb-4">{renderInline(line.slice(2))}</h1>);
        i++; continue;
      }
      if (line.startsWith('## ')) {
        elements.push(<h2 key={`h2-${i}`} className="text-xl font-display font-bold text-white mt-8 mb-3 pb-2 border-b border-dark-700">{renderInline(line.slice(3))}</h2>);
        i++; continue;
      }
      if (line.startsWith('### ')) {
        elements.push(<h3 key={`h3-${i}`} className="text-lg font-display font-semibold text-white mt-5 mb-2">{renderInline(line.slice(4))}</h3>);
        i++; continue;
      }

      // Blockquote
      if (line.startsWith('> ')) {
        elements.push(
          <blockquote key={`bq-${i}`} className="border-l-4 border-primary-500 bg-primary-500/5 px-4 py-3 my-4 rounded-r-lg">
            <p className="text-gray-200 italic">{renderInline(line.slice(2))}</p>
          </blockquote>
        );
        i++; continue;
      }

      // Unordered list
      if (line.match(/^[-*] /)) {
        const listItems = [];
        while (i < lines.length && lines[i].match(/^[-*] /)) {
          listItems.push(lines[i].replace(/^[-*] /, ''));
          i++;
        }
        elements.push(
          <ul key={`ul-${i}`} className="my-3 space-y-1.5 pl-1">
            {listItems.map((item, j) => (
              <li key={j} className="flex items-start gap-2 text-gray-300">
                <span className="text-primary-400 mt-1.5 text-xs">●</span>
                <span>{renderInline(item)}</span>
              </li>
            ))}
          </ul>
        );
        continue;
      }

      // Ordered list
      if (line.match(/^\d+\. /)) {
        const listItems = [];
        while (i < lines.length && lines[i].match(/^\d+\. /)) {
          listItems.push(lines[i].replace(/^\d+\. /, ''));
          i++;
        }
        elements.push(
          <ol key={`ol-${i}`} className="my-3 space-y-1.5 pl-1">
            {listItems.map((item, j) => (
              <li key={j} className="flex items-start gap-3 text-gray-300">
                <span className="text-primary-400 font-bold text-sm min-w-[20px]">{j + 1}.</span>
                <span>{renderInline(item)}</span>
              </li>
            ))}
          </ol>
        );
        continue;
      }

      // Empty line
      if (line.trim() === '') {
        i++; continue;
      }

      // Paragraph
      elements.push(<p key={`p-${i}`} className="text-gray-300 leading-relaxed my-3">{renderInline(line)}</p>);
      i++;
    }

    return elements;
  };

  // Render inline markdown (bold, code, italic, links)
  const renderInline = (text) => {
    if (!text) return text;
    const parts = [];
    let remaining = text;
    let key = 0;

    while (remaining.length > 0) {
      // Inline code
      const codeMatch = remaining.match(/^(.*?)`([^`]+)`(.*)$/);
      if (codeMatch) {
        if (codeMatch[1]) parts.push(<span key={key++}>{renderInline(codeMatch[1])}</span>);
        parts.push(<code key={key++} className="bg-dark-900 text-accent-400 px-1.5 py-0.5 rounded text-sm font-mono">{codeMatch[2]}</code>);
        remaining = codeMatch[3];
        continue;
      }

      // Bold
      const boldMatch = remaining.match(/^(.*?)\*\*([^*]+)\*\*(.*)$/);
      if (boldMatch) {
        if (boldMatch[1]) parts.push(<span key={key++}>{boldMatch[1]}</span>);
        parts.push(<strong key={key++} className="text-white font-semibold">{boldMatch[2]}</strong>);
        remaining = boldMatch[3];
        continue;
      }

      // Italic
      const italicMatch = remaining.match(/^(.*?)\*([^*]+)\*(.*)$/);
      if (italicMatch) {
        if (italicMatch[1]) parts.push(<span key={key++}>{italicMatch[1]}</span>);
        parts.push(<em key={key++} className="text-gray-200">{italicMatch[2]}</em>);
        remaining = italicMatch[3];
        continue;
      }

      // No more inline formatting
      parts.push(<span key={key++}>{remaining}</span>);
      break;
    }

    return parts.length === 1 ? parts[0] : parts;
  };

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-8"><PageSkeleton /></div>;
  if (!lesson) return <div className="text-center py-20 text-gray-400">Lesson not found</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-6">
        <Link to="/learn" className="inline-flex items-center gap-1 text-gray-400 hover:text-white transition-colors">
          <ChevronLeft size={16} /> All Lessons
        </Link>
        <div className="text-sm text-gray-500">
          {currentIndex + 1} / {allLessons.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-dark-800 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-500"
          style={{ width: `${allLessons.length ? ((currentIndex + 1) / allLessons.length) * 100 : 0}%` }}
        />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header Card */}
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <DifficultyBadge difficulty={lesson.difficulty} />
            <span className="text-sm text-gray-500 bg-dark-700 px-2 py-0.5 rounded">{lesson.category}</span>
            <span className="flex items-center gap-1 text-sm text-gray-500">
              <Clock size={14} /> {lesson.estimated_time} min
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">{lesson.title}</h1>
          <p className="text-gray-400">{lesson.description}</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-6 bg-dark-800 p-1 rounded-lg">
          {[
            { id: 'lesson', label: 'Lesson', icon: BookOpen },
            { id: 'examples', label: 'Examples', icon: Code2 },
            { id: 'practice', label: 'Practice', icon: Terminal },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                  : 'text-gray-400 hover:text-white hover:bg-dark-700'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'lesson' && (
            <motion.div key="lesson" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
              {/* Main Content */}
              <div className="glass-card p-6 sm:p-8 mb-6">
                {renderContent(lesson.content)}
              </div>

              {/* Syntax Reference */}
              {lesson.syntax && (
                <div className="glass-card p-6 mb-6 border-l-4 border-l-accent-500">
                  <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
                    <BookOpen size={16} className="text-accent-400" /> Quick Syntax Reference
                  </h3>
                  <pre className="bg-dark-900 rounded-lg p-4 text-sm text-accent-400 font-mono overflow-x-auto border border-dark-700">
                    <code>{lesson.syntax.replace(/\\n/g, '\n')}</code>
                  </pre>
                </div>
              )}

              {/* Tips */}
              {lesson.tips && lesson.tips.length > 0 && (
                <div className="glass-card p-6 mb-6 border-l-4 border-l-yellow-500/70">
                  <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
                    <Lightbulb size={16} className="text-yellow-400" /> Key Takeaways
                  </h3>
                  <div className="space-y-2">
                    {lesson.tips.map((tip, i) => (
                      <div key={i} className="flex items-start gap-3 text-gray-300 text-sm bg-dark-800/50 p-3 rounded-lg">
                        <span className="text-yellow-400 text-lg leading-none">💡</span>
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'examples' && (
            <motion.div key="examples" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
              {lesson.examples && lesson.examples.length > 0 ? (
                <div className="space-y-4">
                  {lesson.examples.map((example, i) => (
                    <div key={i} className="glass-card overflow-hidden">
                      <div className="flex items-center justify-between px-5 py-3 bg-dark-800 border-b border-dark-700">
                        <span className="font-medium text-white text-sm">{example.title}</span>
                        <button
                          onClick={() => {
                            const code = example.code.replace(/\\n/g, '\n');
                            if (code.toUpperCase().includes('CREATE') || code.toUpperCase().includes('DROP')) {
                              toast('This is a demo query. Try a SELECT query in Practice!', { icon: 'ℹ️' });
                              return;
                            }
                            setTryQuery(code);
                            setActiveTab('practice');
                          }}
                          className="text-xs bg-primary-500/20 text-primary-300 hover:bg-primary-500/30 px-3 py-1 rounded-full flex items-center gap-1 transition-all"
                        >
                          <Play size={10} /> Run this
                        </button>
                      </div>
                      <pre className="p-5 text-sm text-accent-400 font-mono overflow-x-auto bg-dark-900">
                        <code>{example.code.replace(/\\n/g, '\n')}</code>
                      </pre>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass-card p-12 text-center text-gray-500">
                  No examples for this lesson yet.
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'practice' && (
            <motion.div key="practice" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
              <div className="glass-card p-6 border-2 border-primary-500/20">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-display font-semibold text-white flex items-center gap-2">
                    <Terminal size={20} className="text-primary-400" /> Try It Yourself
                  </h2>
                  {exercisePassed && (
                    <span className="flex items-center gap-1 text-green-400 text-sm font-medium bg-green-500/10 px-3 py-1 rounded-full">
                      <CheckCircle size={14} /> Passed
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-400 mb-4">
                  Write and run a SQL query to practice what you learned. You must successfully run a query to unlock the next lesson.
                </p>
                <div className="rounded-lg overflow-hidden border border-dark-700 mb-4">
                  <Editor
                    height="180px"
                    defaultLanguage="sql"
                    value={tryQuery}
                    onChange={(value) => setTryQuery(value || '')}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      fontFamily: 'JetBrains Mono, Fira Code, monospace',
                      lineNumbers: 'on',
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      padding: { top: 12, bottom: 12 },
                      wordWrap: 'on',
                    }}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={runTryQuery}
                    disabled={executing}
                    className="btn-primary py-2.5 px-5 text-sm flex items-center gap-2"
                  >
                    {executing ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
                    Run Query
                  </button>
                  <span className="text-xs text-gray-500">⌘+Enter to run</span>
                </div>

                {/* Query Result */}
                {queryResult && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-5">
                    <div className={`flex items-center gap-2 text-sm mb-3 p-3 rounded-lg ${
                      queryResult.success ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {queryResult.success ? <CheckCircle size={16} /> : '✗'}
                      <span>{queryResult.message}</span>
                      {queryResult.execution_time > 0 && (
                        <span className="text-gray-500 ml-auto text-xs">{queryResult.execution_time}ms</span>
                      )}
                    </div>
                    {queryResult.columns?.length > 0 && (
                      <div className="overflow-x-auto max-h-64 rounded-lg border border-dark-700">
                        <table className="w-full text-sm">
                          <thead className="sticky top-0 z-10">
                            <tr className="bg-dark-800">
                              {queryResult.columns.map((col, ci) => (
                                <th key={ci} className="text-left py-2.5 px-4 text-gray-300 font-medium border-b border-dark-700 whitespace-nowrap">{col}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {queryResult.rows?.slice(0, 15).map((row, ri) => (
                              <tr key={ri} className="border-b border-dark-800 hover:bg-dark-800/50">
                                {row.map((cell, ci) => (
                                  <td key={ci} className="py-2 px-4 text-gray-300 whitespace-nowrap">
                                    {cell === null ? <span className="text-gray-600 italic">NULL</span> : String(cell)}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {queryResult.row_count > 15 && (
                          <div className="text-xs text-gray-500 p-2 text-center bg-dark-800 border-t border-dark-700">
                            Showing 15 of {queryResult.row_count} rows
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Navigation */}
        <div className="mt-8 flex flex-col gap-4">
          {/* Complete & Next */}
          {!completed && exercisePassed && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <button onClick={markComplete} className="btn-primary inline-flex items-center gap-2 px-8 py-3">
                <CheckCircle size={18} /> Complete & Continue
              </button>
            </motion.div>
          )}

          {completed && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-6 text-center border border-green-500/30 bg-green-500/5">
              <CheckCircle size={32} className="mx-auto text-green-400 mb-2" />
              <p className="text-green-400 font-semibold text-lg">Lesson Completed! +20 XP</p>
              {nextLesson && (
                <button onClick={goToNext} className="btn-primary mt-4 inline-flex items-center gap-2">
                  Next: {nextLesson.title} <ArrowRight size={16} />
                </button>
              )}
            </motion.div>
          )}

          {/* Prev / Next buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-dark-700">
            {prevLesson ? (
              <Link to={`/learn/${prevLesson.slug}`} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
                <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                <div className="text-left">
                  <div className="text-xs text-gray-500">Previous</div>
                  <div className="text-sm font-medium">{prevLesson.title}</div>
                </div>
              </Link>
            ) : <div />}

            {nextLesson ? (
              exercisePassed || completed ? (
                <Link to={`/learn/${nextLesson.slug}`} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group text-right">
                  <div>
                    <div className="text-xs text-gray-500">Next</div>
                    <div className="text-sm font-medium">{nextLesson.title}</div>
                  </div>
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <div className="flex items-center gap-2 text-gray-600 text-right cursor-not-allowed" title="Complete the practice exercise to unlock">
                  <div>
                    <div className="text-xs">Next (locked)</div>
                    <div className="text-sm font-medium">{nextLesson.title}</div>
                  </div>
                  <Lock size={16} />
                </div>
              )
            ) : <div />}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
