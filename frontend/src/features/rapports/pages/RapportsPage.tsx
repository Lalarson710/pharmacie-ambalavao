import { useState } from 'react';
import { Printer } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { PageToolbar } from '@/components/PageToolbar';
import { rapports } from '@/data/mockData';
import { formatCurrency, formatDate } from '@/utils/formatters';
import type { Rapport } from '@/types';

export function RapportsPage() {
  const [search, setSearch] = useState('');

  const filtered = search
    ? rapports.filter(
        (r) =>
          r.type.toLowerCase().includes(search.toLowerCase()) ||
          (r.description ?? '').toLowerCase().includes(search.toLowerCase())
      )
    : rapports;

  const columns: Column<Rapport>[] = [
    { key: 'id', label: '#' },
    { key: 'type', label: 'Type' },
    {
      key: 'date_debut',
      label: 'Date de début',
      render: (row) => formatDate(row.date_debut),
    },
    {
      key: 'date_fin',
      label: 'Date de fin',
      render: (row) => formatDate(row.date_fin),
    },
    {
      key: 'montant_total',
      label: 'Montant total',
      render: (row) => formatCurrency(row.montant_total),
    },
    { key: 'description', label: 'Description' },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="page-container">
      <PageHeader
        title="Rapports"
        subtitle={`${rapports.length} rapport(s) enregistré(s)`}
      />

      <PageToolbar
        search={search}
        onSearch={setSearch}
        placeholder="Rechercher un rapport..."
        actions={
          <button type="button" className="btn-primary" onClick={handlePrint}>
            <Printer size={15} /> Imprimer
          </button>
        }
      />

      <SectionCard title="Liste des rapports">
        <DataTable
          data={filtered}
          columns={columns}
          emptyMessage="Aucun rapport enregistré."
        />
      </SectionCard>
    </div>
  );
}
