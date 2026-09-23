import apiClient from '@/api/client';
import type { Client } from '@/types';

export interface CreateClientData {
  nom: string;
  telephone?: string | null;
  email?: string | null;
  adresse?: string | null;
  actif?: boolean;
}

export interface UpdateClientData {
  nom?: string;
  telephone?: string | null;
  email?: string | null;
  adresse?: string | null;
  actif?: boolean;
}

export const clientsApi = {
  getAll: async (): Promise<Client[]> => {
    const response = await apiClient.get<Client[]>('/clients');
    return response.data;
  },

  getById: async (id: number): Promise<Client> => {
    const response = await apiClient.get<Client>(`/clients/${id}`);
    return response.data;
  },

  create: async (data: CreateClientData): Promise<Client> => {
    const response = await apiClient.post<Client>('/clients', data);
    return response.data;
  },

  update: async (id: number, data: UpdateClientData): Promise<Client> => {
    const response = await apiClient.put<Client>(`/clients/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/clients/${id}`);
  },
};
