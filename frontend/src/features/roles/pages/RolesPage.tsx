import { useState } from 'react';
import { Plus, Check, User } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { PageTabs } from '@/components/PageTabs';
import { PageToolbar } from '@/components/PageToolbar';
import { RowActions } from '@/components/RowActions';
import { EntityFormModal } from '@/components/EntityFormModal';
import { ConfirmModal } from '@/components/ConfirmModal';
import { permissions, roles, utilisateurs } from '@/data/mockData';
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

interface UserPermissionState {
  permissionId: number;
  allowed: boolean;
}

export function RolesPage() {
  const [activeTab, setActiveTab] = useState('roles');
  const [rolesData, setRolesData] = useState<Role[]>(roles);
  const [modal, setModal] = useState<RolesModalState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null);
  const [search, setSearch] = useState('');

  // Permissions tab state
  const [selectedUserId, setSelectedUserId] = useState<number>(utilisateurs[0]?.id ?? 1);
  const [userPermissions, setUserPermissions] = useState<UserPermissionState[]>(() =>
    permissions.map((p) => ({
      permissionId: p.id,
      allowed: _getUserPermission(utilisateurs[0].id, p.id),
    }))
  );
  const [permissionsSaved, setPermissionsSaved] = useState(false);

  const filteredRoles = search
    ? rolesData.filter(
        (row) =>
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

  const validate = (formData: Record<string, unknown>): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (modal?.kind === 'role') {
      if (!formData.nom) errors.nom = 'Le nom est obligatoire.';
      if (!formData.nom_affichage) errors.nom_affichage = "Le nom d'affichage est obligatoire.";
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
            <label htmlFor="role-affichage">Nom d'affichage *</label>
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

    return null;
  };

  const selectedUser = utilisateurs.find((u) => u.id === selectedUserId) ?? utilisateurs[0];

  const handleUserChange = (userId: number) => {
    setSelectedUserId(userId);
    setPermissionsSaved(false);
    const user = utilisateurs.find((u) => u.id === userId);
    setUserPermissions(
      permissions.map((p) => ({
        permissionId: p.id,
        allowed: user ? _getUserPermission(userId, p.id) : false,
      }))
    );
  };

  const togglePermission = (permissionId: number) => {
    setPermissionsSaved(false);
    setUserPermissions((prev) =>
      prev.map((up) =>
        up.permissionId === permissionId ? { ...up, allowed: !up.allowed } : up
      )
    );
  };

  const saveUserPermissions = () => {
    setPermissionsSaved(true);
    alert('Permissions enregistrées avec succès.');
  };

  return (
    <div className="page-container">
      <PageHeader
        title="Rôles & Permissions"
        subtitle={`${rolesData.length} rôle(s) — ${permissions.length} permission(s)`}
      />

      <PageToolbar
        search={search}
        onSearch={setSearch}
        placeholder="Rechercher dans l'onglet..."
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
        <SectionCard
          title="Permissions utilisateur"
          subtitle={`Permissions de « ${selectedUser.name} »`}
        >
          <div className="mb-4" style={{ maxWidth: '400px' }}>
            <label htmlFor="permission-user" className="block mb-2 font-semibold text-sm">
              <User size={14} className="inline mr-1" />
              Utilisateur
            </label>
            <select
              id="permission-user"
              name="user_id"
              className="inline-input"
              value={selectedUserId}
              onChange={(e) => handleUserChange(Number(e.target.value))}
            >
              {utilisateurs.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.role?.nom_affichage ?? '—'})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            {permissions.map((permission) => {
              const up = userPermissions.find((p) => p.permissionId === permission.id);
              const isAllowed = up?.allowed ?? false;
              return (
                <div key={permission.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-white">
                  <div>
                    <div className="font-medium text-sm">{permission.nom}</div>
                    <div className="text-xs text-gray-500 font-mono">{permission.code}</div>
                    {permission.description && (
                      <div className="text-xs text-gray-400 mt-1">{permission.description}</div>
                    )}
                  </div>
                  <label className="cursor-pointer relative inline-flex items-center">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={isAllowed}
                      onChange={() => togglePermission(permission.id)}
                      aria-label={`${isAllowed ? 'Autorisé' : 'Bloqué'} : ${permission.nom}`}
                    />
                    <div className={`w-14 h-7 rounded-full peer transition-colors ${isAllowed ? 'bg-green-500' : 'bg-red-400'}`}>
                      <div className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${isAllowed ? 'translate-x-7' : ''}`} />
                    </div>
                    <span className={`ml-2 text-xs font-medium ${isAllowed ? 'text-green-600' : 'text-red-500'}`}>
                      {isAllowed ? 'Autorisé' : 'Bloqué'}
                    </span>
                  </label>
                </div>
              );
            })}
          </div>

          <div className="mt-4">
            <button
              type="button"
              className="btn-primary"
              onClick={saveUserPermissions}
              disabled={permissionsSaved}
            >
              <Check size={15} /> {permissionsSaved ? 'Enregistré' : 'Enregistrer les changements'}
            </button>
          </div>
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

function _getUserPermission(userId: number, permissionId: number): boolean {
  // Admin (id=3) has all permissions
  if (userId === 3) return true;
  // Pharmacist (id=2) has limited permissions
  if (userId === 2) {
    const allowedCodes = [
      'produit.view', 'stock.view', 'achat.view', 'vente.view',
      'caisse.open', 'caisse.close', 'rapport.view', 'alerte.view',
      'personnel.view', 'client.view', 'fournisseur.view', 'sauvegarde.view',
    ];
    const permission = permissions.find((p) => p.id === permissionId);
    return permission ? allowedCodes.includes(permission.code) : false;
  }
  // Cashier (id=1) has minimal permissions
  const allowedCodes = [
    'produit.view', 'stock.view', 'vente.view', 'caisse.open',
    'caisse.close', 'alerte.view', 'client.view', 'fournisseur.view',
  ];
  const permission = permissions.find((p) => p.id === permissionId);
  return permission ? allowedCodes.includes(permission.code) : false;
}
