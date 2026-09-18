/**
 * Interfaces des données — miroir fidèle des modèles back-Pharmacie.
 * Chaque champ correspond exactement à la migration / modèle Laravel.
 */

// ─────────────────────────────────────────────────────────────────────────────
// AUTH / PERSONNEL
// ─────────────────────────────────────────────────────────────────────────────

export interface Role {
  id: number;
  nom: string;
  nom_affichage: string;
  created_at?: string;
  updated_at?: string;
}

export interface Permission {
  id: number;
  code: string;
  nom: string;
  description: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  role_id: number | null;
  role: Role | null;
  permissions?: Permission[];
  created_at?: string;
  updated_at?: string;
  password?: string;
}

export interface Personnel {
  id: number;
  user_id: number | null;
  nom: string;
  prenom: string;
  telephone: string | null;
  email: string | null;
  adresse: string | null;
  fonction: string;
  date_embauche: string | null;
  actif: boolean;
  created_at?: string;
  updated_at?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// PRODUITS / CATALOGUE
// ─────────────────────────────────────────────────────────────────────────────

export interface Categorie {
  id: number;
  nom: string;
  description: string | null;
  actif: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Unite {
  id: number;
  nom: string;
  abreviation: string | null;
  actif: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Produit {
  id: number;
  categorie_id: number;
  unite_id: number;
  nom: string;
  code_barres: string | null;
  description: string | null;
  prix_achat: string; // decimal(12,2)
  prix_vente: string; // decimal(12,2)
  stock_minimum: number;
  actif: boolean;
  categorie?: Categorie;
  unite?: Unite;
  created_at?: string;
  updated_at?: string;
}

export interface Lot {
  id: number;
  produit_id: number;
  numero_lot: string;
  date_peremption: string; // date
  quantite: number;
  produit?: Produit;
  created_at?: string;
  updated_at?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// STOCK / MOUVEMENTS
// ─────────────────────────────────────────────────────────────────────────────

export interface MouvementStock {
  id: number;
  lot_id: number;
  type: 'entree' | 'sortie' | 'ajustement';
  quantite: number;
  motif: string | null;
  lot?: Lot;
  created_at?: string;
  updated_at?: string;
}

export interface Inventaire {
  id: number;
  date_inventaire: string; // date
  motif: string | null;
  lignes?: InventaireLigne[];
  created_at?: string;
  updated_at?: string;
}

export interface InventaireLigne {
  id: number;
  inventaire_id: number;
  lot_id: number;
  quantite_theorique: number;
  quantite_reelle: number;
  ecart: number;
  lot?: Lot;
  created_at?: string;
  updated_at?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// ACHATS / FOURNISSEURS
// ─────────────────────────────────────────────────────────────────────────────

export interface Fournisseur {
  id: number;
  nom: string;
  telephone: string | null;
  email: string | null;
  adresse: string | null;
  actif: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Achat {
  id: number;
  fournisseur_id: number;
  numero: string;
  date_achat: string; // date
  montant_total: string; // decimal(12,2)
  statut: 'brouillon' | 'confirme' | 'annule';
  observation: string | null;
  fournisseur?: Fournisseur;
  lignes?: AchatLigne[];
  created_at?: string;
  updated_at?: string;
}

export interface AchatLigne {
  id: number;
  achat_id: number;
  produit_id: number;
  quantite: number;
  prix_unitaire: string; // decimal(12,2)
  montant: string; // decimal(12,2)
  numero_lot: string | null;
  date_peremption: string | null; // date
  produit?: Produit;
  created_at?: string;
  updated_at?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// VENTES / CLIENTS
// ─────────────────────────────────────────────────────────────────────────────

export interface Client {
  id: number;
  nom: string;
  telephone: string | null;
  email: string | null;
  adresse: string | null;
  actif: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Vente {
  id: number;
  numero: string;
  date_vente: string; // date
  client_id: number | null;
  montant_total: string; // decimal(12,2)
  statut: 'brouillon' | 'confirmee' | 'annulee';
  observation: string | null;
  client?: Client;
  lignes?: VenteLigne[];
  facture?: Facture;
  created_at?: string;
  updated_at?: string;
}

export interface VenteLigne {
  id: number;
  vente_id: number;
  produit_id: number;
  lot_id: number;
  quantite: number;
  prix_unitaire: string; // decimal(12,2)
  montant: string; // decimal(12,2)
  produit?: Produit;
  lot?: Lot;
  created_at?: string;
  updated_at?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// FACTURES / REGLEMENTS
// ─────────────────────────────────────────────────────────────────────────────

export interface Facture {
  id: number;
  vente_id: number;
  numero: string;
  date_facture: string; // date
  montant_total: string; // decimal(12,2)
  statut: 'impayee' | 'partiellement_payee' | 'payee' | 'annulee';
  vente?: Vente;
  reglements?: Reglement[];
  created_at?: string;
  updated_at?: string;
}

export interface Reglement {
  id: number;
  facture_id: number;
  montant: string; // decimal(12,2)
  mode: string;
  date_reglement: string; // dateTime
  reference: string | null;
  facture?: Facture;
  mouvement_caisse?: MouvementCaisse;
  created_at?: string;
  updated_at?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// CAISSE
// ─────────────────────────────────────────────────────────────────────────────

export interface Caisse {
  id: number;
  user_id: number;
  date_ouverture: string; // dateTime
  montant_initial: string; // decimal(12,2)
  date_fermeture: string | null; // dateTime
  montant_final: string | null; // decimal(12,2)
  ecart: string | null; // decimal(12,2)
  statut: 'ouverte' | 'fermee';
  observation: string | null;
  utilisateur?: User;
  mouvements?: MouvementCaisse[];
  created_at?: string;
  updated_at?: string;
}

export interface MouvementCaisse {
  id: number;
  caisse_id: number;
  reglement_id: number | null;
  type: 'entree' | 'sortie';
  montant: string; // decimal(12,2)
  motif: string | null;
  caisse?: Caisse;
  reglement?: Reglement;
  created_at?: string;
  updated_at?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// RAPPORTS / STATISTIQUES / SAUVEGARDES
// ─────────────────────────────────────────────────────────────────────────────

export interface Rapport {
  id: number;
  type: string;
  date_debut: string; // date
  date_fin: string; // date
  montant_total: string; // decimal(12,2)
  description: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface DashboardData {
  total_produits: number;
  ventes_jour: number;
  chiffre_affaires_jour: number;
  stocks_faibles: number;
  ruptures: number;
  peremptions_proches: number;
  factures_impayees: number;
}

export interface StatistiquesVentes {
  nombre_ventes: number;
  chiffre_affaires: number;
  ventes: Vente[];
}

export interface ProduitPlusVendu {
  id: number;
  nom: string;
  quantite_vendue: number;
  chiffre_affaires: number;
}

export interface ChiffreAffaires {
  date_debut: string;
  date_fin: string;
  chiffre_affaires: number;
}

export interface Sauvegarde {
  id: number;
  nom_fichier: string;
  chemin: string;
  taille: number;
  date_creation: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// ALERTES
// ─────────────────────────────────────────────────────────────────────────────

export interface AlerteStockFaible {
  id: number;
  nom: string;
  lots: Lot[];
  stock_minimum: number;
}

export interface AlerteRupture {
  id: number;
  nom: string;
  lots: Lot[];
}

export interface AlertePeremption {
  id: number;
  produit_id: number;
  numero_lot: string;
  date_peremption: string;
  quantite: number;
  produit?: Produit;
}

export interface ToutesAlertes {
  stocks_faibles: AlerteStockFaible[];
  ruptures: AlerteRupture[];
  peremptions: AlertePeremption[];
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTH API TYPES (kept for reference, but login is now static)
// ─────────────────────────────────────────────────────────────────────────────

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: User;
  token: string;
}

export interface LogoutResponse {
  message: string;
}
