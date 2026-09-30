import apiClient from '@/api/client';
import type { Rapport } from '@/types';

export interface CreateRapportData {
  type: string;
  date_debut: string;
  date_fin: string;
  montant_total?: number;
  description?: string | null;
}

export type UpdateRapportData = Partial<CreateRapportData>;

/**
 * API du module Rapports — routes deja existantes cote backend :
 *  GET    /rapports
 *  GET    /rapports/{id}
 *  POST   /rapports
 *  PUT    /rapports/{id}
 *  DELETE /rapports/{id}
 */
export const rapportsApi = {
  getAll: async (): Promise<Rapport[]> => {
    const response = await apiClient.get<Rapport[]>('/rapports');
    return response.data ?? [];
  },

  getById: async (id: number): Promise<Rapport> => {
    const response = await apiClient.get<Rapport>(`/rapports/${id}`);
    return response.data;
  },

  create: async (data: CreateRapportData): Promise<Rapport> => {
    const response = await apiClient.post<Rapport>('/rapports', data);
    return response.data;
  },

  update: async (id: number, data: UpdateRapportData): Promise<Rapport> => {
    const response = await apiClient.put<Rapport>(`/rapports/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/rapports/${id}`);
  },
};
