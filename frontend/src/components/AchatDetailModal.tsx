import { Modal } from './Modal';
import { Printer } from 'lucide-react';
import { formatCurrency, formatDate, getStatutBadgeClass, formatStatut } from '@/utils/formatters';
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

  const filteredLignes = lignes.filter((l) => l.achat_id === achat.id);

  return (
    <Modal open={open} onClose={onClose} title={`Détails de l'achat ${achat.numero ?? ''}`} size="lg">
      <div  className="detail-modal print-area">
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginBottom: '16px' }}>
            <button
                type="button"
                className="icon-button print no-print"
                onClick={() => window.print()}
                title="Imprimer"
                aria-label="Imprimer"
            >
                <Printer size={16} />
            </button>
            </div>
        <div className="detail-section">
          <h4 style={{ textAlign: 'center', textDecoration: 'underline', marginBottom: '16px' }}>
            Informations de l'achat :
          </h4>
          <div className="detail-grid" >
            <div style={{ display: 'flex', gap: '8px' }}>
              <span >Numéro :</span>
              <strong>{achat.numero}</strong>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span>Fournisseur :</span>
              <strong>{achat.fournisseur?.nom ?? '—'}</strong>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span>Date :</span>
              <strong>{formatDate(achat.date_achat)}</strong>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span>Statut :</span>
              <strong>
                  {formatStatut(achat.statut)}
              </strong>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span>Montant total :</span>
              <strong>{formatCurrency(achat.montant_total)}</strong>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span>Observation :</span>
              <strong>{achat.observation ?? '—'}</strong>
            </div>
          </div>
        </div>

        <div className="detail-section" style={{ marginTop: '20px' }}>
          <h4 style={{ textAlign: 'center', textDecoration: 'underline', marginBottom: '16px' }}>
            Lignes d'achat :
          </h4>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Produit</th>
                <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>Qté</th>
                <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>Prix unitaire</th>
                <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>Total</th>
                <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>N° lot</th>
                <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Péremption</th>
              </tr>
            </thead>
            <tbody>
              {filteredLignes.map((ligne) => (
                <tr key={ligne.id}>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{ligne.produit?.nom ?? '—'}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>{ligne.quantite}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>{formatCurrency(ligne.prix_unitaire)}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>{formatCurrency(ligne.montant)}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{ligne?.numero_lot ?? '—'}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{ligne.date_peremption ? formatDate(ligne.date_peremption) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {achat.statut === 'annule' && (
        <div className="detail-section" style={{ marginTop: '20px' }}>
          <h4 style={{ textAlign: 'center', textDecoration: 'underline', marginBottom: '16px' }}>
            Historique des statuts :
          </h4>
          {statutHistory.length > 0 ? (
            <ul className="history-list" style={{ listStyle: 'none', padding: 0 }}>
              {statutHistory.map((h) => (
                <li key={h.id} style={{ padding: '8px 0', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 'bold' }}>{formatDate(h.created_at)}</span>
                  <span>→</span>
                  <span className={`badge ${getStatutBadgeClass(h.nouveau_statut)}`}>{formatStatut(h.nouveau_statut)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ textAlign: 'center', color: '#999' }}>Aucun historique disponible.</p>
          )}
        </div>
    )}
      </div>
    </Modal>
  );
}
