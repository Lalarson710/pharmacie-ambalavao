import apiClient from '@/api/client';
import type { Facture, Reglement, Vente, VenteLigne } from '@/types';

export interface CreateVenteData {
  client_id?: number | null;
  date_vente: string;
  montant_total?: number;
  observation?: string | null;
}

export interface UpdateVenteData {
  client_id?: number | null;
  date_vente?: string;
  montant_total?: number;
  observation?: string | null;
}

export interface CreateVenteLigneData {
  vente_id: number;
  produit_id: number;
  lot_id: number;
  conditionnement_id?: number | null;
  quantite: number;
}

export interface UpdateVenteLigneData {
  vente_id?: number;
  produit_id?: number;
  lot_id?: number;
  conditionnement_id?: number | null;
  quantite?: number;
}

export interface CreateReglementData {
  facture_id: number;
  montant: number;
  mode: string;
  date_reglement: string;
  reference?: string | null;
}

/**
 * Le numéro de vente est généré par le backend.
 * Cette valeur de secours n'est envoyée que si le backend l'exige encore
 * (elle est ignorée par la validation des données côté API).
 */
function genererNumeroVenteSecours(): string {
  const maintenant = new Date();
  const suffixe = [
    maintenant.getFullYear(),
    String(maintenant.getMonth() + 1).padStart(2, '0'),
    String(maintenant.getDate()).padStart(2, '0'),
    String(maintenant.getHours()).padStart(2, '0'),
    String(maintenant.getMinutes()).padStart(2, '0'),
    String(maintenant.getSeconds()).padStart(2, '0'),
  ].join('');

  return `VTE-${suffixe}`;
}

export const ventesApi = {
  getAll: async (): Promise<Vente[]> => {
    const response = await apiClient.get<Vente[]>('/ventes');
    return response.data;
  },

  getById: async (id: number): Promise<Vente> => {
    const response = await apiClient.get<Vente>(`/ventes/${id}`);
    return response.data;
  },

  create: async (data: CreateVenteData): Promise<Vente> => {
    const response = await apiClient.post<Vente>('/ventes', {
      ...data,
      numero: genererNumeroVenteSecours(),
    });
    return response.data;
  },

  update: async (id: number, data: UpdateVenteData): Promise<Vente> => {
    const response = await apiClient.put<Vente>(`/ventes/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/ventes/${id}`);
  },

  confirmer: async (id: number): Promise<Vente> => {
    const response = await apiClient.post<{ message: string; vente: Vente }>(
      `/ventes/${id}/confirmer`
    );
    return response.data.vente;
  },

  annuler: async (id: number): Promise<Vente> => {
    const response = await apiClient.post<{ message: string; vente: Vente }>(
      `/ventes/${id}/annuler`
    );
    return response.data.vente;
  },
};

export const ventesLignesApi = {
  /** Aplatit les lignes de toutes les ventes renvoyées par l'API. */
  getAll: async (): Promise<VenteLigne[]> => {
    const response = await apiClient.get<Vente[]>('/ventes');
    const allLignes: VenteLigne[] = [];
    for (const vente of response.data) {
      if (vente.lignes && vente.lignes.length > 0) {
        allLignes.push(...vente.lignes);
      }
    }
    return allLignes;
  },

  getByVente: async (venteId: number): Promise<VenteLigne[]> => {
    const response = await apiClient.get<VenteLigne[]>(`/ventes/${venteId}/lignes`);
    return response.data;
  },

  getById: async (id: number): Promise<VenteLigne> => {
    const response = await apiClient.get<VenteLigne>(`/vente-lignes/${id}`);
    return response.data;
  },

  create: async (data: CreateVenteLigneData): Promise<VenteLigne> => {
    const response = await apiClient.post<VenteLigne>(
      `/ventes/${data.vente_id}/lignes`,
      data
    );
    return response.data;
  },

  /**
   * L'API n'expose pas de PUT /vente-lignes/{id} : la modification est donc
   * realisee en supprimant la ligne (le stock est reinstate par le backend)
   * puis en la recreant avec les nouvelles valeurs. Le total de la vente est
   * recalcule par le backend apres chaque operation.
   *
   * Les champs absents de `data` sont repris depuis la ligne existante.
   */
  update: async (
    id: number,
    data: UpdateVenteLigneData
  ): Promise<VenteLigne> => {
    let courante: VenteLigne | null = null;

    const lireSiNecessaire = async () => {
      if (!courante) {
        const response = await apiClient.get<VenteLigne>(`/vente-lignes/${id}`);
        courante = response.data;
      }
      return courante;
    };

    const venteId = data.vente_id ?? (await lireSiNecessaire()).vente_id;
    const produitId = data.produit_id ?? (await lireSiNecessaire()).produit_id;
    const lotId = data.lot_id ?? (await lireSiNecessaire()).lot_id;
    const conditionnementId = data.conditionnement_id ?? (await lireSiNecessaire()).conditionnement_id ?? null;
    const quantite = data.quantite ?? (await lireSiNecessaire()).quantite;

    // La suppression remet la quantite dans le stock, la recreation la re-sort.
    await apiClient.delete(`/vente-lignes/${id}`);

    const response = await apiClient.post<VenteLigne>(
      `/ventes/${venteId}/lignes`,
      { vente_id: venteId, produit_id: produitId, lot_id: lotId, conditionnement_id: conditionnementId, quantite }
    );

    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/vente-lignes/${id}`);
  },
};

export const facturesApi = {
  getAll: async (): Promise<Facture[]> => {
    const response = await apiClient.get<Facture[]>('/factures');
    return response.data;
  },

  getById: async (id: number): Promise<Facture> => {
    const response = await apiClient.get<Facture>(`/factures/${id}`);
    return response.data;
  },
};

export const reglementsApi = {
  getAll: async (): Promise<Reglement[]> => {
    const response = await apiClient.get<Reglement[]>('/reglements');
    return response.data;
  },

  getById: async (id: number): Promise<Reglement> => {
    const response = await apiClient.get<Reglement>(`/reglements/${id}`);
    return response.data;
  },

  create: async (data: CreateReglementData): Promise<Reglement> => {
    const response = await apiClient.post<Reglement>('/reglements', data);
    return response.data;
  },
};
