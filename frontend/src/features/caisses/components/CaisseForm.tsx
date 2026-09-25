import { utilisateurs } from '@/data/mockData';
import type { Caisse } from '@/types';

interface CaisseFormProps {
  formData?: Record<string, unknown>;
  onChange: (name: string, value: string) => void;
  errors: Record<string, string>;
  item?: Caisse | null;
}

export function CaisseForm({ onChange, errors }: CaisseFormProps) {
  return (
    <>
      <div className="form-field">
        <label htmlFor="caisse-utilisateur">Utilisateur *</label>
        <select
          id="caisse-utilisateur"
          name="user_id"
          className="inline-input"
          onChange={(e) => onChange('user_id', e.target.value)}
        >
          <option value="">— Choisir un utilisateur —</option>
          {utilisateurs.map((row) => (
            <option key={row.id} value={row.id}>
              {row.name}
            </option>
          ))}
        </select>
        {errors.user_id && <span className="form-error">{errors.user_id}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="caisse-ouverture">Date d'ouverture *</label>
        <input
          id="caisse-ouverture"
          name="date_ouverture"
          type="datetime-local"
          className="inline-input"
          onChange={(e) => onChange('date_ouverture', e.target.value)}
        />
        {errors.date_ouverture && <span className="form-error">{errors.date_ouverture}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="caisse-montant-initial">Montant initial *</label>
        <input
          id="caisse-montant-initial"
          name="montant_initial"
          type="number"
          min="0"
          step="0.01"
          className="inline-input"
          onChange={(e) => onChange('montant_initial', e.target.value)}
        />
        {errors.montant_initial && <span className="form-error">{errors.montant_initial}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="caisse-statut">Statut *</label>
        <select
          id="caisse-statut"
          name="statut"
          className="inline-input"
          onChange={(e) => onChange('statut', e.target.value)}
        >
          <option value="ouverte">Ouverte</option>
          <option value="fermee">Fermée</option>
        </select>
      </div>

      <div className="form-field">
        <label htmlFor="caisse-observation">Observation</label>
        <input
          id="caisse-observation"
          name="observation"
          type="text"
          className="inline-input"
          onChange={(e) => onChange('observation', e.target.value)}
        />
      </div>
    </>
  );
}
