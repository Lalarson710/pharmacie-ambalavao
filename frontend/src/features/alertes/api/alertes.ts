import apiClient from '@/api/client';
import type {
  AlertePeremption,
  AlerteRupture,
  AlerteStockFaible,
  ToutesAlertes,
} from '@/types';

/**
 * API du module Alertes.
 * Consomme les routes deja existantes cote backend :
 *  GET /alertes                  -> { stocks_faibles, ruptures, peremptions }
 *  GET /alertes/stocks-faibles   -> { data: [...] }
 *  GET /alertes/ruptures         -> { data: [...] }
 *  GET /alertes/peremptions?jours -> { data: [...] }
 */
export const alertesApi = {
  getToutes: async (jours = 30): Promise<ToutesAlertes> => {
    const response = await apiClient.get<ToutesAlertes>('/alertes', {
      params: { jours },
    });
    return response.data;
  },

  getStocksFaibles: async (): Promise<AlerteStockFaible[]> => {
    const response = await apiClient.get<{ data: AlerteStockFaible[] }>(
      '/alertes/stocks-faibles',
    );
    return response.data.data ?? [];
  },

  getRuptures: async (): Promise<AlerteRupture[]> => {
    const response = await apiClient.get<{ data: AlerteRupture[] }>(
      '/alertes/ruptures',
    );
    return response.data.data ?? [];
  },

  getPeremptions: async (jours = 30): Promise<AlertePeremption[]> => {
    const response = await apiClient.get<{ data: AlertePeremption[] }>(
      '/alertes/peremptions',
      { params: { jours } },
    );
    return response.data.data ?? [];
  },
};

export type AlerteCounts = {
  stocksFaibles: number;
  ruptures: number;
  peremptions: number;
  total: number;
};