import { type Dispatch, type SetStateAction } from 'react';
import { EntityFormModal } from '@/components/EntityFormModal';
import { roles, utilisateurs } from '@/data/mockData';
import type { Personnel, Role, User } from '@/types';
import { PersonnelForm } from '../../components/PersonnelForm';
import { UtilisateurForm } from '../../components/UtilisateurForm';
import { RoleForm } from '../../components/RoleForm';

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
}

export function PersonnelModal({
  modal,
  setModal,
  setPersonnelData,
  setUsersData,
  setRolesData,
}: PersonnelModalProps) {
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

    if (modal.kind === 'personnel') {
      const personnelRecord = {
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

      setPersonnelData((prev) => {
        if (modal.item) {
          return prev.map((row) =>
            row.id === modal.item?.id ? { ...row, ...personnelRecord } : row
          );
        }

        const nextId = prev.length > 0 ? Math.max(...prev.map((row) => row.id)) + 1 : 1;
        return [...prev, { id: nextId, ...personnelRecord }];
      });
    }

    if (modal.kind === 'utilisateur') {
      const role = roles.find((row) => row.id === Number(formData.role_id)) ?? null;
      const password = formData.password as string | undefined;
      
      const userData: Omit<User, 'id'> = {
        name: String(formData.name),
        email: String(formData.email),
        email_verified_at:
          modal.item && 'email_verified_at' in modal.item
            ? modal.item.email_verified_at
            : new Date().toISOString(),
        role_id: formData.role_id ? Number(formData.role_id) : null,
        role,
        permissions:
          modal.item && 'permissions' in modal.item ? modal.item.permissions : [],
        ...(password ? { password } : {}),
      };

      setUsersData((prev) => {
        if (modal.item) {
          return prev.map((row) =>
            row.id === modal.item?.id ? { ...row, ...userData } : row
          );
        }

        const nextId = prev.length > 0 ? Math.max(...prev.map((row) => row.id)) + 1 : 1;
        return [...prev, { id: nextId, ...userData }];
      });
    }

    setModal(null);
  };

  const getInitialData = (item: Personnel | User | Role | null) => {
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
        date_embauche: row?.date_embauche ?? '',
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
      if (isCreation && (!password || password.length < 6)) {
        errors.password = 'Le mot de passe doit contenir au moins 6 caractères.';
      }
      if (!isCreation && password && password.length < 6) {
        errors.password = 'Le mot de passe doit contenir au moins 6 caractères.';
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
