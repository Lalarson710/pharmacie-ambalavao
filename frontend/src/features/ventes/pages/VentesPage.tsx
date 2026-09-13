import { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { PageTabs } from '@/components/PageTabs';
import { ventes, ventesLignes, clients, factures, reglements } from '@/data/mockData';
import { formatCurrency, formatDate, getStatutBadgeClass, formatStatut } from '@/utils/formatters';
import type { Vente, VenteLigne, Facture, Reglement } from '@/types';

const ventesTabs = [
  { id: 'ventes', label: 'Ventes' },
  { id: 'lignes', label: 'Lignes de vente' },
  { id: 'clients', label: 'Clients associés' },
  { id: 'factures', label: 'Factures' },
  { id: 'reglements', label: 'Règlements' },
];

export function VentesPage() {
  const [activeTab, setActiveTab] = useState('ventes');

  const columns: Column<Vente>[] = [
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
    {
      key: 'statut',
      label: 'Statut',
      render: (row) => (
        <span className={`badge ${getStatutBadgeClass(row.statut)}`}>
          {formatStatut(row.statut)}
        </span>
      ),
    },
    { key: 'observation', label: 'Observation' },
  ];

  const ligneColumns: Column<VenteLigne>[] = [
    { key: 'id', label: '#' },
    {
      key: 'produit',
      label: 'Produit',
      render: (row) => row.produit?.nom ?? '—',
    },
    {
      key: 'lot',
      label: 'Lot',
      render: (row) => row.lot?.numero_lot ?? '—',
    },
    { key: 'quantite', label: 'Qté' },
    {
      key: 'prix_unitaire',
      label: 'Prix unitaire',
      render: (row) => formatCurrency(row.prix_unitaire),
    },
    {
      key: 'montant',
      label: 'Montant',
      render: (row) => formatCurrency(row.montant),
    },
  ];

  const factureColumns: Column<Facture>[] = [
    { key: 'id', label: '#' },
    { key: 'numero', label: 'N°' },
    {
      key: 'date_facture',
      label: 'Date',
      render: (row) => formatDate(row.date_facture),
    },
    {
      key: 'vente',
      label: 'Vente',
      render: (row) => row.vente?.numero ?? '—',
    },
    {
      key: 'montant_total',
      label: 'Montant',
      render: (row) => formatCurrency(row.montant_total),
    },
    {
      key: 'statut',
      label: 'Statut',
      render: (row) => (
        <span className={`badge ${getStatutBadgeClass(row.statut)}`}>
          {formatStatut(row.statut)}
        </span>
      ),
    },
  ];

  const reglementColumns: Column<Reglement>[] = [
    { key: 'id', label: '#' },
    {
      key: 'date_reglement',
      label: 'Date',
      render: (row) => formatDate(row.date_reglement),
    },
    {
      key: 'facture',
      label: 'Facture',
      render: (row) => row.facture?.numero ?? '—',
    },
    {
      key: 'montant',
      label: 'Montant',
      render: (row) => formatCurrency(row.montant),
    },
    { key: 'mode', label: 'Mode' },
    { key: 'reference', label: 'Référence' },
  ];

  return (
    <div className="page-container">
      <PageHeader
        title="Ventes"
        subtitle="Gestion des ventes, factures et règlements"
      />

      <PageTabs
        tabs={ventesTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'ventes' && (
        <SectionCard title="Liste des ventes">
          <DataTable
            data={ventes}
            columns={columns}
            emptyMessage="Aucune vente enregistrée."
          />
        </SectionCard>
      )}

      {activeTab === 'lignes' && (
        <SectionCard title="Lignes de vente" subtitle={`${ventesLignes.length} ligne(s)`}>
          <DataTable
            data={ventesLignes}
            columns={ligneColumns}
            emptyMessage="Aucune ligne de vente."
          />
        </SectionCard>
      )}

      {activeTab === 'clients' && (
        <SectionCard title="Clients associés" subtitle={`${clients.length} client(s)`}>
          <DataTable
            data={clients}
            columns={[
              { key: 'id', label: '#' },
              { key: 'nom', label: 'Nom' },
              { key: 'telephone', label: 'Téléphone' },
              { key: 'email', label: 'Email' },
            ]}
            emptyMessage="Aucun client."
          />
        </SectionCard>
      )}

      {activeTab === 'factures' && (
        <SectionCard title="Liste des factures">
          <DataTable
            data={factures}
            columns={factureColumns}
            emptyMessage="Aucune facture."
          />
        </SectionCard>
      )}

      {activeTab === 'reglements' && (
        <SectionCard title="Liste des règlements">
          <DataTable
            data={reglements}
            columns={reglementColumns}
            emptyMessage="Aucun règlement."
          />
        </SectionCard>
      )}
    </div>
  );
}
