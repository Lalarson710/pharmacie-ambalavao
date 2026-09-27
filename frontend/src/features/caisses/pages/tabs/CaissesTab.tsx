import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { RowActions } from '@/components/RowActions';
import { Lock, Printer } from 'lucide-react';
import { formatCurrency, formatDateTime, getStatutBadgeClass, formatStatut } from '@/utils/formatters';
import type { Caisse } from '@/types';

interface CaissesTabProps {
  data: Caisse[];
  search: string;
  loading?: boolean;
  onClose: (item: Caisse) => void;
  onPrint: (item: Caisse) => void;
}

export function CaissesTab({ data, search, loading, onClose, onPrint }: CaissesTabProps) {
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

  const renderActions = (row: Caisse) => {
    if (row.statut !== 'ouverte') {
      return (
        <RowActions>
          <button
            type="button"
            className="icon-button print"
            onClick={() => onPrint(row)}
            title="Imprimer la fiche de cette caisse"
            aria-label="Imprimer la fiche de cette caisse"
          >
            <Printer size={14} />
          </button>
        </RowActions>
      );
    }

    return (
      <RowActions>
        <button
          type="button"
          className="icon-button warning"
          onClick={() => onClose(row)}
          title="Fermer la caisse"
          aria-label="Fermer la caisse"
        >
          <Lock size={14} />
        </button>
        <button
          type="button"
          className="icon-button print"
          onClick={() => onPrint(row)}
          title="Imprimer la fiche de cette caisse"
          aria-label="Imprimer la fiche de cette caisse"
        >
          <Printer size={14} />
        </button>
      </RowActions>
    );
  };

  return (
    <SectionCard
      title="Liste des caisses"
      subtitle={`${data.length} caisse(s)`}
    >
      <DataTable
        data={loading ? [] : filteredCaisses}
        columns={columns}
        emptyMessage={loading ? 'Chargement des caisses...' : 'Aucune caisse enregistrée.'}
        actionsHeaderLabel="Actions"
        actions={renderActions}
      />
    </SectionCard>
  );
}
