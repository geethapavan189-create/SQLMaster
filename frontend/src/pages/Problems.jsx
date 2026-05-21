import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { problemAPI } from '../services/api';
import DifficultyBadge from '../components/DifficultyBadge';
import { CardSkeleton } from '../components/LoadingSkeleton';
import { CheckCircle, Code2, Filter } from 'lucide-react';

export default function Problems() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [difficulty, setDifficulty] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    loadProblems();
  }, [difficulty, category]);

  const loadProblems = async () => {
    try {
      const params = {};
      if (difficulty) params.difficulty = difficulty;
      if (category) params.category = category;
      const res = await problemAPI.getAll(params);
      setProblems(res.data);
    } catch (err) {
      console.error('Failed to load problems:', err);
      setProblems([
        { id: 1, title: "Select All Employees", slug: "select-all-employees", difficulty: "easy", category: "SELECT", tags: ["select", "basics"], is_solved: false },
        { id: 2, title: "Employee Names and Emails", slug: "employee-names-emails", difficulty: "easy", category: "SELECT", tags: ["select", "columns"], is_solved: false },
        { id: 3, title: "Unique Departments", slug: "unique-departments", difficulty: "easy", category: "SELECT", tags: ["select", "distinct"], is_solved: false },
        { id: 4, title: "High Salary Filter", slug: "high-salary-filter", difficulty: "easy", category: "WHERE", tags: ["where", "comparison"], is_solved: false },
        { id: 5, title: "Employees in Department 3", slug: "employees-dept-3", difficulty: "easy", category: "WHERE", tags: ["where", "equality"], is_solved: false },
        { id: 6, title: "Sort by Salary", slug: "sort-by-salary", difficulty: "easy", category: "ORDER BY", tags: ["order by", "sorting"], is_solved: false },
        { id: 7, title: "Top 5 Earners", slug: "top-5-earners", difficulty: "easy", category: "LIMIT", tags: ["order by", "limit"], is_solved: false },
        { id: 8, title: "Employees Hired After 2022", slug: "hired-after-2022", difficulty: "easy", category: "WHERE", tags: ["where", "dates"], is_solved: false },
        { id: 9, title: "NULL Manager", slug: "null-manager", difficulty: "easy", category: "NULL", tags: ["null", "is null"], is_solved: false },
        { id: 10, title: "Name Pattern Match", slug: "name-pattern-match", difficulty: "easy", category: "WHERE", tags: ["like", "pattern"], is_solved: false },
        { id: 11, title: "Department Employee Count", slug: "department-employee-count", difficulty: "medium", category: "GROUP BY", tags: ["group by", "count"], is_solved: false },
        { id: 12, title: "Average Salary by Department", slug: "avg-salary-department", difficulty: "medium", category: "GROUP BY", tags: ["group by", "avg"], is_solved: false },
        { id: 13, title: "Departments with 5+ Employees", slug: "departments-5-plus", difficulty: "medium", category: "HAVING", tags: ["group by", "having"], is_solved: false },
        { id: 14, title: "Employees with Departments", slug: "employees-with-departments", difficulty: "medium", category: "JOIN", tags: ["join", "inner join"], is_solved: false },
        { id: 15, title: "Second Highest Salary", slug: "second-highest-salary", difficulty: "medium", category: "Subquery", tags: ["subquery", "limit"], is_solved: false },
        { id: 16, title: "Above Average Salary", slug: "above-average-salary", difficulty: "medium", category: "Subquery", tags: ["subquery", "avg"], is_solved: false },
        { id: 17, title: "Rank by Salary in Department", slug: "rank-salary-department", difficulty: "hard", category: "Window Functions", tags: ["window functions", "rank"], is_solved: false },
        { id: 18, title: "Running Total of Orders", slug: "running-total-orders", difficulty: "hard", category: "Window Functions", tags: ["window functions", "running total"], is_solved: false },
        { id: 19, title: "Top Earner per Department", slug: "top-earner-department", difficulty: "hard", category: "Window Functions", tags: ["window functions", "subquery"], is_solved: false },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const categories = [...new Set(problems.map(p => p.category))];
  const solved = problems.filter(p => p.is_solved).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-white">Practice Problems</h1>
            <p className="text-gray-400 mt-1">
              {solved}/{problems.length} solved
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500" />
            <select
              value={difficulty}
              onChange={(e) => { setDifficulty(e.target.value); setLoading(true); }}
              className="bg-dark-800 border border-dark-700 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-primary-500"
            >
              <option value="">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        {/* Progress bar */}
        <div className="glass-card p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Progress</span>
            <span className="text-sm text-gray-400">{solved}/{problems.length}</span>
          </div>
          <div className="w-full h-2 bg-dark-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-500"
              style={{ width: `${problems.length ? (solved / problems.length) * 100 : 0}%` }}
            />
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="space-y-2">
          {problems.map((problem, i) => (
            <motion.div
              key={problem.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Link
                to={`/problems/${problem.slug}`}
                className="flex items-center justify-between p-4 glass-card hover:border-primary-500/50 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    problem.is_solved ? 'bg-green-500/20' : 'bg-dark-700'
                  }`}>
                    {problem.is_solved ? (
                      <CheckCircle size={16} className="text-green-400" />
                    ) : (
                      <Code2 size={16} className="text-gray-500" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-white group-hover:text-primary-300 transition-colors">
                      {problem.title}
                    </div>
                    <div className="text-xs text-gray-500">{problem.category}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {problem.tags?.slice(0, 2).map((tag, j) => (
                    <span key={j} className="text-xs text-gray-500 bg-dark-700 px-2 py-0.5 rounded hidden sm:inline">
                      {tag}
                    </span>
                  ))}
                  <DifficultyBadge difficulty={problem.difficulty} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
