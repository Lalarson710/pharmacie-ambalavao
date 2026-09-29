import apiClient from '@/api/client';

// ─────────────────────────────────────────────────────────────────────────────
//  Types du tableau de bord moderne
// ─────────────────────────────────────────────────────────────────────────────

export interface DashboardKpis {
  chiffre_affaires: number;
  chiffre_affaires_precedent: number;
  evolution_ca: number;
  nombre_ventes: number;
  nombre_ventes_precedent: number;
  evolution_ventes: number;
  panier_moyen: number;
  panier_moyen_precedent: number;
  evolution_panier: number;
  marge_brute: number;
  taux_marge: number;
  montant_achats: number;
  clients_actifs: number;
  nouveaux_clients: number;
  produits_actifs: number;
  categories_actives: number;
}

export interface EvolutionPoint {
  date: string;
  label: string;
  ca: number;
  ventes: number;
}

export interface JourSemainePoint {
  jour: string;
  ca: number;
}

export interface TopProduit {
  id: number;
  nom: string;
  quantite: number;
  chiffre_affaires: number;
}

export interface CategoriePoint {
  categorie: string;
  chiffre_affaires: number;
  part: number;
}

export interface StatutPoint {
  statut: string;
  total: number;
  montant: number;
}

export interface AlerteStockFaible {
  id: number;
  nom: string;
  stock: number;
  stock_minimum: number;
}

export interface AlerteRupture {
  id: number;
  nom: string;
}

export interface AlertePeremption {
  id: number;
  produit_id: number;
  produit: string;
  numero_lot: string;
  date_peremption: string;
  jours_restants: number;
  quantite: number;
}

export interface DashboardAlertes {
  stocks_faibles: AlerteStockFaible[];
  ruptures: AlerteRupture[];
  peremptions: AlertePeremption[];
  total: number;
}

export interface CaisseOuverte {
  id: number;
  montant_initial: number;
  date_ouverture: string;
  utilisateur: string;
  entrees: number;
  sorties: number;
  solde_theorique: number;
}

export interface LotPeremption {
  id: number;
  produit: string;
  numero_lot: string;
  date_peremption: string;
  jours_restants: number;
  quantite: number;
  criticite: 'expire' | 'critique' | 'a_surveiller';
}

export interface CreanceLigne {
  id: number;
  numero: string;
  date_facture: string;
  montant_total: number;
  reste_a_payer: number;
  statut: string;
  anciennete_jours: number;
}

export interface DashboardCreances {
  nombre: number;
  montant_total: number;
  lignes: CreanceLigne[];
}

export interface DerniereVente {
  id: number;
  numero: string;
  date_vente: string;
  client: string;
  montant_total: number;
  statut: string;
}

export interface ValorisationStock {
  unites: number;
  valeur_achat: number;
  valeur_vente: number;
  marge_potentielle: number;
  rotation_mois: number;
}

export interface Approvisionnement {
  en_attente: { nombre: number; montant: number };
  confirmees: { nombre: number; montant: number };
}

export interface DashboardPayload {
  periode: number;
  date_generation: string;

  // Compteurs historiques
  total_produits: number;
  ventes_jour: number;
  chiffre_affaires_jour: number;
  stocks_faibles: number;
  ruptures: number;
  peremptions_proches: number;
  factures_impayees: number;

  // KPIs et series
  kpis: DashboardKpis;
  evolution_ca: EvolutionPoint[];
  repartition_ventes: JourSemainePoint[];
  top_produits: TopProduit[];
  repartition_categories: CategoriePoint[];
  repartition_statuts: StatutPoint[];

  // Blocs operationnels
  alertes: DashboardAlertes;
  caisse: CaisseOuverte | null;
  top_peremptions: LotPeremption[];
  creances: DashboardCreances;
  dernieres_ventes: DerniereVente[];
  valorisation_stock: ValorisationStock;
  approvisionnement: Approvisionnement;
}

export const DASHBOARD_PERIODES = [
  { jours: 7, label: '7 jours' },
  { jours: 30, label: '30 jours' },
  { jours: 90, label: '3 mois' },
  { jours: 365, label: '12 mois' },
] as const;

export const dashboardApi = {
  async get(periode: number = 30): Promise<DashboardPayload> {
    const response = await apiClient.get<{ data: DashboardPayload }>('/dashboard', {
      params: { periode },
    });
    return response.data.data;
  },
};
