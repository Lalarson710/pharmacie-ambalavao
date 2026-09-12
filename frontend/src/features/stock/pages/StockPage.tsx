import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { lots, produits } from '@/data/mockData';
import { formatCurrency, formatDate } from '@/utils/formatters';
import type { Lot, Produit } from '@/types';

export function StockPage() {
  // Calcul du stock total par produit (somme des quantités des lots)
  const stockParProduit = produits.map((p) => {
    const lotsProduit = lots.filter((l) => l.produit_id === p.id);
    const quantiteTotale = lotsProduit.reduce((sum, l) => sum + l.quantite, 0);
    return { ...p, quantite_totale: quantiteTotale };
  });

  const stockColumns: Column<Produit & { quantite_totale: number }>[] = [
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
        formatCurrency(Number(row.prix_achat) * row.quantite_totale),
    },
  ];

  const lotColumns: Column<Lot>[] = [
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
    <div className="page-container">
      <PageHeader
        title="Gestion du stock"
        subtitle="Vue d’ensemble des quantités et lots en stock"
      />

      <SectionCard title="Stock par produit">
        <DataTable
          data={stockParProduit}
          columns={stockColumns}
          emptyMessage="Aucun produit en stock."
        />
      </SectionCard>

      <SectionCard title="Détails des lots">
        <DataTable
          data={lots}
          columns={lotColumns}
          emptyMessage="Aucun lot enregistré."
        />
      </SectionCard>
    </div>
  );
}
