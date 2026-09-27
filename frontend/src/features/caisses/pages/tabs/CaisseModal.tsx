import { type Dispatch, type SetStateAction, type ReactNode } from 'react';
import { Lock, Plus, Wallet } from 'lucide-react';
import { EntityFormModal } from '@/components/EntityFormModal';
import { useToast } from '@/components/Toast';
import type { Achat, Caisse, Fournisseur, MouvementCaisse } from '@/types';
import { caissesApi, mouvementsCaisseApi } from '../../api/caisses';
import { CaisseForm } from '../../components/CaisseForm';
import { MouvementForm, TYPES_SORTIE } from '../../components/MouvementForm';
import { CaisseFermetureForm } from '../../components/CaisseFermetureForm';

export type CaisseModalKind = 'caisse' | 'mouvement' | 'fermeture';

export interface CaisseModalState {
  kind: CaisseModalKind;
  item: Caisse | null;
}

interface CaisseModalProps {
  modal: CaisseModalState | null;
  setModal: Dispatch<SetStateAction<CaisseModalState | null>>;
  caisseData: Caisse[];
  setCaisseData: Dispatch<SetStateAction<Caisse[]>>;
  mouvementsData: MouvementCaisse[];
  setMouvementsData: Dispatch<SetStateAction<MouvementCaisse[]>>;
  fournisseursData: Fournisseur[];
  achatsData: Achat[];
}

export function CaisseModal({
  modal,
  setModal,
  caisseData,
  setCaisseData,
  mouvementsData,
  setMouvementsData,
  fournisseursData,
  achatsData,
}: CaisseModalProps) {
  const { showToast } = useToast();

  const extraireMessage = (error: unknown, defaut: string) => {
    const axiosError = error as {
      response?: { data?: { message?: string; errors?: Record<string, string[]> } };
    };
    return (
      axiosError.response?.data?.message ||
      (axiosError.response?.data?.errors
        ? Object.values(axiosError.response.data.errors).flat().join(', ')
        : '') ||
      defaut
    );
  };

  /** Ajoute le contexte fournisseur / achat au motif de la sortie. */
  const construireMotif = (formData: Record<string, unknown>) => {
    const motif = String(formData.motif ?? '').trim();
    const typeSortie = String(formData.type_sortie ?? '');

    if (typeSortie !== 'paiement_fournisseur') {
      return motif;
    }

    const details: string[] = [];

    if (formData.fournisseur_id) {
      const fournisseur = fournisseursData.find(
        (row) => row.id === Number(formData.fournisseur_id)
      );
      if (fournisseur) details.push(`Fournisseur : ${fournisseur.nom}`);
    }

    if (formData.achat_id) {
      const achat = achatsData.find((row) => row.id === Number(formData.achat_id));
      if (achat) details.push(`Achat : ${achat.numero}`);
    }

    const prefixe =
      TYPES_SORTIE.find((row) => row.value === typeSortie)?.label ?? 'Sortie';

    const base = motif || prefixe;

    return details.length > 0 ? `${base} (${details.join(' — ')})` : base;
  };

  const handleSave = async (formData: Record<string, unknown>) => {
    if (!modal) return;

    try {
      if (modal.kind === 'caisse') {
        const saved = await caissesApi.ouvrir(Number(formData.montant_initial));
        setCaisseData((prev) => [saved, ...prev]);
        showToast('Caisse ouverte avec succès', 'success');
      }

      if (modal.kind === 'mouvement') {
        const saved = await mouvementsCaisseApi.create({
          caisse_id: Number(formData.caisse_id),
          reglement_id: null,
          type: 'sortie',
          montant: Number(formData.montant),
          motif: construireMotif(formData),
        });
        setMouvementsData((prev) => [saved, ...prev]);
        showToast('Sortie de caisse enregistrée avec succès', 'success');
      }

      if (modal.kind === 'fermeture' && modal.item) {
        const saved = await caissesApi.fermer(
          modal.item.id,
          Number(formData.montant_final)
        );
        setCaisseData((prev) =>
          prev.map((row) => (row.id === saved.id ? saved : row))
        );
        showToast('Caisse fermée avec succès', 'success');
      }

      setModal(null);
    } catch (error: unknown) {
      showToast(extraireMessage(error, 'Erreur lors de la sauvegarde'), 'error');
    }
  };

  const getInitialData = (item: Caisse | null) => {
    if (!modal) return {};

    if (modal.kind === 'caisse') {
      return { montant_initial: '' };
    }

    if (modal.kind === 'fermeture') {
      const mouvements = mouvementsData.filter(
        (row) => row.caisse_id === item?.id
      );
      const entrees = mouvements
        .filter((row) => row.type === 'entree')
        .reduce((total, row) => total + Number(row.montant), 0);
      const sorties = mouvements
        .filter((row) => row.type === 'sortie')
        .reduce((total, row) => total + Number(row.montant), 0);
      const soldeTheorique = Number(item?.montant_initial ?? 0) + entrees - sorties;

      return { montant_final: String(Math.max(soldeTheorique, 0)) };
    }

    return {
      caisse_id: '',
      type_sortie: '',
      montant: '',
      motif: '',
      fournisseur_id: '',
      achat_id: '',
    };
  };

  const validate = (formData: Record<string, unknown>) => {
    const errors: Record<string, string> = {};

    if (modal?.kind === 'caisse') {
      if (
        formData.montant_initial === '' ||
        Number(formData.montant_initial) < 0
      ) {
        errors.montant_initial = 'Le montant initial est invalide.';
      }
    }

    if (modal?.kind === 'fermeture') {
      if (
        formData.montant_final === '' ||
        Number(formData.montant_final) < 0
      ) {
        errors.montant_final = 'Le montant final est invalide.';
      }
    }

    if (modal?.kind === 'mouvement') {
      if (!formData.caisse_id) {
        errors.caisse_id = 'La caisse est obligatoire.';
      }
      if (!formData.type_sortie) {
        errors.type_sortie = 'Le type de sortie est obligatoire.';
      }
      if (!formData.montant || Number(formData.montant) <= 0) {
        errors.montant = 'Le montant est invalide.';
      }
      if (!formData.motif || !String(formData.motif).trim()) {
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
        <CaisseForm formData={formData} onChange={onChange} errors={errors} />
      );
    }

    if (modal.kind === 'fermeture') {
      return (
        <CaisseFermetureForm
          formData={formData}
          onChange={onChange}
          errors={errors}
          caisse={modal.item}
          mouvements={mouvementsData.filter(
            (row) => row.caisse_id === modal.item?.id
          )}
        />
      );
    }

    return (
      <MouvementForm
        formData={formData}
        onChange={onChange}
        errors={errors}
        caisseData={caisseData}
        fournisseursData={fournisseursData}
        achatsData={achatsData}
      />
    );
  };

  const kindIcons: Record<CaisseModalKind, ReactNode> = {
    caisse: <Plus size={18} />,
    mouvement: <Wallet size={18} />,
    fermeture: <Lock size={18} />,
  };

  const kindSubtitles: Record<CaisseModalKind, string> = {
    caisse: 'Indiquez le montant d’ouverture de votre caisse.',
    mouvement: 'Enregistrez une sortie de caisse et son motif.',
    fermeture: 'Contrôlez le solde théorique avant de clôturer la caisse.',
  };

  const kindTitles: Record<CaisseModalKind, string> = {
    caisse: 'Ouvrir une caisse',
    mouvement: 'Sortie de caisse',
    fermeture: 'Fermer la caisse',
  };

  return (
    <EntityFormModal
      open={Boolean(modal)}
      onClose={() => setModal(null)}
      title={modal ? kindTitles[modal.kind] : ''}
      icon={modal ? kindIcons[modal.kind] : <Wallet size={18} />}
      subtitle={modal ? kindSubtitles[modal.kind] : undefined}
      editItem={modal?.item ?? null}
      onSubmit={handleSave}
      renderForm={renderForm}
      getInitialData={getInitialData}
      validate={validate}
      submitLabel="Enregistrer"
      size="md"
    />
  );
}
