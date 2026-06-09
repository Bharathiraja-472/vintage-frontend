import axios from "axios";

// Backend server base (without /api suffix) — used for resolving upload image URLs
const BACKEND_URL = (import.meta.env.VITE_API_URL || '').replace('/api', '');

/**
 * Converts a stored image path to a fully qualified URL.
 * - Relative paths like /uploads/image.jpg  → https://vintage-backend-aoum.onrender.com/uploads/image.jpg
 * - Absolute URLs (Cloudinary, http://)     → returned unchanged
 */
export const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const baseUrl = BACKEND_URL.endsWith('/') ? BACKEND_URL.slice(0, -1) : BACKEND_URL;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};

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
