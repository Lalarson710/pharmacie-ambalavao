import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { alertesStockFaible, alertesRupture, alertesPeremption } from '@/data/mockData';
import { formatDate, formatCurrency } from '@/utils/formatters';
import type { AlerteStockFaible, AlerteRupture, AlertePeremption } from '@/types';

export function AlertesPage() {
  const stockFaibleColumns: Column<AlerteStockFaible>[] = [
    { key: 'id', label: '#' },
    { key: 'nom', label: 'Produit' },
    {
      key: 'stock_minimum',
      label: 'Stock min.',
      render: (row) => row.stock_minimum,
    },
    {
      key: 'quantite',
      label: 'Qté en stock',
      render: (row) =>
        row.lots.reduce((sum, l) => sum + l.quantite, 0),
    },
  ];

  const ruptureColumns: Column<AlerteRupture>[] = [
    { key: 'id', label: '#' },
    { key: 'nom', label: 'Produit' },
    {
      key: 'quantite',
      label: 'Qté en stock',
      render: (row) =>
        row.lots.reduce((sum, l) => sum + l.quantite, 0),
    },
  ];

  const peremptionColumns: Column<AlertePeremption>[] = [
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
  ];

  return (
    <div className="page-container">
      <PageHeader
        title="Alertes"
        subtitle="Produits nécessitant une attention"
      />

      <SectionCard
        title="Stocks faibles"
        subtitle={`${alertesStockFaible.length} alerte(s)`}
      >
        <DataTable
          data={alertesStockFaible}
          columns={stockFaibleColumns}
          emptyMessage="Aucun stock faible."
        />
      </SectionCard>

      <SectionCard
        title="Ruptures de stock"
        subtitle={`${alertesRupture.length} alerte(s)`}
      >
        <DataTable
          data={alertesRupture}
          columns={ruptureColumns}
          emptyMessage="Aucune rupture de stock."
        />
      </SectionCard>

      <SectionCard
        title="Pérémations proches"
        subtitle={`${alertesPeremption.length} alerte(s)`}
      >
        <DataTable
          data={alertesPeremption}
          columns={peremptionColumns}
          emptyMessage="Aucune pérémentation proche."
        />
      </SectionCard>
    </div>
  );
}
