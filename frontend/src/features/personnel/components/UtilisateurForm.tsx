import { KeyRound, ShieldCheck } from 'lucide-react';
import type { Role } from '@/types';

interface UtilisateurFormProps {
  formData: Record<string, unknown>;
  onChange: (name: string, value: string) => void;
  errors: Record<string, string>;
  item?: { name?: string; email?: string; role_id?: number | null } | null;
  isCreation: boolean;
  roles: Role[];
}

export function UtilisateurForm({
  formData,
  onChange,
  errors,
  isCreation,
  roles,
}: UtilisateurFormProps) {
  const val = (name: string) =>
    formData[name] === undefined ? '' : String(formData[name]);

  return (
    <>
      {/* ── Compte ── */}
      <div className="form-section">
        <div className="form-section-title">
          <span><ShieldCheck size={13} /></span>
          <div>
            <strong>Compte</strong>
            <small>Identité et rôle de l'utilisateur</small>
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="utilisateur-nom">
            Nom <span className="required-mark">*</span>
          </label>
          <input
            id="utilisateur-nom"
            name="name"
            type="text"
            placeholder="Ex. Jean Rakoto"
            className="inline-input"
            value={val('name')}
            onChange={(e) => onChange('name', e.target.value)}
          />
          {errors.name && <span className="form-error">{errors.name}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="utilisateur-email">
            Email <span className="required-mark">*</span>
          </label>
          <input
            id="utilisateur-email"
            name="email"
            type="email"
            placeholder="exemple@pharmacie.mg"
            className="inline-input"
            value={val('email')}
            onChange={(e) => onChange('email', e.target.value)}
          />
          {errors.email && <span className="form-error">{errors.email}</span>}
        </div>

        <div className="form-field form-field-full">
          <label htmlFor="utilisateur-role">
            Rôle <span className="required-mark">*</span>
          </label>
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
          <span className="form-hint">
            Le rôle conditionne les permissions accessibles.
          </span>
        </div>
      </div>

      {/* ── Sécurité ── */}
      <div className="form-section">
        <div className="form-section-title">
          <span><KeyRound size={13} /></span>
          <div>
            <strong>Sécurité</strong>
            <small>Mot de passe de connexion</small>
          </div>
        </div>

        <div className="form-field form-field-full">
          <label htmlFor="utilisateur-password">
            {isCreation ? (
              <>
                Mot de passe <span className="required-mark">*</span>
              </>
            ) : (
              'Nouveau mot de passe'
            )}
          </label>
          <input
            id="utilisateur-password"
            name="password"
            type="password"
            placeholder={isCreation ? 'Minimum 8 caractères' : 'Laisser vide pour ne pas changer'}
            className="inline-input"
            value={val('password')}
            onChange={(e) => onChange('password', e.target.value)}
            minLength={8}
          />
          {errors.password && <span className="form-error">{errors.password}</span>}
          <span className="form-hint">
            {isCreation
              ? 'Minimum 8 caractères. Composants majuscule, minuscule et chiffre conseillés.'
              : 'Laissez vide pour conserver le mot de passe actuel. Une modification entraîne une reconnexion.'}
          </span>
        </div>
      </div>
    </>
  );
}
