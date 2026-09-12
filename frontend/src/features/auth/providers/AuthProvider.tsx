import { useEffect, type ReactNode } from 'react';
import { useAuthStore } from '../store/authStore';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const token = useAuthStore((state) => state.token);
  const fetchMe = useAuthStore((state) => state.fetchMe);

  useEffect(() => {
    if (token) {
      fetchMe();
    }
  }, [token, fetchMe]);

  return <>{children}</>;
}