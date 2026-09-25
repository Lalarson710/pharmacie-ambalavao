import type { Caisse } from '@/types';

interface MouvementFormProps {
  formData?: Record<string, unknown>;
  onChange: (name: string, value: string) => void;
  errors: Record<string, string>;
  caisseData: Caisse[];
}

export function MouvementForm({ onChange, errors, caisseData }: MouvementFormProps) {
  return (
    <>
      <div className="form-field">
        <label htmlFor="mouvement-caisse">Caisse *</label>
        <select
          id="mouvement-caisse"
          name="caisse_id"
          className="inline-input"
          onChange={(e) => onChange('caisse_id', e.target.value)}
        >
          <option value="">— Choisir une caisse —</option>
          {caisseData.map((row) => (
            <option key={row.id} value={row.id}>
              Caisse #{row.id}
            </option>
          ))}
        </select>
        {errors.caisse_id && <span className="form-error">{errors.caisse_id}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="mouvement-montant">Montant *</label>
        <input
          id="mouvement-montant"
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
        <label htmlFor="mouvement-motif">Motif *</label>
        <input
          id="mouvement-motif"
          name="motif"
          type="text"
          className="inline-input"
          placeholder="Ex. Achat de fournitures"
          onChange={(e) => onChange('motif', e.target.value)}
        />
        {errors.motif && <span className="form-error">{errors.motif}</span>}
      </div>
    </>
  );
}
