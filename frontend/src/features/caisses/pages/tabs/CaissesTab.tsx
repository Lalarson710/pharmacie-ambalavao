import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { RowActions } from '@/components/RowActions';
import { formatCurrency, formatDateTime, getStatutBadgeClass, formatStatut } from '@/utils/formatters';
import type { Caisse } from '@/types';

interface CaissesTabProps {
  data: Caisse[];
  search: string;
  onOpenEdit: (item: Caisse) => void;
  onDelete: (item: Caisse) => void;
  onPrint: () => void;
}

export function CaissesTab({ data, search, onOpenEdit, onDelete, onPrint }: CaissesTabProps) {
  const filteredCaisses = search
    ? data.filter((row) =>
        [
          row.id,
          row.utilisateur?.name,
          row.statut,
          row.observation ?? '',
          row.date_ouverture,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(search.toLowerCase())
          )
      )
    : data;

  const columns: Column<Caisse>[] = [
    { key: 'id', label: '#' },
    {
      key: 'date_ouverture',
      label: 'Ouverture',
      render: (row) => formatDateTime(row.date_ouverture),
    },
    {
      key: 'date_fermeture',
      label: 'Fermeture',
      render: (row) =>
        row.date_fermeture ? formatDateTime(row.date_fermeture) : '—',
    },
    {
      key: 'montant_initial',
      label: 'Montant initial',
      render: (row) => formatCurrency(row.montant_initial),
    },
    {
      key: 'montant_final',
      label: 'Montant final',
      render: (row) =>
        row.montant_final ? formatCurrency(row.montant_final) : '—',
    },
    {
      key: 'ecart',
      label: 'Écart',
      render: (row) => (row.ecart ? formatCurrency(row.ecart) : '—'),
    },
    {
      key: 'utilisateur',
      label: 'Ouvert par',
      render: (row) => row.utilisateur?.name ?? '—',
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
    <SectionCard
      title="Liste des caisses"
      subtitle={`${data.length} caisse(s)`}
    >
      <DataTable
        data={filteredCaisses}
        columns={columns}
        emptyMessage="Aucune caisse enregistrée."
        actionsHeaderLabel="Actions"
        actions={(row) => (
          <RowActions
            onEdit={() => onOpenEdit(row)}
            onDelete={() => onDelete(row)}
            onPrint={onPrint}
          />
        )}
      />
    </SectionCard>
  );
}
