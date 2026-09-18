import { Loader2, ShieldCheck } from 'lucide-react';


interface LoadingModalProps {
  open: boolean;
  message?: string;
  variant?: 'default' | 'fullscreen';
}

export function LoadingModal({ open, message = 'Chargement en cours...', variant = 'default' }: LoadingModalProps) {
  if (!open) return null;

  if (variant === 'fullscreen') {
    return (
      <div className="loading-modal-overlay loading-fullscreen" role="status" aria-live="polite">
        {/* Fond décoratif identique à la page de login */}
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

        <div className="loading-modal">
          <div className="loading-spinner">
            <Loader2 className="spin" size={32} strokeWidth={3} />
          </div>
          <p className="loading-message">{message}</p>
          <div className="loading-dots">
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
          </div>
        </div>

        <footer className="page-footer">
          <span>© 2026 Pharmacie d'Ambalavao</span>
          <a href="#mentions-legales">Mentions légales</a>
          <a href="#aide">Aide</a>
          <span>Version 1.0.0</span>
          <span className="ssl-mark">
              <ShieldCheck size={13} /> Connexion sécurisée
          </span>
        </footer>
      </div>
    );
  }

  return (
    <div className="loading-modal-overlay" role="status" aria-live="polite">
      <div className="loading-modal">
        <div className="loading-spinner">
          <Loader2 className="spin" size={32} strokeWidth={3} />
        </div>
        <p className="loading-message">{message}</p>
        <div className="loading-dots">
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
        </div>
      </div>
    </div>
  );
}
