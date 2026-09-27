interface CaisseFormProps {
  formData: Record<string, unknown>;
  onChange: (name: string, value: string) => void;
  errors: Record<string, string>;
}

export function CaisseForm({ formData, onChange, errors }: CaisseFormProps) {
  return (
    <>
      <div className="form-field form-field-full">
        <label htmlFor="caisse-montant-initial">
          Montant initial (MGA) <span className="required-mark">*</span>
        </label>
        <input
          id="caisse-montant-initial"
          name="montant_initial"
          type="number"
          min="0"
          step="0.01"
          className="inline-input"
          value={String(formData.montant_initial ?? '')}
          onChange={(e) => onChange('montant_initial', e.target.value)}
        />
        {errors.montant_initial && (
          <span className="form-error">{errors.montant_initial}</span>
        )}
        <span className="form-hint">
          La caisse est rattachée à votre compte et la date d’ouverture est
          générée automatiquement.
        </span>
      </div>
    </>
  );
}
