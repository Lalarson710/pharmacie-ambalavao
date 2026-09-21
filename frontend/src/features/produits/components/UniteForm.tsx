interface UniteFormProps {
  formData: Record<string, unknown>;
  onChange: (name: string, value: string) => void;
  errors: Record<string, string>;
  item: { nom?: string; abreviation?: string | null; actif?: boolean } | null;
}

export function UniteForm({ formData, onChange, errors, item }: UniteFormProps) {
  return (
    <>
      <div className="form-field">
        <label htmlFor="unite-nom">Nom *</label>
        <input id="unite-nom" name="nom" type="text" className="inline-input" value={String(formData.nom ?? '')} onChange={(e) => onChange('nom', e.target.value)} />
        {errors.nom && <span className="form-error">{errors.nom}</span>}
      </div>
      <div className="form-field">
        <label htmlFor="unite-abreviation">Abréviation</label>
        <input id="unite-abreviation" name="abreviation" type="text" className="inline-input" value={String(formData.abreviation ?? '')} onChange={(e) => onChange('abreviation', e.target.value)} />
      </div>
      <div className="form-field">
        <label htmlFor="unite-actif">Actif</label>
        <select id="unite-actif" name="actif" className="inline-input" value={String(formData.actif ?? 'true')} onChange={(e) => onChange('actif', e.target.value)}>
          <option value="true">Oui</option>
          <option value="false">Non</option>
        </select>
      </div>
    </>
  );
}
