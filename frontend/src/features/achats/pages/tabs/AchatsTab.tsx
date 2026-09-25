import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { RowActions } from '@/components/RowActions';
import { CheckCircle, Eye, Printer, XCircle } from 'lucide-react';
import { formatCurrency, formatDate, getStatutBadgeClass, formatStatut } from '@/utils/formatters';
import type { Achat } from '@/types';

interface AchatsTabProps {
  data: Achat[];
  search: string;
  loading?: boolean;
  onOpenEdit: (item: Achat) => void;
  onDelete: (item: Achat) => void;
  onConfirm: (item: Achat) => void;
  onAnnuler: (item: Achat) => void;
  onPrint: (item: Achat) => void;
  onPreview: (item: Achat) => void;
}

export function AchatsTab({
  data,
  search,
  loading,
  onOpenEdit,
  onDelete,
  onConfirm,
  onAnnuler,
  onPrint,
  onPreview,
}: AchatsTabProps) {
  const filteredAchats = search
    ? data.filter((row) =>
        [row.numero, row.fournisseur?.nom, row.statut, row.observation ?? '']
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(search.toLowerCase()))
      )
    : data;

  const columns: Column<Achat>[] = [
    { key: 'id', label: '#' },
    { key: 'numero', label: 'N°' },
    {
      key: 'date_achat',
      label: 'Date',
      render: (row) => formatDate(row.date_achat),
    },
    {
      key: 'fournisseur',
      label: 'Fournisseur',
      render: (row) => row.fournisseur?.nom ?? '—',
    },
    {
      key: 'montant_total',
      label: 'Montant',
      render: (row) => formatCurrency(row.montant_total),
    },
    {
      key: 'statut',
      label: 'Statut',
      render: (row) => (
        <span className={`badge ${getStatutBadgeClass(row.statut)}`}>
          {formatStatut(row.statut)}
        </span>
      ),
    },
    { key: 'observation', label: 'Observation' },
  ];

  const renderActions = (row: Achat) => {
    if (row.statut === 'annule') {
      return (
        <RowActions>
          <button
            type="button"
            className="icon-button info"
            onClick={() => onPreview(row)}
            title="Voir les détails"
            aria-label="Voir les détails"
          >
            <Eye size={14} />
          </button>
          <button
            type="button"
            className="icon-button print"
            onClick={() => onPrint(row)}
            title="Imprimer"
            aria-label="Imprimer"
          >
            <Printer size={14} />
          </button>
        </RowActions>
      );
    }

    if (row.statut === 'confirme') {
      return (
        <RowActions>
          <button
            type="button"
            className="icon-button info"
            onClick={() => onPreview(row)}
            title="Voir les détails"
            aria-label="Voir les détails"
          >
            <Eye size={14} />
          </button>
          <button
            type="button"
            className="icon-button print"
            onClick={() => onPrint(row)}
            title="Imprimer"
            aria-label="Imprimer"
          >
            <Printer size={14} />
          </button>
          <button
            type="button"
            className="icon-button warning"
            onClick={() => onAnnuler(row)}
            title="Annuler l'achat"
            aria-label="Annuler l'achat"
          >
            <XCircle size={14} />
          </button>
        </RowActions>
      );
    }

    // statut === 'brouillon'
    return (
      <RowActions
        onEdit={() => onOpenEdit(row)}
        onDelete={() => onDelete(row)}
      >
        <button
          type="button"
          className="icon-button success"
          onClick={() => onConfirm(row)}
          title="Confirmer l'achat"
          aria-label="Confirmer l'achat"
        >
          <CheckCircle size={14} />
        </button>
        <button
          type="button"
          className="icon-button warning"
          onClick={() => onAnnuler(row)}
          title="Annuler l'achat"
          aria-label="Annuler l'achat"
        >
          <XCircle size={14} />
        </button>
      </RowActions>
    );
  };

  return (
    <SectionCard title="Liste des achats">
      <DataTable
        data={loading ? [] : filteredAchats}
        columns={columns}
        emptyMessage={loading ? 'Chargement des achats...' : 'Aucun achat enregistré.'}
        actionsHeaderLabel="Actions"
        actions={renderActions}
      />
    </SectionCard>
  );
}
