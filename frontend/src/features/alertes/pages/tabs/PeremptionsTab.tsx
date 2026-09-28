import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { formatDate } from '@/utils/formatters';
import type { AlertePeremption } from '@/types';

interface PeremptionsTabProps {
  data: AlertePeremption[];
  search: string;
  loading?: boolean;
}

export function PeremptionsTab({ data, search, loading = false }: PeremptionsTabProps) {
  const filteredPeremptions = search
    ? data.filter(
        (row) =>
          (row.produit?.nom ?? '').toLowerCase().includes(search.toLowerCase()) ||
          row.numero_lot.toLowerCase().includes(search.toLowerCase())
      )
    : data;

  const columns: Column<AlertePeremption>[] = [
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
    <SectionCard title="Péremptions proches" subtitle={loading ? 'Chargement...' : `${data.length} alerte(s)`}>
      <DataTable
        data={loading ? [] : filteredPeremptions}
        columns={columns}
        emptyMessage={loading ? 'Chargement des alertes...' : 'Aucune pérémentation proche.'}
      />
    </SectionCard>
  );
}
