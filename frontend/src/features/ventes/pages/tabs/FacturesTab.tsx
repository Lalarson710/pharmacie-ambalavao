import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { RowActions } from '@/components/RowActions';
import { formatCurrency, formatDate, getStatutBadgeClass, formatStatut } from '@/utils/formatters';
import type { Facture } from '@/types';

interface FacturesTabProps {
  data: Facture[];
  search: string;
  onPrint: () => void;
}

export function FacturesTab({ data, search, onPrint }: FacturesTabProps) {
  const filteredFactures = search
    ? data.filter((row) =>
        [row.numero, row.vente?.numero, row.vente?.client?.nom, row.statut]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(search.toLowerCase()))
      )
    : data;

  const columns: Column<Facture>[] = [
    { key: 'id', label: '#' },
    { key: 'numero', label: 'N°' },
    {
      key: 'date_facture',
      label: 'Date',
      render: (row) => formatDate(row.date_facture),
    },
    {
      key: 'vente',
      label: 'Vente',
      render: (row) => row.vente?.numero ?? '—',
    },
    {
      key: 'client',
      label: 'Client',
      render: (row) => row.vente?.client?.nom ?? '—',
    },
    {
      key: 'montant_total',
      label: 'Montant',
      render: (row) => formatCurrency(row.montant_total),
    },
    {
      key: 'statut',
      label: 'Statut',
      render: (row) => (
        <span className={`badge ${getStatutBadgeClass(row.statut)}`}>
          {formatStatut(row.statut)}
        </span>
      ),
    },
  ];

  return (
    <SectionCard title="Liste des factures">
      <DataTable
        data={filteredFactures}
        columns={columns}
        emptyMessage="Aucune facture."
        actionsHeaderLabel="Actions"
        actions={() => <RowActions onPrint={onPrint} />}
      />
    </SectionCard>
  );
}
