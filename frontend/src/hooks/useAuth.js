// Authentication state

import { useState, useEffect } from 'react';
import { authAPI } from '../api/auth';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const storedUser = authAPI.getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
      setIsAdmin(storedUser.role === 'ADMINISTRATOR');
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { user: loggedInUser } = await authAPI.login(email, password);
    setUser(loggedInUser);
    setIsAdmin(loggedInUser.role === 'ADMINISTRATOR');
    return loggedInUser;
  };

  const logout = async () => {
    await authAPI.logout();
    setUser(null);
    setIsAdmin(false);
  };

  return { user, loading, isAdmin, login, logout };
};