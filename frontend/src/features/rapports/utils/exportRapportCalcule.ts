import { jsPDF } from 'jspdf';
import {
  formatDateLongue,
  formatDateFichier,
  sanitizePdf,
} from '@/features/statistiques/utils/exportStatistiques';
import type { RapportCalcule } from './calculRapport';

export type ExportFormat = 'csv' | 'xlsx' | 'pdf';

/**
 * Export d'un rapport calcule (KPIs + detail).
 * Reutilise les helpers de date / PDF deja valides dans le module Statistiques.
 */

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

function downloadBlob(content: string, filename: string, mime: string) {
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

function nomFichier(rapport: RapportCalcule): string {
  return `${rapport.titre.replace(/\s+/g, '_')}_Du_${formatDateFichier(
    rapport.dateDebut,
  )}_Au_${formatDateFichier(rapport.dateFin)}`;
}

export function exportToCsv(rapport: RapportCalcule): boolean {
  const lignes: string[][] = [
    [rapport.titre],
    [
      `Période : du ${formatDateLongue(rapport.dateDebut)} au ${formatDateLongue(
        rapport.dateFin,
      )}`,
    ],
    [],
  ];

  for (const kpi of rapport.kpis) {
    lignes.push([kpi.label, kpi.hint ? `${kpi.valeur} (${kpi.hint})` : kpi.valeur]);
  }

  lignes.push([]);
  lignes.push(rapport.colonnes.map((colonne) => colonne.label));
  for (const row of rapport.rows) {
    lignes.push(rapport.colonnes.map((colonne) => String(row[colonne.key] ?? '')));
  }

  downloadBlob(
    lignes.map((ligne) => ligne.map(escapeCsv).join(';')).join('\r\n'),
    `${nomFichier(rapport)}.csv`,
    'text/csv;charset=utf-8;',
  );
  return true;
}

export function exportToExcel(rapport: RapportCalcule): boolean {
  exportToCsv(rapport);
  return true;
}

/* ─────────────────────────────────────────────────────────────────────────────
   PDF
   ───────────────────────────────────────────────────────────────────────────── */

const GREEN_DARK: [number, number, number] = [15, 118, 110];
const GREEN: [number, number, number] = [22, 163, 74];
const GREEN_LIGHT: [number, number, number] = [236, 253, 245];
const GREY: [number, number, number] = [100, 116, 139];

export function exportToPdf(rapport: RapportCalcule): boolean {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;
  const contenuWidth = pageWidth - margin * 2;

  /* En-tete vert */
  doc.setFillColor(...GREEN_DARK);
  doc.rect(0, 0, pageWidth, 30, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('PHARMAGESTION PRO', margin, 12);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text("Rapports - Pharmacie d'Ambalavao", margin, 19);
  doc.setFontSize(10);
  doc.text(sanitizePdf(rapport.titre), pageWidth - margin, 12, { align: 'right' });
  doc.setFontSize(8.5);
  doc.text(
    sanitizePdf(
      `Du ${formatDateLongue(rapport.dateDebut)} au ${formatDateLongue(rapport.dateFin)}`,
    ),
    pageWidth - margin,
    19,
    { align: 'right' },
  );

  let y = 38;

  /* Cartes de synthese (KPI) */
  const kpiCount = rapport.kpis.length || 1;
  const colonnes = kpiCount > 3 ? 2 : kpiCount;
  const lignesCarte = Math.ceil(kpiCount / colonnes);
  const cardWidth = (contenuWidth - (colonnes - 1) * 4) / colonnes;
  const cardHeight = 17;

  rapport.kpis.forEach((kpi, index) => {
    const colonne = index % colonnes;
    const ligne = Math.floor(index / colonnes);
    const x = margin + colonne * (cardWidth + 4);
    const cardY = y + ligne * (cardHeight + 4);

    const fond =
      kpi.tone === 'danger'
        ? ([253, 238, 233] as [number, number, number])
        : kpi.tone === 'warning'
          ? ([253, 244, 227] as [number, number, number])
          : GREEN_LIGHT;
    const bordure =
      kpi.tone === 'danger'
        ? ([252, 205, 190] as [number, number, number])
        : kpi.tone === 'warning'
          ? ([250, 214, 165] as [number, number, number])
          : ([187, 247, 208] as [number, number, number]);
    const texte =
      kpi.tone === 'danger'
        ? ([185, 28, 28] as [number, number, number])
        : kpi.tone === 'warning'
          ? ([180, 83, 9] as [number, number, number])
          : GREEN_DARK;

    doc.setFillColor(...fond);
    doc.setDrawColor(...bordure);
    doc.roundedRect(x, cardY, cardWidth, cardHeight, 2, 2, 'FD');

    doc.setTextColor(...GREY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(sanitizePdf(kpi.label), x + 4, cardY + 6.5, { baseline: 'middle' });

    doc.setTextColor(...texte);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(sanitizePdf(kpi.valeur), x + 4, cardY + 12.5, { baseline: 'middle' });

    if (kpi.hint) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...GREY);
      doc.text(sanitizePdf(kpi.hint), x + cardWidth - 4, cardY + 12.5, {
        align: 'right',
        baseline: 'middle',
      });
    }
  });

  y += lignesCarte * (cardHeight + 4) + 2;

  /* Coupe un texte en lignes qui tiennent dans la cellule */
  const wrapText = (text: string, maxWidth: number, maxLines = 3): string[] => {
    if (!text) return [''];
    if (doc.getTextWidth(text) <= maxWidth) return [text];

    const words = text.split(/\s+/);
    const lignes: string[] = [];
    let current = '';

    words.forEach((word) => {
      const candidate = current ? `${current} ${word}` : word;
      if (doc.getTextWidth(candidate) <= maxWidth) {
        current = candidate;
        return;
      }
      if (current) lignes.push(current);
      if (doc.getTextWidth(word) > maxWidth) {
        let chunk = '';
        for (const char of word) {
          if (chunk && doc.getTextWidth(chunk + char) > maxWidth) {
            lignes.push(chunk);
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

    if (current) lignes.push(current);
    return lignes.slice(0, maxLines);
  };

  /* Repartition des largeurs de colonnes */
  const weights = rapport.colonnes.map((colonne) =>
    colonne.key === 'description' || colonne.key === 'client' || colonne.key === 'produit'
      ? 1.6
      : colonne.key === 'numero'
        ? 0.9
        : 1,
  );
  const sommeWeights = weights.reduce((sum, w) => sum + w, 0);
  const widths = weights.map((w) => (w / sommeWeights) * contenuWidth);
  const aligns = rapport.colonnes.map((c) => c.align ?? 'left');
  const rowHeight = 8;

  if (rapport.rows.length === 0) {
    doc.setTextColor(...GREY);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.text('Aucune donnee sur cette periode.', margin, y + 4);
    y += 12;
  }

  /* En-tete du tableau */
  if (rapport.rows.length > 0) {
    doc.setFillColor(...GREEN);
    doc.rect(margin, y, contenuWidth, rowHeight, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);

    let x = margin;
    rapport.colonnes.forEach((colonne, index) => {
      doc.text(
        wrapText(sanitizePdf(colonne.label), widths[index] - 4, 2),
        x + widths[index] / 2,
        y + rowHeight / 2,
        { align: 'center', baseline: 'middle', lineHeightFactor: 0.9 },
      );
      x += widths[index];
    });

    let currentY = y + rowHeight;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);

    rapport.rows.forEach((row, rowIndex) => {
      if (currentY > doc.internal.pageSize.getHeight() - 20) {
        doc.addPage();
        currentY = 18;
      }

      const cellLines = rapport.colonnes.map((colonne, index) =>
        wrapText(sanitizePdf(String(row[colonne.key] ?? '')), widths[index] - 4),
      );
      const lineCount = Math.max(1, ...cellLines.map((l) => l.length));
      const cellHeight = lineCount * 3.8 + 1.6;

      if (rowIndex % 2 === 1) {
        doc.setFillColor(240, 253, 244);
        doc.rect(margin, currentY, contenuWidth, cellHeight, 'F');
      }

      let cellX = margin;
      cellLines.forEach((lines, index) => {
        const align = aligns[index] ?? 'left';
        let position = cellX + 2;
        if (align === 'center') position = cellX + widths[index] / 2;
        if (align === 'right') position = cellX + widths[index] - 2;

        doc.setTextColor(30, 64, 47);
        doc.text(lines, position, currentY + cellHeight / 2, {
          align,
          baseline: 'middle',
          lineHeightFactor: 0.9,
        });

        cellX += widths[index];
      });

      doc.setDrawColor(220, 252, 231);
      doc.line(margin, currentY + cellHeight, pageWidth - margin, currentY + cellHeight);
      currentY += cellHeight;
    });

    doc.setDrawColor(...GREEN);
    doc.setLineWidth(0.4);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    doc.setLineWidth(0.2);

    /* Total de lignes */
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...GREY);
    doc.text(`${rapport.rows.length} ligne(s)`, pageWidth - margin, currentY + 5, {
      align: 'right',
    });
  }

  /* Pied de page */
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
  doc.save(`${nomFichier(rapport)}.pdf`);
  return true;
}

export function exporterRapport(format: ExportFormat, rapport: RapportCalcule): boolean {
  try {
    if (format === 'csv') return exportToCsv(rapport);
    if (format === 'xlsx') return exportToExcel(rapport);
    return exportToPdf(rapport);
  } catch (error) {
    console.error('export rapport:', error);
    return false;
  }
}
