import { useEffect } from 'react';
import { Modal } from './Modal';
import {
  CalendarDays,
  ClipboardList,
  FileText,
  Hash,
  Package,
  Printer,
  ReceiptText,
  StickyNote,
  User,
  Wallet,
} from 'lucide-react';
import {
  formatCurrency,
  formatDate,
  formatStatut,
  getStatutBadgeClass,
} from '@/utils/formatters';
import type { Vente, VenteLigne } from '@/types';

interface VenteDetailModalProps {
  open: boolean;
  vente: Vente | null;
  lignes: VenteLigne[];
  onClose: () => void;
}

export function VenteDetailModal({
  open,
  vente,
  lignes,
  onClose,
}: VenteDetailModalProps) {
  // Bascule la classe qui active les regles d'impression A4 de la fiche.
  // Elle ne doit etre posee que le temps ou la fiche est ouverte : sinon
  // les impressions de page entiere (caisse, statistiques, rapports)
  // sortiraient blanches, le contenu etant masque.
  useEffect(() => {
    if (!open) return;

    document.body.classList.add('printing-fiche');

    return () => {
      document.body.classList.remove('printing-fiche');
    };
  }, [open]);

  if (!open || !vente) return null;

  const filteredLignes = lignes.filter((ligne) => ligne.vente_id === vente.id);
  const totalQuantite = filteredLignes.reduce(
    (total, ligne) => total + Number(ligne.quantite),
    0
  );
  const totalMontant = filteredLignes.reduce(
    (total, ligne) => total + Number(ligne.montant),
    0
  );
  const montantVente = Number(vente.montant_total ?? 0);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Détail de la vente"
      size="lg"
    >
      <div className="achat-detail print-area">
        <header className="achat-detail-hero">
          <div className="achat-detail-hero-icon">
            <ReceiptText size={22} />
          </div>
          <div className="achat-detail-hero-copy">
            <span className="achat-detail-kicker">TICKET DE VENTE</span>
            <strong>Vente {vente.numero ?? '—'}</strong>
            <span>
              {formatDate(vente.date_vente)} • {filteredLignes.length} ligne(s)
            </span>
          </div>
          <div className="achat-detail-hero-actions no-print">
            <span className={`badge ${getStatutBadgeClass(vente.statut)}`}>
              {formatStatut(vente.statut)}
            </span>
            <button
              type="button"
              className="btn-export-pdf no-print"
              onClick={() => window.print()}
              title="Imprimer cette vente"
              aria-label="Imprimer cette vente"
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
              <strong>{formatCurrency(vente.montant_total)}</strong>
            </div>
          </div>
          <div className="achat-detail-summary-card">
            <span className="achat-detail-summary-icon blue">
              <Package size={16} />
            </span>
            <div>
              <span>Quantité totale</span>
              <strong>{totalQuantite} unité(s)</strong>
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
              <p>Les informations principales de cette vente</p>
            </div>
          </div>

          <div className="achat-detail-info-grid">
            <div className="achat-detail-info-item">
              <span className="achat-detail-info-label">
                <Hash size={14} /> Numéro de vente
              </span>
              <strong>{vente.numero || '—'}</strong>
            </div>
            <div className="achat-detail-info-item">
              <span className="achat-detail-info-label">
                <User size={14} /> Client
              </span>
              <strong>{vente.client?.nom ?? 'Client de passage'}</strong>
            </div>
            <div className="achat-detail-info-item">
              <span className="achat-detail-info-label">
                <CalendarDays size={14} /> Date de vente
              </span>
              <strong>{formatDate(vente.date_vente)}</strong>
            </div>
            <div className="achat-detail-info-item">
              <span className="achat-detail-info-label">
                <ReceiptText size={14} /> Statut
              </span>
              <strong>
                <span className={`badge ${getStatutBadgeClass(vente.statut)}`}>
                  {formatStatut(vente.statut)}
                </span>
              </strong>
            </div>
            <div className="achat-detail-info-item achat-detail-info-wide">
              <span className="achat-detail-info-label">
                <StickyNote size={14} /> Observation
              </span>
              <strong className="achat-detail-observation">
                {vente.observation ?? 'Aucune observation'}
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
              <p>Produits, lots, quantités et prix unitaires</p>
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
                      Aucune ligne associée à cette vente.
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
                          {ligne.lot?.numero_lot ?? '—'}
                        </span>
                      </td>
                      <td>
                        {ligne.lot?.date_peremption
                          ? formatDate(ligne.lot.date_peremption)
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
                    {formatCurrency(totalMontant || montantVente)}
                  </td>
                  <td colSpan={2}>
                    {totalQuantite} unité(s) au total
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>
      </div>
    </Modal>
  );
}
