import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LoginCredentials, LoginResponse, User } from '../types';
import { utilisateurConnecte } from '@/data/mockData';

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

      // ── Version statique : aucun appel API ──────────────────────────────
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });

        // Simule un délai réseau minimal
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Validation statique — les identifiants de test sont ceux du mock
        const validEmail = utilisateurConnecte.email;
        const validPassword = 'pharmagestion2024';

        if (
          credentials.email === validEmail &&
          credentials.password === validPassword
        ) {
          const response: LoginResponse = {
            message: 'Connexion réussie.',
            user: utilisateurConnecte,
            token: 'static-token-pharmacie-ambalavao',
          };

          localStorage.setItem('auth_token', response.token);
          localStorage.setItem('auth_user', JSON.stringify(response.user));

          set({
            token: response.token,
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
          });

          return response;
        }

        const message = 'Nom d\'utilisateur ou mot de passe incorrect.';
        set({ error: message, isLoading: false, isAuthenticated: false });
        throw new Error(message);
      },

      logout: async () => {
        set({ isLoading: true });

        // Simule un délai
        await new Promise((resolve) => setTimeout(resolve, 300));

        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');

        set({
          token: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      fetchMe: async () => {
        const token = get().token;
        if (!token) {
          return;
        }
        set({ isLoading: true });

        // Version statique : utilise les données en localStorage ou le mock
        const storedUser = localStorage.getItem('auth_user');
        if (storedUser) {
          set({ user: JSON.parse(storedUser) as User, isLoading: false });
        } else {
          set({ user: utilisateurConnecte, isLoading: false });
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
