import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { formatCurrency, formatDateTime, formatStatut, getStatutBadgeClass } from '@/utils/formatters';
import type { Reglement } from '@/types';

interface ReglementsTabProps {
  data: Reglement[];
  search: string;
  loading?: boolean;
}

export function ReglementsTab({ data, search, loading }: ReglementsTabProps) {
  const filteredReglements = search
    ? data.filter((row) =>
        [row.facture?.numero, row.facture?.vente?.numero, row.mode, row.reference ?? '', String(row.montant)]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(search.toLowerCase()))
      )
    : data;

  const columns: Column<Reglement>[] = [
    { key: 'id', label: '#' },
    {
      key: 'date_reglement',
      label: 'Date',
      render: (row) => formatDateTime(row.date_reglement),
    },
    {
      key: 'facture',
      label: 'Facture',
      render: (row) => row.facture?.numero ?? '—',
    },
    {
      key: 'client',
      label: 'Client',
      render: (row) => row.facture?.vente?.client?.nom ?? 'Client de passage',
    },
    {
      key: 'montant',
      label: 'Montant',
      render: (row) => formatCurrency(row.montant),
    },
    { key: 'mode', label: 'Mode' },
    { key: 'reference', label: 'Référence' },
    {
      key: 'statut',
      label: 'Facture',
      render: (row) => {
        if (!row.facture?.statut) return '—';
        return (
          <span className={`badge ${getStatutBadgeClass(row.facture.statut)}`}>
            {formatStatut(row.facture.statut)}
          </span>
        );
      },
    },
  ];

  return (
    <SectionCard title="Liste des règlements" subtitle={`${data.length} règlement(s)`}>
      <DataTable
        data={loading ? [] : filteredReglements}
        columns={columns}
        emptyMessage={loading ? 'Chargement des règlements...' : 'Aucun règlement.'}
      />
    </SectionCard>
  );
}
