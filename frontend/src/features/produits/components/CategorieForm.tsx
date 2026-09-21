interface CategorieFormProps {
  formData: Record<string, unknown>;
  onChange: (name: string, value: string) => void;
  errors: Record<string, string>;
  item: { nom?: string; description?: string | null; actif?: boolean } | null;
}

export function CategorieForm({ formData, onChange, errors, item }: CategorieFormProps) {
  return (
    <>
      <div className="form-field">
        <label htmlFor="categories-nom">Nom *</label>
        <input id="categories-nom" name="nom" type="text" className="inline-input" value={String(formData.nom ?? '')} onChange={(e) => onChange('nom', e.target.value)} />
        {errors.nom && <span className="form-error">{errors.nom}</span>}
      </div>
      <div className="form-field">
        <label htmlFor="categories-description">Description</label>
        <input id="categories-description" name="description" type="text" className="inline-input" value={String(formData.description ?? '')} onChange={(e) => onChange('description', e.target.value)} />
      </div>
      <div className="form-field">
        <label htmlFor="categories-actif">Actif</label>
        <select id="categories-actif" name="actif" className="inline-input" value={String(formData.actif ?? 'true')} onChange={(e) => onChange('actif', e.target.value)}>
          <option value="true">Oui</option>
          <option value="false">Non</option>
        </select>
      </div>
    </>
  );
}
