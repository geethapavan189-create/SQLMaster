/**
 * Local progress tracking - stores all user progress in localStorage.
 * Never loses data, works without a backend database.
 */

const STORAGE_KEY = 'sqlmaster_progress';

function getProgress() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : getDefaultProgress();
  } catch {
    return getDefaultProgress();
  }
}

function getDefaultProgress() {
  return {
    completedLessons: [],
    xp: 0,
    level: 1,
    streak: 0,
    lastActiveDate: null,
    quizScores: {},
    problemsSolved: [],
    achievements: [],
  };
}

function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function completeLesson(slug) {
  const progress = getProgress();
  if (!progress.completedLessons.includes(slug)) {
    progress.completedLessons.push(slug);
    progress.xp += 20;
    progress.level = Math.floor(progress.xp / 100) + 1;
    updateStreak(progress);
    saveProgress(progress);
  }
  return progress;
}

export function saveQuizScore(quizId, score) {
  const progress = getProgress();
  progress.quizScores[quizId] = Math.max(progress.quizScores[quizId] || 0, score);
  if (score >= 75) {
    progress.xp += 30;
    progress.level = Math.floor(progress.xp / 100) + 1;
  }
  updateStreak(progress);
  saveProgress(progress);
  return progress;
}

export function solveProblem(slug) {
  const progress = getProgress();
  if (!progress.problemsSolved.includes(slug)) {
    progress.problemsSolved.push(slug);
    progress.xp += 15;
    progress.level = Math.floor(progress.xp / 100) + 1;
    updateStreak(progress);
    saveProgress(progress);
  }
  return progress;
}

export function isLessonCompleted(slug) {
  return getProgress().completedLessons.includes(slug);
}

export function isLessonUnlocked(slug, allLessons) {
  const progress = getProgress();
  const index = allLessons.findIndex(l => l.slug === slug);
  if (index === 0) return true;
  // All previous lessons must be completed
  for (let i = 0; i < index; i++) {
    if (!progress.completedLessons.includes(allLessons[i].slug)) {
      return false;
    }
  }
  return true;
}

export function getFirstLockedLesson(allLessons) {
  const progress = getProgress();
  return allLessons.find(l => !progress.completedLessons.includes(l.slug));
}

export function getUserProgress() {
  return getProgress();
}

export function resetProgress() {
  localStorage.removeItem(STORAGE_KEY);
}

function updateStreak(progress) {
  const today = new Date().toDateString();
  if (progress.lastActiveDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (progress.lastActiveDate === yesterday) {
      progress.streak += 1;
    } else if (progress.lastActiveDate !== today) {
      progress.streak = 1;
    }
    progress.lastActiveDate = today;
  }
}
