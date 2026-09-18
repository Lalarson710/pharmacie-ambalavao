import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { formatCurrency, formatDateTime } from '@/utils/formatters';
import type { MouvementCaisse } from '@/types';

interface MouvementsCaisseTabProps {
  data: MouvementCaisse[];
  search: string;
}

export function MouvementsCaisseTab({ data, search }: MouvementsCaisseTabProps) {
  const filteredMouvements = search
    ? data.filter((row) =>
        [
          row.id,
          row.caisse_id,
          row.type,
          row.motif ?? '',
          row.reglement?.reference ?? '',
          row.created_at ?? '',
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(search.toLowerCase())
          )
      )
    : data;

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
        <span
          className={`badge ${
            row.type === 'entree' ? 'badge-active' : 'badge-inactive'
          }`}
        >
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
    <SectionCard
      title="Mouvements de caisse"
      subtitle={`${data.length} mouvement(s)`}
    >
      <DataTable
        data={filteredMouvements}
        columns={columns}
        emptyMessage="Aucun mouvement de caisse."
        actionsHeaderLabel="Actions"
      />
    </SectionCard>
  );
}
