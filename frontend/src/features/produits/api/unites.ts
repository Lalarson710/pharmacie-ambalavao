import apiClient from '@/api/client';
import type { Unite } from '@/types';

export interface CreateUniteData {
  nom: string;
  abreviation?: string | null;
  actif?: boolean;
}

export interface UpdateUniteData {
  nom?: string;
  abreviation?: string | null;
  actif?: boolean;
}

export const unitesApi = {
  getAll: async (): Promise<Unite[]> => {
    const response = await apiClient.get<Unite[]>('/unites');
    return response.data;
  },

  create: async (data: CreateUniteData): Promise<Unite> => {
    const response = await apiClient.post<Unite>('/unites', data);
    return response.data;
  },

  update: async (id: number, data: UpdateUniteData): Promise<Unite> => {
    const response = await apiClient.put<Unite>(`/unites/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/unites/${id}`);
  },
};
