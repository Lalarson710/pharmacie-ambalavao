interface LotFormProps {
  formData: Record<string, unknown>;
  onChange: (name: string, value: string) => void;
  errors: Record<string, string>;
  products: { id: number; nom: string; actif?: boolean }[];
  item?: {
    produit_id?: number;
    numero_lot?: string;
    date_peremption?: string;
    quantite?: number;
  } | null;
}

export function LotForm({ formData, onChange, errors, products }: LotFormProps) {
  return (
    <>
      <div className="form-field form-field-full">
        <label htmlFor="lot-produit">
          Produit <span className="required-mark">*</span>
        </label>
        <select
          id="lot-produit"
          name="produit_id"
          className="inline-input"
          value={String(formData.produit_id ?? '')}
          onChange={(e) => onChange('produit_id', e.target.value)}
        >
          <option value="">— Choisir un produit —</option>
          {products
            .filter((row) => row.actif !== false)
            .map((row) => (
              <option key={row.id} value={row.id}>
                {row.nom}
              </option>
            ))}
        </select>
        {errors.produit_id && <span className="form-error">{errors.produit_id}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="lot-numero">
          Numéro de lot <span className="required-mark">*</span>
        </label>
        <input
          id="lot-numero"
          name="numero_lot"
          type="text"
          placeholder="Ex. LOT-2026-014"
          className="inline-input"
          value={String(formData.numero_lot ?? '')}
          onChange={(e) => onChange('numero_lot', e.target.value)}
        />
        {errors.numero_lot && <span className="form-error">{errors.numero_lot}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="lot-date">
          Date de péremption <span className="required-mark">*</span>
        </label>
        <input
          id="lot-date"
          name="date_peremption"
          type="date"
          className="inline-input"
          value={String(formData.date_peremption ?? '')}
          onChange={(e) => onChange('date_peremption', e.target.value)}
        />
        {errors.date_peremption && (
          <span className="form-error">{errors.date_peremption}</span>
        )}
        <span className="form-hint">Utilisée pour les alertes de péremption.</span>
      </div>

      <div className="form-field">
        <label htmlFor="lot-quantite">
          Quantité <span className="required-mark">*</span>
        </label>
        <input
          id="lot-quantite"
          name="quantite"
          type="number"
          min="0"
          placeholder="0"
          className="inline-input"
          value={String(formData.quantite ?? '')}
          onChange={(e) => onChange('quantite', e.target.value)}
        />
        {errors.quantite && <span className="form-error">{errors.quantite}</span>}
      </div>
    </>
  );
}
