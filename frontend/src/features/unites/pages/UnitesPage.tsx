import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { unites } from '@/data/mockData';
import type { Unite } from '@/types';

export function UnitesPage() {
  const columns: Column<Unite>[] = [
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
        title="Unités"
        subtitle={`${unites.length} unité(s) enregistrée(s)`}
      />

      <SectionCard title="Liste des unités">
        <DataTable
          data={unites}
          columns={columns}
          emptyMessage="Aucune unité enregistrée."
        />
      </SectionCard>
    </div>
  );
}