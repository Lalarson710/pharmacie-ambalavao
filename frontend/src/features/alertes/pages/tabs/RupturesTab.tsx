import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import type { AlerteRupture } from '@/types';

interface RupturesTabProps {
  data: AlerteRupture[];
  search: string;
}

export function RupturesTab({ data, search }: RupturesTabProps) {
  const filteredRuptures = search
    ? data.filter((row) =>
        row.nom.toLowerCase().includes(search.toLowerCase())
      )
    : data;

  const columns: Column<AlerteRupture>[] = [
    { key: 'id', label: '#' },
    { key: 'nom', label: 'Produit' },
    {
      key: 'quantite',
      label: 'Qté en stock',
      render: (row) =>
        row.lots.reduce((sum, lot) => sum + lot.quantite, 0),
    },
  ];

  return (
    <SectionCard title="Ruptures de stock" subtitle={`${data.length} alerte(s)`}>
      <DataTable
        data={filteredRuptures}
        columns={columns}
        emptyMessage="Aucune rupture de stock."
      />
    </SectionCard>
  );
}
