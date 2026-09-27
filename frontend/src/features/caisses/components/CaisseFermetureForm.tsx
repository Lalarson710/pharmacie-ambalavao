import { formatCurrency } from '@/utils/formatters';
import type { Caisse, MouvementCaisse } from '@/types';

interface CaisseFermetureFormProps {
  formData: Record<string, unknown>;
  onChange: (name: string, value: string) => void;
  errors: Record<string, string>;
  caisse: Caisse | null;
  mouvements: MouvementCaisse[];
}

export function CaisseFermetureForm({
  formData,
  onChange,
  errors,
  caisse,
  mouvements,
}: CaisseFermetureFormProps) {
  const entrees = mouvements
    .filter((row) => row.type === 'entree')
    .reduce((total, row) => total + Number(row.montant), 0);
  const sorties = mouvements
    .filter((row) => row.type === 'sortie')
    .reduce((total, row) => total + Number(row.montant), 0);
  const soldeTheorique =
    Number(caisse?.montant_initial ?? 0) + entrees - sorties;

  const montantFinal = String(formData.montant_final ?? '');
  const ecart =
    montantFinal === '' ? null : Number(montantFinal) - soldeTheorique;

  return (
    <>
      <div className="form-field form-field-full">
        <label>Caisse</label>
        <input
          type="text"
          className="inline-input"
          value={
            caisse
              ? `Caisse #${caisse.id} — ${caisse.utilisateur?.name ?? 'Utilisateur'}`
              : '—'
          }
          readOnly
          disabled
        />
      </div>

      <div className="form-field">
        <label>Montant initial</label>
        <input
          type="text"
          className="inline-input"
          value={formatCurrency(caisse?.montant_initial ?? 0)}
          readOnly
          disabled
        />
      </div>
      <div className="form-field">
        <label>Solde théorique</label>
        <input
          type="text"
          className="inline-input"
          value={formatCurrency(soldeTheorique)}
          readOnly
          disabled
        />
        <span className="form-hint">
          {entrees > 0 || sorties > 0
            ? `${formatCurrency(entrees)} d’entrées − ${formatCurrency(sorties)} de sorties.`
            : 'Aucun mouvement enregistré sur cette caisse.'}
        </span>
      </div>

      <div className="form-field">
        <label htmlFor="caisse-montant-final">
          Montant final (MGA) <span className="required-mark">*</span>
        </label>
        <input
          id="caisse-montant-final"
          name="montant_final"
          type="number"
          min="0"
          step="0.01"
          className="inline-input"
          value={montantFinal}
          onChange={(e) => onChange('montant_final', e.target.value)}
        />
        {errors.montant_final && (
          <span className="form-error">{errors.montant_final}</span>
        )}
      </div>

      <div className="form-field">
        <label>Écart</label>
        <input
          type="text"
          className="inline-input"
          value={ecart === null ? '—' : formatCurrency(ecart)}
          readOnly
          disabled
        />
      </div>
    </>
  );
}
