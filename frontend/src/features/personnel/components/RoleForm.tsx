interface RoleFormProps {
  formData: Record<string, unknown>;
  onChange: (name: string, value: string) => void;
  errors: Record<string, string>;
  item?: { nom?: string; nom_affichage?: string } | null;
}

export function RoleForm({ formData, onChange, errors }: RoleFormProps) {
  return (
    <>
      <div className="form-field">
        <label htmlFor="role-nom">
          Nom technique <span className="required-mark">*</span>
        </label>
        <input
          id="role-nom"
          name="nom"
          type="text"
          placeholder="Ex. pharmacien"
          className="inline-input"
          value={formData.nom === undefined ? '' : String(formData.nom)}
          onChange={(e) => onChange('nom', e.target.value)}
        />
        {errors.nom && <span className="form-error">{errors.nom}</span>}
        <span className="form-hint">Identifiant interne, sans espace ni accent.</span>
      </div>

      <div className="form-field">
        <label htmlFor="role-affichage">
          Nom d'affichage <span className="required-mark">*</span>
        </label>
        <input
          id="role-affichage"
          name="nom_affichage"
          type="text"
          placeholder="Ex. Pharmacien"
          className="inline-input"
          value={
            formData.nom_affichage === undefined ? '' : String(formData.nom_affichage)
          }
          onChange={(e) => onChange('nom_affichage', e.target.value)}
        />
        {errors.nom_affichage && (
          <span className="form-error">{errors.nom_affichage}</span>
        )}
        <span className="form-hint">Libellé visible dans l'interface.</span>
      </div>
    </>
  );
}
