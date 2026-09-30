import { jsPDF } from 'jspdf';
import type { ProduitPlusVendu, Vente } from '@/types';
import { formatCurrency } from '@/utils/formatters';

export type ExportFormat = 'csv' | 'xlsx' | 'pdf';

export type ExportDataset = 'ventes' | 'produits' | 'ca';

export interface ExportStatistiquesData {
  dataset: ExportDataset;
  dateDebut: string;
  dateFin: string;
  ventes: Vente[];
  produitsPlusVendus: ProduitPlusVendu[];
  chiffreAffaires: number;
}

const DATASET_LABELS: Record<ExportDataset, string> = {
  ventes: 'Ventes',
  produits: 'Produits les plus vendus',
  ca: 'Chiffre affaires',
};

const MOIS_FR = [
  'Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre',
];

/** Convertit une date ISO (YYYY-MM-DD) en Date sans decalage de fuseau. */
function parseIsoDate(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year ?? 1970, (month ?? 1) - 1, day ?? 1);
}

/** 2026-01-16 → « 16 Janvier 2026 » */
export function formatDateLongue(value: string): string {
  if (!value) return '—';
  const date = parseIsoDate(value);
  if (Number.isNaN(date.getTime())) return value;
  const mois = MOIS_FR[date.getMonth()] ?? '';
  return `${date.getDate()} ${mois} ${date.getFullYear()}`;
}

/** 2026-01-16 → « 16_Janvier_2026 » (utilise dans les noms de fichiers) */
export function formatDateFichier(value: string): string {
  if (!value) return 'sans_date';
  const date = parseIsoDate(value);
  if (Number.isNaN(date.getTime())) return value;
  const mois = MOIS_FR[date.getMonth()] ?? '';
  return `${date.getDate()}_${mois}_${date.getFullYear()}`;
}

/**
 * Convertit n'importe quelle date renvoyee par l'API
 * (YYYY-MM-DD ou YYYY-MM-DDTHH:mm:ss.sssZ) en date lisible :
 * « 16 Janvier 2026 ». L'heure est volontairement ignoree.
 */
export function formatDateVente(value: string): string {
  if (!value) return '—';
  return formatDateLongue(String(value).slice(0, 10));
}

/* ─────────────────────────────────────────────────────────────────────────────
   CSV / Excel
   ───────────────────────────────────────────────────────────────────────────── */

function escapeCsv(value: unknown): string {
  const text = value === null || value === undefined ? '' : String(value);
  if (/[";\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function toCsv(headers: string[], rows: unknown[][]): string {
  return [headers, ...rows].map((row) => row.map(escapeCsv).join(';')).join('\r\n');
}

function downloadBlob(content: string, filename: string, mime: string) {
  // BOM UTF-8 : Excel ouvre correctement les accents
  const blob = new Blob([`﻿${content}`], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function buildRows(data: ExportStatistiquesData): { headers: string[]; rows: unknown[][] } {
  if (data.dataset === 'produits') {
    return {
      headers: ['#', 'Produit', 'Quantité vendue', "Chiffre d'affaires (Ar)"],
      rows: data.produitsPlusVendus.map((row, index) => [
        index + 1,
        row.nom,
        row.quantite_vendue,
        row.chiffre_affaires,
      ]),
    };
  }

  if (data.dataset === 'ventes') {
    return {
      headers: ['#', 'N° Vente', 'Date', 'Client', 'Montant (Ar)', 'Statut'],
      rows: data.ventes.map((row, index) => [
        index + 1,
        row.numero,
        formatDateVente(row.date_vente),
        row.client?.nom ?? '—',
        row.montant_total,
        row.statut,
      ]),
    };
  }

  return {
    headers: ['Période', 'Date début', 'Date fin', 'Nombre de ventes', "Chiffre d'affaires (Ar)"],
    rows: [
      [
        `Du ${formatDateLongue(data.dateDebut)} au ${formatDateLongue(data.dateFin)}`,
        formatDateLongue(data.dateDebut),
        formatDateLongue(data.dateFin),
        data.ventes.length,
        data.chiffreAffaires,
      ],
    ],
  };
}

export function exportToCsv(data: ExportStatistiquesData): boolean {
  const { headers, rows } = buildRows(data);
  downloadBlob(
    toCsv(headers, rows),
    `${DATASET_LABELS[data.dataset]}_Du_${formatDateFichier(data.dateDebut)}_Au_${formatDateFichier(data.dateFin)}.csv`,
    'text/csv;charset=utf-8;',
  );
  return true;
}

export function exportToExcel(data: ExportStatistiquesData): boolean {
  // CSV compatible Excel (separateur ";", BOM UTF-8)
  exportToCsv(data);
  return true;
}

/* ─────────────────────────────────────────────────────────────────────────────
   PDF
   ───────────────────────────────────────────────────────────────────────────── */

const GREEN_DARK: [number, number, number] = [15, 118, 110];
const GREEN: [number, number, number] = [22, 163, 74];
const GREEN_LIGHT: [number, number, number] = [236, 253, 245];
const GREY: [number, number, number] = [100, 116, 139];

/**
 * Les polices standard de jsPDF (helvetica) ne gèrent pas les accents :
 * chaque caractere accentue devient un glyphe parasite qui « mélange » le texte.
 * On translittere donc en ASCII avant tout affichage dans le PDF.
 */
const PDF_ACCENT_MAP: Record<string, string> = {
  'à': 'a', 'á': 'a', 'â': 'a', 'ä': 'a', 'ã': 'a', 'å': 'a',
  'ç': 'c',
  'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e',
  'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',
  'ñ': 'n',
  'ò': 'o', 'ó': 'o', 'ô': 'o', 'ö': 'o', 'õ': 'o',
  'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u',
  'ý': 'y', 'ÿ': 'y',
  'À': 'A', 'Á': 'A', 'Â': 'A', 'Ä': 'A', 'Ã': 'A', 'Å': 'A',
  'Ç': 'C',
  'È': 'E', 'É': 'E', 'Ê': 'E', 'Ë': 'E',
  'Ì': 'I', 'Í': 'I', 'Î': 'I', 'Ï': 'I',
  'Ñ': 'N',
  'Ò': 'O', 'Ó': 'O', 'Ô': 'O', 'Ö': 'O', 'Õ': 'O',
  'Ù': 'U', 'Ú': 'U', 'Û': 'U', 'Ü': 'U',
};

export function sanitizePdf(value: string): string {
  return value
    .replace(/[^\x20-\x7E]/g, (char) => PDF_ACCENT_MAP[char] ?? '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function exportToPdf(data: ExportStatistiquesData): boolean {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;
  let y = 18;

  // Bandeau d'en-tete — theme vert de l'application
  doc.setFillColor(...GREEN_DARK);
  doc.rect(0, 0, pageWidth, 28, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('PHARMAGESTION PRO', margin, 12);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text("Statistiques - Pharmacie d'Ambalavao", margin, 19);
  doc.setFontSize(9);
  doc.text(
    `Du ${formatDateLongue(data.dateDebut)} au ${formatDateLongue(data.dateFin)}`,
    pageWidth - margin,
    15,
    { align: 'right' },
  );

  y = 36;

  // Cartes de synthese
  const cards: Array<[string, string]> = [
    ['Ventes', String(data.ventes.length)],
    ["Chiffre d'affaires", sanitizePdf(formatCurrency(data.chiffreAffaires))],
    ['Produits vendus', String(data.produitsPlusVendus.length)],
  ];

  const cardWidth = (pageWidth - margin * 2 - 8) / 3;
  cards.forEach(([label, value], index) => {
    const x = margin + index * (cardWidth + 4);
    doc.setFillColor(...GREEN_LIGHT);
    doc.setDrawColor(187, 247, 208);
    doc.roundedRect(x, y, cardWidth, 18, 2, 2, 'FD');
    doc.setTextColor(...GREY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(sanitizePdf(label), x + 4, y + 7, { baseline: 'middle' });
    doc.setTextColor(...GREEN_DARK);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(value, x + 4, y + 14, { baseline: 'middle' });
  });

  y += 28;

  /**
   * Coupe un texte en plusieurs lignes qui tiennent dans la largeur de la cellule.
   * Les mots trop longs sont scindes caractere par caractere : aucune lettre
   * n'est jamais perdue ni tronquee « ... » dans un nom de produit ou de client.
   */
  const wrapText = (text: string, maxWidth: number, maxLines = 3): string[] => {
    if (!text) return [''];
    if (doc.getTextWidth(text) <= maxWidth) return [text];

    const words = text.split(/\s+/);
    const lines: string[] = [];
    let current = '';

    words.forEach((word) => {
      const candidate = current ? `${current} ${word}` : word;

      if (doc.getTextWidth(candidate) <= maxWidth) {
        current = candidate;
        return;
      }

      if (current) lines.push(current);

      if (doc.getTextWidth(word) > maxWidth) {
        let chunk = '';
        for (const char of word) {
          if (chunk && doc.getTextWidth(chunk + char) > maxWidth) {
            lines.push(chunk);
            chunk = char;
          } else {
            chunk += char;
          }
        }
        current = chunk;
      } else {
        current = word;
      }
    });

    if (current) lines.push(current);
    return lines.slice(0, maxLines);
  };

  const drawTable = (
    headers: string[],
    rows: unknown[][],
    widths: number[],
    aligns: Array<'left' | 'center' | 'right'>,
  ) => {
    const contentWidth = pageWidth - margin * 2;
    const rowHeight = 7;
    const startY = y;

    // En-tete vert
    doc.setFillColor(...GREEN);
    doc.rect(margin, startY, contentWidth, rowHeight, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);

    let x = margin;
    headers.forEach((header, index) => {
      const center = x + widths[index] / 2;
      const headerLines = wrapText(sanitizePdf(header), widths[index] - 4, 2);
      doc.text(headerLines, center, startY + rowHeight / 2, {
        align: 'center',
        baseline: 'middle',
        lineHeightFactor: 0.9,
      });
      x += widths[index];
    });

    let currentY = startY + rowHeight;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);

    rows.forEach((row, rowIndex) => {
      if (currentY > doc.internal.pageSize.getHeight() - 22) {
        doc.addPage();
        currentY = 18;
      }

      // Hauteur de ligne adaptative : 3,2 mm par ligne de texte
      const cellLines = row.map((cell, index) =>
        wrapText(sanitizePdf(String(cell ?? '')), (widths[index] ?? 20) - 4),
      );
      const lineCount = Math.max(1, ...cellLines.map((lines) => lines.length));
      const cellHeight = lineCount * 3.8 + 1.6;

      if (rowIndex % 2 === 1) {
        doc.setFillColor(240, 253, 244);
        doc.rect(margin, currentY, contentWidth, cellHeight, 'F');
      }

      let cellX = margin;
      cellLines.forEach((lines, index) => {
        const align = aligns[index] ?? 'left';
        const cellWidth = widths[index];
        let position = cellX + 2;
        if (align === 'center') position = cellX + cellWidth / 2;
        if (align === 'right') position = cellX + cellWidth - 2;

        doc.setTextColor(30, 64, 47);
        doc.text(lines, position, currentY + cellHeight / 2, {
          align,
          baseline: 'middle',
          lineHeightFactor: 0.9,
        });

        cellX += cellWidth;
      });

      // Fine separation entre cellules
      doc.setDrawColor(220, 252, 231);
      doc.line(margin, currentY + cellHeight, pageWidth - margin, currentY + cellHeight);

      currentY += cellHeight;
    });

    doc.setDrawColor(...GREEN);
    doc.setLineWidth(0.4);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    doc.setLineWidth(0.2);

    y = currentY + 8;
  };

  if (data.dataset === 'produits') {
    const { headers, rows } = buildRows(data);
    drawTable(headers, rows, [12, 80, 46, 44], ['center', 'left', 'center', 'right']);
  } else if (data.dataset === 'ventes') {
    const { headers, rows } = buildRows(data);
    drawTable(
      headers,
      rows,
      [10, 32, 34, 48, 32, 26],
      ['center', 'center', 'center', 'left', 'right', 'center'],
    );
  } else {
    const { headers, rows } = buildRows(data);
    drawTable(headers, rows, [52, 32, 32, 28, 38], [
      'center',
      'center',
      'center',
      'center',
      'right',
    ]);
  }

  // Pied de page
  const pages = doc.getNumberOfPages();
  const printedOn = sanitizePdf(
    new Date().toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
  );
  for (let page = 1; page <= pages; page += 1) {
    doc.setPage(page);
    doc.setTextColor(...GREY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text(
      `Genere le ${printedOn} - page ${page}/${pages}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 8,
      { align: 'center', baseline: 'middle' },
    );
  }

  doc.setTextColor(...GREEN);
  doc.save(
    `${DATASET_LABELS[data.dataset]}_Du_${formatDateFichier(data.dateDebut)}_Au_${formatDateFichier(data.dateFin)}.pdf`,
  );
  return true;
}

export function exporterDonnees(
  format: ExportFormat,
  data: ExportStatistiquesData,
): boolean {
  try {
    if (format === 'csv') return exportToCsv(data);
    if (format === 'xlsx') return exportToExcel(data);
    return exportToPdf(data);
  } catch (error) {
    console.error('export statistiques:', error);
    return false;
  }
}
