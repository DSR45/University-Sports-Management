import axios from 'axios';
import API_BASE_URL from '../config/api';
import { toast } from 'react-toastify';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.warn('Network / API server connection unavailable. Using mock/local storage fallback:', error.message);
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    // Handle specific status codes
    switch (status) {
      case 401:
        // Unauthorized - clear storage and redirect
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Only redirect if not already on login page
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
          toast.error('Session expired. Please login again.', {
            toastId: 'session-expired'
          });
          window.location.href = '/login';
        }
        break;

      case 403:
        toast.error('You do not have permission to perform this action.', {
          toastId: 'forbidden'
        });
        break;

      case 404:
        // Don't show toast for 404 - let components handle it
        console.log('Resource not found:', error.config.url);
        break;

      case 500:
      case 502:
      case 503:
        console.warn('Backend server response error (500/502/503) for endpoint:', error.config?.url, '. Falling back to client-side data store.');
        break;

      case 429:
        toast.error('Too many requests. Please slow down.', {
          toastId: 'rate-limit'
        });
        break;

      default:
        // For other errors, let the calling code handle it
        console.error('API error:', status, data);
    }

    return Promise.reject(error);
  }
);

// Add request cancellation capability
export const createCancelToken = () => {
  return axios.CancelToken.source();
};

// Check if error is cancellation
export const isCancel = (error) => {
  return axios.isCancel(error);
};

export default axiosInstance;
