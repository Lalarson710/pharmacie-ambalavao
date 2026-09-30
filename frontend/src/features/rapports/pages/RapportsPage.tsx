import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { Download, RefreshCw, Save } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { DataTable, type Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { PageToolbar } from '@/components/PageToolbar';
import { RowActions } from '@/components/RowActions';
import { Modal } from '@/components/Modal';
import { useToast } from '@/components/Toast';
import { formatCurrency } from '@/utils/formatters';
import type { Achat, Facture, Reglement, Rapport, Vente } from '@/types';
import { usePermissions } from '@/hooks/usePermissions';
import { ventesApi, facturesApi, reglementsApi } from '@/features/ventes/api/ventes';
import { achatsApi } from '@/features/achats/api/achats';
import { stockApi, type StockParProduit } from '@/features/stock/api/stock';
import { rapportsApi } from '../api/rapports';
import { RapportExportModal } from '../components/RapportExportModal';
import {
  calculerRapport,
  periodeParDefaut,
  TYPES_RAPPORT_CALCULES,
  type RapportCalcule,
  type SourcesRapport,
} from '../utils/calculRapport';
import { formatDateLongue } from '@/features/statistiques/utils/exportStatistiques';

interface FormState {
  id: number | null;
  type: string;
  date_debut: string;
  date_fin: string;
  montant_total: string;
  description: string;
}

const EMPTY_FORM: FormState = {
  id: null,
  type: 'ventes',
  date_debut: '',
  date_fin: '',
  montant_total: '0',
  description: '',
};

const SOURCES_VIDES: SourcesRapport = {
  ventes: [],
  factures: [],
  reglements: [],
  achats: [],
  produits: [],
};

export function RapportsPage() {
  const { hasPermission } = usePermissions();
  const { showToast } = useToast();

  const canView = hasPermission('rapport.view');
  const canCreate = hasPermission('rapport.create');
  const canUpdate = hasPermission('rapport.update');
  const canDelete = hasPermission('rapport.delete');
  const canExport = hasPermission('rapport.export');

  /* ── Rapport généré automatiquement ──────────────────────────────────── */
  const periode = periodeParDefaut();
  const [typeRapport, setTypeRapport] = useState<string>('ventes');
  const [dateDebut, setDateDebut] = useState(periode.debut);
  const [dateFin, setDateFin] = useState(periode.fin);
  const [sources, setSources] = useState<SourcesRapport>(SOURCES_VIDES);
  const [sourcesLoading, setSourcesLoading] = useState(true);

  /* ── Rapports enregistrés ─────────────────────────────────────────────── */
  const [data, setData] = useState<Rapport[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);

  const [exportOpen, setExportOpen] = useState(false);

  /* ── Chargement des sources du rapport calculé ────────────────────────── */
  const chargerSources = useCallback(async () => {
    setSourcesLoading(true);
    try {
      const [ventes, factures, reglements, achats, produits] = await Promise.all([
        ventesApi.getAll(),
        facturesApi.getAll(),
        reglementsApi.getAll(),
        achatsApi.getAll(),
        stockApi.getStockParProduit(),
      ]);
      setSources({
        ventes: (ventes as Vente[]) ?? [],
        factures: (factures as Facture[]) ?? [],
        reglements: (reglements as Reglement[]) ?? [],
        achats: (achats as Achat[]) ?? [],
        produits: (produits as StockParProduit[]) ?? [],
      });
    } catch (error) {
      console.error('Erreur chargement sources rapport:', error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      showToast(
        axiosError.response?.data?.message ?? 'Impossible de charger les données du rapport.',
        'error',
      );
    } finally {
      setSourcesLoading(false);
    }
  }, [showToast]);

  const chargerRapports = useCallback(async () => {
    setLoading(true);
    try {
      setData(await rapportsApi.getAll());
    } catch (error) {
      console.error('Erreur lors du chargement des rapports:', error);
      const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
      showToast(
        axiosError.response?.data?.message ?? 'Impossible de charger les rapports.',
        'error',
      );
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (!canView) return;
    void Promise.all([chargerSources(), chargerRapports()]);
  }, [canView, chargerSources, chargerRapports]);

  /* ── Le rapport se recalcule automatiquement ───────────────────────────── */
  const rapportCalcule: RapportCalcule = useMemo(
    () => calculerRapport(typeRapport, dateDebut, dateFin, sources),
    [typeRapport, dateDebut, dateFin, sources],
  );

  const periodeValide = Boolean(dateDebut && dateFin && dateDebut <= dateFin);

  /* ── Liste des rapports enregistrés ────────────────────────────────────── */
  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const terme = search.trim().toLowerCase();
    return data.filter(
      (rapport) =>
        rapport.type.toLowerCase().includes(terme) ||
        (rapport.description ?? '').toLowerCase().includes(terme),
    );
  }, [data, search]);

  const totalMontant = useMemo(
    () => data.reduce((sum, rapport) => sum + Number(rapport.montant_total ?? 0), 0),
    [data],
  );

  const colonnesRapports: Column<Rapport>[] = [
    { key: 'id', label: '#' },
    {
      key: 'type',
      label: 'Type',
      render: (row) =>
        TYPES_RAPPORT_CALCULES.find((t) => t.value === row.type)?.label ?? row.type,
    },
    {
      key: 'date_debut',
      label: 'Date de début',
      render: (row) => formatDateLongue(String(row.date_debut).slice(0, 10)),
    },
    {
      key: 'date_fin',
      label: 'Date de fin',
      render: (row) => formatDateLongue(String(row.date_fin).slice(0, 10)),
    },
    {
      key: 'montant_total',
      label: 'Montant total',
      render: (row) => formatCurrency(row.montant_total),
    },
    { key: 'description', label: 'Description' },
  ];

  /* ── Actions ──────────────────────────────────────────────────────────── */

  const ouvrirCreation = () => {
    setForm({
      ...EMPTY_FORM,
      type: typeRapport,
      date_debut: dateDebut,
      date_fin: dateFin,
      montant_total: String(Math.round(rapportCalcule.montantReference * 100) / 100),
      description: `${rapportCalcule.titre} du ${formatDateLongue(dateDebut)} au ${formatDateLongue(dateFin)}.`,
    });
    setFormError(null);
    setFormOpen(true);
  };

  /**
   * Le montant est toujours recalcule : il n'existe aucun moyen de le saisir.
   * Si l'utilisateur change le type ou la periode dans la modal,
   * le montant suit automatiquement le nouveau rapport.
   */
  const majFormulaire = (patch: Partial<FormState>) => {
    setForm((precedent) => {
      const suivant = { ...precedent, ...patch };
      if (patch.type !== undefined || patch.date_debut !== undefined || patch.date_fin !== undefined) {
        const debut = suivant.date_debut || dateDebut;
        const fin = suivant.date_fin || dateFin;
        if (debut && fin && debut <= fin) {
          const recalcule = calculerRapport(suivant.type || typeRapport, debut, fin, sources);
          return {
            ...suivant,
            montant_total: String(Math.round(recalcule.montantReference * 100) / 100),
          };
        }
      }
      return suivant;
    });
  };

  const ouvrirModification = (rapport: Rapport) => {
    setForm({
      id: rapport.id,
      type: rapport.type,
      date_debut: String(rapport.date_debut).slice(0, 10),
      date_fin: String(rapport.date_fin).slice(0, 10),
      montant_total: String(rapport.montant_total ?? '0'),
      description: rapport.description ?? '',
    });
    setFormError(null);
    setFormOpen(true);
  };

  const enregistrer = async (event: FormEvent) => {
    event.preventDefault();

    if (!form.date_debut || !form.date_fin) {
      setFormError('Veuillez renseigner la date de début et la date de fin.');
      return;
    }
    if (form.date_debut > form.date_fin) {
      setFormError('La date de début ne peut pas être après la date de fin.');
      return;
    }
    const montant = Number(form.montant_total || 0);
    if (Number.isNaN(montant) || montant < 0) {
      setFormError('Le montant total doit être un nombre supérieur ou égal à 0.');
      return;
    }

    const payload = {
      type: form.type,
      date_debut: form.date_debut,
      date_fin: form.date_fin,
      montant_total: montant,
      description: form.description.trim() || null,
    };

    try {
      setSaving(true);
      if (form.id === null) {
        await rapportsApi.create(payload);
        showToast('Rapport enregistré.', 'success');
      } else {
        await rapportsApi.update(form.id, payload);
        showToast('Rapport modifié.', 'success');
      }
      setFormOpen(false);
      await chargerRapports();
    } catch (error) {
      console.error('Erreur enregistrement rapport:', error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      showToast(
        axiosError.response?.data?.message ?? "Impossible d'enregistrer le rapport.",
        'error',
      );
    } finally {
      setSaving(false);
    }
  };

  const supprimer = async (rapport: Rapport) => {
    const libelle = TYPES_RAPPORT_CALCULES.find((t) => t.value === rapport.type)?.label ?? rapport.type;
    if (!window.confirm(`Supprimer le rapport « ${libelle} » ?`)) return;

    try {
      await rapportsApi.delete(rapport.id);
      setData((precedent) => precedent.filter((item) => item.id !== rapport.id));
      showToast('Rapport supprimé.', 'success');
    } catch (error) {
      console.error('Erreur suppression rapport:', error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      showToast(
        axiosError.response?.data?.message ?? 'Impossible de supprimer le rapport.',
        'error',
      );
    }
  };

  if (!canView) {
    return (
      <div className="page-container">
        <div className="page-empty-state">
          <div className="empty-state-icon">🔒</div>
          <h2>Accès non autorisé</h2>
          <p>Vous n'avez pas les permissions nécessaires pour accéder à ce module.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <PageHeader
        title="Rapports"
        subtitle={`${rapportCalcule.titre} — ${rapportCalcule.rows.length} ligne(s) sur la période`}
      />

      {/* ── Rapport généré automatiquement ─────────────────────────────── */}
      <SectionCard
        title="Rapport"
        subtitle="Choisissez le type de rapport et la période : les indicateurs sont calculés automatiquement."
      >
        <div className="rapport-selector">
          <div className="form-field rapport-selector-type">
            <label htmlFor="rapport-auto-type">Type de rapport</label>
            <select
              id="rapport-auto-type"
              className="inline-input"
              value={typeRapport}
              onChange={(e) => setTypeRapport(e.target.value)}
            >
              {TYPES_RAPPORT_CALCULES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="rapport-auto-debut">Du</label>
            <input
              id="rapport-auto-debut"
              type="date"
              className="inline-input"
              value={dateDebut}
              max={dateFin || undefined}
              onChange={(e) => setDateDebut(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label htmlFor="rapport-auto-fin">Au</label>
            <input
              id="rapport-auto-fin"
              type="date"
              className="inline-input"
              value={dateFin}
              min={dateDebut || undefined}
              onChange={(e) => setDateFin(e.target.value)}
            />
          </div>

          <div className="rapport-selector-actions">
            <button
              type="button"
              className="btn-ghost btn-sm"
              onClick={() => void chargerSources()}
              disabled={sourcesLoading}
              title="Recharger les données"
            >
              <RefreshCw size={15} /> Actualiser
            </button>
            {canExport && (
              <button
                type="button"
                className="btn-export-pdf"
                onClick={() => setExportOpen(true)}
                disabled={sourcesLoading || !periodeValide}
                title="Exporter le rapport"
              >
                <Download size={15} /> Exporter
              </button>
            )}
            {canCreate && (
              <button
                type="button"
                className="btn-primary"
                onClick={ouvrirCreation}
                disabled={sourcesLoading || !periodeValide}
              >
                <Save size={15} /> Enregistrer
              </button>
            )}
          </div>
        </div>

        <p className="rapport-periode">
          Période : {formatDateLongue(dateDebut)} → {formatDateLongue(dateFin)}
          {!periodeValide && <span className="rapport-periode-error"> — période invalide</span>}
        </p>

        <div className={`rapport-kpis ${sourcesLoading ? 'is-loading' : ''}`}>
          {rapportCalcule.kpis.map((kpi) => (
            <div
              key={kpi.label}
              className={`rapport-kpi rapport-kpi-${kpi.tone ?? 'default'}`}
            >
              <span className="rapport-kpi-label">{kpi.label}</span>
              <span className="rapport-kpi-value">{kpi.valeur}</span>
              {kpi.hint && <span className="rapport-kpi-hint">{kpi.hint}</span>}
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title={`Détail — ${rapportCalcule.titre}`}
        subtitle={`${rapportCalcule.rows.length} ligne(s)`}
      >
        <DataTable
          data={sourcesLoading ? [] : rapportCalcule.rows.map((row, index) => ({ id: index, ...row }))}
          columns={rapportCalcule.colonnes.map((colonne) => ({
            key: colonne.key,
            label: colonne.label,
            className: colonne.align ? `align-${colonne.align}` : undefined,
          }))}
          emptyMessage={
            sourcesLoading ? 'Calcul du rapport...' : 'Aucune donnée sur cette période.'
          }
        />
      </SectionCard>

      {/* ── Rapports enregistrés ───────────────────────────────────────── */}
      <SectionCard
        title="Rapports enregistrés"
        subtitle="Historique des rapports sauvegardés."
      >
        <PageToolbar
          search={search}
          onSearch={setSearch}
          placeholder="Rechercher un rapport..."
          actions={
            <span className="rapports-total">
              Total enregistré : <strong>{formatCurrency(totalMontant)}</strong>
            </span>
          }
        />

        <DataTable
          data={loading ? [] : filtered}
          columns={colonnesRapports}
          emptyMessage={loading ? 'Chargement des rapports...' : 'Aucun rapport enregistré.'}
          actionsHeaderLabel="Actions"
          actions={(row) => (
            <RowActions
              onEdit={canUpdate ? () => ouvrirModification(row) : undefined}
              onDelete={canDelete ? () => void supprimer(row) : undefined}
            />
          )}
        />
      </SectionCard>

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={form.id === null ? 'Enregistrer le rapport' : 'Modifier le rapport'}
        size="lg"
      >
        <form className="rapport-form-modal" onSubmit={enregistrer}>
          <div className="form-field rapport-form-full">
            <label htmlFor="rapport-form-type">Type de rapport</label>
            <select
              id="rapport-form-type"
              className="inline-input"
              value={form.type}
              onChange={(e) => majFormulaire({ type: e.target.value })}
            >
              {TYPES_RAPPORT_CALCULES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="rapport-form-debut">Date de début</label>
            <input
              id="rapport-form-debut"
              type="date"
              className="inline-input"
              value={form.date_debut}
              onChange={(e) => majFormulaire({ date_debut: e.target.value })}
            />
          </div>

          <div className="form-field">
            <label htmlFor="rapport-form-fin">Date de fin</label>
            <input
              id="rapport-form-fin"
              type="date"
              className="inline-input"
              value={form.date_fin}
              onChange={(e) => majFormulaire({ date_fin: e.target.value })}
            />
          </div>

          <div className="form-field">
            <label htmlFor="rapport-form-montant">Montant total (Ar)</label>
            <input
              id="rapport-form-montant"
              type="text"
              className="inline-input is-readonly"
              value={formatCurrency(Number(form.montant_total || 0))}
              readOnly
              tabIndex={-1}
              aria-readonly="true"
              title="Montant calculé automatiquement depuis le rapport affiché"
            />
            <small className="rapport-form-hint">
              Récupéré automatiquement depuis le rapport affiché — saisie interdite.
            </small>
          </div>

          <div className="form-field rapport-form-full">
            <label htmlFor="rapport-form-description">Description</label>
            <input
              id="rapport-form-description"
              type="text"
              className="inline-input"
              value={form.description}
              onChange={(e) => majFormulaire({ description: e.target.value })}
            />
          </div>

          {formError && <p className="form-error form-error-summary">{formError}</p>}

          <div className="form-actions">
            <button type="button" className="btn-ghost" onClick={() => setFormOpen(false)}>
              Annuler
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </Modal>

      <RapportExportModal
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        rapport={rapportCalcule}
      />
    </div>
  );
}
