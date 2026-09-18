import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { RowActions } from '@/components/RowActions';
import { formatCurrency, formatDate, getStatutBadgeClass, formatStatut } from '@/utils/formatters';
import type { Vente } from '@/types';

interface VentesTabProps {
  data: Vente[];
  search: string;
  onOpenEdit: (item: Vente) => void;
  onDelete: (item: Vente) => void;
  onPrint: () => void;
}

export function VentesTab({ data, search, onOpenEdit, onDelete, onPrint }: VentesTabProps) {
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
      render: (row) => row.client?.nom ?? '—',
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
    <SectionCard title="Liste des ventes">
      <DataTable
        data={filteredVentes}
        columns={columns}
        emptyMessage="Aucune vente enregistrée."
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
