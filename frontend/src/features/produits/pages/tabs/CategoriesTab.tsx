import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { RowActions } from '@/components/RowActions';
import type { Categorie } from '@/types';

interface CategoriesTabProps {
  data: Categorie[];
  search: string;
  loading?: boolean;
  onOpenEdit: (item: Categorie) => void;
  onDelete: (item: Categorie) => void;
}

export function CategoriesTab({ data, search, loading, onOpenEdit, onDelete }: CategoriesTabProps) {
  const filteredCategories = search
    ? data.filter((row) =>
        [row.nom, row.description]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(search.toLowerCase()))
      )
    : data;

  const columns: Column<Categorie>[] = [
    { key: 'id', label: '#' },
    { key: 'nom', label: 'Nom' },
    { key: 'description', label: 'Description' },
    { key: 'actif', label: 'Actif', render: (row) => <span className={`badge ${row.actif ? 'badge-active' : 'badge-inactive'}`}>{row.actif ? 'Oui' : 'Non'}</span> },
  ];

  return (
    <SectionCard title="Catégories" subtitle={`${data.length} catégorie(s)`}>
      {loading ? (
        <div className="empty-state">Chargement des catégories...</div>
      ) : (
        <DataTable
          data={filteredCategories}
          columns={columns}
          emptyMessage="Aucune catégorie."
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
