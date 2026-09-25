interface CategorieFormProps {
  formData: Record<string, unknown>;
  onChange: (name: string, value: string) => void;
  errors: Record<string, string>;
  item?: { nom?: string; description?: string | null; actif?: boolean } | null;
}

export function CategorieForm({ formData, onChange, errors }: CategorieFormProps) {
  return (
    <>
      <div className="form-field form-field-full">
        <label htmlFor="categories-nom">
          Nom <span className="required-mark">*</span>
        </label>
        <input
          id="categories-nom"
          name="nom"
          type="text"
          placeholder="Ex. Antalgiques"
          className="inline-input"
          value={String(formData.nom ?? '')}
          onChange={(e) => onChange('nom', e.target.value)}
        />
        {errors.nom && <span className="form-error">{errors.nom}</span>}
      </div>

      <div className="form-field form-field-full">
        <label htmlFor="categories-description">Description</label>
        <textarea
          id="categories-description"
          name="description"
          rows={3}
          placeholder="Description courte de la catégorie…"
          className="inline-input"
          value={String(formData.description ?? '')}
          onChange={(e) => onChange('description', e.target.value)}
        />
      </div>

      <div className="form-field">
        <label htmlFor="categories-actif">Statut</label>
        <select
          id="categories-actif"
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
