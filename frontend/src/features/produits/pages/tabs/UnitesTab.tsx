import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { RowActions } from '@/components/RowActions';
import type { Unite } from '@/types';

interface UnitesTabProps {
  data: Unite[];
  search: string;
  loading?: boolean;
  onOpenEdit?: (item: Unite) => void;
  onDelete?: (item: Unite) => void;
}

export function UnitesTab({ data, search, loading, onOpenEdit, onDelete }: UnitesTabProps) {
  const hasEdit = typeof onOpenEdit === 'function';
  const hasDelete = typeof onDelete === 'function';

  const filteredUnits = search
    ? data.filter((row) =>
        [row.nom, row.abreviation]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(search.toLowerCase()))
      )
    : data;

  const columns: Column<Unite>[] = [
    { key: 'id', label: '#' },
    { key: 'nom', label: 'Nom' },
    { key: 'abreviation', label: 'Abréviation' },
    { key: 'actif', label: 'Actif', render: (row) => <span className={`badge ${row.actif ? 'badge-active' : 'badge-inactive'}`}>{row.actif ? 'Oui' : 'Non'}</span> },
  ];

  return (
    <SectionCard title="Unités" subtitle={`${data.length} unité(s)`}>
      <DataTable
        data={loading ? [] : filteredUnits}
        columns={columns}
        emptyMessage={loading ? 'Chargement des unités...' : 'Aucune unité.'}
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
