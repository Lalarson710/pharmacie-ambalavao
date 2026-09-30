import { type Dispatch, type SetStateAction } from 'react';
import { Package } from 'lucide-react';
import { EntityFormModal } from '@/components/EntityFormModal';
import { useToast } from '@/components/Toast';
import type { Produit, Unite, ProduitConditionnement } from '@/types';
import { ConditionnementForm } from '../../components/ConditionnementForm';
import { produitsApi } from '../../api/produits';
import { unitesApi } from '../../api/unites';
import { conditionnementsApi } from '../../api/conditionnements';

export type ConditionnementModalKind = 'conditionnement';

export interface ConditionnementModalState {
  kind: ConditionnementModalKind;
  item: ProduitConditionnement | null;
}

interface ConditionnementModalProps {
  modal: ConditionnementModalState | null;
  setModal: Dispatch<SetStateAction<ConditionnementModalState | null>>;
  productsData: Produit[];
  unitsData: Unite[];
  conditionnementsData: ProduitConditionnement[];
  setConditionnementsData: Dispatch<SetStateAction<ProduitConditionnement[]>>;
}

export function ConditionnementModal({
  modal,
  setModal,
  productsData,
  unitsData,
  conditionnementsData,
  setConditionnementsData,
}: ConditionnementModalProps) {
  const { showToast } = useToast();

  const handleSave = async (formData: Record<string, unknown>) => {
    if (!modal) return;

    try {
      if (modal.kind === 'conditionnement') {
        const payload = {
          produit_id: Number(formData.produit_id),
          unite_id: Number(formData.unite_id),
          quantite_base: Number(formData.quantite_base),
          prix_vente: Number(formData.prix_vente),
          code_barres: (formData.code_barres as string) || null,
          est_unite_base:
            formData.utilise_unite_base === 'true' || formData.est_unite_base === 'true',
          actif: formData.actif === 'true',
        };

        // Vérifier qu'il n'y a pas déjà un conditionnement avec la même unité pour ce produit
        const existing = conditionnementsData.find(
          (c) => c.produit_id === payload.produit_id && c.unite_id === payload.unite_id && c.id !== modal.item?.id
        );
        if (existing) {
          showToast('Ce produit a déjà un conditionnement avec cette unité.', 'error');
          return;
        }

        // Si on définit comme unité de base, vérifier qu'il n'y en a pas déjà une pour ce produit
        if (payload.est_unite_base) {
          const existingBase = conditionnementsData.find(
            (c) => c.produit_id === payload.produit_id && c.est_unite_base && c.id !== modal.item?.id
          );
          if (existingBase) {
            showToast('Ce produit a déjà une unité de base définie.', 'error');
            return;
          }
        }

        let saved: ProduitConditionnement;
        if (modal.item) {
          saved = await conditionnementsApi.update(modal.item.id, payload);
          setConditionnementsData((prev) =>
            prev.map((row) => (row.id === modal.item!.id ? saved : row))
          );
          showToast('Conditionnement modifié avec succès', 'success');
        } else {
          saved = await conditionnementsApi.create(payload);
          setConditionnementsData((prev) => [...prev, saved]);
          showToast('Conditionnement créé avec succès', 'success');
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

  const getInitialData = (item: ProduitConditionnement | null) => {
    if (!modal) return {};
    if (modal.kind === 'conditionnement') {
      const row = item as ProduitConditionnement | null;
      return {
        produit_id: row ? String(row.produit_id) : '',
        unite_id: row ? String(row.unite_id) : '',
        quantite_base: row ? String(row.quantite_base) : '',
        prix_vente: row?.prix_vente ?? '',
        code_barres: row?.code_barres ?? '',
        // En edition, on pre-coche la case si le conditionnement utilise
        // deja l'unite de base du produit (quantite_base = 1).
        utilise_unite_base: row ? String(row.quantite_base === 1) : 'false',
        est_unite_base: row ? String(row.est_unite_base) : 'false',
        actif: row ? String(row.actif) : 'true',
      };
    }
    return {};
  };

  const validate = (formData: Record<string, unknown>) => {
    const errors: Record<string, string> = {};
    if (!modal) return errors;
    if (modal.kind === 'conditionnement') {
      if (!formData.produit_id) errors.produit_id = 'Le produit est obligatoire.';
      if (!formData.unite_id) errors.unite_id = 'L\'unité est obligatoire.';
      if (!formData.quantite_base || Number(formData.quantite_base) <= 0) {
        errors.quantite_base = 'La quantité de base doit être supérieure à 0.';
      }
      if (!formData.prix_vente || Number(formData.prix_vente) < 0) {
        errors.prix_vente = 'Le prix de vente est invalide.';
      }
    }
    return errors;
  };

  const renderForm = (
    _formData: Record<string, unknown>,
    onChange: (name: string, value: string) => void,
    errors: Record<string, string>
  ) => {
    if (!modal) return null;

    if (modal.kind === 'conditionnement') {
      return (
        <ConditionnementForm
          formData={_formData}
          onChange={onChange}
          errors={errors}
          productsData={productsData}
          unitsData={unitsData}
          item={modal.item as ProduitConditionnement | null}
        />
      );
    }

    return null;
  };

  return (
    <EntityFormModal
      open={!!modal}
      onClose={() => setModal(null)}
      title={modal ? `${modal.item ? 'Modifier' : 'Ajouter'} un conditionnement` : ''}
      icon={modal ? <Package size={18} /> : undefined}
      subtitle={modal ? 'Définissez le conditionnement, sa quantité de base et son prix de vente.' : undefined}
      editItem={modal?.item ?? null}
      onSubmit={handleSave}
      renderForm={renderForm}
      getInitialData={getInitialData}
      validate={validate}
      size="md"
    />
  );
}