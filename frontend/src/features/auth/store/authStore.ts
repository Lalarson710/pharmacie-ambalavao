import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LoginCredentials, LoginResponse, User } from '../types';
import apiClient from '@/api/client';
import { AxiosError } from 'axios';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setToken: (token: string | null) => {
        set({ token, isAuthenticated: !!token });
      },

      setUser: (user: User | null) => {
        set({ user });
      },

      clearError: () => {
        set({ error: null });
      },

      // ── Version API réelle ──────────────────────────────
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiClient.post<LoginResponse>('/login', credentials);
          const { user, token, message } = response.data;

          localStorage.setItem('auth_token', token);
          localStorage.setItem('auth_user', JSON.stringify(user));

          set({
            token,
            user,
            isAuthenticated: true,
            isLoading: false,
          });

          // Récupérer l'utilisateur complet avec rôle ET permissions via /user
          try {
            const meResponse = await apiClient.get<User>('/user');
            const fullUser = meResponse.data;
            localStorage.setItem('auth_user', JSON.stringify(fullUser));
            set({ user: fullUser });
          } catch (err) {
            console.warn('Failed to fetch full user from /user:', err);
            // On garde l'utilisateur du login
          }

          return response.data;
        } catch (error: unknown) {
          let message = 'Nom d\'utilisateur ou mot de passe incorrect.';
          
          if (error instanceof AxiosError && error.response?.data?.message) {
            message = error.response.data.message;
          } else if (error instanceof Error) {
            message = error.message;
          }
          
          set({ error: message, isLoading: false, isAuthenticated: false });
          throw new Error(message);
        }
      },

      logout: async () => {
        set({ isLoading: true });

        try {
          const token = get().token;
          if (token) {
            await apiClient.post('/logout');
          }
        } catch {
          // Ignore logout API errors
        } finally {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');

          set({
            token: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      fetchMe: async () => {
        const token = get().token;
        if (!token) {
          return;
        }
        set({ isLoading: true });

        try {
          const meResponse = await apiClient.get<User>('/user');
          localStorage.setItem('auth_user', JSON.stringify(meResponse.data));
          set({ user: meResponse.data, isLoading: false });
        } catch {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          set({
            token: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

export const useAuth = () => {
  const store = useAuthStore();
  return {
    token: store.token,
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,
    login: store.login,
    logout: store.logout,
    fetchMe: store.fetchMe,
    setToken: store.setToken,
    setUser: store.setUser,
    clearError: store.clearError,
  };
};

export type { AuthStore, AuthState, AuthActions, LoginResponse, User };
