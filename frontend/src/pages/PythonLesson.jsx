import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { completeLesson, isLessonCompleted, isLessonUnlocked, getFirstLockedLesson } from '../hooks/useProgress';
import DifficultyBadge from '../components/DifficultyBadge';
import {
  Clock, CheckCircle, ChevronLeft, ChevronRight, Lightbulb,
  Code2, Play, BookOpen, Loader2, Lock, ArrowRight, Terminal,
  HelpCircle, XCircle, Trophy
} from 'lucide-react';
import toast from 'react-hot-toast';
import { pythonLessonsContent, pythonModuleTests } from '../data/pythonContent';

// Lesson list for navigation
const pythonLessons = [
  { slug: "py-introduction", title: "Introduction to Python", difficulty: "beginner", category: "Getting Started", estimated_time: 15 },
  { slug: "py-variables", title: "Variables & Data Types", difficulty: "beginner", category: "Getting Started", estimated_time: 20 },
  { slug: "py-operators", title: "Operators", difficulty: "beginner", category: "Getting Started", estimated_time: 15 },
  { slug: "py-strings", title: "Strings", difficulty: "beginner", category: "Getting Started", estimated_time: 20 },
  { slug: "py-input-output", title: "Input & Output", difficulty: "beginner", category: "Getting Started", estimated_time: 12 },
  { slug: "py-if-else", title: "If/Else Statements", difficulty: "beginner", category: "Control Flow", estimated_time: 20 },
  { slug: "py-for-loops", title: "For Loops", difficulty: "beginner", category: "Control Flow", estimated_time: 22 },
  { slug: "py-while-loops", title: "While Loops", difficulty: "beginner", category: "Control Flow", estimated_time: 18 },
  { slug: "py-comprehensions", title: "List Comprehensions", difficulty: "beginner", category: "Control Flow", estimated_time: 15 },
  { slug: "py-lists", title: "Lists", difficulty: "beginner", category: "Data Structures", estimated_time: 25 },
  { slug: "py-tuples", title: "Tuples", difficulty: "beginner", category: "Data Structures", estimated_time: 15 },
  { slug: "py-dictionaries", title: "Dictionaries", difficulty: "beginner", category: "Data Structures", estimated_time: 22 },
  { slug: "py-sets", title: "Sets", difficulty: "beginner", category: "Data Structures", estimated_time: 15 },
  { slug: "py-functions-basics", title: "Functions Basics", difficulty: "intermediate", category: "Functions", estimated_time: 22 },
  { slug: "py-args-kwargs", title: "Args & Kwargs", difficulty: "intermediate", category: "Functions", estimated_time: 18 },
  { slug: "py-lambda", title: "Lambda Functions", difficulty: "intermediate", category: "Functions", estimated_time: 15 },
  { slug: "py-scope", title: "Scope & Closures", difficulty: "intermediate", category: "Functions", estimated_time: 18 },
  { slug: "py-decorators", title: "Decorators", difficulty: "intermediate", category: "Functions", estimated_time: 20 },
  { slug: "py-classes", title: "Classes & Objects", difficulty: "intermediate", category: "OOP", estimated_time: 25 },
  { slug: "py-inheritance", title: "Inheritance", difficulty: "intermediate", category: "OOP", estimated_time: 22 },
  { slug: "py-encapsulation", title: "Encapsulation", difficulty: "intermediate", category: "OOP", estimated_time: 18 },
  { slug: "py-polymorphism", title: "Polymorphism", difficulty: "intermediate", category: "OOP", estimated_time: 18 },
  { slug: "py-magic-methods", title: "Magic Methods", difficulty: "intermediate", category: "OOP", estimated_time: 20 },
  { slug: "py-file-handling", title: "File Handling", difficulty: "advanced", category: "Advanced Python", estimated_time: 22 },
  { slug: "py-error-handling", title: "Error Handling", difficulty: "advanced", category: "Advanced Python", estimated_time: 20 },
  { slug: "py-modules", title: "Modules & Packages", difficulty: "advanced", category: "Advanced Python", estimated_time: 18 },
  { slug: "py-iterators-generators", title: "Iterators & Generators", difficulty: "advanced", category: "Advanced Python", estimated_time: 22 },
  { slug: "py-regex", title: "Regular Expressions", difficulty: "advanced", category: "Advanced Python", estimated_time: 20 },
  { slug: "py-multithreading", title: "Multithreading & Async", difficulty: "advanced", category: "Advanced Python", estimated_time: 25 },
];

export default function PythonLesson() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('lesson');
  const [quizAnswers, setQuizAnswers] = useState({});
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [testPassed, setTestPassed] = useState(isLessonCompleted(slug));
  const [testScore, setTestScore] = useState(0);
  const [completed, setCompleted] = useState(isLessonCompleted(slug));

  useEffect(() => {
    setActiveTab('lesson');
    setQuizAnswers({});
    setTestSubmitted(false);
    setTestPassed(isLessonCompleted(slug));
    setCompleted(isLessonCompleted(slug));
    setTestScore(0);
    window.scrollTo(0, 0);
  }, [slug]);

  const currentIndex = pythonLessons.findIndex(l => l.slug === slug);
  const currentLesson = pythonLessons[currentIndex];
  const prevLesson = currentIndex > 0 ? pythonLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < pythonLessons.length - 1 ? pythonLessons[currentIndex + 1] : null;
  const content = pythonLessonsContent[slug];
  const moduleTest = pythonModuleTests[slug];

  // Check lock
  const isLocked = !isLessonUnlocked(slug, pythonLessons);
  if (isLocked) {
    const first = getFirstLockedLesson(pythonLessons);
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="glass-card p-10">
          <Lock size={48} className="mx-auto text-gray-500 mb-4" />
          <h2 className="text-2xl font-display font-bold text-white mb-2">Lesson Locked</h2>
          <p className="text-gray-400 mb-6">Complete <strong className="text-white">"{first?.title}"</strong> first.</p>
          <Link to={`/python/${first?.slug}`} className="btn-primary">Go to {first?.title}</Link>
        </div>
      </div>
    );
  }

  if (!currentLesson) return <div className="text-center py-20 text-gray-400">Lesson not found</div>;

  const submitTest = () => {
    if (!moduleTest) return;
    let correct = 0;
    moduleTest.questions.forEach((q, i) => {
      if (quizAnswers[i] === q.answer) correct++;
    });
    const score = Math.round((correct / moduleTest.questions.length) * 100);
    setTestScore(score);
    setTestSubmitted(true);
    if (score >= 75) {
      setTestPassed(true);
      setCompleted(true);
      completeLesson(slug);
      toast.success(`Module passed! ${score}% 🎉`);
      if (nextLesson) setTimeout(() => navigate(`/python/${nextLesson.slug}`), 2000);
    } else {
      toast.error(`${score}% — Need 75% to pass.`);
    }
  };

  const renderContent = (text) => {
    if (!text) return <p className="text-gray-400">Content coming soon...</p>;
    return text.split('\n').map((line, i) => {
      if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-display font-bold text-white mt-8 mb-4">{line.slice(2)}</h1>;
      if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-display font-bold text-white mt-6 mb-3 pb-2 border-b border-dark-700">{line.slice(3)}</h2>;
      if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-semibold text-gray-100 mt-4 mb-2">{line.slice(4)}</h3>;
      if (line.startsWith('```')) return null;
      if (line.startsWith('- ')) return <li key={i} className="text-gray-300 ml-4 flex items-start gap-2 my-1"><span className="text-yellow-400 mt-1.5 text-xs">●</span>{line.slice(2)}</li>;
      if (line.trim() === '') return <div key={i} className="h-2" />;
      return <p key={i} className="text-gray-300 leading-relaxed my-1">{line}</p>;
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-4">
        <Link to="/python" className="inline-flex items-center gap-1 text-gray-400 hover:text-white"><ChevronLeft size={16} /> Python Course</Link>
        <span className="text-sm text-gray-500">{currentIndex + 1}/{pythonLessons.length}</span>
      </div>

      <div className="w-full h-1.5 bg-dark-800 rounded-full mb-6 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full" style={{ width: `${((currentIndex + 1) / pythonLessons.length) * 100}%` }} />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <DifficultyBadge difficulty={currentLesson.difficulty} />
            <span className="text-sm text-gray-500">{currentLesson.category}</span>
            <span className="flex items-center gap-1 text-sm text-gray-500"><Clock size={14} />{currentLesson.estimated_time} min</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">{currentLesson.title}</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-dark-800 p-1 rounded-lg">
          {[{ id: 'lesson', label: 'Learn', icon: BookOpen }, { id: 'test', label: 'Module Test', icon: HelpCircle }].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-yellow-500 text-white' : 'text-gray-400 hover:text-white hover:bg-dark-700'}`}>
              <tab.icon size={16} />{tab.label}
              {tab.id === 'test' && testPassed && <CheckCircle size={14} className="text-green-400" />}
            </button>
          ))}
        </div>

        {activeTab === 'lesson' && (
          <div>
            <div className="glass-card p-6 sm:p-8 mb-6">{renderContent(content)}</div>
            <div className="text-center mt-6">
              <button onClick={() => setActiveTab('test')} className="btn-primary inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                Take Module Test <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'test' && (
          <div>
            {testSubmitted && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className={`glass-card p-6 mb-6 text-center border-2 ${testPassed ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
                {testPassed ? <Trophy size={40} className="mx-auto text-green-400 mb-2" /> : <XCircle size={40} className="mx-auto text-red-400 mb-2" />}
                <h3 className="text-xl font-bold text-white">{testPassed ? 'Passed!' : 'Not Passed'}</h3>
                <p className="text-3xl font-bold gradient-text my-2">{testScore}%</p>
                <p className="text-sm text-gray-400">{testPassed ? 'Moving to next lesson...' : 'Need 75%. Try again!'}</p>
                {!testPassed && <button onClick={() => { setTestSubmitted(false); setQuizAnswers({}); }} className="btn-primary mt-4 text-sm">Try Again</button>}
              </motion.div>
            )}
            {!testSubmitted && moduleTest && (
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><HelpCircle size={18} className="text-yellow-400" /> Module Test</h3>
                <div className="space-y-5">
                  {moduleTest.questions.map((q, qi) => (
                    <div key={qi} className="bg-dark-800/50 p-4 rounded-lg">
                      <p className="text-white font-medium mb-3">{qi + 1}. {q.q}</p>
                      <div className="space-y-2">
                        {q.options.map((opt, oi) => (
                          <button key={oi} onClick={() => setQuizAnswers({ ...quizAnswers, [qi]: oi })}
                            className={`w-full text-left p-3 rounded-lg border text-sm transition-all ${quizAnswers[qi] === oi ? 'border-yellow-500 bg-yellow-500/10 text-white' : 'border-dark-700 text-gray-300 hover:border-dark-600'}`}>{opt}</button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-6">
                  <button onClick={submitTest} className="btn-primary px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-500">Submit Test</button>
                </div>
              </div>
            )}
            {!moduleTest && <div className="glass-card p-8 text-center text-gray-400">Module test coming soon.</div>}
          </div>
        )}

        {/* Nav */}
        <div className="mt-8 flex items-center justify-between pt-4 border-t border-dark-700">
          {prevLesson ? <Link to={`/python/${prevLesson.slug}`} className="flex items-center gap-2 text-gray-400 hover:text-white"><ChevronLeft size={18} /><div><div className="text-xs text-gray-500">Previous</div><div className="text-sm">{prevLesson.title}</div></div></Link> : <div />}
          {nextLesson ? (testPassed || completed ? <Link to={`/python/${nextLesson.slug}`} className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 text-right"><div><div className="text-xs text-gray-500">Next</div><div className="text-sm">{nextLesson.title}</div></div><ChevronRight size={18} /></Link> : <div className="flex items-center gap-2 text-gray-600 text-right"><div><div className="text-xs">Locked</div><div className="text-sm">{nextLesson.title}</div></div><Lock size={16} /></div>) : <div />}
        </div>
      </motion.div>
    </div>
  );
}
