import { useMemo, useState } from 'react';
import type { Achat, Caisse, Fournisseur } from '@/types';

/** Valeurs possibles du champ « Type de sortie ». */
export const TYPES_SORTIE = [
  { value: 'paiement_fournisseur', label: 'Paiement fournisseur' },
  { value: 'depense', label: 'Dépense' },
  { value: 'autre', label: 'Autre' },
] as const;

interface MouvementFormProps {
  formData: Record<string, unknown>;
  onChange: (name: string, value: string) => void;
  errors: Record<string, string>;
  caisseData: Caisse[];
  fournisseursData: Fournisseur[];
  achatsData: Achat[];
}

export function MouvementForm({
  formData,
  onChange,
  errors,
  caisseData,
  fournisseursData,
  achatsData,
}: MouvementFormProps) {
  const [fournisseurChoisi, setFournisseurChoisi] = useState<string>(
    String(formData.fournisseur_id ?? '')
  );

  const typeSortie = String(formData.type_sortie ?? '');

  // Un paiement fournisseur n'est proposé que pour une caisse ouverte.
  const caissesOuvertes = useMemo(
    () => caisseData.filter((row) => row.statut === 'ouverte'),
    [caisseData]
  );

  // Les achats sont filtrés selon le fournisseur sélectionné.
  const achatsDuFournisseur = useMemo(() => {
    if (!fournisseurChoisi) return [];
    return achatsData.filter(
      (achat) => String(achat.fournisseur_id) === fournisseurChoisi
    );
  }, [achatsData, fournisseurChoisi]);

  const afficherFournisseur = typeSortie === 'paiement_fournisseur';

  return (
    <>
      <div className="form-field">
        <label htmlFor="mouvement-caisse">
          Caisse <span className="required-mark">*</span>
        </label>
        <select
          id="mouvement-caisse"
          name="caisse_id"
          className="inline-input"
          value={String(formData.caisse_id ?? '')}
          onChange={(e) => onChange('caisse_id', e.target.value)}
        >
          <option value="">— Choisir une caisse —</option>
          {caissesOuvertes.map((row) => (
            <option key={row.id} value={String(row.id)}>
              Caisse #{row.id} — {row.utilisateur?.name ?? 'Utilisateur'}
            </option>
          ))}
        </select>
        {errors.caisse_id && <span className="form-error">{errors.caisse_id}</span>}
        {caissesOuvertes.length === 0 && (
          <span className="form-hint">Aucune caisse ouverte : ouvrez une caisse d’abord.</span>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="mouvement-type">
          Type de sortie <span className="required-mark">*</span>
        </label>
        <select
          id="mouvement-type"
          name="type_sortie"
          className="inline-input"
          value={typeSortie}
          onChange={(e) => {
            onChange('type_sortie', e.target.value);
            if (e.target.value !== 'paiement_fournisseur') {
              onChange('fournisseur_id', '');
              onChange('achat_id', '');
            }
          }}
        >
          <option value="">— Choisir un type —</option>
          {TYPES_SORTIE.map((row) => (
            <option key={row.value} value={row.value}>
              {row.label}
            </option>
          ))}
        </select>
        {errors.type_sortie && <span className="form-error">{errors.type_sortie}</span>}
      </div>

      {afficherFournisseur && (
        <>
          <div className="form-field">
            <label htmlFor="mouvement-fournisseur">Fournisseur</label>
            <select
              id="mouvement-fournisseur"
              name="fournisseur_id"
              className="inline-input"
              value={fournisseurChoisi}
              onChange={(e) => {
                setFournisseurChoisi(e.target.value);
                onChange('fournisseur_id', e.target.value);
                onChange('achat_id', '');
              }}
            >
              <option value="">— Choisir un fournisseur —</option>
              {fournisseursData.map((row) => (
                <option key={row.id} value={String(row.id)}>
                  {row.nom}
                </option>
              ))}
            </select>
            {errors.fournisseur_id && (
              <span className="form-error">{errors.fournisseur_id}</span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="mouvement-achat">Achat concerné</label>
            <select
              id="mouvement-achat"
              name="achat_id"
              className="inline-input"
              value={String(formData.achat_id ?? '')}
              onChange={(e) => onChange('achat_id', e.target.value)}
              disabled={!fournisseurChoisi}
            >
              <option value="">— Choisir un achat —</option>
              {achatsDuFournisseur.map((row) => (
                <option key={row.id} value={String(row.id)}>
                  {row.numero}
                </option>
              ))}
            </select>
            {errors.achat_id && <span className="form-error">{errors.achat_id}</span>}
            {!fournisseurChoisi && (
              <span className="form-hint">Choisissez d’abord un fournisseur.</span>
            )}
          </div>
        </>
      )}

      <div className="form-field">
        <label htmlFor="mouvement-montant">
          Montant (MGA) <span className="required-mark">*</span>
        </label>
        <input
          id="mouvement-montant"
          name="montant"
          type="number"
          min="0.01"
          step="0.01"
          className="inline-input"
          value={String(formData.montant ?? '')}
          onChange={(e) => onChange('montant', e.target.value)}
        />
        {errors.montant && <span className="form-error">{errors.montant}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="mouvement-motif">
          Motif <span className="required-mark">*</span>
        </label>
        <input
          id="mouvement-motif"
          name="motif"
          type="text"
          className="inline-input"
          placeholder="Ex. Achat de fournitures"
          value={String(formData.motif ?? '')}
          onChange={(e) => onChange('motif', e.target.value)}
        />
        {errors.motif && <span className="form-error">{errors.motif}</span>}
      </div>
    </>
  );
}
