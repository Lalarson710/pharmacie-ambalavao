import { type Dispatch, type SetStateAction } from 'react';
import { EntityFormModal } from '@/components/EntityFormModal';
import type { Personnel, Role, User } from '@/types';
import { PersonnelForm } from '../../components/PersonnelForm';
import { UtilisateurForm } from '../../components/UtilisateurForm';
import { RoleForm } from '../../components/RoleForm';
import { rolesApi } from '../../api/roles';
import { utilisateursApi } from '../../api/utilisateurs';
import { useToast } from '@/components/Toast';
import { personnelApi } from '../../api/personnel';

export type PersonnelModalKind = 'personnel' | 'utilisateur' | 'role';

export interface PersonnelModalState {
  kind: PersonnelModalKind;
  item: Personnel | User | Role | null;
}

export interface PersonnelDeleteTarget {
  kind: PersonnelModalKind;
  item: Personnel | User | Role;
}

interface PersonnelModalProps {
  modal: PersonnelModalState | null;
  setModal: Dispatch<SetStateAction<PersonnelModalState | null>>;
  setPersonnelData: Dispatch<SetStateAction<Personnel[]>>;
  setUsersData: Dispatch<SetStateAction<User[]>>;
  setRolesData: Dispatch<SetStateAction<Role[]>>;
  rolesData: Role[];
  usersData: User[];
}

export function PersonnelModal({
  modal,
  setModal,
  setPersonnelData,
  setUsersData,
  setRolesData,
  rolesData,
  usersData,
}: PersonnelModalProps) {
  const { showToast } = useToast();

  const handleSave = async (formData: Record<string, unknown>) => {
    if (!modal) return;

    try {
      if (modal.kind === 'role') {
        const roleData = {
          nom: String(formData.nom),
          nom_affichage: String(formData.nom_affichage),
        };

        let savedRole: Role;
        if (modal.item) {
          savedRole = await rolesApi.update(modal.item.id, roleData);
          showToast('Rôle modifié avec succès', 'success');
        } else {
          savedRole = await rolesApi.create(roleData);
          showToast('Rôle créé avec succès', 'success');
        }

        setRolesData((prev) => {
          if (modal.item) {
            return prev.map((row) => (row.id === modal.item!.id ? savedRole : row));
          }
          return [...prev, savedRole];
        });
      }

      if (modal.kind === 'personnel') {
        const personnelData = {
          user_id: formData.user_id ? Number(formData.user_id) : null,
          nom: String(formData.nom),
          prenom: String(formData.prenom),
          telephone: (formData.telephone as string) || null,
          email: (formData.email as string) || null,
          adresse: (formData.adresse as string) || null,
          fonction: String(formData.fonction),
          date_embauche: (formData.date_embauche as string) || null,
          actif: formData.actif === 'true',
        };

        let savedPersonnel: Personnel;
        if (modal.item) {
          savedPersonnel = await personnelApi.update(modal.item.id, personnelData);
          showToast('Membre modifié avec succès', 'success');
        } else {
          savedPersonnel = await personnelApi.create(personnelData);
          showToast('Membre créé avec succès', 'success');
        }

        setPersonnelData((prev) => {
          if (modal.item) {
            return prev.map((row) => (row.id === modal.item!.id ? savedPersonnel : row));
          }
          return [...prev, savedPersonnel];
        });
      }


            if (modal.kind === 'utilisateur') {
              const password = formData.password as string | undefined;

              // role_id est valide (obligatoire) par validate() juste avant
              const roleId = Number(formData.role_id);

              const userData = {
                name: String(formData.name),
                email: String(formData.email),
                role_id: roleId,
                ...(password !== undefined && password !== '' ? { password } : {}),
              };

              let savedUser: User;
              if (modal.item) {
                // UPDATE : password optionnel
                try {
                  savedUser = await utilisateursApi.update(modal.item.id, userData);
                  showToast('Utilisateur modifié avec succès', 'success');
                } catch (error) {
                  const axiosError = error as { response?: { status?: number; data?: { message?: string } } };

                  // ── FEATURE 2 : 401 = mot de passe changé → déconnexion automatique ──
                  if (axiosError.response?.status === 401) {
                    showToast('Mot de passe mis à jour. Déconnexion en cours...', 'info');
                    // L'intercepteur apiClient.ts redirige automatiquement vers /login
                    // On vide le store manuellement pour une déconnexion immédiate
                    setModal(null);
                    return;
                  }

                  throw error; // relancer pour le catch global
                }
              } else {
                // CREATE : password REQUIS (validation assure qu'il est présent)
                const createData = {
                  name: String(formData.name),
                  email: String(formData.email),
                  role_id: roleId,
                  password: String(formData.password), // toujours envoyé pour création
                };
                savedUser = await utilisateursApi.create(createData);
                showToast('Utilisateur créé avec succès', 'success');
              }

              const savedRole = rolesData.find((r) => r.id === savedUser.role_id) ?? null;

              setUsersData((prev) => {
                const userWithRole = { ...savedUser, role: savedRole, permissions: [] };
                if (modal.item) {
                  return prev.map((row) => (row.id === modal.item!.id ? userWithRole : row));
                }
                return [...prev, userWithRole];
              });
            }



      setModal(null);
        } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
      console.error('Erreur sauvegarde:', axiosError.response?.data || error);
      const msg = axiosError.response?.data?.message 
        || (axiosError.response?.data?.errors ? Object.values(axiosError.response.data.errors).flat().join(', ') : '')
        || 'Erreur lors de la sauvegarde';
      showToast(msg, 'error');
    }
  }

  const getInitialData = (item: Personnel | User | Role | null) => {
    console.log('getInitialData called:', { modalKind: modal?.kind, item });

    if (!modal) return {};

    if (modal.kind === 'personnel') {
      const row = item as Personnel | null;
      return {
        user_id: row?.user_id ? String(row.user_id) : '',
        nom: row?.nom ?? '',
        prenom: row?.prenom ?? '',
        telephone: row?.telephone ?? '',
        email: row?.email ?? '',
        adresse: row?.adresse ?? '',
        fonction: row?.fonction ?? '',
        date_embauche: row?.date_embauche ? row.date_embauche.split('T')[0] : '',
        actif: row?.actif === false ? 'false' : 'true',
      };
    }

    if (modal.kind === 'utilisateur') {
      const row = item as User | null;
      return {
        name: row?.name ?? '',
        email: row?.email ?? '',
        role_id: row?.role_id ? String(row.role_id) : '',
        password: '',
      };
    }

    const row = item as Role | null;
    return {
      nom: row?.nom ?? '',
      nom_affichage: row?.nom_affichage ?? '',
    };
  };

  const validate = (formData: Record<string, unknown>) => {
    const errors: Record<string, string> = {};

    if (modal?.kind === 'personnel') {
      if (!formData.nom) errors.nom = 'Le nom est obligatoire.';
      if (!formData.prenom) errors.prenom = 'Le prénom est obligatoire.';
      if (!formData.fonction) errors.fonction = 'La fonction est obligatoire.';
    }

    if (modal?.kind === 'utilisateur') {
      if (!formData.name) errors.name = 'Le nom est obligatoire.';
      if (!formData.email) errors.email = "L'email est obligatoire.";
      if (!formData.role_id) errors.role_id = 'Le rôle est obligatoire.';

      const isCreation = !modal.item;
      const password = formData.password as string | undefined;
      if (isCreation && (!password || password.length < 8)) {
        errors.password = 'Le mot de passe doit contenir au moins 8 caractères.';
      }
      if (!isCreation && password && password.length < 8) {
        errors.password = 'Le mot de passe doit contenir au moins 8 caractères.';
      }
    }

    if (modal?.kind === 'role') {
      if (!formData.nom) errors.nom = 'Le nom est obligatoire.';
      if (!formData.nom_affichage) {
        errors.nom_affichage = "Le nom d'affichage est obligatoire.";
      }
    }

    return errors;
  };

  const renderForm = (
    _formData: Record<string, unknown>,
    onChange: (name: string, value: string) => void,
    errors: Record<string, string>
  ) => {
    if (!modal) return null;

    if (modal.kind === 'personnel') {
      return (
        <PersonnelForm
          formData={_formData}
          onChange={onChange}
          errors={errors}
          item={modal.item as Personnel | null}
          users={usersData}
        />
      );
    }

    if (modal.kind === 'role') {
      return (
        <RoleForm
          formData={_formData}
          onChange={onChange}
          errors={errors}
          item={modal.item as Role | null}
        />
      );
    }

    const isCreation = !modal.item;
    return (
      <UtilisateurForm
        formData={_formData}
        onChange={onChange}
        errors={errors}
        item={modal.item as User | null}
        isCreation={isCreation}
        roles={rolesData}
      />
    );
  };

  return (
    <EntityFormModal
      open={Boolean(modal)}
      onClose={() => setModal(null)}
      title={
        modal?.kind === 'role'
          ? modal?.item
            ? 'Modifier le rôle'
            : 'Ajouter un rôle'
          : modal?.kind === 'personnel'
            ? modal?.item
              ? 'Modifier le membre'
              : 'Ajouter un membre'
            : modal?.item
              ? "Modifier l'utilisateur"
              : 'Ajouter un utilisateur'
      }
      editItem={modal?.item ?? null}
      onSubmit={handleSave}
      renderForm={renderForm}
      getInitialData={getInitialData}
      validate={validate}
      size="md"
    />
  );
}
