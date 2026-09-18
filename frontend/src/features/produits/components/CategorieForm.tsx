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
        <label htmlFor="categorie-nom">Nom *</label>
        <input id="categorie-nom" name="nom" type="text" className="inline-input" onChange={(e) => onChange('nom', e.target.value)} />
        {errors.nom && <span className="form-error">{errors.nom}</span>}
      </div>
      <div className="form-field">
        <label htmlFor="categorie-description">Description</label>
        <input id="categorie-description" name="description" type="text" className="inline-input" onChange={(e) => onChange('description', e.target.value)} />
      </div>
      <div className="form-field">
        <label htmlFor="categorie-actif">Actif</label>
        <select id="categorie-actif" name="actif" className="inline-input" onChange={(e) => onChange('actif', e.target.value)}>
          <option value="true">Oui</option>
          <option value="false">Non</option>
        </select>
      </div>
    </>
  );
}
