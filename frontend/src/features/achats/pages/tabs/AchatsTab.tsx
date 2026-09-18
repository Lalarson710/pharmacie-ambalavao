import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { RowActions } from '@/components/RowActions';
import { formatCurrency, formatDate, getStatutBadgeClass, formatStatut } from '@/utils/formatters';
import type { Achat } from '@/types';

interface AchatsTabProps {
  data: Achat[];
  search: string;
  onOpenEdit: (item: Achat) => void;
  onDelete: (item: Achat) => void;
  onPrint: () => void;
}

export function AchatsTab({ data, search, onOpenEdit, onDelete, onPrint }: AchatsTabProps) {
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

  return (
    <SectionCard title="Liste des achats">
      <DataTable
        data={filteredAchats}
        columns={columns}
        emptyMessage="Aucun achat enregistré."
        actionsHeaderLabel="Actions"
        actions={(row) => (
          <RowActions
            onEdit={() => onOpenEdit(row)}
            onDelete={() => onDelete(row)}
            onPrint={onPrint}
          />
        )}
      />
    </SectionCard>
  );
}
