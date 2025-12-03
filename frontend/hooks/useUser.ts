import { userInfo } from '@/@types/user';
import { getUser } from '@/actions/custom-response';
import { useState, useEffect } from 'react';



interface UseUserReturn {
  user: userInfo | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useUser = (): UseUserReturn => {
  const [user, setUser] = useState<userInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await getUser();
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch user'));
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return { user, loading, error, refetch: fetchUser };
};
