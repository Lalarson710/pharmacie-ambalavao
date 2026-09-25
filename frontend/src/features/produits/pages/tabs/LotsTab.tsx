import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { formatDate } from '@/utils/formatters';
import type { Lot } from '@/types';

interface LotsTabProps {
  data: Lot[];
  search: string;
  loading?: boolean;
  onOpenEdit?: (item: Lot) => void;
  onDelete?: (item: Lot) => void;
}

export function LotsTab({ data, search, loading }: LotsTabProps) {
  const filteredLots = search
    ? data.filter((row) =>
        [row.numero_lot, row.produit?.nom]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(search.toLowerCase()))
      )
    : data;

  const columns: Column<Lot>[] = [
    { key: 'id', label: '#' },
    { key: 'produit', label: 'Produit', render: (row) => row.produit?.nom ?? '—' },
    { key: 'numero_lot', label: 'N° de lot' },
    { key: 'date_peremption', label: 'Date de péremption', render: (row) => formatDate(row.date_peremption) },
    { key: 'quantite', label: 'Quantité' },
  ];

  return (
    <SectionCard title="Lots">
      <DataTable
        data={loading ? [] : filteredLots}
        columns={columns}
        emptyMessage={loading ? 'Chargement des lots...' : 'Aucun lot enregistré.'}
      />
    </SectionCard>
  );
}
