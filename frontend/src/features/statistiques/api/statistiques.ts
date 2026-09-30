import apiClient from '@/api/client';
import type { ChiffreAffaires, ProduitPlusVendu, Vente } from '@/types';

export interface StatistiquesVentes {
  nombre_ventes: number;
  chiffre_affaires: number;
  ventes: Vente[];
}

export interface PeriodeParams {
  date_debut: string;
  date_fin: string;
}

/**
 * API du module Statistiques.
 * Consomme les routes deja existantes cote backend :
 *  GET /statistiques/ventes              -> { nombre_ventes, chiffre_affaires, ventes }
 *  GET /statistiques/produits-plus-vendus-> [ { id, nom, quantite_vendue, chiffre_affaires } ]
 *  GET /statistiques/chiffre-affaires    -> { date_debut, date_fin, chiffre_affaires }
 */
export const statistiquesApi = {
  getVentes: async (params: PeriodeParams): Promise<StatistiquesVentes> => {
    const response = await apiClient.get<{ data: StatistiquesVentes }>(
      '/statistiques/ventes',
      { params },
    );
    return response.data.data;
  },

  getProduitsPlusVendus: async (params: PeriodeParams): Promise<ProduitPlusVendu[]> => {
    const response = await apiClient.get<{ data: ProduitPlusVendu[] }>(
      '/statistiques/produits-plus-vendus',
      { params },
    );
    return response.data.data ?? [];
  },

  getChiffreAffaires: async (params: PeriodeParams): Promise<ChiffreAffaires> => {
    const response = await apiClient.get<{ data: ChiffreAffaires }>(
      '/statistiques/chiffre-affaires',
      { params },
    );
    return response.data.data;
  },
};
