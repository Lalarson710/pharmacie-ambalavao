import { useMemo, useState } from 'react';
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Boxes,
  Check,
  Info,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import { Modal } from '@/components/Modal';
import { useToast } from '@/components/Toast';
import type { Inventaire, Lot, MouvementStock } from '@/types';
import {
  stockApi,
  type CreateInventaireData,
  type CreateInventaireLigneData,
  type CreateMouvementStockData,
  type UpdateInventaireData,
  type UpdateInventaireLigneData,
  type UpdateMouvementStockData,
} from '../../api/stock';

export type StockModalKind = 'entree' | 'sortie' | 'inventaire';

export interface StockModalState {
  kind: StockModalKind;
  item: MouvementStock | Inventaire | null;
}

interface InventoryLineForm {
  id?: number;
  lot_id: string;
  quantite_reelle: string;
}

interface StockModalProps {
  modal: StockModalState | null;
  lots: Lot[];
  onClose: () => void;
  onSaved: () => Promise<void>;
}

function getErrorMessage(error: unknown, fallback: string): string {
  const apiError = error as {
    response?: {
      data?: {
        message?: string;
        errors?: Record<string, string[]>;
      };
    };
  };

  return (
    apiError.response?.data?.message ??
    Object.values(apiError.response?.data?.errors ?? {})[0]?.[0] ??
    fallback
  );
}

function parseInventoryLines(value: unknown): InventoryLineForm[] {
  if (typeof value !== 'string' || !value.trim()) return [];

  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];

    return parsed.map((line: unknown) => {
      const item = line as Partial<InventoryLineForm>;

      return {
        id: item.id,
        lot_id: String(item.lot_id ?? ''),
        quantite_reelle: String(item.quantite_reelle ?? ''),
      };
    });
  } catch {
    return [];
  }
}

function getLotLabel(lot: Lot): string {
  return `${lot.produit?.nom ?? 'Produit'} — Lot ${lot.numero_lot}`;
}

export function StockModal({
  modal,
  lots,
  onClose,
  onSaved,
}: StockModalProps) {
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);

  const existingMouvement =
    modal?.kind === 'inventaire'
      ? null
      : (modal?.item as MouvementStock | null);

  const existingInventaire =
    modal?.kind === 'inventaire'
      ? (modal?.item as Inventaire | null)
      : null;

  const isInventory = modal?.kind === 'inventaire';
  const isEntry = modal?.kind === 'entree';
  const isExit = modal?.kind === 'sortie';

  const [movementData, setMovementData] = useState({
    lot_id: existingMouvement ? String(existingMouvement.lot_id) : '',
    quantite: existingMouvement ? String(existingMouvement.quantite) : '',
    motif: existingMouvement?.motif ?? '',
  });

  const [inventoryData, setInventoryData] = useState({
    date_inventaire: existingInventaire
      ? String(existingInventaire.date_inventaire).slice(0, 10)
      : new Date().toISOString().slice(0, 10),
    motif: existingInventaire?.motif ?? '',
    inventaire_lignes: JSON.stringify(
      existingInventaire?.lignes?.map((line) => ({
        id: line.id,
        lot_id: String(line.lot_id),
        quantite_reelle: String(line.quantite_reelle),
      })) ?? [],
    ),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedLot = useMemo(
    () => lots.find((lot) => String(lot.id) === movementData.lot_id),
    [lots, movementData.lot_id],
  );

  const inventoryLines = useMemo(
    () => parseInventoryLines(inventoryData.inventaire_lignes),
    [inventoryData.inventaire_lignes],
  );

  function resetErrors() {
    setErrors({});
  }

  function clearFormData() {
    if (!modal) return;

    if (modal.kind === 'inventaire') {
      setInventoryData({
        date_inventaire: new Date().toISOString().slice(0, 10),
        motif: '',
        inventaire_lignes: JSON.stringify([
          {
            lot_id: '',
            quantite_reelle: '',
          },
        ]),
      });
    } else {
      setMovementData({
        lot_id: '',
        quantite: '',
        motif: '',
      });
    }

    resetErrors();
  }

  function updateMovement(
    name: keyof typeof movementData,
    value: string,
  ) {
    setMovementData((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => {
      const next = { ...current };
      delete next[name];
      return next;
    });
  }

  function updateInventory(
    name: keyof typeof inventoryData,
    value: string,
  ) {
    setInventoryData((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => {
      const next = { ...current };
      delete next[name];
      return next;
    });
  }

  function updateInventoryLine(
    index: number,
    name: 'lot_id' | 'quantite_reelle',
    value: string,
  ) {
    const nextLines = [...inventoryLines];

    nextLines[index] = {
      ...nextLines[index],
      [name]: value,
    };

    updateInventory(
      'inventaire_lignes',
      JSON.stringify(nextLines),
    );
  }

  function addInventoryLine() {
    updateInventory(
      'inventaire_lignes',
      JSON.stringify([
        ...inventoryLines,
        {
          lot_id: '',
          quantite_reelle: '',
        },
      ]),
    );
  }

  function removeInventoryLine(index: number) {
    updateInventory(
      'inventaire_lignes',
      JSON.stringify(
        inventoryLines.filter((_, lineIndex) => lineIndex !== index),
      ),
    );
  }

  function validate(): boolean {
    const nextErrors: Record<string, string> = {};

    if (isInventory) {
      if (!inventoryData.date_inventaire) {
        nextErrors.date_inventaire = 'La date est obligatoire.';
      }

      if (inventoryLines.length === 0) {
        nextErrors.inventaire_lignes =
          'Ajoutez au moins une ligne d’inventaire.';
      }

      const usedLots = new Set<number>();

      inventoryLines.forEach((line, index) => {
        const lotId = Number(line.lot_id);
        const quantity = Number(line.quantite_reelle);

        if (!lotId) {
          nextErrors[`line-${index}-lot`] =
            'Sélectionnez un lot.';
        }

        if (
          line.quantite_reelle === '' ||
          !Number.isInteger(quantity) ||
          quantity < 0
        ) {
          nextErrors[`line-${index}-quantity`] =
            'La quantité réelle est invalide.';
        }

        if (lotId && usedLots.has(lotId)) {
          nextErrors[`line-${index}-lot`] =
            'Ce lot est déjà sélectionné.';
        }

        if (lotId) usedLots.add(lotId);
      });
    } else {
      if (!movementData.lot_id) {
        nextErrors.lot_id = 'Sélectionnez un lot.';
      }

      const quantity = Number(movementData.quantite);

      if (
        !movementData.quantite ||
        !Number.isInteger(quantity) ||
        quantity <= 0
      ) {
        nextErrors.quantite =
          'La quantité doit être un nombre entier supérieur à zéro.';
      }

      if (isExit && selectedLot && quantity > selectedLot.quantite) {
        nextErrors.quantite =
          `Le stock disponible est seulement de ${selectedLot.quantite}.`;
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!modal || saving || !validate()) return;

    setSaving(true);

    try {
      if (
        modal.kind === 'entree' ||
        modal.kind === 'sortie'
      ) {
        const payload: CreateMouvementStockData = {
          lot_id: Number(movementData.lot_id),
          type: modal.kind,
          quantite: Number(movementData.quantite),
          motif: movementData.motif.trim() || null,
        };

        if (existingMouvement) {
          await stockApi.updateMouvement(
            existingMouvement.id,
            payload as UpdateMouvementStockData,
          );
        } else {
          await stockApi.createMouvement(payload);
        }

        showToast(
          existingMouvement
            ? 'Mouvement modifié avec succès.'
            : 'Mouvement enregistré avec succès.',
          'success',
        );
      } else {
        const inventairePayload: CreateInventaireData = {
          date_inventaire: inventoryData.date_inventaire,
          motif: inventoryData.motif.trim() || null,
        };

        let inventaireId: number;

        if (existingInventaire) {
          await stockApi.updateInventaire(
            existingInventaire.id,
            inventairePayload as UpdateInventaireData,
          );
          inventaireId = existingInventaire.id;
        } else {
          const created =
            await stockApi.createInventaire(inventairePayload);

          inventaireId = created.id;
        }

        for (const line of inventoryLines) {
          const payload: CreateInventaireLigneData = {
            lot_id: Number(line.lot_id),
            quantite_reelle: Number(line.quantite_reelle),
          };

          if (line.id) {
            await stockApi.updateInventaireLigne(
              inventaireId,
              line.id,
              payload as UpdateInventaireLigneData,
            );
          } else {
            await stockApi.createInventaireLigne(
              inventaireId,
              payload,
            );
          }
        }

        if (existingInventaire?.lignes) {
          for (const oldLine of existingInventaire.lignes) {
            if (
              !inventoryLines.some(
                (line) => line.id === oldLine.id,
              )
            ) {
              await stockApi.deleteInventaireLigne(
                inventaireId,
                oldLine.id,
              );
            }
          }
        }

        showToast('Inventaire enregistré avec succès.', 'success');
      }

      await onSaved();
      clearFormData();
      onClose();
    } catch (error: unknown) {
      showToast(
        getErrorMessage(
          error,
          'Une erreur est survenue pendant la sauvegarde.',
        ),
        'error',
      );
    } finally {
      setSaving(false);
    }
  }

  if (!modal) return null;

  const title = isInventory
    ? existingInventaire
      ? 'Modifier l’inventaire'
      : 'Créer un inventaire'
    : isEntry
      ? existingMouvement
        ? 'Modifier l’entrée de stock'
        : 'Ajouter une entrée de stock'
      : existingMouvement
        ? 'Modifier la sortie de stock'
        : 'Ajouter une sortie de stock';

  const subtitle = isInventory
    ? 'Comparez les quantités théoriques et réelles de vos lots.'
    : isEntry
      ? 'Ajoutez une quantité reçue dans un lot existant.'
      : 'Retirez une quantité disponible dans un lot existant.';

  const icon = isInventory ? (
    <Boxes size={20} />
  ) : isEntry ? (
    <ArrowDownToLine size={20} />
  ) : (
    <ArrowUpFromLine size={20} />
  );

  return (
    <Modal open onClose={onClose} title={title} size="lg">
      <form
        onSubmit={handleSubmit}
        className="stock-form"
      >
        <div className="stock-form-header">
          <div className="stock-form-icon">{icon}</div>
          <div>
            <p className="stock-form-kicker">
              {isInventory
                ? 'CONTRÔLE DES STOCKS'
                : isEntry
                  ? 'RÉCEPTION DE MARCHANDISE'
                  : 'SORTIE DE MARCHANDISE'}
            </p>
            <p className="stock-form-subtitle">{subtitle}</p>
          </div>
        </div>

        {!isInventory ? (
          <div className="stock-form-body">
            <div className="stock-form-section">
              <div className="stock-form-section-title">
                <span>1</span>
                <div>
                  <strong>Informations du mouvement</strong>
                  <small>
                    Sélectionnez le lot concerné et indiquez la
                    quantité.
                  </small>
                </div>
              </div>

              <div className="stock-form-grid">
                <div className="stock-field stock-field-full">
                  <label htmlFor="movement-lot">
                    Lot concerné <em>*</em>
                  </label>
                  <select
                    id="movement-lot"
                    value={movementData.lot_id}
                    onChange={(event) =>
                      updateMovement('lot_id', event.target.value)
                    }
                    className={
                      errors.lot_id ? 'has-error' : ''
                    }
                  >
                    <option value="">
                      Sélectionner un produit et un lot...
                    </option>
                    {lots.map((lot) => (
                      <option key={lot.id} value={lot.id}>
                        {getLotLabel(lot)}
                      </option>
                    ))}
                  </select>
                  {errors.lot_id && (
                    <span className="stock-error">
                      {errors.lot_id}
                    </span>
                  )}
                </div>

                <div className="stock-field">
                  <label htmlFor="movement-quantity">
                    Quantité <em>*</em>
                  </label>
                  <div className="stock-input-with-unit">
                    <input
                      id="movement-quantity"
                      type="number"
                      min="1"
                      step="1"
                      value={movementData.quantite}
                      onChange={(event) =>
                        updateMovement(
                          'quantite',
                          event.target.value,
                        )
                      }
                      placeholder="Ex. 12"
                      className={
                        errors.quantite ? 'has-error' : ''
                      }
                    />
                    <span>unités</span>
                  </div>
                  {errors.quantite && (
                    <span className="stock-error">
                      {errors.quantite}
                    </span>
                  )}
                </div>

                <div className="stock-field">
                  <label htmlFor="movement-motif">
                    Motif
                  </label>
                  <input
                    id="movement-motif"
                    type="text"
                    value={movementData.motif}
                    onChange={(event) =>
                      updateMovement(
                        'motif',
                        event.target.value,
                      )
                    }
                    placeholder={
                      isEntry
                        ? 'Ex. Réception fournisseur'
                        : 'Ex. Produit délivré'
                    }
                  />
                </div>
              </div>
            </div>

            {selectedLot && (
              <div className="stock-lot-preview">
                <div className="stock-lot-preview-icon">
                  <Boxes size={18} />
                </div>
                <div className="stock-lot-preview-content">
                  <strong>{selectedLot.produit?.nom}</strong>
                  <span>
                    Lot {selectedLot.numero_lot} • Expiration le{' '}
                    {selectedLot.date_peremption}
                  </span>
                </div>
                <div className="stock-lot-preview-quantity">
                  <span>Stock actuel</span>
                  <strong>{selectedLot.quantite}</strong>
                </div>
              </div>
            )}

            <div className="stock-info-box">
              <Info size={16} />
              <span>
                {isEntry
                  ? 'La quantité sera ajoutée au stock du lot sélectionné.'
                  : 'La quantité ne peut pas dépasser le stock disponible.'}
              </span>
            </div>
          </div>
        ) : (
          <div className="stock-form-body">
            <div className="stock-form-section">
              <div className="stock-form-section-title">
                <span>1</span>
                <div>
                  <strong>Informations générales</strong>
                  <small>
                    Définissez la date et le motif de l’inventaire.
                  </small>
                </div>
              </div>

              <div className="stock-form-grid">
                <div className="stock-field">
                  <label htmlFor="inventory-date">
                    Date de l’inventaire <em>*</em>
                  </label>
                  <input
                    id="inventory-date"
                    type="date"
                    value={inventoryData.date_inventaire}
                    onChange={(event) =>
                      updateInventory(
                        'date_inventaire',
                        event.target.value,
                      )
                    }
                    className={
                      errors.date_inventaire
                        ? 'has-error'
                        : ''
                    }
                  />
                  {errors.date_inventaire && (
                    <span className="stock-error">
                      {errors.date_inventaire}
                    </span>
                  )}
                </div>

                <div className="stock-field">
                  <label htmlFor="inventory-motif">
                    Motif
                  </label>
                  <input
                    id="inventory-motif"
                    type="text"
                    value={inventoryData.motif}
                    onChange={(event) =>
                      updateInventory(
                        'motif',
                        event.target.value,
                      )
                    }
                    placeholder="Ex. Contrôle mensuel"
                  />
                </div>
              </div>
            </div>

            <div className="stock-form-section">
              <div className="stock-form-section-title">
                <span>2</span>
                <div>
                  <strong>Lots à contrôler</strong>
                  <small>
                    Saisissez la quantité réellement disponible.
                  </small>
                </div>
                <span className="stock-line-count">
                  {inventoryLines.length} ligne
                  {inventoryLines.length > 1 ? 's' : ''}
                </span>
              </div>

              {errors.inventaire_lignes && (
                <div className="stock-error stock-error-block">
                  {errors.inventaire_lignes}
                </div>
              )}

              <div className="inventory-lines">
                {inventoryLines.length === 0 ? (
                  <div className="inventory-empty">
                    <Boxes size={24} />
                    <strong>Aucune ligne ajoutée</strong>
                    <span>
                      Ajoutez les lots à contrôler dans cet
                      inventaire.
                    </span>
                  </div>
                ) : (
                  inventoryLines.map((line, index) => {
                    const selectedInventoryLot =
                      lots.find(
                        (lot) =>
                          String(lot.id) === line.lot_id,
                      );

                    return (
                      <div
                        key={line.id ?? `new-${index}`}
                        className="inventory-line"
                      >
                        <div className="inventory-line-number">
                          {String(index + 1).padStart(2, '0')}
                        </div>

                        <div className="stock-field">
                          <label
                            htmlFor={`inventory-lot-${index}`}
                          >
                            Produit / lot <em>*</em>
                          </label>
                          <select
                            id={`inventory-lot-${index}`}
                            value={line.lot_id}
                            onChange={(event) =>
                              updateInventoryLine(
                                index,
                                'lot_id',
                                event.target.value,
                              )
                            }
                            className={
                              errors[`line-${index}-lot`]
                                ? 'has-error'
                                : ''
                            }
                          >
                            <option value="">
                              Sélectionner un lot...
                            </option>
                            {lots.map((lot) => (
                              <option
                                key={lot.id}
                                value={lot.id}
                              >
                                {getLotLabel(lot)}
                              </option>
                            ))}
                          </select>
                          {selectedInventoryLot && (
                            <small className="stock-field-hint">
                              Stock théorique :{' '}
                              {selectedInventoryLot.quantite}
                            </small>
                          )}
                          {errors[`line-${index}-lot`] && (
                            <span className="stock-error">
                              {errors[`line-${index}-lot`]}
                            </span>
                          )}
                        </div>

                        <div className="stock-field">
                          <label
                            htmlFor={`inventory-quantity-${index}`}
                          >
                            Quantité réelle <em>*</em>
                          </label>
                          <div className="stock-input-with-unit">
                            <input
                              id={`inventory-quantity-${index}`}
                              type="number"
                              min="0"
                              step="1"
                              value={line.quantite_reelle}
                              onChange={(event) =>
                                updateInventoryLine(
                                  index,
                                  'quantite_reelle',
                                  event.target.value,
                                )
                              }
                              placeholder="0"
                              className={
                                errors[
                                  `line-${index}-quantity`
                                ]
                                  ? 'has-error'
                                  : ''
                              }
                            />
                            <span>unités</span>
                          </div>
                          {errors[`line-${index}-quantity`] && (
                            <span className="stock-error">
                              {errors[`line-${index}-quantity`]}
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          className="stock-remove-line"
                          onClick={() =>
                            removeInventoryLine(index)
                          }
                          title="Supprimer la ligne"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              <button
                type="button"
                className="stock-add-line"
                onClick={addInventoryLine}
              >
                <Plus size={16} />
                Ajouter un autre lot
              </button>
            </div>
          </div>
        )}

        <div className="stock-form-footer">
          <div className="stock-form-footer-note">
            <Info size={15} />
            <span>Les champs marqués * sont obligatoires.</span>
          </div>

          <div className="stock-form-footer-actions">
            <button
              type="button"
              className="stock-button-cancel"
              onClick={onClose}
              disabled={saving}
            >
              <X size={16} />
              Annuler
            </button>

            <button
              type="submit"
              className="stock-button-submit"
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="stock-spinner" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Check size={16} />
                  {existingMouvement || existingInventaire
                    ? 'Enregistrer les modifications'
                    : 'Enregistrer'}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
