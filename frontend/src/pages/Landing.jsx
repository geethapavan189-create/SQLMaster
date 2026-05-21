import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Database, Code2, Trophy, BookOpen, Zap, Users, Target, ChevronRight, Play, Star } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div {...fadeInUp} className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/30 rounded-full mb-6">
              <Zap size={14} className="text-primary-400" />
              <span className="text-sm text-primary-300">Interactive SQL Learning Platform</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6">
              Master SQL from{' '}
              <span className="gradient-text">Zero to Hero</span>
            </h1>
            
            <p className="text-lg text-gray-400 mb-8 max-w-xl">
              Learn SQL interactively with hands-on exercises, real-time query execution, 
              and structured lessons. From basic SELECT to advanced window functions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/learn" className="btn-primary flex items-center justify-center gap-2">
                <BookOpen size={18} />
                Start Learning
              </Link>
              <Link to="/playground" className="btn-secondary flex items-center justify-center gap-2">
                <Play size={18} />
                Try Playground
              </Link>
            </div>

            <div className="flex items-center gap-8 mt-10 justify-center lg:justify-start">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">50+</div>
                <div className="text-sm text-gray-500">Lessons</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">300+</div>
                <div className="text-sm text-gray-500">Problems</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">100%</div>
                <div className="text-sm text-gray-500">Free</div>
              </div>
            </div>
          </motion.div>

          {/* Right - Animated SQL Editor */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="glass-card p-1 shadow-2xl shadow-primary-500/10">
              <div className="bg-dark-900 rounded-lg overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 bg-dark-800 border-b border-dark-700">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="ml-2 text-xs text-gray-500">query.sql</span>
                </div>
                <div className="p-6 font-mono text-sm">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                  >
                    <span className="text-primary-400">SELECT</span>{' '}
                    <span className="text-accent-400">e.name</span>,{' '}
                    <span className="text-accent-400">d.department</span>,{' '}
                    <span className="text-accent-400">e.salary</span>
                    <br />
                    <span className="text-primary-400">FROM</span>{' '}
                    <span className="text-green-400">employees</span>{' '}
                    <span className="text-gray-500">e</span>
                    <br />
                    <span className="text-primary-400">INNER JOIN</span>{' '}
                    <span className="text-green-400">departments</span>{' '}
                    <span className="text-gray-500">d</span>
                    <br />
                    {'  '}<span className="text-primary-400">ON</span>{' '}
                    <span className="text-accent-400">e.dept_id</span>{' '}
                    <span className="text-white">=</span>{' '}
                    <span className="text-accent-400">d.id</span>
                    <br />
                    <span className="text-primary-400">WHERE</span>{' '}
                    <span className="text-accent-400">e.salary</span>{' '}
                    <span className="text-white">&gt;</span>{' '}
                    <span className="text-orange-400">50000</span>
                    <br />
                    <span className="text-primary-400">ORDER BY</span>{' '}
                    <span className="text-accent-400">e.salary</span>{' '}
                    <span className="text-primary-400">DESC</span>;
                  </motion.div>
                </div>
                {/* Result preview */}
                <div className="border-t border-dark-700 p-4">
                  <div className="text-xs text-green-400 mb-2">✓ 3 rows returned (12ms)</div>
                  <div className="overflow-x-auto">
                    <table className="text-xs w-full">
                      <thead>
                        <tr className="text-gray-500 border-b border-dark-700">
                          <th className="text-left py-1 pr-4">name</th>
                          <th className="text-left py-1 pr-4">department</th>
                          <th className="text-left py-1">salary</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-300">
                        <tr><td className="py-1 pr-4">Sarah Chen</td><td className="pr-4">Engineering</td><td>95000</td></tr>
                        <tr><td className="py-1 pr-4">James Wilson</td><td className="pr-4">Product</td><td>87000</td></tr>
                        <tr><td className="py-1 pr-4">Maria Garcia</td><td className="pr-4">Engineering</td><td>82000</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    { icon: BookOpen, title: 'Structured Lessons', desc: 'From basics to advanced topics with clear explanations and examples.' },
    { icon: Code2, title: 'Live SQL Playground', desc: 'Write and execute SQL queries in real-time with instant feedback.' },
    { icon: Target, title: '300+ Practice Problems', desc: 'Sharpen your skills with problems ranging from easy to hard.' },
    { icon: Trophy, title: 'Gamification', desc: 'Earn XP, unlock achievements, and compete on the leaderboard.' },
    { icon: Zap, title: 'Daily Challenges', desc: 'New SQL challenges every day to keep your skills sharp.' },
    { icon: Users, title: 'Interview Prep', desc: 'Top SQL interview questions from leading tech companies.' },
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
            Everything You Need to <span className="gradient-text">Master SQL</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            A complete learning platform designed to take you from beginner to expert with interactive tools and real-world practice.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 hover:border-primary-500/50 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-primary-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-500/20 transition-all">
                <feature.icon size={24} className="text-primary-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RoadmapSection() {
  const stages = [
    { level: 'Beginner', topics: ['SELECT', 'WHERE', 'ORDER BY', 'INSERT', 'UPDATE', 'DELETE'], color: 'from-green-500 to-emerald-500' },
    { level: 'Intermediate', topics: ['JOINs', 'GROUP BY', 'Subqueries', 'UNION', 'Views', 'Constraints'], color: 'from-yellow-500 to-orange-500' },
    { level: 'Advanced', topics: ['Window Functions', 'CTEs', 'Indexing', 'Optimization', 'Transactions', 'Stored Procedures'], color: 'from-red-500 to-pink-500' },
  ];

  return (
    <section className="py-20 px-4 bg-dark-800/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
            Your SQL <span className="gradient-text">Learning Path</span>
          </h2>
          <p className="text-gray-400">A structured roadmap from zero to SQL mastery</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {stages.map((stage, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="glass-card p-6"
            >
              <div className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${stage.color} text-white text-sm font-medium mb-4`}>
                {stage.level}
              </div>
              <ul className="space-y-2">
                {stage.topics.map((topic, j) => (
                  <li key={j} className="flex items-center gap-2 text-gray-300">
                    <ChevronRight size={14} className="text-primary-400" />
                    {topic}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const testimonials = [
    { name: 'Alex Rivera', role: 'Junior Developer', text: 'SQLMaster helped me land my first job. The practice problems are incredibly well-structured.', rating: 5 },
    { name: 'Priya Sharma', role: 'Data Analyst', text: 'The interactive playground is amazing. I can practice queries without setting up a local database.', rating: 5 },
    { name: 'Marcus Johnson', role: 'CS Student', text: 'Best SQL learning resource I have found. The gamification keeps me motivated to learn daily.', rating: 5 },
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
            Loved by <span className="gradient-text">Learners</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={16} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-300 mb-4 italic">"{t.text}"</p>
              <div>
                <div className="font-semibold text-white">{t.name}</div>
                <div className="text-sm text-gray-500">{t.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-12 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-accent-500/5"></div>
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
              Ready to Start Your SQL Journey?
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Join thousands of learners mastering SQL with interactive lessons, real-time practice, and a supportive community.
            </p>
            <Link to="/register" className="btn-primary inline-flex items-center gap-2">
              Get Started Free <ChevronRight size={18} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-dark-700 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <Database size={18} className="text-white" />
              </div>
              <span className="text-lg font-display font-bold gradient-text">SQLMaster</span>
            </div>
            <p className="text-sm text-gray-500">The interactive platform for mastering SQL from beginner to advanced.</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Learn</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/learn" className="hover:text-white transition-colors">Lessons</Link></li>
              <li><Link to="/problems" className="hover:text-white transition-colors">Practice</Link></li>
              <li><Link to="/playground" className="hover:text-white transition-colors">Playground</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Community</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/leaderboard" className="hover:text-white transition-colors">Leaderboard</Link></li>
              <li><Link to="/daily-challenge" className="hover:text-white transition-colors">Daily Challenge</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/interview-prep" className="hover:text-white transition-colors">Interview Prep</Link></li>
              <li><Link to="/quizzes" className="hover:text-white transition-colors">Quizzes</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-dark-700 mt-8 pt-8 text-center text-sm text-gray-500">
          © 2024 SQLMaster. Built for learners, by learners.
        </div>
      </div>
    </footer>
  );
}

export default function Landing() {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <RoadmapSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
}
