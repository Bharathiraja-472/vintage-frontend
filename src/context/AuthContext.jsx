import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('userInfo');

      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          // Validate token by fetching latest profile
          const { data } = await api.get('/auth/profile');
          setUser(data);
          localStorage.setItem('userInfo', JSON.stringify(data));
        } catch (err) {
          console.error('Session verification failed', err);
          logout();
        }
      }
      setLoading(false);
    };

    checkUserLoggedIn();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setUser(data);
      localStorage.setItem('token', data.token);
      // Remove token from object to store user details in userInfo
      const { token, ...userInfo } = data;
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      setLoading(false);
      throw err;
    }
  };

  const register = async (name, email, password, phone) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/auth/register', { name, email, password, phone });
      setUser(data);
      localStorage.setItem('token', data.token);
      const { token, ...userInfo } = data;
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
  };

  const updateProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.put('/auth/profile', profileData);
      setUser(data);
      const { token, ...userInfo } = data;
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Profile update failed');
      setLoading(false);
      throw err;
    }
  };

  const forgotPassword = async (email) => {
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      return data;
    } catch (err) {
      throw err.response?.data?.message || 'Request failed';
    }
  };

  const resetPassword = async (email, password) => {
    try {
      const { data } = await api.post('/auth/reset-password', { email, password });
      return data;
    } catch (err) {
      throw err.response?.data?.message || 'Reset password failed';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        forgotPassword,
        resetPassword,
        isAdmin: user && user.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
