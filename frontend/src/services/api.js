import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://sqlmaster-zrz1.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  googleLogin: (data) => api.post('/auth/google', data),
  getMe: () => api.get('/auth/me'),
  updateMe: (data) => api.put('/auth/me', data),
};

// Lesson APIs
export const lessonAPI = {
  getAll: (params) => api.get('/lessons', { params }),
  getBySlug: (slug) => api.get(`/lessons/${slug}`),
  getCategories: () => api.get('/lessons/categories'),
  updateProgress: (lessonId, data) => api.post(`/lessons/${lessonId}/progress`, data),
};

// Quiz APIs
export const quizAPI = {
  getAll: (params) => api.get('/quizzes', { params }),
  getById: (id) => api.get(`/quizzes/${id}`),
  submit: (id, data) => api.post(`/quizzes/${id}/submit`, data),
};

// Problem APIs
export const problemAPI = {
  getAll: (params) => api.get('/problems', { params }),
  getBySlug: (slug) => api.get(`/problems/${slug}`),
  submit: (id, data) => api.post(`/problems/${id}/submit`, data),
};

// Playground APIs
export const playgroundAPI = {
  execute: (data) => api.post('/playground/execute', data),
  explain: (data) => api.post('/playground/explain', data),
  getDatasets: () => api.get('/playground/datasets'),
  getSchema: (dataset) => api.get(`/playground/schema/${dataset}`),
};

// Progress APIs
export const progressAPI = {
  getMyProgress: () => api.get('/progress/me'),
  getLeaderboard: () => api.get('/progress/leaderboard'),
  getAchievements: () => api.get('/progress/achievements'),
  getDailyChallenge: () => api.get('/progress/daily-challenge'),
};

// Admin APIs
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  toggleUser: (id) => api.put(`/admin/users/${id}/toggle-active`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  deleteLesson: (id) => api.delete(`/admin/lessons/${id}`),
};

export default api;
