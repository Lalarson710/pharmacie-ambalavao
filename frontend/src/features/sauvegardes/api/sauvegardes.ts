import apiClient from '@/api/client';
import type { Sauvegarde } from '@/types';

/**
 * API du module Sauvegardes — routes deja existentes cote backend :
 *  GET    /sauvegardes
 *  GET    /sauvegardes/{nomFichier}
 *  POST   /sauvegardes
 *  DELETE /sauvegardes            (body: { nom_fichier })
 *  POST   /sauvegardes/restaurer   (body: { nom_fichier })
 *  POST   /sauvegardes/importer    (multipart: fichier)
 *
 * Une sauvegarde est un fichier disque : sa cle est `nom_fichier`.
 */

export const sauvegardesApi = {
  getAll: async (): Promise<Sauvegarde[]> => {
    const response = await apiClient.get<{ data: Sauvegarde[] }>('/sauvegardes');
    return response.data?.data ?? [];
  },

  create: async (): Promise<Sauvegarde> => {
    const response = await apiClient.post<{ message: string; data: Sauvegarde }>(
      '/sauvegardes',
    );
    return response.data.data;
  },

  restaurer: async (nomFichier: string): Promise<string> => {
    const response = await apiClient.post<{ message: string }>('/sauvegardes/restaurer', {
      nom_fichier: nomFichier,
    });
    return response.data.message;
  },

  remove: async (nomFichier: string): Promise<string> => {
    const response = await apiClient.delete<{ message: string }>('/sauvegardes', {
      data: { nom_fichier: nomFichier },
    });
    return response.data.message;
  },

  importer: async (fichier: File): Promise<Sauvegarde> => {
    const formulaire = new FormData();
    formulaire.append('fichier', fichier);

    const response = await apiClient.post<{ message: string; data: Sauvegarde }>(
      '/sauvegardes/importer',
      formulaire,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
    return response.data.data;
  },
};
