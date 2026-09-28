import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { RowActions } from '@/components/RowActions';
import { CheckCircle, Eye, Printer, XCircle } from 'lucide-react';
import { formatCurrency, formatDate, getStatutBadgeClass, formatStatut } from '@/utils/formatters';
import type { Vente } from '@/types';
import { useAuth } from '@/features/auth/store/authStore';

interface VentesTabProps {
  data: Vente[];
  search: string;
  loading?: boolean;
  onOpenEdit?: (item: Vente) => void;
  onDelete?: (item: Vente) => void;
  onConfirm?: (item: Vente) => void;
  onAnnuler?: (item: Vente) => void;
  onPrint: (item: Vente) => void;
  onPreview: (item: Vente) => void;
}

export function VentesTab({
  data,
  search,
  loading,
  onOpenEdit,
  onDelete,
  onConfirm,
  onAnnuler,
  onPrint,
  onPreview,
}: VentesTabProps) {
  const { user } = useAuth();
  const canPrintVente = user?.permissions?.some((p) => p.code === 'vente.print' && p.pivot?.autorise === true) ?? false;

  const hasEdit = typeof onOpenEdit === 'function';
  const hasDelete = typeof onDelete === 'function';
  const hasConfirm = typeof onConfirm === 'function';
  const hasAnnuler = typeof onAnnuler === 'function';

  const filteredVentes = search
    ? data.filter((row) =>
        [row.numero, row.client?.nom, row.statut, row.observation ?? '']
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(search.toLowerCase()))
      )
    : data;

  const columns: Column<Vente>[] = [
    { key: 'id', label: '#' },
    { key: 'numero', label: 'N°' },
    {
      key: 'date_vente',
      label: 'Date',
      render: (row) => formatDate(row.date_vente),
    },
    {
      key: 'client',
      label: 'Client',
      render: (row) => row.client?.nom ?? 'Client de passage',
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

  const renderActions = (row: Vente) => {
    if (row.statut === 'annulee') {
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
          {canPrintVente && (
            <button
              type="button"
              className="icon-button print"
              onClick={() => onPrint(row)}
              title="Imprimer"
              aria-label="Imprimer"
            >
              <Printer size={14} />
            </button>
          )}
        </RowActions>
      );
    }

    if (row.statut === 'confirmee') {
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
          {canPrintVente && (
            <button
              type="button"
              className="icon-button print"
              onClick={() => onPrint(row)}
              title="Imprimer"
              aria-label="Imprimer"
            >
              <Printer size={14} />
            </button>
          )}
          {hasAnnuler && (
            <button
              type="button"
              className="icon-button warning"
              onClick={() => onAnnuler!(row)}
              title="Annuler la vente"
              aria-label="Annuler la vente"
            >
              <XCircle size={14} />
            </button>
          )}
        </RowActions>
      );
    }

    // statut === 'brouillon'
    return (
      <RowActions
        onEdit={hasEdit ? () => onOpenEdit!(row) : undefined}
        onDelete={hasDelete ? () => onDelete!(row) : undefined}
      >
        <button
          type="button"
          className="icon-button info"
          onClick={() => onPreview(row)}
          title="Voir les détails"
          aria-label="Voir les détails"
        >
          <Eye size={14} />
        </button>
        {hasConfirm && (
          <button
            type="button"
            className="icon-button success"
            onClick={() => onConfirm!(row)}
            title="Confirmer la vente"
            aria-label="Confirmer la vente"
          >
            <CheckCircle size={14} />
          </button>
        )}
        {hasAnnuler && (
          <button
            type="button"
            className="icon-button warning"
            onClick={() => onAnnuler!(row)}
            title="Annuler la vente"
            aria-label="Annuler la vente"
          >
            <XCircle size={14} />
          </button>
        )}
      </RowActions>
    );
  };

  return (
    <SectionCard title="Liste des ventes">
      <DataTable
        data={loading ? [] : filteredVentes}
        columns={columns}
        emptyMessage={loading ? 'Chargement des ventes...' : 'Aucune vente enregistrée.'}
        actionsHeaderLabel={hasEdit || hasDelete || hasConfirm || hasAnnuler ? 'Actions' : undefined}
        actions={renderActions}
      />
    </SectionCard>
  );
}
