import { type Dispatch, type SetStateAction } from 'react';
import { EntityFormModal } from '@/components/EntityFormModal';
import type { Produit, Categorie, Unite, Lot } from '@/types';
import { ProduitForm } from '../../components/ProduitForm';
import { CategorieForm } from '../../components/CategorieForm';
import { UniteForm } from '../../components/UniteForm';
import { LotForm } from '../../components/LotForm';

export type CatalogueModalKind = 'produit' | 'categorie' | 'unite' | 'lot';
export type CatalogueModalItem = Produit | Categorie | Unite | Lot;

export interface CatalogueModalState {
  kind: CatalogueModalKind;
  item: CatalogueModalItem | null;
}

interface CatalogueModalProps {
  modal: CatalogueModalState | null;
  setModal: Dispatch<SetStateAction<CatalogueModalState | null>>;
  products: Produit[];
  setProducts: Dispatch<SetStateAction<Produit[]>>;
  categoriesData: Categorie[];
  setCategoriesData: Dispatch<SetStateAction<Categorie[]>>;
  unitsData: Unite[];
  setUnitsData: Dispatch<SetStateAction<Unite[]>>;
  lotsData: Lot[];
  setLotsData: Dispatch<SetStateAction<Lot[]>>;
}

const addLabels: Record<CatalogueModalKind, string> = {
  produit: 'Ajouter un produit',
  lot: 'Ajouter un lot',
  categorie: 'Ajouter une catégorie',
  unite: 'Ajouter une unité',
};

export function CatalogueModal({
  modal,
  setModal,
  products,
  setProducts,
  categoriesData,
  setCategoriesData,
  unitsData,
  setUnitsData,
  lotsData,
  setLotsData,
}: CatalogueModalProps) {
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
        setProducts((prev) =>
          prev.map((row) =>
            row.id === modal.item?.id ? { ...row, ...productData } : row
          )
        );
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
        setCategoriesData((prev) =>
          prev.map((row) =>
            row.id === modal.item?.id ? { ...row, ...categoryData } : row
          )
        );
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
        setUnitsData((prev) =>
          prev.map((row) =>
            row.id === modal.item?.id ? { ...row, ...unitData } : row
          )
        );
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
        setLotsData((prev) =>
          prev.map((row) =>
            row.id === modal.item?.id ? { ...row, ...lotData } : row
          )
        );
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

  const getInitialData = (item: CatalogueModalItem | null) => {
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
        <ProduitForm
          formData={_formData}
          onChange={onChange}
          errors={errors}
          categoriesData={categoriesData}
          unitsData={unitsData}
          item={modal.item as Produit | null}
        />
      );
    }

    if (modal.kind === 'categorie') {
      return (
        <CategorieForm
          formData={_formData}
          onChange={onChange}
          errors={errors}
          item={modal.item as Categorie | null}
        />
      );
    }

    if (modal.kind === 'unite') {
      return (
        <UniteForm
          formData={_formData}
          onChange={onChange}
          errors={errors}
          item={modal.item as Unite | null}
        />
      );
    }

    return (
      <LotForm
        formData={_formData}
        onChange={onChange}
        errors={errors}
        products={products}
        item={modal.item as Lot | null}
      />
    );
  };

  return (
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
  );
}
