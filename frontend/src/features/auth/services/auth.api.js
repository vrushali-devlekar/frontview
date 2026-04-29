import axios from 'axios';
import Cookies from 'js-cookie';

// Create an axios instance
const authApiInstance = axios.create({
  baseURL: '/api/auth', // Using proxy if configured or relative to backend
  withCredentials:true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add token to requests
authApiInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authApi = {
  // Start GitHub OAuth Flow
  loginWithGithub: () => {
    // Redirect browser to backend OAuth endpoint
    window.location.href = 'http://localhost:5000/api/auth/github';
  },

  // Register user
  register: async (userData) => {
    const response = await authApiInstance.post('/register', userData);
    return response.data;
  },

  // Login user
  login: async (userData) => {
    const response = await authApiInstance.post('/login', userData);
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await authApiInstance.get('/logout');
    return response.data;
  },
};
