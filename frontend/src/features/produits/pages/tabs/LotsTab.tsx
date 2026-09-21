import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { RowActions } from '@/components/RowActions';
import { formatDate } from '@/utils/formatters';
import type { Lot } from '@/types';

interface LotsTabProps {
  data: Lot[];
  search: string;
  loading?: boolean;
  onOpenEdit: (item: Lot) => void;
  onDelete: (item: Lot) => void;
}

export function LotsTab({ data, search, loading, onOpenEdit, onDelete }: LotsTabProps) {
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
      {loading ? (
        <div className="empty-state">Chargement des lots...</div>
      ) : (
        <DataTable
          data={filteredLots}
          columns={columns}
          emptyMessage="Aucun lot enregistré."
          actionsHeaderLabel="Actions"
          actions={(row) => (
            <RowActions
              onEdit={() => onOpenEdit(row)}
              onDelete={() => onDelete(row)}
            />
          )}
        />
      )}
    </SectionCard>
  );
}
