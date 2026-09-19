import type { Role } from '@/types';

interface UtilisateurFormProps {
  formData: Record<string, unknown>;
  onChange: (name: string, value: string) => void;
  errors: Record<string, string>;
  item: { name?: string; email?: string; role_id?: number | null } | null;
  isCreation: boolean;
  roles: Role[];
}

export function UtilisateurForm({ formData, onChange, errors, item, isCreation, roles }: UtilisateurFormProps) {
  const val = (name: string) => formData[name] === undefined ? '' : String(formData[name]);

  return (
    <div>
      <div className="form-field">
        <label htmlFor="utilisateur-nom">Nom *</label>
        <input
          id="utilisateur-nom"
          name="name"
          type="text"
          className="inline-input"
          value={val('name')}
          onChange={(e) => onChange('name', e.target.value)}
        />
        {errors.name && <span className="form-error">{errors.name}</span>}
      </div>
      <div className="form-field">
        <label htmlFor="utilisateur-email">Email *</label>
        <input
          id="utilisateur-email"
          name="email"
          type="email"
          className="inline-input"
          value={val('email')}
          onChange={(e) => onChange('email', e.target.value)}
        />
        {errors.email && <span className="form-error">{errors.email}</span>}
      </div>
      {isCreation && (
        <div className="form-field">
          <label htmlFor="utilisateur-password">Mot de passe *</label>
          <input
            id="utilisateur-password"
            name="password"
            type="password"
            className="inline-input"
            value={val('password')}
            onChange={(e) => onChange('password', e.target.value)}
            minLength={6}
          />
          {errors.password && <span className="form-error">{errors.password}</span>}
          <small className="form-hint">Minimum 8 caractères</small>
        </div>
      )}
      {!isCreation && (
        <div className="form-field">
          <label htmlFor="utilisateur-password">Nouveau mot de passe (laisser vide pour ne pas changer)</label>
          <input
            id="utilisateur-password"
            name="password"
            type="password"
            className="inline-input"
            value={val('password')}
            onChange={(e) => onChange('password', e.target.value)}
            minLength={6}
          />
          {errors.password && <span className="form-error">{errors.password}</span>}
          <small className="form-hint">Minimum 8 caractères si modifié</small>
        </div>
      )}
      <div className="form-field">
        <label htmlFor="utilisateur-role">Rôle *</label>
        <select
          id="utilisateur-role"
          name="role_id"
          className="inline-input"
          value={val('role_id')}
          onChange={(e) => onChange('role_id', e.target.value)}
        >
          <option value="">— Choisir un rôle —</option>
          {roles.map((row: Role) => (
            <option key={row.id} value={String(row.id)}>
              {row.nom_affichage}
            </option>
          ))}
        </select>
        {errors.role_id && <span className="form-error">{errors.role_id}</span>}
      </div>
    </div>
  );
}
