/**
 * Données statiques — miroir fidèle des modèles back-Pharmacie.
 * Aucun appel API n’est effectué ; ces données servent d’exemple
 * pour valider l’affichage des interfaces.
 */

import type {
  Achat,
  AchatLigne,
  AlertePeremption,
  AlerteRupture,
  AlerteStockFaible,
  Caisse,
  Categorie,
  Client,
  DashboardData,
  Facture,
  Fournisseur,
  Inventaire,
  InventaireLigne,
  Lot,
  MouvementCaisse,
  MouvementStock,
  Permission,
  Personnel,
  Produit,
  ProduitPlusVendu,
  Reglement,
  Rapport,
  Role,
  Sauvegarde,
  Unite,
  User,
  Vente,
  VenteLigne,
} from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// ROLES & PERMISSIONS
// ─────────────────────────────────────────────────────────────────────────────

export const roles: Role[] = [
  { id: 1, nom: 'administrateur', nom_affichage: 'Administrateur' },
  { id: 2, nom: 'pharmacien', nom_affichage: 'Pharmacien' },
  { id: 3, nom: 'caissier', nom_affichage: 'Caissier' },
  { id: 4, nom: 'gestionnaire', nom_affichage: 'Gestionnaire' },
];

export const permissions: Permission[] = [
  { id: 1, code: 'produit.view', nom: 'Voir les produits', description: 'Permet de consulter la liste des produits.' },
  { id: 2, code: 'produit.create', nom: 'Créer un produit', description: 'Permet d’ajouter un nouveau produit.' },
  { id: 3, code: 'produit.update', nom: 'Modifier un produit', description: 'Permet de modifier un produit existant.' },
  { id: 4, code: 'produit.delete', nom: 'Supprimer un produit', description: 'Permet de supprimer un produit.' },
  { id: 5, code: 'stock.view', nom: 'Voir le stock', description: 'Permet de consulter le stock.' },
  { id: 6, code: 'stock.entry', nom: 'Entrée de stock', description: 'Permet d’ajouter du stock.' },
  { id: 7, code: 'stock.exit', nom: 'Sortie de stock', description: 'Permet de retirer du stock.' },
  { id: 8, code: 'stock.inventory', nom: 'Inventaire', description: 'Permet de réaliser un inventaire.' },
  { id: 9, code: 'achat.view', nom: 'Voir les achats', description: 'Permet de consulter les achats.' },
  { id: 10, code: 'achat.create', nom: 'Créer un achat', description: 'Permet de créer un achat.' },
  { id: 11, code: 'vente.view', nom: 'Voir les ventes', description: 'Permet de consulter les ventes.' },
  { id: 12, code: 'vente.create', nom: 'Créer une vente', description: 'Permet de créer une vente.' },
  { id: 13, code: 'vente.confirm', nom: 'Confirmer une vente', description: 'Permet de confirmer une vente.' },
  { id: 14, code: 'caisse.open', nom: 'Ouvrir la caisse', description: 'Permet d’ouvrir la caisse.' },
  { id: 15, code: 'caisse.close', nom: 'Fermer la caisse', description: 'Permet de fermer la caisse.' },
  { id: 16, code: 'rapport.view', nom: 'Voir les rapports', description: 'Permet de consulter les rapports.' },
  { id: 17, code: 'rapport.export', nom: 'Exporter un rapport', description: 'Permet d’exporter un rapport.' },
  { id: 18, code: 'statistique.view', nom: 'Voir les statistiques', description: 'Permet de consulter les statistiques.' },
  { id: 19, code: 'alerte.view', nom: 'Voir les alertes', description: 'Permet de consulter les alertes.' },
  { id: 20, code: 'personnel.view', nom: 'Voir le personnel', description: 'Permet de consulter le personnel.' },
  { id: 21, code: 'personnel.create', nom: 'Créer du personnel', description: 'Permet d’ajouter du personnel.' },
  { id: 22, code: 'user.view', nom: 'Voir les utilisateurs', description: 'Permet de consulter les utilisateurs.' },
  { id: 23, code: 'user.create', nom: 'Créer un utilisateur', description: 'Permet de créer un utilisateur.' },
  { id: 24, code: 'permission.manage', nom: 'Gérer les permissions', description: 'Permet de gérer les permissions.' },
  { id: 25, code: 'fournisseur.view', nom: 'Voir les fournisseurs', description: 'Permet de consulter les fournisseurs.' },
  { id: 26, code: 'fournisseur.create', nom: 'Créer un fournisseur', description: 'Permet d’ajouter un fournisseur.' },
  { id: 27, code: 'client.view', nom: 'Voir les clients', description: 'Permet de consulter les clients.' },
  { id: 28, code: 'client.create', nom: 'Créer un client', description: 'Permet d’ajouter un client.' },
  { id: 29, code: 'facture.print', nom: 'Imprimer une facture', description: 'Permet d’imprimer une facture.' },
  { id: 30, code: 'sauvegarde.view', nom: 'Voir les sauvegardes', description: 'Permet de consulter les sauvegardes.' },
  { id: 31, code: 'sauvegarde.create', nom: 'Créer une sauvegarde', description: 'Permet de créer une sauvegarde.' },
  { id: 32, code: 'sauvegarde.restore', nom: 'Restaurer une sauvegarde', description: 'Permet de restaurer une sauvegarde.' },
];

// ─────────────────────────────────────────────────────────────────────────────
// UTILISATEURS & PERSONNEL
// ─────────────────────────────────────────────────────────────────────────────

export const utilisateurs: User[] = [
  {
    id: 1,
    name: 'Dupont Pierre',
    email: 'p.dupont@pharmacie-centrale.fr',
    email_verified_at: '2025-01-15T08:30:00.000000Z',
    role_id: 2,
    role: roles[1],
    permissions: [],
  },
  {
    id: 2,
    name: 'Rakoto Marie',
    email: 'm.rakoto@pharmacie-centrale.fr',
    email_verified_at: '2025-02-20T09:15:00.000000Z',
    role_id: 3,
    role: roles[2],
    permissions: [],
  },
  {
    id: 3,
    name: 'Ramanjary Jean',
    email: 'j.ramanjary@pharmacie-centrale.fr',
    email_verified_at: '2025-03-10T10:00:00.000000Z',
    role_id: 1,
    role: roles[0],
    permissions: [],
  },
];

export const personnel: Personnel[] = [
  {
    id: 1,
    user_id: 1,
    nom: 'Dupont',
    prenom: 'Pierre',
    telephone: '032 12 345 67',
    email: 'p.dupont@pharmacie-centrale.fr',
    adresse: '12 Rue du Marché, Antsirabe',
    fonction: 'Pharmacien Titulaire',
    date_embauche: '2023-01-15',
    actif: true,
  },
  {
    id: 2,
    user_id: 2,
    nom: 'Rakoto',
    prenom: 'Marie',
    telephone: '033 98 765 43',
    email: 'm.rakoto@pharmacie-centrale.fr',
    adresse: '45 Avenue de la Paix, Antananarivo',
    fonction: 'Caissière',
    date_embauche: '2024-06-01',
    actif: true,
  },
  {
    id: 3,
    user_id: 3,
    nom: 'Ramanjary',
    prenom: 'Jean',
    telephone: '034 55 667 78',
    email: 'j.ramanjary@pharmacie-centrale.fr',
    adresse: '78 Boulevard du 14 Juillet, Toamasina',
    fonction: 'Administrateur Système',
    date_embauche: '2022-09-20',
    actif: true,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// CATALOGUE PRODUITS
// ─────────────────────────────────────────────────────────────────────────────

export const categories: Categorie[] = [
  { id: 1, nom: 'Médicaments', description: 'Produits médicaux et pharmaceutiques', actif: true },
  { id: 2, nom: 'Cosmétiques', description: 'Produits de beauté et soins du visage', actif: true },
  { id: 3, nom: 'Compléments Alimentaires', description: 'Vitamines et compléments nutritionnels', actif: true },
  { id: 4, nom: 'Produits d’Hygiène', description: 'Articles d’hygiène personnelle', actif: true },
  { id: 5, nom: 'Matériel Médical', description: 'Équipements médicaux', actif: true },
];

export const unites: Unite[] = [
  { id: 1, nom: 'Boîte', abreviation: 'bx', actif: true },
  { id: 2, nom: 'Flacon', abreviation: 'fl', actif: true },
  { id: 3, nom: 'Comprimé', abreviation: 'comp', actif: true },
  { id: 4, nom: 'Sachet', abreviation: 'sachet', actif: true },
  { id: 5, nom: 'Ampoule', abreviation: 'amp', actif: true },
  { id: 6, nom: 'Bâtonnet', abreviation: 'bâton', actif: true },
  { id: 7, nom: 'Tige', abreviation: 'tig', actif: true },
  { id: 8, nom: 'Tube', abreviation: 'tube', actif: true },
];

export const produits: Produit[] = [
  {
    id: 1,
    categorie_id: 1,
    unite_id: 3,
    nom: 'Doliprane 500mg',
    code_barres: '3400631234567',
    description: 'Paracétamol 500mg, analgésique et antipyrétique.',
    prix_achat: '2.50',
    prix_vente: '4.20',
    stock_minimum: 50,
    actif: true,
    categorie: categories[0],
    unite: unites[2],
  },
  {
    id: 2,
    categorie_id: 1,
    unite_id: 1,
    nom: 'Amoxicilline 500mg',
    code_barres: '3400631234568',
    description: 'Antibiotique de la classe des pénicillines.',
    prix_achat: '8.00',
    prix_vente: '12.50',
    stock_minimum: 20,
    actif: true,
    categorie: categories[0],
    unite: unites[0],
  },
  {
    id: 3,
    categorie_id: 2,
    unite_id: 8,
    nom: 'Crème Hydratante Visage',
    code_barres: '3400631234569',
    description: 'Crème hydratante pour le visage, 50ml.',
    prix_achat: '5.00',
    prix_vente: '9.50',
    stock_minimum: 15,
    actif: true,
    categorie: categories[1],
    unite: unites[7],
  },
  {
    id: 4,
    categorie_id: 3,
    unite_id: 4,
    nom: 'Vitamine C 1000mg',
    code_barres: '3400631234570',
    description: 'Complément alimentaire de vitamine C.',
    prix_achat: '3.20',
    prix_vente: '6.00',
    stock_minimum: 30,
    actif: true,
    categorie: categories[2],
    unite: unites[3],
  },
  {
    id: 5,
    categorie_id: 4,
    unite_id: 6,
    nom: 'Détergent Main Douce',
    code_barres: '3400631234571',
    description: 'Détergent pour les mains, 1L.',
    prix_achat: '4.00',
    prix_vente: '7.50',
    stock_minimum: 10,
    actif: true,
    categorie: categories[3],
    unite: unites[5],
  },
  {
    id: 6,
    categorie_id: 1,
    unite_id: 5,
    nom: 'Sirop Toux Enfant',
    code_barres: '3400631234572',
    description: 'Sirop contre la toux pour enfants, 100ml.',
    prix_achat: '6.00',
    prix_vente: '10.00',
    stock_minimum: 25,
    actif: true,
    categorie: categories[0],
    unite: unites[4],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// LOTS
// ─────────────────────────────────────────────────────────────────────────────

export const lots: Lot[] = [
  {
    id: 1,
    produit_id: 1,
    numero_lot: 'LOT-DOL-2025-001',
    date_peremption: '2026-12-31',
    quantite: 120,
    produit: produits[0],
  },
  {
    id: 2,
    produit_id: 1,
    numero_lot: 'LOT-DOL-2025-002',
    date_peremption: '2027-06-30',
    quantite: 80,
    produit: produits[0],
  },
  {
    id: 3,
    produit_id: 2,
    numero_lot: 'LOT-AMX-2025-001',
    date_peremption: '2026-08-15',
    quantite: 45,
    produit: produits[1],
  },
  {
    id: 4,
    produit_id: 3,
    numero_lot: 'LOT-CRM-2025-001',
    date_peremption: '2027-03-20',
    quantite: 30,
    produit: produits[2],
  },
  {
    id: 5,
    produit_id: 4,
    numero_lot: 'LOT-VITC-2025-001',
    date_peremption: '2026-11-10',
    quantite: 15,
    produit: produits[3],
  },
  {
    id: 6,
    produit_id: 5,
    numero_lot: 'LOT-DTM-2025-001',
    date_peremption: '2028-01-15',
    quantite: 0,
    produit: produits[4],
  },
  {
    id: 7,
    produit_id: 6,
    numero_lot: 'LOT-SIROP-2025-001',
    date_peremption: '2026-05-20',
    quantite: 60,
    produit: produits[5],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// FOURNISSEURS & CLIENTS
// ─────────────────────────────────────────────────────────────────────────────

export const fournisseurs: Fournisseur[] = [
  {
    id: 1,
    nom: 'PharmaDistrib SARL',
    telephone: '020 22 333 44',
    email: 'contact@pharmadistrib.mg',
    adresse: 'Zone Industrielle, Antananarivo 101',
    actif: true,
  },
  {
    id: 2,
    nom: 'Laboratoire National',
    telephone: '020 33 444 55',
    email: 'labo.national@pharma.mg',
    adresse: '15 Rue du 26 Décembre, Antsiranana',
    actif: true,
  },
  {
    id: 3,
    nom: 'CosmoCare Import',
    telephone: '020 44 555 66',
    email: 'sales@cosmocare.mg',
    adresse: 'Immeuble Phoenix, Toamasina',
    actif: true,
  },
];

export const clients: Client[] = [
  {
    id: 1,
    nom: 'Hôpital Régional d’Ambalavao',
    telephone: '020 55 666 77',
    email: 'contact@hopital-ambalavao.mg',
    adresse: 'Route Nationale 2, Ambalavao',
    actif: true,
  },
  {
    id: 2,
    nom: 'Clinique du Centre',
    telephone: '020 66 777 88',
    email: 'clinique.centre@pharma.mg',
    adresse: 'Avenue de l’Indépendance, Antsirabe',
    actif: true,
  },
  {
    id: 3,
    nom: 'Pharmacie de Garde',
    telephone: '032 00 111 22',
    email: null,
    adresse: 'Rue du 14 Juillet, Fianarantsoa',
    actif: true,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// ACHATS
// ─────────────────────────────────────────────────────────────────────────────

export const achats: Achat[] = [
  {
    id: 1,
    fournisseur_id: 1,
    numero: 'ACH-2025-001',
    date_achat: '2025-09-01',
    montant_total: '45000.00',
    statut: 'confirme',
    observation: 'Livraison effectuée le 02/09/2025.',
    fournisseur: fournisseurs[0],
  },
  {
    id: 2,
    fournisseur_id: 2,
    numero: 'ACH-2025-002',
    date_achat: '2025-09-05',
    montant_total: '18500.00',
    statut: 'confirme',
    observation: null,
    fournisseur: fournisseurs[1],
  },
  {
    id: 3,
    fournisseur_id: 3,
    numero: 'ACH-2025-003',
    date_achat: '2025-09-08',
    montant_total: '0.00',
    statut: 'brouillon',
    observation: null,
    fournisseur: fournisseurs[2],
  },
];

export const achatsLignes: AchatLigne[] = [
  {
    id: 1,
    achat_id: 1,
    produit_id: 1,
    quantite: 100,
    prix_unitaire: '2.50',
    montant: '250.00',
    numero_lot: 'LOT-DOL-2025-001',
    date_peremption: '2026-12-31',
    produit: produits[0],
  },
  {
    id: 2,
    achat_id: 1,
    produit_id: 2,
    quantite: 50,
    prix_unitaire: '8.00',
    montant: '400.00',
    numero_lot: 'LOT-AMX-2025-001',
    date_peremption: '2026-08-15',
    produit: produits[1],
  },
  {
    id: 3,
    achat_id: 2,
    produit_id: 3,
    quantite: 30,
    prix_unitaire: '5.00',
    montant: '150.00',
    numero_lot: 'LOT-CRM-2025-001',
    date_peremption: '2027-03-20',
    produit: produits[2],
  },
  {
    id: 4,
    achat_id: 2,
    produit_id: 4,
    quantite: 20,
    prix_unitaire: '3.20',
    montant: '64.00',
    numero_lot: 'LOT-VITC-2025-001',
    date_peremption: '2026-11-10',
    produit: produits[3],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// VENTES
// ─────────────────────────────────────────────────────────────────────────────

export const ventes: Vente[] = [
  {
    id: 1,
    numero: 'VTE-2025-001',
    date_vente: '2025-09-10',
    client_id: 1,
    montant_total: '12500.00',
    statut: 'confirmee',
    observation: 'Vente au comptant.',
    client: clients[0],
  },
  {
    id: 2,
    numero: 'VTE-2025-002',
    date_vente: '2025-09-11',
    client_id: 2,
    montant_total: '8750.00',
    statut: 'confirmee',
    observation: null,
    client: clients[1],
  },
  {
    id: 3,
    numero: 'VTE-2025-003',
    date_vente: '2025-09-12',
    client_id: null,
    montant_total: '0.00',
    statut: 'brouillon',
    observation: null,
    client: undefined,
  },
];

export const ventesLignes: VenteLigne[] = [
  {
    id: 1,
    vente_id: 1,
    produit_id: 1,
    lot_id: 1,
    quantite: 10,
    prix_unitaire: '4.20',
    montant: '42.00',
    produit: produits[0],
    lot: lots[0],
  },
  {
    id: 2,
    vente_id: 1,
    produit_id: 2,
    lot_id: 3,
    quantite: 5,
    prix_unitaire: '12.50',
    montant: '62.50',
    produit: produits[1],
    lot: lots[2],
  },
  {
    id: 3,
    vente_id: 2,
    produit_id: 3,
    lot_id: 4,
    quantite: 3,
    prix_unitaire: '9.50',
    montant: '28.50',
    produit: produits[2],
    lot: lots[3],
  },
  {
    id: 4,
    vente_id: 2,
    produit_id: 4,
    lot_id: 5,
    quantite: 8,
    prix_unitaire: '6.00',
    montant: '48.00',
    produit: produits[3],
    lot: lots[4],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// FACTURES & REGLEMENTS
// ─────────────────────────────────────────────────────────────────────────────

export const factures: Facture[] = [
  {
    id: 1,
    vente_id: 1,
    numero: 'FAC-2025-001',
    date_facture: '2025-09-10',
    montant_total: '12500.00',
    statut: 'payee',
    vente: ventes[0],
  },
  {
    id: 2,
    vente_id: 2,
    numero: 'FAC-2025-002',
    date_facture: '2025-09-11',
    montant_total: '8750.00',
    statut: 'partiellement_payee',
    vente: ventes[1],
  },
];

export const reglements: Reglement[] = [
  {
    id: 1,
    facture_id: 1,
    montant: '12500.00',
    mode: 'espèces',
    date_reglement: '2025-09-10T14:30:00.000000Z',
    reference: null,
    facture: factures[0],
  },
  {
    id: 2,
    facture_id: 2,
    montant: '5000.00',
    mode: 'virement',
    date_reglement: '2025-09-11T10:15:00.000000Z',
    reference: 'VIR-2025-09-11-001',
    facture: factures[1],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// CAISSE & MOUVEMENTS DE CAISSE
// ─────────────────────────────────────────────────────────────────────────────

export const caisses: Caisse[] = [
  {
    id: 1,
    user_id: 2,
    date_ouverture: '2025-09-12T08:00:00.000000Z',
    montant_initial: '50000.00',
    date_fermeture: null,
    montant_final: null,
    ecart: null,
    statut: 'ouverte',
    observation: 'Caisse ouverte par Marie Rakoto.',
    utilisateur: utilisateurs[1],
  },
  {
    id: 2,
    user_id: 2,
    date_ouverture: '2025-09-11T08:00:00.000000Z',
    montant_initial: '50000.00',
    date_fermeture: '2025-09-11T20:00:00.000000Z',
    montant_final: '52300.00',
    ecart: '0.00',
    statut: 'fermee',
    observation: 'Caisse refermée normalement.',
    utilisateur: utilisateurs[1],
  },
];

export const mouvementsCaisse: MouvementCaisse[] = [
  {
    id: 1,
    caisse_id: 1,
    reglement_id: 1,
    type: 'entree',
    montant: '12500.00',
    motif: 'Paiement facture FAC-2025-001',
    caisse: caisses[0],
    reglement: reglements[0],
  },
  {
    id: 2,
    caisse_id: 1,
    reglement_id: 2,
    type: 'entree',
    montant: '5000.00',
    motif: 'Paiement partiel facture FAC-2025-002',
    caisse: caisses[0],
    reglement: reglements[1],
  },
  {
    id: 3,
    caisse_id: 1,
    reglement_id: null,
    type: 'sortie',
    montant: '2000.00',
    motif: 'Approvisionnement en coffre-fort',
    caisse: caisses[0],
    reglement: undefined,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// MOUVEMENTS DE STOCK
// ─────────────────────────────────────────────────────────────────────────────

export const mouvementsStock: MouvementStock[] = [
  {
    id: 1,
    lot_id: 1,
    type: 'entree',
    quantite: 120,
    motif: 'Réception achat ACH-2025-001',
    lot: lots[0],
  },
  {
    id: 2,
    lot_id: 3,
    type: 'entree',
    quantite: 45,
    motif: 'Réception achat ACH-2025-001',
    lot: lots[2],
  },
  {
    id: 3,
    lot_id: 1,
    type: 'sortie',
    quantite: 10,
    motif: 'Vente VTE-2025-001',
    lot: lots[0],
  },
  {
    id: 4,
    lot_id: 3,
    type: 'sortie',
    quantite: 5,
    motif: 'Vente VTE-2025-001',
    lot: lots[2],
  },
  {
    id: 5,
    lot_id: 5,
    type: 'ajustement',
    quantite: 15,
    motif: 'Inventaire du 10/09/2025 — écarts constatés',
    lot: lots[4],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// INVENTAIRES
// ─────────────────────────────────────────────────────────────────────────────

export const inventaires: Inventaire[] = [
  {
    id: 1,
    date_inventaire: '2025-09-10',
    motif: 'Inventaire mensuel',
    lignes: [
      {
        id: 1,
        inventaire_id: 1,
        lot_id: 1,
        quantite_theorique: 110,
        quantite_reelle: 108,
        ecart: -2,
        lot: lots[0],
      },
      {
        id: 2,
        inventaire_id: 1,
        lot_id: 3,
        quantite_theorique: 40,
        quantite_reelle: 40,
        ecart: 0,
        lot: lots[2],
      },
    ],
  },
];

export const inventairesLignes: InventaireLigne[] = inventaires[0].lignes ?? [];

// ─────────────────────────────────────────────────────────────────────────────
// ALERTES
// ─────────────────────────────────────────────────────────────────────────────

export const alertesStockFaible: AlerteStockFaible[] = [
  {
    id: 4,
    nom: 'Vitamine C 1000mg',
    stock_minimum: 30,
    lots: [lots[4]],
  },
  {
    id: 6,
    nom: 'Sirop Toux Enfant',
    stock_minimum: 25,
    lots: [lots[6]],
  },
];

export const alertesRupture: AlerteRupture[] = [
  {
    id: 5,
    nom: 'Détergent Main Douce',
    lots: [lots[5]],
  },
];

export const alertesPeremption: AlertePeremption[] = [
  {
    id: 3,
    produit_id: 2,
    numero_lot: 'LOT-AMX-2025-001',
    date_peremption: '2026-08-15',
    quantite: 45,
    produit: produits[1],
  },
  {
    id: 7,
    produit_id: 6,
    numero_lot: 'LOT-SIROP-2025-001',
    date_peremption: '2026-05-20',
    quantite: 60,
    produit: produits[5],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────

export const dashboardData: DashboardData = {
  total_produits: 6,
  ventes_jour: 2,
  chiffre_affaires_jour: 21250.0,
  stocks_faibles: 2,
  ruptures: 1,
  peremptions_proches: 2,
  factures_impayees: 1,
};

// ─────────────────────────────────────────────────────────────────────────────
// STATISTIQUES
// ─────────────────────────────────────────────────────────────────────────────

export const statistiquesVentes = {
  nombre_ventes: 2,
  chiffre_affaires: 21250.0,
  ventes: [ventes[0], ventes[1]],
};

export const produitsPlusVendus: ProduitPlusVendu[] = [
  {
    id: 1,
    nom: 'Doliprane 500mg',
    quantite_vendue: 10,
    chiffre_affaires: 42.0,
  },
  {
    id: 4,
    nom: 'Vitamine C 1000mg',
    quantite_vendue: 8,
    chiffre_affaires: 48.0,
  },
  {
    id: 2,
    nom: 'Amoxicilline 500mg',
    quantite_vendue: 5,
    chiffre_affaires: 62.5,
  },
  {
    id: 3,
    nom: 'Crème Hydratante Visage',
    quantite_vendue: 3,
    chiffre_affaires: 28.5,
  },
];

export const chiffreAffaires = {
  date_debut: '2025-09-01',
  date_fin: '2025-09-12',
  chiffre_affaires: 21250.0,
};

// ─────────────────────────────────────────────────────────────────────────────
// RAPPORTS
// ─────────────────────────────────────────────────────────────────────────────

export const rapports: Rapport[] = [
  {
    id: 1,
    type: 'ventes',
    date_debut: '2025-09-01',
    date_fin: '2025-09-12',
    montant_total: '21250.00',
    description: 'Rapport des ventes du mois de septembre.',
  },
  {
    id: 2,
    type: 'achats',
    date_debut: '2025-09-01',
    date_fin: '2025-09-12',
    montant_total: '63500.00',
    description: 'Rapport des achats du mois de septembre.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SAUVEGARDES
// ─────────────────────────────────────────────────────────────────────────────

export const sauvegardes: Sauvegarde[] = [
  {
    id: 1,
    nom_fichier: 'sauvegarde_2025-09-10_23-59-59.dump',
    chemin: 'storage/app/sauvegardes/sauvegarde_2025-09-10_23-59-59.dump',
    taille: 2048576,
    date_creation: '2025-09-10 23:59:59',
  },
  {
    id: 2,
    nom_fichier: 'sauvegarde_2025-09-05_23-59-59.dump',
    chemin: 'storage/app/sauvegardes/sauvegarde_2025-09-05_23-59-59.dump',
    taille: 1987654,
    date_creation: '2025-09-05 23:59:59',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// UTILISATEUR CONNECTÉ (statique)
// ─────────────────────────────────────────────────────────────────────────────

export const utilisateurConnecte: User = utilisateurs[0];
