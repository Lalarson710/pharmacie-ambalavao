import { type Dispatch, type SetStateAction } from 'react';
import { EntityFormModal } from '@/components/EntityFormModal';
import { fournisseurs, produits } from '@/data/mockData';
import type { Achat, AchatLigne } from '@/types';

export type AchatModalKind = 'achat' | 'ligne';

export interface AchatModalState {
  kind: AchatModalKind;
  item: Achat | AchatLigne | null;
}

interface AchatsModalProps {
  modal: AchatModalState | null;
  setModal: Dispatch<SetStateAction<AchatModalState | null>>;
  data: Achat[];
  setData: Dispatch<SetStateAction<Achat[]>>;
  lignesData: AchatLigne[];
  setLignesData: Dispatch<SetStateAction<AchatLigne[]>>;
}

export function AchatsModal({
  modal,
  setModal,
  data,
  setData,
  lignesData,
  setLignesData,
}: AchatsModalProps) {
  const handleSave = (formData: Record<string, unknown>) => {
    if (!modal) return;

    if (modal.kind === 'achat') {
      const fournisseur = fournisseurs.find(
        (row) => row.id === Number(formData.fournisseur_id)
      );
      const achatData = {
        fournisseur_id: Number(formData.fournisseur_id),
        numero: String(formData.numero),
        date_achat: String(formData.date_achat),
        montant_total: String(formData.montant_total),
        statut: formData.statut as Achat['statut'],
        observation: (formData.observation as string) || null,
        fournisseur,
      };

      if (modal.item) {
        setData((prev) =>
          prev.map((row) => (row.id === modal.item?.id ? { ...row, ...achatData } : row))
        );
      } else {
        const newAchat: Achat = {
          id: data.length > 0 ? Math.max(...data.map((row) => row.id)) + 1 : 1,
          ...achatData,
        };
        setData((prev) => [...prev, newAchat]);
      }
    }

    if (modal.kind === 'ligne') {
      const produit = produits.find((row) => row.id === Number(formData.produit_id));
      const quantite = Number(formData.quantite);
      const prixUnitaire = String(formData.prix_unitaire);
      const ligneData = {
        achat_id: Number(formData.achat_id),
        produit_id: Number(formData.produit_id),
        quantite,
        prix_unitaire: prixUnitaire,
        montant: String(quantite * Number(prixUnitaire)),
        numero_lot: (formData.numero_lot as string) || null,
        date_peremption: (formData.date_peremption as string) || null,
        produit,
      };

      if (modal.item) {
        setLignesData((prev) =>
          prev.map((row) => (row.id === modal.item?.id ? { ...row, ...ligneData } : row))
        );
      } else {
        const newLigne: AchatLigne = {
          id: lignesData.length > 0 ? Math.max(...lignesData.map((row) => row.id)) + 1 : 1,
          ...ligneData,
        };
        setLignesData((prev) => [...prev, newLigne]);
      }
    }

    setModal(null);
  };

  const getInitialData = (item: Achat | AchatLigne | null) => {
    if (!modal) return {};

    if (modal.kind === 'achat') {
      const row = item as Achat | null;
      return {
        fournisseur_id: row ? String(row.fournisseur_id) : '',
        numero: row?.numero ?? '',
        date_achat: row?.date_achat ?? new Date().toISOString().slice(0, 10),
        montant_total: row?.montant_total ?? '',
        statut: row?.statut ?? 'brouillon',
        observation: row?.observation ?? '',
      };
    }

    const row = item as AchatLigne | null;
    return {
      achat_id: row ? String(row.achat_id) : String(data[0]?.id ?? ''),
      produit_id: row ? String(row.produit_id) : '',
      quantite: row ? String(row.quantite) : '',
      prix_unitaire: row?.prix_unitaire ?? '',
      numero_lot: row?.numero_lot ?? '',
      date_peremption: row?.date_peremption ?? '',
    };
  };

  const validate = (formData: Record<string, unknown>) => {
    const errors: Record<string, string> = {};
    if (modal?.kind === 'achat') {
      if (!formData.fournisseur_id) errors.fournisseur_id = 'Le fournisseur est obligatoire.';
      if (!formData.numero) errors.numero = 'Le numéro est obligatoire.';
      if (!formData.date_achat) errors.date_achat = 'La date est obligatoire.';
      if (!formData.montant_total) errors.montant_total = 'Le montant est obligatoire.';
    }
    if (modal?.kind === 'ligne') {
      if (!formData.achat_id) errors.achat_id = 'L’achat est obligatoire.';
      if (!formData.produit_id) errors.produit_id = 'Le produit est obligatoire.';
      if (!formData.quantite || Number(formData.quantite) <= 0) {
        errors.quantite = 'La quantité est invalide.';
      }
      if (!formData.prix_unitaire || Number(formData.prix_unitaire) < 0) {
        errors.prix_unitaire = 'Le prix unitaire est invalide.';
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

    if (modal.kind === 'achat') {
      return (
        <>
          <div className="form-field">
            <label htmlFor="achat-fournisseur">Fournisseur *</label>
            <select
              id="achat-fournisseur"
              name="fournisseur_id"
              className="inline-input"
              onChange={(e) => onChange('fournisseur_id', e.target.value)}
            >
              <option value="">— Choisir un fournisseur —</option>
              {fournisseurs.map((row) => (
                <option key={row.id} value={row.id}>
                  {row.nom}
                </option>
              ))}
            </select>
            {errors.fournisseur_id && <span className="form-error">{errors.fournisseur_id}</span>}
          </div>
          <div className="form-field">
            <label htmlFor="achat-numero">Numéro *</label>
            <input
              id="achat-numero"
              name="numero"
              type="text"
              className="inline-input"
              onChange={(e) => onChange('numero', e.target.value)}
            />
            {errors.numero && <span className="form-error">{errors.numero}</span>}
          </div>
          <div className="form-field">
            <label htmlFor="achat-date">Date *</label>
            <input
              id="achat-date"
              name="date_achat"
              type="date"
              className="inline-input"
              onChange={(e) => onChange('date_achat', e.target.value)}
            />
            {errors.date_achat && <span className="form-error">{errors.date_achat}</span>}
          </div>
          <div className="form-field">
            <label htmlFor="achat-montant">Montant total *</label>
            <input
              id="achat-montant"
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
            <label htmlFor="achat-statut">Statut *</label>
            <select
              id="achat-statut"
              name="statut"
              className="inline-input"
              onChange={(e) => onChange('statut', e.target.value)}
            >
              <option value="brouillon">Brouillon</option>
              <option value="confirme">Confirmé</option>
              <option value="annule">Annulé</option>
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="achat-observation">Observation</label>
            <input
              id="achat-observation"
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
          <label htmlFor="ligne-achat">Achat *</label>
          <select
            id="ligne-achat"
            name="achat_id"
            className="inline-input"
            onChange={(e) => onChange('achat_id', e.target.value)}
          >
            <option value="">— Choisir un achat —</option>
            {data.map((row) => (
              <option key={row.id} value={row.id}>
                {row.numero}
              </option>
            ))}
          </select>
          {errors.achat_id && <span className="form-error">{errors.achat_id}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="ligne-produit">Produit *</label>
          <select
            id="ligne-produit"
            name="produit_id"
            className="inline-input"
            onChange={(e) => onChange('produit_id', e.target.value)}
          >
            <option value="">— Choisir un produit —</option>
            {produits.map((row) => (
              <option key={row.id} value={row.id}>
                {row.nom}
              </option>
            ))}
          </select>
          {errors.produit_id && <span className="form-error">{errors.produit_id}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="ligne-quantite">Quantité *</label>
          <input
            id="ligne-quantite"
            name="quantite"
            type="number"
            min="1"
            step="1"
            className="inline-input"
            onChange={(e) => onChange('quantite', e.target.value)}
          />
          {errors.quantite && <span className="form-error">{errors.quantite}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="ligne-prix">Prix unitaire *</label>
          <input
            id="ligne-prix"
            name="prix_unitaire"
            type="number"
            min="0"
            step="0.01"
            className="inline-input"
            onChange={(e) => onChange('prix_unitaire', e.target.value)}
          />
          {errors.prix_unitaire && <span className="form-error">{errors.prix_unitaire}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="ligne-lot">Numéro de lot</label>
          <input
            id="ligne-lot"
            name="numero_lot"
            type="text"
            className="inline-input"
            onChange={(e) => onChange('numero_lot', e.target.value)}
          />
        </div>
        <div className="form-field">
          <label htmlFor="ligne-peremption">Date de péremption</label>
          <input
            id="ligne-peremption"
            name="date_peremption"
            type="date"
            className="inline-input"
            onChange={(e) => onChange('date_peremption', e.target.value)}
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
          ? `${modal.item ? 'Modifier' : 'Ajouter'} ${
              modal.kind === 'achat' ? 'un achat' : 'une ligne d’achat'
            }`
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
