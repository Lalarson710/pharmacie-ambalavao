import { useState, type ReactNode } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { Modal } from './Modal';
import { ConfirmModal } from './ConfirmModal';

export interface ActionHandlers<T> {
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
}

interface EntityActionsProps<T> {
  row: T;
  handlers: ActionHandlers<T>;
  renderEditForm?: (row: T, onClose: () => void, onSubmit: (data: Record<string, unknown>) => void) => ReactNode;
  editInitial?: (row: T) => Record<string, unknown>;
  confirmDeleteLabel?: string;
}

export function EntityActions<T extends { id: number | string }>({
  row,
  handlers,
  renderEditForm,
  editInitial,
  confirmDeleteLabel = 'Supprimer cet élément ?',
}: EntityActionsProps<T>) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, unknown>>({});

  const closeEdit = () => {
    setEditOpen(false);
    setFormData(editInitial ? editInitial(row) : {});
  };

  const startEdit = () => {
    setFormData(editInitial ? editInitial(row) : {});
    setEditOpen(true);
  };

  const submitEdit = (data: Record<string, unknown>) => {
    handlers.onEdit?.({ ...row, ...data } as T);
    setEditOpen(false);
  };

  const startDelete = () => setDeleteOpen(true);
  const cancelDelete = () => setDeleteOpen(false);
  const confirmDelete = () => {
    handlers.onDelete?.(row);
    setDeleteOpen(false);
  };

  return (
    <>
      <div className="action-buttons">
        {handlers.onEdit && (
          <button
            type="button"
            className="icon-button edit"
            onClick={startEdit}
            title="Modifier"
            aria-label="Modifier"
          >
            <Edit2 size={14} />
          </button>
        )}
        {handlers.onDelete && (
          <button
            type="button"
            className="icon-button danger"
            onClick={startDelete}
            title="Supprimer"
            aria-label="Supprimer"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {editOpen && renderEditForm && (
        <Modal open={editOpen} onClose={closeEdit} title="Modifier" size="md">
          <div className="action-modal-body">
            {renderEditForm(row, closeEdit, submitEdit)}
            <div className="form-actions action-modal-actions">
              <button type="button" className="btn-ghost btn-sm" onClick={closeEdit}>
                Annuler
              </button>
              <button type="button" className="btn-primary btn-sm" onClick={() => submitEdit(formData)}>
                Enregistrer
              </button>
            </div>
          </div>
        </Modal>
      )}

      <ConfirmModal
        open={deleteOpen}
        title="Confirmer la suppression"
        message={confirmDeleteLabel}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </>
  );
}

export function InlineField({
  name,
  value,
  onChange,
  type = 'text',
}: {
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  type?: string;
}) {
  return (
    <input
      type={type}
      className="inline-input"
      value={value}
      onChange={(e) => onChange(name, e.target.value)}
    />
  );
}

export function InlineSelect({
  name,
  value,
  onChange,
  options,
}: {
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      className="inline-input"
      value={value}
      onChange={(e) => onChange(name, e.target.value)}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
