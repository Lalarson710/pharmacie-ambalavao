import { type Dispatch, type SetStateAction } from 'react';
import { EntityFormModal } from '@/components/EntityFormModal';
import { lots } from '@/data/mockData';
import type { Inventaire, MouvementStock } from '@/types';

export type StockModalKind = 'mouvement' | 'inventaire';

export interface StockModalState {
  kind: StockModalKind;
  item: MouvementStock | Inventaire | null;
}

interface StockModalProps {
  modal: StockModalState | null;
  setModal: Dispatch<SetStateAction<StockModalState | null>>;
  mouvementsData: MouvementStock[];
  setMouvementsData: Dispatch<SetStateAction<MouvementStock[]>>;
  inventairesData: Inventaire[];
  setInventairesData: Dispatch<SetStateAction<Inventaire[]>>;
}

export function StockModal({
  modal,
  setModal,
  mouvementsData,
  setMouvementsData,
  inventairesData,
  setInventairesData,
}: StockModalProps) {
  const handleSave = (formData: Record<string, unknown>) => {
    if (!modal) return;

    if (modal.kind === 'mouvement') {
      const lot = lots.find((row) => row.id === Number(formData.lot_id));
      const mouvementData = {
        lot_id: Number(formData.lot_id),
        type: formData.type as MouvementStock['type'],
        quantite: Number(formData.quantite),
        motif: (formData.motif as string) || null,
        lot,
      };

      if (modal.item) {
        setMouvementsData((prev) =>
          prev.map((row) => (row.id === modal.item?.id ? { ...row, ...mouvementData } : row))
        );
      } else {
        const newMouvement: MouvementStock = {
          id: mouvementsData.length > 0 ? Math.max(...mouvementsData.map((row) => row.id)) + 1 : 1,
          ...mouvementData,
        };
        setMouvementsData((prev) => [...prev, newMouvement]);
      }
    }

    if (modal.kind === 'inventaire') {
      const inventaireData = {
        date_inventaire: String(formData.date_inventaire),
        motif: (formData.motif as string) || null,
      };

      if (modal.item) {
        setInventairesData((prev) =>
          prev.map((row) => (row.id === modal.item?.id ? { ...row, ...inventaireData } : row))
        );
      } else {
        const newInventaire: Inventaire = {
          id: inventairesData.length > 0 ? Math.max(...inventairesData.map((row) => row.id)) + 1 : 1,
          ...inventaireData,
        };
        setInventairesData((prev) => [...prev, newInventaire]);
      }
    }

    setModal(null);
  };

  const getInitialData = (item: MouvementStock | Inventaire | null) => {
    if (!modal) return {};

    if (modal.kind === 'mouvement') {
      const row = item as MouvementStock | null;
      return {
        lot_id: row ? String(row.lot_id) : '',
        type: row?.type ?? 'entree',
        quantite: row ? String(row.quantite) : '',
        motif: row?.motif ?? '',
      };
    }

    const row = item as Inventaire | null;
    return {
      date_inventaire: row?.date_inventaire ?? new Date().toISOString().slice(0, 10),
      motif: row?.motif ?? '',
    };
  };

  const validate = (formData: Record<string, unknown>) => {
    const errors: Record<string, string> = {};
    if (modal?.kind === 'mouvement') {
      if (!formData.lot_id) errors.lot_id = 'Le lot est obligatoire.';
      if (!formData.quantite || Number(formData.quantite) <= 0) {
        errors.quantite = 'La quantité est invalide.';
      }
    }
    if (modal?.kind === 'inventaire' && !formData.date_inventaire) {
      errors.date_inventaire = 'La date est obligatoire.';
    }
    return errors;
  };

  const renderForm = (
    _formData: Record<string, unknown>,
    onChange: (name: string, value: string) => void,
    errors: Record<string, string>
  ) => {
    if (!modal) return null;

    if (modal.kind === 'mouvement') {
      return (
        <>
          <div className="form-field">
            <label htmlFor="mouvement-lot">Lot *</label>
            <select
              id="mouvement-lot"
              name="lot_id"
              className="inline-input"
              onChange={(e) => onChange('lot_id', e.target.value)}
            >
              <option value="">— Choisir un lot —</option>
              {lots.map((row) => (
                <option key={row.id} value={row.id}>
                  {row.produit?.nom} — {row.numero_lot}
                </option>
              ))}
            </select>
            {errors.lot_id && <span className="form-error">{errors.lot_id}</span>}
          </div>
          <div className="form-field">
            <label htmlFor="mouvement-type">Type *</label>
            <select
              id="mouvement-type"
              name="type"
              className="inline-input"
              onChange={(e) => onChange('type', e.target.value)}
            >
              <option value="entree">Entrée</option>
              <option value="sortie">Sortie</option>
              <option value="ajustement">Ajustement</option>
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="mouvement-quantite">Quantité *</label>
            <input
              id="mouvement-quantite"
              name="quantite"
              type="number"
              min="1"
              step="1"
              className="inline-input"
              onChange={(e) => onChange('quantite', e.target.value)}
            />
            {errors.quantite && <span className="form-error">{errors.quantite}</span>}
          </div>
          <div className="form-field">
            <label htmlFor="mouvement-motif">Motif</label>
            <input
              id="mouvement-motif"
              name="motif"
              type="text"
              className="inline-input"
              onChange={(e) => onChange('motif', e.target.value)}
            />
          </div>
        </>
      );
    }

    return (
      <>
        <div className="form-field">
          <label htmlFor="inventaire-date">Date *</label>
          <input
            id="inventaire-date"
            name="date_inventaire"
            type="date"
            className="inline-input"
            onChange={(e) => onChange('date_inventaire', e.target.value)}
          />
          {errors.date_inventaire && <span className="form-error">{errors.date_inventaire}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="inventaire-motif">Motif</label>
          <input
            id="inventaire-motif"
            name="motif"
            type="text"
            className="inline-input"
            onChange={(e) => onChange('motif', e.target.value)}
          />
        </div>
      </>
    );
  };

  return (
    <EntityFormModal
      open={Boolean(modal)}
      onClose={() => setModal(null)}
      title={
        modal
          ? `${modal.item ? 'Modifier' : 'Ajouter'} ${modal.kind === 'mouvement' ? 'un mouvement' : 'un inventaire'}`
          : ''
      }
      editItem={modal?.item ?? null}
      onSubmit={handleSave}
      renderForm={renderForm}
      getInitialData={getInitialData}
      validate={validate}
      size="md"
    />
  );
}
