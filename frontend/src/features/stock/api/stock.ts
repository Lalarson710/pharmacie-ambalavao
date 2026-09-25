import apiClient from '@/api/client';
import type { Inventaire, Lot, MouvementStock, Produit } from '@/types';

export type StockParProduit = Produit & {
  lots_sum_quantite?: number | string | null;
};

export interface CreateMouvementStockData {
  lot_id: number;
  type: 'entree' | 'sortie' | 'ajustement';
  quantite: number;
  motif?: string | null;
}

export interface UpdateMouvementStockData {
  lot_id?: number;
  type?: 'entree' | 'sortie' | 'ajustement';
  quantite?: number;
  motif?: string | null;
}

export interface CreateInventaireData {
  date_inventaire: string;
  motif?: string | null;
}

export interface UpdateInventaireData {
  date_inventaire?: string;
  motif?: string | null;
}

export interface CreateInventaireLigneData {
  lot_id: number;
  quantite_reelle: number;
}

export interface UpdateInventaireLigneData {
  lot_id?: number;
  quantite_reelle?: number;
}

export const stockApi = {
  async getStockParProduit(): Promise<StockParProduit[]> {
    const response = await apiClient.get<StockParProduit[]>('/stocks/produits');
    return response.data;
  },

  async getLots(): Promise<Lot[]> {
    const response = await apiClient.get<Lot[]>('/lots');
    return response.data;
  },

  async getMouvements(): Promise<MouvementStock[]> {
    const response = await apiClient.get<MouvementStock[]>('/mouvements-stock');
    return response.data;
  },

  async getInventaires(): Promise<Inventaire[]> {
    const response = await apiClient.get<Inventaire[]>('/inventaires');
    return response.data;
  },

  async createMouvement(data: CreateMouvementStockData): Promise<MouvementStock> {
    const response = await apiClient.post<MouvementStock>('/mouvements-stock', data);
    return response.data;
  },

  async updateMouvement(
    id: number,
    data: UpdateMouvementStockData,
  ): Promise<MouvementStock> {
    const response = await apiClient.put<MouvementStock>(
      `/mouvements-stock/${id}`,
      data,
    );
    return response.data;
  },

  async deleteMouvement(id: number): Promise<void> {
    await apiClient.delete(`/mouvements-stock/${id}`);
  },

  async createInventaire(data: CreateInventaireData): Promise<Inventaire> {
    const response = await apiClient.post<Inventaire>('/inventaires', data);
    return response.data;
  },

  async updateInventaire(
    id: number,
    data: UpdateInventaireData,
  ): Promise<Inventaire> {
    const response = await apiClient.put<Inventaire>(
      `/inventaires/${id}`,
      data,
    );
    return response.data;
  },

  async deleteInventaire(id: number): Promise<void> {
    await apiClient.delete(`/inventaires/${id}`);
  },

  async createInventaireLigne(
    inventaireId: number,
    data: CreateInventaireLigneData,
  ): Promise<Inventaire> {
    const response = await apiClient.post<Inventaire>(
      `/inventaires/${inventaireId}/lignes`,
      data,
    );
    return response.data;
  },

  async updateInventaireLigne(
    inventaireId: number,
    ligneId: number,
    data: UpdateInventaireLigneData,
  ): Promise<Inventaire> {
    const response = await apiClient.put<Inventaire>(
      `/inventaires/${inventaireId}/lignes/${ligneId}`,
      data,
    );
    return response.data;
  },

  async deleteInventaireLigne(
    inventaireId: number,
    ligneId: number,
  ): Promise<void> {
    await apiClient.delete(
      `/inventaires/${inventaireId}/lignes/${ligneId}`,
    );
  },
};
