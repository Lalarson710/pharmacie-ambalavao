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
import { categories } from '@/data/mockData';
import type { Categorie } from '@/types';

export function CategoriesPage() {
  const [data, setData] = useState<Categorie[]>(categories);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Categorie | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Categorie | null>(null);
  const [search, setSearch] = useState('');

  const filtered = search
    ? data.filter(
        (r) =>
          r.nom.toLowerCase().includes(search.toLowerCase()) ||
          (r.description ?? '').toLowerCase().includes(search.toLowerCase())
      )
    : data;

  const columns: Column<Categorie>[] = [
    { key: 'id', label: '#' },
    { key: 'nom', label: 'Nom' },
    { key: 'description', label: 'Description' },
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
                description: (formData.description as string) || null,
                actif: formData.actif === 'true',
              }
            : r
        )
      );
    } else {
      const newCat: Categorie = {
        id: data.length > 0 ? Math.max(...data.map((r) => r.id)) + 1 : 1,
        nom: String(formData.nom),
        description: (formData.description as string) || null,
        actif: formData.actif === 'true',
      };
      setData((prev) => [...prev, newCat]);
    }
    setModalOpen(false);
  };

  const handleDelete = (row: Categorie) => {
    setCategoryToDelete(row);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      setData((prev) => prev.filter((r) => r.id !== categoryToDelete.id));
      setCategoryToDelete(null);
    }
  };

  const handleEditClick = (row: Categorie) => {
    setEditItem(row);
    setModalOpen(true);
  };

  const handleAddClick = () => {
    setEditItem(null);
    setModalOpen(true);
  };

  const getInitialData = (item: Categorie | null) => ({
    nom: item?.nom ?? '',
    description: item?.description ?? '',
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
        <label htmlFor="nom">Nom *</label>
        <input
          id="nom"
          name="nom"
          type="text"
          className="inline-input"
          onChange={(e) => onChange('nom', e.target.value)}
        />
        {errors.nom && <span className="form-error">{errors.nom}</span>}
      </div>
      <div className="form-field">
        <label htmlFor="description">Description</label>
        <input
          id="description"
          name="description"
          type="text"
          className="inline-input"
          onChange={(e) => onChange('description', e.target.value)}
        />
      </div>
      <div className="form-field">
        <label htmlFor="actif">Actif</label>
        <select
          id="actif"
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
        title="Catégories"
        subtitle={`${data.length} catégorie(s) enregistrée(s)`}
      />

      <PageToolbar
        search={search}
        onSearch={setSearch}
        placeholder="Rechercher une catégorie..."
        actions={
          <button type="button" className="btn-primary" onClick={handleAddClick}>
            <Plus size={16} />
            + Ajouter une catégorie
          </button>
        }
      />

      <SectionCard title="Liste des catégories">
        <DataTable
          data={filtered}
          columns={columns}
          emptyMessage="Aucune catégorie enregistrée."
          actionsHeaderLabel="Actions"
          actions={(row) => (
            <RowActions
              onEdit={() => handleEditClick(row)}
              onDelete={() => handleDelete(row)}
            />
          )}
        />
      </SectionCard>

      <EntityFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editItem ? 'Modifier la catégorie' : 'Ajouter une catégorie'}
        editItem={editItem}
        onSubmit={handleSubmit}
        renderForm={renderForm}
        getInitialData={getInitialData}
        validate={validate}
        size="md"
      />

      <ConfirmModal
        open={Boolean(categoryToDelete)}
        onCancel={() => setCategoryToDelete(null)}
        onConfirm={confirmDelete}
        title="Confirmer la suppression"
        message={`Voulez-vous vraiment supprimer la catégorie « ${categoryToDelete?.nom ?? ''} » ?`}
        confirmLabel="Supprimer"
      />
    </div>
  );
}
