import axios from 'axios';
import { API_BASE_URL, SOCKET_ORIGIN, buildApiUrl } from './runtime';

/** Full URL for browser redirect (Passport OAuth). */
export const githubAuthUrl = buildApiUrl('/auth/github');
export const googleAuthUrl = buildApiUrl('/auth/google');

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// JWT INTERCEPTOR — Automatically attaches
// the Bearer token from localStorage to
// every outgoing request.
// ==========================================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ==========================================
// RESPONSE INTERCEPTOR — Handles 401
// (expired/invalid token) globally.
// ==========================================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const shouldSkipRedirect = error.config?.skipAuthRedirect

    if (status === 401 && !shouldSkipRedirect) {
      // Token expired or invalid — clear and redirect
      localStorage.removeItem('token');
      // Only redirect if not already on login/register/landing
      const path = window.location.pathname;
      if (!['/login', '/register', '/'].includes(path)) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);
export const logout = () => api.get('/auth/logout');
export const getCurrentUser = () => api.get('/auth/me');
export const updateCurrentUser = (payload) => api.put('/auth/me', payload);
export const updatePassword = (payload) => api.put('/auth/password', payload);

// PROJECT APIs
// ==========================================
export const getUserRepos = (search = '') =>
  api.get(`/projects/repos${search ? `?search=${search}` : ''}`, {
    skipAuthRedirect: true,
  });

export const getUserProjects = () => api.get('/projects');
export const getDashboardStats = () => api.get('/projects/stats');

export const createProject = (projectData) =>
  api.post('/projects', projectData);

export const getProjectById = (id) => api.get(`/projects/${id}`);

export const deleteProject = (id, options = {}) =>
  api.delete(`/projects/${id}`, { data: options });

export const updateProject = (id, data) => api.put(`/projects/${id}`, data);

// ==========================================
// DEPLOYMENT APIs
// ==========================================
export const triggerDeployment = (projectId) =>
  api.post('/deployments', { projectId });

export const getDeploymentStatus = (deploymentId) =>
  api.get(`/deployments/${deploymentId}`);

export const stopDeployment = (deploymentId) =>
  api.post(`/deployments/${deploymentId}/stop`);

export const analyzeDeploymentLogs = (deploymentId, logs) =>
  api.post(`/deployments/${deploymentId}/analyze-logs`, { logs });

export const rollbackDeployment = (projectId, version) =>
  api.post(`/projects/${projectId}/rollback/${version}`);

// ==========================================
// ENVIRONMENT VARIABLE APIs (AES-256)
// ==========================================
export const getEnvVars = (projectId) =>
  api.get(`/projects/${projectId}/env`);

export const addEnvVar = (projectId, key, value) =>
  api.post(`/projects/${projectId}/env`, { key, value });

export const deleteEnvVar = (projectId, key) =>
  api.delete(`/projects/${projectId}/env/${key}`);

// ==========================================
// INTEGRATION APIs (Universal)
// ==========================================
export const getIntegrations = (projectId) =>
  api.get(`/projects/${projectId}/integrations`);

export const connectIntegration = (projectId, integrationData) =>
  api.post(`/projects/${projectId}/integrations`, integrationData);

export const disconnectIntegration = (projectId, integrationId) =>
  api.delete(`/projects/${projectId}/integrations/${integrationId}`);

// Workspace APIs
export const getWorkspaceOverview = () => api.get('/workspace/overview');
export const getWorkspaceMetrics = () => api.get('/workspace/metrics');
export const getWorkspaceEnvironments = () => api.get('/workspace/environments');
export const getWorkspaceNotifications = () => api.get('/workspace/notifications');
export const searchWorkspace = (query) =>
  api.get('/workspace/search', { params: { q: query } });
export const getWorkspaceMembers = () => api.get('/workspace/members');
export const inviteWorkspaceMember = (payload) =>
  api.post('/workspace/members/invite', payload);

// Aliases to support existing React components
export const getProjects = getUserProjects;
export const getProject = getProjectById;
export const getGithubRepos = getUserRepos;
export const listDeployments = (projectId) =>
  api.get('/deployments', { params: { projectId } });
export const getDeployment = getDeploymentStatus;
export const stopDeploymentRequest = stopDeployment;
export const rollbackProject = rollbackDeployment;

export default api;
export { API_BASE_URL, SOCKET_ORIGIN, buildApiUrl };
