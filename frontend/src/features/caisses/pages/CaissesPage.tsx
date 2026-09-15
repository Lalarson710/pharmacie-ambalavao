import { useState } from 'react';
import { Plus, Printer } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { PageTabs } from '@/components/PageTabs';
import { PageToolbar } from '@/components/PageToolbar';
import { RowActions } from '@/components/RowActions';
import { EntityFormModal } from '@/components/EntityFormModal';
import { ConfirmModal } from '@/components/ConfirmModal';
import { caisses, mouvementsCaisse, utilisateurs } from '@/data/mockData';
import {
  formatCurrency,
  formatDateTime,
  getStatutBadgeClass,
  formatStatut,
} from '@/utils/formatters';
import type { Caisse, MouvementCaisse } from '@/types';

const caisseTabs = [
  { id: 'caisses', label: 'Caisse' },
  { id: 'mouvements', label: 'Mouvements' },
];

type CaisseModalKind = 'caisse' | 'mouvement';

interface CaisseModalState {
  kind: CaisseModalKind;
  item: Caisse | MouvementCaisse | null;
}

export function CaissesPage() {
  const [activeTab, setActiveTab] = useState('caisses');

  const [caisseData, setCaisseData] = useState<Caisse[]>(caisses);
  const [mouvementsData, setMouvementsData] =
    useState<MouvementCaisse[]>(mouvementsCaisse);

  const [modal, setModal] = useState<CaisseModalState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Caisse | null>(null);
  const [search, setSearch] = useState('');

  const filteredCaisses = search
    ? caisseData.filter((row) =>
        [
          row.id,
          row.utilisateur?.name,
          row.statut,
          row.observation ?? '',
          row.date_ouverture,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(search.toLowerCase())
          )
      )
    : caisseData;

  const filteredMouvements = search
    ? mouvementsData.filter((row) =>
        [
          row.id,
          row.caisse_id,
          row.type,
          row.motif ?? '',
          row.reglement?.reference ?? '',
          row.created_at ?? '',
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(search.toLowerCase())
          )
      )
    : mouvementsData;

  const caisseColumns: Column<Caisse>[] = [
    { key: 'id', label: '#' },
    {
      key: 'date_ouverture',
      label: 'Ouverture',
      render: (row) => formatDateTime(row.date_ouverture),
    },
    {
      key: 'date_fermeture',
      label: 'Fermeture',
      render: (row) =>
        row.date_fermeture ? formatDateTime(row.date_fermeture) : '—',
    },
    {
      key: 'montant_initial',
      label: 'Montant initial',
      render: (row) => formatCurrency(row.montant_initial),
    },
    {
      key: 'montant_final',
      label: 'Montant final',
      render: (row) =>
        row.montant_final ? formatCurrency(row.montant_final) : '—',
    },
    {
      key: 'ecart',
      label: 'Écart',
      render: (row) => (row.ecart ? formatCurrency(row.ecart) : '—'),
    },
    {
      key: 'utilisateur',
      label: 'Ouvert par',
      render: (row) => row.utilisateur?.name ?? '—',
    },
    {
      key: 'statut',
      label: 'Statut',
      render: (row) => (
        <span className={`badge ${getStatutBadgeClass(row.statut)}`}>
          {formatStatut(row.statut)}
        </span>
      ),
    },
  ];

  const mouvementColumns: Column<MouvementCaisse>[] = [
    { key: 'id', label: '#' },
    {
      key: 'caisse',
      label: 'Caisse',
      render: (row) => `#${row.caisse_id}`,
    },
    {
      key: 'type',
      label: 'Type',
      render: (row) => (
        <span
          className={`badge ${
            row.type === 'entree' ? 'badge-active' : 'badge-inactive'
          }`}
        >
          {row.type === 'entree' ? 'Entrée' : 'Sortie'}
        </span>
      ),
    },
    {
      key: 'montant',
      label: 'Montant',
      render: (row) => formatCurrency(row.montant),
    },
    {
      key: 'motif',
      label: 'Motif',
    },
    {
      key: 'reglement',
      label: 'Règlement',
      render: (row) => row.reglement?.reference ?? '—',
    },
    {
      key: 'created_at',
      label: 'Date',
      render: (row) => formatDateTime(row.created_at ?? ''),
    },
  ];

  const handlePrint = () => {
    window.print();
  };

  const openAdd = (kind: CaisseModalKind) => {
    setModal({
      kind,
      item: null,
    });
  };

  const openEdit = (kind: CaisseModalKind, item: Caisse | MouvementCaisse) => {
    setModal({
      kind,
      item,
    });
  };

  const handleSave = (formData: Record<string, unknown>) => {
    if (!modal) return;

    /*
     * ============================================================
     * GESTION D'UNE CAISSE
     * ============================================================
     */
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

    /*
     * ============================================================
     * SORTIE DE CAISSE
     * ============================================================
     *
     * Une sortie manuelle est toujours enregistrée avec :
     *
     * type = 'sortie'
     *
     * L'utilisateur ne choisit plus le type dans le formulaire.
     */
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

  const confirmDelete = () => {
    if (!deleteTarget) return;

    setCaisseData((prev) =>
      prev.filter((row) => row.id !== deleteTarget.id)
    );

    setDeleteTarget(null);
  };

  const getInitialData = (
    item: Caisse | MouvementCaisse | null
  ) => {
    if (!modal) return {};

    /*
     * ============================================================
     * DONNÉES INITIALES D'UNE CAISSE
     * ============================================================
     */
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

    /*
     * ============================================================
     * DONNÉES INITIALES D'UNE SORTIE DE CAISSE
     * ============================================================
     */
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

    /*
     * Validation caisse
     */
    if (modal?.kind === 'caisse') {
      if (!formData.user_id) {
        errors.user_id = 'L’utilisateur est obligatoire.';
      }

      if (!formData.date_ouverture) {
        errors.date_ouverture =
          'La date d’ouverture est obligatoire.';
      }

      if (
        !formData.montant_initial ||
        Number(formData.montant_initial) < 0
      ) {
        errors.montant_initial =
          'Le montant initial est invalide.';
      }
    }

    /*
     * Validation sortie de caisse
     */
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
    _formData: Record<string, unknown>,
    onChange: (name: string, value: string) => void,
    errors: Record<string, string>
  ) => {
    if (!modal) return null;

    /*
     * ============================================================
     * FORMULAIRE CAISSE
     * ============================================================
     */
    if (modal.kind === 'caisse') {
      return (
        <>
          <div className="form-field">
            <label htmlFor="caisse-utilisateur">
              Utilisateur *
            </label>

            <select
              id="caisse-utilisateur"
              name="user_id"
              className="inline-input"
              onChange={(e) =>
                onChange('user_id', e.target.value)
              }
            >
              <option value="">
                — Choisir un utilisateur —
              </option>

              {utilisateurs.map((row) => (
                <option key={row.id} value={row.id}>
                  {row.name}
                </option>
              ))}
            </select>

            {errors.user_id && (
              <span className="form-error">
                {errors.user_id}
              </span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="caisse-ouverture">
              Date d’ouverture *
            </label>

            <input
              id="caisse-ouverture"
              name="date_ouverture"
              type="datetime-local"
              className="inline-input"
              onChange={(e) =>
                onChange('date_ouverture', e.target.value)
              }
            />

            {errors.date_ouverture && (
              <span className="form-error">
                {errors.date_ouverture}
              </span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="caisse-montant-initial">
              Montant initial *
            </label>

            <input
              id="caisse-montant-initial"
              name="montant_initial"
              type="number"
              min="0"
              step="0.01"
              className="inline-input"
              onChange={(e) =>
                onChange(
                  'montant_initial',
                  e.target.value
                )
              }
            />

            {errors.montant_initial && (
              <span className="form-error">
                {errors.montant_initial}
              </span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="caisse-statut">
              Statut *
            </label>

            <select
              id="caisse-statut"
              name="statut"
              className="inline-input"
              onChange={(e) =>
                onChange('statut', e.target.value)
              }
            >
              <option value="ouverte">
                Ouverte
              </option>

              <option value="fermee">
                Fermée
              </option>
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="caisse-observation">
              Observation
            </label>

            <input
              id="caisse-observation"
              name="observation"
              type="text"
              className="inline-input"
              onChange={(e) =>
                onChange(
                  'observation',
                  e.target.value
                )
              }
            />
          </div>
        </>
      );
    }

    /*
     * ============================================================
     * FORMULAIRE SORTIE DE CAISSE
     * ============================================================
     */
    return (
      <>
        <div className="form-field">
          <label htmlFor="mouvement-caisse">
            Caisse *
          </label>

          <select
            id="mouvement-caisse"
            name="caisse_id"
            className="inline-input"
            onChange={(e) =>
              onChange(
                'caisse_id',
                e.target.value
              )
            }
          >
            <option value="">
              — Choisir une caisse —
            </option>

            {caisseData.map((row) => (
              <option key={row.id} value={row.id}>
                Caisse #{row.id}
              </option>
            ))}
          </select>

          {errors.caisse_id && (
            <span className="form-error">
              {errors.caisse_id}
            </span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="mouvement-montant">
            Montant *
          </label>

          <input
            id="mouvement-montant"
            name="montant"
            type="number"
            min="0.01"
            step="0.01"
            className="inline-input"
            onChange={(e) =>
              onChange(
                'montant',
                e.target.value
              )
            }
          />

          {errors.montant && (
            <span className="form-error">
              {errors.montant}
            </span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="mouvement-motif">
            Motif *
          </label>

          <input
            id="mouvement-motif"
            name="motif"
            type="text"
            className="inline-input"
            placeholder="Ex. Achat de fournitures"
            onChange={(e) =>
              onChange(
                'motif',
                e.target.value
              )
            }
          />

          {errors.motif && (
            <span className="form-error">
              {errors.motif}
            </span>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="page-container">
      <PageHeader
        title="Caisse"
        subtitle="Gestion des caisses et des mouvements financiers"
      />

      <PageToolbar
        search={search}
        onSearch={setSearch}
        placeholder="Rechercher dans l’onglet..."
        actions={
          <>
            {activeTab === 'caisses' && (
              <>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => openAdd('caisse')}
                >
                  <Plus size={15} />
                  Ajouter
                </button>

                <button
                  type="button"
                  className="btn-ghost"
                  onClick={handlePrint}
                >
                  <Printer size={15} />
                  Imprimer
                </button>
              </>
            )}

            {activeTab === 'mouvements' && (
              <button
                type="button"
                className="btn-primary"
                onClick={() => openAdd('mouvement')}
              >
                <Plus size={15} />
                Sortie de caisse
              </button>
            )}
          </>
        }
      />

      <PageTabs
        tabs={caisseTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'caisses' && (
        <SectionCard
          title="Liste des caisses"
          subtitle={`${caisseData.length} caisse(s)`}
        >
          <DataTable
            data={filteredCaisses}
            columns={caisseColumns}
            emptyMessage="Aucune caisse enregistrée."
            actionsHeaderLabel="Actions"
            actions={(row) => (
              <RowActions
                onEdit={() =>
                  openEdit('caisse', row)
                }
                onDelete={() =>
                  setDeleteTarget(row)
                }
                onPrint={handlePrint}
              />
            )}
          />
        </SectionCard>
      )}

      {activeTab === 'mouvements' && (
        <SectionCard
          title="Mouvements de caisse"
          subtitle={`${mouvementsData.length} mouvement(s)`}
        >
          <DataTable
            data={filteredMouvements}
            columns={mouvementColumns}
            emptyMessage="Aucun mouvement de caisse."
            actionsHeaderLabel="Actions"
          />
        </SectionCard>
      )}

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

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Supprimer la caisse"
        message={`Voulez-vous vraiment supprimer la caisse ${
          deleteTarget ? `#${deleteTarget.id}` : ''
        } ?`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}