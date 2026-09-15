import { useState } from 'react';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { PageTabs } from '@/components/PageTabs';
import { PageToolbar } from '@/components/PageToolbar';
import { RowActions } from '@/components/RowActions';
import { EntityFormModal } from '@/components/EntityFormModal';
import { ConfirmModal } from '@/components/ConfirmModal';
import { permissions, roles } from '@/data/mockData';
import type { Permission, Role } from '@/types';

const rolesTabs = [
  { id: 'roles', label: 'Rôles' },
  { id: 'permissions', label: 'Permissions' },
];

type RolesModalKind = 'role' | 'permission';

interface RolesModalState {
  kind: RolesModalKind;
  item: Role | Permission | null;
}

export function RolesPage() {
  const [activeTab, setActiveTab] = useState('roles');
  const [rolesData, setRolesData] = useState<Role[]>(roles);
  const [permissionsData, setPermissionsData] = useState<Permission[]>(permissions);
  const [modal, setModal] = useState<RolesModalState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null);
  const [search, setSearch] = useState('');

  const filteredRoles = search
    ? rolesData.filter((row) =>
        [row.id, row.nom, row.nom_affichage]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(search.toLowerCase()))
      )
    : rolesData;

  const filteredPermissions = search
    ? permissionsData.filter((row) =>
        [row.id, row.code, row.nom, row.description ?? '']
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(search.toLowerCase()))
      )
    : permissionsData;

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

  const openAddRole = () => {
    setModal({ kind: 'role', item: null });
  };

  const openEdit = (kind: RolesModalKind, item: Role | Permission) => {
    setModal({ kind, item });
  };

  const handleSave = (formData: Record<string, unknown>) => {
    if (!modal) return;

    if (modal.kind === 'role') {
      const roleData = {
        nom: String(formData.nom),
        nom_affichage: String(formData.nom_affichage),
      };

      setRolesData((prev) => {
        if (modal.item) {
          return prev.map((row) =>
            row.id === modal.item?.id ? { ...row, ...roleData } : row
          );
        }

        const nextId = prev.length > 0 ? Math.max(...prev.map((row) => row.id)) + 1 : 1;
        return [...prev, { id: nextId, ...roleData }];
      });
    }

    if (modal.kind === 'permission') {
      const permissionData = {
        code: String(formData.code),
        nom: String(formData.nom),
        description: (formData.description as string) || null,
      };

      setPermissionsData((prev) =>
        prev.map((row) =>
          row.id === modal.item?.id ? { ...row, ...permissionData } : row
        )
      );
    }

    setModal(null);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setRolesData((prev) => prev.filter((row) => row.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const getInitialData = (item: Role | Permission | null) => {
    if (!modal) return {};

    if (modal.kind === 'role') {
      const row = item as Role | null;
      return {
        nom: row?.nom ?? '',
        nom_affichage: row?.nom_affichage ?? '',
      };
    }

    const row = item as Permission | null;
    return {
      code: row?.code ?? '',
      nom: row?.nom ?? '',
      description: row?.description ?? '',
    };
  };

  const validate = (formData: Record<string, unknown>) => {
    const errors: Record<string, string> = {};

    if (modal?.kind === 'role') {
      if (!formData.nom) errors.nom = 'Le nom est obligatoire.';
      if (!formData.nom_affichage) errors.nom_affichage = 'Le nom d’affichage est obligatoire.';
    }

    if (modal?.kind === 'permission') {
      if (!formData.code) errors.code = 'Le code est obligatoire.';
      if (!formData.nom) errors.nom = 'Le nom est obligatoire.';
    }

    return errors;
  };

  const renderForm = (
    _formData: Record<string, unknown>,
    onChange: (name: string, value: string) => void,
    errors: Record<string, string>
  ) => {
    if (!modal) return null;

    if (modal.kind === 'role') {
      return (
        <>
          <div className="form-field">
            <label htmlFor="role-nom">Nom *</label>
            <input
              id="role-nom"
              name="nom"
              type="text"
              className="inline-input"
              onChange={(e) => onChange('nom', e.target.value)}
            />
            {errors.nom && <span className="form-error">{errors.nom}</span>}
          </div>
          <div className="form-field">
            <label htmlFor="role-affichage">Nom d’affichage *</label>
            <input
              id="role-affichage"
              name="nom_affichage"
              type="text"
              className="inline-input"
              onChange={(e) => onChange('nom_affichage', e.target.value)}
            />
            {errors.nom_affichage && <span className="form-error">{errors.nom_affichage}</span>}
          </div>
        </>
      );
    }

    return (
      <>
        <div className="form-field">
          <label htmlFor="permission-code">Code *</label>
          <input
            id="permission-code"
            name="code"
            type="text"
            className="inline-input"
            onChange={(e) => onChange('code', e.target.value)}
          />
          {errors.code && <span className="form-error">{errors.code}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="permission-nom">Nom *</label>
          <input
            id="permission-nom"
            name="nom"
            type="text"
            className="inline-input"
            onChange={(e) => onChange('nom', e.target.value)}
          />
          {errors.nom && <span className="form-error">{errors.nom}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="permission-description">Description</label>
          <textarea
            id="permission-description"
            name="description"
            className="inline-input"
            rows={3}
            onChange={(e) => onChange('description', e.target.value)}
          />
        </div>
      </>
    );
  };

  return (
    <div className="page-container">
      <PageHeader
        title="Rôles & Permissions"
        subtitle={`${rolesData.length} rôle(s) — ${permissionsData.length} permission(s)`}
      />

      <PageToolbar
        search={search}
        onSearch={setSearch}
        placeholder="Rechercher dans l’onglet..."
        actions={
          activeTab === 'roles' ? (
            <button type="button" className="btn-primary" onClick={openAddRole}>
              <Plus size={15} /> Ajouter
            </button>
          ) : undefined
        }
      />

      <PageTabs
        tabs={rolesTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'roles' && (
        <SectionCard title="Liste des rôles" subtitle={`${rolesData.length} rôle(s)`}>
          <DataTable
            data={filteredRoles}
            columns={roleColumns}
            emptyMessage="Aucun rôle enregistré."
            actionsHeaderLabel="Actions"
            actions={(row) => (
              <RowActions
                onEdit={() => openEdit('role', row)}
                onDelete={() => setDeleteTarget(row)}
              />
            )}
          />
        </SectionCard>
      )}

      {activeTab === 'permissions' && (
        <SectionCard title="Liste des permissions" subtitle={`${permissionsData.length} permission(s)`}>
          <DataTable
            data={filteredPermissions}
            columns={permissionColumns}
            emptyMessage="Aucune permission enregistrée."
            actionsHeaderLabel="Actions"
            actions={(row) => (
              <RowActions
                onEdit={() => openEdit('permission', row)}
                editLabel="Modifier la permission"
              />
            )}
          />
        </SectionCard>
      )}

      <EntityFormModal
        open={Boolean(modal)}
        onClose={() => setModal(null)}
        title={
          modal?.kind === 'role'
            ? (modal?.item ? 'Modifier le rôle' : 'Ajouter un rôle')
            : 'Modifier la permission'
        }
        editItem={modal?.item ?? null}
        onSubmit={handleSave}
        renderForm={renderForm}
        getInitialData={getInitialData}
        validate={validate}
        size="md"
      />

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Supprimer le rôle"
        message={`Voulez-vous vraiment supprimer le rôle ${deleteTarget?.nom_affichage ?? ''} ?`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
