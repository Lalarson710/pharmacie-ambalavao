import apiClient from '@/api/client';
import type { Lot } from '@/types';

export interface CreateLotData {
  produit_id: number;
  numero_lot: string;
  date_peremption: string;
  quantite: number;
}

export interface UpdateLotData {
  produit_id?: number;
  numero_lot?: string;
  date_peremption?: string;
  quantite?: number;
}

export const lotsApi = {
  getAll: async (): Promise<Lot[]> => {
    const response = await apiClient.get<Lot[]>('/lots');
    return response.data;
  },

  getById: async (id: number): Promise<Lot> => {
    const response = await apiClient.get<Lot>(`/lots/${id}`);
    return response.data;
  },

  create: async (data: CreateLotData): Promise<Lot> => {
    const response = await apiClient.post<Lot>('/lots', data);
    return response.data;
  },

  update: async (id: number, data: UpdateLotData): Promise<Lot> => {
    const response = await apiClient.put<Lot>(`/lots/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/lots/${id}`);
  },
};
