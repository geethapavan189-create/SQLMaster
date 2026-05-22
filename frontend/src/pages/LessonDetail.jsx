import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { lessonAPI, playgroundAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import DifficultyBadge from '../components/DifficultyBadge';
import { PageSkeleton } from '../components/LoadingSkeleton';
import {
  Clock, CheckCircle, ChevronLeft, ChevronRight, Lightbulb,
  Code2, Play, BookOpen, Loader2, Lock, ArrowRight, Terminal,
  HelpCircle, XCircle, Trophy
} from 'lucide-react';
import toast from 'react-hot-toast';

// Module quiz questions per lesson slug
const moduleQuizzes = {
  'introduction-to-databases': {
    questions: [
      { q: "What is a database?", options: ["A programming language", "An organized collection of data", "A web browser", "An operating system"], answer: 1 },
      { q: "Which type of database uses tables with rows and columns?", options: ["NoSQL", "Graph Database", "Relational Database", "File System"], answer: 2 },
      { q: "What is a Primary Key?", options: ["The first column", "A unique identifier for each row", "The table name", "A password"], answer: 1 },
    ],
    codeProblems: [
      { task: "Write a query to see all data in the employees table.", solution: "SELECT * FROM employees", hint: "Use SELECT * FROM table_name" },
      { task: "Write a query to count how many employees exist.", solution: "SELECT COUNT(*) FROM employees", hint: "Use COUNT(*)" },
    ]
  },
  'what-is-sql': {
    questions: [
      { q: "What does SQL stand for?", options: ["Simple Query Language", "Structured Query Language", "System Query Logic", "Standard Query Language"], answer: 1 },
      { q: "Which SQL command retrieves data?", options: ["GET", "FETCH", "SELECT", "READ"], answer: 2 },
      { q: "SQL statements should end with:", options: ["A period (.)", "A semicolon (;)", "A colon (:)", "Nothing"], answer: 1 },
    ],
    codeProblems: [
      { task: "Select all columns from the departments table.", solution: "SELECT * FROM departments", hint: "Use SELECT * FROM table_name" },
      { task: "Select only the first_name column from employees.", solution: "SELECT first_name FROM employees", hint: "List specific column names after SELECT" },
    ]
  },
  'sql-select': {
    questions: [
      { q: "What does SELECT * do?", options: ["Selects the first column", "Selects all columns", "Deletes all data", "Creates a table"], answer: 1 },
      { q: "What keyword renames a column in output?", options: ["RENAME", "AS", "ALIAS", "NAME"], answer: 1 },
      { q: "DISTINCT removes:", options: ["NULL values", "All rows", "Duplicate rows", "Empty columns"], answer: 2 },
    ],
    codeProblems: [
      { task: "Select first_name and salary from employees.", solution: "SELECT first_name, salary FROM employees", hint: "List columns separated by commas" },
      { task: "Select distinct department_id values from employees.", solution: "SELECT DISTINCT department_id FROM employees", hint: "Use DISTINCT before the column name" },
      { task: "Select first_name with alias 'name' from employees.", solution: "SELECT first_name AS name FROM employees", hint: "Use AS to create an alias" },
    ]
  },
  'sql-where': {
    questions: [
      { q: "WHERE clause is used to:", options: ["Sort data", "Filter rows", "Group data", "Join tables"], answer: 1 },
      { q: "Which operator means 'not equal'?", options: ["==", "!=", "NOT", "<>"], answer: 1 },
      { q: "LIKE 'J%' matches:", options: ["Ends with J", "Contains J", "Starts with J", "Exactly J"], answer: 2 },
    ],
    codeProblems: [
      { task: "Find employees with salary greater than 80000.", solution: "SELECT * FROM employees WHERE salary > 80000", hint: "Use WHERE with > operator" },
      { task: "Find employees in department_id 1.", solution: "SELECT * FROM employees WHERE department_id = 1", hint: "Use WHERE column = value" },
      { task: "Find employees whose first_name starts with 'S'.", solution: "SELECT * FROM employees WHERE first_name LIKE 'S%'", hint: "Use LIKE with 'S%'" },
    ]
  },
  'sql-order-by': {
    questions: [
      { q: "ORDER BY default direction is:", options: ["DESC", "ASC", "RANDOM", "None"], answer: 1 },
      { q: "To sort highest salary first, use:", options: ["ORDER BY salary ASC", "ORDER BY salary DESC", "SORT salary HIGH", "WHERE salary MAX"], answer: 1 },
      { q: "Can you ORDER BY a column not in SELECT?", options: ["No", "Yes", "Only with GROUP BY", "Only numbers"], answer: 1 },
    ],
    codeProblems: [
      { task: "List all employees sorted by salary (highest first).", solution: "SELECT * FROM employees ORDER BY salary DESC", hint: "Use ORDER BY column DESC" },
      { task: "List employees sorted by last_name alphabetically.", solution: "SELECT * FROM employees ORDER BY last_name ASC", hint: "Use ORDER BY column ASC" },
    ]
  },
  'sql-limit-offset': {
    questions: [
      { q: "LIMIT 5 returns:", options: ["5 columns", "First 5 rows", "Last 5 rows", "5 tables"], answer: 1 },
      { q: "OFFSET 10 means:", options: ["Return 10 rows", "Skip first 10 rows", "Start from row 10", "Limit to 10"], answer: 1 },
      { q: "For page 3 with 10 items per page, OFFSET is:", options: ["10", "20", "30", "3"], answer: 1 },
    ],
    codeProblems: [
      { task: "Get the top 3 highest-paid employees.", solution: "SELECT * FROM employees ORDER BY salary DESC LIMIT 3", hint: "ORDER BY DESC + LIMIT" },
      { task: "Get employees 6-10 (page 2, 5 per page).", solution: "SELECT * FROM employees LIMIT 5 OFFSET 5", hint: "LIMIT 5 OFFSET 5" },
    ]
  },
};

// Default quiz for lessons without specific questions
const defaultModuleQuiz = {
  questions: [
    { q: "Did you understand the main concept of this lesson?", options: ["Yes, completely", "Mostly", "Need to review", "Not at all"], answer: 0 },
    { q: "Can you write the basic syntax from memory?", options: ["Yes", "With some help", "Need to practice more", "No"], answer: 0 },
    { q: "Are you ready for the next lesson?", options: ["Yes, let's go!", "Almost", "Need more practice", "Not yet"], answer: 0 },
  ],
  codeProblems: [
    { task: "Write any SELECT query on the employees table.", solution: "SELECT * FROM employees", hint: "Try: SELECT * FROM employees" },
    { task: "Write a query that uses WHERE to filter data.", solution: "SELECT * FROM employees WHERE salary > 50000", hint: "Try: SELECT * FROM employees WHERE salary > 50000" },
  ]
};

export default function LessonDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [lesson, setLesson] = useState(null);
  const [allLessons, setAllLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [activeTab, setActiveTab] = useState('lesson');
  // Module test state
  const [quizAnswers, setQuizAnswers] = useState({});
  const [codeAnswers, setCodeAnswers] = useState({});
  const [codeResults, setCodeResults] = useState({});
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [testPassed, setTestPassed] = useState(false);
  const [testScore, setTestScore] = useState(0);
  const [executing, setExecuting] = useState(null);

  useEffect(() => {
    loadLesson();
    loadAllLessons();
    resetState();
    window.scrollTo(0, 0);
  }, [slug]);

  const resetState = () => {
    setCompleted(false);
    setActiveTab('lesson');
    setQuizAnswers({});
    setCodeAnswers({});
    setCodeResults({});
    setTestSubmitted(false);
    setTestPassed(false);
    setTestScore(0);
  };

  const loadLesson = async () => {
    setLoading(true);
    try {
      const res = await lessonAPI.getBySlug(slug);
      setLesson(res.data);
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
    } catch (err) { setAllLessons([]); }
  };

  const currentIndex = allLessons.findIndex(l => l.slug === slug);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
  const moduleTest = moduleQuizzes[slug] || defaultModuleQuiz;

  // Check if this lesson is locked (previous lesson not completed)
  const isLocked = currentIndex > 0 && allLessons[currentIndex - 1] && !allLessons[currentIndex - 1].is_completed;

  if (!loading && allLessons.length > 0 && isLocked) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="glass-card p-10">
          <Lock size={48} className="mx-auto text-gray-500 mb-4" />
          <h2 className="text-2xl font-display font-bold text-white mb-2">Lesson Locked</h2>
          <p className="text-gray-400 mb-6">
            You need to complete <strong className="text-white">"{prevLesson?.title}"</strong> and pass its module test before accessing this lesson.
          </p>
          <Link to={`/learn/${prevLesson?.slug}`} className="btn-primary inline-flex items-center gap-2">
            <ChevronLeft size={16} /> Go to Previous Lesson
          </Link>
        </div>
      </div>
    );
  }

  const runCode = async (problemIdx) => {
    const code = codeAnswers[problemIdx];
    if (!code?.trim()) { toast.error('Write a query first'); return; }
    setExecuting(problemIdx);
    try {
      const res = await playgroundAPI.execute({ query: code, dataset: 'employees' });
      setCodeResults({ ...codeResults, [problemIdx]: res.data });
    } catch (err) {
      setCodeResults({ ...codeResults, [problemIdx]: { success: false, message: 'Execution failed' } });
    } finally {
      setExecuting(null);
    }
  };

  const submitModuleTest = async () => {
    const quiz = moduleTest;
    let correct = 0;
    const total = quiz.questions.length + quiz.codeProblems.length;

    // Check quiz answers
    quiz.questions.forEach((q, i) => {
      if (quizAnswers[i] === q.answer) correct++;
    });

    // Check code answers (must have run successfully)
    quiz.codeProblems.forEach((p, i) => {
      const result = codeResults[i];
      if (result && result.success && result.row_count > 0) correct++;
    });

    const score = Math.round((correct / total) * 100);
    setTestScore(score);
    setTestSubmitted(true);

    if (score >= 75) {
      setTestPassed(true);
      setCompleted(true);
      if (user) {
        try {
          await lessonAPI.updateProgress(lesson.id, { is_completed: true });
          toast.success(`Module passed! ${score}% — +20 XP 🎉`);
        } catch (err) {}
      }
    } else {
      toast.error(`${score}% — You need 75% to pass. Try again!`);
    }
  };

  const renderContent = (content) => {
    if (!content) return null;
    const lines = content.split('\n');
    const elements = [];
    let i = 0;
    let inCodeBlock = false;
    let codeLines = [];

    while (i < lines.length) {
      const line = lines[i];

      // Code block start/end
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
      if (inCodeBlock) { codeLines.push(line); i++; continue; }

      // Table detection
      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        const tableRows = [];
        while (i < lines.length && lines[i].trim().startsWith('|')) {
          const row = lines[i];
          if (!row.match(/^\|[\s\-:|]+\|$/)) {
            tableRows.push(row.split('|').filter(c => c.trim() !== '').map(c => c.trim()));
          }
          i++;
        }
        if (tableRows.length > 0) {
          const header = tableRows[0];
          const body = tableRows.slice(1);
          elements.push(
            <div key={`table-${i}`} className="overflow-x-auto my-4 rounded-lg border border-dark-700">
              <table className="w-full text-sm">
                <thead><tr className="bg-dark-800">{header.map((h, j) => <th key={j} className="text-left px-4 py-2.5 text-gray-200 font-semibold border-b border-dark-700">{renderInline(h)}</th>)}</tr></thead>
                <tbody>{body.map((row, ri) => <tr key={ri} className="border-b border-dark-800 hover:bg-dark-800/30">{row.map((cell, ci) => <td key={ci} className="px-4 py-2 text-gray-300">{renderInline(cell)}</td>)}</tr>)}</tbody>
              </table>
            </div>
          );
        }
        continue;
      }

      // Headers
      if (line.startsWith('# ')) { elements.push(<h1 key={i} className="text-2xl font-display font-bold text-white mt-8 mb-4">{renderInline(line.slice(2))}</h1>); i++; continue; }
      if (line.startsWith('## ')) { elements.push(<h2 key={i} className="text-xl font-display font-bold text-white mt-8 mb-3 pb-2 border-b border-dark-700">{renderInline(line.slice(3))}</h2>); i++; continue; }
      if (line.startsWith('### ')) { elements.push(<h3 key={i} className="text-lg font-display font-semibold text-gray-100 mt-5 mb-2">{renderInline(line.slice(4))}</h3>); i++; continue; }

      // Blockquote
      if (line.startsWith('> ')) { elements.push(<blockquote key={i} className="border-l-4 border-primary-500 bg-primary-500/5 px-4 py-3 my-3 rounded-r-lg"><p className="text-gray-200 italic">{renderInline(line.slice(2))}</p></blockquote>); i++; continue; }

      // List items
      if (line.match(/^[-*] /)) {
        const items = [];
        while (i < lines.length && lines[i].match(/^[-*] /)) { items.push(lines[i].replace(/^[-*] /, '')); i++; }
        elements.push(<ul key={`ul-${i}`} className="my-3 space-y-2 pl-2">{items.map((item, j) => <li key={j} className="flex items-start gap-2 text-gray-300"><span className="text-primary-400 mt-1.5 text-xs flex-shrink-0">●</span><span>{renderInline(item)}</span></li>)}</ul>);
        continue;
      }
      if (line.match(/^\d+\. /)) {
        const items = [];
        while (i < lines.length && lines[i].match(/^\d+\. /)) { items.push(lines[i].replace(/^\d+\. /, '')); i++; }
        elements.push(<ol key={`ol-${i}`} className="my-3 space-y-2 pl-2">{items.map((item, j) => <li key={j} className="flex items-start gap-3 text-gray-300"><span className="text-primary-400 font-bold text-sm min-w-[20px] flex-shrink-0">{j+1}.</span><span>{renderInline(item)}</span></li>)}</ol>);
        continue;
      }

      // Empty line
      if (line.trim() === '') { i++; continue; }

      // Regular paragraph
      elements.push(<p key={i} className="text-gray-300 leading-relaxed my-2">{renderInline(line)}</p>);
      i++;
    }
    return elements;
  };

  const renderInline = (text) => {
    if (!text) return text;
    // Process inline formatting: **bold**, `code`, *italic*
    const parts = [];
    const regex = /(\*\*(.+?)\*\*|`([^`]+)`|\*([^*]+)\*)/g;
    let lastIndex = 0;
    let match;
    let key = 0;

    while ((match = regex.exec(text)) !== null) {
      // Add text before match
      if (match.index > lastIndex) {
        parts.push(<span key={key++}>{text.slice(lastIndex, match.index)}</span>);
      }
      if (match[2]) { // **bold**
        parts.push(<strong key={key++} className="text-white font-semibold">{match[2]}</strong>);
      } else if (match[3]) { // `code`
        parts.push(<code key={key++} className="bg-dark-900 text-accent-400 px-1.5 py-0.5 rounded text-sm font-mono border border-dark-700">{match[3]}</code>);
      } else if (match[4]) { // *italic*
        parts.push(<em key={key++} className="text-gray-200 italic">{match[4]}</em>);
      }
      lastIndex = match.index + match[0].length;
    }
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(<span key={key++}>{text.slice(lastIndex)}</span>);
    }
    return parts.length === 0 ? text : parts;
  };

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-8"><PageSkeleton /></div>;
  if (!lesson) return <div className="text-center py-20 text-gray-400">Lesson not found</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Nav */}
      <div className="flex items-center justify-between mb-4">
        <Link to="/learn" className="inline-flex items-center gap-1 text-gray-400 hover:text-white transition-colors">
          <ChevronLeft size={16} /> All Lessons
        </Link>
        <span className="text-sm text-gray-500">{currentIndex + 1}/{allLessons.length}</span>
      </div>

      {/* Progress */}
      <div className="w-full h-1.5 bg-dark-800 rounded-full mb-6 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all" style={{ width: `${allLessons.length ? ((currentIndex + 1) / allLessons.length) * 100 : 0}%` }} />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <DifficultyBadge difficulty={lesson.difficulty} />
            <span className="text-sm text-gray-500">{lesson.category}</span>
            <span className="flex items-center gap-1 text-sm text-gray-500"><Clock size={14} /> {lesson.estimated_time} min</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">{lesson.title}</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-dark-800 p-1 rounded-lg">
          {[
            { id: 'lesson', label: 'Learn', icon: BookOpen },
            { id: 'test', label: 'Module Test', icon: HelpCircle },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id ? 'bg-primary-500 text-white' : 'text-gray-400 hover:text-white hover:bg-dark-700'
              }`}>
              <tab.icon size={16} />{tab.label}
              {tab.id === 'test' && testPassed && <CheckCircle size={14} className="text-green-400" />}
            </button>
          ))}
        </div>

        {/* LEARN TAB */}
        {activeTab === 'lesson' && (
          <div>
            <div className="glass-card p-6 sm:p-8 mb-6">{renderContent(lesson.content)}</div>
            {lesson.examples?.length > 0 && (
              <div className="glass-card p-6 mb-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Code2 size={18} className="text-accent-400" /> Examples</h3>
                <div className="space-y-3">
                  {lesson.examples.map((ex, i) => (
                    <div key={i} className="bg-dark-900 rounded-lg border border-dark-700 p-4">
                      <div className="text-sm text-gray-400 mb-2">{ex.title}</div>
                      <pre className="text-sm text-accent-400 font-mono overflow-x-auto"><code>{ex.code?.replace(/\\n/g, '\n')}</code></pre>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {lesson.tips?.length > 0 && (
              <div className="glass-card p-6 mb-6 border-l-4 border-l-yellow-500/70">
                <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2"><Lightbulb size={16} className="text-yellow-400" /> Key Takeaways</h3>
                {lesson.tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 text-gray-300 text-sm mb-2"><span className="text-yellow-400">💡</span>{tip}</div>
                ))}
              </div>
            )}
            <div className="text-center mt-6">
              <button onClick={() => setActiveTab('test')} className="btn-primary inline-flex items-center gap-2">
                Take Module Test <ArrowRight size={16} />
              </button>
              <p className="text-xs text-gray-500 mt-2">You must pass the module test (75%) to unlock the next lesson</p>
            </div>
          </div>
        )}

        {/* MODULE TEST TAB */}
        {activeTab === 'test' && (
          <div>
            {testSubmitted && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className={`glass-card p-6 mb-6 text-center border-2 ${testPassed ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
                {testPassed ? <Trophy size={40} className="mx-auto text-green-400 mb-2" /> : <XCircle size={40} className="mx-auto text-red-400 mb-2" />}
                <h3 className="text-xl font-bold text-white">{testPassed ? 'Module Passed!' : 'Not Passed'}</h3>
                <p className="text-3xl font-bold gradient-text my-2">{testScore}%</p>
                <p className="text-sm text-gray-400">{testPassed ? 'You can proceed to the next lesson.' : 'You need 75% to pass. Review and try again.'}</p>
                {!testPassed && <button onClick={resetState} className="btn-primary mt-4 text-sm">Try Again</button>}
              </motion.div>
            )}

            {!testSubmitted && (
              <div className="space-y-6">
                {/* Quiz Questions */}
                <div className="glass-card p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><HelpCircle size={18} className="text-primary-400" /> Quiz Questions</h3>
                  <div className="space-y-5">
                    {moduleTest.questions.map((q, qi) => (
                      <div key={qi} className="bg-dark-800/50 p-4 rounded-lg">
                        <p className="text-white font-medium mb-3">{qi + 1}. {q.q}</p>
                        <div className="space-y-2">
                          {q.options.map((opt, oi) => (
                            <button key={oi} onClick={() => setQuizAnswers({ ...quizAnswers, [qi]: oi })}
                              className={`w-full text-left p-3 rounded-lg border text-sm transition-all ${
                                quizAnswers[qi] === oi ? 'border-primary-500 bg-primary-500/10 text-white' : 'border-dark-700 text-gray-300 hover:border-dark-600'
                              }`}>{opt}</button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Code Problems */}
                <div className="glass-card p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Terminal size={18} className="text-accent-400" /> Code Challenges</h3>
                  <p className="text-sm text-gray-400 mb-4">Write and run the correct SQL query for each problem.</p>
                  <div className="space-y-6">
                    {moduleTest.codeProblems.map((prob, pi) => (
                      <div key={pi} className="bg-dark-800/50 p-4 rounded-lg">
                        <p className="text-white font-medium mb-1">{pi + 1}. {prob.task}</p>
                        <p className="text-xs text-gray-500 mb-3">Hint: {prob.hint}</p>
                        <div className="rounded-lg overflow-hidden border border-dark-700 mb-3">
                          <Editor height="80px" defaultLanguage="sql" value={codeAnswers[pi] || ''}
                            onChange={(v) => setCodeAnswers({ ...codeAnswers, [pi]: v || '' })}
                            theme="vs-dark" options={{ minimap: { enabled: false }, fontSize: 13, lineNumbers: 'off', scrollBeyondLastLine: false, automaticLayout: true, padding: { top: 8 } }} />
                        </div>
                        <div className="flex items-center gap-3">
                          <button onClick={() => runCode(pi)} disabled={executing === pi}
                            className="btn-primary py-1.5 px-3 text-xs flex items-center gap-1">
                            {executing === pi ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} />} Run
                          </button>
                          {codeResults[pi] && (
                            <span className={`text-xs ${codeResults[pi].success ? 'text-green-400' : 'text-red-400'}`}>
                              {codeResults[pi].success ? `✓ ${codeResults[pi].row_count} rows` : '✗ Error'}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <div className="text-center">
                  <button onClick={submitModuleTest} className="btn-primary px-8 py-3 text-lg flex items-center gap-2 mx-auto">
                    <CheckCircle size={18} /> Submit Module Test
                  </button>
                  <p className="text-xs text-gray-500 mt-2">Answer all questions and run all code problems before submitting</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom Nav */}
        <div className="mt-8 flex items-center justify-between pt-4 border-t border-dark-700">
          {prevLesson ? (
            <Link to={`/learn/${prevLesson.slug}`} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
              <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <div className="text-left"><div className="text-xs text-gray-500">Previous</div><div className="text-sm font-medium">{prevLesson.title}</div></div>
            </Link>
          ) : <div />}
          {nextLesson ? (
            testPassed || completed ? (
              <Link to={`/learn/${nextLesson.slug}`} className="flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors group text-right">
                <div><div className="text-xs text-gray-500">Next</div><div className="text-sm font-medium">{nextLesson.title}</div></div>
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <div className="flex items-center gap-2 text-gray-600 cursor-not-allowed text-right" title="Pass the module test to unlock">
                <div><div className="text-xs">Locked</div><div className="text-sm">{nextLesson.title}</div></div>
                <Lock size={16} />
              </div>
            )
          ) : <div />}
        </div>
      </motion.div>
    </div>
  );
}
