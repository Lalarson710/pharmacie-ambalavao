import { useState, useEffect } from 'react';
import { Plus, Shield } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PageHeader } from '@/components/PageHeader';
import { PageTabs } from '@/components/PageTabs';
import { PageToolbar } from '@/components/PageToolbar';
import { ConfirmModal } from '@/components/ConfirmModal';
import { usePermissions } from '@/hooks/usePermissions';
import type { Personnel, Role, User } from '@/types';
import { personnelTabs } from './tabs/tabsConfig';
import { PersonnelModal, type PersonnelDeleteTarget, type PersonnelModalKind, type PersonnelModalState } from './tabs/PersonnelModal';
import { PersonnelTab } from './tabs/PersonnelTab';
import { RolesTab } from './tabs/RolesTab';
import { UtilisateursTab } from './tabs/UtilisateursTab';
import { rolesApi } from '../api/roles';
import { utilisateursApi } from '../api/utilisateurs';
import { useToast } from '@/components/Toast';
import { personnelApi } from '../api/personnel';

export function PersonnelPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();
  const { hasPermission } = usePermissions();

  // Permission mapping for tabs
  const tabPermissions: Record<string, string> = {
    personnel: 'personnel.view',
    roles: 'role.view',
    utilisateurs: 'user.view',
  };

  // Permission mapping for actions per tab
  const tabActionPermissions: Record<string, { create: string; update: string; delete: string }> = {
    personnel: { create: 'personnel.create', update: 'personnel.update', delete: 'personnel.delete' },
    roles: { create: 'role.create', update: 'role.update', delete: 'role.delete' },
    utilisateurs: { create: 'user.create', update: 'user.update', delete: 'user.delete' },
  };

  // Filter tabs based on view permissions
  const allowedTabs = personnelTabs.filter((tab) => hasPermission(tabPermissions[tab.id]));
  const defaultActiveTab = allowedTabs[0]?.id ?? 'personnel';

  const [activeTab, setActiveTab] = useState(
    searchParams.get('tab') === 'utilisateurs' && hasPermission(tabPermissions.utilisateurs)
      ? 'utilisateurs'
      : defaultActiveTab
  );
  const [personnelData, setPersonnelData] = useState<Personnel[]>([]);
  const [usersData, setUsersData] = useState<User[]>([]);
  const [rolesData, setRolesData] = useState<Role[]>([]);
  const [modal, setModal] = useState<PersonnelModalState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PersonnelDeleteTarget | null>(null);
  const [search, setSearch] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState<{ roles: boolean; users: boolean; personnel: boolean }>({ roles: true, users: true, personnel: true });

  // Check permissions for active tab
  const canCreate = hasPermission(tabActionPermissions[activeTab]?.create);
  const canEdit = hasPermission(tabActionPermissions[activeTab]?.update);
  const canDelete = hasPermission(tabActionPermissions[activeTab]?.delete);

  // Charger les rôles au montage
  useEffect(() => {
    if (!hasPermission('role.view')) return;
    const loadRoles = async () => {
      try {
        const data = await rolesApi.getAll();
        setRolesData(data);
      } catch (error) {
        console.error('Erreur lors du chargement des rôles:', error);
        const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
        if (axiosError.response?.status === 403 || axiosError.response?.status === 500) {
          showToast('Accès refusé : vous n\'avez pas la permission de voir les rôles.', 'error');
        }
      } finally {
        setLoading(prev => ({ ...prev, roles: false }));
      }
    };
    loadRoles();
  }, [showToast]);

  // Charger les utilisateurs au montage
  useEffect(() => {
    if (!hasPermission('user.view')) return;
    const loadUsers = async () => {
      try {
        const data = await utilisateursApi.getAll();
        setUsersData(data);
      } catch (error) {
        console.error('Erreur lors du chargement des utilisateurs:', error);
        const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
        if (axiosError.response?.status === 403 || axiosError.response?.status === 500) {
          showToast('Accès refusé : vous n\'avez pas la permission de voir les utilisateurs.', 'error');
        }
      } finally {
        setLoading(prev => ({ ...prev, users: false }));
      }
    };
    loadUsers();
  }, [showToast]);

  // Charger le personnel au montage
  useEffect(() => {
    if (!hasPermission('personnel.view')) return;
    const loadPersonnel = async () => {
      try {
        const data = await personnelApi.getAll();
        setPersonnelData(data);
      } catch (error) {
        console.error('Erreur lors du chargement du personnel:', error);
        const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
        if (axiosError.response?.status === 403 || axiosError.response?.status === 500) {
          showToast('Accès refusé : vous n\'avez pas la permission de voir le personnel.', 'error');
        }
      } finally {
        setLoading(prev => ({ ...prev, personnel: false }));
      }
    };
    loadPersonnel();
  }, [showToast]);


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

    const { kind, item } = deleteTarget;
    const itemName = kind === 'personnel' 
      ? (item as Personnel).nom 
      : kind === 'role' 
        ? (item as Role).nom_affichage 
        : (item as User).name;

    // 1. Suppression OPTIMISTE immédiate
    if (kind === 'personnel') {
      setPersonnelData(prev => prev.filter(row => row.id !== item.id));
    } else if (kind === 'utilisateur') {
      setUsersData(prev => prev.filter(row => row.id !== item.id));
    } else {
      setRolesData(prev => prev.filter(row => row.id !== item.id));
    }

    // 2. Fermer modal tout de suite
    setDeleteTarget(null);

    // 3. API en arrière-plan + toast
    (async () => {
      try {
        if (kind === 'personnel') {
          await personnelApi.delete(item.id);
        } else if (kind === 'utilisateur') {
          await utilisateursApi.delete(item.id);
        } else if (kind === 'role') {
          await rolesApi.delete(item.id);
        }
        showToast(`${kind === 'personnel' ? 'Membre' : kind === 'role' ? 'Rôle' : 'Utilisateur'} "${itemName}" supprimé`, 'success');
      } catch (error) {
        console.error('Erreur suppression:', error);

        // FEATURE 1 : Afficher le message d'erreur spécifique du backend
        const axiosError = error as { response?: { data?: { message?: string } } };
        const specificMessage = axiosError.response?.data?.message;

        if (specificMessage) {
          showToast(specificMessage, 'error');
        } else {
          showToast('Erreur lors de la suppression', 'error');
        }

        // Rétablir les données en cas d'échec
        if (kind === 'personnel') {
          setPersonnelData(prev => [...prev, item as Personnel]);
        } else if (kind === 'utilisateur') {
          setUsersData(prev => [...prev, item as User]);
        } else {
          setRolesData(prev => [...prev, item as Role]);
        }
      }
    })();
  };


  return (
    <div className="page-container">
      {allowedTabs.length === 0 ? (
        <div className="page-empty-state">
          <div className="empty-state-icon">🔒</div>
          <h2>Accès non autorisé</h2>
          <p>Vous n'avez pas les permissions nécessaires pour accéder à ce module.</p>
        </div>
      ) : (
        <>
          <PageHeader
            title="Personnel"
            subtitle="Gestion des membres et des accès utilisateurs"
          />

          <PageToolbar
            search={search}
            onSearch={setSearch}
            placeholder="Rechercher dans l'onglet..."
            actions={
              <>
                {activeTab === 'roles' && canCreate && (
                  <button type="button" className="btn-primary" onClick={openAddRole}>
                    <Plus size={15} /> Ajouter un rôle
                  </button>
                )}
                {activeTab === 'personnel' && canCreate && (
                  <button type="button" className="btn-primary" onClick={() => openAdd('personnel')}>
                    <Plus size={15} /> Ajouter
                  </button>
                )}
                {activeTab === 'utilisateurs' && canCreate && (
                  <>
                    <button type="button" className="btn-primary" onClick={() => openAdd('utilisateur')}>
                      <Plus size={15} /> Ajouter
                    </button>
                    {selectedUserId && hasPermission('permission.manage') && (
                      <button
                        type="button"
                        className="btn-action-red"
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
            tabs={allowedTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {activeTab === 'personnel' && (
            <PersonnelTab
              personnelData={personnelData}
              search={search}
              onOpenEdit={canEdit ? (item) => openEdit('personnel', item) : undefined}
              onDelete={canDelete ? (item) => setDeleteTarget({ kind: 'personnel', item }) : undefined}
              loading={loading.personnel}
            />
          )}

          {activeTab === 'roles' && (
            <RolesTab
              rolesData={rolesData}
              search={search}
              onOpenEdit={canEdit ? openEditRole : undefined}
              onDelete={canDelete ? (item) => setDeleteTarget({ kind: 'role', item }) : undefined}
              loading={loading.roles}
            />
          )}

          {activeTab === 'utilisateurs' && (
            <UtilisateursTab
              usersData={usersData}
              search={search}
              selectedUserId={selectedUserId}
              setSelectedUserId={setSelectedUserId}
              onOpenEdit={canEdit ? (item) => openEdit('utilisateur', item) : undefined}
              onDelete={canDelete ? (item) => setDeleteTarget({ kind: 'utilisateur', item }) : undefined}
              loading={loading.users}
            />
          )}
        </>
      )}

      <PersonnelModal
        modal={modal}
        setModal={setModal}
        setPersonnelData={setPersonnelData}
        setUsersData={setUsersData}
        setRolesData={setRolesData}
        rolesData={rolesData}      
        usersData={usersData}      
      />


      <ConfirmModal
        open={Boolean(deleteTarget)}
        title={
          deleteTarget?.kind === 'role'
            ? 'Supprimer le rôle'
            : deleteTarget?.kind === 'personnel'
              ? 'Supprimer le membre'
              : 'Supprimer l\'utilisateur'
        }
        message={
          deleteTarget && deleteTarget.kind === 'personnel'
            ? `Voulez-vous vraiment supprimer le membre ${(deleteTarget.item as Personnel).nom} ?`
            : deleteTarget?.kind === 'role'
              ? `Voulez-vous vraiment supprimer le rôle ${(deleteTarget.item as Role).nom_affichage} ?`
              : deleteTarget
                ? `Voulez-vous vraiment supprimer l'utilisateur ${(deleteTarget.item as User).name} ?`
                : ''
        }
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
