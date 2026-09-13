import { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { PageTabs } from '@/components/PageTabs';
import { lots, produits, mouvementsStock } from '@/data/mockData';
import { formatCurrency, formatDate } from '@/utils/formatters';
import type { Lot, Produit, MouvementStock } from '@/types';

const stockTabs = [
  { id: 'stock-produit', label: 'Stock par produit' },
  { id: 'lots', label: 'Lots' },
  { id: 'entrees', label: 'Entrées' },
  { id: 'sorties', label: 'Sorties' },
  { id: 'mouvements', label: 'Mouvements' },
  { id: 'inventaires', label: 'Inventaires' },
];

export function StockPage() {
  const [activeTab, setActiveTab] = useState('stock-produit');

  const stockParProduit = produits.map((p) => {
    const lotsProduit = lots.filter((l) => l.produit_id === p.id);
    const quantiteTotale = lotsProduit.reduce((sum, l) => sum + l.quantite, 0);
    return { ...p, quantite_totale: quantiteTotale };
  });

  const stockColumns: Column<Produit & { quantite_totale: number }>[] = [
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

  const mouvementColumns: Column<MouvementStock>[] = [
    { key: 'id', label: '#' },
    {
      key: 'lot',
      label: 'Produit',
      render: (row) => row.lot?.produit?.nom ?? '—',
    },
    { key: 'type', label: 'Type' },
    { key: 'quantite', label: 'Quantité' },
    { key: 'motif', label: 'Motif' },
    { key: 'created_at', label: 'Date', render: (row) => formatDate(row.created_at) },
  ];

  const entrees = mouvementsStock.filter((m) => m.type === 'entree');
  const sorties = mouvementsStock.filter((m) => m.type === 'sortie');

  return (
    <div className="page-container">
      <PageHeader
        title="Gestion du stock"
        subtitle="Vue d’ensemble des quantités, lots et mouvements"
      />

      <PageTabs
        tabs={stockTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'stock-produit' && (
        <SectionCard title="Stock par produit">
          <DataTable
            data={stockParProduit}
            columns={stockColumns}
            emptyMessage="Aucun produit en stock."
          />
        </SectionCard>
      )}

      {activeTab === 'lots' && (
        <SectionCard title="Lots">
          <DataTable
            data={lots}
            columns={lotColumns}
            emptyMessage="Aucun lot enregistré."
          />
        </SectionCard>
      )}

      {activeTab === 'entrees' && (
        <SectionCard title="Entrées de stock">
          <DataTable
            data={entrees}
            columns={mouvementColumns}
            emptyMessage="Aucune entrée enregistrée."
          />
        </SectionCard>
      )}

      {activeTab === 'sorties' && (
        <SectionCard title="Sorties de stock">
          <DataTable
            data={sorties}
            columns={mouvementColumns}
            emptyMessage="Aucune sortie enregistrée."
          />
        </SectionCard>
      )}

      {activeTab === 'mouvements' && (
        <SectionCard title="Historique des mouvements">
          <DataTable
            data={mouvementsStock}
            columns={mouvementColumns}
            emptyMessage="Aucun mouvement enregistré."
          />
        </SectionCard>
      )}

      {activeTab === 'inventaires' && (
        <SectionCard title="Inventaires">
          <p className="empty-cell">Aucun inventaire enregistré.</p>
        </SectionCard>
      )}
    </div>
  );
}
