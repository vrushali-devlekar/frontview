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

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);
export const logout = () => api.post('/auth/logout');
export const getCurrentUser = () => api.get('/auth/me');
export const updateCurrentUser = (payload) => api.put('/auth/me', payload);

// Projects
export const getProjects = () => api.get('/projects');

export const getProject = (projectId) => api.get(`/projects/${projectId}`);

export const getGithubRepos = (search) =>
  api.get("/projects/repos", { params: search ? { search } : {} });

export const createProject = (payload) => api.post("/projects", payload);

// Deployments
export const listDeployments = (projectId) =>
  api.get('/deployments', { params: { projectId } });

export const triggerDeployment = (projectId) =>
  api.post('/deployments', { projectId });

export const getDeployment = (deploymentId) =>
  api.get(`/deployments/${deploymentId}`);

export const stopDeploymentRequest = (deploymentId) =>
  api.post(`/deployments/${deploymentId}/stop`);

export const analyzeDeploymentLogs = (deploymentId, body = {}) =>
  api.post(`/deployments/${deploymentId}/analyze-logs`, body);

export const rollbackProject = (projectId, version) =>
  api.post(`/projects/${projectId}/rollback/${version}`);

export default api;
