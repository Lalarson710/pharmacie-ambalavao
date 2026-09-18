import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { formatCurrency } from '@/utils/formatters';
import type { Produit } from '@/types';

interface StockProduitTabProps {
  data: (Produit & { quantite_totale: number })[];
  search: string;
}

export function StockProduitTab({ data, search }: StockProduitTabProps) {
  const filteredStock = search
    ? data.filter((row) =>
        [row.nom, row.categorie?.nom, row.unite?.abreviation]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(search.toLowerCase()))
      )
    : data;

  const columns: Column<Produit & { quantite_totale: number }>[] = [
    { key: 'id', label: '#' },
    { key: 'nom', label: 'Produit' },
    { key: 'categories', label: 'Catégorie', render: (row) => row.categorie?.nom ?? '—' },
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
      render: (row) => formatCurrency(Number(row.prix_achat) * row.quantite_totale),
    },
  ];

  return (
    <SectionCard title="Stock par produit">
      <DataTable
        data={filteredStock}
        columns={columns}
        emptyMessage="Aucun produit en stock."
      />
    </SectionCard>
  );
}
