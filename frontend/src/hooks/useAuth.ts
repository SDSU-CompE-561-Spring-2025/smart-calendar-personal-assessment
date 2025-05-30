import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('access_token');
      setIsLoggedIn(!!token);
      setLoading(false);
    };

    // Check on initial load
    checkAuth();

    // Set up event listener for storage changes
    window.addEventListener('storage', checkAuth);
    
    // Set up custom event listener for auth changes
    const handleAuthChange = () => {
      checkAuth();
    };
    
    window.addEventListener('auth-change', handleAuthChange);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);

  const login = (token: string) => {
    localStorage.setItem('access_token', token);
    setIsLoggedIn(true);
    
    // Dispatch a custom event to notify other components
    window.dispatchEvent(new Event('auth-change'));
  };

  const logout = () => {
    // Clear all authentication and user preference data from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('theme');
    localStorage.removeItem('color-theme');
    localStorage.removeItem('calendar-start-day');
    
    setIsLoggedIn(false);
    
    // Dispatch a custom event to notify other components
    window.dispatchEvent(new Event('auth-change'));
    
    // Force a full page reload to reset all theme settings
    window.location.href = '/signin';
  };

  return { isLoggedIn, loading, login, logout };
} 