import apiClient from '@/api/client';
import type { Achat, AchatLigne } from '@/types';

export interface CreateAchatData {
  fournisseur_id: number;
  numero: string;
  date_achat: string;
  montant_total: number;
  statut?: string;
  observation?: string | null;
}

export interface AchatStatut {
  id: number;
  achat_id: number;
  statut_precedent: string | null;
  nouveau_statut: string;
  commentaire: string | null;
  utilisateur_id: number | null;
  created_at: string;
}

export interface UpdateAchatData {
  fournisseur_id?: number;
  numero?: string;
  date_achat?: string;
  montant_total?: number;
  statut?: string;
  observation?: string | null;
}

export interface CreateAchatLigneData {
  achat_id: number;
  produit_id: number;
  quantite: number;
  prix_unitaire: number;
  numero_lot?: string | null;
  date_peremption?: string | null;
}

export interface UpdateAchatLigneData {
  achat_id?: number;
  produit_id?: number;
  quantite?: number;
  prix_unitaire?: number;
  numero_lot?: string | null;
  date_peremption?: string | null;
}

export const achatsApi = {
  getAll: async (): Promise<Achat[]> => {
    const response = await apiClient.get<Achat[]>('/achats');
    return response.data;
  },

  getById: async (id: number): Promise<Achat> => {
    const response = await apiClient.get<Achat>(`/achats/${id}`);
    return response.data;
  },

  create: async (data: CreateAchatData): Promise<Achat> => {
    const response = await apiClient.post<Achat>('/achats', data);
    return response.data;
  },

  update: async (id: number, data: UpdateAchatData): Promise<Achat> => {
    const response = await apiClient.put<Achat>(`/achats/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/achats/${id}`);
  },

  confirmer: async (id: number): Promise<Achat> => {
    const response = await apiClient.post<Achat>(`/achats/${id}/confirmer`);
    return response.data;
  },

  annuler: async (id: number): Promise<Achat> => {
    const response = await apiClient.post<Achat>(`/achats/${id}/annuler`);
    return response.data;
  },

  getStatutHistory: async (id: number): Promise<AchatStatut[]> => {
    const response = await apiClient.get<AchatStatut[]>(`/achats/${id}/statuts`);
    return response.data;
  },
};

export const achatsLignesApi = {
  getAll: async (): Promise<AchatLigne[]> => {
    const response = await apiClient.get<Achat[]>('/achats');
    const allLignes: AchatLigne[] = [];
    for (const achat of response.data) {
      if (achat.lignes && achat.lignes.length > 0) {
        allLignes.push(...achat.lignes);
      }
    }
    return allLignes;
  },

  getById: async (id: number): Promise<AchatLigne> => {
    const response = await apiClient.get<AchatLigne>(`/achat-lignes/${id}`);
    return response.data;
  },

  create: async (data: CreateAchatLigneData): Promise<AchatLigne> => {
    const response = await apiClient.post<AchatLigne>(
      `/achats/${data.achat_id}/lignes`,
      data
    );
    return response.data;
  },

  update: async (id: number, data: UpdateAchatLigneData): Promise<AchatLigne> => {
    const response = await apiClient.put<AchatLigne>(`/achat-lignes/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/achat-lignes/${id}`);
  },

  getDetail: async (id: number): Promise<Achat> => {
    const response = await apiClient.get<Achat>(`/achats/${id}`);
    return response.data;
  },
};
