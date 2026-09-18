import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { formatDate } from '@/utils/formatters';
import type { MouvementStock } from '@/types';

interface MouvementsTabProps {
  data: MouvementStock[];
  search: string;
}

export function MouvementsTab({ data, search }: MouvementsTabProps) {
  const filteredMouvements = search
    ? data.filter((row) =>
        [row.lot?.produit?.nom, row.type, row.motif ?? '', String(row.quantite)]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(search.toLowerCase()))
      )
    : data;

  const columns: Column<MouvementStock>[] = [
    { key: 'id', label: '#' },
    {
      key: 'lot',
      label: 'Produit',
      render: (row) => row.lot?.produit?.nom ?? '—',
    },
    { key: 'type', label: 'Type' },
    { key: 'quantite', label: 'Quantité' },
    { key: 'motif', label: 'Motif' },
    { key: 'created_at', label: 'Date', render: (row) => formatDate(row.created_at ?? '') },
  ];

  return (
    <SectionCard title="Historique des mouvements">
      <DataTable
        data={filteredMouvements}
        columns={columns}
        emptyMessage="Aucun mouvement enregistré."
      />
    </SectionCard>
  );
}
