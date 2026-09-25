import { cloneElement, isValidElement, useState, type ReactElement, type ReactNode } from 'react';
import { Modal } from './Modal';
import { AlertCircle, Check, Info, X } from 'lucide-react';

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
  /** Icone affichee dans l'en-tete du formulaire */
  icon?: ReactNode;
  /** Sous-titre explicatif affiche sous le titre */
  subtitle?: string;
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
  icon?: ReactNode;
  subtitle?: string;
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
  icon,
  subtitle,
}: EntityFormModalContentProps<T>) {
  const [formData, setFormData] = useState<Record<string, unknown>>(() =>
    getInitialData(editItem)
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const isEdit = Boolean(editItem);

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
      setSubmitted(true);
      return;
    }
    onSubmit(formData);
    onClose();
  };

  const errorList = Object.entries(errors);

  return (
    <Modal open onClose={onClose} title={title} size={size}>
      <form onSubmit={handleSubmit} noValidate>
        {/* En-tete moderne */}
        <div className="entity-form-hero">
          <span className="entity-form-hero-icon">{icon ?? <Info size={18} />}</span>
          <div className="entity-form-hero-copy">
            <strong>{isEdit ? `Modifier — ${title}` : title}</strong>
            <span>
              {subtitle ??
                (isEdit
                  ? 'Mettez à jour les informations puis enregistrez.'
                  : 'Remplissez les champs requis puis enregistrez.')}
            </span>
          </div>
        </div>

        {/* Corps du formulaire */}
        <div className="entity-form-body">
          <div className="form-grid">
            {submitted && errorList.length > 0 && (
              <div className="form-error-summary">
                <strong>
                  <AlertCircle size={13} /> {errorList.length} champ(s) à corriger
                </strong>
                {errorList.map(([field, message]) => (
                  <span key={field}>{message}</span>
                ))}
              </div>
            )}
            {attachFormData(renderForm(formData, handleChange, errors), formData)}
          </div>
        </div>

        {/* Pied colle */}
        <div className="entity-form-footer">
          <span className="entity-form-footer-note">
            <Info size={13} /> Les champs marqués * sont obligatoires
          </span>
          <div className="entity-form-footer-actions">
            <button type="button" className="btn-ghost" onClick={onClose}>
              <X size={16} /> Annuler
            </button>
            <button type="submit" className="btn-primary">
              <Check size={16} /> {isEdit ? 'Enregistrer les modifications' : 'Créer'}
            </button>
          </div>
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
