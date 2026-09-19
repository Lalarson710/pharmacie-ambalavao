import apiClient from '@/api/client';
import type { Permission } from '@/types';

export interface UserPermissionUpdate {
  permission_id: number;
  autorise: boolean;
}

export const permissionsApi = {
  // Récupérer toutes les permissions disponibles
  getAll: async (): Promise<Permission[]> => {
    const response = await apiClient.get<Permission[]>('/permissions');
    return response.data;
  },
};

export const userPermissionsApi = {
  // Récupérer les permissions d'un utilisateur spécifique
  getByUser: async (userId: number): Promise<Permission[]> => {
    const response = await apiClient.get<Permission[]>(
      `/utilisateurs/${userId}/permissions`
    );
    return response.data;
  },

  // Définir (activer/désactiver) une permission pour un utilisateur
  definir: async (
    userId: number,
    permissionId: number,
    autorise: boolean
  ): Promise<void> => {
    await apiClient.put(`/utilisateurs/${userId}/permissions`, {
      permission_id: permissionId,
      autorise,
    });
  },

  // Supprimer une permission individuelle d'un utilisateur
  supprimer: async (userId: number, permissionId: number): Promise<void> => {
    await apiClient.delete(
      `/utilisateurs/${userId}/permissions/${permissionId}`
    );
  },
};
