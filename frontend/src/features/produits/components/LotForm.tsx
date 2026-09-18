interface LotFormProps {
  formData: Record<string, unknown>;
  onChange: (name: string, value: string) => void;
  errors: Record<string, string>;
  products: { id: number; nom: string }[];
  item: { produit_id?: number; numero_lot?: string; date_peremption?: string; quantite?: number } | null;
}

export function LotForm({ formData, onChange, errors, products, item }: LotFormProps) {
  return (
    <>
      <div className="form-field">
        <label htmlFor="lot-produit">Produit *</label>
        <select id="lot-produit" name="produit_id" className="inline-input" onChange={(e) => onChange('produit_id', e.target.value)}>
          <option value="">— Choisir un produit —</option>
          {products.map((row) => <option key={row.id} value={row.id}>{row.nom}</option>)}
        </select>
        {errors.produit_id && <span className="form-error">{errors.produit_id}</span>}
      </div>
      <div className="form-field">
        <label htmlFor="lot-numero">Numéro de lot *</label>
        <input id="lot-numero" name="numero_lot" type="text" className="inline-input" onChange={(e) => onChange('numero_lot', e.target.value)} />
        {errors.numero_lot && <span className="form-error">{errors.numero_lot}</span>}
      </div>
      <div className="form-field">
        <label htmlFor="lot-date">Date de péremption *</label>
        <input id="lot-date" name="date_peremption" type="date" className="inline-input" onChange={(e) => onChange('date_peremption', e.target.value)} />
        {errors.date_peremption && <span className="form-error">{errors.date_peremption}</span>}
      </div>
      <div className="form-field">
        <label htmlFor="lot-quantite">Quantité *</label>
        <input id="lot-quantite" name="quantite" type="number" min="0" className="inline-input" onChange={(e) => onChange('quantite', e.target.value)} />
        {errors.quantite && <span className="form-error">{errors.quantite}</span>}
      </div>
    </>
  );
}
