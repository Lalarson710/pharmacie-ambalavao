import type { Achat, Facture, Reglement, Vente } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { formatDateVente } from '@/features/statistiques/utils/exportStatistiques';
import type { StockParProduit } from '@/features/stock/api/stock';

/**
 * Moteur de calcul des rapports.
 * Toutes les valeurs proviennent des APIs existantes :
 * aucune donnée fictive, aucun nouveau systeme cote backend.
 */

export interface SourcesRapport {
  ventes: Vente[];
  factures: Facture[];
  reglements: Reglement[];
  achats: Achat[];
  produits: StockParProduit[];
}

export interface KpiRapport {
  label: string;
  valeur: string;
  hint?: string;
  tone?: 'default' | 'success' | 'danger' | 'warning';
}

export interface ColonneRapport {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
}

export interface RapportCalcule {
  type: string;
  titre: string;
  periode: string;
  dateDebut: string;
  dateFin: string;
  /** Montant de reference du rapport, pre-calcule (jamais saisi par l'utilisateur). */
  montantReference: number;
  kpis: KpiRapport[];
  colonnes: ColonneRapport[];
  rows: Array<Record<string, string | number>>;
}

/* ─────────────────────────────────────────────────────────────────────────────
   Helpers
   ───────────────────────────────────────────────────────────────────────────── */

const nombre = (value: unknown): number => {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
};

const jour = (value: string): string => String(value ?? '').slice(0, 10);

function dansPeriode(date: string, debut: string, fin: string): boolean {
  const valeur = jour(date);
  if (!valeur) return false;
  return valeur >= debut && valeur <= fin;
}

function dateSql(date: Date): string {
  const iso = date.toISOString().slice(0, 10);
  return iso;
}

/** Periode par defaut : mois en cours. */
export function periodeParDefaut(): { debut: string; fin: string } {
  const now = new Date();
  return {
    debut: dateSql(new Date(now.getFullYear(), now.getMonth(), 1)),
    fin: dateSql(now),
  };
}

/** Map des reglements cumules par facture. */
function reglementsParFacture(reglements: Reglement[]): Map<number, number> {
  const map = new Map<number, number>();
  for (const reglement of reglements) {
    map.set(
      reglement.facture_id,
      (map.get(reglement.facture_id) ?? 0) + nombre(reglement.montant),
    );
  }
  return map;
}

/* ─────────────────────────────────────────────────────────────────────────────
   Rapport des ventes
   ───────────────────────────────────────────────────────────────────────────── */

function rapportVentes(
  sources: SourcesRapport,
  debut: string,
  fin: string,
): RapportCalcule {
  const ventes = sources.ventes.filter(
    (vente) => vente.statut === 'confirmee' && dansPeriode(vente.date_vente, debut, fin),
  );

  const facturesParId = new Map<number, Facture>();
  for (const facture of sources.factures) facturesParId.set(facture.id, facture);

  const reglements = reglementsParFacture(sources.reglements);

  let montantTotal = 0;
  let montantRegle = 0;

  const rows = ventes.map((vente) => {
    const montant = nombre(vente.montant_total);
    montantTotal += montant;

    const facture = vente.facture ?? (vente.id ? facturesParId.get(vente.id) : undefined);
    // La facture est rattachee a la vente via facture.vente_id : on la retrouve.
    const factureLiee =
      facture && facture.vente_id === vente.id
        ? facture
        : sources.factures.find((f) => f.vente_id === vente.id);

    const encaisse = factureLiee ? (reglements.get(factureLiee.id) ?? 0) : 0;
    const reste = Math.max(0, montant - encaisse);
    montantRegle += Math.min(encaisse, montant);

    return {
      numero: vente.numero,
      date: formatDateVente(vente.date_vente),
      client: vente.client?.nom ?? 'Client de passage',
      montant: formatCurrency(montant),
      regle: formatCurrency(Math.min(encaisse, montant)),
      reste: formatCurrency(reste),
      etat: reste <= 0 ? 'Réglée' : 'Non réglée',
    };
  });

  const montantNonRegle = Math.max(0, montantTotal - montantRegle);

  return {
    type: 'ventes',
    titre: 'Rapport des ventes',
    periode: `${debut} → ${fin}`,
    dateDebut: debut,
    dateFin: fin,
    montantReference: montantTotal,
    kpis: [
      { label: 'Nombre de ventes', valeur: String(ventes.length), tone: 'default' },
      { label: 'Montant total ventes', valeur: formatCurrency(montantTotal), tone: 'success' },
      { label: 'Ventes réglées', valeur: formatCurrency(montantRegle), tone: 'success' },
      { label: 'Ventes non réglées', valeur: formatCurrency(montantNonRegle), tone: 'danger' },
    ],
    colonnes: [
      { key: 'numero', label: 'N° Vente' },
      { key: 'date', label: 'Date', align: 'center' },
      { key: 'client', label: 'Client' },
      { key: 'montant', label: 'Montant', align: 'right' },
      { key: 'regle', label: 'Réglé', align: 'right' },
      { key: 'reste', label: 'Reste', align: 'right' },
      { key: 'etat', label: 'État', align: 'center' },
    ],
    rows,
  };
}

/* ─────────────────────────────────────────────────────────────────────────────
   Rapport des achats
   ───────────────────────────────────────────────────────────────────────────── */

function rapportAchats(sources: SourcesRapport, debut: string, fin: string): RapportCalcule {
  const achats = sources.achats.filter(
    (achat) => achat.statut === 'confirme' && dansPeriode(achat.date_achat, debut, fin),
  );

  let montantTotal = 0;
  let quantiteTotale = 0;
  const produits = new Set<number>();

  const rows = achats.map((achat) => {
    const montant = nombre(achat.montant_total);
    montantTotal += montant;

    let quantite = 0;
    for (const ligne of achat.lignes ?? []) {
      quantite += nombre(ligne.quantite_base ?? ligne.quantite);
      produits.add(ligne.produit_id);
    }
    quantiteTotale += quantite;

    return {
      numero: achat.numero,
      date: formatDateVente(achat.date_achat),
      fournisseur: achat.fournisseur?.nom ?? '—',
      produits: String(achat.lignes?.length ?? 0),
      quantite: String(quantite),
      montant: formatCurrency(montant),
    };
  });

  return {
    type: 'achats',
    titre: 'Rapport des achats',
    periode: `${debut} → ${fin}`,
    dateDebut: debut,
    dateFin: fin,
    montantReference: montantTotal,
    kpis: [
      { label: "Nombre d'achats", valeur: String(achats.length) },
      { label: 'Montant total achats', valeur: formatCurrency(montantTotal), tone: 'warning' },
      { label: 'Produits réceptionnés', valeur: String(produits.size) },
      { label: 'Quantité reçue (unité de base)', valeur: String(quantiteTotale) },
    ],
    colonnes: [
      { key: 'numero', label: 'N° Achat' },
      { key: 'date', label: 'Date', align: 'center' },
      { key: 'fournisseur', label: 'Fournisseur' },
      { key: 'produits', label: 'Lignes', align: 'center' },
      { key: 'quantite', label: 'Quantité reçue', align: 'right' },
      { key: 'montant', label: 'Montant', align: 'right' },
    ],
    rows,
  };
}

/* ─────────────────────────────────────────────────────────────────────────────
   Rapport du stock
   ───────────────────────────────────────────────────────────────────────────── */

function rapportStock(
  sources: SourcesRapport,
  debut: string,
  fin: string,
): RapportCalcule {
  const produits = sources.produits;

  const rows = produits.map((produit) => {
    const stock = nombre(produit.lots_sum_quantite);
    const seuil = nombre(produit.stock_minimum);
    return {
      produit: produit.nom,
      categorie: produit.categorie?.nom ?? '—',
      unite: produit.unite?.nom ?? '—',
      stock: String(stock),
      seuil: String(seuil),
      etat: stock <= 0 ? 'Rupture' : stock <= seuil ? 'Stock faible' : 'Stock normal',
    };
  });

  const ruptures = rows.filter((r) => r.etat === 'Rupture').length;
  const faibles = rows.filter((r) => r.etat === 'Stock faible').length;
  const quantiteTotale = rows.reduce((sum, r) => sum + nombre(r.stock), 0);
  const valeurStock = produits.reduce(
    (sum, produit) =>
      sum + nombre(produit.lots_sum_quantite) * nombre(produit.prix_achat),
    0,
  );

  return {
    type: 'stock',
    titre: 'Rapport du stock',
    periode: 'État actuel',
    dateDebut: debut,
    dateFin: fin,
    montantReference: valeurStock,
    kpis: [
      { label: 'Produits référencés', valeur: String(produits.length) },
      {
        label: 'Quantité en stock (unité de base)',
        valeur: String(quantiteTotale),
        hint: `Valeur : ${formatCurrency(valeurStock)}`,
      },
      { label: 'Ruptures', valeur: String(ruptures), tone: 'danger' },
      { label: 'Stocks faibles', valeur: String(faibles), tone: 'warning' },
    ],
    colonnes: [
      { key: 'produit', label: 'Produit' },
      { key: 'categorie', label: 'Catégorie' },
      { key: 'unite', label: 'Unité de base' },
      { key: 'stock', label: 'Stock', align: 'right' },
      { key: 'seuil', label: 'Seuil', align: 'right' },
      { key: 'etat', label: 'État', align: 'center' },
    ],
    rows,
  };
}

/* ─────────────────────────────────────────────────────────────────────────────
   Rapport des produits
   ───────────────────────────────────────────────────────────────────────────── */

function rapportProduits(sources: SourcesRapport, debut: string, fin: string): RapportCalcule {
  const map = new Map<number, { nom: string; unite: string; quantite: number; ca: number }>();

  for (const vente of sources.ventes) {
    if (vente.statut !== 'confirmee') continue;
    if (!dansPeriode(vente.date_vente, debut, fin)) continue;

    for (const ligne of vente.lignes ?? []) {
      const produit = ligne.produit;
      const nom = produit?.nom ?? `Produit #${ligne.produit_id}`;
      const unite = produit?.unite?.nom ?? '—';
      const quantite = nombre(ligne.quantite_base ?? ligne.quantite);

      const entree = map.get(ligne.produit_id) ?? { nom, unite, quantite: 0, ca: 0 };
      entree.quantite += quantite;
      entree.ca += nombre(ligne.montant);
      map.set(ligne.produit_id, entree);
    }
  }

  const lignes = [...map.values()].sort((a, b) => b.ca - a.ca);
  const caTotal = lignes.reduce((sum, l) => sum + l.ca, 0);
  const quantiteTotale = lignes.reduce((sum, l) => sum + l.quantite, 0);

  const rows = lignes.map((entree, index) => ({
    rang: String(index + 1),
    produit: entree.nom,
    unite: entree.unite,
    quantite: String(entree.quantite),
    ca: formatCurrency(entree.ca),
    part: caTotal > 0 ? `${Math.round((entree.ca / caTotal) * 1000) / 10} %` : '—',
  }));

  return {
    type: 'produits',
    titre: 'Rapport des produits vendus',
    periode: `${debut} → ${fin}`,
    dateDebut: debut,
    dateFin: fin,
    montantReference: caTotal,
    kpis: [
      { label: 'Produits vendus', valeur: String(lignes.length) },
      { label: "Chiffre d'affaires", valeur: formatCurrency(caTotal), tone: 'success' },
      { label: 'Quantité vendue (unité de base)', valeur: String(quantiteTotale) },
      {
        label: 'Panier moyen',
        valeur: formatCurrency(
          sources.ventes.filter(
            (v) => v.statut === 'confirmee' && dansPeriode(v.date_vente, debut, fin),
          ).length > 0
            ? caTotal /
                sources.ventes.filter(
                  (v) => v.statut === 'confirmee' && dansPeriode(v.date_vente, debut, fin),
                ).length
            : 0,
        ),
      },
    ],
    colonnes: [
      { key: 'rang', label: '#', align: 'center' },
      { key: 'produit', label: 'Produit' },
      { key: 'unite', label: 'Unité de base' },
      { key: 'quantite', label: 'Quantité', align: 'right' },
      { key: 'ca', label: "Chiffre d'affaires", align: 'right' },
      { key: 'part', label: 'Part', align: 'center' },
    ],
    rows,
  };
}

/* ─────────────────────────────────────────────────────────────────────────────
   Rapport des clients
   ───────────────────────────────────────────────────────────────────────────── */

function rapportClients(sources: SourcesRapport, debut: string, fin: string): RapportCalcule {
  const ventes = sources.ventes.filter(
    (v) => v.statut === 'confirmee' && dansPeriode(v.date_vente, debut, fin),
  );

  const map = new Map<string, { nom: string; telephone: string; ventes: number; ca: number }>();
  for (const vente of ventes) {
    const nom = vente.client?.nom ?? 'Client de passage';
    const telephone = vente.client?.telephone ?? '—';
    const entree = map.get(nom) ?? { nom, telephone, ventes: 0, ca: 0 };
    entree.ventes += 1;
    entree.ca += nombre(vente.montant_total);
    map.set(nom, entree);
  }

  const lignes = [...map.values()].sort((a, b) => b.ca - a.ca);
  const caTotal = lignes.reduce((sum, l) => sum + l.ca, 0);

  const rows = lignes.map((entree) => ({
    client: entree.nom,
    telephone: entree.telephone,
    ventes: String(entree.ventes),
    ca: formatCurrency(entree.ca),
    panier: formatCurrency(entree.ventes > 0 ? entree.ca / entree.ventes : 0),
  }));

  return {
    type: 'clients',
    titre: 'Rapport des clients',
    periode: `${debut} → ${fin}`,
    dateDebut: debut,
    dateFin: fin,
    montantReference: caTotal,
    kpis: [
      { label: 'Clients servies', valeur: String(lignes.length) },
      { label: 'Chiffre d’affaires clients', valeur: formatCurrency(caTotal), tone: 'success' },
      {
        label: 'Panier moyen',
        valeur: formatCurrency(ventes.length > 0 ? caTotal / ventes.length : 0),
      },
      {
        label: 'Meilleur client',
        valeur: lignes[0]?.nom ?? '—',
        hint: lignes[0] ? formatCurrency(lignes[0].ca) : undefined,
      },
    ],
    colonnes: [
      { key: 'client', label: 'Client' },
      { key: 'telephone', label: 'Téléphone' },
      { key: 'ventes', label: 'Ventes', align: 'center' },
      { key: 'ca', label: 'Chiffre d’affaires', align: 'right' },
      { key: 'panier', label: 'Panier moyen', align: 'right' },
    ],
    rows,
  };
}

/* ─────────────────────────────────────────────────────────────────────────────
   Rapport financier
   ───────────────────────────────────────────────────────────────────────────── */

function rapportFinancier(sources: SourcesRapport, debut: string, fin: string): RapportCalcule {
  const ventes = sources.ventes.filter(
    (v) => v.statut === 'confirmee' && dansPeriode(v.date_vente, debut, fin),
  );
  const achats = sources.achats.filter(
    (a) => a.statut === 'confirme' && dansPeriode(a.date_achat, debut, fin),
  );
  const facturesLiees = new Set(
    sources.factures
      .filter((f) => ventes.some((v) => v.id === f.vente_id))
      .map((f) => f.id),
  );
  const reglements = sources.reglements.filter((r) => {
    if (!facturesLiees.has(r.facture_id)) return false;
    const facture = sources.factures.find((f) => f.id === r.facture_id);
    if (!facture) return false;
    const vente = ventes.find((v) => v.id === facture.vente_id);
    return vente ? dansPeriode(vente.date_vente, debut, fin) : false;
  });

  const ca = ventes.reduce((sum, v) => sum + nombre(v.montant_total), 0);
  const totalAchats = achats.reduce((sum, a) => sum + nombre(a.montant_total), 0);
  const encaisse = reglements.reduce((sum, r) => sum + nombre(r.montant), 0);

  const parMode = new Map<string, number>();
  for (const reglement of reglements) {
    parMode.set(reglement.mode, (parMode.get(reglement.mode) ?? 0) + nombre(reglement.montant));
  }

  const rows = [...parMode.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([mode, montant]) => ({
      mode,
      nombre: String(reglements.filter((r) => r.mode === mode).length),
      montant: formatCurrency(montant),
      part: encaisse > 0 ? `${Math.round((montant / encaisse) * 1000) / 10} %` : '—',
    }));

  return {
    type: 'financier',
    titre: 'Rapport financier',
    periode: `${debut} → ${fin}`,
    dateDebut: debut,
    dateFin: fin,
    montantReference: ca,
    kpis: [
      { label: "Chiffre d'affaires", valeur: formatCurrency(ca), tone: 'success' },
      { label: 'Total achats', valeur: formatCurrency(totalAchats), tone: 'warning' },
      { label: 'Encaissements', valeur: formatCurrency(encaisse), tone: 'success' },
      { label: 'Marge brute', valeur: formatCurrency(ca - totalAchats), tone: 'default' },
    ],
    colonnes: [
      { key: 'mode', label: 'Mode de règlement' },
      { key: 'nombre', label: 'Nombre', align: 'center' },
      { key: 'montant', label: 'Montant encaissé', align: 'right' },
      { key: 'part', label: 'Part', align: 'center' },
    ],
    rows,
  };
}

/* ─────────────────────────────────────────────────────────────────────────────
   Point d'entree
   ───────────────────────────────────────────────────────────────────────────── */

export function calculerRapport(
  type: string,
  debut: string,
  fin: string,
  sources: SourcesRapport,
): RapportCalcule {
  switch (type) {
    case 'achats':
      return rapportAchats(sources, debut, fin);
    case 'stock':
      return rapportStock(sources, debut, fin);
    case 'produits':
      return rapportProduits(sources, debut, fin);
    case 'clients':
      return rapportClients(sources, debut, fin);
    case 'financier':
      return rapportFinancier(sources, debut, fin);
    case 'ventes':
    default:
      return rapportVentes(sources, debut, fin);
  }
}

export const TYPES_RAPPORT_CALCULES = [
  { value: 'ventes', label: 'Rapport des ventes' },
  { value: 'achats', label: 'Rapport des achats' },
  { value: 'stock', label: 'Rapport du stock' },
  { value: 'produits', label: 'Rapport des produits vendus' },
  { value: 'clients', label: 'Rapport des clients' },
  { value: 'financier', label: 'Rapport financier' },
] as const;
