interface UniteFormProps {
  formData: Record<string, unknown>;
  onChange: (name: string, value: string) => void;
  errors: Record<string, string>;
  item?: { nom?: string; abreviation?: string | null; actif?: boolean } | null;
}

export function UniteForm({ formData, onChange, errors }: UniteFormProps) {
  return (
    <>
      <div className="form-field">
        <label htmlFor="unite-nom">
          Nom <span className="required-mark">*</span>
        </label>
        <input
          id="unite-nom"
          name="nom"
          type="text"
          placeholder="Ex. Comprimé"
          className="inline-input"
          value={String(formData.nom ?? '')}
          onChange={(e) => onChange('nom', e.target.value)}
        />
        {errors.nom && <span className="form-error">{errors.nom}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="unite-abreviation">Abréviation</label>
        <input
          id="unite-abreviation"
          name="abreviation"
          type="text"
          placeholder="Ex. cp"
          className="inline-input"
          value={String(formData.abreviation ?? '')}
          onChange={(e) => onChange('abreviation', e.target.value)}
        />
        <span className="form-hint">Affichée sur les lignes de vente.</span>
      </div>

      <div className="form-field">
        <label htmlFor="unite-actif">Statut</label>
        <select
          id="unite-actif"
          name="actif"
          className="inline-input"
          value={String(formData.actif ?? 'true')}
          onChange={(e) => onChange('actif', e.target.value)}
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>
    </>
  );
}
