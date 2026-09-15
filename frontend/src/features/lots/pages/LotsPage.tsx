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
import { lots, produits } from '@/data/mockData';
import { formatDate } from '@/utils/formatters';
import type { Lot } from '@/types';

export function LotsPage() {
  const [data, setData] = useState<Lot[]>(lots);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Lot | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Lot | null>(null);
  const [search, setSearch] = useState('');

  const filtered = search
    ? data.filter(
        (row) =>
          row.numero_lot.toLowerCase().includes(search.toLowerCase()) ||
          (row.produit?.nom ?? '').toLowerCase().includes(search.toLowerCase()),
      )
    : data;

  const columns: Column<Lot>[] = [
    { key: 'id', label: '#' },
    {
      key: 'produit',
      label: 'Produit',
      render: (row) => row.produit?.nom ?? '—',
    },
    { key: 'numero_lot', label: 'N° de lot' },
    {
      key: 'date_peremption',
      label: 'Date de péremption',
      render: (row) => formatDate(row.date_peremption),
    },
    { key: 'quantite', label: 'Quantité' },
  ];

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setData((prev) => prev.filter((row) => row.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const handleEditClick = (row: Lot) => {
    setEditItem(row);
    setModalOpen(true);
  };

  const handleAddClick = () => {
    setEditItem(null);
    setModalOpen(true);
  };

  const handleSubmit = (formData: Record<string, unknown>) => {
    const produit = produits.find((row) => row.id === Number(formData.produit_id));
    const lotData = {
      produit_id: Number(formData.produit_id),
      numero_lot: String(formData.numero_lot),
      date_peremption: String(formData.date_peremption),
      quantite: Number(formData.quantite),
      produit,
    };

    if (editItem) {
      setData((prev) =>
        prev.map((row) => (row.id === editItem.id ? { ...row, ...lotData } : row)),
      );
    } else {
      const newLot: Lot = {
        id: data.length > 0 ? Math.max(...data.map((row) => row.id)) + 1 : 1,
        ...lotData,
      };
      setData((prev) => [...prev, newLot]);
    }
    setModalOpen(false);
  };

  const getInitialData = (item: Lot | null) => ({
    produit_id: item ? String(item.produit_id) : '',
    numero_lot: item?.numero_lot ?? '',
    date_peremption: item?.date_peremption ?? '',
    quantite: item ? String(item.quantite) : '',
  });

  const validate = (formData: Record<string, unknown>): Record<string, string> => {
    const errors: Record<string, string> = {};
    if (!formData.numero_lot) errors.numero_lot = 'Le numéro de lot est obligatoire.';
    if (!formData.date_peremption) errors.date_peremption = 'La date de péremption est obligatoire.';
    if (!formData.quantite || Number(formData.quantite) < 0) {
      errors.quantite = 'La quantité est invalide.';
    }
    return errors;
  };

  const renderForm = (
    _formData: Record<string, unknown>,
    onChange: (name: string, value: string) => void,
    errors: Record<string, string>,
  ) => (
    <>
      <div className="form-field">
        <label htmlFor="lot-produit">Produit *</label>
        <select
          id="lot-produit"
          name="produit_id"
          className="inline-input"
          onChange={(event) => onChange('produit_id', event.target.value)}
        >
          <option value="">— Choisir un produit —</option>
          {produits.map((row) => (
            <option key={row.id} value={row.id}>
              {row.nom}
            </option>
          ))}
        </select>
      </div>
      <div className="form-field">
        <label htmlFor="lot-numero">Numéro de lot *</label>
        <input
          id="lot-numero"
          name="numero_lot"
          type="text"
          className="inline-input"
          onChange={(event) => onChange('numero_lot', event.target.value)}
        />
        {errors.numero_lot && <span className="form-error">{errors.numero_lot}</span>}
      </div>
      <div className="form-field">
        <label htmlFor="lot-date">Date de péremption *</label>
        <input
          id="lot-date"
          name="date_peremption"
          type="date"
          className="inline-input"
          onChange={(event) => onChange('date_peremption', event.target.value)}
        />
        {errors.date_peremption && (
          <span className="form-error">{errors.date_peremption}</span>
        )}
      </div>
      <div className="form-field">
        <label htmlFor="lot-quantite">Quantité *</label>
        <input
          id="lot-quantite"
          name="quantite"
          type="number"
          min="0"
          className="inline-input"
          onChange={(event) => onChange('quantite', event.target.value)}
        />
        {errors.quantite && <span className="form-error">{errors.quantite}</span>}
      </div>
    </>
  );

  return (
    <div className="page-container">
      <PageHeader
        title="Lots"
        subtitle={`${data.length} lot(s) enregistré(s)`}
      />

      <PageToolbar
        search={search}
        onSearch={setSearch}
        placeholder="Rechercher un lot..."
        actions={
          <button type="button" className="btn-primary" onClick={handleAddClick}>
            <Plus size={15} /> Ajouter un lot
          </button>
        }
      />

      <SectionCard title="Liste des lots">
        <DataTable
          data={filtered}
          columns={columns}
          emptyMessage="Aucun lot enregistré."
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
        title={editItem ? 'Modifier le lot' : 'Ajouter un lot'}
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
        message={`Voulez-vous vraiment supprimer le lot « ${deleteTarget?.numero_lot ?? ''} » ?`}
        confirmLabel="Supprimer"
      />
    </div>
  );
}
