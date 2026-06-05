import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});

// Request interceptor — attach JWT token from localStorage to every request
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

// Response interceptor — handle 401/403 by clearing session
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login?msg=' + encodeURIComponent(error.response.data?.message || 'Session expired');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
