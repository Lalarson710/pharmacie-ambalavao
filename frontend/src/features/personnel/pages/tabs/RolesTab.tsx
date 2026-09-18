import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { RowActions } from '@/components/RowActions';
import type { Role } from '@/types';

interface RolesTabProps {
  rolesData: Role[];
  search: string;
  onOpenEdit: (item: Role) => void;
  onDelete: (item: Role) => void;
}

export function RolesTab({ rolesData, search, onOpenEdit, onDelete }: RolesTabProps) {
  const filteredRoles = search
    ? rolesData.filter((row) =>
        [row.id, row.nom, row.nom_affichage]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(search.toLowerCase()))
      )
    : rolesData;

  const roleColumns: Column<Role>[] = [
    { key: 'id', label: '#' },
    { key: 'nom', label: 'Nom' },
    { key: 'nom_affichage', label: 'Affichage' },
  ];

  return (
    <SectionCard title="Liste des rôles" subtitle={`${rolesData.length} rôle(s)`}>
      <DataTable
        data={filteredRoles}
        columns={roleColumns}
        emptyMessage="Aucun rôle enregistré."
        actionsHeaderLabel="Actions"
        actions={(row) => (
          <RowActions
            onEdit={() => onOpenEdit(row)}
            onDelete={() => onDelete(row)}
          />
        )}
      />
    </SectionCard>
  );
}
