import apiClient from '@/api/client';
import type { User } from '@/types';

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role_id: number;
}

export interface UpdateUserData {
  name: string;
  email: string;
  role_id: number;
  password?: string;
}

export const utilisateursApi = {
  getAll: async (): Promise<User[]> => {
    const response = await apiClient.get<User[]>('/utilisateurs');
    return response.data;
  },

  getById: async (id: number): Promise<User> => {
    const response = await apiClient.get<User>(`/utilisateurs/${id}`);
    return response.data;
  },

  create: async (userData: CreateUserData): Promise<User> => {
    const response = await apiClient.post<User>('/utilisateurs', userData);
    return response.data;
  },

  update: async (id: number, userData: UpdateUserData): Promise<User> => {
    const response = await apiClient.put<User>(`/utilisateurs/${id}`, userData);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/utilisateurs/${id}`);
  },
};
