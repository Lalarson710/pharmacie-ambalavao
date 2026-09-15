import { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { PageToolbar } from '@/components/PageToolbar';
import { RowActions } from '@/components/RowActions';
import { factures, reglements } from '@/data/mockData';
import { formatCurrency, formatDate, getStatutBadgeClass, formatStatut } from '@/utils/formatters';
import type { Facture, Reglement } from '@/types';

export function FacturesPage() {
  const [search, setSearch] = useState('');

  const filtered = search
    ? factures.filter(
        (r) =>
          r.numero.toLowerCase().includes(search.toLowerCase()) ||
          (r.vente?.client?.nom ?? '').toLowerCase().includes(search.toLowerCase()) ||
          r.statut.toLowerCase().includes(search.toLowerCase())
      )
    : factures;

  const columns: Column<Facture>[] = [
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
      key: 'client',
      label: 'Client',
      render: (row) => row.vente?.client?.nom ?? '—',
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
    {
      key: 'date_reglement',
      label: 'Date',
      render: (row) => formatDate(row.date_reglement),
    },
    { key: 'reference', label: 'Référence' },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="page-container">
      <PageHeader
        title="Factures"
        subtitle={`${factures.length} facture(s) enregistrée(s)`}
      />

      <PageToolbar
        search={search}
        onSearch={setSearch}
        placeholder="Rechercher une facture..."
      />

      <SectionCard title="Liste des factures">
        <DataTable
          data={filtered}
          columns={columns}
          emptyMessage="Aucune facture enregistrée."
          actionsHeaderLabel="Actions"
          actions={() => <RowActions onPrint={handlePrint} />}
        />
      </SectionCard>

      <SectionCard title="Règlements" subtitle={`${reglements.length} règlement(s)`}>
        <DataTable
          data={reglements}
          columns={reglementColumns}
          emptyMessage="Aucun règlement."
        />
      </SectionCard>
    </div>
  );
}
