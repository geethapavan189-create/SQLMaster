import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Database, Code2, Coffee, GitBranch, ChevronRight, BookOpen } from 'lucide-react';

const courses = [
  {
    id: 'sql',
    title: 'SQL',
    subtitle: 'Database & Queries',
    description: 'Master SQL from basics to advanced — SELECT, JOINs, Window Functions, and more.',
    icon: Database,
    color: 'from-purple-500 to-violet-600',
    lessons: 24,
    path: '/learn',
    status: 'available',
  },
  {
    id: 'python',
    title: 'Python',
    subtitle: 'Programming Language',
    description: 'Learn Python from zero — variables, loops, functions, OOP, file handling, and libraries.',
    icon: Code2,
    color: 'from-yellow-500 to-orange-500',
    lessons: 30,
    path: '/python',
    status: 'available',
  },
  {
    id: 'java',
    title: 'Java',
    subtitle: 'Programming Language',
    description: 'Master Java — OOP, collections, multithreading, Spring Boot, and enterprise patterns.',
    icon: Coffee,
    color: 'from-red-500 to-rose-600',
    lessons: 30,
    path: '/java',
    status: 'coming-soon',
  },
  {
    id: 'dsa',
    title: 'DSA',
    subtitle: 'Data Structures & Algorithms',
    description: 'Arrays, Linked Lists, Trees, Graphs, Sorting, Searching, Dynamic Programming.',
    icon: GitBranch,
    color: 'from-green-500 to-emerald-600',
    lessons: 40,
    path: '/dsa',
    status: 'coming-soon',
  },
];

export default function Courses() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-white mb-3">
            Choose Your <span className="gradient-text">Learning Path</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Master programming from zero to hero. Each course is structured with lessons, practice, quizzes, and projects.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {courses.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              {course.status === 'available' ? (
                <Link to={course.path} className="block glass-card p-6 hover:border-primary-500/50 transition-all group h-full">
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${course.color} flex items-center justify-center flex-shrink-0`}>
                      <course.icon size={28} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-xl font-display font-bold text-white group-hover:text-primary-300 transition-colors">{course.title}</h2>
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Available</span>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">{course.subtitle}</p>
                      <p className="text-sm text-gray-400 mb-3">{course.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 flex items-center gap-1"><BookOpen size={12} /> {course.lessons} lessons</span>
                        <ChevronRight size={18} className="text-gray-500 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="glass-card p-6 opacity-60 h-full">
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${course.color} flex items-center justify-center flex-shrink-0 opacity-50`}>
                      <course.icon size={28} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-xl font-display font-bold text-gray-400">{course.title}</h2>
                        <span className="text-xs bg-dark-700 text-gray-500 px-2 py-0.5 rounded-full">Coming Soon</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{course.subtitle}</p>
                      <p className="text-sm text-gray-500 mb-3">{course.description}</p>
                      <span className="text-xs text-gray-600"><BookOpen size={12} className="inline" /> {course.lessons} lessons planned</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
