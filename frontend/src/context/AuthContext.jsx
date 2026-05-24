import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          // 1. Immediately set stored user so UI loads instantly without waiting
          setUser(JSON.parse(storedUser));
          
          // 2. Silently fetch fresh data from backend in the background
          const res = await api.get('/auth/me');
          
          // 3. Update context and local storage with fresh DB data
          // This ensures if an admin verified them while they were offline, it updates instantly
          setUser(res.data);
          localStorage.setItem('user', JSON.stringify(res.data));
        } catch(e) {
          // Only clear session if token is completely invalid/expired (401)
          if (e.response && e.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = (userData) => {
    localStorage.setItem('token', userData.token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateVerificationStatus = (status, role) => {
    if (user) {
      const updatedUser = { ...user, verificationStatus: status, role: role || user.role };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateVerificationStatus, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
