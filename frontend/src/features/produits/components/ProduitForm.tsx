import { DollarSign, Tag } from 'lucide-react';

interface ProduitFormProps {
  formData: Record<string, unknown>;
  onChange: (name: string, value: string) => void;
  errors: Record<string, string>;
  categoriesData: { id: number; nom: string; actif?: boolean }[];
  unitsData: { id: number; nom: string; actif?: boolean }[];
  item?: {
    nom?: string;
    categorie_id?: number;
    unite_id?: number;
    code_barres?: string | null;
    description?: string | null;
    prix_achat?: string;
    prix_vente?: string;
    stock_minimum?: number;
    actif?: boolean;
  } | null;
}

export function ProduitForm({
  formData,
  onChange,
  errors,
  categoriesData,
  unitsData,
}: ProduitFormProps) {
  return (
    <>
      {/* ── Identification ── */}
      <div className="form-section">
        <div className="form-section-title">
          <span><Tag size={13} /></span>
          <div>
            <strong>Identification</strong>
            <small>Informations générales du produit</small>
          </div>
        </div>

        <div className="form-field form-field-full">
          <label htmlFor="produit-nom">
            Nom <span className="required-mark">*</span>
          </label>
          <input
            id="produit-nom"
            name="nom"
            type="text"
            placeholder="Ex. Paracétamol 500mg"
            className="inline-input"
            value={String(formData.nom ?? '')}
            onChange={(e) => onChange('nom', e.target.value)}
          />
          {errors.nom && <span className="form-error">{errors.nom}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="produit-categorie">
            Catégorie <span className="required-mark">*</span>
          </label>
          <select
            id="produit-categorie"
            name="categories_id"
            className="inline-input"
            value={String(formData.categories_id ?? '')}
            onChange={(e) => onChange('categories_id', e.target.value)}
          >
            <option value="">— Choisir une catégorie —</option>
            {categoriesData
              .filter((row) => row.actif !== false)
              .map((row) => (
                <option key={row.id} value={row.id}>
                  {row.nom}
                </option>
              ))}
          </select>
          {errors.categories_id && (
            <span className="form-error">{errors.categories_id}</span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="produit-unite">
            Unité <span className="required-mark">*</span>
          </label>
          <select
            id="produit-unite"
            name="unite_id"
            className="inline-input"
            value={String(formData.unite_id ?? '')}
            onChange={(e) => onChange('unite_id', e.target.value)}
          >
            <option value="">— Choisir une unité —</option>
            {unitsData
              .filter((row) => row.actif !== false)
              .map((row) => (
                <option key={row.id} value={row.id}>
                  {row.nom}
                </option>
              ))}
          </select>
          {errors.unite_id && <span className="form-error">{errors.unite_id}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="produit-code">Code-barres</label>
          <input
            id="produit-code"
            name="code_barres"
            type="text"
            placeholder="Scan ou saisie manuelle"
            className="inline-input"
            value={String(formData.code_barres ?? '')}
            onChange={(e) => onChange('code_barres', e.target.value)}
          />
        </div>

        <div className="form-field form-field-full">
          <label htmlFor="produit-description">Description</label>
          <textarea
            id="produit-description"
            name="description"
            rows={3}
            placeholder="Posologie, forme galénique, composition…"
            className="inline-input"
            value={String(formData.description ?? '')}
            onChange={(e) => onChange('description', e.target.value)}
          />
        </div>
      </div>

      {/* ── Tarification & stock ── */}
      <div className="form-section">
        <div className="form-section-title">
          <span><DollarSign size={13} /></span>
          <div>
            <strong>Tarification & stock</strong>
            <small>Prix de vente, d'achat et seuil d'alerte</small>
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="produit-prix-achat">
            Prix d'achat (MGA) <span className="required-mark">*</span>
          </label>
          <input
            id="produit-prix-achat"
            name="prix_achat"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="0.00"
            className="inline-input"
            value={String(formData.prix_achat ?? '')}
            onChange={(e) => onChange('prix_achat', e.target.value)}
          />
          {errors.prix_achat && <span className="form-error">{errors.prix_achat}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="produit-prix-vente">
            Prix de vente (MGA) <span className="required-mark">*</span>
          </label>
          <input
            id="produit-prix-vente"
            name="prix_vente"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="0.00"
            className="inline-input"
            value={String(formData.prix_vente ?? '')}
            onChange={(e) => onChange('prix_vente', e.target.value)}
          />
          {errors.prix_vente && <span className="form-error">{errors.prix_vente}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="produit-stock">
            Stock minimum <span className="required-mark">*</span>
          </label>
          <input
            id="produit-stock"
            name="stock_minimum"
            type="number"
            min="0"
            placeholder="0"
            className="inline-input"
            value={String(formData.stock_minimum ?? '')}
            onChange={(e) => onChange('stock_minimum', e.target.value)}
          />
          {errors.stock_minimum && (
            <span className="form-error">{errors.stock_minimum}</span>
          )}
          <span className="form-hint">Seuil de déclenchement d'une alerte.</span>
        </div>

        <div className="form-field">
          <label htmlFor="produit-actif">Statut</label>
          <select
            id="produit-actif"
            name="actif"
            className="inline-input"
            value={String(formData.actif ?? 'true')}
            onChange={(e) => onChange('actif', e.target.value)}
          >
            <option value="true">Actif</option>
            <option value="false">Inactif</option>
          </select>
        </div>
      </div>
    </>
  );
}
