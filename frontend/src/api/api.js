import axios from 'axios';

export const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth APIs
export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);
export const logout = async () => {
  // Backend exposes GET /api/auth/logout
  return api.get('/auth/logout');
};
export const getCurrentUser = () => api.get('/auth/me');

// Project APIs


export default api; 