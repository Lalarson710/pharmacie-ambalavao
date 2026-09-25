import { DataTable, type Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { formatDate } from '@/utils/formatters';
import type { MouvementStock } from '@/types';

interface MouvementsTabProps {
  data: MouvementStock[];
  search: string;
  loading?: boolean;
}

export function MouvementsTab({
  data,
  search,
  loading = false,
}: MouvementsTabProps) {
  const filteredMouvements = search
    ? data.filter((row) =>
        [
          row.lot?.produit?.nom ?? '',
          row.lot?.numero_lot ?? '',
          row.type,
          row.motif ?? '',
          String(row.quantite),
        ].some((value) =>
          value.toLowerCase().includes(search.toLowerCase()),
        ),
      )
    : data;

  const columns: Column<MouvementStock>[] = [
    { key: 'id', label: '#' },
    {
      key: 'produit',
      label: 'Produit',
      render: (row) => row.lot?.produit?.nom ?? '—',
    },
    {
      key: 'lot',
      label: 'N° lot',
      render: (row) => row.lot?.numero_lot ?? '—',
    },
    {
      key: 'type',
      label: 'Type',
      render: (row) => {
        const labels = {
          entree: 'Entrée',
          sortie: 'Sortie',
          ajustement: 'Ajustement',
        };
        return labels[row.type];
      },
    },
    { key: 'quantite', label: 'Quantité' },
    { key: 'motif', label: 'Motif', render: (row) => row.motif ?? '—' },
    {
      key: 'created_at',
      label: 'Date',
      render: (row) => formatDate(row.created_at ?? ''),
    },
  ];

  return (
    <SectionCard title="Historique des mouvements">
      <DataTable
        data={loading ? [] : filteredMouvements}
        columns={columns}
        emptyMessage={
          loading
            ? 'Chargement des mouvements...'
            : 'Aucun mouvement enregistré.'
        }
      />
    </SectionCard>
  );
}
