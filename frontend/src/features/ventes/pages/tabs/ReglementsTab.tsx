import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { RowActions } from '@/components/RowActions';
import { formatCurrency, formatDateTime } from '@/utils/formatters';
import type { Reglement } from '@/types';

interface ReglementsTabProps {
  data: Reglement[];
  search: string;
  onOpenEdit: (item: Reglement) => void;
  onDelete: (item: Reglement) => void;
}

export function ReglementsTab({ data, search, onOpenEdit, onDelete }: ReglementsTabProps) {
  const filteredReglements = search
    ? data.filter((row) =>
        [row.facture?.numero, row.mode, row.reference ?? '', String(row.montant)]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(search.toLowerCase()))
      )
    : data;

  const columns: Column<Reglement>[] = [
    { key: 'id', label: '#' },
    {
      key: 'date_reglement',
      label: 'Date',
      render: (row) => formatDateTime(row.date_reglement),
    },
    {
      key: 'facture',
      label: 'Facture',
      render: (row) => row.facture?.numero ?? '—',
    },
    {
      key: 'montant',
      label: 'Montant',
      render: (row) => formatCurrency(row.montant),
    },
    { key: 'mode', label: 'Mode' },
    { key: 'reference', label: 'Référence' },
  ];

  return (
    <SectionCard title="Liste des règlements">
      <DataTable
        data={filteredReglements}
        columns={columns}
        emptyMessage="Aucun règlement."
        actionsHeaderLabel="Actions"
        actions={(row) => (
          <RowActions
            onEdit={() => onOpenEdit(row)}
            onDelete={() => onDelete(row)}
          />
        )}
      />
    </SectionCard>
  );
}
