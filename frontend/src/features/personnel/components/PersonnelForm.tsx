import { Briefcase, Contact } from 'lucide-react';
import type { User } from '@/types';

interface PersonnelFormProps {
  formData: Record<string, unknown>;
  onChange: (name: string, value: string) => void;
  errors: Record<string, string>;
  item?: {
    user_id?: number | null;
    nom?: string;
    prenom?: string;
    telephone?: string | null;
    email?: string | null;
    adresse?: string | null;
    fonction?: string;
    date_embauche?: string | null;
    actif?: boolean;
  } | null;
  users: User[];
}

export function PersonnelForm({ formData, onChange, errors, users }: PersonnelFormProps) {
  const val = (name: string) =>
    formData[name] === undefined ? '' : String(formData[name]);

  return (
    <>
      {/* ── Identité ── */}
      <div className="form-section">
        <div className="form-section-title">
          <span><Contact size={13} /></span>
          <div>
            <strong>Identité</strong>
            <small>Nom, prénom et coordonnées</small>
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="personnel-nom">
            Nom <span className="required-mark">*</span>
          </label>
          <input
            id="personnel-nom"
            name="nom"
            type="text"
            placeholder="Ex. RAKOTO"
            className="inline-input"
            value={val('nom')}
            onChange={(e) => onChange('nom', e.target.value)}
          />
          {errors.nom && <span className="form-error">{errors.nom}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="personnel-prenom">
            Prénom <span className="required-mark">*</span>
          </label>
          <input
            id="personnel-prenom"
            name="prenom"
            type="text"
            placeholder="Ex. Marie"
            className="inline-input"
            value={val('prenom')}
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
            placeholder="Ex. 034 00 000 00"
            className="inline-input"
            value={val('telephone')}
            onChange={(e) => onChange('telephone', e.target.value)}
          />
        </div>

        <div className="form-field">
          <label htmlFor="personnel-email">Email</label>
          <input
            id="personnel-email"
            name="email"
            type="email"
            placeholder="exemple@pharmacie.mg"
            className="inline-input"
            value={val('email')}
            onChange={(e) => onChange('email', e.target.value)}
          />
        </div>

        <div className="form-field form-field-full">
          <label htmlFor="personnel-adresse">Adresse</label>
          <input
            id="personnel-adresse"
            name="adresse"
            type="text"
            placeholder="Lot II M 12 Bis, Ambalavao"
            className="inline-input"
            value={val('adresse')}
            onChange={(e) => onChange('adresse', e.target.value)}
          />
        </div>
      </div>

      {/* ── Poste ── */}
      <div className="form-section">
        <div className="form-section-title">
          <span><Briefcase size={13} /></span>
          <div>
            <strong>Poste</strong>
            <small>Fonction, date d'embauche et accès</small>
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="personnel-fonction">
            Fonction <span className="required-mark">*</span>
          </label>
          <input
            id="personnel-fonction"
            name="fonction"
            type="text"
            placeholder="Ex. Préparateur en pharmacie"
            className="inline-input"
            value={val('fonction')}
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
            value={val('date_embauche')}
            onChange={(e) => onChange('date_embauche', e.target.value)}
          />
        </div>

        <div className="form-field">
          <label htmlFor="personnel-utilisateur">Utilisateur lié</label>
          <select
            id="personnel-utilisateur"
            name="user_id"
            className="inline-input"
            value={val('user_id')}
            onChange={(e) => onChange('user_id', e.target.value)}
          >
            <option value="">Aucun utilisateur</option>
            {users.map((row: User) => (
              <option key={row.id} value={String(row.id)}>
                {row.name}
              </option>
            ))}
          </select>
          <span className="form-hint">Permet d'attribuer des permissions.</span>
        </div>

        <div className="form-field">
          <label htmlFor="personnel-actif">Statut</label>
          <select
            id="personnel-actif"
            name="actif"
            className="inline-input"
            value={val('actif')}
            onChange={(e) => onChange('actif', e.target.value)}
          >
            <option value="true">Actif</option>
            <option value="false">Inactif</option>
          </select>
        </div>
      </div>
    </>
  );
}
