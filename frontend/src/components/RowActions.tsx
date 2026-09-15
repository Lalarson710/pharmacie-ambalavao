import { Edit2, Printer, Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';

interface RowActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onPrint?: () => void;
  editLabel?: string;
  deleteLabel?: string;
  printLabel?: string;
  children?: ReactNode;
}

export function RowActions({
  onEdit,
  onDelete,
  onPrint,
  editLabel = 'Modifier',
  deleteLabel = 'Supprimer',
  printLabel = 'Imprimer',
  children,
}: RowActionsProps) {
  return (
    <div className="action-buttons">
      {onEdit && (
        <button type="button" className="icon-button edit" onClick={onEdit} title={editLabel} aria-label={editLabel}>
          <Edit2 size={14} />
        </button>
      )}
      {onDelete && (
        <button type="button" className="icon-button danger" onClick={onDelete} title={deleteLabel} aria-label={deleteLabel}>
          <Trash2 size={14} />
        </button>
      )}
      {onPrint && (
        <button type="button" className="icon-button print" onClick={onPrint} title={printLabel} aria-label={printLabel}>
          <Printer size={14} />
        </button>
      )}
      {children}
    </div>
  );
}
