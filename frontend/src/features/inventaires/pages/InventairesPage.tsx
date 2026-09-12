import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { inventaires } from '@/data/mockData';
import { formatDate } from '@/utils/formatters';
import type { Inventaire, InventaireLigne } from '@/types';

export function InventairesPage() {
  const columns: Column<Inventaire>[] = [
    { key: 'id', label: '#' },
    {
      key: 'date_inventaire',
      label: 'Date',
      render: (row) => formatDate(row.date_inventaire),
    },
    { key: 'motif', label: 'Motif' },
    {
      key: 'lignes_count',
      label: 'Lignes',
      render: (row) => row.lignes?.length ?? 0,
    },
  ];

  const ligneColumns: Column<InventaireLigne>[] = [
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
    { key: 'quantite_theorique', label: 'Qté théorique' },
    { key: 'quantite_reelle', label: 'Qté réelle' },
    {
      key: 'ecart',
      label: 'Écart',
      render: (row) => (
        <span className={row.ecart < 0 ? 'text-red' : row.ecart > 0 ? 'text-green' : ''}>
          {row.ecart > 0 ? `+${row.ecart}` : row.ecart}
        </span>
      ),
    },
  ];

  return (
    <div className="page-container">
      <PageHeader
        title="Inventaires"
        subtitle={`${inventaires.length} inventaire(s) enregistré(s)`}
      />

      <SectionCard title="Liste des inventaires">
        <DataTable
          data={inventaires}
          columns={columns}
          emptyMessage="Aucun inventaire enregistré."
        />
      </SectionCard>

      {inventaires.map((inv) => (
        <SectionCard
          key={inv.id}
          title={`Inventaire #${inv.id} — ${formatDate(inv.date_inventaire)}`}
          subtitle={inv.motif ?? 'Sans motif'}
        >
          <DataTable
            data={inv.lignes ?? []}
            columns={ligneColumns}
            emptyMessage="Aucune ligne d’inventaire."
          />
        </SectionCard>
      ))}
    </div>
  );
}
