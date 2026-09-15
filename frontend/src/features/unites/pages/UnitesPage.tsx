import { useState } from 'react';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { PageToolbar } from '@/components/PageToolbar';
import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { RowActions } from '@/components/RowActions';
import { EntityFormModal } from '@/components/EntityFormModal';
import { ConfirmModal } from '@/components/ConfirmModal';
import { unites } from '@/data/mockData';
import type { Unite } from '@/types';

export function UnitesPage() {
  const [data, setData] = useState<Unite[]>(unites);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Unite | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Unite | null>(null);
  const [search, setSearch] = useState('');

  const filtered = search
    ? data.filter(
        (row) =>
          row.nom.toLowerCase().includes(search.toLowerCase()) ||
          (row.abreviation ?? '').toLowerCase().includes(search.toLowerCase()),
      )
    : data;

  const columns: Column<Unite>[] = [
    { key: 'id', label: '#' },
    { key: 'nom', label: 'Nom' },
    { key: 'abreviation', label: 'Abréviation' },
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
        prev.map((row) =>
          row.id === editItem.id
            ? {
                ...row,
                nom: String(formData.nom),
                abreviation: (formData.abreviation as string) || null,
                actif: formData.actif === 'true',
              }
            : row,
        ),
      );
    } else {
      const newUnite: Unite = {
        id: data.length > 0 ? Math.max(...data.map((row) => row.id)) + 1 : 1,
        nom: String(formData.nom),
        abreviation: (formData.abreviation as string) || null,
        actif: formData.actif === 'true',
      };
      setData((prev) => [...prev, newUnite]);
    }
    setModalOpen(false);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setData((prev) => prev.filter((row) => row.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const handleEditClick = (row: Unite) => {
    setEditItem(row);
    setModalOpen(true);
  };

  const handleAddClick = () => {
    setEditItem(null);
    setModalOpen(true);
  };

  const getInitialData = (item: Unite | null) => ({
    nom: item?.nom ?? '',
    abreviation: item?.abreviation ?? '',
    actif: item ? String(item.actif) : 'true',
  });

  const validate = (formData: Record<string, unknown>): Record<string, string> => {
    const errors: Record<string, string> = {};
    if (!formData.nom) errors.nom = 'Le nom est obligatoire.';
    return errors;
  };

  const renderForm = (
    _formData: Record<string, unknown>,
    onChange: (name: string, value: string) => void,
    errors: Record<string, string>,
  ) => (
    <>
      <div className="form-field">
        <label htmlFor="unite-nom">Nom *</label>
        <input
          id="unite-nom"
          name="nom"
          type="text"
          className="inline-input"
          onChange={(event) => onChange('nom', event.target.value)}
        />
        {errors.nom && <span className="form-error">{errors.nom}</span>}
      </div>
      <div className="form-field">
        <label htmlFor="unite-abreviation">Abréviation</label>
        <input
          id="unite-abreviation"
          name="abreviation"
          type="text"
          className="inline-input"
          onChange={(event) => onChange('abreviation', event.target.value)}
        />
      </div>
      <div className="form-field">
        <label htmlFor="unite-actif">Actif</label>
        <select
          id="unite-actif"
          name="actif"
          className="inline-input"
          onChange={(event) => onChange('actif', event.target.value)}
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
        title="Unités"
        subtitle={`${data.length} unité(s) enregistrée(s)`}
      />

      <PageToolbar
        search={search}
        onSearch={setSearch}
        placeholder="Rechercher une unité..."
        actions={
          <button type="button" className="btn-primary" onClick={handleAddClick}>
            <Plus size={15} /> Ajouter une unité
          </button>
        }
      />

      <SectionCard title="Liste des unités">
        <DataTable
          data={filtered}
          columns={columns}
          emptyMessage="Aucune unité enregistrée."
          actionsHeaderLabel="Actions"
          actions={(row) => (
            <RowActions
              onEdit={() => handleEditClick(row)}
              onDelete={() => setDeleteTarget(row)}
            />
          )}
        />
      </SectionCard>

      <EntityFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editItem ? "Modifier l'unité" : 'Ajouter une unité'}
        editItem={editItem}
        onSubmit={handleSubmit}
        renderForm={renderForm}
        getInitialData={getInitialData}
        validate={validate}
        size="md"
      />

      <ConfirmModal
        open={Boolean(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Confirmer la suppression"
        message={`Voulez-vous vraiment supprimer l'unité « ${deleteTarget?.nom ?? ''} » ?`}
        confirmLabel="Supprimer"
      />
    </div>
  );
}
