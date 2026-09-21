import apiClient from '@/api/client';
import type { Categorie } from '@/types';

export interface CreateCategorieData {
  nom: string;
  description?: string | null;
  actif?: boolean;
}

export interface UpdateCategorieData {
  nom?: string;
  description?: string | null;
  actif?: boolean;
}

export const categoriesApi = {
  getAll: async (): Promise<Categorie[]> => {
    const response = await apiClient.get<Categorie[]>('/categories');
    return response.data;
  },

  getById: async (id: number): Promise<Categorie> => {
    const response = await apiClient.get<Categorie>(`/categories/${id}`);
    return response.data;
  },

  create: async (data: CreateCategorieData): Promise<Categorie> => {
    const response = await apiClient.post<Categorie>('/categories', data);
    return response.data;
  },

  update: async (id: number, data: UpdateCategorieData): Promise<Categorie> => {
    const response = await apiClient.put<Categorie>(`/categories/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/categories/${id}`);
  },
};
