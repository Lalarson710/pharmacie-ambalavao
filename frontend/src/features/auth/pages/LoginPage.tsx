import { ShieldCheck } from 'lucide-react';
import { useAuth } from '../store/authStore';
import { LoginForm } from '../components/LoginForm';

export function LoginPage() {
  const { login, error, isLoading } = useAuth();

  const handleSubmit = async (credentials: { email: string; password: string }) => {
    await login(credentials);
  };

  return (
    <main className="login-page">
      <div className="wave wave-top" />
      <div className="wave wave-bottom" />
      <div className="science-orbit orbit-main" />
      <div className="science-orbit orbit-small" />
      <div className="molecule molecule-top" aria-hidden="true">
        <span className="atom atom-one" />
        <span className="atom atom-two" />
        <span className="atom atom-three" />
        <span className="bond bond-one" />
        <span className="bond bond-two" />
      </div>
      <div className="molecule molecule-bottom" aria-hidden="true">
        <span className="atom atom-one" />
        <span className="atom atom-two" />
        <span className="atom atom-three" />
        <span className="bond bond-one" />
        <span className="bond bond-two" />
      </div>

      <header className="brand-lockup">
        <img
          className="brand-logo-image"
          src="/logo 2.png"
          alt="Logo PharmaGestion Pro"
        />
        <div>
          <div className="brand-name">
            PHARMA<span>GESTION</span> PRO
          </div>
          <p>Ambalavao</p>
        </div>
      </header>

      <section className="login-panel" aria-labelledby="login-title">
        <div className="panel-glow" />
        <div className="panel-content">
          <div className="panel-heading">
            <div className="secure-badge"><ShieldCheck size={15} strokeWidth={2.5} /></div>
            <h1 id="login-title">Espace de Connexion Sécurisée</h1>
          </div>

          <LoginForm onSubmit={handleSubmit} error={error} isLoading={isLoading} />

          {/*<div className="panel-links">
            <a href="#account">Créer un compte</a>
            <a href="#support">Assistance Technique <HelpCircle size={13} /></a>
          </div>*/}
        </div>
      </section>

      <footer className="page-footer">
        <span>© 2026 Pharmacie d’Ambalavao</span>
        <a href="#mentions-legales">Mentions légales</a>
        <a href="#aide">Aide</a>
        <span>Version 1.0.0</span>
        <span className="ssl-mark">
            <ShieldCheck size={13} /> Connexion sécurisée
        </span>
    </footer>
    </main>
  );
}