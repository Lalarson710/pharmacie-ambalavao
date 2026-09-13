import { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { PageTabs } from '@/components/PageTabs';
import { EntityActions } from '@/components/EntityActions';
import { produits, categories, unites, lots } from '@/data/mockData';
import { formatCurrency, formatDate } from '@/utils/formatters';
import type { Produit, Categorie, Unite, Lot } from '@/types';

const produitsTabs = [
  { id: 'produits', label: 'Produits' },
  { id: 'lots', label: 'Lots' },
  { id: 'categories', label: 'Catégories' },
  { id: 'unites', label: 'Unités' },
];

export function ProduitsPage() {
  const [activeTab, setActiveTab] = useState('produits');
  const [data, setData] = useState<Produit[]>(produits);

  const columns: Column<Produit>[] = [
    { key: 'id', label: '#' },
    { key: 'nom', label: 'Produit' },
    {
      key: 'categories',
      label: 'Categorie',
      render: (row) => row.categorie?.nom ?? '—',
    },
    {
      key: 'unite',
      label: 'Unite',
      render: (row) => row.unite?.abreviation ?? '—',
    },
    { key: 'code_barres', label: 'Code-barres' },
    {
      key: 'prix_achat',
      label: "Prix d'achat",
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

  const categoryColumns: Column<Categorie>[] = [
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
    { key: 'abreviation', label: 'Abreviation' },
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

  const handleEdit = (updated: Produit) => {
    setData((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleDelete = (row: Produit) => {
    setData((prev) => prev.filter((p) => p.id !== row.id));
  };

  const renderEditForm = (
    _row: Produit,
    _onClose: () => void,
    onSubmit: (data: Record<string, unknown>) => void
  ) => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        onSubmit({
          nom: form.nom.value,
          prix_achat: form.prix_achat.value,
          prix_vente: form.prix_vente.value,
          stock_minimum: form.stock_minimum.value,
          actif: form.actif.value === 'true',
        });
      }}
    >
      <label>Nom</label>
      <input name="nom" className="inline-input" />
      <label>Prix d'achat</label>
      <input name="prix_achat" className="inline-input" />
      <label>Prix de vente</label>
      <input name="prix_vente" className="inline-input" />
      <label>Stock min.</label>
      <input name="stock_minimum" className="inline-input" />
      <label>Actif</label>
      <select name="actif" className="inline-input">
        <option value="true">Oui</option>
        <option value="false">Non</option>
      </select>
    </form>
  );

  return (
    <div className="page-container">
      <PageHeader
        title="Produits"
        subtitle={`${data.length} produit(s) enregistre(s)`}
      />

      <PageTabs
        tabs={produitsTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'produits' && (
        <SectionCard title="Liste des produits">
          <DataTable
            data={data}
            columns={columns}
            emptyMessage="Aucun produit enregistre."
            actions={(row) => (
              <EntityActions
                row={row}
                handlers={{ onEdit: handleEdit, onDelete: handleDelete }}
                renderEditForm={renderEditForm}
                editInitial={(r) => ({
                  nom: r.nom,
                  prix_achat: r.prix_achat,
                  prix_vente: r.prix_vente,
                  stock_minimum: String(r.stock_minimum),
                  actif: String(r.actif),
                })}
              />
            )}
          />
        </SectionCard>
      )}

      {activeTab === 'lots' && (
        <SectionCard title="Lots">
          <DataTable
            data={lots}
            columns={lotColumns}
            emptyMessage="Aucun lot enregistre."
          />
        </SectionCard>
      )}

      {activeTab === 'categories' && (
        <SectionCard title="Catégories" subtitle={`${categories.length} catégorie(s)`}>
          <DataTable
            data={categories}
            columns={categoryColumns}
            emptyMessage="Aucune catégorie."
          />
        </SectionCard>
      )}

      {activeTab === 'unites' && (
        <SectionCard title="Unités" subtitle={`${unites.length} unité(s)`}>
          <DataTable
            data={unites}
            columns={uniteColumns}
            emptyMessage="Aucune unité."
          />
        </SectionCard>
      )}
    </div>
  );
}
