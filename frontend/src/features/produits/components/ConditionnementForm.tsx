import { Package, Ruler } from 'lucide-react';

interface ProductOption {
  id: number;
  nom: string;
  unite_id?: number;
  unite?: { nom?: string; abreviation?: string | null } | null;
  actif?: boolean;
}

interface UnitOption {
  id: number;
  nom: string;
  abreviation?: string | null;
  actif?: boolean;
}

interface ConditionnementFormProps {
  formData: Record<string, unknown>;
  onChange: (name: string, value: string) => void;
  errors: Record<string, string>;
  productsData: ProductOption[];
  unitsData: UnitOption[];
  item?: {
    produit_id?: number;
    unite_id?: number;
    quantite_base?: number;
    prix_vente?: string;
    code_barres?: string | null;
    est_unite_base?: boolean;
    actif?: boolean;
  } | null;
}

export function ConditionnementForm({
  formData,
  onChange,
  errors,
  productsData,
  unitsData,
}: ConditionnementFormProps) {
  const produitId = Number(formData.produit_id ?? 0);
  const produit = productsData.find((row) => row.id === produitId);

  // L'utilisateur a-t-il choisi d'utiliser l'unite de base du produit ?
  const utiliseUniteBase = formData.utilise_unite_base === 'true';

  const nomUniteBase = produit?.unite?.nom ?? null;
  const abrevUniteBase = produit?.unite?.abreviation ?? null;

  return (
    <>
      {/* ── Produit ── */}
      <div className="form-section">
        <div className="form-section-title">
          <span><Package size={13} /></span>
          <div>
            <strong>Produit</strong>
            <small>Un seul produit, plusieurs conditionnements vendables</small>
          </div>
        </div>

        <div className="form-field form-field-full">
          <label htmlFor="conditionnement-produit">
            Produit <span className="required-mark">*</span>
          </label>
          <select
            id="conditionnement-produit"
            name="produit_id"
            className="inline-input"
            value={String(formData.produit_id ?? '')}
            onChange={(e) => {
              onChange('produit_id', e.target.value);
              // Un changement de produit invalide le choix d'unite de base.
              onChange('utilise_unite_base', 'false');
            }}
          >
            <option value="">— Choisir un produit —</option>
            {productsData
              .filter((row) => row.actif !== false)
              .map((row) => (
                <option key={row.id} value={row.id}>
                  {row.nom}
                </option>
              ))}
          </select>
          {errors.produit_id && <span className="form-error">{errors.produit_id}</span>}
          {produit?.unite && (
            <span className="form-hint">
              Unité de base du produit (unité de calcul du stock) :{' '}
              <strong>
                {produit.unite.nom}
                {abrevUniteBase ? ` (${abrevUniteBase})` : ''}
              </strong>
            </span>
          )}
        </div>
      </div>

      {/* ── Conditionnement ── */}
      <div className="form-section">
        <div className="form-section-title">
          <span><Ruler size={13} /></span>
          <div>
            <strong>Conditionnement</strong>
            <small>Unité de vente et quantité équivalente en unité de base</small>
          </div>
        </div>

        {produit?.unite_id != null && (
          <div className="form-field form-field-full">
            <label
              htmlFor="conditionnement-utilise-base"
              style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
            >
              <input
                id="conditionnement-utilise-base"
                name="utilise_unite_base"
                type="checkbox"
                checked={utiliseUniteBase}
                onChange={(e) => {
                  const actif = e.target.checked;
                  onChange('utilise_unite_base', actif ? 'true' : 'false');
                  if (actif) {
                    // Reprise automatique de l'unite de base du produit.
                    onChange('unite_id', String(produit.unite_id));
                    onChange('quantite_base', '1');
                    onChange('est_unite_base', 'true');
                  } else {
                    onChange('unite_id', '');
                    onChange('quantite_base', '');
                    onChange('est_unite_base', 'false');
                  }
                }}
              />
              <span>
                Conditionnement « unité de base » (vente à l'unité :{' '}
                {nomUniteBase ?? 'unité du produit'})
              </span>
            </label>
            <span className="form-hint">
              À cocher pour la vente à l'unité. L'unité et la quantité (1) sont
              reprises automatiquement du produit.
            </span>
          </div>
        )}

        {!utiliseUniteBase && (
          <>
            <div className="form-field">
              <label htmlFor="conditionnement-unite">
                Unité de vente <span className="required-mark">*</span>
              </label>
              <select
                id="conditionnement-unite"
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
                      {row.nom} {row.abreviation ? `(${row.abreviation})` : ''}
                    </option>
                  ))}
              </select>
              {errors.unite_id && <span className="form-error">{errors.unite_id}</span>}
              <span className="form-hint">
                L'unité dans laquelle ce conditionnement est vendu (ex : plaquette, boîte).
              </span>
            </div>

            <div className="form-field">
              <label htmlFor="conditionnement-qte-base">
                Quantité en unité de base <span className="required-mark">*</span>
              </label>
              <input
                id="conditionnement-qte-base"
                name="quantite_base"
                type="number"
                min="1"
                step="1"
                placeholder="Ex : 30"
                className="inline-input"
                value={String(formData.quantite_base ?? '')}
                onChange={(e) => onChange('quantite_base', e.target.value)}
              />
              {errors.quantite_base && (
                <span className="form-error">{errors.quantite_base}</span>
              )}
              <span className="form-hint">
                Nombre d'unité(s) de base contenue(s) dans ce conditionnement.
                {produit?.unite?.nom ? ` Ex : 1 plaquette = 10 ${produit.unite.nom.toLowerCase()}.` : ''}
              </span>
            </div>
          </>
        )}

        {utiliseUniteBase && (
          <div className="form-field">
            <label htmlFor="conditionnement-qte-base-auto">Quantité en unité de base</label>
            <input
              id="conditionnement-qte-base-auto"
              name="quantite_base"
              type="number"
              value="1"
              readOnly
              disabled
              className="inline-input"
            />
            <span className="form-hint">Une unité de base vaut toujours 1.</span>
          </div>
        )}
      </div>

      {/* ── Tarification ── */}
      <div className="form-section">
        <div className="form-section-title">
          <span><Ruler size={13} /></span>
          <div>
            <strong>Tarification</strong>
            <small>Prix de vente propre à ce conditionnement</small>
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="conditionnement-prix-vente">
            Prix de vente (Ar) <span className="required-mark">*</span>
          </label>
          <input
            id="conditionnement-prix-vente"
            name="prix_vente"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            className="inline-input"
            value={String(formData.prix_vente ?? '')}
            onChange={(e) => onChange('prix_vente', e.target.value)}
          />
          {errors.prix_vente && <span className="form-error">{errors.prix_vente}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="conditionnement-code-barres">Code-barres spécifique</label>
          <input
            id="conditionnement-code-barres"
            name="code_barres"
            type="text"
            placeholder="Optionnel"
            className="inline-input"
            value={String(formData.code_barres ?? '')}
            onChange={(e) => onChange('code_barres', e.target.value)}
          />
          <span className="form-hint">
            Laisser vide pour utiliser le code-barres du produit.
          </span>
        </div>
      </div>

      {/* ── Statut ── */}
      <div className="form-section">
        <div className="form-field">
          <label htmlFor="conditionnement-actif">Statut</label>
          <select
            id="conditionnement-actif"
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
