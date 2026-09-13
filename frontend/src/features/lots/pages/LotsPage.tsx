import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { lots } from '@/data/mockData';
import { formatDate, formatCurrency } from '@/utils/formatters';
import type { Lot } from '@/types';

export function LotsPage() {
  const columns: Column<Lot>[] = [
    { key: 'id', label: '#' },
    {
      key: 'produit',
      label: 'Produit',
      render: (row) => row.produit?.nom ?? '—',
    },
    { key: 'numero_lot', label: 'N° de lot' },
    {
      key: 'date_peremption',
      label: 'Date de péremption',
      render: (row) => formatDate(row.date_peremption),
    },
    { key: 'quantite', label: 'Quantité' },
    {
      key: 'stock_value',
      label: 'Valeur stock',
      render: (row) =>
        row.produit
          ? formatCurrency(
              Number(row.produit.prix_achat) * row.quantite
            )
          : '—',
    },
  ];

  return (
    <div className="page-container">
      <PageHeader
        title="Lots"
        subtitle={`${lots.length} lot(s) enregistré(s)`}
      />

      <SectionCard title="Liste des lots">
        <DataTable
          data={lots}
          columns={columns}
          emptyMessage="Aucun lot enregistré."
        />
      </SectionCard>
    </div>
  );
}
