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
import { factures, reglements } from '@/data/mockData';
import { formatCurrency, formatDateTime } from '@/utils/formatters';
import type { Reglement } from '@/types';

const modes = ['espèces', 'virement', 'carte', 'chèque', 'mobile money'];

interface ReglementModalState {
  item: Reglement | null;
}

export function ReglementsPage() {
  const [reglementsData, setReglementsData] = useState<Reglement[]>(reglements);
  const [modal, setModal] = useState<ReglementModalState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Reglement | null>(null);
  const [search, setSearch] = useState('');

  const totalReglements = reglementsData.reduce(
    (sum, row) => sum + Number(row.montant),
    0,
  );

  const filteredReglements = search
    ? reglementsData.filter((row) =>
        [
          row.facture?.numero,
          row.facture?.vente?.client?.nom,
          row.mode,
          row.reference ?? '',
          row.montant,
        ]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(search.toLowerCase())),
      )
    : reglementsData;

  const columns: Column<Reglement>[] = [
    { key: 'id', label: '#' },
    {
      key: 'facture',
      label: 'Facture',
      render: (row) => row.facture?.numero ?? '—',
    },
    {
      key: 'client',
      label: 'Client',
      render: (row) => row.facture?.vente?.client?.nom ?? '—',
    },
    {
      key: 'montant',
      label: 'Montant',
      render: (row) => formatCurrency(row.montant),
    },
    { key: 'mode', label: 'Mode' },
    {
      key: 'date_reglement',
      label: 'Date',
      render: (row) => formatDateTime(row.date_reglement),
    },
    { key: 'reference', label: 'Référence' },
  ];

  const handlePrint = () => {
    window.print();
  };

  const openAdd = () => {
    setModal({ item: null });
  };

  const openEdit = (item: Reglement) => {
    setModal({ item });
  };

  const handleSave = (formData: Record<string, unknown>) => {
    const facture = factures.find((row) => row.id === Number(formData.facture_id));
    const reglementData = {
      facture_id: Number(formData.facture_id),
      montant: String(formData.montant),
      mode: String(formData.mode),
      date_reglement: String(formData.date_reglement),
      reference: (formData.reference as string) || null,
      facture,
    };

    if (modal?.item) {
      setReglementsData((prev) =>
        prev.map((row) =>
          row.id === modal.item?.id ? { ...row, ...reglementData } : row,
        ),
      );
    } else {
      const newReglement: Reglement = {
        id:
          reglementsData.length > 0
            ? Math.max(...reglementsData.map((row) => row.id)) + 1
            : 1,
        ...reglementData,
      };
      setReglementsData((prev) => [...prev, newReglement]);
    }

    setModal(null);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setReglementsData((prev) => prev.filter((row) => row.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const getInitialData = (item: Reglement | null) => ({
    facture_id: item ? String(item.facture_id) : String(factures[0]?.id ?? ''),
    montant: item?.montant ?? '',
    mode: item?.mode ?? 'espèces',
    date_reglement: item
      ? item.date_reglement.slice(0, 16)
      : new Date().toISOString().slice(0, 16),
    reference: item?.reference ?? '',
  });

  const validate = (formData: Record<string, unknown>) => {
    const errors: Record<string, string> = {};

    if (!formData.facture_id) {
      errors.facture_id = 'La facture est obligatoire.';
    }
    if (!formData.montant || Number(formData.montant) <= 0) {
      errors.montant = 'Le montant doit être supérieur à 0.';
    }
    if (!formData.date_reglement) {
      errors.date_reglement = 'La date est obligatoire.';
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
        <label htmlFor="reglement-facture">Facture *</label>
        <select
          id="reglement-facture"
          name="facture_id"
          className="inline-input"
          onChange={(event) => onChange('facture_id', event.target.value)}
        >
          <option value="">— Choisir une facture —</option>
          {factures.map((row) => (
            <option key={row.id} value={row.id}>
              {row.numero} — {formatCurrency(row.montant_total)}
            </option>
          ))}
        </select>
        {errors.facture_id && <span className="form-error">{errors.facture_id}</span>}
      </div>
      <div className="form-field">
        <label htmlFor="reglement-montant">Montant (MGA) *</label>
        <input
          id="reglement-montant"
          name="montant"
          type="number"
          min="0.01"
          step="0.01"
          className="inline-input"
          onChange={(event) => onChange('montant', event.target.value)}
          placeholder="0.00"
        />
        {errors.montant && <span className="form-error">{errors.montant}</span>}
      </div>
      <div className="form-field">
        <label htmlFor="reglement-mode">Mode de paiement *</label>
        <select
          id="reglement-mode"
          name="mode"
          className="inline-input"
          onChange={(event) => onChange('mode', event.target.value)}
        >
          {modes.map((mode) => (
            <option key={mode} value={mode}>
              {mode}
            </option>
          ))}
        </select>
      </div>
      <div className="form-field">
        <label htmlFor="reglement-date">Date du règlement *</label>
        <input
          id="reglement-date"
          name="date_reglement"
          type="datetime-local"
          className="inline-input"
          onChange={(event) => onChange('date_reglement', event.target.value)}
        />
        {errors.date_reglement && (
          <span className="form-error">{errors.date_reglement}</span>
        )}
      </div>
      <div className="form-field">
        <label htmlFor="reglement-reference">Référence</label>
        <input
          id="reglement-reference"
          name="reference"
          type="text"
          className="inline-input"
          onChange={(event) => onChange('reference', event.target.value)}
          placeholder="N° chèque, virement, etc."
        />
      </div>
    </>
  );

  return (
    <div className="page-container">
      <PageHeader
        title="Règlements"
        subtitle={`${reglementsData.length} règlement(s) — ${formatCurrency(totalReglements)} au total`}
      />

      <PageToolbar
        search={search}
        onSearch={setSearch}
        placeholder="Rechercher dans les règlements..."
        actions={
          <button type="button" className="btn-primary" onClick={openAdd}>
            <Plus size={15} /> Ajouter un règlement
          </button>
        }
      />

      <SectionCard title="Liste des règlements" subtitle={`${reglementsData.length} règlement(s)`}>
        <DataTable
          data={filteredReglements}
          columns={columns}
          emptyMessage="Aucun règlement enregistré."
          actionsHeaderLabel="Actions"
          actions={(row) => (
            <RowActions
              onEdit={() => openEdit(row)}
              onDelete={() => setDeleteTarget(row)}
              onPrint={handlePrint}
            />
          )}
        />
      </SectionCard>

      <EntityFormModal
        open={Boolean(modal)}
        onClose={() => setModal(null)}
        title={modal ? `${modal.item ? 'Modifier' : 'Ajouter'} un règlement` : ''}
        editItem={modal?.item ?? null}
        onSubmit={handleSave}
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
        message={`Voulez-vous vraiment supprimer le règlement ${deleteTarget ? `« ${deleteTarget.facture?.numero ?? `n° ${deleteTarget.id}` } »` : ''} ?`}
        confirmLabel="Supprimer"
      />
    </div>
  );
}
