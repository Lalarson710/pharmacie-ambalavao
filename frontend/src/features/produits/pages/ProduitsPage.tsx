import { useState } from 'react';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { PageTabs } from '@/components/PageTabs';
import { PageToolbar } from '@/components/PageToolbar';
import { RowActions } from '@/components/RowActions';
import { EntityFormModal } from '@/components/EntityFormModal';
import { ConfirmModal } from '@/components/ConfirmModal';
import { produits, categories, unites, lots } from '@/data/mockData';
import { formatCurrency, formatDate } from '@/utils/formatters';
import type { Produit, Categorie, Unite, Lot } from '@/types';

const produitsTabs = [
  { id: 'produits', label: 'Produits' },
  { id: 'lots', label: 'Lots' },
  { id: 'categories', label: 'Catégories' },
  { id: 'unites', label: 'Unités' },
];

type CatalogueKind = 'produit' | 'categorie' | 'unite' | 'lot';
type CatalogueItem = Produit | Categorie | Unite | Lot;

interface CatalogueModalState {
  kind: CatalogueKind;
  item: CatalogueItem | null;
}

interface CatalogueDeleteTarget {
  kind: CatalogueKind;
  item: CatalogueItem;
}

const tabKind: Record<string, CatalogueKind> = {
  produits: 'produit',
  lots: 'lot',
  categories: 'categorie',
  unites: 'unite',
};

const addLabels: Record<CatalogueKind, string> = {
  produit: 'Ajouter un produit',
  lot: 'Ajouter un lot',
  categorie: 'Ajouter une catégorie',
  unite: 'Ajouter une unité',
};

export function ProduitsPage() {
  const [activeTab, setActiveTab] = useState('produits');
  const [products, setProducts] = useState<Produit[]>(produits);
  const [categoriesData, setCategoriesData] = useState<Categorie[]>(categories);
  const [unitsData, setUnitsData] = useState<Unite[]>(unites);
  const [lotsData, setLotsData] = useState<Lot[]>(lots);
  const [modal, setModal] = useState<CatalogueModalState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CatalogueDeleteTarget | null>(null);
  const [search, setSearch] = useState('');

  const filteredProducts = search
    ? products.filter((row) =>
        [row.nom, row.code_barres, row.description]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(search.toLowerCase()))
      )
    : products;

  const filteredLots = search
    ? lotsData.filter((row) =>
        [row.numero_lot, row.produit?.nom]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(search.toLowerCase()))
      )
    : lotsData;

  const filteredCategories = search
    ? categoriesData.filter((row) =>
        [row.nom, row.description]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(search.toLowerCase()))
      )
    : categoriesData;

  const filteredUnits = search
    ? unitsData.filter((row) =>
        [row.nom, row.abreviation]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(search.toLowerCase()))
      )
    : unitsData;

  const productColumns: Column<Produit>[] = [
    { key: 'id', label: '#' },
    { key: 'nom', label: 'Produit' },
    { key: 'categories', label: 'Catégorie', render: (row) => row.categorie?.nom ?? '—' },
    { key: 'unite', label: 'Unité', render: (row) => row.unite?.abreviation ?? '—' },
    { key: 'code_barres', label: 'Code-barres' },
    { key: 'prix_achat', label: "Prix d'achat", render: (row) => formatCurrency(row.prix_achat) },
    { key: 'prix_vente', label: 'Prix de vente', render: (row) => formatCurrency(row.prix_vente) },
    { key: 'stock_minimum', label: 'Stock min.' },
    { key: 'actif', label: 'Actif', render: (row) => <span className={`badge ${row.actif ? 'badge-active' : 'badge-inactive'}`}>{row.actif ? 'Oui' : 'Non'}</span> },
  ];

  const categoryColumns: Column<Categorie>[] = [
    { key: 'id', label: '#' },
    { key: 'nom', label: 'Nom' },
    { key: 'description', label: 'Description' },
    { key: 'actif', label: 'Actif', render: (row) => <span className={`badge ${row.actif ? 'badge-active' : 'badge-inactive'}`}>{row.actif ? 'Oui' : 'Non'}</span> },
  ];

  const unitColumns: Column<Unite>[] = [
    { key: 'id', label: '#' },
    { key: 'nom', label: 'Nom' },
    { key: 'abreviation', label: 'Abréviation' },
    { key: 'actif', label: 'Actif', render: (row) => <span className={`badge ${row.actif ? 'badge-active' : 'badge-inactive'}`}>{row.actif ? 'Oui' : 'Non'}</span> },
  ];

  const lotColumns: Column<Lot>[] = [
    { key: 'id', label: '#' },
    { key: 'produit', label: 'Produit', render: (row) => row.produit?.nom ?? '—' },
    { key: 'numero_lot', label: 'N° de lot' },
    { key: 'date_peremption', label: 'Date de péremption', render: (row) => formatDate(row.date_peremption) },
    { key: 'quantite', label: 'Quantité' },
  ];

  const openAdd = () => {
    const kind = tabKind[activeTab] ?? 'produit';
    setModal({ kind, item: null });
  };

  const openEdit = (kind: CatalogueKind, item: CatalogueItem) => {
    setModal({ kind, item });
  };

  const handleSave = (formData: Record<string, unknown>) => {
    if (!modal) return;

    if (modal.kind === 'produit') {
      const productData = {
        nom: String(formData.nom),
        code_barres: (formData.code_barres as string) || null,
        description: (formData.description as string) || null,
        prix_achat: String(formData.prix_achat),
        prix_vente: String(formData.prix_vente),
        stock_minimum: Number(formData.stock_minimum),
        actif: formData.actif === 'true',
      };
      if (modal.item) {
        setProducts((prev) => prev.map((row) => row.id === modal.item?.id ? { ...row, ...productData } : row));
      } else {
        const newProduct: Produit = {
          id: products.length > 0 ? Math.max(...products.map((row) => row.id)) + 1 : 1,
          categorie_id: Number(formData.categorie_id) || categoriesData[0]?.id || 1,
          unite_id: Number(formData.unite_id) || unitsData[0]?.id || 1,
          ...productData,
        };
        setProducts((prev) => [...prev, newProduct]);
      }
    }

    if (modal.kind === 'categorie') {
      const categoryData = {
        nom: String(formData.nom),
        description: (formData.description as string) || null,
        actif: formData.actif === 'true',
      };
      if (modal.item) {
        setCategoriesData((prev) => prev.map((row) => row.id === modal.item?.id ? { ...row, ...categoryData } : row));
      } else {
        const newCategory: Categorie = {
          id: categoriesData.length > 0 ? Math.max(...categoriesData.map((row) => row.id)) + 1 : 1,
          ...categoryData,
        };
        setCategoriesData((prev) => [...prev, newCategory]);
      }
    }

    if (modal.kind === 'unite') {
      const unitData = {
        nom: String(formData.nom),
        abreviation: (formData.abreviation as string) || null,
        actif: formData.actif === 'true',
      };
      if (modal.item) {
        setUnitsData((prev) => prev.map((row) => row.id === modal.item?.id ? { ...row, ...unitData } : row));
      } else {
        const newUnit: Unite = {
          id: unitsData.length > 0 ? Math.max(...unitsData.map((row) => row.id)) + 1 : 1,
          ...unitData,
        };
        setUnitsData((prev) => [...prev, newUnit]);
      }
    }

    if (modal.kind === 'lot') {
      const lotData = {
        produit_id: Number(formData.produit_id),
        numero_lot: String(formData.numero_lot),
        date_peremption: String(formData.date_peremption),
        quantite: Number(formData.quantite),
        produit: products.find((row) => row.id === Number(formData.produit_id)),
      };
      if (modal.item) {
        setLotsData((prev) => prev.map((row) => row.id === modal.item?.id ? { ...row, ...lotData } : row));
      } else {
        const newLot: Lot = {
          id: lotsData.length > 0 ? Math.max(...lotsData.map((row) => row.id)) + 1 : 1,
          ...lotData,
        };
        setLotsData((prev) => [...prev, newLot]);
      }
    }

    setModal(null);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.kind === 'produit') setProducts((prev) => prev.filter((row) => row.id !== deleteTarget.item.id));
    if (deleteTarget.kind === 'categorie') setCategoriesData((prev) => prev.filter((row) => row.id !== deleteTarget.item.id));
    if (deleteTarget.kind === 'unite') setUnitsData((prev) => prev.filter((row) => row.id !== deleteTarget.item.id));
    if (deleteTarget.kind === 'lot') setLotsData((prev) => prev.filter((row) => row.id !== deleteTarget.item.id));
    setDeleteTarget(null);
  };

  const getInitialData = (item: CatalogueItem | null) => {
    if (!modal) return {};
    if (modal.kind === 'produit') {
      const row = item as Produit | null;
      return {
        nom: row?.nom ?? '',
        categorie_id: row ? String(row.categorie_id) : String(categoriesData[0]?.id ?? ''),
        unite_id: row ? String(row.unite_id) : String(unitsData[0]?.id ?? ''),
        code_barres: row?.code_barres ?? '',
        description: row?.description ?? '',
        prix_achat: row?.prix_achat ?? '',
        prix_vente: row?.prix_vente ?? '',
        stock_minimum: row ? String(row.stock_minimum) : '',
        actif: row ? String(row.actif) : 'true',
      };
    }
    if (modal.kind === 'categorie') {
      const row = item as Categorie | null;
      return { nom: row?.nom ?? '', description: row?.description ?? '', actif: row ? String(row.actif) : 'true' };
    }
    if (modal.kind === 'unite') {
      const row = item as Unite | null;
      return { nom: row?.nom ?? '', abreviation: row?.abreviation ?? '', actif: row ? String(row.actif) : 'true' };
    }
    const row = item as Lot | null;
    return {
      produit_id: row ? String(row.produit_id) : '',
      numero_lot: row?.numero_lot ?? '',
      date_peremption: row?.date_peremption ?? '',
      quantite: row ? String(row.quantite) : '',
    };
  };

  const validate = (formData: Record<string, unknown>) => {
    const errors: Record<string, string> = {};
    if (!modal) return errors;
    if (modal.kind === 'produit') {
      if (!formData.nom) errors.nom = 'Le nom est obligatoire.';
      if (!formData.prix_achat || Number(formData.prix_achat) <= 0) errors.prix_achat = "Prix d'achat invalide.";
      if (!formData.prix_vente || Number(formData.prix_vente) <= 0) errors.prix_vente = 'Prix de vente invalide.';
      if (!formData.stock_minimum || Number(formData.stock_minimum) < 0) errors.stock_minimum = 'Stock minimum invalide.';
    }
    if (modal.kind === 'categorie' && !formData.nom) errors.nom = 'Le nom est obligatoire.';
    if (modal.kind === 'unite' && !formData.nom) errors.nom = 'Le nom est obligatoire.';
    if (modal.kind === 'lot') {
      if (!formData.produit_id) errors.produit_id = 'Le produit est obligatoire.';
      if (!formData.numero_lot) errors.numero_lot = 'Le numéro de lot est obligatoire.';
      if (!formData.date_peremption) errors.date_peremption = 'La date de péremption est obligatoire.';
      if (!formData.quantite || Number(formData.quantite) < 0) errors.quantite = 'La quantité est invalide.';
    }
    return errors;
  };

  const renderForm = (
    _formData: Record<string, unknown>,
    onChange: (name: string, value: string) => void,
    errors: Record<string, string>
  ) => {
    if (!modal) return null;

    if (modal.kind === 'produit') {
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

    if (modal.kind === 'categorie') {
      return (
        <>
          <div className="form-field">
            <label htmlFor="categorie-nom">Nom *</label>
            <input id="categorie-nom" name="nom" type="text" className="inline-input" onChange={(e) => onChange('nom', e.target.value)} />
            {errors.nom && <span className="form-error">{errors.nom}</span>}
          </div>
          <div className="form-field">
            <label htmlFor="categorie-description">Description</label>
            <input id="categorie-description" name="description" type="text" className="inline-input" onChange={(e) => onChange('description', e.target.value)} />
          </div>
          <div className="form-field">
            <label htmlFor="categorie-actif">Actif</label>
            <select id="categorie-actif" name="actif" className="inline-input" onChange={(e) => onChange('actif', e.target.value)}>
              <option value="true">Oui</option>
              <option value="false">Non</option>
            </select>
          </div>
        </>
      );
    }

    if (modal.kind === 'unite') {
      return (
        <>
          <div className="form-field">
            <label htmlFor="unite-nom">Nom *</label>
            <input id="unite-nom" name="nom" type="text" className="inline-input" onChange={(e) => onChange('nom', e.target.value)} />
            {errors.nom && <span className="form-error">{errors.nom}</span>}
          </div>
          <div className="form-field">
            <label htmlFor="unite-abreviation">Abréviation</label>
            <input id="unite-abreviation" name="abreviation" type="text" className="inline-input" onChange={(e) => onChange('abreviation', e.target.value)} />
          </div>
          <div className="form-field">
            <label htmlFor="unite-actif">Actif</label>
            <select id="unite-actif" name="actif" className="inline-input" onChange={(e) => onChange('actif', e.target.value)}>
              <option value="true">Oui</option>
              <option value="false">Non</option>
            </select>
          </div>
        </>
      );
    }

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
  };

  const currentKind = tabKind[activeTab] ?? 'produit';
  const currentLabel = addLabels[currentKind].replace('Ajouter ', '');

  return (
    <div className="page-container">
      <PageHeader title="Produits" subtitle={`${products.length} produit(s) enregistré(s)`} />

      <PageToolbar
        search={search}
        onSearch={setSearch}
        placeholder="Rechercher dans l'onglet..."
        actions={
          <button type="button" className="btn-primary" onClick={openAdd}>
            <Plus size={15} /> {currentLabel}
          </button>
        }
      />

      <PageTabs tabs={produitsTabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'produits' && (
        <SectionCard title="Liste des produits">
          <DataTable
            data={filteredProducts}
            columns={productColumns}
            emptyMessage="Aucun produit enregistré."
            actions={(row) => <RowActions onEdit={() => openEdit('produit', row)} onDelete={() => setDeleteTarget({ kind: 'produit', item: row })} />}
          />
        </SectionCard>
      )}

      {activeTab === 'lots' && (
        <SectionCard title="Lots">
          <DataTable
            data={filteredLots}
            columns={lotColumns}
            emptyMessage="Aucun lot enregistré."
            actions={(row) => <RowActions onEdit={() => openEdit('lot', row)} onDelete={() => setDeleteTarget({ kind: 'lot', item: row })} />}
          />
        </SectionCard>
      )}

      {activeTab === 'categories' && (
        <SectionCard title="Catégories" subtitle={`${categoriesData.length} catégorie(s)`}>
          <DataTable
            data={filteredCategories}
            columns={categoryColumns}
            emptyMessage="Aucune catégorie."
            actions={(row) => <RowActions onEdit={() => openEdit('categorie', row)} onDelete={() => setDeleteTarget({ kind: 'categorie', item: row })} />}
          />
        </SectionCard>
      )}

      {activeTab === 'unites' && (
        <SectionCard title="Unités" subtitle={`${unitsData.length} unité(s)`}>
          <DataTable
            data={filteredUnits}
            columns={unitColumns}
            emptyMessage="Aucune unité."
            actions={(row) => <RowActions onEdit={() => openEdit('unite', row)} onDelete={() => setDeleteTarget({ kind: 'unite', item: row })} />}
          />
        </SectionCard>
      )}

      <EntityFormModal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal ? `${modal.item ? 'Modifier' : 'Ajouter'} ${addLabels[modal.kind].replace('Ajouter ', '')}` : ''}
        editItem={modal?.item ?? null}
        onSubmit={handleSave}
        renderForm={renderForm}
        getInitialData={getInitialData}
        validate={validate}
        size="md"
      />

      <ConfirmModal
        open={!!deleteTarget}
        title="Supprimer l'élément"
        message={`Confirmer la suppression de « ${deleteTarget?.item && 'nom' in deleteTarget.item ? deleteTarget.item.nom : (deleteTarget?.item as Lot)?.numero_lot ?? ''} » ?`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
