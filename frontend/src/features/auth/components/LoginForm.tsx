import { useState, type FormEvent } from 'react';
import {
  ChevronDown,
  Eye,
  EyeOff,
  LockKeyhole,
  UserRound,
} from 'lucide-react';

const roles = ['Pharmacien Titulaire', 'Pharmacien Adjoint', 'Préparateur'];

interface LoginFormProps {
  onSubmit: (credentials: { email: string; password: string }) => Promise<void>;
  error?: string | null;
  isLoading?: boolean;
}

export function LoginForm({ onSubmit, error, isLoading }: LoginFormProps) {
  const [role, setRole] = useState(roles[0]);
  const [email, setEmail] = useState('p.dupont@pharmacie-centrale.fr');
  const [password, setPassword] = useState('pharmagestion2024');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);
    await onSubmit({ email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label className="field-label" htmlFor="role">
        Rôle / Profil <span>(Sélectionnez votre rôle)</span>
      </label>
      <div className="field-wrap select-wrap">
        <select
          id="role"
          value={role}
          onChange={(event) => setRole(event.target.value)}
          disabled={isLoading}
        >
          {roles.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <ChevronDown size={16} aria-hidden="true" />
      </div>

      <label className="field-label" htmlFor="email">
        Nom d'utilisateur ou Adresse Email
      </label>
      <div className="field-wrap">
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          disabled={isLoading}
        />
        <UserRound size={16} aria-hidden="true" />
      </div>

      <div className="password-heading">
        <label className="field-label" htmlFor="password">Mot de passe</label>
        <a href="#forgot" >Mot de passe oublié ?</a>
      </div>
      <div className="field-wrap">
        <input
          id="password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          disabled={isLoading}
        />
        <button
          className="icon-button"
          type="button"
          onClick={() => setShowPassword((visible) => !visible)}
          aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          disabled={isLoading}
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
        <LockKeyhole size={15} aria-hidden="true" />
      </div>

      <button className="submit-button" type="submit" disabled={isLoading}>
        {isLoading ? 'CONNEXION EN COURS...' : 'SE CONNECTER'}
      </button>
      {isSubmitted && !error && !isLoading && (
        <p className="form-message">Connexion prête à être vérifiée.</p>
      )}
      {error && <p className="form-message" style={{ color: '#c0392b' }}>{error}</p>}
    </form>
  );
}