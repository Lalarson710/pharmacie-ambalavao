import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { personnel, utilisateurs, roles, permissions } from '@/data/mockData';
import { formatDate } from '@/utils/formatters';
import type { Personnel, User, Role, Permission } from '@/types';

export function PersonnelPage() {
  const personnelColumns: Column<Personnel>[] = [
    { key: 'id', label: '#' },
    { key: 'nom', label: 'Nom' },
    { key: 'prenom', label: 'Prénom' },
    { key: 'telephone', label: 'Téléphone' },
    { key: 'email', label: 'Email' },
    { key: 'adresse', label: 'Adresse' },
    { key: 'fonction', label: 'Fonction' },
    {
      key: 'date_embauche',
      label: 'Date d’embauche',
      render: (row) => (row.date_embauche ? formatDate(row.date_embauche) : '—'),
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

  const utilisateurColumns: Column<User>[] = [
    { key: 'id', label: '#' },
    { key: 'name', label: 'Nom' },
    { key: 'email', label: 'Email' },
    {
      key: 'role',
      label: 'Rôle',
      render: (row) => row.role?.nom_affichage ?? '—',
    },
  ];

  const roleColumns: Column<Role>[] = [
    { key: 'id', label: '#' },
    { key: 'nom', label: 'Nom (technique)' },
    { key: 'nom_affichage', label: 'Nom affiché' },
  ];

  const permissionColumns: Column<Permission>[] = [
    { key: 'id', label: '#' },
    { key: 'code', label: 'Code' },
    { key: 'nom', label: 'Nom' },
    { key: 'description', label: 'Description' },
  ];

  return (
    <div className="page-container">
      <PageHeader
        title="Personnel"
        subtitle={`${personnel.length} membre(s) enregistré(s)`}
      />

      <SectionCard title="Liste du personnel">
        <DataTable
          data={personnel}
          columns={personnelColumns}
          emptyMessage="Aucun membre du personnel."
        />
      </SectionCard>

      <div className="two-col-grid">
        <SectionCard title="Utilisateurs" subtitle={`${utilisateurs.length} utilisateur(s)`}>
          <DataTable
            data={utilisateurs}
            columns={utilisateurColumns}
            emptyMessage="Aucun utilisateur."
          />
        </SectionCard>

        <SectionCard title="Rôles" subtitle={`${roles.length} rôle(s)`}>
          <DataTable
            data={roles}
            columns={roleColumns}
            emptyMessage="Aucun rôle."
          />
        </SectionCard>
      </div>

      <SectionCard title="Permissions" subtitle={`${permissions.length} permission(s)`}>
        <DataTable
          data={permissions}
          columns={permissionColumns}
          emptyMessage="Aucune permission."
        />
      </SectionCard>
    </div>
  );
}
