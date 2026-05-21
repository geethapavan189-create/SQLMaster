import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, ChevronDown, ChevronUp, Code2, Lightbulb } from 'lucide-react';
import DifficultyBadge from '../components/DifficultyBadge';

const interviewQuestions = [
  {
    category: "Basic SQL",
    questions: [
      { q: "What is the difference between WHERE and HAVING?", a: "WHERE filters individual rows before grouping. HAVING filters groups after GROUP BY has been applied. WHERE cannot use aggregate functions, but HAVING can.", difficulty: "easy" },
      { q: "What is the difference between DELETE, TRUNCATE, and DROP?", a: "DELETE removes specific rows (can use WHERE), is logged, and can be rolled back. TRUNCATE removes all rows quickly without logging each row. DROP removes the entire table structure and data permanently.", difficulty: "easy" },
      { q: "What are the different types of JOINs?", a: "INNER JOIN returns matching rows from both tables. LEFT JOIN returns all rows from the left table plus matches. RIGHT JOIN returns all rows from the right table plus matches. FULL OUTER JOIN returns all rows from both tables. CROSS JOIN returns the Cartesian product.", difficulty: "easy" },
      { q: "What is a PRIMARY KEY?", a: "A PRIMARY KEY is a column (or combination of columns) that uniquely identifies each row in a table. It must contain unique values and cannot contain NULL. Each table can have only one primary key.", difficulty: "easy" },
      { q: "What is normalization?", a: "Normalization is the process of organizing data to reduce redundancy and improve data integrity. It involves dividing large tables into smaller ones and defining relationships. Common forms: 1NF (atomic values), 2NF (no partial dependencies), 3NF (no transitive dependencies).", difficulty: "medium" },
    ]
  },
  {
    category: "Intermediate SQL",
    questions: [
      { q: "Explain the difference between UNION and UNION ALL.", a: "UNION combines results from two queries and removes duplicates (slower). UNION ALL combines results without removing duplicates (faster). Use UNION ALL when you know there are no duplicates or duplicates are acceptable.", difficulty: "medium" },
      { q: "What are window functions? Give an example.", a: "Window functions perform calculations across a set of rows related to the current row without collapsing them. Example: SELECT name, salary, RANK() OVER (ORDER BY salary DESC) as rank FROM employees; This ranks employees by salary without grouping.", difficulty: "medium" },
      { q: "What is a subquery? What are correlated subqueries?", a: "A subquery is a query nested inside another query. A correlated subquery references columns from the outer query and is executed once for each row of the outer query. Example: SELECT * FROM employees e WHERE salary > (SELECT AVG(salary) FROM employees WHERE department_id = e.department_id);", difficulty: "medium" },
      { q: "How do you find the Nth highest salary?", a: "Using window functions: SELECT salary FROM (SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) as rank FROM employees) t WHERE rank = N; Or using LIMIT/OFFSET: SELECT DISTINCT salary FROM employees ORDER BY salary DESC LIMIT 1 OFFSET N-1;", difficulty: "medium" },
      { q: "What is a CTE (Common Table Expression)?", a: "A CTE is a temporary named result set defined within a WITH clause. It improves readability and can be referenced multiple times. Example: WITH high_earners AS (SELECT * FROM employees WHERE salary > 80000) SELECT department_id, COUNT(*) FROM high_earners GROUP BY department_id;", difficulty: "medium" },
    ]
  },
  {
    category: "Advanced SQL",
    questions: [
      { q: "Explain ACID properties in databases.", a: "Atomicity: Transactions are all-or-nothing. Consistency: Database moves from one valid state to another. Isolation: Concurrent transactions don't interfere. Durability: Committed changes survive system failures. These properties ensure reliable database transactions.", difficulty: "hard" },
      { q: "What are indexes and how do they improve performance?", a: "Indexes are data structures (usually B-trees) that speed up data retrieval by providing quick lookup paths. They work like a book's index. Trade-offs: faster reads but slower writes (index must be updated). Use on frequently queried columns, JOIN columns, and WHERE clause columns.", difficulty: "hard" },
      { q: "Explain query optimization techniques.", a: "Key techniques: 1) Use indexes on filtered/joined columns. 2) Avoid SELECT *. 3) Use EXISTS instead of IN for subqueries. 4) Avoid functions on indexed columns in WHERE. 5) Use EXPLAIN to analyze query plans. 6) Minimize subqueries, prefer JOINs. 7) Use appropriate data types.", difficulty: "hard" },
      { q: "What is a deadlock and how do you prevent it?", a: "A deadlock occurs when two transactions wait for each other to release locks, creating a circular dependency. Prevention: 1) Access tables in consistent order. 2) Keep transactions short. 3) Use appropriate isolation levels. 4) Use lock timeouts. 5) Avoid user interaction during transactions.", difficulty: "hard" },
      { q: "Explain the difference between clustered and non-clustered indexes.", a: "Clustered index determines the physical order of data in a table (only one per table). Non-clustered index creates a separate structure with pointers to data (multiple allowed). Clustered is faster for range queries; non-clustered is better for specific lookups.", difficulty: "hard" },
    ]
  },
];

export default function InterviewPrep() {
  const [openCategory, setOpenCategory] = useState(0);
  const [openQuestion, setOpenQuestion] = useState(null);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-8">
          <Briefcase size={40} className="mx-auto text-primary-400 mb-3" />
          <h1 className="text-3xl font-display font-bold text-white">Interview Preparation</h1>
          <p className="text-gray-400 mt-2">Top SQL interview questions organized by difficulty</p>
        </div>

        <div className="space-y-4">
          {interviewQuestions.map((cat, catIdx) => (
            <div key={catIdx} className="glass-card overflow-hidden">
              <button
                onClick={() => setOpenCategory(openCategory === catIdx ? -1 : catIdx)}
                className="w-full flex items-center justify-between p-5 hover:bg-dark-700/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Code2 size={20} className="text-primary-400" />
                  <span className="font-semibold text-white">{cat.category}</span>
                  <span className="text-xs text-gray-500">{cat.questions.length} questions</span>
                </div>
                {openCategory === catIdx ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
              </button>

              <AnimatePresence>
                {openCategory === catIdx && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 space-y-3">
                      {cat.questions.map((item, qIdx) => {
                        const key = `${catIdx}-${qIdx}`;
                        return (
                          <div key={qIdx} className="bg-dark-800 rounded-lg border border-dark-700">
                            <button
                              onClick={() => setOpenQuestion(openQuestion === key ? null : key)}
                              className="w-full flex items-center justify-between p-4 text-left"
                            >
                              <div className="flex items-center gap-3 flex-1">
                                <Lightbulb size={16} className="text-yellow-400 flex-shrink-0" />
                                <span className="text-sm text-gray-200">{item.q}</span>
                              </div>
                              <DifficultyBadge difficulty={item.difficulty} />
                            </button>
                            <AnimatePresence>
                              {openQuestion === key && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden"
                                >
                                  <div className="px-4 pb-4 pt-0">
                                    <div className="p-4 bg-dark-900 rounded-lg border border-dark-700 text-sm text-gray-300 leading-relaxed">
                                      {item.a}
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
