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
import { personnel, roles, utilisateurs } from '@/data/mockData';
import { formatDate } from '@/utils/formatters';
import type { Personnel, Role, User } from '@/types';

const personnelTabs = [
  { id: 'personnel', label: 'Personnel' },
  { id: 'utilisateurs', label: 'Utilisateurs' },
];

type PersonnelModalKind = 'personnel' | 'utilisateur';

interface PersonnelModalState {
  kind: PersonnelModalKind;
  item: Personnel | User | null;
}

interface PersonnelDeleteTarget {
  kind: PersonnelModalKind;
  item: Personnel | User;
}

export function PersonnelPage() {
  const [activeTab, setActiveTab] = useState('personnel');
  const [personnelData, setPersonnelData] = useState<Personnel[]>(personnel);
  const [usersData, setUsersData] = useState<User[]>(utilisateurs);
  const [modal, setModal] = useState<PersonnelModalState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PersonnelDeleteTarget | null>(null);
  const [search, setSearch] = useState('');

  const filteredPersonnel = search
    ? personnelData.filter((row) =>
        [
          row.id,
          row.nom,
          row.prenom,
          row.telephone ?? '',
          row.email ?? '',
          row.adresse ?? '',
          row.fonction,
          row.date_embauche ?? '',
        ]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(search.toLowerCase()))
      )
    : personnelData;

  const filteredUsers = search
    ? usersData.filter((row) =>
        [row.id, row.name, row.email, row.role?.nom_affichage ?? '']
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(search.toLowerCase()))
      )
    : usersData;

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

  const openAdd = (kind: PersonnelModalKind) => {
    setModal({ kind, item: null });
  };

  const openEdit = (kind: PersonnelModalKind, item: Personnel | User) => {
    setModal({ kind, item });
  };

  const handleSave = (formData: Record<string, unknown>) => {
    if (!modal) return;

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

      setPersonnelData((prev) => {
        if (modal.item) {
          return prev.map((row) =>
            row.id === modal.item?.id ? { ...row, ...personnelData } : row
          );
        }

        const nextId = prev.length > 0 ? Math.max(...prev.map((row) => row.id)) + 1 : 1;
        return [...prev, { id: nextId, ...personnelData }];
      });
    }

    if (modal.kind === 'utilisateur') {
      const role = roles.find((row) => row.id === Number(formData.role_id)) ?? null;
      const userData: Omit<User, 'id'> = {
        name: String(formData.name),
        email: String(formData.email),
        email_verified_at: modal.item && 'email_verified_at' in modal.item
          ? modal.item.email_verified_at
          : new Date().toISOString(),
        role_id: formData.role_id ? Number(formData.role_id) : null,
        role,
        permissions: modal.item && 'permissions' in modal.item ? modal.item.permissions : [],
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

  const confirmDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.kind === 'personnel') {
      setPersonnelData((prev) => prev.filter((row) => row.id !== deleteTarget.item.id));
    } else {
      setUsersData((prev) => prev.filter((row) => row.id !== deleteTarget.item.id));
    }

    setDeleteTarget(null);
  };

  const getInitialData = (item: Personnel | User | null) => {
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

    const row = item as User | null;
    return {
      name: row?.name ?? '',
      email: row?.email ?? '',
      role_id: row?.role_id ? String(row.role_id) : '',
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
      if (!formData.email) errors.email = 'L’email est obligatoire.';
      if (!formData.role_id) errors.role_id = 'Le rôle est obligatoire.';
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
        <>
          <div className="form-field">
            <label htmlFor="personnel-utilisateur">Utilisateur</label>
            <select
              id="personnel-utilisateur"
              name="user_id"
              className="inline-input"
              onChange={(e) => onChange('user_id', e.target.value)}
            >
              <option value="">Aucun utilisateur</option>
              {utilisateurs.map((row) => (
                <option key={row.id} value={row.id}>
                  {row.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="personnel-nom">Nom *</label>
            <input
              id="personnel-nom"
              name="nom"
              type="text"
              className="inline-input"
              onChange={(e) => onChange('nom', e.target.value)}
            />
            {errors.nom && <span className="form-error">{errors.nom}</span>}
          </div>
          <div className="form-field">
            <label htmlFor="personnel-prenom">Prénom *</label>
            <input
              id="personnel-prenom"
              name="prenom"
              type="text"
              className="inline-input"
              onChange={(e) => onChange('prenom', e.target.value)}
            />
            {errors.prenom && <span className="form-error">{errors.prenom}</span>}
          </div>
          <div className="form-field">
            <label htmlFor="personnel-telephone">Téléphone</label>
            <input
              id="personnel-telephone"
              name="telephone"
              type="text"
              className="inline-input"
              onChange={(e) => onChange('telephone', e.target.value)}
            />
          </div>
          <div className="form-field">
            <label htmlFor="personnel-email">Email</label>
            <input
              id="personnel-email"
              name="email"
              type="email"
              className="inline-input"
              onChange={(e) => onChange('email', e.target.value)}
            />
          </div>
          <div className="form-field">
            <label htmlFor="personnel-adresse">Adresse</label>
            <input
              id="personnel-adresse"
              name="adresse"
              type="text"
              className="inline-input"
              onChange={(e) => onChange('adresse', e.target.value)}
            />
          </div>
          <div className="form-field">
            <label htmlFor="personnel-fonction">Fonction *</label>
            <input
              id="personnel-fonction"
              name="fonction"
              type="text"
              className="inline-input"
              onChange={(e) => onChange('fonction', e.target.value)}
            />
            {errors.fonction && <span className="form-error">{errors.fonction}</span>}
          </div>
          <div className="form-field">
            <label htmlFor="personnel-date-embauche">Date d’embauche</label>
            <input
              id="personnel-date-embauche"
              name="date_embauche"
              type="date"
              className="inline-input"
              onChange={(e) => onChange('date_embauche', e.target.value)}
            />
          </div>
          <div className="form-field">
            <label htmlFor="personnel-actif">Actif</label>
            <select
              id="personnel-actif"
              name="actif"
              className="inline-input"
              onChange={(e) => onChange('actif', e.target.value)}
            >
              <option value="true">Oui</option>
              <option value="false">Non</option>
            </select>
          </div>
        </>
      );
    }

    return (
      <>
        <div className="form-field">
          <label htmlFor="utilisateur-nom">Nom *</label>
          <input
            id="utilisateur-nom"
            name="name"
            type="text"
            className="inline-input"
            onChange={(e) => onChange('name', e.target.value)}
          />
          {errors.name && <span className="form-error">{errors.name}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="utilisateur-email">Email *</label>
          <input
            id="utilisateur-email"
            name="email"
            type="email"
            className="inline-input"
            onChange={(e) => onChange('email', e.target.value)}
          />
          {errors.email && <span className="form-error">{errors.email}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="utilisateur-role">Rôle *</label>
          <select
            id="utilisateur-role"
            name="role_id"
            className="inline-input"
            onChange={(e) => onChange('role_id', e.target.value)}
          >
            <option value="">— Choisir un rôle —</option>
            {roles.map((row: Role) => (
              <option key={row.id} value={row.id}>
                {row.nom_affichage}
              </option>
            ))}
          </select>
          {errors.role_id && <span className="form-error">{errors.role_id}</span>}
        </div>
      </>
    );
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
          <button type="button" className="btn-primary" onClick={() => openAdd(activeTab === 'personnel' ? 'personnel' : 'utilisateur')}>
            <Plus size={15} /> Ajouter
          </button>
        }
      />

      <PageTabs
        tabs={personnelTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'personnel' && (
        <SectionCard title="Liste du personnel" subtitle={`${personnelData.length} membre(s)`}>
          <DataTable
            data={filteredPersonnel}
            columns={personnelColumns}
            emptyMessage="Aucun membre du personnel."
            actionsHeaderLabel="Actions"
            actions={(row) => (
              <RowActions
                onEdit={() => openEdit('personnel', row)}
                onDelete={() => setDeleteTarget({ kind: 'personnel', item: row })}
              />
            )}
          />
        </SectionCard>
      )}

      {activeTab === 'utilisateurs' && (
        <SectionCard title="Utilisateurs" subtitle={`${usersData.length} utilisateur(s)`}>
          <DataTable
            data={filteredUsers}
            columns={utilisateurColumns}
            emptyMessage="Aucun utilisateur."
            actionsHeaderLabel="Actions"
            actions={(row) => (
              <RowActions
                onEdit={() => openEdit('utilisateur', row)}
                onDelete={() => setDeleteTarget({ kind: 'utilisateur', item: row })}
              />
            )}
          />
        </SectionCard>
      )}

      <EntityFormModal
        open={Boolean(modal)}
        onClose={() => setModal(null)}
        title={
          modal?.kind === 'personnel'
            ? (modal?.item ? 'Modifier le membre' : 'Ajouter un membre')
            : (modal?.item ? 'Modifier l’utilisateur' : 'Ajouter un utilisateur')
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
        title={deleteTarget?.kind === 'personnel' ? 'Supprimer le membre' : 'Supprimer l’utilisateur'}
        message={
          deleteTarget && deleteTarget.kind === 'personnel'
            ? `Voulez-vous vraiment supprimer le membre ${(deleteTarget.item as Personnel).nom} ?`
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
