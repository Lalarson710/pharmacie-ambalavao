import type { LoginCredentials, LoginResponse, LogoutResponse, User } from '../types';
import { utilisateurConnecte } from '@/data/mockData';

/**
 * Version statique — aucun appel HTTP vers le back-Pharmacie.
 * Les données proviennent de src/data/mockData.ts.
 */
export const authApi = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const validEmail = utilisateurConnecte.email;
    const validPassword = 'pharmagestion2024';

    if (
      credentials.email === validEmail &&
      credentials.password === validPassword
    ) {
      return {
        message: 'Connexion réussie.',
        user: utilisateurConnecte,
        token: 'static-token-pharmacie-ambalavao',
      };
    }

    throw new Error('Nom d\'utilisateur ou mot de passe incorrect.');
  },

  async logout(): Promise<LogoutResponse> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { message: 'Déconnexion réussie.' };
  },

  async me(): Promise<User> {
    return utilisateurConnecte;
  },
};
