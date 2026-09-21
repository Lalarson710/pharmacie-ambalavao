import apiClient from '@/api/client';
import type { Produit } from '@/types';

export interface CreateProduitData {
  categorie_id: number;
  unite_id: number;
  nom: string;
  code_barres?: string | null;
  description?: string | null;
  prix_achat: number;
  prix_vente: number;
  stock_minimum?: number;
  actif?: boolean;
}

export interface UpdateProduitData {
  categorie_id?: number;
  unite_id?: number;
  nom?: string;
  code_barres?: string | null;
  description?: string | null;
  prix_achat?: number;
  prix_vente?: number;
  stock_minimum?: number;
  actif?: boolean;
}

export const produitsApi = {
  getAll: async (): Promise<Produit[]> => {
    const response = await apiClient.get<Produit[]>('/produits');
    return response.data;
  },

  getById: async (id: number): Promise<Produit> => {
    const response = await apiClient.get<Produit>(`/produits/${id}`);
    return response.data;
  },

  create: async (data: CreateProduitData): Promise<Produit> => {
    const response = await apiClient.post<Produit>('/produits', data);
    return response.data;
  },

  update: async (id: number, data: UpdateProduitData): Promise<Produit> => {
    const response = await apiClient.put<Produit>(`/produits/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/produits/${id}`);
  },
};
