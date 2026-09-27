import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { RowActions } from '@/components/RowActions';
import { formatCurrency, getStatutBadgeClass, formatStatut } from '@/utils/formatters';
import type { Vente, VenteLigne } from '@/types';

interface LignesVenteTabProps {
  data: VenteLigne[];
  ventes: Vente[];
  search: string;
  loading?: boolean;
  onOpenEdit: (item: VenteLigne) => void;
  onDelete: (item: VenteLigne) => void;
}

export function LignesVenteTab({
  data,
  ventes,
  search,
  loading,
  onOpenEdit,
  onDelete,
}: LignesVenteTabProps) {
  const filteredLignes = search
    ? data.filter((row) =>
        [row.produit?.nom, row.lot?.numero_lot, String(row.quantite)]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(search.toLowerCase()))
      )
    : data;

  const columns: Column<VenteLigne>[] = [
    { key: 'id', label: '#' },
    {
      key: 'vente',
      label: 'Vente',
      render: (row) => {
        const venteAssociee = ventes.find((v) => v.id === row.vente_id);
        return venteAssociee?.numero ?? '—';
      },
    },
    {
      key: 'produit',
      label: 'Produit',
      render: (row) => row.produit?.nom ?? '—',
    },
    {
      key: 'lot',
      label: 'N° de lot',
      render: (row) => row.lot?.numero_lot ?? '—',
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
        const venteAssociee = ventes.find((v) => v.id === row.vente_id);
        if (!venteAssociee) return '—';
        return (
          <span className={`badge ${getStatutBadgeClass(venteAssociee.statut)}`}>
            {formatStatut(venteAssociee.statut)}
          </span>
        );
      },
    },
  ];

  const renderActions = (row: VenteLigne) => {
    const venteAssociee = ventes.find((v) => v.id === row.vente_id);
    const peutModifier = venteAssociee?.statut === 'brouillon';

    if (!peutModifier) {
      return (
        <RowActions>
          <span className="text-muted" style={{ fontSize: '0.75rem', padding: '0 8px' }}>
            Vente non modifiable
          </span>
        </RowActions>
      );
    }

    return (
      <RowActions
        onEdit={() => onOpenEdit(row)}
        onDelete={() => onDelete(row)}
        editLabel="Modifier la ligne"
        deleteLabel="Supprimer la ligne"
      />
    );
  };

  return (
    <SectionCard title="Lignes de vente" subtitle={`${data.length} ligne(s)`}>
      <DataTable
        data={loading ? [] : filteredLignes}
        columns={columns}
        emptyMessage={loading ? 'Chargement des lignes...' : 'Aucune ligne de vente.'}
        actionsHeaderLabel="Actions"
        actions={renderActions}
      />
    </SectionCard>
  );
}
