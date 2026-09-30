import {
  type Dispatch,
  type SetStateAction,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ClipboardList, ReceiptText, ShoppingCart, Wallet } from 'lucide-react';
import { EntityFormModal } from '@/components/EntityFormModal';
import { useToast } from '@/components/Toast';
import type { Client, Facture, Lot, Produit, ProduitConditionnement, Reglement, Vente, VenteLigne } from '@/types';
import { ventesApi, ventesLignesApi, reglementsApi } from '../../api/ventes';

export type VenteModalKind = 'vente' | 'ligne' | 'reglement';

export interface VenteModalState {
  kind: VenteModalKind;
  item: Vente | VenteLigne | Reglement | null;
}

interface VentesModalProps {
  modal: VenteModalState | null;
  setModal: Dispatch<SetStateAction<VenteModalState | null>>;
  data: Vente[];
  setData: Dispatch<SetStateAction<Vente[]>>;
  setLignesData: Dispatch<SetStateAction<VenteLigne[]>>;
  clientsData: Client[];
  produitsData: Produit[];
  lotsData: Lot[];
  conditionnementsData: ProduitConditionnement[];
  facturesData: Facture[];
  setReglementsData: Dispatch<SetStateAction<Reglement[]>>;
}

export function VentesModal({
  modal,
  setModal,
  data,
  setData,
  setLignesData,
  clientsData,
  produitsData,
  lotsData,
  conditionnementsData,
  facturesData,
  setReglementsData,
}: VentesModalProps) {
  const { showToast } = useToast();
  const [clientsList, setClientsList] = useState<Client[]>(clientsData);
  const [facturesList, setFacturesList] = useState<Facture[]>(facturesData);
  const [produitSelectionne, setProduitSelectionne] = useState<string>('');
  // Seul le setter est necessaire : la valeur courante vit dans le formulaire.
  const [, setConditionnementSelectionne] = useState<string>('');

  useEffect(() => {
    setClientsList(clientsData);
  }, [clientsData]);

  useEffect(() => {
    setFacturesList(facturesData);
  }, [facturesData]);

  // Le produit selectionne pilote la liste des lots proposes. En modification,
  // on l'initialise a partir de la ligne existante pour ne proposer que ses lots.
  useEffect(() => {
    if (modal?.kind !== 'ligne') {
      setProduitSelectionne('');
      setConditionnementSelectionne('');
      return;
    }

    const ligne = modal.item as VenteLigne | null;
    setProduitSelectionne(ligne ? String(ligne.produit_id) : '');
    setConditionnementSelectionne(ligne && ligne.conditionnement_id ? String(ligne.conditionnement_id) : '');
  }, [modal?.kind, modal?.item]);

  /** Lots disponibles pour le produit sélectionné. */
  const lotsDuProduit = useMemo(() => {
    if (!produitSelectionne) return lotsData;
    return lotsData.filter((lot) => String(lot.produit_id) === produitSelectionne);
  }, [lotsData, produitSelectionne]);

  /** Conditionnements disponibles pour le produit sélectionné. */
  const conditionnementsDuProduit = useMemo(() => {
    if (!produitSelectionne) return conditionnementsData;
    return conditionnementsData
      .filter((c) => c.produit_id === Number(produitSelectionne) && c.actif)
      .sort((a, b) => a.quantite_base - b.quantite_base);
  }, [conditionnementsData, produitSelectionne]);

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

  const handleSave = async (formData: Record<string, unknown>) => {
    if (!modal) return;

    try {
      if (modal.kind === 'vente') {
        const payload = {
          client_id: formData.client_id ? Number(formData.client_id) : null,
          date_vente: String(formData.date_vente),
          montant_total: Number(formData.montant_total ?? 0),
          observation: (formData.observation as string) || null,
        };

        let saved: Vente;
        if (modal.item) {
          saved = await ventesApi.update(modal.item.id, payload);
          setData((prev) => prev.map((row) => (row.id === modal.item!.id ? saved : row)));
          showToast('Vente modifiée avec succès', 'success');
        } else {
          saved = await ventesApi.create(payload);
          setData((prev) => [...prev, saved]);
          showToast('Vente créée avec succès', 'success');
        }
      }

      if (modal.kind === 'ligne') {
        const payload = {
          vente_id: Number(formData.vente_id),
          produit_id: Number(formData.produit_id),
          lot_id: Number(formData.lot_id),
          conditionnement_id: formData.conditionnement_id ? Number(formData.conditionnement_id) : null,
          quantite: Number(formData.quantite),
        };

        if (modal.item) {
          const ligne = modal.item as VenteLigne;
          const saved = await ventesLignesApi.update(ligne.id, payload);
          setLignesData((prev) =>
            prev.map((row) => (row.id === ligne.id ? saved : row))
          );
          showToast('Ligne de vente modifiée avec succès', 'success');
        } else {
          const saved = await ventesLignesApi.create(payload);
          setLignesData((prev) => [...prev, saved]);
          showToast('Ligne de vente créée avec succès', 'success');
        }

        // Le backend recalcule le montant total de la vente apres chaque
        // ajout / modification / suppression de ligne.
        try {
          const venteActualisee = await ventesApi.getById(payload.vente_id);
          setData((prev) =>
            prev.map((row) => (row.id === payload.vente_id ? venteActualisee : row))
          );
        } catch {
          /* le total sera rafraichi au prochain chargement */
        }
      }

      if (modal.kind === 'reglement') {
        const payload = {
          facture_id: Number(formData.facture_id),
          montant: Number(formData.montant),
          mode: String(formData.mode),
          date_reglement: String(formData.date_reglement),
          reference: (formData.reference as string) || null,
        };

        const saved = await reglementsApi.create(payload);
        setReglementsData((prev) => [...prev, saved]);
        showToast('Règlement enregistré avec succès', 'success');
      }

      setModal(null);
    } catch (error: unknown) {
      showToast(extraireMessage(error, 'Erreur lors de la sauvegarde'), 'error');
    }
  };

  const getInitialData = (item: Vente | VenteLigne | Reglement | null) => {
    if (!modal) return {};

    if (modal.kind === 'vente') {
      const row = item as Vente | null;
      return {
        client_id: row?.client_id ? String(row.client_id) : '',
        date_vente: row?.date_vente
          ? row.date_vente.slice(0, 10)
          : new Date().toISOString().slice(0, 10),
        montant_total: row?.montant_total ?? '0',
        observation: row?.observation ?? '',
      };
    }

    if (modal.kind === 'ligne') {
      const row = item as VenteLigne | null;
      return {
        vente_id: row ? String(row.vente_id) : '',
        produit_id: row ? String(row.produit_id) : '',
        lot_id: row ? String(row.lot_id) : '',
        conditionnement_id: row && row.conditionnement_id ? String(row.conditionnement_id) : '',
        quantite: row ? String(row.quantite) : '',
      };
    }

    const row = item as Reglement | null;
    return {
      facture_id: row ? String(row.facture_id) : '',
      montant: row?.montant ?? '',
      mode: row?.mode ?? 'especes',
      date_reglement: row?.date_reglement
        ? row.date_reglement.slice(0, 16)
        : new Date().toISOString().slice(0, 16),
      reference: row?.reference ?? '',
    };
  };

  const validate = (formData: Record<string, unknown>) => {
    const errors: Record<string, string> = {};

    if (modal?.kind === 'vente') {
      if (!formData.date_vente) errors.date_vente = 'La date est obligatoire.';
      if (formData.montant_total === '' || Number(formData.montant_total) < 0) {
        errors.montant_total = 'Le montant est invalide.';
      }
    }

    if (modal?.kind === 'ligne') {
      if (!formData.vente_id) errors.vente_id = 'La vente est obligatoire.';
      if (!formData.produit_id) errors.produit_id = 'Le produit est obligatoire.';
      if (!formData.lot_id) errors.lot_id = 'Le lot est obligatoire.';
      if (!formData.conditionnement_id) errors.conditionnement_id = 'Le conditionnement est obligatoire.';
      if (!formData.quantite || Number(formData.quantite) <= 0) {
        errors.quantite = 'La quantité est invalide.';
      }
    }

    if (modal?.kind === 'reglement') {
      if (!formData.facture_id) errors.facture_id = 'La facture est obligatoire.';
      if (!formData.montant || Number(formData.montant) <= 0) {
        errors.montant = 'Le montant est invalide.';
      }
      if (!formData.date_reglement) {
        errors.date_reglement = 'La date est obligatoire.';
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

    if (modal.kind === 'vente') {
      return (
        <>
          <div className="form-field form-field-full">
            <label htmlFor="vente-client">Client</label>
            <select
              id="vente-client"
              name="client_id"
              className="inline-input"
              value={String(formData.client_id ?? '')}
              onChange={(e) => onChange('client_id', e.target.value)}
            >
              <option value="">Client de passage</option>
              {clientsList.map((row) => (
                <option key={row.id} value={String(row.id)}>
                  {row.nom}
                </option>
              ))}
            </select>
            <span className="form-hint">
              Laissez « Client de passage » pour une vente comptoir.
            </span>
          </div>
          <div className="form-field">
            <label htmlFor="vente-date">
              Date <span className="required-mark">*</span>
            </label>
            <input
              id="vente-date"
              name="date_vente"
              type="date"
              className="inline-input"
              value={String(formData.date_vente ?? '')}
              onChange={(e) => onChange('date_vente', e.target.value)}
            />
            {errors.date_vente && <span className="form-error">{errors.date_vente}</span>}
          </div>
          <div className="form-field">
            <label htmlFor="vente-montant">
              Montant total (MGA) <span className="required-mark">*</span>
            </label>
            <input
              id="vente-montant"
              name="montant_total"
              type="number"
              min="0"
              step="0.01"
              className="inline-input"
              value={String(formData.montant_total ?? '0')}
              onChange={(e) => onChange('montant_total', e.target.value)}
            />
            {errors.montant_total && (
              <span className="form-error">{errors.montant_total}</span>
            )}
            <span className="form-hint">
              Le total est recalculé automatiquement à partir des lignes de vente.
            </span>
          </div>
          <div className="form-field form-field-full">
            <label htmlFor="vente-observation">Observation</label>
            <textarea
              id="vente-observation"
              name="observation"
              rows={3}
              placeholder="Remarque interne sur cette vente…"
              className="inline-input"
              value={String(formData.observation ?? '')}
              onChange={(e) => onChange('observation', e.target.value)}
            />
          </div>
        </>
      );
    }

    if (modal.kind === 'ligne') {
      return (
        <>
          <div className="form-field form-field-full">
            <label htmlFor="ligne-vente">
              Vente <span className="required-mark">*</span>
            </label>
            <select
              id="ligne-vente"
              name="vente_id"
              className="inline-input"
              value={String(formData.vente_id ?? '')}
              onChange={(e) => onChange('vente_id', e.target.value)}
            >
              <option value="">— Choisir une vente —</option>
              {data
                .filter((row) => row.statut === 'brouillon')
                .map((row) => (
                  <option key={row.id} value={String(row.id)}>
                    {row.numero} — {formatDateCourte(row.date_vente)}
                  </option>
                ))}
            </select>
            {errors.vente_id && <span className="form-error">{errors.vente_id}</span>}
            <span className="form-hint">
              Seules les ventes en brouillon peuvent recevoir des lignes.
            </span>
          </div>
          <div className="form-field form-field-full">
            <label htmlFor="ligne-produit">
              Produit <span className="required-mark">*</span>
            </label>
            <select
              id="ligne-produit"
              name="produit_id"
              className="inline-input"
              value={String(formData.produit_id ?? '')}
              onChange={(e) => {
                setProduitSelectionne(e.target.value);
                setConditionnementSelectionne('');
                onChange('produit_id', e.target.value);
                onChange('lot_id', '');
                onChange('conditionnement_id', '');
              }}
            >
              <option value="">— Choisir un produit —</option>
              {produitsData.map((row) => (
                <option key={row.id} value={String(row.id)}>
                  {row.nom}
                </option>
              ))}
            </select>
            {errors.produit_id && <span className="form-error">{errors.produit_id}</span>}
          </div>
          <div className="form-field form-field-full">
            <label htmlFor="ligne-lot">
              Lot <span className="required-mark">*</span>
            </label>
            <select
              id="ligne-lot"
              name="lot_id"
              className="inline-input"
              value={String(formData.lot_id ?? '')}
              onChange={(e) => onChange('lot_id', e.target.value)}
            >
              <option value="">— Choisir un lot —</option>
              {lotsDuProduit.map((row) => (
                <option key={row.id} value={String(row.id)}>
                  {row.numero_lot} — {row.quantite} en stock
                </option>
              ))}
            </select>
            {errors.lot_id && <span className="form-error">{errors.lot_id}</span>}
          </div>
          <div className="form-field form-field-full">
            <label htmlFor="ligne-conditionnement">
              Conditionnement <span className="required-mark">*</span>
            </label>
            <select
              id="ligne-conditionnement"
              name="conditionnement_id"
              className="inline-input"
              value={String(formData.conditionnement_id ?? '')}
              onChange={(e) => {
                setConditionnementSelectionne(e.target.value);
                onChange('conditionnement_id', e.target.value);
              }}
            >
              <option value="">— Choisir un conditionnement —</option>
              {conditionnementsDuProduit.map((row) => (
                <option key={row.id} value={String(row.id)}>
                  {row.unite?.nom} ({row.quantite_base} {row.unite?.abreviation || 'unité(s) de base'}) — {row.prix_vente} Ar
                </option>
              ))}
            </select>
            {errors.conditionnement_id && <span className="form-error">{errors.conditionnement_id}</span>}
            <span className="form-hint">Le prix de vente dépend du conditionnement choisi.</span>
          </div>
          <div className="form-field">
            <label htmlFor="ligne-quantite">
              Quantité <span className="required-mark">*</span>
            </label>
            <input
              id="ligne-quantite"
              name="quantite"
              type="number"
              min="1"
              step="1"
              className="inline-input"
              value={String(formData.quantite ?? '')}
              onChange={(e) => onChange('quantite', e.target.value)}
            />
            {errors.quantite && <span className="form-error">{errors.quantite}</span>}
            <span className="form-hint">Quantité dans le conditionnement sélectionné.</span>
          </div>
        </>
      );
    }

    return (
      <>
        <div className="form-field form-field-full">
          <label htmlFor="reglement-facture">
            Facture <span className="required-mark">*</span>
          </label>
          <select
            id="reglement-facture"
            name="facture_id"
            className="inline-input"
            value={String(formData.facture_id ?? '')}
            onChange={(e) => onChange('facture_id', e.target.value)}
          >
            <option value="">— Choisir une facture —</option>
            {facturesList.map((row) => (
              <option key={row.id} value={String(row.id)}>
                {row.numero} — {row.vente?.numero ?? '—'}
              </option>
            ))}
          </select>
          {errors.facture_id && <span className="form-error">{errors.facture_id}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="reglement-montant">
            Montant (MGA) <span className="required-mark">*</span>
          </label>
          <input
            id="reglement-montant"
            name="montant"
            type="number"
            min="0.01"
            step="0.01"
            className="inline-input"
            value={String(formData.montant ?? '')}
            onChange={(e) => onChange('montant', e.target.value)}
          />
          {errors.montant && <span className="form-error">{errors.montant}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="reglement-mode">
            Mode <span className="required-mark">*</span>
          </label>
          <select
            id="reglement-mode"
            name="mode"
            className="inline-input"
            value={String(formData.mode ?? 'especes')}
            onChange={(e) => onChange('mode', e.target.value)}
          >
            <option value="especes">Espèces</option>
            <option value="virement">Virement</option>
            <option value="cheque">Chèque</option>
            <option value="mobile">Mobile money</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="reglement-date">
            Date <span className="required-mark">*</span>
          </label>
          <input
            id="reglement-date"
            name="date_reglement"
            type="datetime-local"
            className="inline-input"
            value={String(formData.date_reglement ?? '')}
            onChange={(e) => onChange('date_reglement', e.target.value)}
          />
          {errors.date_reglement && (
            <span className="form-error">{errors.date_reglement}</span>
          )}
        </div>
        <div className="form-field">
          <label htmlFor="reglement-reference">Référence</label>
          <input
            id="reglement-reference"
            name="reference"
            type="text"
            className="inline-input"
            value={String(formData.reference ?? '')}
            onChange={(e) => onChange('reference', e.target.value)}
          />
        </div>
      </>
    );
  };

  const kindIcons: Record<VenteModalKind, ReactNode> = {
    vente: <ShoppingCart size={18} />,
    ligne: <ClipboardList size={18} />,
    reglement: <Wallet size={18} />,
  };

  const kindSubtitles: Record<VenteModalKind, string> = {
    vente: 'Le numéro est généré automatiquement, le statut est géré par les actions.',
    ligne: 'Ajoutez un article vendu avec son lot et sa quantité.',
    reglement: 'Enregistrez un paiement rattaché à une facture.',
  };

  const kindTitles: Record<VenteModalKind, string> = {
    vente: 'une vente',
    ligne: 'une ligne de vente',
    reglement: 'un règlement',
  };

  return (
    <EntityFormModal
      open={Boolean(modal)}
      onClose={() => setModal(null)}
      title={modal ? `${modal.item ? 'Modifier' : 'Ajouter'} ${kindTitles[modal.kind]}` : ''}
      icon={modal ? kindIcons[modal.kind] : <ReceiptText size={18} />}
      subtitle={modal ? kindSubtitles[modal.kind] : undefined}
      editItem={modal?.item ?? null}
      onSubmit={handleSave}
      renderForm={renderForm}
      getInitialData={getInitialData}
      validate={validate}
      size="md"
    />
  );
}

function formatDateCourte(date: string): string {
  return new Date(date).toLocaleDateString('fr-FR');
}
