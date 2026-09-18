import { useState, type FormEvent } from 'react';
import {
  Eye,
  EyeOff,
  LockKeyhole,
  UserRound,
} from 'lucide-react';

interface LoginFormProps {
  onSubmit: (credentials: { email: string; password: string }) => Promise<void>;
  error?: string | null;
  isLoading?: boolean;
}

export function LoginForm({ onSubmit, error, isLoading }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);
    await onSubmit({ email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
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
          placeholder="Entrez votre email"
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
          placeholder="Entrez votre mot de passe"
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
