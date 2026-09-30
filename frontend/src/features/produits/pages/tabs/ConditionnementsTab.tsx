import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { RowActions } from '@/components/RowActions';
import type { ProduitConditionnement } from '@/types';

interface ConditionnementsTabProps {
  data: ProduitConditionnement[];
  search: string;
  loading?: boolean;
  onOpenEdit?: (item: ProduitConditionnement) => void;
  onDelete?: (item: ProduitConditionnement) => void;
}

export function ConditionnementsTab({ data, search, loading, onOpenEdit, onDelete }: ConditionnementsTabProps) {
  const hasEdit = typeof onOpenEdit === 'function';
  const hasDelete = typeof onDelete === 'function';

  const filteredConditionnements = search
    ? data.filter((row) =>
        [row.unite?.nom, row.unite?.abreviation, row.produit?.nom]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(search.toLowerCase()))
      )
    : data;

  const columns: Column<ProduitConditionnement>[] = [
    { key: 'id', label: '#' },
    {
      key: 'produit.nom',
      label: 'Produit',
      render: (row) => row.produit?.nom ?? `Produit #${row.produit_id}`,
    },
    {
      key: 'unite.nom',
      label: 'Conditionnement',
      render: (row) =>
        row.unite
          ? `${row.unite.nom}${row.unite.abreviation ? ` (${row.unite.abreviation})` : ''}`
          : `Unité #${row.unite_id}`,
    },
    {
      key: 'quantite_base',
      label: 'Contenu',
      render: (row) => (
        <span>
          {row.quantite_base} {row.produit?.unite?.nom?.toLowerCase() ?? 'unité(s) de base'}
        </span>
      ),
    },
    { key: 'prix_vente', label: 'Prix vente (Ar)' },
    {
      key: 'est_unite_base',
      label: 'Unité de base',
      render: (row) => (
        <span className={`badge ${row.est_unite_base ? 'badge-active' : 'badge-inactive'}`}>
          {row.est_unite_base ? 'Oui' : 'Non'}
        </span>
      ),
    },
    {
      key: 'actif',
      label: 'Actif',
      render: (row) => (
        <span className={`badge ${row.actif ? 'badge-active' : 'badge-inactive'}`}>
          {row.actif ? 'Oui' : 'Non'}
        </span>
      ),
    },
  ];

  return (
    <SectionCard title="Conditionnements" subtitle={`${data.length} conditionnement(s)`}>
      <DataTable
        data={loading ? [] : filteredConditionnements}
        columns={columns}
        emptyMessage={loading ? 'Chargement des conditionnements...' : 'Aucun conditionnement.'}
        actionsHeaderLabel={hasEdit || hasDelete ? 'Actions' : undefined}
        actions={(hasEdit || hasDelete) ? (row) => (
          <RowActions
            onEdit={hasEdit ? () => onOpenEdit!(row) : undefined}
            onDelete={hasDelete ? () => onDelete!(row) : undefined}
          />
        ) : undefined}
      />
    </SectionCard>
  );
}