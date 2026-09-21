import apiClient from '@/api/client';
import type { Fournisseur } from '@/types';

export interface CreateFournisseurData {
  nom: string;
  telephone?: string | null;
  email?: string | null;
  adresse?: string | null;
  actif?: boolean;
}

export interface UpdateFournisseurData {
  nom: string;
  telephone?: string | null;
  email?: string | null;
  adresse?: string | null;
  actif?: boolean;
}

export const fournisseursApi = {
  getAll: async (): Promise<Fournisseur[]> => {
    const response = await apiClient.get<Fournisseur[]>('/fournisseurs');
    return response.data;
  },

  getById: async (id: number): Promise<Fournisseur> => {
    const response = await apiClient.get<Fournisseur>(`/fournisseurs/${id}`);
    return response.data;
  },

  create: async (data: CreateFournisseurData): Promise<Fournisseur> => {
    const response = await apiClient.post<Fournisseur>('/fournisseurs', data);
    return response.data;
  },

  update: async (id: number, data: UpdateFournisseurData): Promise<Fournisseur> => {
    const response = await apiClient.put<Fournisseur>(`/fournisseurs/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/fournisseurs/${id}`);
  },
};
