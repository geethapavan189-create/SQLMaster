import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { isLessonCompleted, isLessonUnlocked } from '../hooks/useProgress';
import DifficultyBadge from '../components/DifficultyBadge';
import { BookOpen, Clock, CheckCircle, ChevronRight, Lock, Code2 } from 'lucide-react';

// Full Python curriculum
const pythonLessons = [
  // Chapter 1: Getting Started
  { slug: "py-introduction", title: "Introduction to Python", description: "What is Python, why learn it, installing Python, your first program.", difficulty: "beginner", category: "Getting Started", estimated_time: 15 },
  { slug: "py-variables", title: "Variables & Data Types", description: "Numbers, strings, booleans, type conversion, and naming rules.", difficulty: "beginner", category: "Getting Started", estimated_time: 20 },
  { slug: "py-operators", title: "Operators", description: "Arithmetic, comparison, logical, assignment, and membership operators.", difficulty: "beginner", category: "Getting Started", estimated_time: 15 },
  { slug: "py-strings", title: "Strings", description: "String methods, formatting, slicing, f-strings, and manipulation.", difficulty: "beginner", category: "Getting Started", estimated_time: 20 },
  { slug: "py-input-output", title: "Input & Output", description: "print(), input(), formatting output, escape characters.", difficulty: "beginner", category: "Getting Started", estimated_time: 12 },

  // Chapter 2: Control Flow
  { slug: "py-if-else", title: "If/Else Statements", description: "Conditional logic, elif, nested conditions, ternary operator.", difficulty: "beginner", category: "Control Flow", estimated_time: 20 },
  { slug: "py-for-loops", title: "For Loops", description: "Iterating over sequences, range(), enumerate(), nested loops.", difficulty: "beginner", category: "Control Flow", estimated_time: 22 },
  { slug: "py-while-loops", title: "While Loops", description: "While loops, break, continue, infinite loops, loop patterns.", difficulty: "beginner", category: "Control Flow", estimated_time: 18 },
  { slug: "py-comprehensions", title: "List Comprehensions", description: "Compact syntax for creating lists, dict comprehensions, generators.", difficulty: "beginner", category: "Control Flow", estimated_time: 15 },

  // Chapter 3: Data Structures
  { slug: "py-lists", title: "Lists", description: "Creating, indexing, slicing, methods, sorting, copying lists.", difficulty: "beginner", category: "Data Structures", estimated_time: 25 },
  { slug: "py-tuples", title: "Tuples", description: "Immutable sequences, packing/unpacking, named tuples.", difficulty: "beginner", category: "Data Structures", estimated_time: 15 },
  { slug: "py-dictionaries", title: "Dictionaries", description: "Key-value pairs, methods, iteration, nested dicts, defaultdict.", difficulty: "beginner", category: "Data Structures", estimated_time: 22 },
  { slug: "py-sets", title: "Sets", description: "Unique collections, set operations, frozensets.", difficulty: "beginner", category: "Data Structures", estimated_time: 15 },

  // Chapter 4: Functions
  { slug: "py-functions-basics", title: "Functions Basics", description: "Defining functions, parameters, return values, docstrings.", difficulty: "intermediate", category: "Functions", estimated_time: 22 },
  { slug: "py-args-kwargs", title: "Args & Kwargs", description: "*args, **kwargs, default parameters, keyword arguments.", difficulty: "intermediate", category: "Functions", estimated_time: 18 },
  { slug: "py-lambda", title: "Lambda Functions", description: "Anonymous functions, map(), filter(), reduce(), sorting with key.", difficulty: "intermediate", category: "Functions", estimated_time: 15 },
  { slug: "py-scope", title: "Scope & Closures", description: "Local/global scope, LEGB rule, closures, nonlocal keyword.", difficulty: "intermediate", category: "Functions", estimated_time: 18 },
  { slug: "py-decorators", title: "Decorators", description: "Function decorators, @syntax, practical decorators, chaining.", difficulty: "intermediate", category: "Functions", estimated_time: 20 },

  // Chapter 5: OOP
  { slug: "py-classes", title: "Classes & Objects", description: "Creating classes, __init__, self, attributes, methods.", difficulty: "intermediate", category: "OOP", estimated_time: 25 },
  { slug: "py-inheritance", title: "Inheritance", description: "Single/multiple inheritance, super(), method overriding, MRO.", difficulty: "intermediate", category: "OOP", estimated_time: 22 },
  { slug: "py-encapsulation", title: "Encapsulation", description: "Public/private/protected, getters/setters, @property.", difficulty: "intermediate", category: "OOP", estimated_time: 18 },
  { slug: "py-polymorphism", title: "Polymorphism", description: "Duck typing, method overriding, abstract classes, interfaces.", difficulty: "intermediate", category: "OOP", estimated_time: 18 },
  { slug: "py-magic-methods", title: "Magic Methods", description: "__str__, __repr__, __len__, __add__, operator overloading.", difficulty: "intermediate", category: "OOP", estimated_time: 20 },

  // Chapter 6: Advanced
  { slug: "py-file-handling", title: "File Handling", description: "Reading/writing files, with statement, CSV, JSON handling.", difficulty: "advanced", category: "Advanced Python", estimated_time: 22 },
  { slug: "py-error-handling", title: "Error Handling", description: "try/except/finally, raising exceptions, custom exceptions.", difficulty: "advanced", category: "Advanced Python", estimated_time: 20 },
  { slug: "py-modules", title: "Modules & Packages", description: "Importing, creating modules, pip, virtual environments.", difficulty: "advanced", category: "Advanced Python", estimated_time: 18 },
  { slug: "py-iterators-generators", title: "Iterators & Generators", description: "Iterator protocol, yield, generator expressions, lazy evaluation.", difficulty: "advanced", category: "Advanced Python", estimated_time: 22 },
  { slug: "py-regex", title: "Regular Expressions", description: "Pattern matching, re module, groups, substitution, common patterns.", difficulty: "advanced", category: "Advanced Python", estimated_time: 20 },
  { slug: "py-multithreading", title: "Multithreading & Async", description: "Threading, multiprocessing, asyncio, concurrent.futures.", difficulty: "advanced", category: "Advanced Python", estimated_time: 25 },
];

export default function PythonLearn() {
  const grouped = pythonLessons.reduce((acc, lesson) => {
    if (!acc[lesson.category]) acc[lesson.category] = [];
    acc[lesson.category].push(lesson);
    return acc;
  }, {});

  const totalCompleted = pythonLessons.filter(l => isLessonCompleted(l.slug)).length;
  const checkUnlocked = (lesson) => isLessonUnlocked(lesson.slug, pythonLessons);
  const nextLesson = pythonLessons.find(l => !isLessonCompleted(l.slug) && checkUnlocked(l));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <Link to="/courses" className="text-gray-400 hover:text-white text-sm">Courses</Link>
          <ChevronRight size={14} className="text-gray-600" />
          <span className="text-white text-sm font-medium">Python</span>
        </div>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
            <Code2 size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-white">Python</h1>
            <p className="text-gray-400">{totalCompleted}/{pythonLessons.length} lessons completed</p>
          </div>
        </div>

        {/* Progress */}
        <div className="w-full h-2 bg-dark-800 rounded-full overflow-hidden mb-6">
          <div className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full transition-all" style={{ width: `${(totalCompleted / pythonLessons.length) * 100}%` }} />
        </div>

        {/* Continue card */}
        {nextLesson && (
          <Link to={`/python/${nextLesson.slug}`} className="block mb-8">
            <div className="glass-card p-5 border border-yellow-500/30 bg-yellow-500/5 hover:bg-yellow-500/10 transition-all group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                    <BookOpen size={24} className="text-yellow-400" />
                  </div>
                  <div>
                    <div className="text-xs text-yellow-400 font-medium">Continue Learning</div>
                    <div className="text-lg font-semibold text-white group-hover:text-yellow-300 transition-colors">{nextLesson.title}</div>
                  </div>
                </div>
                <ChevronRight size={24} className="text-gray-500 group-hover:text-yellow-400 transition-all" />
              </div>
            </div>
          </Link>
        )}
      </motion.div>

      {/* Lessons by category */}
      <div className="space-y-10">
        {Object.entries(grouped).map(([category, categoryLessons]) => (
          <motion.div key={category} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-xl font-display font-semibold text-white">{category}</h2>
              <span className="text-xs text-gray-500 bg-dark-700 px-2 py-0.5 rounded-full">
                {categoryLessons.filter(l => isLessonCompleted(l.slug)).length}/{categoryLessons.length}
              </span>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryLessons.map((lesson) => {
                const unlocked = checkUnlocked(lesson);
                const completed = isLessonCompleted(lesson.slug);

                if (!unlocked) {
                  return (
                    <div key={lesson.slug} className="glass-card p-5 opacity-50 cursor-not-allowed relative">
                      <div className="absolute top-3 right-3"><Lock size={16} className="text-gray-600" /></div>
                      <DifficultyBadge difficulty={lesson.difficulty} />
                      <h3 className="font-semibold text-gray-500 mt-3 mb-2">{lesson.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{lesson.description}</p>
                      <div className="text-xs text-gray-600 mt-3 flex items-center gap-1"><Lock size={10} /> Complete previous lessons</div>
                    </div>
                  );
                }

                return (
                  <Link key={lesson.slug} to={`/python/${lesson.slug}`} className="glass-card p-5 hover:border-yellow-500/50 transition-all group relative">
                    {completed && <div className="absolute top-3 right-3"><CheckCircle size={18} className="text-green-400" /></div>}
                    <DifficultyBadge difficulty={lesson.difficulty} />
                    <h3 className="font-semibold text-white group-hover:text-yellow-300 transition-colors mt-3 mb-2">{lesson.title}</h3>
                    <p className="text-sm text-gray-400 line-clamp-2">{lesson.description}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-gray-500 flex items-center gap-1"><Clock size={12} />{lesson.estimated_time} min</span>
                      <ChevronRight size={16} className="text-gray-500 group-hover:text-yellow-400 transition-all" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
