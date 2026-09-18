import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { formatDate } from '@/utils/formatters';
import type { Lot } from '@/types';

interface LotsTabProps {
  data: Lot[];
  search: string;
}

export function LotsTab({ data, search }: LotsTabProps) {
  const filteredLots = search
    ? data.filter((row) =>
        [row.produit?.nom, row.numero_lot]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(search.toLowerCase()))
      )
    : data;

  const columns: Column<Lot>[] = [
    { key: 'id', label: '#' },
    {
      key: 'produit',
      label: 'Produit',
      render: (row) => row.produit?.nom ?? '—',
    },
    { key: 'numero_lot', label: 'N° de lot' },
    {
      key: 'date_peremption',
      label: 'Date de péremption',
      render: (row) => formatDate(row.date_peremption),
    },
    { key: 'quantite', label: 'Quantité' },
  ];

  return (
    <SectionCard title="Lots">
      <DataTable
        data={filteredLots}
        columns={columns}
        emptyMessage="Aucun lot enregistré."
      />
    </SectionCard>
  );
}
