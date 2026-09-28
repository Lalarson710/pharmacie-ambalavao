import { DataTable, type Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { RowActions } from '@/components/RowActions';
import { formatDate } from '@/utils/formatters';
import type { Inventaire } from '@/types';

interface InventairesTabProps {
  data: Inventaire[];
  search: string;
  loading?: boolean;
  onOpenEdit?: (item: Inventaire) => void;
  onDelete?: (item: Inventaire) => void;
}

export function InventairesTab({
  data,
  search,
  loading = false,
  onOpenEdit,
  onDelete,
}: InventairesTabProps) {
  const hasEdit = typeof onOpenEdit === 'function';
  const hasDelete = typeof onDelete === 'function';

  const filteredInventaires = search
    ? data.filter((row) =>
        [
          row.date_inventaire,
          row.motif ?? '',
          ...(row.lignes?.map(
            (line) => line.lot?.produit?.nom ?? '',
          ) ?? []),
        ].some((value) =>
          value.toLowerCase().includes(search.toLowerCase()),
        ),
      )
    : data;

  const columns: Column<Inventaire>[] = [
    { key: 'id', label: '#' },
    {
      key: 'date_inventaire',
      label: 'Date',
      render: (row) => formatDate(row.date_inventaire),
    },
    {
      key: 'motif',
      label: 'Motif',
      render: (row) => row.motif ?? '—',
    },
    {
      key: 'lignes',
      label: 'Nombre de lots',
      render: (row) => row.lignes?.length ?? 0,
    },
    {
      key: 'ecarts',
      label: 'Lots avec écart',
      render: (row) =>
        row.lignes?.filter(
          (line) => Number(line.ecart) !== 0,
        ).length ?? 0,
    },
  ];

  return (
    <SectionCard title="Inventaires">
      <DataTable
        data={loading ? [] : filteredInventaires}
        columns={columns}
        emptyMessage={
          loading
            ? 'Chargement des inventaires...'
            : 'Aucun inventaire enregistré.'
        }
        actionsHeaderLabel={hasEdit || hasDelete ? 'Actions' : undefined}
        actions={(hasEdit || hasDelete) ? (row) => (
          <RowActions
            onEdit={hasEdit ? () => onOpenEdit!(row) : undefined}
            onDelete={hasDelete ? () => onDelete!(row) : undefined}
          />
        ) : undefined}
      />
    </SectionCard>
  );
}
