import { useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/authStore';
import { LoginForm } from '../components/LoginForm';
import { LoadingModal } from '@/components/LoadingModal';
import { AnimatedBackground } from '@/components/AnimatedBackground';

export function LoginPage() {
  const { login, error, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Rediriger si déjà connecté (dans useEffect pour éviter le warning React)
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (credentials: { email: string; password: string }) => {
    try {
      await login(credentials);
    } catch {
      // L'erreur est déjà gérée dans le store (set error)
      // On ne fait rien ici, le message s'affichera via la prop error
    }
  };

  // Afficher un état de chargement pendant la redirection
  if (isAuthenticated) {
    return (
      <main className="login-page">
        <LoadingModal open={true} message="Redirection..." />
      </main>
    );
  }

  return (
    <main className="login-page">
      <div className="wave wave-top" />
      <div className="wave wave-bottom" />

      <div className="login-aurora" aria-hidden="true">
        <span className="aurora-blob aurora-blob-a" />
        <span className="aurora-blob aurora-blob-b" />
        <span className="aurora-blob aurora-blob-c" />
      </div>

      <div className="login-particles">
        <AnimatedBackground
          color="rgba(77, 140, 20, 0.72)"
          crossColor="rgba(103, 175, 26, 0.78)"
          density={44}
          linkDistance={138}
          opacity={0.5}
        />
      </div>
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
        <div className="brand-text">
          <span className="brand-eyebrow">Gestion</span>
          <div className="brand-title">
            <span className="brand-letters">
              {'PHARMACIE'.split('').map((letter, index) => (
                <span
                  key={letter}
                  className="brand-letter"
                  style={{ animationDelay: `${120 + index * 45}ms` }}
                >
                  {letter}
                </span>
              ))}
            </span>
            <span className="brand-pro">PRO</span>
          </div>
          <p className="brand-city">
            <span className="brand-city-line" />
            Ambalavao
          </p>
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
        <span>© 2026 Pharmacie d'Ambalavao</span>
        <a href="#mentions-legales">Mentions légales</a>
        <a href="#aide">Aide</a>
        <span>Version 1.0.0</span>
        <span className="ssl-mark">
            <ShieldCheck size={13} /> Connexion sécurisée
        </span>
    </footer>

      <LoadingModal open={isLoading} message="Connexion en cours..." />
    </main>
  );
}
