import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { RowActions } from '@/components/RowActions';
import { formatDate } from '@/utils/formatters';
import type { Inventaire } from '@/types';

interface InventairesTabProps {
  data: Inventaire[];
  search: string;
  onOpenEdit: (item: Inventaire) => void;
  onDelete: (item: Inventaire) => void;
}

export function InventairesTab({ data, search, onOpenEdit, onDelete }: InventairesTabProps) {
  const filteredInventaires = search
    ? data.filter((row) =>
        [row.date_inventaire, row.motif ?? '', row.lignes?.map((line) => line.lot?.produit?.nom).join(' ')]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(search.toLowerCase()))
      )
    : data;

  const columns: Column<Inventaire>[] = [
    { key: 'id', label: '#' },
    {
      key: 'date_inventaire',
      label: 'Date',
      render: (row) => formatDate(row.date_inventaire),
    },
    { key: 'motif', label: 'Motif' },
    {
      key: 'lignes',
      label: 'Lignes',
      render: (row) => row.lignes?.length ?? 0,
    },
  ];

  return (
    <SectionCard title="Inventaires">
      <DataTable
        data={filteredInventaires}
        columns={columns}
        emptyMessage="Aucun inventaire enregistré."
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
