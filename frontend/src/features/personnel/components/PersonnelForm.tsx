import { utilisateurs } from '@/data/mockData';
import type { User } from '@/types';

interface PersonnelFormProps {
  formData: Record<string, unknown>;
  onChange: (name: string, value: string) => void;
  errors: Record<string, string>;
  item: { user_id?: number | null; nom?: string; prenom?: string; telephone?: string | null; email?: string | null; adresse?: string | null; fonction?: string; date_embauche?: string | null; actif?: boolean } | null;
}

export function PersonnelForm({ formData, onChange, errors, item }: PersonnelFormProps) {
  return (
    <>
      <div className="form-field">
        <label htmlFor="personnel-utilisateur">Utilisateur</label>
        <select
          id="personnel-utilisateur"
          name="user_id"
          className="inline-input"
          onChange={(e) => onChange('user_id', e.target.value)}
        >
          <option value="">Aucun utilisateur</option>
          {utilisateurs.map((row: User) => (
            <option key={row.id} value={row.id}>
              {row.name}
            </option>
          ))}
        </select>
      </div>
      <div className="form-field">
        <label htmlFor="personnel-nom">Nom *</label>
        <input
          id="personnel-nom"
          name="nom"
          type="text"
          className="inline-input"
          onChange={(e) => onChange('nom', e.target.value)}
        />
        {errors.nom && <span className="form-error">{errors.nom}</span>}
      </div>
      <div className="form-field">
        <label htmlFor="personnel-prenom">Prénom *</label>
        <input
          id="personnel-prenom"
          name="prenom"
          type="text"
          className="inline-input"
          onChange={(e) => onChange('prenom', e.target.value)}
        />
        {errors.prenom && <span className="form-error">{errors.prenom}</span>}
      </div>
      <div className="form-field">
        <label htmlFor="personnel-telephone">Téléphone</label>
        <input
          id="personnel-telephone"
          name="telephone"
          type="text"
          className="inline-input"
          onChange={(e) => onChange('telephone', e.target.value)}
        />
      </div>
      <div className="form-field">
        <label htmlFor="personnel-email">Email</label>
        <input
          id="personnel-email"
          name="email"
          type="email"
          className="inline-input"
          onChange={(e) => onChange('email', e.target.value)}
        />
      </div>
      <div className="form-field">
        <label htmlFor="personnel-adresse">Adresse</label>
        <input
          id="personnel-adresse"
          name="adresse"
          type="text"
          className="inline-input"
          onChange={(e) => onChange('adresse', e.target.value)}
        />
      </div>
      <div className="form-field">
        <label htmlFor="personnel-fonction">Fonction *</label>
        <input
          id="personnel-fonction"
          name="fonction"
          type="text"
          className="inline-input"
          onChange={(e) => onChange('fonction', e.target.value)}
        />
        {errors.fonction && <span className="form-error">{errors.fonction}</span>}
      </div>
      <div className="form-field">
        <label htmlFor="personnel-date-embauche">Date d'embauche</label>
        <input
          id="personnel-date-embauche"
          name="date_embauche"
          type="date"
          className="inline-input"
          onChange={(e) => onChange('date_embauche', e.target.value)}
        />
      </div>
      <div className="form-field">
        <label htmlFor="personnel-actif">Actif</label>
        <select
          id="personnel-actif"
          name="actif"
          className="inline-input"
          onChange={(e) => onChange('actif', e.target.value)}
        >
          <option value="true">Oui</option>
          <option value="false">Non</option>
        </select>
      </div>
    </>
  );
}
