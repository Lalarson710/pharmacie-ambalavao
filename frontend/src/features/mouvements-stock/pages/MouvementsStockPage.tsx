import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { mouvementsStock } from '@/data/mockData';
import { formatDateTime } from '@/utils/formatters';
import type { MouvementStock } from '@/types';

export function MouvementsStockPage() {
  const columns: Column<MouvementStock>[] = [
    { key: 'id', label: '#' },
    {
      key: 'lot',
      label: 'Lot',
      render: (row) => row.lot?.numero_lot ?? '—',
    },
    {
      key: 'produit',
      label: 'Produit',
      render: (row) => row.lot?.produit?.nom ?? '—',
    },
    { key: 'type', label: 'Type' },
    { key: 'quantite', label: 'Quantité' },
    { key: 'motif', label: 'Motif' },
    {
      key: 'created_at',
      label: 'Date',
      render: (row) => formatDateTime(row.created_at ?? ''),
    },
  ];

  return (
    <div className="page-container">
      <PageHeader
        title="Mouvements de stock"
        subtitle={`${mouvementsStock.length} mouvement(s) enregistré(s)`}
      />

      <SectionCard title="Historique des mouvements">
        <DataTable
          data={mouvementsStock}
          columns={columns}
          emptyMessage="Aucun mouvement de stock."
        />
      </SectionCard>
    </div>
  );
}
