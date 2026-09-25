import { Modal } from './Modal';
import {
  Building2,
  CalendarDays,
  ClipboardList,
  FileText,
  Hash,
  History,
  Package,
  Printer,
  ReceiptText,
  StickyNote,
  Wallet,
} from 'lucide-react';
import {
  formatCurrency,
  formatDate,
  formatStatut,
  getStatutBadgeClass,
} from '@/utils/formatters';
import type { Achat, AchatLigne, AchatStatut } from '@/types';

interface AchatDetailModalProps {
  open: boolean;
  achat: Achat | null;
  lignes: AchatLigne[];
  statutHistory: AchatStatut[];
  onClose: () => void;
}

export function AchatDetailModal({
  open,
  achat,
  lignes,
  statutHistory,
  onClose,
}: AchatDetailModalProps) {
  if (!open || !achat) return null;

  const filteredLignes = lignes.filter((ligne) => ligne.achat_id === achat.id);
  const totalLignes = filteredLignes.reduce(
    (total, ligne) => total + Number(ligne.quantite),
    0,
  );
  const totalMontant = filteredLignes.reduce(
    (total, ligne) => total + Number(ligne.montant),
    0,
  );
  const montantAchat = Number(achat.montant_total ?? 0);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Détail de l’achat"
      size="lg"
    >
      <div className="achat-detail print-area">
        <header className="achat-detail-hero">
          <div className="achat-detail-hero-icon">
            <ReceiptText size={22} />
          </div>
          <div className="achat-detail-hero-copy">
            <span className="achat-detail-kicker">BON DE COMMANDE</span>
            <strong>Achat {achat.numero ?? '—'}</strong>
            <span>
              {formatDate(achat.date_achat)} • {filteredLignes.length}{' '}
              ligne(s)
            </span>
          </div>
          <div className="achat-detail-hero-actions no-print">
            <span className={`badge ${getStatutBadgeClass(achat.statut)}`}>
              {formatStatut(achat.statut)}
            </span>
            <button
              type="button"
              className="btn-export-pdf no-print"
              onClick={() => window.print()}
              title="Imprimer cet achat"
              aria-label="Imprimer cet achat"
            >
              <Printer size={15} /> Imprimer
            </button>
          </div>
        </header>

        <section className="achat-detail-summary">
          <div className="achat-detail-summary-card">
            <span className="achat-detail-summary-icon">
              <Wallet size={16} />
            </span>
            <div>
              <span>Montant total</span>
              <strong>{formatCurrency(achat.montant_total)}</strong>
            </div>
          </div>
          <div className="achat-detail-summary-card">
            <span className="achat-detail-summary-icon blue">
              <Package size={16} />
            </span>
            <div>
              <span>Quantité totale</span>
              <strong>{totalLignes} unité(s)</strong>
            </div>
          </div>
          <div className="achat-detail-summary-card">
            <span className="achat-detail-summary-icon purple">
              <ClipboardList size={16} />
            </span>
            <div>
              <span>Références</span>
              <strong>{filteredLignes.length} ligne(s)</strong>
            </div>
          </div>
        </section>

        <section className="achat-detail-section">
          <div className="achat-detail-section-heading">
            <div className="achat-detail-section-icon">
              <FileText size={16} />
            </div>
            <div>
              <h4>Informations générales</h4>
              <p>Les informations principales de cet achat</p>
            </div>
          </div>

          <div className="achat-detail-info-grid">
            <div className="achat-detail-info-item">
              <span className="achat-detail-info-label">
                <Hash size={14} /> Numéro d’achat
              </span>
              <strong>{achat.numero || '—'}</strong>
            </div>
            <div className="achat-detail-info-item">
              <span className="achat-detail-info-label">
                <Building2 size={14} /> Fournisseur
              </span>
              <strong>{achat.fournisseur?.nom ?? '—'}</strong>
            </div>
            <div className="achat-detail-info-item">
              <span className="achat-detail-info-label">
                <CalendarDays size={14} /> Date d’achat
              </span>
              <strong>{formatDate(achat.date_achat)}</strong>
            </div>
            <div className="achat-detail-info-item">
              <span className="achat-detail-info-label">
                <ReceiptText size={14} /> Statut
              </span>
              <strong>
                <span className={`badge ${getStatutBadgeClass(achat.statut)}`}>
                  {formatStatut(achat.statut)}
                </span>
              </strong>
            </div>
            <div className="achat-detail-info-item achat-detail-info-wide">
              <span className="achat-detail-info-label">
                <StickyNote size={14} /> Observation
              </span>
              <strong className="achat-detail-observation">
                {achat.observation ?? 'Aucune observation'}
              </strong>
            </div>
          </div>
        </section>

        <section className="achat-detail-section">
          <div className="achat-detail-section-heading">
            <div className="achat-detail-section-icon orange">
              <Package size={16} />
            </div>
            <div>
              <h4>Détail des articles</h4>
              <p>Produits, quantités, prix et numéros de lot</p>
            </div>
            <span className="achat-detail-count">
              {filteredLignes.length} ligne(s)
            </span>
          </div>

          <div className="achat-detail-table-wrap">
            <table className="achat-detail-table">
              <thead>
                <tr>
                  <th>Produit</th>
                  <th className="achat-detail-num">Qté</th>
                  <th className="achat-detail-num">Prix unitaire</th>
                  <th className="achat-detail-num">Total</th>
                  <th>N° lot</th>
                  <th>Péremption</th>
                </tr>
              </thead>
              <tbody>
                {filteredLignes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="achat-detail-empty">
                      Aucune ligne associée à cet achat.
                    </td>
                  </tr>
                ) : (
                  filteredLignes.map((ligne) => (
                    <tr key={ligne.id}>
                      <td>
                        <span className="achat-detail-product">
                          {ligne.produit?.nom ?? '—'}
                        </span>
                      </td>
                      <td className="achat-detail-num achat-detail-quantity">
                        {ligne.quantite}
                      </td>
                      <td className="achat-detail-num">
                        {formatCurrency(ligne.prix_unitaire)}
                      </td>
                      <td className="achat-detail-num achat-detail-amount">
                        {formatCurrency(ligne.montant)}
                      </td>
                      <td>
                        <span className="achat-detail-lot">
                          {ligne.numero_lot ?? '—'}
                        </span>
                      </td>
                      <td>
                        {ligne.date_peremption
                          ? formatDate(ligne.date_peremption)
                          : '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3}>Total des lignes</td>
                  <td className="achat-detail-num">
                    {formatCurrency(totalMontant || montantAchat)}
                  </td>
                  <td colSpan={2}>
                    {totalLignes} unité(s) au total
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        {statutHistory.length > 0 && (
          <section className="achat-detail-section">
            <div className="achat-detail-section-heading">
              <div className="achat-detail-section-icon history">
                <History size={16} />
              </div>
              <div>
                <h4>Historique des statuts</h4>
                <p>Suivi des changements de statut de cet achat</p>
              </div>
              <span className="achat-detail-count">
                {statutHistory.length} événement(s)
              </span>
            </div>

            <div className="achat-detail-timeline">
              {statutHistory.map((history, index) => (
                <div
                  className="achat-detail-timeline-item"
                  key={history.id}
                >
                  <span className="achat-detail-timeline-dot" />
                  <div className="achat-detail-timeline-content">
                    <strong>{formatStatut(history.nouveau_statut)}</strong>
                    <span>{formatDate(history.created_at)}</span>
                    {history.commentaire && (
                      <small>{history.commentaire}</small>
                    )}
                  </div>
                  {index < statutHistory.length - 1 && (
                    <span className="achat-detail-timeline-line" />
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </Modal>
  );
}
