interface ProduitFormProps {
  formData: Record<string, unknown>;
  onChange: (name: string, value: string) => void;
  errors: Record<string, string>;
  categoriesData: { id: number; nom: string }[];
  unitsData: { id: number; nom: string }[];
  item: { nom?: string; categorie_id?: number; unite_id?: number; code_barres?: string | null; description?: string | null; prix_achat?: string; prix_vente?: string; stock_minimum?: number; actif?: boolean } | null;
}

export function ProduitForm({ formData, onChange, errors, categoriesData, unitsData, item }: ProduitFormProps) {
  return (
    <>
      <div className="form-field">
        <label htmlFor="produit-nom">Nom *</label>
        <input id="produit-nom" name="nom" type="text" className="inline-input" onChange={(e) => onChange('nom', e.target.value)} />
        {errors.nom && <span className="form-error">{errors.nom}</span>}
      </div>
      <div className="form-field">
        <label htmlFor="produit-categorie">Catégorie *</label>
        <select id="produit-categorie" name="categorie_id" className="inline-input" onChange={(e) => onChange('categorie_id', e.target.value)}>
          <option value="">— Choisir une catégorie —</option>
          {categoriesData.map((row) => <option key={row.id} value={row.id}>{row.nom}</option>)}
        </select>
      </div>
      <div className="form-field">
        <label htmlFor="produit-unite">Unité *</label>
        <select id="produit-unite" name="unite_id" className="inline-input" onChange={(e) => onChange('unite_id', e.target.value)}>
          <option value="">— Choisir une unité —</option>
          {unitsData.map((row) => <option key={row.id} value={row.id}>{row.nom}</option>)}
        </select>
      </div>
      <div className="form-field">
        <label htmlFor="produit-code">Code-barres</label>
        <input id="produit-code" name="code_barres" type="text" className="inline-input" onChange={(e) => onChange('code_barres', e.target.value)} />
      </div>
      <div className="form-field">
        <label htmlFor="produit-description">Description</label>
        <input id="produit-description" name="description" type="text" className="inline-input" onChange={(e) => onChange('description', e.target.value)} />
      </div>
      <div className="form-field">
        <label htmlFor="produit-prix-achat">Prix d'achat (MGA) *</label>
        <input id="produit-prix-achat" name="prix_achat" type="number" min="0.01" step="0.01" className="inline-input" onChange={(e) => onChange('prix_achat', e.target.value)} />
        {errors.prix_achat && <span className="form-error">{errors.prix_achat}</span>}
      </div>
      <div className="form-field">
        <label htmlFor="produit-prix-vente">Prix de vente (MGA) *</label>
        <input id="produit-prix-vente" name="prix_vente" type="number" min="0.01" step="0.01" className="inline-input" onChange={(e) => onChange('prix_vente', e.target.value)} />
        {errors.prix_vente && <span className="form-error">{errors.prix_vente}</span>}
      </div>
      <div className="form-field">
        <label htmlFor="produit-stock">Stock minimum *</label>
        <input id="produit-stock" name="stock_minimum" type="number" min="0" className="inline-input" onChange={(e) => onChange('stock_minimum', e.target.value)} />
        {errors.stock_minimum && <span className="form-error">{errors.stock_minimum}</span>}
      </div>
      <div className="form-field">
        <label htmlFor="produit-actif">Actif</label>
        <select id="produit-actif" name="actif" className="inline-input" onChange={(e) => onChange('actif', e.target.value)}>
          <option value="true">Oui</option>
          <option value="false">Non</option>
        </select>
      </div>
    </>
  );
}
