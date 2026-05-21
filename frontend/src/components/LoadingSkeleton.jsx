import { motion } from 'framer-motion';

export function CardSkeleton() {
  return (
    <div className="glass-card p-6 animate-pulse">
      <div className="h-4 bg-dark-700 rounded w-3/4 mb-4"></div>
      <div className="h-3 bg-dark-700 rounded w-full mb-2"></div>
      <div className="h-3 bg-dark-700 rounded w-5/6 mb-4"></div>
      <div className="flex gap-2">
        <div className="h-6 bg-dark-700 rounded-full w-16"></div>
        <div className="h-6 bg-dark-700 rounded-full w-20"></div>
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-dark-700 rounded w-1/3"></div>
      <div className="h-4 bg-dark-700 rounded w-2/3"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => <CardSkeleton key={i} />)}
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="h-4 bg-dark-700 rounded w-1/4"></div>
          <div className="h-4 bg-dark-700 rounded w-1/3"></div>
          <div className="h-4 bg-dark-700 rounded w-1/4"></div>
        </div>
      ))}
    </div>
  );
}
