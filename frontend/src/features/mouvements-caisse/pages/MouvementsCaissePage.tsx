import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { mouvementsCaisse } from '@/data/mockData';
import { formatCurrency, formatDateTime, getStatutBadgeClass, formatStatut } from '@/utils/formatters';
import type { MouvementCaisse } from '@/types';

export function MouvementsCaissePage() {
  const columns: Column<MouvementCaisse>[] = [
    { key: 'id', label: '#' },
    {
      key: 'caisse',
      label: 'Caisse',
      render: (row) => `#${row.caisse_id}`,
    },
    {
      key: 'type',
      label: 'Type',
      render: (row) => (
        <span className={`badge ${row.type === 'entree' ? 'badge-active' : 'badge-inactive'}`}>
          {row.type === 'entree' ? 'Entrée' : 'Sortie'}
        </span>
      ),
    },
    {
      key: 'montant',
      label: 'Montant',
      render: (row) => formatCurrency(row.montant),
    },
    { key: 'motif', label: 'Motif' },
    {
      key: 'reglement',
      label: 'Règlement',
      render: (row) => row.reglement?.reference ?? '—',
    },
    {
      key: 'created_at',
      label: 'Date',
      render: (row) => formatDateTime(row.created_at ?? ''),
    },
  ];

  return (
    <div className="page-container">
      <PageHeader
        title="Mouvements de caisse"
        subtitle={`${mouvementsCaisse.length} mouvement(s)`}
      />

      <SectionCard title="Liste des mouvements de caisse">
        <DataTable
          data={mouvementsCaisse}
          columns={columns}
          emptyMessage="Aucun mouvement de caisse."
        />
      </SectionCard>
    </div>
  );
}