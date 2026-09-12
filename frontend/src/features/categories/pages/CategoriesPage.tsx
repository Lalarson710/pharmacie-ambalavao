import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { categories } from '@/data/mockData';
import type { Categorie } from '@/types';

export function CategoriesPage() {
  const columns: Column<Categorie>[] = [
    { key: 'id', label: '#' },
    { key: 'nom', label: 'Nom' },
    { key: 'description', label: 'Description' },
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
    <div className="page-container">
      <PageHeader
        title="Catégories"
        subtitle={`${categories.length} catégorie(s) enregistrée(s)`}
      />

      <SectionCard title="Liste des catégories">
        <DataTable
          data={categories}
          columns={columns}
          emptyMessage="Aucune catégorie enregistrée."
        />
      </SectionCard>
    </div>
  );
}
