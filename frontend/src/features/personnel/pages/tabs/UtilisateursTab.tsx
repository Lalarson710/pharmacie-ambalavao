import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { RowActions } from '@/components/RowActions';
import type { User } from '@/types';

interface UtilisateursTabProps {
  usersData: User[];
  search: string;
  selectedUserId: number | null;
  setSelectedUserId: (userId: number | null) => void;
  onOpenEdit: (item: User) => void;
  onDelete: (item: User) => void;
}

export function UtilisateursTab({
  usersData,
  search,
  selectedUserId,
  setSelectedUserId,
  onOpenEdit,
  onDelete,
}: UtilisateursTabProps) {
  const filteredUsers = search
    ? usersData.filter((row) =>
        [row.id, row.name, row.email, row.role?.nom_affichage ?? '']
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(search.toLowerCase()))
      )
    : usersData;

  const utilisateurColumns: Column<User>[] = [
    {
      key: 'select',
      label: '',
      render: (row) => (
        <input
          type="checkbox"
          checked={selectedUserId === row.id}
          onChange={() => {
            setSelectedUserId(selectedUserId === row.id ? null : row.id);
          }}
          aria-label={`Sélectionner ${row.name}`}
        />
      ),
    },
    { key: 'id', label: '#' },
    { key: 'name', label: 'Nom' },
    { key: 'email', label: 'Email' },
    {
      key: 'role',
      label: 'Rôle',
      render: (row) => row.role?.nom_affichage ?? '—',
    },
  ];

  return (
    <SectionCard title="Utilisateurs" subtitle={`${usersData.length} utilisateur(s)`}>
      <DataTable
        data={filteredUsers}
        columns={utilisateurColumns}
        emptyMessage="Aucun utilisateur."
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
