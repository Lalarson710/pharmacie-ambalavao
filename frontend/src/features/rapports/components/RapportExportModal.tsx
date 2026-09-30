import { useState } from 'react';
import { FileSpreadsheet, FileText, Table2 } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { useToast } from '@/components/Toast';
import { formatDateLongue } from '@/features/statistiques/utils/exportStatistiques';
import type { RapportCalcule } from '../utils/calculRapport';
import {
  exporterRapport,
  type ExportFormat,
} from '../utils/exportRapportCalcule';

interface RapportExportModalProps {
  open: boolean;
  onClose: () => void;
  rapport: RapportCalcule | null;
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
    description: 'Rapport mis en page, prêt à imprimer',
    icon: FileText,
    className: 'is-pdf',
  },
  {
    id: 'xlsx',
    label: 'Excel',
    description: 'Synthèse + détail, optimisé pour Excel',
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

export function RapportExportModal({ open, onClose, rapport }: RapportExportModalProps) {
  const { showToast } = useToast();
  const [format, setFormat] = useState<ExportFormat>('pdf');
  const [busy, setBusy] = useState(false);

  function handleExport() {
    if (!rapport) {
      showToast('Aucun rapport à exporter.', 'error');
      return;
    }

    setBusy(true);
    const ok = exporterRapport(format, rapport);
    setBusy(false);

    if (ok) {
      showToast('Export téléchargé avec succès.', 'success');
      onClose();
    } else {
      showToast('Impossible de générer le fichier.', 'error');
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Exporter le rapport" size="md">
      <div className="export-modal">
        <div className="export-modal-intro">
          <span className="export-period-label">Rapport à exporter</span>
          <span className="export-period-value">
            <strong>{rapport?.titre ?? '—'}</strong>
          </span>
          <span className="export-period-sep" aria-hidden="true" />
          <span className="export-period-value">
            Du <strong>{formatDateLongue(rapport?.dateDebut ?? '')}</strong>
          </span>
          <span className="export-period-value">
            Au <strong>{formatDateLongue(rapport?.dateFin ?? '')}</strong>
          </span>
        </div>

        <section className="export-section">
          <h4>Contenu du fichier</h4>
          <div className="export-datasets">
            <div className="export-dataset is-selected">
              <span className="export-dataset-label">Synthèse du rapport</span>
              <span className="export-dataset-hint">
                {rapport?.kpis.length ?? 0} indicateur(s) calculé(s)
              </span>
            </div>
            <div className="export-dataset is-selected">
              <span className="export-dataset-label">Détail des lignes</span>
              <span className="export-dataset-hint">
                {rapport?.rows.length ?? 0} ligne(s)
              </span>
            </div>
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
            {rapport?.rows.length ?? 0} ligne{rapport && rapport.rows.length > 1 ? 's' : ''} sera
            {rapport && rapport.rows.length > 1 ? 'ont' : ''} exportée
            {rapport && rapport.rows.length > 1 ? 's' : ''}
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
            disabled={busy || !rapport}
          >
            {busy ? 'Génération...' : 'Télécharger'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
