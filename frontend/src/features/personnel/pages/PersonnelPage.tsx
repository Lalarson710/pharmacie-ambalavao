import { useState } from 'react';
import { Plus, Shield } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PageHeader } from '@/components/PageHeader';
import { PageTabs } from '@/components/PageTabs';
import { PageToolbar } from '@/components/PageToolbar';
import { ConfirmModal } from '@/components/ConfirmModal';
import { personnel, roles, utilisateurs } from '@/data/mockData';
import type { Personnel, Role, User } from '@/types';
import { personnelTabs } from './tabs/tabsConfig';
import { PersonnelModal, type PersonnelDeleteTarget, type PersonnelModalKind, type PersonnelModalState } from './tabs/PersonnelModal';
import { PersonnelTab } from './tabs/PersonnelTab';
import { RolesTab } from './tabs/RolesTab';
import { UtilisateursTab } from './tabs/UtilisateursTab';

export function PersonnelPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState(
    searchParams.get('tab') === 'utilisateurs'
      ? 'utilisateurs'
      : 'personnel'
  );
  const [personnelData, setPersonnelData] = useState<Personnel[]>(personnel);
  const [usersData, setUsersData] = useState<User[]>(utilisateurs);
  const [rolesData, setRolesData] = useState<Role[]>(roles);
  const [modal, setModal] = useState<PersonnelModalState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PersonnelDeleteTarget | null>(null);
  const [search, setSearch] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const openAdd = (kind: Exclude<PersonnelModalKind, 'role'>) => {
    setModal({ kind, item: null });
  };

  const openEdit = (kind: Exclude<PersonnelModalKind, 'role'>, item: Personnel | User) => {
    setModal({ kind, item });
  };

  const openAddRole = () => {
    setModal({ kind: 'role', item: null });
  };

  const openEditRole = (item: Role) => {
    setModal({ kind: 'role', item });
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.kind === 'personnel') {
      setPersonnelData((prev) => prev.filter((row) => row.id !== deleteTarget.item.id));
    } else if (deleteTarget.kind === 'utilisateur') {
      setUsersData((prev) => prev.filter((row) => row.id !== deleteTarget.item.id));
    } else {
      setRolesData((prev) => prev.filter((row) => row.id !== deleteTarget.item.id));
    }

    setDeleteTarget(null);
  };

  return (
    <div className="page-container">
      <PageHeader
        title="Personnel"
        subtitle="Gestion des membres et des accès utilisateurs"
      />

      <PageToolbar
        search={search}
        onSearch={setSearch}
        placeholder="Rechercher dans l’onglet..."
        actions={
          <>
            {activeTab === 'roles' && (
              <button type="button" className="btn-primary" onClick={openAddRole}>
                <Plus size={15} /> Ajouter un rôle
              </button>
            )}
            {activeTab === 'personnel' && (
              <button type="button" className="btn-primary" onClick={() => openAdd('personnel')}>
                <Plus size={15} /> Ajouter
              </button>
            )}
            {activeTab === 'utilisateurs' && (
              <>
                <button type="button" className="btn-primary" onClick={() => openAdd('utilisateur')}>
                  <Plus size={15} /> Ajouter
                </button>
                {selectedUserId && (
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => navigate(`/personnels/permissions?user_id=${selectedUserId}`)}
                  >
                    <Shield size={15} /> Permission
                  </button>
                )}
              </>
            )}
          </>
        }
      />

      <PageTabs
        tabs={personnelTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'personnel' && (
        <PersonnelTab
          personnelData={personnelData}
          search={search}
          onOpenEdit={(item) => openEdit('personnel', item)}
          onDelete={(item) => setDeleteTarget({ kind: 'personnel', item })}
        />
      )}

      {activeTab === 'roles' && (
        <RolesTab
          rolesData={rolesData}
          search={search}
          onOpenEdit={openEditRole}
          onDelete={(item) => setDeleteTarget({ kind: 'role', item })}
        />
      )}

      {activeTab === 'utilisateurs' && (
        <UtilisateursTab
          usersData={usersData}
          search={search}
          selectedUserId={selectedUserId}
          setSelectedUserId={setSelectedUserId}
          onOpenEdit={(item) => openEdit('utilisateur', item)}
          onDelete={(item) => setDeleteTarget({ kind: 'utilisateur', item })}
        />
      )}

      <PersonnelModal
        modal={modal}
        setModal={setModal}
        setPersonnelData={setPersonnelData}
        setUsersData={setUsersData}
        setRolesData={setRolesData}
      />

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title={
          deleteTarget?.kind === 'role'
            ? 'Supprimer le rôle'
            : deleteTarget?.kind === 'personnel'
              ? 'Supprimer le membre'
              : 'Supprimer l’utilisateur'
        }
        message={
          deleteTarget && deleteTarget.kind === 'personnel'
            ? `Voulez-vous vraiment supprimer le membre ${(deleteTarget.item as Personnel).nom} ?`
            : deleteTarget?.kind === 'role'
              ? `Voulez-vous vraiment supprimer le rôle ${(deleteTarget.item as Role).nom_affichage} ?`
              : deleteTarget
                ? `Voulez-vous vraiment supprimer l’utilisateur ${(deleteTarget.item as User).name} ?`
                : ''
        }
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
