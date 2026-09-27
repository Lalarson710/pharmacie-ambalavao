import { CreditCard, Hash, MapPin, Phone, User } from 'lucide-react';
import type { Facture, Reglement, Vente, VenteLigne } from '@/types';

interface TicketCaisseProps {
  facture: Facture | null;
  vente: Vente | null;
  lignes: VenteLigne[];
  reglements: Reglement[];
  dateImpression: Date | null;
}

/**
 * Format monétaire :
 * 25 000 Ar
 */
function formatAr(valeur: number | string | null | undefined): string {
  const nombre = Number(valeur ?? 0);

  return `${new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 0,
  }).format(Number.isNaN(nombre) ? 0 : nombre)} Ar`;
}

/**
 * Format date + heure de Madagascar :
 * 27/09/2026 09:15
 */
function formatDateHeure(valeur: Date | null): string {
  if (!valeur) return '—';

  return new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Indian/Antananarivo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(valeur);
}

/**
 * Format date simple :
 * 27/09/2026
 */
function formatDate(valeur: string | null | undefined): string {
  if (!valeur) return '—';

  const date = new Date(valeur);

  if (Number.isNaN(date.getTime())) return '—';

  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

const LIBELLE_MODE: Record<string, string> = {
  especes: 'Espèces',
  virement: 'Virement',
  cheque: 'Chèque',
  mobile: 'Mobile Money',
};

const LIBELLE_STATUT: Record<string, string> = {
  impayee: 'Impayée',
  partiellement_payee: 'Partiellement payée',
  payee: 'Payée',
  annulee: 'Annulée',
};

export function TicketCaisse({
  facture,
  vente,
  lignes,
  reglements,
  dateImpression,
}: TicketCaisseProps) {
  if (!facture) return null;

  const numeroVente =
    vente?.numero ??
    facture.vente?.numero ??
    facture.numero ??
    '—';

  // ── Totaux ────────────────────────────────────────────────────────
  const totalLignes = lignes.reduce(
    (total, ligne) => total + Number(ligne.montant ?? 0),
    0
  );

  const total = Number(facture.montant_total ?? 0) || totalLignes;

  const quantiteTotale = lignes.reduce(
    (total, ligne) => total + Number(ligne.quantite ?? 0),
    0
  );

  // ── Reglement ─────────────────────────────────────────────────────
  // On privilegie facture.reglements (deja imbrique par l'API), puis la
  // liste globale passee en prop.
  const sourceReglements = facture.reglements?.length
    ? facture.reglements
    : reglements;

  const reglementsFacture = sourceReglements.filter(
    (row) => row.facture_id === facture.id
  );

  const montantRegle = reglementsFacture.reduce(
    (total, row) => total + Number(row.montant ?? 0),
    0
  );

  const reste = Math.max(total - montantRegle, 0);

  const modesPaiement = Array.from(
    new Set(
      reglementsFacture.map(
        (row) => LIBELLE_MODE[row.mode] ?? row.mode
      )
    )
  );

  const modePaiement = modesPaiement.length
    ? modesPaiement.join(' / ')
    : 'Non précisé';

  const nomClient = vente?.client?.nom ?? 'Client de passage';

  const statutFacture =
    LIBELLE_STATUT[facture.statut] ?? facture.statut;

  return (
    <div className="ticket-print">
      {/* =========================================================
          EN-TÊTE
         ========================================================= */}
      <header className="ticket-head">
        <div className="ticket-logo" aria-hidden="true">
          <svg
            viewBox="0 0 48 48"
            width="34"
            height="34"
          >
            <circle
              cx="24"
              cy="24"
              r="22"
              className="ticket-logo-circle"
            />

            <path
              d="M21 10h6v11h11v6H27v11h-6V27H10v-6h11z"
              className="ticket-logo-cross"
            />
          </svg>
        </div>

        <h1 className="ticket-shop">
          PHARMACIE D’AMBALAVAO
        </h1>

        <p className="ticket-tagline">
          Votre santé, notre priorité
        </p>

        <div className="ticket-contact">
          <span>
            <MapPin size={10} />
            Ambalavao, Madagascar
          </span>

          <span>
            <Phone size={10} />
            034 ** *** **
          </span>
        </div>
      </header>

      {/* =========================================================
          TITRE + STATUT
         ========================================================= */}
      <div className="ticket-title">
        <span>TICKET DE CAISSE</span>
      </div>

      <div className="ticket-status">
        <span
          className={`ticket-status-badge ticket-status-${facture.statut}`}
        >
          {statutFacture}
        </span>
      </div>

      {/* =========================================================
          INFORMATIONS
         ========================================================= */}
      <section className="ticket-info">
        <div className="ticket-info-row">
          <span>
            <Hash size={9} /> N° Vente
          </span>
          <strong>{numeroVente}</strong>
        </div>

        <div className="ticket-info-row">
          <span>
            <Hash size={9} /> N° Facture
          </span>
          <strong>{facture.numero}</strong>
        </div>

        <div className="ticket-info-row">
          <span>Date impression</span>
          <strong>{formatDateHeure(dateImpression)}</strong>
        </div>

        <div className="ticket-info-row">
          <span>Client</span>
          <strong>
            <User size={9} /> {nomClient}
          </strong>
        </div>
      </section>

      <div className="ticket-divider" />

      {/* =========================================================
          ARTICLES
         ========================================================= */}
      <section className="ticket-items">
        <div className="ticket-items-header">
          <span>Désignation</span>
          <span>Qté</span>
          <span>P.U</span>
          <span>Total</span>
        </div>

        {lignes.length === 0 ? (
          <p className="ticket-empty">
            Aucun article sur cette vente.
          </p>
        ) : (
          lignes.map((ligne) => (
            <div
              className="ticket-item"
              key={ligne.id}
            >
              <div className="ticket-item-main">
                <div className="ticket-item-name">
                  {ligne.produit?.nom ?? 'Produit'}
                </div>

                {ligne.lot?.numero_lot && (
                  <div className="ticket-item-lot">
                    Lot {ligne.lot.numero_lot}

                    {ligne.lot.date_peremption && (
                      <>
                        {' · '}
                        Pérem. {formatDate(ligne.lot.date_peremption)}
                      </>
                    )}
                  </div>
                )}
              </div>

              <span className="ticket-item-qty">
                {ligne.quantite}
              </span>

              <span className="ticket-item-pu">
                {formatAr(ligne.prix_unitaire)}
              </span>

              <span className="ticket-item-total">
                {formatAr(ligne.montant)}
              </span>
            </div>
          ))
        )}
      </section>

      <div className="ticket-divider" />

      {/* =========================================================
          RÉCAPITULATIF
         ========================================================= */}
      <section className="ticket-summary">
        <div className="ticket-summary-row">
          <span>Articles</span>
          <strong>{lignes.length}</strong>
        </div>

        <div className="ticket-summary-row">
          <span>Quantité totale</span>
          <strong>{quantiteTotale}</strong>
        </div>

        <div className="ticket-summary-row">
          <span>Sous-total</span>
          <strong>{formatAr(total)}</strong>
        </div>
      </section>

      {/* =========================================================
          TOTAL
         ========================================================= */}
      <div className="ticket-total">
        <span className="ticket-total-label">TOTAL À PAYER</span>
        <strong className="ticket-total-value">
          {formatAr(total)}
        </strong>
      </div>

      {/* =========================================================
          PAIEMENT
         ========================================================= */}
      <section className="ticket-payment">
        <div className="ticket-payment-row">
          <span className="ticket-payment-title">
            <CreditCard size={11} />
            Mode de paiement
          </span>
          <strong>{modePaiement}</strong>
        </div>

        {montantRegle > 0 && (
          <div className="ticket-payment-row">
            <span className="ticket-payment-title">Montant réglé</span>
            <strong>{formatAr(montantRegle)}</strong>
          </div>
        )}

        <div className="ticket-payment-row">
          <span className="ticket-payment-title">Reste à payer</span>
          <strong className={reste > 0 ? 'ticket-due' : ''}>
            {formatAr(reste)}
          </strong>
        </div>
      </section>

      <div className="ticket-divider" />

      {/* =========================================================
          PIED
         ========================================================= */}
      <footer className="ticket-footer">
        <p className="ticket-thanks">
          Merci pour votre visite !
        </p>

        <p className="ticket-footer-shop">
          PHARMACIE D’AMBALAVAO
        </p>

        <p className="ticket-footer-text">
          Conservez ce ticket pour toute réclamation
        </p>

        <p className="ticket-footer-text">
          {formatDate(dateImpression?.toISOString() ?? null)}
        </p>
      </footer>
    </div>
  );
}
