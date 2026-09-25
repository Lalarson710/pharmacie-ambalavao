import { useState, useEffect } from 'react';
import { Plus, UserRound } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { PageToolbar } from '@/components/PageToolbar';
import { RowActions } from '@/components/RowActions';
import { EntityFormModal } from '@/components/EntityFormModal';
import { ConfirmModal } from '@/components/ConfirmModal';
import { useToast } from '@/components/Toast';
import type { Client } from '@/types';
import { clientsApi } from '../api/clients';

export function ClientsPage() {
  const { showToast } = useToast();
  const [data, setData] = useState<Client[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Client | null>(null);
  const [deleteItem, setDeleteItem] = useState<Client | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await clientsApi.getAll();
        setData(result);
      } catch (error) {
        console.error('chargement clients:', error);
        showToast('Impossible de charger les clients.', 'error');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [showToast]);

  const filtered = search
    ? data.filter(
        (r) =>
          r.nom.toLowerCase().includes(search.toLowerCase()) ||
          (r.telephone ?? '').includes(search) ||
          (r.email ?? '').toLowerCase().includes(search.toLowerCase()) ||
          (r.adresse ?? '').toLowerCase().includes(search.toLowerCase())
      )
    : data;

  const columns: Column<Client>[] = [
    { key: 'id', label: '#' },
    { key: 'nom', label: 'Nom' },
    { key: 'telephone', label: 'Téléphone' },
    { key: 'email', label: 'Email' },
    { key: 'adresse', label: 'Adresse' },
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

  const handleSubmit = async (formData: Record<string, unknown>) => {
    try {
      const payload = {
        nom: String(formData.nom),
        telephone: (formData.telephone as string) || null,
        email: (formData.email as string) || null,
        adresse: (formData.adresse as string) || null,
        actif: formData.actif === 'true',
      };

      if (editItem) {
        const saved = await clientsApi.update(editItem.id, payload);
        setData((prev) =>
          prev.map((r) => (r.id === editItem.id ? saved : r))
        );
        showToast('Client modifié avec succès', 'success');
      } else {
        const saved = await clientsApi.create(payload);
        setData((prev) => [...prev, saved]);
        showToast('Client créé avec succès', 'success');
      }
      setModalOpen(false);
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
      const msg =
        axiosError.response?.data?.message ||
        (axiosError.response?.data?.errors
          ? Object.values(axiosError.response.data.errors).flat().join(', ')
          : '') ||
        'Erreur lors de la sauvegarde';
      showToast(msg, 'error');
    }
  };

  const confirmDelete = () => {
    if (!deleteItem) return;

    const previous = deleteItem;
    setData((prev) => prev.filter((r) => r.id !== previous.id));
    setDeleteItem(null);

    (async () => {
      try {
        await clientsApi.delete(previous.id);
        showToast('Client supprimé avec succès', 'success');
      } catch (error: unknown) {
        const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
        const specificMessage = axiosError.response?.data?.message;

        if (specificMessage) {
          showToast(specificMessage, 'error');
        } else {
          showToast('Impossible de supprimer ce client.', 'error');
        }

        setData((prev) => [...prev, previous]);
      }
    })();
  };

  const handleEditClick = (row: Client) => {
    setEditItem(row);
    setModalOpen(true);
  };

  const handleAddClick = () => {
    setEditItem(null);
    setModalOpen(true);
  };

  const getInitialData = (item: Client | null) => ({
    nom: item?.nom ?? '',
    telephone: item?.telephone ?? '',
    email: item?.email ?? '',
    adresse: item?.adresse ?? '',
    actif: item ? String(item.actif) : 'true',
  });

  const validate = (fd: Record<string, unknown>): Record<string, string> => {
    const errs: Record<string, string> = {};
    if (!fd.nom) errs.nom = 'Le nom est obligatoire.';
    return errs;
  };

  const renderForm = (
    _formData: Record<string, unknown>,
    onChange: (name: string, value: string) => void,
    errors: Record<string, string>
  ) => (
    <>
      <div className="form-field form-field-full">
        <label htmlFor="client-nom">
          Nom <span className="required-mark">*</span>
        </label>
        <input
          id="client-nom"
          name="nom"
          type="text"
          className="inline-input"
          value={String(_formData.nom ?? '')}
          onChange={(e) => onChange('nom', e.target.value)}
        />
        {errors.nom && <span className="form-error">{errors.nom}</span>}
      </div>
      <div className="form-field">
        <label htmlFor="client-telephone">Téléphone</label>
        <input
          id="client-telephone"
          name="telephone"
          type="text"
          className="inline-input"
          value={String(_formData.telephone ?? '')}
          onChange={(e) => onChange('telephone', e.target.value)}
        />
      </div>
      <div className="form-field">
        <label htmlFor="client-email">Email</label>
        <input
          id="client-email"
          name="email"
          type="email"
          className="inline-input"
          value={String(_formData.email ?? '')}
          onChange={(e) => onChange('email', e.target.value)}
        />
      </div>
      <div className="form-field form-field-full">
        <label htmlFor="client-adresse">Adresse</label>
        <input
          id="client-adresse"
          name="adresse"
          type="text"
          className="inline-input"
          value={String(_formData.adresse ?? '')}
          onChange={(e) => onChange('adresse', e.target.value)}
        />
      </div>
      <div className="form-field">
        <label htmlFor="client-actif">Statut</label>
        <select
          id="client-actif"
          name="actif"
          className="inline-input"
          value={String(_formData.actif ?? 'true')}
          onChange={(e) => onChange('actif', e.target.value)}
        >
          <option value="true">Oui</option>
          <option value="false">Non</option>
        </select>
      </div>
    </>
  );

  return (
    <div className="page-container">
      <PageHeader
        title="Clients"
        subtitle={`${data.length} client(s) enregistré(s)`}
      />

      <PageToolbar
        search={search}
        onSearch={setSearch}
        placeholder="Rechercher un client..."
        actions={
          <button type="button" className="btn-primary" onClick={handleAddClick}>
            <Plus size={15} /> Ajouter
          </button>
        }
      />

      <SectionCard title="Liste des clients">
        <DataTable
          data={loading ? [] : filtered}
          columns={columns}
          emptyMessage={loading ? 'Chargement des clients...' : 'Aucun client enregistré.'}
          actionsHeaderLabel="Actions"
          actions={(row) => (
            <RowActions
              onEdit={() => handleEditClick(row)}
              onDelete={() => setDeleteItem(row)}
            />
          )}
        />
      </SectionCard>

      <EntityFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editItem ? 'Modifier le client' : 'Ajouter un client'}
        icon={<UserRound size={18} />}
        subtitle={
          editItem
            ? 'Actualisez les informations de contact de ce client.'
            : 'Enregistrez un nouveau client pour vos ventes.'
        }
        editItem={editItem}
        onSubmit={handleSubmit}
        renderForm={renderForm}
        getInitialData={getInitialData}
        validate={validate}
        size="md"
      />

      <ConfirmModal
        open={!!deleteItem}
        title="Supprimer le client"
        message={`Confirmer la suppression de « ${deleteItem?.nom ?? ''} » ?`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteItem(null)}
      />
    </div>
  );
}
