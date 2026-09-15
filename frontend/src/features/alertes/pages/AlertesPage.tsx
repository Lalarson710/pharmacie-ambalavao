import { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { PageTabs } from '@/components/PageTabs';
import { PageToolbar } from '@/components/PageToolbar';
import { alertesStockFaible, alertesRupture, alertesPeremption } from '@/data/mockData';
import { formatDate } from '@/utils/formatters';
import type { AlerteStockFaible, AlerteRupture, AlertePeremption } from '@/types';

const alertesTabs = [
  { id: 'stocks-faibles', label: 'Stocks faibles' },
  { id: 'ruptures', label: 'Ruptures de stock' },
  { id: 'peremptions', label: 'Péremptions proches' },
];

export function AlertesPage() {
  const [activeTab, setActiveTab] = useState('stocks-faibles');
  const [search, setSearch] = useState('');

  const stockFaibleColumns: Column<AlerteStockFaible>[] = [
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
        row.lots.reduce((sum, l) => sum + l.quantite, 0),
    },
  ];

  const ruptureColumns: Column<AlerteRupture>[] = [
    { key: 'id', label: '#' },
    { key: 'nom', label: 'Produit' },
    {
      key: 'quantite',
      label: 'Qté en stock',
      render: (row) =>
        row.lots.reduce((sum, l) => sum + l.quantite, 0),
    },
  ];

  const peremptionColumns: Column<AlertePeremption>[] = [
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

  const filteredStocks = search
    ? alertesStockFaible.filter((r) =>
        r.nom.toLowerCase().includes(search.toLowerCase())
      )
    : alertesStockFaible;

  const filteredRuptures = search
    ? alertesRupture.filter((r) =>
        r.nom.toLowerCase().includes(search.toLowerCase())
      )
    : alertesRupture;

  const filteredPeremptions = search
    ? alertesPeremption.filter(
        (r) =>
          (r.produit?.nom ?? '').toLowerCase().includes(search.toLowerCase()) ||
          r.numero_lot.toLowerCase().includes(search.toLowerCase())
      )
    : alertesPeremption;

  return (
    <div className="page-container">
      <PageHeader
        title="Alertes"
        subtitle="Produits nécessitant une attention"
      />

      <PageToolbar
        search={search}
        onSearch={setSearch}
        placeholder="Rechercher dans les alertes..."
      />

      <PageTabs
        tabs={alertesTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'stocks-faibles' && (
        <SectionCard title="Stocks faibles" subtitle={`${alertesStockFaible.length} alerte(s)`}>
          <DataTable
            data={filteredStocks}
            columns={stockFaibleColumns}
            emptyMessage="Aucun stock faible."
          />
        </SectionCard>
      )}

      {activeTab === 'ruptures' && (
        <SectionCard title="Ruptures de stock" subtitle={`${alertesRupture.length} alerte(s)`}>
          <DataTable
            data={filteredRuptures}
            columns={ruptureColumns}
            emptyMessage="Aucune rupture de stock."
          />
        </SectionCard>
      )}

      {activeTab === 'peremptions' && (
        <SectionCard title="Péremptions proches" subtitle={`${alertesPeremption.length} alerte(s)`}>
          <DataTable
            data={filteredPeremptions}
            columns={peremptionColumns}
            emptyMessage="Aucune pérémentation proche."
          />
        </SectionCard>
      )}
    </div>
  );
}
