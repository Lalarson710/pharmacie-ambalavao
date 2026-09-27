import apiClient from '@/api/client';
import type { Caisse, MouvementCaisse } from '@/types';

export interface CreerMouvementCaisseData {
  caisse_id: number;
  reglement_id?: number | null;
  type: 'entree' | 'sortie';
  montant: number;
  motif?: string | null;
}

export const caissesApi = {
  getAll: async (): Promise<Caisse[]> => {
    const response = await apiClient.get<Caisse[]>('/caisses');
    return response.data;
  },

  getById: async (id: number): Promise<Caisse> => {
    const response = await apiClient.get<Caisse>(`/caisses/${id}`);
    return response.data;
  },

  /** La caisse est rattachée à l'utilisateur authentifié par le backend. */
  ouvrir: async (montantInitial: number): Promise<Caisse> => {
    const response = await apiClient.post<Caisse>('/caisses', {
      montant_initial: montantInitial,
    });
    return response.data;
  },

  fermer: async (id: number, montantFinal: number): Promise<Caisse> => {
    const response = await apiClient.post<Caisse>(`/caisses/${id}/fermer`, {
      montant_final: montantFinal,
    });
    return response.data;
  },
};

export const mouvementsCaisseApi = {
  getAll: async (): Promise<MouvementCaisse[]> => {
    const response = await apiClient.get<MouvementCaisse[]>('/mouvements-caisse');
    return response.data;
  },

  getByCaisse: async (caisseId: number): Promise<MouvementCaisse[]> => {
    const response = await apiClient.get<MouvementCaisse[]>(
      `/caisses/${caisseId}/mouvements`
    );
    return response.data;
  },

  create: async (data: CreerMouvementCaisseData): Promise<MouvementCaisse> => {
    const response = await apiClient.post<MouvementCaisse>('/mouvements-caisse', data);
    return response.data;
  },
};
