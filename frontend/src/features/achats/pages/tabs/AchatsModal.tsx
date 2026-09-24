import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';
import { EntityFormModal } from '@/components/EntityFormModal';
import { useToast } from '@/components/Toast';
import { produitsApi } from '../../../produits/api/produits';
import type { Achat, AchatLigne, Fournisseur, Produit } from '@/types';
import { achatsApi, achatsLignesApi } from '../../api/achats';
import { fournisseursApi } from '../../../fournisseurs/api/fournisseurs';

export type AchatModalKind = 'achat' | 'ligne' | 'fournisseur';

export interface AchatModalState {
  kind: AchatModalKind;
  item: Achat | AchatLigne | Fournisseur | null;
}

interface AchatsModalProps {
  modal: AchatModalState | null;
  setModal: Dispatch<SetStateAction<AchatModalState | null>>;
  data: Achat[];
  setData: Dispatch<SetStateAction<Achat[]>>;
  lignesData: AchatLigne[];
  setLignesData: Dispatch<SetStateAction<AchatLigne[]>>;
  fournisseursData: Fournisseur[];
  setFournisseursData: Dispatch<SetStateAction<Fournisseur[]>>;
}

export function AchatsModal({
  modal,
  setModal,
  data,
  setData,
  lignesData,
  setLignesData,
  fournisseursData,
  setFournisseursData,
}: AchatsModalProps) {
  const { showToast } = useToast();
  const [fournisseursList, setFournisseursList] = useState<Fournisseur[]>(fournisseursData);
  const [produitsList, setProduitsList] = useState<Produit[]>([]);

  useEffect(() => {
    setFournisseursList(fournisseursData);
  }, [fournisseursData]);

  useEffect(() => {
    const loadProduits = async () => {
      try {
        const fetched = await produitsApi.getAll();
        setProduitsList(fetched);
      } catch (error) {
        console.error('chargement produits:', error);
      }
    };
    loadProduits();
  }, []);

  const handleSave = async (formData: Record<string, unknown>) => {
    if (!modal) return;

    try {
      if (modal.kind === 'achat') {
        const payload = {
          fournisseur_id: Number(formData.fournisseur_id),
          numero: String(formData.numero),
          date_achat: String(formData.date_achat),
          montant_total: Number(formData.montant_total),
          observation: (formData.observation as string) || null,
        };

        let saved: Achat;
        if (modal.item) {
          saved = await achatsApi.update(modal.item.id, payload);
          setData((prev) =>
            prev.map((row) => (row.id === modal.item!.id ? saved : row))
          );
          showToast('Achat modifié avec succès', 'success');
        } else {
          saved = await achatsApi.create(payload);
          setData((prev) => [...prev, saved]);
          showToast('Achat créé avec succès', 'success');
        }
      }

      if (modal.kind === 'ligne') {
        const payload = {
          achat_id: Number(formData.achat_id),
          produit_id: Number(formData.produit_id),
          quantite: Number(formData.quantite),
          prix_unitaire: Number(formData.prix_unitaire),
          numero_lot: (formData.numero_lot as string) || null,
          date_peremption: (formData.date_peremption as string) || null,
        };

        let saved: AchatLigne;
        if (modal.item) {
          saved = await achatsLignesApi.update(modal.item.id, payload);
          setLignesData((prev) =>
            prev.map((row) => (row.id === modal.item!.id ? saved : row))
          );
          showToast('Ligne modifiée avec succès', 'success');
        } else {
          saved = await achatsLignesApi.create(payload);
          setLignesData((prev) => [...prev, saved]);
          showToast('Ligne créée avec succès', 'success');
        }
      }

      if (modal.kind === 'fournisseur') {
        const payload = {
          nom: String(formData.nom),
          telephone: (formData.telephone as string) || null,
          email: (formData.email as string) || null,
          adresse: (formData.adresse as string) || null,
        };

        let saved: Fournisseur;
        if (modal.item) {
          saved = await fournisseursApi.update(modal.item.id, payload);
          setFournisseursData((prev) =>
            prev.map((row) => (row.id === modal.item!.id ? saved : row))
          );
          showToast('Fournisseur modifié avec succès', 'success');
        } else {
          saved = await fournisseursApi.create(payload);
          setFournisseursData((prev) => [...prev, saved]);
          showToast('Fournisseur créé avec succès', 'success');
        }
      }

      setModal(null);
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

  const getInitialData = (item: Achat | AchatLigne | Fournisseur | null) => {
    if (!modal) return {};

    if (modal.kind === 'achat') {
      const row = item as Achat | null;
      return {
        fournisseur_id: row ? String(row.fournisseur_id) : '',
        numero: row?.numero ?? '',
        date_achat: row?.date_achat ? row.date_achat.slice(0, 10) : new Date().toISOString().slice(0, 10),
        montant_total: row?.montant_total ?? '',
        observation: row?.observation ?? '',
      };
    }

    if (modal.kind === 'ligne') {
      const row = item as AchatLigne | null;
      return {
        achat_id: row ? String(row.achat_id) : '',
        produit_id: row ? String(row.produit_id) : '',
        quantite: row ? String(row.quantite) : '',
        prix_unitaire: row?.prix_unitaire ?? '',
        numero_lot: row?.numero_lot ?? '',
        date_peremption: row?.date_peremption ? row.date_peremption.slice(0, 10) : '',
      };
    }

    const row = item as Fournisseur | null;
    return {
      nom: row?.nom ?? '',
      telephone: row?.telephone ?? '',
      email: row?.email ?? '',
      adresse: row?.adresse ?? '',
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
      if (!formData.achat_id) errors.achat_id = 'L\'achat est obligatoire.';
      if (!formData.produit_id) errors.produit_id = 'Le produit est obligatoire.';
      if (!formData.quantite || Number(formData.quantite) <= 0) {
        errors.quantite = 'La quantité est invalide.';
      }
      if (!formData.prix_unitaire || Number(formData.prix_unitaire) < 0) {
        errors.prix_unitaire = 'Le prix unitaire est invalide.';
      }
    }
    if (modal?.kind === 'fournisseur') {
      if (!formData.nom) errors.nom = 'Le nom est obligatoire.';
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
              value={String(_formData.fournisseur_id ?? '')}
              onChange={(e) => {
                onChange('fournisseur_id', e.target.value);
              }}
            >
              <option value="">— Choisir un fournisseur —</option>
              {fournisseursList.map((row) => (
                <option key={row.id} value={String(row.id)}>
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
              value={String(_formData.numero ?? '')}
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
              value={String(_formData.date_achat ?? '')}
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
              value={String(_formData.montant_total ?? '')}
              onChange={(e) => onChange('montant_total', e.target.value)}
            />
            {errors.montant_total && <span className="form-error">{errors.montant_total}</span>}
          </div>
          <div className="form-field">
            <label htmlFor="achat-observation">Observation</label>
            <input
              id="achat-observation"
              name="observation"
              type="text"
              className="inline-input"
              value={String(_formData.observation ?? '')}
              onChange={(e) => onChange('observation', e.target.value)}
            />
          </div>
        </>
      );
    }

    if (modal.kind === 'ligne') {
      return (
        <>
          <div className="form-field">
            <label htmlFor="ligne-achat">Achat *</label>
            <select
              id="ligne-achat"
              name="achat_id"
              className="inline-input"
              value={String(_formData.achat_id ?? '')}
              onChange={(e) => onChange('achat_id', e.target.value)}
            >
              <option value="">— Choisir un achat —</option>
              {data.map((row) => (
                <option key={row.id} value={String(row.id)}>
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
              value={String(_formData.produit_id ?? '')}
              onChange={(e) => onChange('produit_id', e.target.value)}
            >
              <option value="">— Choisir un produit —</option>
              {produitsList.map((row) => (
                <option key={row.id} value={String(row.id)}>
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
              value={String(_formData.quantite ?? '')}
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
              value={String(_formData.prix_unitaire ?? '')}
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
              value={String(_formData.numero_lot ?? '')}
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
              value={String(_formData.date_peremption ?? '')}
              onChange={(e) => onChange('date_peremption', e.target.value)}
            />
          </div>
        </>
      );
    }

    return (
      <>
        <div className="form-field">
          <label htmlFor="fournisseur-nom">Nom *</label>
          <input
            id="fournisseur-nom"
            name="nom"
            type="text"
            className="inline-input"
            value={String(_formData.nom ?? '')}
            onChange={(e) => onChange('nom', e.target.value)}
          />
          {errors.nom && <span className="form-error">{errors.nom}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="fournisseur-telephone">Téléphone</label>
          <input
            id="fournisseur-telephone"
            name="telephone"
            type="text"
            className="inline-input"
            value={String(_formData.telephone ?? '')}
            onChange={(e) => onChange('telephone', e.target.value)}
          />
        </div>
        <div className="form-field">
          <label htmlFor="fournisseur-email">Email</label>
          <input
            id="fournisseur-email"
            name="email"
            type="email"
            className="inline-input"
            value={String(_formData.email ?? '')}
            onChange={(e) => onChange('email', e.target.value)}
          />
        </div>
        <div className="form-field">
          <label htmlFor="fournisseur-adresse">Adresse</label>
          <input
            id="fournisseur-adresse"
            name="adresse"
            type="text"
            className="inline-input"
            value={String(_formData.adresse ?? '')}
            onChange={(e) => onChange('adresse', e.target.value)}
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
              modal.kind === 'achat' ? 'un achat' : modal.kind === 'ligne' ? 'une ligne d\'achat' : 'un fournisseur'
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
