import { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { PageTabs } from '@/components/PageTabs';
import { statistiquesVentes, produitsPlusVendus, chiffreAffaires, ventes } from '@/data/mockData';
import { formatCurrency, formatDate } from '@/utils/formatters';
import type { Vente, ProduitPlusVendu } from '@/types';

const statistiquesTabs = [
  { id: 'resume', label: 'Résumé des ventes' },
  { id: 'ca', label: "Chiffre d'affaires" },
  { id: 'ventes', label: 'Ventes' },
  { id: 'produits', label: 'Produits les plus vendus' },
];

export function StatistiquesPage() {
  const [activeTab, setActiveTab] = useState('resume');

  const venteColumns: Column<Vente>[] = [
    { key: 'id', label: '#' },
    { key: 'numero', label: 'N°' },
    {
      key: 'date_vente',
      label: 'Date',
      render: (row) => formatDate(row.date_vente),
    },
    {
      key: 'client',
      label: 'Client',
      render: (row) => row.client?.nom ?? '—',
    },
    {
      key: 'montant_total',
      label: 'Montant',
      render: (row) => formatCurrency(row.montant_total),
    },
    { key: 'statut', label: 'Statut' },
  ];

  const produitColumns: Column<ProduitPlusVendu>[] = [
    { key: 'id', label: '#' },
    { key: 'nom', label: 'Produit' },
    { key: 'quantite_vendue', label: 'Qté vendue' },
    {
      key: 'chiffre_affaires',
      label: 'CA',
      render: (row) => formatCurrency(row.chiffre_affaires),
    },
  ];

  return (
    <div className="page-container">
      <PageHeader
        title="Statistiques"
        subtitle="Analyse des ventes et du chiffre d’affaires"
      />

      <PageTabs
        tabs={statistiquesTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'resume' && (
        <SectionCard title="Résumé des ventes">
          <div className="stat-mini-group">
            <div className="stat-mini">
              <span className="stat-mini-label">Nombre de ventes</span>
              <span className="stat-mini-value">{statistiquesVentes.nombre_ventes}</span>
            </div>
            <div className="stat-mini">
              <span className="stat-mini-label">Chiffre d’affaires</span>
              <span className="stat-mini-value">{formatCurrency(statistiquesVentes.chiffre_affaires)}</span>
            </div>
          </div>
        </SectionCard>
      )}

      {activeTab === 'ca' && (
        <SectionCard title="Chiffre d’affaires">
          <div className="stat-mini-group">
            <div className="stat-mini">
              <span className="stat-mini-label">Date de début</span>
              <span className="stat-mini-value">{formatDate(chiffreAffaires.date_debut)}</span>
            </div>
            <div className="stat-mini">
              <span className="stat-mini-label">Date de fin</span>
              <span className="stat-mini-value">{formatDate(chiffreAffaires.date_fin)}</span>
            </div>
            <div className="stat-mini">
              <span className="stat-mini-label">Montant total</span>
              <span className="stat-mini-value stat-amount">{formatCurrency(chiffreAffaires.chiffre_affaires)}</span>
            </div>
          </div>
        </SectionCard>
      )}

      {activeTab === 'ventes' && (
        <SectionCard title="Ventes" subtitle={`${statistiquesVentes.ventes.length} vente(s)`}>
          <DataTable
            data={statistiquesVentes.ventes}
            columns={venteColumns}
            emptyMessage="Aucune vente."
          />
        </SectionCard>
      )}

      {activeTab === 'produits' && (
        <SectionCard title="Produits plus vendus" subtitle={`${produitsPlusVendus.length} produit(s)`}>
          <DataTable
            data={produitsPlusVendus}
            columns={produitColumns}
            emptyMessage="Aucun produit vendu."
          />
        </SectionCard>
      )}
    </div>
  );
}
