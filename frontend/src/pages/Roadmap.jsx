import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { lessonAPI } from '../services/api';
import { CheckCircle, Lock, ChevronRight, BookOpen, Database, Zap, Trophy, Code2 } from 'lucide-react';

const roadmapSections = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: BookOpen,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    description: 'Understand databases and SQL fundamentals',
  },
  {
    id: 'querying-data',
    title: 'Querying Data',
    icon: Database,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    description: 'Learn to retrieve and filter data',
  },
  {
    id: 'modifying-data',
    title: 'Modifying Data',
    icon: Code2,
    color: 'from-orange-500 to-amber-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
    description: 'Insert, update, and delete records',
  },
  {
    id: 'aggregation',
    title: 'Aggregation & Grouping',
    icon: Zap,
    color: 'from-purple-500 to-violet-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    description: 'Summarize and analyze data',
  },
  {
    id: 'joins',
    title: 'Joins & Relationships',
    icon: Database,
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/30',
    description: 'Combine data from multiple tables',
  },
  {
    id: 'advanced',
    title: 'Advanced SQL',
    icon: Trophy,
    color: 'from-yellow-500 to-orange-500',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
    description: 'Window functions, CTEs, optimization',
  },
];

export default function Roadmap() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLessons();
  }, []);

  const loadLessons = async () => {
    try {
      const res = await lessonAPI.getAll();
      setLessons(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getLessonsForSection = (sectionId) => {
    const categoryMap = {
      'getting-started': 'Getting Started',
      'querying-data': 'Querying Data',
      'modifying-data': 'Modifying Data',
      'aggregation': 'Aggregation',
      'joins': 'Joins',
      'advanced': ['Advanced Queries', 'Window Functions', 'Advanced SQL', 'Performance', 'Database Objects'],
    };
    const cats = categoryMap[sectionId];
    if (Array.isArray(cats)) {
      return lessons.filter(l => cats.some(c => l.category.includes(c)));
    }
    return lessons.filter(l => l.category === cats);
  };

  const totalCompleted = lessons.filter(l => l.is_completed).length;
  const totalLessons = lessons.length;
  const progressPct = totalLessons ? Math.round((totalCompleted / totalLessons) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-white mb-3">
            SQL Learning <span className="gradient-text">Roadmap</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Follow this structured path from beginner to advanced. Complete each section before moving to the next.
          </p>
          {/* Overall Progress */}
          <div className="mt-6 max-w-md mx-auto">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-400">Overall Progress</span>
              <span className="text-primary-400 font-medium">{totalCompleted}/{totalLessons} lessons ({progressPct}%)</span>
            </div>
            <div className="w-full h-3 bg-dark-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 1, delay: 0.3 }}
                className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Roadmap Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-dark-700 hidden sm:block" />

          <div className="space-y-8">
            {roadmapSections.map((section, sectionIdx) => {
              const sectionLessons = getLessonsForSection(section.id);
              const completedInSection = sectionLessons.filter(l => l.is_completed).length;
              const sectionComplete = sectionLessons.length > 0 && completedInSection === sectionLessons.length;

              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: sectionIdx * 0.1 }}
                  className="relative"
                >
                  {/* Timeline dot */}
                  <div className={`absolute left-4 w-5 h-5 rounded-full border-2 hidden sm:flex items-center justify-center z-10 ${
                    sectionComplete ? 'bg-green-500 border-green-500' : 'bg-dark-900 border-dark-600'
                  }`}>
                    {sectionComplete && <CheckCircle size={12} className="text-white" />}
                  </div>

                  {/* Section Card */}
                  <div className={`sm:ml-14 glass-card overflow-hidden border ${section.borderColor}`}>
                    {/* Section Header */}
                    <div className={`p-5 ${section.bgColor}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${section.color} flex items-center justify-center`}>
                            <section.icon size={20} className="text-white" />
                          </div>
                          <div>
                            <h2 className="text-lg font-display font-bold text-white">{section.title}</h2>
                            <p className="text-sm text-gray-400">{section.description}</p>
                          </div>
                        </div>
                        <div className="text-right hidden sm:block">
                          <div className="text-sm font-medium text-white">{completedInSection}/{sectionLessons.length}</div>
                          <div className="text-xs text-gray-500">completed</div>
                        </div>
                      </div>
                      {/* Section progress bar */}
                      <div className="mt-3 w-full h-1.5 bg-dark-800/50 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${section.color} transition-all duration-500`}
                          style={{ width: `${sectionLessons.length ? (completedInSection / sectionLessons.length) * 100 : 0}%` }}
                        />
                      </div>
                    </div>

                    {/* Lessons List */}
                    <div className="divide-y divide-dark-700">
                      {sectionLessons.map((lesson, lessonIdx) => (
                        <Link
                          key={lesson.id}
                          to={`/learn/${lesson.slug}`}
                          className="flex items-center gap-4 p-4 hover:bg-dark-800/50 transition-all group"
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            lesson.is_completed
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-dark-700 text-gray-500'
                          }`}>
                            {lesson.is_completed ? (
                              <CheckCircle size={16} />
                            ) : (
                              <span className="text-xs font-bold">{lessonIdx + 1}</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-white group-hover:text-primary-300 transition-colors truncate">
                              {lesson.title}
                            </div>
                            <div className="text-xs text-gray-500 truncate">{lesson.description}</div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-xs text-gray-500">{lesson.estimated_time}m</span>
                            <ChevronRight size={14} className="text-gray-600 group-hover:text-primary-400 transition-colors" />
                          </div>
                        </Link>
                      ))}
                      {sectionLessons.length === 0 && (
                        <div className="p-4 text-center text-sm text-gray-500">Coming soon...</div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
