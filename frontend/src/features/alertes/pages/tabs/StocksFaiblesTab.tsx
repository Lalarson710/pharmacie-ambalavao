import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import type { AlerteStockFaible } from '@/types';

interface StocksFaiblesTabProps {
  data: AlerteStockFaible[];
  search: string;
  loading?: boolean;
}

export function StocksFaiblesTab({ data, search, loading = false }: StocksFaiblesTabProps) {
  const filteredStocks = search
    ? data.filter((row) =>
        row.nom.toLowerCase().includes(search.toLowerCase())
      )
    : data;

  const columns: Column<AlerteStockFaible>[] = [
    { key: 'id', label: '#' },
    { key: 'nom', label: 'Produit' },
    {
      key: 'stock_minimum',
      label: 'Stock min.',
      render: (row) => row.stock_minimum,
    },
    {
      key: 'quantite',
      label: 'Qté en stock',
      render: (row) =>
        row.lots.reduce((sum, lot) => sum + lot.quantite, 0),
    },
  ];

  return (
    <SectionCard title="Stocks faibles" subtitle={loading ? 'Chargement...' : `${data.length} alerte(s)`}>
      <DataTable
        data={loading ? [] : filteredStocks}
        columns={columns}
        emptyMessage={loading ? 'Chargement des alertes...' : 'Aucun stock faible.'}
      />
    </SectionCard>
  );
}
