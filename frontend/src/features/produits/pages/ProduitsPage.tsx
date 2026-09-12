import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { produits, categories, unites } from '@/data/mockData';
import { formatCurrency } from '@/utils/formatters';
import type { Produit, Categorie, Unite } from '@/types';

export function ProduitsPage() {
  const columns: Column<Produit>[] = [
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
    { key: 'code_barres', label: 'Code-barres' },
    {
      key: 'prix_achat',
      label: 'Prix d’achat',
      render: (row) => formatCurrency(row.prix_achat),
    },
    {
      key: 'prix_vente',
      label: 'Prix de vente',
      render: (row) => formatCurrency(row.prix_vente),
    },
    { key: 'stock_minimum', label: 'Stock min.' },
    {
      key: 'actif',
      label: 'Actif',
      render: (row) => (
        <span className={`badge ${row.actif ? 'badge-active' : 'badge-inactive'}`}>
          {row.actif ? 'Oui' : 'Non'}
        </span>
      ),
    },
  ];

  const categorieColumns: Column<Categorie>[] = [
    { key: 'id', label: '#' },
    { key: 'nom', label: 'Nom' },
    { key: 'description', label: 'Description' },
    {
      key: 'actif',
      label: 'Actif',
      render: (row) => (
        <span className={`badge ${row.actif ? 'badge-active' : 'badge-inactive'}`}>
          {row.actif ? 'Oui' : 'Non'}
        </span>
      ),
    },
  ];

  const uniteColumns: Column<Unite>[] = [
    { key: 'id', label: '#' },
    { key: 'nom', label: 'Nom' },
    { key: 'abreviation', label: 'Abréviation' },
    {
      key: 'actif',
      label: 'Actif',
      render: (row) => (
        <span className={`badge ${row.actif ? 'badge-active' : 'badge-inactive'}`}>
          {row.actif ? 'Oui' : 'Non'}
        </span>
      ),
    },
  ];

  return (
    <div className="page-container">
      <PageHeader
        title="Produits"
        subtitle={`${produits.length} produit(s) enregistré(s)`}
      />

      <SectionCard title="Liste des produits">
        <DataTable
          data={produits}
          columns={columns}
          emptyMessage="Aucun produit enregistré."
        />
      </SectionCard>

      <div className="two-col-grid">
        <SectionCard title="Catégories" subtitle={`${categories.length} catégorie(s)`}>
          <DataTable
            data={categories}
            columns={categorieColumns}
            emptyMessage="Aucune catégorie."
          />
        </SectionCard>

        <SectionCard title="Unités" subtitle={`${unites.length} unité(s)`}>
          <DataTable
            data={unites}
            columns={uniteColumns}
            emptyMessage="Aucune unité."
          />
        </SectionCard>
      </div>
    </div>
  );
}
