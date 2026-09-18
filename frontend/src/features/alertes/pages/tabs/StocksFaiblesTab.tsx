import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import type { AlerteStockFaible } from '@/types';

interface StocksFaiblesTabProps {
  data: AlerteStockFaible[];
  search: string;
}

export function StocksFaiblesTab({ data, search }: StocksFaiblesTabProps) {
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
    <SectionCard title="Stocks faibles" subtitle={`${data.length} alerte(s)`}>
      <DataTable
        data={filteredStocks}
        columns={columns}
        emptyMessage="Aucun stock faible."
      />
    </SectionCard>
  );
}
