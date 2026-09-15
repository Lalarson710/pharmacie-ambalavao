import { useState } from 'react';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { PageToolbar } from '@/components/PageToolbar';
import { RowActions } from '@/components/RowActions';
import { EntityFormModal } from '@/components/EntityFormModal';
import { ConfirmModal } from '@/components/ConfirmModal';
import { clients } from '@/data/mockData';
import type { Client } from '@/types';

export function ClientsPage() {
  const [data, setData] = useState<Client[]>(clients);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Client | null>(null);
  const [deleteItem, setDeleteItem] = useState<Client | null>(null);
  const [search, setSearch] = useState('');

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

  const handleSubmit = (formData: Record<string, unknown>) => {
    if (editItem) {
      setData((prev) =>
        prev.map((r) =>
          r.id === editItem.id
            ? {
                ...r,
                nom: String(formData.nom),
                telephone: (formData.telephone as string) || null,
                email: (formData.email as string) || null,
                adresse: (formData.adresse as string) || null,
                actif: formData.actif === 'true',
              }
            : r
        )
      );
    } else {
      const newClient: Client = {
        id: data.length > 0 ? Math.max(...data.map((r) => r.id)) + 1 : 1,
        nom: String(formData.nom),
        telephone: (formData.telephone as string) || null,
        email: (formData.email as string) || null,
        adresse: (formData.adresse as string) || null,
        actif: formData.actif === 'true',
      };
      setData((prev) => [...prev, newClient]);
    }
    setModalOpen(false);
  };

  const confirmDelete = () => {
    if (deleteItem) {
      setData((prev) => prev.filter((r) => r.id !== deleteItem.id));
      setDeleteItem(null);
    }
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
      <div className="form-field">
        <label htmlFor="client-nom">Nom *</label>
        <input
          id="client-nom"
          name="nom"
          type="text"
          className="inline-input"
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
          onChange={(e) => onChange('email', e.target.value)}
        />
      </div>
      <div className="form-field">
        <label htmlFor="client-adresse">Adresse</label>
        <input
          id="client-adresse"
          name="adresse"
          type="text"
          className="inline-input"
          onChange={(e) => onChange('adresse', e.target.value)}
        />
      </div>
      <div className="form-field">
        <label htmlFor="client-actif">Actif</label>
        <select
          id="client-actif"
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
          data={filtered}
          columns={columns}
          emptyMessage="Aucun client enregistré."
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
