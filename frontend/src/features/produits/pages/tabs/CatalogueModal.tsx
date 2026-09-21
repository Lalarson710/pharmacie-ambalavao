import { type Dispatch, type SetStateAction } from 'react';
import { EntityFormModal } from '@/components/EntityFormModal';
import { useToast } from '@/components/Toast';
import type { Produit, Categorie, Unite, Lot } from '@/types';
import { ProduitForm } from '../../components/ProduitForm';
import { CategorieForm } from '../../components/CategorieForm';
import { UniteForm } from '../../components/UniteForm';
import { LotForm } from '../../components/LotForm';
import { produitsApi } from '../../api/produits';
import { categoriesApi } from '../../api/categories';
import { unitesApi } from '../../api/unites';
import { lotsApi } from '../../api/lots';

export type CatalogueModalKind = 'produit' | 'categories' | 'unite' | 'lot';
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
  categories: 'Ajouter une catégorie',
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
  setLotsData,
}: CatalogueModalProps) {
  const { showToast } = useToast();

  const handleSave = async (formData: Record<string, unknown>) => {
    if (!modal) return;

    try {
      if (modal.kind === 'produit') {
        const payload = {
          categorie_id: Number(formData.categories_id),
          unite_id: Number(formData.unite_id),
          nom: String(formData.nom),
          code_barres: (formData.code_barres as string) || null,
          description: (formData.description as string) || null,
          prix_achat: Number(formData.prix_achat),
          prix_vente: Number(formData.prix_vente),
          stock_minimum: Number(formData.stock_minimum),
          actif: formData.actif === 'true',
        };

        let saved: Produit;
        if (modal.item) {
          saved = await produitsApi.update(modal.item.id, payload);
          setProducts((prev) =>
            prev.map((row) => (row.id === modal.item!.id ? saved : row))
          );
          showToast('Produit modifié avec succès', 'success');
        } else {
          saved = await produitsApi.create(payload);
          setProducts((prev) => [...prev, saved]);
          showToast('Produit créé avec succès', 'success');
        }
      }

      if (modal.kind === 'categories') {
        const payload = {
          nom: String(formData.nom),
          description: (formData.description as string) || null,
          actif: formData.actif === 'true',
        };

        let saved: Categorie;
        if (modal.item) {
          saved = await categoriesApi.update(modal.item.id, payload);
          setCategoriesData((prev) =>
            prev.map((row) => (row.id === modal.item!.id ? saved : row))
          );
          showToast('Catégorie modifiée avec succès', 'success');
        } else {
          saved = await categoriesApi.create(payload);
          setCategoriesData((prev) => [...prev, saved]);
          showToast('Catégorie créée avec succès', 'success');
        }
      }

      if (modal.kind === 'unite') {
        const payload = {
          nom: String(formData.nom),
          abreviation: (formData.abreviation as string) || null,
          actif: formData.actif === 'true',
        };

        let saved: Unite;
        if (modal.item) {
          saved = await unitesApi.update(modal.item.id, payload);
          setUnitsData((prev) =>
            prev.map((row) => (row.id === modal.item!.id ? saved : row))
          );
          showToast('Unité modifiée avec succès', 'success');
        } else {
          saved = await unitesApi.create(payload);
          setUnitsData((prev) => [...prev, saved]);
          showToast('Unité créée avec succès', 'success');
        }
      }

      if (modal.kind === 'lot') {
        const payload = {
          produit_id: Number(formData.produit_id),
          numero_lot: String(formData.numero_lot),
          date_peremption: String(formData.date_peremption),
          quantite: Number(formData.quantite),
        };

        let saved: Lot;
        if (modal.item) {
          saved = await lotsApi.update(modal.item.id, payload);
          setLotsData((prev) =>
            prev.map((row) => (row.id === modal.item!.id ? saved : row))
          );
          showToast('Lot modifié avec succès', 'success');
        } else {
          saved = await lotsApi.create(payload);
          setLotsData((prev) => [...prev, saved]);
          showToast('Lot créé avec succès', 'success');
        }
      }

      setModal(null);
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
      const msg =
        axiosError.response?.data?.message ||
        (axiosError.response?.data?.errors
          ? Object.values(axiosError.response.data.errors).flat().join(', ')
          : '') ||
        'Erreur lors de la sauvegarde';
      showToast(msg, 'error');
    }
  };

  const getInitialData = (item: CatalogueModalItem | null) => {
    if (!modal) return {};
    if (modal.kind === 'produit') {
      const row = item as Produit | null;
      return {
        nom: row?.nom ?? '',
        categories_id: row ? String(row.categorie_id) : '',
        unite_id: row ? String(row.unite_id) : '',
        code_barres: row?.code_barres ?? '',
        description: row?.description ?? '',
        prix_achat: row?.prix_achat ?? '',
        prix_vente: row?.prix_vente ?? '',
        stock_minimum: row ? String(row.stock_minimum) : '',
        actif: row ? String(row.actif) : 'true',
      };
    }
    if (modal.kind === 'categories') {
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
      date_peremption: row?.date_peremption ? String(row.date_peremption).slice(0, 10) : '',
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
    if (modal.kind === 'categories' && !formData.nom) errors.nom = 'Le nom est obligatoire.';
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
          categoriesData={categoriesData as { id: number; nom: string; actif?: boolean }[]}
          unitsData={unitsData as { id: number; nom: string; actif?: boolean }[]}
          item={modal.item as Produit | null}
        />
      );
    }

    if (modal.kind === 'categories') {
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
        products={products as { id: number; nom: string; actif?: boolean }[]}
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
