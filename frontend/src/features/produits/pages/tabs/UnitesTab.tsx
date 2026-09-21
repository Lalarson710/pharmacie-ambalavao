import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { RowActions } from '@/components/RowActions';
import type { Unite } from '@/types';

interface UnitesTabProps {
  data: Unite[];
  search: string;
  loading?: boolean;
  onOpenEdit: (item: Unite) => void;
  onDelete: (item: Unite) => void;
}

export function UnitesTab({ data, search, loading, onOpenEdit, onDelete }: UnitesTabProps) {
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
      {loading ? (
        <div className="empty-state">Chargement des unités...</div>
      ) : (
        <DataTable
          data={filteredUnits}
          columns={columns}
          emptyMessage="Aucune unité."
          actionsHeaderLabel="Actions"
          actions={(row) => (
            <RowActions
              onEdit={() => onOpenEdit(row)}
              onDelete={() => onDelete(row)}
            />
          )}
        />
      )}
    </SectionCard>
  );
}
