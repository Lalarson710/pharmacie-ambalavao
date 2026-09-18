import { type Dispatch, type SetStateAction } from 'react';
import { EntityFormModal } from '@/components/EntityFormModal';
import { utilisateurs } from '@/data/mockData';
import type { Caisse, MouvementCaisse } from '@/types';
import { CaisseForm } from '../../components/CaisseForm';
import { MouvementForm } from '../../components/MouvementForm';

export type CaisseModalKind = 'caisse' | 'mouvement';

export interface CaisseModalState {
  kind: CaisseModalKind;
  item: Caisse | MouvementCaisse | null;
}

interface CaisseModalProps {
  modal: CaisseModalState | null;
  setModal: Dispatch<SetStateAction<CaisseModalState | null>>;
  caisseData: Caisse[];
  setCaisseData: Dispatch<SetStateAction<Caisse[]>>;
  setMouvementsData: Dispatch<SetStateAction<MouvementCaisse[]>>;
}

export function CaisseModal({
  modal,
  setModal,
  caisseData,
  setCaisseData,
  setMouvementsData,
}: CaisseModalProps) {
  const handleSave = (formData: Record<string, unknown>) => {
    if (!modal) return;

    if (modal.kind === 'caisse') {
      const utilisateur = utilisateurs.find(
        (row) => row.id === Number(formData.user_id)
      );

      const montantInitial = String(formData.montant_initial);
      const montantFinal = formData.montant_final
        ? String(formData.montant_final)
        : null;
      const ecart =
        montantFinal && montantInitial
          ? String(Number(montantFinal) - Number(montantInitial))
          : null;

      const nouvelleCaisse = {
        user_id: Number(formData.user_id),
        date_ouverture: String(formData.date_ouverture),
        montant_initial: montantInitial,
        date_fermeture: formData.date_fermeture
          ? String(formData.date_fermeture)
          : null,
        montant_final: montantFinal,
        ecart,
        statut: formData.statut as Caisse['statut'],
        observation: (formData.observation as string) || null,
        utilisateur,
      };

      setCaisseData((prev) => {
        if (modal.item) {
          return prev.map((row) =>
            row.id === modal.item?.id
              ? {
                  ...row,
                  ...nouvelleCaisse,
                }
              : row
          );
        }

        const nextId =
          prev.length > 0
            ? Math.max(...prev.map((row) => row.id)) + 1
            : 1;

        return [
          ...prev,
          {
            id: nextId,
            ...nouvelleCaisse,
          },
        ];
      });
    }

    if (modal.kind === 'mouvement') {
      const caisse = caisseData.find(
        (row) => row.id === Number(formData.caisse_id)
      );

      const mouvementData = {
        caisse_id: Number(formData.caisse_id),
        reglement_id: null,
        type: 'sortie' as MouvementCaisse['type'],
        montant: String(formData.montant),
        motif: (formData.motif as string) || null,
        caisse,
      };

      setMouvementsData((prev) => {
        const nextId =
          prev.length > 0
            ? Math.max(...prev.map((row) => row.id)) + 1
            : 1;

        return [
          ...prev,
          {
            id: nextId,
            ...mouvementData,
          },
        ];
      });
    }

    setModal(null);
  };

  const getInitialData = (
    item: Caisse | MouvementCaisse | null
  ) => {
    if (!modal) return {};

    if (modal.kind === 'caisse') {
      const row = item as Caisse | null;

      return {
        user_id: row
          ? String(row.user_id)
          : String(utilisateurs[0]?.id ?? ''),
        date_ouverture: row?.date_ouverture
          ? row.date_ouverture.slice(0, 16)
          : new Date().toISOString().slice(0, 16),
        montant_initial: row?.montant_initial ?? '',
        date_fermeture: row?.date_fermeture
          ? row.date_fermeture.slice(0, 16)
          : '',
        montant_final: row?.montant_final ?? '',
        statut: row?.statut ?? 'ouverte',
        observation: row?.observation ?? '',
      };
    }

    const row = item as MouvementCaisse | null;

    return {
      caisse_id: row
        ? String(row.caisse_id)
        : String(caisseData[0]?.id ?? ''),
      montant: row?.montant ?? '',
      motif: row?.motif ?? '',
    };
  };

  const validate = (formData: Record<string, unknown>) => {
    const errors: Record<string, string> = {};

    if (modal?.kind === 'caisse') {
      if (!formData.user_id) {
        errors.user_id = "L'utilisateur est obligatoire.";
      }

      if (!formData.date_ouverture) {
        errors.date_ouverture = "La date d'ouverture est obligatoire.";
      }

      if (
        !formData.montant_initial ||
        Number(formData.montant_initial) < 0
      ) {
        errors.montant_initial = 'Le montant initial est invalide.';
      }
    }

    if (modal?.kind === 'mouvement') {
      if (!formData.caisse_id) {
        errors.caisse_id = 'La caisse est obligatoire.';
      }

      if (
        !formData.montant ||
        Number(formData.montant) <= 0
      ) {
        errors.montant = 'Le montant est invalide.';
      }

      if (!formData.motif) {
        errors.motif = 'Le motif est obligatoire.';
      }
    }

    return errors;
  };

  const renderForm = (
    formData: Record<string, unknown>,
    onChange: (name: string, value: string) => void,
    errors: Record<string, string>
  ) => {
    if (!modal) return null;

    if (modal.kind === 'caisse') {
      return (
        <CaisseForm
          formData={formData}
          onChange={onChange}
          errors={errors}
          item={modal.item as Caisse | null}
        />
      );
    }

    return (
      <MouvementForm
        formData={formData}
        onChange={onChange}
        errors={errors}
        caisseData={caisseData}
      />
    );
  };

  return (
    <EntityFormModal
      open={Boolean(modal)}
      onClose={() => setModal(null)}
      title={
        modal?.kind === 'caisse'
          ? modal.item
            ? 'Modifier la caisse'
            : 'Ajouter une caisse'
          : 'Sortie de caisse'
      }
      editItem={
        modal?.kind === 'caisse'
          ? modal.item ?? null
          : null
      }
      onSubmit={handleSave}
      renderForm={renderForm}
      getInitialData={getInitialData}
      validate={validate}
      size="md"
    />
  );
}
