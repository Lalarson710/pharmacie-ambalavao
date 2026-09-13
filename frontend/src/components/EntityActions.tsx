import { useState, type ReactNode } from 'react';
import {
  Edit2,
  Trash2,
  X,
  Check,
} from 'lucide-react';

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
  const [mode, setMode] = useState<'view' | 'edit' | 'confirmDelete'>('view');
  const [formData, setFormData] = useState<Record<string, unknown>>(
    editInitial ? editInitial(row) : {}
  );

  const close = () => {
    setMode('view');
    setFormData(editInitial ? editInitial(row) : {});
  };

  const startEdit = () => {
    setFormData(editInitial ? editInitial(row) : {});
    setMode('edit');
  };

  const startDelete = () => setMode('confirmDelete');

  const cancelDelete = () => {
    setMode('view');
  };

  const confirmDelete = () => {
    handlers.onDelete?.(row);
    setMode('view');
  };

  const submitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    handlers.onEdit?.({ ...row, ...formData } as T);
    setMode('view');
  };

  const handleFieldChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (mode === 'confirmDelete') {
    return (
      <div className="action-confirm">
        <span className="action-confirm-text">{confirmDeleteLabel}</span>
        <div className="action-confirm-buttons">
          <button
            type="button"
            className="btn-danger btn-sm"
            onClick={confirmDelete}
          >
            <Trash2 size={14} /> Supprimer
          </button>
          <button
            type="button"
            className="btn-ghost btn-sm"
            onClick={cancelDelete}
          >
            <X size={14} /> Annuler
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'edit' && renderEditForm) {
    return (
      <div className="action-edit">
        {renderEditForm(
          row,
          close,
          (data) => handlers.onEdit?.({ ...row, ...data } as T)
        )}
        <div className="action-edit-buttons">
          <button type="button" className="btn-primary btn-sm" onClick={submitEdit}>
            <Check size={14} /> Enregistrer
          </button>
          <button type="button" className="btn-ghost btn-sm" onClick={close}>
            <X size={14} /> Annuler
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="action-buttons">
      {handlers.onEdit && (
        <button
          type="button"
          className="icon-button edit"
          onClick={startEdit}
          title="Modifier"
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
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
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