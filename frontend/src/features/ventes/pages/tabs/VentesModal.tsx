import { type Dispatch, type SetStateAction } from 'react';
import { EntityFormModal } from '@/components/EntityFormModal';
import { clients, factures } from '@/data/mockData';
import type { Facture, Reglement, Vente } from '@/types';

export type VenteModalKind = 'vente' | 'reglement';

export interface VenteModalState {
  kind: VenteModalKind;
  item: Vente | Reglement | null;
}

interface VentesModalProps {
  modal: VenteModalState | null;
  setModal: Dispatch<SetStateAction<VenteModalState | null>>;
  data: Vente[];
  setData: Dispatch<SetStateAction<Vente[]>>;
  reglementsData: Reglement[];
  setReglementsData: Dispatch<SetStateAction<Reglement[]>>;
}

export function VentesModal({
  modal,
  setModal,
  data,
  setData,
  reglementsData,
  setReglementsData,
}: VentesModalProps) {
  const handleSave = (formData: Record<string, unknown>) => {
    if (!modal) return;

    if (modal.kind === 'vente') {
      const client = clients.find((row) => row.id === Number(formData.client_id));
      const venteData = {
        client_id: Number(formData.client_id) || null,
        numero: String(formData.numero),
        date_vente: String(formData.date_vente),
        montant_total: String(formData.montant_total),
        statut: formData.statut as Vente['statut'],
        observation: (formData.observation as string) || null,
        client,
      };

      if (modal.item) {
        setData((prev) =>
          prev.map((row) => (row.id === modal.item?.id ? { ...row, ...venteData } : row))
        );
      } else {
        const newVente: Vente = {
          id: data.length > 0 ? Math.max(...data.map((row) => row.id)) + 1 : 1,
          ...venteData,
        };
        setData((prev) => [...prev, newVente]);
      }
    }

    if (modal.kind === 'reglement') {
      const facture = factures.find((row) => row.id === Number(formData.facture_id));
      const reglementData = {
        facture_id: Number(formData.facture_id),
        montant: String(formData.montant),
        mode: String(formData.mode),
        date_reglement: String(formData.date_reglement),
        reference: (formData.reference as string) || null,
        facture,
      };

      if (modal.item) {
        setReglementsData((prev) =>
          prev.map((row) => (row.id === modal.item?.id ? { ...row, ...reglementData } : row))
        );
      } else {
        const newReglement: Reglement = {
          id: reglementsData.length > 0 ? Math.max(...reglementsData.map((row) => row.id)) + 1 : 1,
          ...reglementData,
        };
        setReglementsData((prev) => [...prev, newReglement]);
      }
    }

    setModal(null);
  };

  const getInitialData = (item: Vente | Reglement | null) => {
    if (!modal) return {};

    if (modal.kind === 'vente') {
      const row = item as Vente | null;
      return {
        client_id: row?.client_id ? String(row.client_id) : '',
        numero: row?.numero ?? '',
        date_vente: row?.date_vente ?? new Date().toISOString().slice(0, 10),
        montant_total: row?.montant_total ?? '',
        statut: row?.statut ?? 'brouillon',
        observation: row?.observation ?? '',
      };
    }

    const row = item as Reglement | null;
    return {
      facture_id: row ? String(row.facture_id) : String(factures[0]?.id ?? ''),
      montant: row?.montant ?? '',
      mode: row?.mode ?? 'espèces',
      date_reglement: row?.date_reglement ? row.date_reglement.slice(0, 16) : new Date().toISOString().slice(0, 16),
      reference: row?.reference ?? '',
    };
  };

  const validate = (formData: Record<string, unknown>) => {
    const errors: Record<string, string> = {};
    if (modal?.kind === 'vente') {
      if (!formData.numero) errors.numero = 'Le numéro est obligatoire.';
      if (!formData.date_vente) errors.date_vente = 'La date est obligatoire.';
      if (!formData.montant_total || Number(formData.montant_total) < 0) {
        errors.montant_total = 'Le montant est invalide.';
      }
    }
    if (modal?.kind === 'reglement') {
      if (!formData.facture_id) errors.facture_id = 'La facture est obligatoire.';
      if (!formData.montant || Number(formData.montant) <= 0) errors.montant = 'Le montant est invalide.';
      if (!formData.date_reglement) errors.date_reglement = 'La date est obligatoire.';
    }
    return errors;
  };

  const renderForm = (
    _formData: Record<string, unknown>,
    onChange: (name: string, value: string) => void,
    errors: Record<string, string>
  ) => {
    if (!modal) return null;

    if (modal.kind === 'vente') {
      return (
        <>
          <div className="form-field">
            <label htmlFor="vente-client">Client</label>
            <select
              id="vente-client"
              name="client_id"
              className="inline-input"
              onChange={(e) => onChange('client_id', e.target.value)}
            >
              <option value="">Client de passage</option>
              {clients.map((row) => (
                <option key={row.id} value={row.id}>
                  {row.nom}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="vente-numero">Numéro *</label>
            <input
              id="vente-numero"
              name="numero"
              type="text"
              className="inline-input"
              onChange={(e) => onChange('numero', e.target.value)}
            />
            {errors.numero && <span className="form-error">{errors.numero}</span>}
          </div>
          <div className="form-field">
            <label htmlFor="vente-date">Date *</label>
            <input
              id="vente-date"
              name="date_vente"
              type="date"
              className="inline-input"
              onChange={(e) => onChange('date_vente', e.target.value)}
            />
            {errors.date_vente && <span className="form-error">{errors.date_vente}</span>}
          </div>
          <div className="form-field">
            <label htmlFor="vente-montant">Montant total *</label>
            <input
              id="vente-montant"
              name="montant_total"
              type="number"
              min="0"
              step="0.01"
              className="inline-input"
              onChange={(e) => onChange('montant_total', e.target.value)}
            />
            {errors.montant_total && <span className="form-error">{errors.montant_total}</span>}
          </div>
          <div className="form-field">
            <label htmlFor="vente-statut">Statut *</label>
            <select
              id="vente-statut"
              name="statut"
              className="inline-input"
              onChange={(e) => onChange('statut', e.target.value)}
            >
              <option value="brouillon">Brouillon</option>
              <option value="confirmee">Confirmée</option>
              <option value="annulee">Annulée</option>
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="vente-observation">Observation</label>
            <input
              id="vente-observation"
              name="observation"
              type="text"
              className="inline-input"
              onChange={(e) => onChange('observation', e.target.value)}
            />
          </div>
        </>
      );
    }

    return (
      <>
        <div className="form-field">
          <label htmlFor="reglement-facture">Facture *</label>
          <select
            id="reglement-facture"
            name="facture_id"
            className="inline-input"
            onChange={(e) => onChange('facture_id', e.target.value)}
          >
            <option value="">— Choisir une facture —</option>
            {factures.map((row) => (
              <option key={row.id} value={row.id}>
                {row.numero}
              </option>
            ))}
          </select>
          {errors.facture_id && <span className="form-error">{errors.facture_id}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="reglement-montant">Montant *</label>
          <input
            id="reglement-montant"
            name="montant"
            type="number"
            min="0.01"
            step="0.01"
            className="inline-input"
            onChange={(e) => onChange('montant', e.target.value)}
          />
          {errors.montant && <span className="form-error">{errors.montant}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="reglement-mode">Mode *</label>
          <select
            id="reglement-mode"
            name="mode"
            className="inline-input"
            onChange={(e) => onChange('mode', e.target.value)}
          >
            <option value="espèces">Espèces</option>
            <option value="virement">Virement</option>
            <option value="cheque">Chèque</option>
            <option value="mobile">Mobile money</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="reglement-date">Date *</label>
          <input
            id="reglement-date"
            name="date_reglement"
            type="datetime-local"
            className="inline-input"
            onChange={(e) => onChange('date_reglement', e.target.value)}
          />
          {errors.date_reglement && <span className="form-error">{errors.date_reglement}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="reglement-reference">Référence</label>
          <input
            id="reglement-reference"
            name="reference"
            type="text"
            className="inline-input"
            onChange={(e) => onChange('reference', e.target.value)}
          />
        </div>
      </>
    );
  };

  return (
    <EntityFormModal
      open={Boolean(modal)}
      onClose={() => setModal(null)}
      title={
        modal
          ? `${modal.item ? 'Modifier' : 'Ajouter'} ${modal.kind === 'vente' ? 'une vente' : 'un règlement'}`
          : ''
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
