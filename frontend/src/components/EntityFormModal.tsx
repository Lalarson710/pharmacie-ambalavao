import { cloneElement, isValidElement, useState, type ReactElement, type ReactNode } from 'react';
import { Modal } from './Modal';
import { X, Check } from 'lucide-react';

interface EntityFormModalProps<T> {
  open: boolean;
  onClose: () => void;
  title: string;
  editItem: T | null;
  onSubmit: (data: Record<string, unknown>) => void;
  renderForm: (
    formData: Record<string, unknown>,
    onChange: (name: string, value: string) => void,
    errors: Record<string, string>
  ) => ReactNode;
  getInitialData: (item: T | null) => Record<string, unknown>;
  validate: (data: Record<string, unknown>) => Record<string, string>;
  size?: 'sm' | 'md' | 'lg';
}

interface EntityFormModalContentProps<T> {
  onClose: () => void;
  title: string;
  editItem: T | null;
  onSubmit: (data: Record<string, unknown>) => void;
  renderForm: (
    formData: Record<string, unknown>,
    onChange: (name: string, value: string) => void,
    errors: Record<string, string>
  ) => ReactNode;
  getInitialData: (item: T | null) => Record<string, unknown>;
  validate: (data: Record<string, unknown>) => Record<string, string>;
  size?: 'sm' | 'md' | 'lg';
}

function attachFormData(node: ReactNode, formData: Record<string, unknown>): ReactNode {
  if (!isValidElement(node)) return node;

  const props = node.props as Record<string, unknown>;
  const name = typeof props.name === 'string' ? props.name : undefined;
  const elementType = typeof node.type === 'string' ? node.type.toLowerCase() : '';
  const nextProps: Record<string, unknown> = { ...props };

  if (name && !('value' in props) && !('defaultValue' in props)) {
    if (elementType === 'input' && props.type === 'checkbox') {
      nextProps.checked = String(formData[name]) === 'true';
    } else {
      nextProps.value = formData[name] === undefined ? '' : String(formData[name]);
    }
  }

  if (props.children !== undefined) {
    nextProps.children = attachFormData(props.children as ReactNode, formData);
  }

  return cloneElement(node as ReactElement<Record<string, unknown>>, nextProps);
}

function EntityFormModalContent<T extends { id: number | string }>({
  onClose,
  title,
  editItem,
  onSubmit,
  renderForm,
  getInitialData,
  validate,
  size = 'md',
}: EntityFormModalContentProps<T>) {
  const [formData, setFormData] = useState<Record<string, unknown>>(() =>
    getInitialData(editItem)
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit(formData);
    onClose();
  };

  return (
    <Modal open onClose={onClose} title={title} size={size}>
      <form onSubmit={handleSubmit} className="form-grid">
        {attachFormData(renderForm(formData, handleChange, errors), formData)}
        <div className="form-actions">
          <button type="button" className="btn-ghost" onClick={onClose}>
            <X size={16} /> Annuler
          </button>
          <button type="submit" className="btn-primary">
            <Check size={16} /> Enregistrer
          </button>
        </div>
      </form>
    </Modal>
  );
}

export function EntityFormModal<T extends { id: number | string }>({
  open,
  editItem,
  ...props
}: EntityFormModalProps<T>) {
  if (!open) return null;

  return (
    <EntityFormModalContent
      key={editItem ? `edit-${editItem.id}` : 'add'}
      editItem={editItem}
      {...props}
    />
  );
}