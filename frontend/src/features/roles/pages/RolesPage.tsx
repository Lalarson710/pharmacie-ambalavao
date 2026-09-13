import { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { PageTabs } from '@/components/PageTabs';
import { roles, permissions } from '@/data/mockData';
import type { Role, Permission } from '@/types';

const rolesTabs = [
  { id: 'roles', label: 'Rôles' },
  { id: 'permissions', label: 'Permissions' },
];

export function RolesPage() {
  const [activeTab, setActiveTab] = useState('roles');

  const roleColumns: Column<Role>[] = [
    { key: 'id', label: '#' },
    { key: 'nom', label: 'Nom' },
    { key: 'nom_affichage', label: 'Affichage' },
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
        title="Rôles & Permissions"
        subtitle={`${roles.length} rôle(s) — ${permissions.length} permission(s)`}
      />

      <PageTabs
        tabs={rolesTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'roles' && (
        <SectionCard title="Liste des rôles" subtitle={`${roles.length} rôle(s)`}>
          <DataTable
            data={roles}
            columns={roleColumns}
            emptyMessage="Aucun rôle enregistré."
          />
        </SectionCard>
      )}

      {activeTab === 'permissions' && (
        <SectionCard title="Liste des permissions" subtitle={`${permissions.length} permission(s)`}>
          <DataTable
            data={permissions}
            columns={permissionColumns}
            emptyMessage="Aucune permission enregistrée."
          />
        </SectionCard>
      )}
    </div>
  );
}