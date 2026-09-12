import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { rapports } from '@/data/mockData';
import { formatCurrency, formatDate } from '@/utils/formatters';
import type { Rapport } from '@/types';

export function RapportsPage() {
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

  return (
    <div className="page-container">
      <PageHeader
        title="Rapports"
        subtitle={`${rapports.length} rapport(s) enregistré(s)`}
      />

      <SectionCard title="Liste des rapports">
        <DataTable
          data={rapports}
          columns={columns}
          emptyMessage="Aucun rapport enregistré."
        />
      </SectionCard>
    </div>
  );
}
