import apiClient from '@/api/client';
import type { Personnel } from '@/types';

export interface CreatePersonnelData {
  user_id: number | null;
  nom: string;
  prenom: string;
  telephone: string | null;
  email: string | null;
  adresse: string | null;
  fonction: string;
  date_embauche: string | null;
  actif: boolean;
}

export interface UpdatePersonnelData {
  user_id: number | null;
  nom: string;
  prenom: string;
  telephone: string | null;
  email: string | null;
  adresse: string | null;
  fonction: string;
  date_embauche: string | null;
  actif: boolean;
}

export const personnelApi = {
  getAll: async (): Promise<Personnel[]> => {
    const response = await apiClient.get<Personnel[]>('/personnels');
    return response.data;
  },

  create: async (data: CreatePersonnelData): Promise<Personnel> => {
    const response = await apiClient.post<Personnel>('/personnels', data);
    return response.data;
  },

  update: async (id: number, data: UpdatePersonnelData): Promise<Personnel> => {
    const response = await apiClient.put<Personnel>(`/personnels/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/personnels/${id}`);
  },
};
