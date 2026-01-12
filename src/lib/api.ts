import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('API Request:', config.method?.toUpperCase(), `${config.baseURL}${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('API Response:', response.status, `${response.config.baseURL}${response.config.url}`);
    }
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.response?.data || error.message);
    
    // Enhanced error handling for better debugging
    if (error.response?.status === 401) {
      console.warn('Unauthorized access - please check authentication');
    } else if (error.response?.status === 404) {
      console.warn('Resource not found:', error.config?.url);
    } else if (error.response?.status >= 500) {
      console.error('Server error:', error.response?.data);
    } else if (error.code === 'ECONNREFUSED') {
      console.error('Connection refused - Backend server may not be running at:', API_BASE_URL);
    } else if (error.code === 'NETWORK_ERROR') {
      console.error('Network error - Check if backend is accessible at:', API_BASE_URL);
    }
    
    return Promise.reject(error);
  }
);

export default api;