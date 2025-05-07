import { useState, useEffect } from 'react';
import { API_HOST_BASE_URL } from '@/lib/constants';

type User = {
  name: string;
  email: string;
  avatar?: string;
  first_name?: string;
  last_name?: string;
};

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_HOST_BASE_URL}/user/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        
        // Format user data
        setUser({
          name: `${data.first_name} ${data.last_name}`,
          email: data.email,
          avatar: data.avatar || '',
          first_name: data.first_name,
          last_name: data.last_name
        });
        
      } catch (err) {
        console.error('Error fetching user:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading, error };
} 