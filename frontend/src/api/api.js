import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/** Socket.IO server origin (no /api suffix). */
export const SOCKET_ORIGIN =
  import.meta.env.VITE_SOCKET_URL ||
  API_BASE_URL.replace(/\/api\/?$/, '') ||
  'http://localhost:5000';

/** Full URL for browser redirect (Passport OAuth). */
export const githubAuthUrl = `${API_BASE_URL}/auth/github`;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// JWT INTERCEPTOR
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 401 INTERCEPTOR
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      const path = window.location.pathname;
      if (!['/login', '/register', '/'].includes(path)) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ==========================================
// AUTH APIs
// ==========================================
export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);
export const logout = () => api.get('/auth/logout');
export const getCurrentUser = () => api.get('/auth/me');

// ==========================================
// PROJECT APIs
// ==========================================
export const getProjects = () => api.get('/projects');
export const getUserProjects = getProjects;
export const getProject = (projectId) => api.get(`/projects/${projectId}`);
export const getProjectById = getProject;

export const getGithubRepos = (search) =>
  api.get("/projects/repos", { params: search ? { search } : {} });
export const getUserRepos = getGithubRepos;

export const createProject = (payload) => api.post("/projects", payload);
export const deleteProject = (id) => api.delete(`/projects/${id}`);

// ==========================================
// ENVIRONMENT VARIABLE APIs (AES-256)
// ==========================================
export const getEnvVars = (projectId) =>
  api.get(`/projects/${projectId}/env`);

export const addEnvVar = (projectId, key, value) =>
  api.post(`/projects/${projectId}/env`, { key, value });

// ==========================================
// DEPLOYMENT APIs
// ==========================================
export const listDeployments = (projectId) =>
  api.get('/deployments', { params: { projectId } });

export const triggerDeployment = (projectId) =>
  api.post('/deployments', { projectId });

export const getDeployment = (deploymentId) =>
  api.get(`/deployments/${deploymentId}`);
export const getDeploymentStatus = getDeployment;

export const stopDeployment = (deploymentId) =>
  api.post(`/deployments/${deploymentId}/stop`);
export const stopDeploymentRequest = stopDeployment;

export const analyzeDeploymentLogs = (deploymentId, body = {}) =>
  api.post(`/deployments/${deploymentId}/analyze-logs`, body);

export const rollbackDeployment = (projectId, version) =>
  api.post(`/projects/${projectId}/rollback/${version}`);
export const rollbackProject = rollbackDeployment;

// ==========================================
// AI STREAMING (SSE) — uses fetch, not axios
// ==========================================
export const AI_DIAGNOSE_URL = `${API_BASE_URL}/ai/diagnose`;

export default api;
