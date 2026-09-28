import { DataTable, type Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { RowActions } from '@/components/RowActions';
import { formatDate } from '@/utils/formatters';
import type { MouvementStock } from '@/types';

interface SortiesTabProps {
  data: MouvementStock[];
  search: string;
  loading?: boolean;
  onOpenEdit?: (item: MouvementStock) => void;
  onDelete?: (item: MouvementStock) => void;
}

export function SortiesTab({
  data,
  search,
  loading = false,
  onOpenEdit,
  onDelete,
}: SortiesTabProps) {
  const hasEdit = typeof onOpenEdit === 'function';
  const hasDelete = typeof onDelete === 'function';

  const filteredSorties = search
    ? data.filter((row) =>
        [
          row.lot?.produit?.nom ?? '',
          row.lot?.numero_lot ?? '',
          row.motif ?? '',
          String(row.quantite),
        ].some((value) =>
          value.toLowerCase().includes(search.toLowerCase()),
        ),
      )
    : data;

  const columns: Column<MouvementStock>[] = [
    { key: 'id', label: '#' },
    {
      key: 'produit',
      label: 'Produit',
      render: (row) => row.lot?.produit?.nom ?? '—',
    },
    {
      key: 'lot',
      label: 'N° lot',
      render: (row) => row.lot?.numero_lot ?? '—',
    },
    { key: 'quantite', label: 'Quantité sortie' },
    { key: 'motif', label: 'Motif', render: (row) => row.motif ?? '—' },
    {
      key: 'created_at',
      label: 'Date',
      render: (row) => formatDate(row.created_at ?? ''),
    },
  ];

  return (
    <SectionCard title="Sorties de stock">
      <DataTable
        data={loading ? [] : filteredSorties}
        columns={columns}
        emptyMessage={
          loading
            ? 'Chargement des sorties...'
            : 'Aucune sortie enregistrée.'
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
