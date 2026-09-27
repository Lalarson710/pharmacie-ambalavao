import { useEffect } from 'react';
import { Modal } from './Modal';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Building,
  CalendarDays,
  ClipboardList,
  Coins,
  Lock,
  Printer,
  TrendingUp,
  Unlock,
  User,
  Wallet,
} from 'lucide-react';
import {
  formatCurrency,
  formatDateTime,
  formatStatut,
  getStatutBadgeClass,
} from '@/utils/formatters';
import type { Caisse, MouvementCaisse } from '@/types';

interface CaisseDetailModalProps {
  open: boolean;
  caisse: Caisse | null;
  mouvements: MouvementCaisse[];
  onClose: () => void;
}

export function CaisseDetailModal({
  open,
  caisse,
  mouvements,
  onClose,
}: CaisseDetailModalProps) {
  // Bascule la classe qui active les regles d'impression A4 de la fiche.
  useEffect(() => {
    if (!open) return;

    document.body.classList.add('printing-fiche');

    return () => {
      document.body.classList.remove('printing-fiche');
    };
  }, [open]);

  if (!open || !caisse) return null;

  const lignes = mouvements.filter(
    (mouvement) => mouvement.caisse_id === caisse.id
  );

  const entrees = lignes.filter((ligne) => ligne.type === 'entree');
  const sorties = lignes.filter((ligne) => ligne.type === 'sortie');

  const totalEntrees = entrees.reduce(
    (total, ligne) => total + Number(ligne.montant ?? 0),
    0
  );

  const totalSorties = sorties.reduce(
    (total, ligne) => total + Number(ligne.montant ?? 0),
    0
  );

  const montantInitial = Number(caisse.montant_initial ?? 0);

  // Le solde theorique est toujours derive des mouvements : la caisse
  // pouvant encore etre ouverte, montant_final n'est pas renseigne.
  const montantFinal =
    caisse.montant_final !== null && caisse.montant_final !== undefined
      ? Number(caisse.montant_final)
      : montantInitial + totalEntrees - totalSorties;

  const ecart = Number(caisse.ecart ?? 0);

  const estOuverte = caisse.statut === 'ouverte';

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Détail de la caisse"
      size="lg"
    >
      <div className="achat-detail print-area caisse-detail">
        {/* ═══════════════════════════════════════════════════════════
            EN-TÊTE
           ═══════════════════════════════════════════════════════════ */}
        <header className="achat-detail-hero">
          <div className="achat-detail-hero-icon">
            <Wallet size={22} />
          </div>

          <div className="achat-detail-hero-copy">
            <span className="achat-detail-kicker">
              FEUILLES DE CAISSE
            </span>

            <strong>Caisse #{caisse.id}</strong>

            <span>
              Ouverte le {formatDateTime(caisse.date_ouverture)} •{' '}
              {lignes.length} mouvement(s)
            </span>
          </div>

          <div className="achat-detail-hero-actions no-print">
            <span
              className={`badge ${getStatutBadgeClass(caisse.statut)}`}
            >
              {formatStatut(caisse.statut)}
            </span>

            <button
              type="button"
              className="btn-export-pdf no-print"
              onClick={() => window.print()}
              title="Imprimer cette caisse"
              aria-label="Imprimer cette caisse"
            >
              <Printer size={15} /> Imprimer
            </button>
          </div>
        </header>

        {/* ═══════════════════════════════════════════════════════════
            SYNTHÈSE
           ═══════════════════════════════════════════════════════════ */}
        <section className="achat-detail-summary">
          <div className="achat-detail-summary-card">
            <span className="achat-detail-summary-icon">
              <Coins size={16} />
            </span>

            <div>
              <span>Montant initial</span>
              <strong>{formatCurrency(montantInitial)}</strong>
            </div>
          </div>

          <div className="achat-detail-summary-card">
            <span className="achat-detail-summary-icon blue">
              <ArrowDownLeft size={16} />
            </span>

            <div>
              <span>Total entrées</span>
              <strong>{formatCurrency(totalEntrees)}</strong>
            </div>
          </div>

          <div className="achat-detail-summary-card">
            <span className="achat-detail-summary-icon orange">
              <ArrowUpRight size={16} />
            </span>

            <div>
              <span>Total sorties</span>
              <strong>{formatCurrency(totalSorties)}</strong>
            </div>
          </div>

          <div className="achat-detail-summary-card">
            <span className="achat-detail-summary-icon purple">
              <TrendingUp size={16} />
            </span>

            <div>
              <span>Montant final</span>
              <strong>{formatCurrency(montantFinal)}</strong>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            INFORMATIONS
           ═══════════════════════════════════════════════════════════ */}
        <section className="achat-detail-section">
          <div className="achat-detail-section-heading">
            <div className="achat-detail-section-icon">
              <Building size={16} />
            </div>

            <div>
              <h4>Informations générales</h4>
              <p>Les informations principales de cette caisse</p>
            </div>
          </div>

          <div className="achat-detail-info-grid">
            <div className="achat-detail-info-item">
              <span className="achat-detail-info-label">
                <CalendarDays size={14} /> Date d’ouverture
              </span>
              <strong>{formatDateTime(caisse.date_ouverture)}</strong>
            </div>

            <div className="achat-detail-info-item">
              <span className="achat-detail-info-label">
                <CalendarDays size={14} /> Date de fermeture
              </span>
              <strong>
                {caisse.date_fermeture
                  ? formatDateTime(caisse.date_fermeture)
                  : '—'}
              </strong>
            </div>

            <div className="achat-detail-info-item">
              <span className="achat-detail-info-label">
                <User size={14} /> Ouvert par
              </span>
              <strong>{caisse.utilisateur?.name ?? '—'}</strong>
            </div>

            <div className="achat-detail-info-item">
              <span className="achat-detail-info-label">
                {estOuverte ? (
                  <Unlock size={14} />
                ) : (
                  <Lock size={14} />
                )}{' '}
                Statut
              </span>
              <strong>
                <span
                  className={`badge ${getStatutBadgeClass(caisse.statut)}`}
                >
                  {formatStatut(caisse.statut)}
                </span>
              </strong>
            </div>

            {caisse.ecart !== null && caisse.ecart !== undefined && (
              <div className="achat-detail-info-item">
                <span className="achat-detail-info-label">
                  <Coins size={14} /> Écart constaté
                </span>
                <strong>{formatCurrency(ecart)}</strong>
              </div>
            )}

            <div className="achat-detail-info-item achat-detail-info-wide">
              <span className="achat-detail-info-label">
                <ClipboardList size={14} /> Observation
              </span>
              <strong className="achat-detail-observation">
                {caisse.observation ?? 'Aucune observation'}
              </strong>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            MOUVEMENTS
           ═══════════════════════════════════════════════════════════ */}
        <section className="achat-detail-section">
          <div className="achat-detail-section-heading">
            <div className="achat-detail-section-icon orange">
              <ArrowDownLeft size={16} />
            </div>

            <div>
              <h4>Mouvements de caisse</h4>
              <p>Entrées et sorties enregistrées sur cette caisse</p>
            </div>

            <span className="achat-detail-count">
              {lignes.length} mouvement(s)
            </span>
          </div>

          <div className="achat-detail-table-wrap">
            <table className="achat-detail-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Motif</th>
                  <th className="achat-detail-num">Montant</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {lignes.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="achat-detail-empty">
                      Aucun mouvement enregistré sur cette caisse.
                    </td>
                  </tr>
                ) : (
                  lignes.map((ligne) => (
                    <tr key={ligne.id}>
                      <td>
                        <span
                          className={`caisse-mouvement-type caisse-mouvement-${ligne.type}`}
                        >
                          {ligne.type === 'entree' ? 'Entrée' : 'Sortie'}
                        </span>
                      </td>

                      <td>{ligne.motif ?? '—'}</td>

                      <td
                        className={`achat-detail-num caisse-mouvement-montant caisse-mouvement-${ligne.type}`}
                      >
                        {ligne.type === 'entree' ? '+' : '−'}
                        {formatCurrency(ligne.montant)}
                      </td>

                      <td>{formatDateTime(ligne.created_at ?? '')}</td>
                    </tr>
                  ))
                )}
              </tbody>

              <tfoot>
                <tr>
                  <td colSpan={2}>Solde théorique</td>
                  <td className="achat-detail-num">
                    {formatCurrency(montantFinal)}
                  </td>
                  <td>—</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            CLÔTURE
           ═══════════════════════════════════════════════════════════ */}
        <section className="caise-cloture">
          <div className="caise-cloture-row">
            <span>Montant initial</span>
            <strong>{formatCurrency(montantInitial)}</strong>
          </div>

          <div className="caise-cloture-row">
            <span>+ Entrées</span>
            <strong>{formatCurrency(totalEntrees)}</strong>
          </div>

          <div className="caise-cloture-row">
            <span>− Sorties</span>
            <strong>{formatCurrency(totalSorties)}</strong>
          </div>

          <div className="caise-cloture-total">
            <span>SOLDE FINAL</span>
            <strong>{formatCurrency(montantFinal)}</strong>
          </div>

          {!estOuverte && (
            <p className="caise-cloture-note">
              Écart de clôture : {formatCurrency(ecart)}
            </p>
          )}
        </section>
      </div>
    </Modal>
  );
}
