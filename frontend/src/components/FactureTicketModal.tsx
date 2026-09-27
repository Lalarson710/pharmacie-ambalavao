import { useEffect } from 'react';
import { Printer } from 'lucide-react';
import { Modal } from './Modal';
import { TicketCaisse } from './TicketCaisse';
import type { Facture, Reglement, Vente, VenteLigne } from '@/types';

interface FactureTicketModalProps {
  open: boolean;
  facture: Facture | null;
  vente: Vente | null;
  lignes: VenteLigne[];
  reglements: Reglement[];
  dateImpression: Date | null;
  onClose: () => void;
  onPrint: () => void;
}

export function FactureTicketModal({
  open,
  facture,
  vente,
  lignes,
  reglements,
  dateImpression,
  onClose,
  onPrint,
}: FactureTicketModalProps) {
  // Bascule la classe qui active les règles d'impression thermique 80 mm.
  // Sans ce marqueur, le `body * { visibility: hidden !important }` de
  // ticket-caisse.css s'appliquerait aussi aux impressions A4 des fiches
  // (achat / vente) et les rendrait toutes blanches.
  useEffect(() => {
    if (!open) return;

    document.body.classList.add('printing-ticket');

    // Une regle @page ne peut pas etre conditionnee en CSS : on l'injecte
    // uniquement le temps ou le ticket est ouvert.
    const style = document.createElement('style');
    style.setAttribute('data-ticket-page', 'true');
    style.textContent = '@page { size: 80mm auto; margin: 0; }';
    document.head.appendChild(style);

    return () => {
      document.body.classList.remove('printing-ticket');
      style.remove();
    };
  }, [open]);

  if (!open || !facture) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Ticket de caisse — ${facture.numero}`}
      size="sm"
    >
      <div className="ticket-preview">
        <div className="ticket-preview-actions no-print">
          <button
            type="button"
            className="btn-primary"
            onClick={onPrint}
            title="Imprimer le ticket"
          >
            <Printer size={15} /> Imprimer le ticket
          </button>

          <span className="ticket-preview-hint">
            Format ticket thermique 80 mm — Dans la boîte d’impression, choisir
            « Format réel » et un papier de 80 mm.
          </span>
        </div>

        <TicketCaisse
          facture={facture}
          vente={vente}
          lignes={lignes}
          reglements={reglements}
          dateImpression={dateImpression}
        />
      </div>
    </Modal>
  );
}
