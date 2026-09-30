import { useState } from 'react';
import { FileSpreadsheet, FileText, Table2, CheckCircle2 } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { useToast } from '@/components/Toast';
import type { ProduitPlusVendu, Vente } from '@/types';
import {
  exporterDonnees,
  formatDateLongue,
  type ExportDataset,
  type ExportFormat,
} from '../../utils/exportStatistiques';

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
  dateDebut: string;
  dateFin: string;
  ventes: Vente[];
  produitsPlusVendus: ProduitPlusVendu[];
  chiffreAffaires: number;
}

const FORMATS: Array<{
  id: ExportFormat;
  label: string;
  description: string;
  icon: typeof FileText;
  className: string;
}> = [
  {
    id: 'pdf',
    label: 'PDF',
    description: 'Document prêt à imprimer ou à envoyer',
    icon: FileText,
    className: 'is-pdf',
  },
  {
    id: 'xlsx',
    label: 'Excel',
    description: 'Fichier CSV optimisé pour Excel',
    icon: FileSpreadsheet,
    className: 'is-excel',
  },
  {
    id: 'csv',
    label: 'CSV',
    description: 'Données brutes séparées par des points-virgules',
    icon: Table2,
    className: 'is-csv',
  },
];

const DATASETS: Array<{ id: ExportDataset; label: string; hint: string }> = [
  { id: 'ca', label: "Chiffre d'affaires", hint: 'Synthèse de la période' },
  { id: 'ventes', label: 'Ventes', hint: 'Détail des ventes confirmées' },
  { id: 'produits', label: 'Produits vendus', hint: 'Classement par quantité' },
];

export function ExportModal({
  open,
  onClose,
  dateDebut,
  dateFin,
  ventes,
  produitsPlusVendus,
  chiffreAffaires,
}: ExportModalProps) {
  const { showToast } = useToast();
  const [format, setFormat] = useState<ExportFormat>('pdf');
  const [dataset, setDataset] = useState<ExportDataset>('ca');
  const [busy, setBusy] = useState(false);

  const rowCount =
    dataset === 'ventes'
      ? ventes.length
      : dataset === 'produits'
        ? produitsPlusVendus.length
        : 1;

  function handleExport() {
    setBusy(true);
    const ok = exporterDonnees(format, {
      dataset,
      dateDebut,
      dateFin,
      ventes,
      produitsPlusVendus,
      chiffreAffaires,
    });
    setBusy(false);

    if (ok) {
      showToast('Export téléchargé avec succès.', 'success');
      onClose();
    } else {
      showToast('Impossible de générer le fichier.', 'error');
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Exporter les statistiques" size="md">
      <div className="export-modal">
        <div className="export-modal-intro">
          <span className="export-period-label">Période exportée</span>
          <span className="export-period-value">
            Du <strong>{formatDateLongue(dateDebut)}</strong>
          </span>
          <span className="export-period-sep" aria-hidden="true" />
          <span className="export-period-value">
            Au <strong>{formatDateLongue(dateFin)}</strong>
          </span>
        </div>

        <section className="export-section">
          <h4>Contenu à exporter</h4>
          <div className="export-datasets">
            {DATASETS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`export-dataset ${dataset === item.id ? 'is-selected' : ''}`}
                onClick={() => setDataset(item.id)}
              >
                <span className="export-dataset-label">
                  {item.label}
                  {dataset === item.id && <CheckCircle2 size={14} />}
                </span>
                <span className="export-dataset-hint">{item.hint}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="export-section">
          <h4>Format du fichier</h4>
          <div className="export-formats">
            {FORMATS.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`export-format ${item.className} ${
                    format === item.id ? 'is-selected' : ''
                  }`}
                  onClick={() => setFormat(item.id)}
                >
                  <Icon size={20} />
                  <strong>{item.label}</strong>
                  <small>{item.description}</small>
                </button>
              );
            })}
          </div>
        </section>

        <div className="export-summary">
          <span>
            {rowCount} ligne{rowCount > 1 ? 's' : ''} sera
            {rowCount > 1 ? 'ont' : ''} exportée{rowCount > 1 ? 's' : ''}
          </span>
          <span className="export-summary-dot" />
          <span>
            Format <strong>{FORMATS.find((f) => f.id === format)?.label}</strong>
          </span>
        </div>

        <div className="export-actions">
          <button type="button" className="btn-ghost" onClick={onClose}>
            Annuler
          </button>
          <button
            type="button"
            className="btn-export-primary"
            onClick={handleExport}
            disabled={busy}
          >
            {busy ? 'Génération...' : 'Télécharger'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
