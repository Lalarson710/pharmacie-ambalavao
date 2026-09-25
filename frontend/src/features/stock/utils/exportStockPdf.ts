import { jsPDF } from 'jspdf';
import type { Inventaire, Lot, MouvementStock } from '@/types';
import type { StockParProduit } from '../api/stock';

export type StockReportTab =
  | 'stock-produit'
  | 'lots'
  | 'entrees'
  | 'sorties'
  | 'mouvements'
  | 'inventaires';

export interface StockReportFilters {
  dateFrom: string;
  dateTo: string;
  expiryFilter: 'all' | '30' | '60' | '90' | 'expired';
}

export interface StockReportData {
  products: StockParProduit[];
  lots: Lot[];
  movements: MouvementStock[];
  inventories: Inventaire[];
}

const PAGE_WIDTH = 210;
const MARGIN = 14;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const GREEN: [number, number, number] = [77, 139, 53];
const DARK_GREEN: [number, number, number] = [47, 111, 37];
const LIGHT_GREEN: [number, number, number] = [231, 245, 226];
const GRAY: [number, number, number] = [113, 128, 120];
const BORDER: [number, number, number] = [221, 230, 219];
const RED: [number, number, number] = [184, 75, 75];
const ORANGE: [number, number, number] = [148, 98, 0];

function formatDateShort(value: unknown): string {
  if (!value) return '—';
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);

  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

function getMovementDate(movement: MouvementStock): string {
  return movement.created_at ?? '';
}

function isInPeriod(value: unknown, filters: StockReportFilters): boolean {
  if (!filters.dateFrom && !filters.dateTo) return true;
  if (!value) return false;

  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return false;

  const from = filters.dateFrom ? new Date(`${filters.dateFrom}T00:00:00`) : null;
  const to = filters.dateTo ? new Date(`${filters.dateTo}T23:59:59`) : null;

  return (!from || date >= from) && (!to || date <= to);
}

function getStockState(quantity: number, minimum: number): string {
  if (quantity === 0) return 'Rupture';
  if (quantity <= minimum) return 'Stock faible';
  return 'Normal';
}

function getExpiryDays(date: string): number {
  const expiry = new Date(`${date}T23:59:59`);
  if (Number.isNaN(expiry.getTime())) return Number.POSITIVE_INFINITY;

  return Math.ceil(
    (expiry.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
  );
}

function getExpiryState(date: string): string {
  const days = getExpiryDays(date);

  if (days === Number.POSITIVE_INFINITY) return 'Inconnu';
  if (days < 0) return 'Expiré';
  if (days <= 30) return '≤ 30 jours';
  if (days <= 60) return '31 - 60 jours';
  if (days <= 90) return '61 - 90 jours';
  return 'Valide';
}

function isLotIncluded(lot: Lot, filter: StockReportFilters['expiryFilter']): boolean {
  if (filter === 'all') return true;

  const days = getExpiryDays(lot.date_peremption);
  if (filter === 'expired') return days < 0;

  const limit = Number(filter);
  return days >= 0 && days <= limit;
}

function getReportTitle(tab: StockReportTab): string {
  return {
    'stock-produit': 'ÉTAT DU STOCK',
    lots: 'LISTE DES LOTS',
    entrees: 'RAPPORT DES ENTRÉES',
    sorties: 'RAPPORT DES SORTIES',
    mouvements: 'HISTORIQUE DES MOUVEMENTS',
    inventaires: 'RAPPORT DES INVENTAIRES',
  }[tab];
}

function getSubtitle(tab: StockReportTab, filters: StockReportFilters): string {
  if (tab === 'lots' && filters.expiryFilter !== 'all') {
    return filters.expiryFilter === 'expired'
      ? 'Filtre : lots déjà expirés'
      : `Filtre : lots expirant sous ${filters.expiryFilter} jours`;
  }

  if (['entrees', 'sorties', 'mouvements'].includes(tab) && (filters.dateFrom || filters.dateTo)) {
    return `Période : du ${formatDateShort(filters.dateFrom || null)} au ${formatDateShort(filters.dateTo || null)}`;
  }

  return tab === 'inventaires'
    ? 'Situation des quantités contrôlées'
    : `Date d’édition : ${formatDateShort(new Date().toISOString())}`;
}

function setTextColor(doc: jsPDF, color: [number, number, number]) {
  doc.setTextColor(color[0], color[1], color[2]);
}

function addFooter(doc: jsPDF, total: number) {
  const pages = doc.getNumberOfPages();

  for (let page = 1; page <= pages; page += 1) {
    doc.setPage(page);
    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.25);
    doc.line(MARGIN, 282, PAGE_WIDTH - MARGIN, 282);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    setTextColor(doc, GRAY);
    doc.text('Pharmacie d’Ambalavao — Document de gestion du stock', MARGIN, 287);
    doc.text(`${total} enregistrement(s)`, PAGE_WIDTH - MARGIN, 287, { align: 'right' });
    doc.text(`Page ${page}/${pages}`, PAGE_WIDTH / 2, 287, { align: 'center' });
  }
}

function addHeader(
  doc: jsPDF,
  title: string,
  subtitle: string,
  page: number,
  pages: number,
) {
  doc.setFillColor(...GREEN);
  doc.rect(0, 0, PAGE_WIDTH, 8, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  setTextColor(doc, DARK_GREEN);
  doc.text('Pharmacie d’Ambalavao', MARGIN, 25);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  setTextColor(doc, GRAY);
  doc.text('Gestion du stock et traçabilité', MARGIN, 31);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`Rapport généré le ${formatDateShort(new Date().toISOString())}`, PAGE_WIDTH - MARGIN, 25, {
    align: 'right',
  });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  setTextColor(doc, [31, 51, 37]);
  doc.text(title, MARGIN, 48);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  setTextColor(doc, GRAY);
  doc.text(subtitle, MARGIN, 55);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text(`Page ${page}/${pages || 1}`, PAGE_WIDTH - MARGIN, 55, { align: 'right' });
  doc.setDrawColor(...GREEN);
  doc.setLineWidth(0.6);
  doc.line(MARGIN, 61, PAGE_WIDTH - MARGIN, 61);
}

function addSummary(doc: jsPDF, cards: Array<[string, string]>, top: number): number {
  const gap = 4;
  const width = (CONTENT_WIDTH - gap * (cards.length - 1)) / cards.length;

  cards.forEach(([label, value], index) => {
    const x = MARGIN + index * (width + gap);
    doc.setFillColor(...LIGHT_GREEN);
    doc.setDrawColor(...BORDER);
    doc.roundedRect(x, top, width, 19, 2, 2, 'FD');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    setTextColor(doc, GRAY);
    doc.text(label.toUpperCase(), x + 4, top + 6);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    setTextColor(doc, DARK_GREEN);
    doc.text(value, x + 4, top + 14);
  });

  return top + 27;
}

function addTable(
  doc: jsPDF,
  headers: string[],
  rows: string[][],
  startY: number,
  widths: number[],
  options: { numericColumns?: number[]; statusColumn?: number } = {},
): number {
  const numericColumns = new Set(options.numericColumns ?? []);
  const rowHeight = 7;
  let y = startY;

  function drawHeader() {
    doc.setFillColor(...GREEN);
    doc.rect(MARGIN, y, CONTENT_WIDTH, 8, 'F');
    let x = MARGIN;

    headers.forEach((header, index) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      setTextColor(doc, [255, 255, 255]);
      doc.text(header.toUpperCase(), x + 2, y + 5.3, {
        maxWidth: widths[index] - 4,
        align: numericColumns.has(index) ? 'right' : 'left',
      });
      x += widths[index];
    });

    y += 8;
  }

  function drawRow(row: string[], index: number) {
    if (index % 2 === 1) {
      doc.setFillColor(...[250, 252, 249]);
      doc.rect(MARGIN, y, CONTENT_WIDTH, rowHeight, 'F');
    }

    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.15);
    doc.line(MARGIN, y + rowHeight, PAGE_WIDTH - MARGIN, y + rowHeight);

    let x = MARGIN;
    row.forEach((cell, cellIndex) => {
      const isStatus = cellIndex === options.statusColumn;
      doc.setFont('helvetica', cellIndex === 0 ? 'normal' : 'normal');
      doc.setFontSize(7.2);
      if (isStatus) {
        const state = cell.toLowerCase();
        const color = state.includes('rupture') || state.includes('expiré') ? RED : state.includes('faible') || state.includes('jours') ? ORANGE : DARK_GREEN;
        setTextColor(doc, color);
      } else if (cell.startsWith('+')) {
        setTextColor(doc, [35, 122, 49]);
      } else if (cell.startsWith('−') || cell.startsWith('-')) {
        setTextColor(doc, RED);
      } else {
        setTextColor(doc, [36, 53, 43]);
      }

      doc.text(cell || '—', x + 2, y + 4.8, {
        maxWidth: widths[cellIndex] - 4,
        align: numericColumns.has(cellIndex) ? 'right' : 'left',
      });
      x += widths[cellIndex];
    });
  }

  drawHeader();

  if (rows.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    setTextColor(doc, GRAY);
    doc.text('Aucun enregistrement à afficher.', PAGE_WIDTH / 2, y + 12, { align: 'center' });
    return y + 20;
  }

  rows.forEach((row, index) => {
    if (y + rowHeight > 276) {
      addFooter(doc, rows.length);
      doc.addPage();
      y = 18;
      drawHeader();
    }
    drawRow(row, index);
    y += rowHeight;
  });

  return y;
}

function addTitle(doc: jsPDF, text: string, y: number): number {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  setTextColor(doc, DARK_GREEN);
  doc.text(text, MARGIN, y);
  return y + 7;
}

function addStockReport(doc: jsPDF, data: StockReportData) {
  const rows = data.products.map((product) => {
    const quantity = Number(product.lots_sum_quantite ?? 0);
    return [
      product.nom,
      product.categorie?.nom ?? '—',
      String(quantity),
      String(product.stock_minimum),
      getStockState(quantity, product.stock_minimum),
    ];
  });
  const low = rows.filter((row) => row[4] === 'Stock faible').length;
  const ruptures = rows.filter((row) => row[4] === 'Rupture').length;
  const summary = addSummary(doc, [['Produits', String(rows.length)], ['Stocks faibles', String(low)], ['Ruptures', String(ruptures)]], 68);
  addTable(doc, ['Produit', 'Catégorie', 'Stock', 'Minimum', 'État'], rows, addTitle(doc, 'Situation par produit', summary), [70, 36, 22, 24, 30], { numericColumns: [2, 3], statusColumn: 4 });
}

function addLotsReport(doc: jsPDF, data: StockReportData, filters: StockReportFilters) {
  const lots = data.lots.filter((lot) => isLotIncluded(lot, filters.expiryFilter));
  const rows = lots.map((lot) => [
    lot.produit?.nom ?? '—',
    lot.numero_lot,
    String(lot.quantite),
    formatDateShort(lot.date_peremption),
    getExpiryState(lot.date_peremption),
  ]);
  const alerts = rows.filter((row) => row[4] !== 'Valide').length;
  const summary = addSummary(doc, [['Lots affichés', String(lots.length)], ['Alertes péremption', String(alerts)]], 68);
  addTable(doc, ['Produit', 'N° lot', 'Quantité', 'Péremption', 'État'], rows, addTitle(doc, 'Détail des lots', summary), [65, 33, 25, 35, 24], { numericColumns: [2], statusColumn: 4 });
}

function addMovementsReport(
  doc: jsPDF,
  tab: 'entree' | 'sortie' | 'mouvements',
  data: StockReportData,
  filters: StockReportFilters,
) {
  const movements = data.movements
    .filter((movement) => tab === 'mouvements' || movement.type === tab)
    .filter((movement) => isInPeriod(getMovementDate(movement), filters));
  const rows = movements.map((movement) => {
    const isEntry = movement.type === 'entree';
    const type = isEntry ? 'Entrée' : movement.type === 'sortie' ? 'Sortie' : 'Ajustement';
    return [
      formatDateShort(getMovementDate(movement)),
      movement.lot?.produit?.nom ?? '—',
      movement.lot?.numero_lot ?? '—',
      type,
      `${isEntry ? '+' : movement.type === 'sortie' ? '−' : ''}${movement.quantite}`,
      movement.motif ?? '—',
    ];
  });
  const net = movements.reduce((sum, movement) => sum + (movement.type === 'sortie' ? -movement.quantite : movement.quantite), 0);
  const summary = addSummary(doc, [['Mouvements', String(movements.length)], ['Quantité nette', `${net > 0 ? '+' : ''}${net}`]], 68);
  addTable(doc, ['Date', 'Produit', 'N° lot', 'Type', 'Quantité', 'Motif'], rows, addTitle(doc, 'Journal des mouvements', summary), [25, 48, 28, 22, 20, 39], { numericColumns: [4] });
}

function addInventoriesReport(doc: jsPDF, data: StockReportData) {
  const allLines = data.inventories.flatMap((inventory) => inventory.lignes ?? []);
  const totalEcart = allLines.reduce((sum, line) => sum + Number(line.ecart), 0);
  const withEcart = allLines.filter((line) => Number(line.ecart) !== 0).length;
  const summary = addSummary(doc, [['Inventaires', String(data.inventories.length)], ['Lignes avec écart', String(withEcart)], ['Total des écarts', `${totalEcart > 0 ? '+' : ''}${totalEcart}`]], 68);
  let y = addTitle(doc, 'Inventaires réalisés', summary);

  data.inventories.forEach((inventory) => {
    const blockHeight = 20 + (inventory.lignes?.length ?? 0) * 7;
    if (y + blockHeight > 276) {
      addFooter(doc, data.inventories.length);
      doc.addPage();
      y = 18;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    setTextColor(doc, DARK_GREEN);
    doc.text(`Inventaire du ${formatDateShort(inventory.date_inventaire)}`, MARGIN, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    setTextColor(doc, GRAY);
    doc.text(`Motif : ${inventory.motif || 'Non précisé'}`, MARGIN, y + 5);
    y = addTable(doc, ['Produit / Lot', 'Théorique', 'Réel', 'Écart'], (inventory.lignes ?? []).map((line) => [
      `${line.lot?.produit?.nom ?? '—'} / ${line.lot?.numero_lot ?? '—'}`,
      String(line.quantite_theorique),
      String(line.quantite_reelle),
      `${Number(line.ecart) > 0 ? '+' : ''}${line.ecart}`,
    ]), y + 10, [94, 26, 26, 26], { numericColumns: [1, 2, 3] });
    y += 8;
  });
}

export function downloadStockReport(
  tab: StockReportTab,
  data: StockReportData,
  filters: StockReportFilters,
): boolean {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pages = tab === 'inventaires' ? Math.max(1, data.inventories.length) : 1;
  addHeader(doc, getReportTitle(tab), getSubtitle(tab, filters), 1, pages);

  if (tab === 'stock-produit') addStockReport(doc, data);
  if (tab === 'lots') addLotsReport(doc, data, filters);
  if (tab === 'entrees') addMovementsReport(doc, 'entree', data, filters);
  if (tab === 'sorties') addMovementsReport(doc, 'sortie', data, filters);
  if (tab === 'mouvements') addMovementsReport(doc, 'mouvements', data, filters);
  if (tab === 'inventaires') addInventoriesReport(doc, data);

  const total = tab === 'stock-produit'
    ? data.products.length
    : tab === 'lots'
      ? data.lots.length
      : tab === 'inventaires'
        ? data.inventories.length
        : data.movements
            .filter((movement) =>
              tab === 'mouvements'
                ? true
                : movement.type === (tab === 'entrees' ? 'entree' : 'sortie'),
            )
            .filter((movement) =>
              isInPeriod(getMovementDate(movement), filters),
            ).length;

  addFooter(doc, total);
  const date = new Date().toISOString().slice(0, 10);
  doc.save(`stock_${date}.pdf`);
  return true;
}
