import { DataTable, type Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { formatCurrency } from '@/utils/formatters';
import type { Produit } from '@/types';

type StockProduit = Produit & {
  quantite_totale: number;
};

interface StockProduitTabProps {
  data: StockProduit[];
  search: string;
  loading?: boolean;
}

export function StockProduitTab({
  data,
  search,
  loading = false,
}: StockProduitTabProps) {
  const filteredStock = search
    ? data.filter((row) =>
        [
          row.nom,
          row.categorie?.nom ?? '',
          row.unite?.abreviation ?? '',
        ].some((value) =>
          value.toLowerCase().includes(search.toLowerCase()),
        ),
      )
    : data;

  const columns: Column<StockProduit>[] = [
    { key: 'id', label: '#' },
    { key: 'nom', label: 'Produit' },
    {
      key: 'categorie',
      label: 'Catégorie',
      render: (row) => row.categorie?.nom ?? '—',
    },
    {
      key: 'unite',
      label: 'Unité',
      render: (row) => row.unite?.abreviation ?? '—',
    },
    {
      key: 'quantite_totale',
      label: 'Qté en stock',
      render: (row) => row.quantite_totale,
    },
    {
      key: 'stock_minimum',
      label: 'Stock min.',
      render: (row) => row.stock_minimum,
    },
    {
      key: 'valeur_stock',
      label: 'Valeur stock',
      render: (row) =>
        formatCurrency(
          Number(row.prix_achat) * row.quantite_totale,
        ),
    },
  ];

  return (
    <SectionCard title="Stock par produit">
      <DataTable
        data={loading ? [] : filteredStock}
        columns={columns}
        emptyMessage={
          loading
            ? 'Chargement du stock par produit...'
            : 'Aucun produit en stock.'
        }
      />
    </SectionCard>
  );
}
