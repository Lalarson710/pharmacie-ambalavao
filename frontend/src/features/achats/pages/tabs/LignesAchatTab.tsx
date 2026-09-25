import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { RowActions } from '@/components/RowActions';
import { formatCurrency, formatDate, getStatutBadgeClass, formatStatut } from '@/utils/formatters';
import type { Achat, AchatLigne } from '@/types';

interface LignesAchatTabProps {
  data: AchatLigne[];
  achats: Achat[];
  search: string;
  loading?: boolean;
  onOpenEdit: (item: AchatLigne) => void;
  onDelete: (item: AchatLigne) => void;
}

export function LignesAchatTab({
  data,
  achats,
  search,
  loading,
  onOpenEdit,
  onDelete,
}: LignesAchatTabProps) {
  const filteredLignes = search
    ? data.filter((row) =>
        [row.produit?.nom, row.numero_lot, row.date_peremption ?? '', String(row.quantite)]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(search.toLowerCase()))
      )
    : data;

  const columns: Column<AchatLigne>[] = [
    { key: 'id', label: '#' },
    {
      key: 'achat',
      label: 'Achat',
      render: (row) => {
        const achatAssocie = achats.find((a) => a.id === row.achat_id);
        return achatAssocie?.numero ?? '—';
      },
    },
    {
      key: 'produit',
      label: 'Produit',
      render: (row) => row.produit?.nom ?? '—',
    },
    { key: 'numero_lot', label: 'N° de lot' },
    {
      key: 'date_peremption',
      label: 'Péremption',
      render: (row) => (row.date_peremption ? formatDate(row.date_peremption) : '—'),
    },
    { key: 'quantite', label: 'Qté' },
    {
      key: 'prix_unitaire',
      label: 'Prix unitaire',
      render: (row) => formatCurrency(row.prix_unitaire),
    },
    {
      key: 'montant',
      label: 'Montant',
      render: (row) => formatCurrency(row.montant),
    },
    {
      key: 'statut',
      label: 'Statut',
      render: (row) => {
        const achatAssocie = achats.find((a) => a.id === row.achat_id);
        if (!achatAssocie) return '—';
        return (
          <span className={`badge ${getStatutBadgeClass(achatAssocie.statut)}`}>
            {formatStatut(achatAssocie.statut)}
          </span>
        );
      },
    },
  ];

  const renderActions = (row: AchatLigne) => {
    const achatAssocie = achats.find((a) => a.id === row.achat_id);
    const peutModifier = achatAssocie?.statut === 'brouillon';

    if (!peutModifier) {
      return (
        <RowActions>
          <span className="text-muted" style={{ fontSize: '0.75rem', padding: '0 8px' }}>
            Achat non modifiable
          </span>
        </RowActions>
      );
    }

    return (
      <RowActions
        onEdit={() => onOpenEdit(row)}
        onDelete={() => onDelete(row)}
      />
    );
  };

  return (
    <SectionCard title="Lignes d'achat" subtitle={`${data.length} ligne(s)`}>
      <DataTable
        data={loading ? [] : filteredLignes}
        columns={columns}
        emptyMessage={loading ? 'Chargement des lignes...' : 'Aucune ligne d’achat.'}
        actionsHeaderLabel="Actions"
        actions={renderActions}
      />
    </SectionCard>
  );
}
