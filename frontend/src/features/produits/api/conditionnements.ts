import apiClient from '@/api/client';
import type { ProduitConditionnement } from '@/types';

export interface CreateConditionnementData {
  produit_id: number;
  unite_id: number;
  quantite_base: number;
  prix_vente: number;
  code_barres?: string | null;
  est_unite_base?: boolean;
  actif?: boolean;
}

export interface UpdateConditionnementData {
  unite_id?: number;
  quantite_base?: number;
  prix_vente?: number;
  code_barres?: string | null;
  est_unite_base?: boolean;
  actif?: boolean;
}

export const conditionnementsApi = {
  getAll: async (): Promise<ProduitConditionnement[]> => {
    const response = await apiClient.get<ProduitConditionnement[]>('/produit-conditionnements');
    return response.data;
  },

  getByProduit: async (produitId: number): Promise<ProduitConditionnement[]> => {
    const response = await apiClient.get<ProduitConditionnement[]>(`/produits/${produitId}/conditionnements`);
    return response.data;
  },

  getById: async (id: number): Promise<ProduitConditionnement> => {
    const response = await apiClient.get<ProduitConditionnement>(`/produit-conditionnements/${id}`);
    return response.data;
  },

  create: async (data: CreateConditionnementData): Promise<ProduitConditionnement> => {
    const response = await apiClient.post<ProduitConditionnement>('/produit-conditionnements', data);
    return response.data;
  },

  update: async (id: number, data: UpdateConditionnementData): Promise<ProduitConditionnement> => {
    const response = await apiClient.put<ProduitConditionnement>(`/produit-conditionnements/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/produit-conditionnements/${id}`);
  },
};