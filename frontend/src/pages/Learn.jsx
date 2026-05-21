import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { lessonAPI } from '../services/api';
import DifficultyBadge from '../components/DifficultyBadge';
import { CardSkeleton } from '../components/LoadingSkeleton';
import AdBanner from '../components/AdBanner';
import { BookOpen, Clock, CheckCircle, ChevronRight, Map, Filter } from 'lucide-react';

export default function Learn() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [view, setView] = useState('roadmap'); // 'roadmap' or 'list'

  useEffect(() => {
    loadLessons();
  }, [filter]);

  const loadLessons = async () => {
    try {
      const params = filter !== 'all' ? { difficulty: filter } : {};
      const res = await lessonAPI.getAll(params);
      setLessons(res.data);
    } catch (err) {
      console.error('Failed to load lessons:', err);
      // Fallback static data when API is unavailable
      setLessons([
        { id: 1, title: "Introduction to Databases", slug: "introduction-to-databases", description: "Understand what databases are and why they matter.", difficulty: "beginner", category: "Getting Started", order_index: 1, estimated_time: 15, is_completed: false },
        { id: 2, title: "What is SQL?", slug: "what-is-sql", description: "Learn about SQL — the language for databases.", difficulty: "beginner", category: "Getting Started", order_index: 2, estimated_time: 12, is_completed: false },
        { id: 3, title: "SQL SELECT Statement", slug: "sql-select", description: "Master the most important SQL command.", difficulty: "beginner", category: "Querying Data", order_index: 3, estimated_time: 20, is_completed: false },
        { id: 4, title: "SQL WHERE Clause", slug: "sql-where", description: "Filter data using conditions.", difficulty: "beginner", category: "Querying Data", order_index: 4, estimated_time: 25, is_completed: false },
        { id: 5, title: "SQL ORDER BY", slug: "sql-order-by", description: "Sort your query results.", difficulty: "beginner", category: "Querying Data", order_index: 5, estimated_time: 12, is_completed: false },
        { id: 6, title: "SQL LIMIT & OFFSET", slug: "sql-limit-offset", description: "Control how many rows are returned.", difficulty: "beginner", category: "Querying Data", order_index: 6, estimated_time: 10, is_completed: false },
        { id: 7, title: "SQL INSERT INTO", slug: "sql-insert", description: "Add new records to tables.", difficulty: "beginner", category: "Modifying Data", order_index: 7, estimated_time: 15, is_completed: false },
        { id: 8, title: "SQL UPDATE Statement", slug: "sql-update", description: "Modify existing records.", difficulty: "beginner", category: "Modifying Data", order_index: 8, estimated_time: 15, is_completed: false },
        { id: 9, title: "SQL DELETE Statement", slug: "sql-delete", description: "Remove records safely.", difficulty: "beginner", category: "Modifying Data", order_index: 9, estimated_time: 12, is_completed: false },
        { id: 10, title: "SQL NULL Values", slug: "sql-null-values", description: "Handle missing data.", difficulty: "beginner", category: "Querying Data", order_index: 10, estimated_time: 10, is_completed: false },
        { id: 11, title: "SQL Operators", slug: "sql-operators", description: "All SQL operators explained.", difficulty: "beginner", category: "Querying Data", order_index: 11, estimated_time: 15, is_completed: false },
        { id: 12, title: "SQL Aggregate Functions", slug: "sql-aggregate-functions", description: "COUNT, SUM, AVG, MIN, MAX.", difficulty: "beginner", category: "Aggregation", order_index: 12, estimated_time: 18, is_completed: false },
        { id: 13, title: "SQL GROUP BY", slug: "sql-group-by", description: "Group rows and summarize data.", difficulty: "intermediate", category: "Aggregation", order_index: 13, estimated_time: 22, is_completed: false },
        { id: 14, title: "SQL HAVING Clause", slug: "sql-having", description: "Filter groups after aggregation.", difficulty: "intermediate", category: "Aggregation", order_index: 14, estimated_time: 12, is_completed: false },
        { id: 15, title: "SQL INNER JOIN", slug: "sql-inner-join", description: "Combine data from multiple tables.", difficulty: "intermediate", category: "Joins", order_index: 15, estimated_time: 25, is_completed: false },
        { id: 16, title: "SQL LEFT JOIN", slug: "sql-left-join", description: "Get all rows from the left table.", difficulty: "intermediate", category: "Joins", order_index: 16, estimated_time: 18, is_completed: false },
        { id: 17, title: "SQL Subqueries", slug: "sql-subqueries", description: "Nest queries inside other queries.", difficulty: "intermediate", category: "Advanced Queries", order_index: 17, estimated_time: 25, is_completed: false },
        { id: 18, title: "SQL UNION", slug: "sql-union", description: "Combine results from multiple queries.", difficulty: "intermediate", category: "Advanced Queries", order_index: 18, estimated_time: 12, is_completed: false },
        { id: 19, title: "SQL CASE Expression", slug: "sql-case", description: "Add conditional logic to queries.", difficulty: "intermediate", category: "Advanced Queries", order_index: 19, estimated_time: 15, is_completed: false },
        { id: 20, title: "SQL Window Functions", slug: "sql-window-functions", description: "Advanced analytical functions.", difficulty: "advanced", category: "Window Functions", order_index: 20, estimated_time: 35, is_completed: false },
        { id: 21, title: "Common Table Expressions", slug: "sql-cte", description: "Write cleaner queries with CTEs.", difficulty: "advanced", category: "Advanced SQL", order_index: 21, estimated_time: 20, is_completed: false },
        { id: 22, title: "SQL Indexes & Performance", slug: "sql-indexes", description: "Speed up your queries.", difficulty: "advanced", category: "Performance", order_index: 22, estimated_time: 25, is_completed: false },
        { id: 23, title: "SQL Transactions", slug: "sql-transactions", description: "Ensure data integrity.", difficulty: "advanced", category: "Advanced SQL", order_index: 23, estimated_time: 20, is_completed: false },
        { id: 24, title: "SQL Views", slug: "sql-views", description: "Create virtual tables.", difficulty: "intermediate", category: "Database Objects", order_index: 24, estimated_time: 15, is_completed: false },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filters = ['all', 'beginner', 'intermediate', 'advanced'];

  // Group lessons by category
  const grouped = lessons.reduce((acc, lesson) => {
    if (!acc[lesson.category]) acc[lesson.category] = [];
    acc[lesson.category].push(lesson);
    return acc;
  }, {});

  const totalCompleted = lessons.filter(l => l.is_completed).length;

  // Find next uncompleted lesson
  const nextLesson = lessons.find(l => !l.is_completed);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-display font-bold text-white">Learn SQL</h1>
            <p className="text-gray-400 mt-1">
              {totalCompleted}/{lessons.length} lessons completed
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/roadmap" className="btn-secondary py-2 px-4 text-sm flex items-center gap-2">
              <Map size={16} /> View Roadmap
            </Link>
          </div>
        </div>

        {/* Continue Learning Card */}
        {nextLesson && (
          <Link to={`/learn/${nextLesson.slug}`} className="block mb-8">
            <div className="glass-card p-5 border border-primary-500/30 bg-primary-500/5 hover:bg-primary-500/10 transition-all group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center">
                    <BookOpen size={24} className="text-primary-400" />
                  </div>
                  <div>
                    <div className="text-xs text-primary-400 font-medium mb-0.5">Continue Learning</div>
                    <div className="text-lg font-semibold text-white group-hover:text-primary-300 transition-colors">{nextLesson.title}</div>
                    <div className="text-sm text-gray-400">{nextLesson.category} • {nextLesson.estimated_time} min</div>
                  </div>
                </div>
                <ChevronRight size={24} className="text-gray-500 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </Link>
        )}

        {/* Filters */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => { setFilter(f); setLoading(true); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === f
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                  : 'bg-dark-800 text-gray-400 hover:text-white hover:bg-dark-700'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full h-2 bg-dark-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-700"
              style={{ width: `${lessons.length ? (totalCompleted / lessons.length) * 100 : 0}%` }}
            />
          </div>
        </div>

        <AdBanner />
      </motion.div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="space-y-10">
          {Object.entries(grouped).map(([category, categoryLessons]) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl font-display font-semibold text-white">{category}</h2>
                <span className="text-xs text-gray-500 bg-dark-700 px-2 py-0.5 rounded-full">
                  {categoryLessons.filter(l => l.is_completed).length}/{categoryLessons.length}
                </span>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryLessons.map((lesson) => (
                  <Link
                    key={lesson.id}
                    to={`/learn/${lesson.slug}`}
                    className="glass-card p-5 hover:border-primary-500/50 transition-all duration-300 group relative overflow-hidden"
                  >
                    {lesson.is_completed && (
                      <div className="absolute top-3 right-3">
                        <CheckCircle size={18} className="text-green-400" />
                      </div>
                    )}
                    <div className="flex items-center gap-2 mb-3">
                      <DifficultyBadge difficulty={lesson.difficulty} />
                    </div>
                    <h3 className="font-semibold text-white group-hover:text-primary-300 transition-colors mb-2 pr-6">
                      {lesson.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">{lesson.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock size={12} />
                        {lesson.estimated_time} min
                      </div>
                      <ChevronRight size={16} className="text-gray-500 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
