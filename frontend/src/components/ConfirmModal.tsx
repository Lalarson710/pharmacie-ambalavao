import { AlertTriangle, X } from 'lucide-react';
import { Modal } from './Modal';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = 'Supprimer',
  cancelLabel = 'Annuler',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <Modal open={open} onClose={onCancel} title={title} size="sm">
      <div className="confirm-modal">
        <AlertTriangle size={22} aria-hidden="true" />
        <p>{message}</p>
        <div className="confirm-modal-actions">
          <button type="button" className="btn-ghost btn-sm" onClick={onCancel}>
            <X size={14} /> {cancelLabel}
          </button>
          <button type="button" className="btn-danger btn-sm" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
