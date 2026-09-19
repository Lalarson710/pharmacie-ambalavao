import apiClient from '@/api/client';
import type { Role } from '@/types';

export const rolesApi = {
  // Récupérer tous les rôles
  getAll: async (): Promise<Role[]> => {
    const response = await apiClient.get<Role[]>('/roles');
    return response.data; // Le backend retourne l'array directement
  },

  // Créer un rôle
  create: async (roleData: { nom: string; nom_affichage: string }): Promise<Role> => {
    const response = await apiClient.post<Role>('/roles', roleData);
    return response.data;
  },

  // Mettre à jour un rôle
  update: async (id: number, roleData: { nom: string; nom_affichage: string }): Promise<Role> => {
    const response = await apiClient.put<Role>(`/roles/${id}`, roleData);
    return response.data;
  },

  // Supprimer un rôle
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/roles/${id}`);
  },
};
