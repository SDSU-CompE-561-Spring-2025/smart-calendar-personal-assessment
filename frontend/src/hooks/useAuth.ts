import { useState, useEffect, useCallback } from 'react';

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Define checkAuth as a callback so we can call it from login/logout
  const checkAuth = useCallback(() => {
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
    setLoading(false);
  }, []);

  useEffect(() => {
    // Check on initial load
    checkAuth();

    // Set up event listener for storage changes
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, [checkAuth]);

  const login = (token: string) => {
    localStorage.setItem('access_token', token);
    // Explicitly check auth after login
    checkAuth();
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    // Explicitly check auth after logout
    checkAuth();
  };

  return { isLoggedIn, loading, login, logout, checkAuth };
} 