import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { RowActions } from '@/components/RowActions';
import { formatDate } from '@/utils/formatters';
import type { MouvementStock } from '@/types';

interface SortiesTabProps {
  data: MouvementStock[];
  search: string;
  onOpenEdit: (item: MouvementStock) => void;
  onDelete: (item: MouvementStock) => void;
}

export function SortiesTab({ data, search, onOpenEdit, onDelete }: SortiesTabProps) {
  const filteredSorties = search
    ? data.filter((row) =>
        [row.lot?.produit?.nom, row.motif ?? '', String(row.quantite)]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(search.toLowerCase()))
      )
    : data.filter((row) => row.type === 'sortie');

  const columns: Column<MouvementStock>[] = [
    { key: 'id', label: '#' },
    {
      key: 'lot',
      label: 'Produit',
      render: (row) => row.lot?.produit?.nom ?? '—',
    },
    { key: 'type', label: 'Type' },
    { key: 'quantite', label: 'Quantité' },
    { key: 'motif', label: 'Motif' },
    { key: 'created_at', label: 'Date', render: (row) => formatDate(row.created_at ?? '') },
  ];

  return (
    <SectionCard title="Sorties de stock">
      <DataTable
        data={filteredSorties}
        columns={columns}
        emptyMessage="Aucune sortie enregistrée."
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
