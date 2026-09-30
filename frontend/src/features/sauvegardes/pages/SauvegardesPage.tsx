import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Database, HardDriveDownload, Plus, RefreshCw, Upload } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { DataTable, type Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { PageToolbar } from '@/components/PageToolbar';
import { RowActions } from '@/components/RowActions';
import { ConfirmModal } from '@/components/ConfirmModal';
import { Modal } from '@/components/Modal';
import { useToast } from '@/components/Toast';
import { formatFileSize } from '@/utils/formatters';
import type { Sauvegarde } from '@/types';
import { usePermissions } from '@/hooks/usePermissions';
import { sauvegardesApi } from '../api/sauvegardes';
import { formatDateLongue } from '@/features/statistiques/utils/exportStatistiques';

/** 2026-01-16T09:30:00 → 16 Janvier 2026, 09:30 */
function formatDateHeure(value: string): string {
  if (!value) return '—';
  const iso = String(value).slice(0, 19).split('T');
  const date = iso[0] ?? '';
  const heure = (iso[1] ?? '').slice(0, 5);
  const lisible = formatDateLongue(date);
  return heure ? `${lisible}, ${heure}` : lisible;
}

export function SauvegardesPage() {
  const { hasPermission } = usePermissions();
  const { showToast } = useToast();

  const canView = hasPermission('sauvegarde.view');
  const canCreate = hasPermission('sauvegarde.create');
  const canRestore = hasPermission('sauvegarde.restore');
  const canImport = hasPermission('sauvegarde.import');
  const canDelete = hasPermission('sauvegarde.delete');

  const [search, setSearch] = useState('');
  const [data, setData] = useState<Sauvegarde[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const [createConfirm, setCreateConfirm] = useState(false);
  const [restoreItem, setRestoreItem] = useState<Sauvegarde | null>(null);
  const [deleteItem, setDeleteItem] = useState<Sauvegarde | null>(null);
  const [importOpen, setImportOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importFile, setImportFile] = useState<File | null>(null);

  const charger = useCallback(async () => {
    if (!canView) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setData(await sauvegardesApi.getAll());
    } catch (error) {
      console.error('Erreur lors du chargement des sauvegardes:', error);
      const axiosError = error as {
        response?: { status?: number; data?: { message?: string } };
      };
      if (axiosError.response?.status === 403) {
        showToast(
          "Accès refusé : vous n'avez pas la permission de voir les sauvegardes.",
          'error',
        );
      } else {
        showToast(
          axiosError.response?.data?.message ?? 'Impossible de charger les sauvegardes.',
          'error',
        );
      }
    } finally {
      setLoading(false);
    }
  }, [canView, showToast]);

  useEffect(() => {
    void charger();
  }, [charger]);

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const terme = search.trim().toLowerCase();
    return data.filter(
      (sauvegarde) =>
        sauvegarde.nom_fichier.toLowerCase().includes(terme) ||
        sauvegarde.chemin.toLowerCase().includes(terme),
    );
  }, [data, search]);

  const statistiques = useMemo(() => {
    const tailles = data.map((sauvegarde) => Number(sauvegarde.taille ?? 0));
    const total = tailles.reduce((somme, taille) => somme + taille, 0);
    return {
      nombre: data.length,
      tailleTotale: total,
      plusRecente: data[0] ?? null,
      moyenne: data.length > 0 ? Math.round(total / data.length) : 0,
    };
  }, [data]);

  const columns: Column<Sauvegarde>[] = [
    { key: 'id', label: '#', className: 'align-center' },
    { key: 'nom_fichier', label: 'Fichier' },
    {
      key: 'taille',
      label: 'Taille',
      className: 'align-right',
      render: (row) => formatFileSize(row.taille),
    },
    {
      key: 'date_creation',
      label: 'Date de création',
      className: 'align-center',
      render: (row) => formatDateHeure(row.date_creation),
    },
  ];

  /* ── Création ─────────────────────────────────────────────────────────── */

  const confirmCreate = async () => {
    setCreateConfirm(false);
    try {
      setBusy(true);
      const cree = await sauvegardesApi.create();
      showToast(`Sauvegarde « ${cree.nom_fichier} » créée avec succès.`, 'success');
      await charger();
    } catch (error) {
      console.error('Erreur création sauvegarde:', error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      showToast(
        axiosError.response?.data?.message ?? "Impossible de créer la sauvegarde.",
        'error',
      );
    } finally {
      setBusy(false);
    }
  };

  /* ── Restauration ─────────────────────────────────────────────────────── */

  const confirmRestore = async () => {
    if (!restoreItem) return;
    try {
      setBusy(true);
      const message = await sauvegardesApi.restaurer(restoreItem.nom_fichier);
      showToast(message ?? 'Sauvegarde restaurée avec succès.', 'success');
    } catch (error) {
      console.error('Erreur restauration sauvegarde:', error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      showToast(
        axiosError.response?.data?.message ?? 'La restauration a échoué.',
        'error',
      );
    } finally {
      setBusy(false);
      setRestoreItem(null);
    }
  };

  /* ── Suppression ──────────────────────────────────────────────────────── */

  const confirmDelete = async () => {
    if (!deleteItem) return;
    try {
      setBusy(true);
      await sauvegardesApi.remove(deleteItem.nom_fichier);
      setData((precedent) =>
        precedent.filter((item) => item.nom_fichier !== deleteItem.nom_fichier),
      );
      showToast('Sauvegarde supprimée.', 'success');
    } catch (error) {
      console.error('Erreur suppression sauvegarde:', error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      showToast(
        axiosError.response?.data?.message ?? 'Impossible de supprimer la sauvegarde.',
        'error',
      );
    } finally {
      setBusy(false);
      setDeleteItem(null);
    }
  };

  /* ── Import ───────────────────────────────────────────────────────────── */

  const confirmImport = async () => {
    if (!importFile) {
      showToast('Veuillez sélectionner un fichier de sauvegarde.', 'error');
      return;
    }
    try {
      setBusy(true);
      const importee = await sauvegardesApi.importer(importFile);
      showToast(`Sauvegarde « ${importee.nom_fichier} » importée avec succès.`, 'success');
      setImportOpen(false);
      setImportFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      await charger();
    } catch (error) {
      console.error('Erreur import sauvegarde:', error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      showToast(
        axiosError.response?.data?.message ?? "Impossible d'importer la sauvegarde.",
        'error',
      );
    } finally {
      setBusy(false);
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
        title="Sauvegardes"
        subtitle={`${statistiques.nombre} sauvegarde(s) — ${formatFileSize(statistiques.tailleTotale)}`}
      />

      <PageToolbar
        search={search}
        onSearch={setSearch}
        placeholder="Rechercher une sauvegarde..."
        actions={
          <>
            <button
              type="button"
              className="btn-ghost btn-sm"
              onClick={() => void charger()}
              disabled={loading || busy}
              title="Recharger la liste"
            >
              <RefreshCw size={15} /> Actualiser
            </button>

            {canImport && (
              <button
                type="button"
                className="btn-action-red"
                onClick={() => setImportOpen(true)}
                disabled={busy}
              >
                <Upload size={15} /> Importer
              </button>
            )}

            {canCreate && (
              <button
                type="button"
                className="btn-primary"
                onClick={() => setCreateConfirm(true)}
                disabled={busy}
              >
                <Plus size={15} /> Créer une sauvegarde
              </button>
            )}
          </>
        }
      />

      <SectionCard
        title="Liste des sauvegardes"
        subtitle="Fichiers de sauvegarde PostgreSQL stockés sur le serveur."
      >
        <div className={`rapport-kpis ${loading ? 'is-loading' : ''}`}>
          <div className="rapport-kpi rapport-kpi-default">
            <span className="rapport-kpi-label">Nombre de sauvegardes</span>
            <span className="rapport-kpi-value">{statistiques.nombre}</span>
          </div>
          <div className="rapport-kpi rapport-kpi-success">
            <span className="rapport-kpi-label">Espace utilisé</span>
            <span className="rapport-kpi-value">{formatFileSize(statistiques.tailleTotale)}</span>
          </div>
          <div className="rapport-kpi rapport-kpi-default">
            <span className="rapport-kpi-label">Taille moyenne</span>
            <span className="rapport-kpi-value">{formatFileSize(statistiques.moyenne)}</span>
          </div>
          <div className="rapport-kpi rapport-kpi-warning">
            <span className="rapport-kpi-label">Dernière sauvegarde</span>
            <span className="rapport-kpi-value" style={{ fontSize: 14 }}>
              {statistiques.plusRecente
                ? formatDateHeure(statistiques.plusRecente.date_creation)
                : '—'}
            </span>
          </div>
        </div>

        <DataTable
          data={loading ? [] : filtered}
          columns={columns}
          emptyMessage={loading ? 'Chargement des sauvegardes...' : 'Aucune sauvegarde disponible.'}
          actionsHeaderLabel="Actions"
          actions={(row) => (
            <RowActions
              onPrint={canRestore ? () => setRestoreItem(row) : undefined}
              printLabel="Restaurer"
              onDelete={canDelete ? () => setDeleteItem(row) : undefined}
            >
              {canRestore && (
                <button
                  type="button"
                  className="icon-button"
                  onClick={() => setRestoreItem(row)}
                  title="Restaurer"
                  aria-label="Restaurer"
                >
                  <RefreshCw size={14} />
                </button>
              )}
            </RowActions>
          )}
        />
      </SectionCard>

      {/* Import */}
      <Modal open={importOpen} onClose={() => setImportOpen(false)} title="Importer une sauvegarde" size="md">
        <div className="sauvegarde-import">
          <p className="sauvegarde-import-intro">
            Sélectionnez un fichier de sauvegarde <strong>.dump</strong>, <strong>.sql</strong>,{' '}
            <strong>.gz</strong> ou <strong>.zip</strong> (200 Mo maximum). Il sera copié dans le
            dossier de sauvegardes de la pharmacie.
          </p>

          <label className="sauvegarde-import-drop" htmlFor="sauvegarde-fichier">
            <HardDriveDownload size={28} />
            <strong>{importFile ? importFile.name : 'Choisir un fichier'}</strong>
            <span>
              {importFile
                ? formatFileSize(importFile.size)
                : 'Cliquez pour parcourir vos fichiers'}
            </span>
            <input
              ref={fileInputRef}
              id="sauvegarde-fichier"
              type="file"
              accept=".dump,.sql,.gz,.zip"
              onChange={(event) => setImportFile(event.target.files?.[0] ?? null)}
            />
          </label>

          <div className="form-actions">
            <button type="button" className="btn-ghost" onClick={() => setImportOpen(false)}>
              Annuler
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={confirmImport}
              disabled={busy || !importFile}
            >
              {busy ? 'Import...' : 'Importer'}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={createConfirm}
        title="Créer une sauvegarde"
        message="Confirmer la création d'une nouvelle sauvegarde ? L'opération peut prendre quelques secondes."
        confirmLabel="Créer"
        cancelLabel="Annuler"
        onConfirm={confirmCreate}
        onCancel={() => setCreateConfirm(false)}
      />

      <ConfirmModal
        open={!!restoreItem}
        title="Restaurer la sauvegarde"
        message={`Confirmer la restauration de « ${restoreItem?.nom_fichier ?? ''} » ? Cette opération remplacera les données actuelles de la base.`}
        confirmLabel="Restaurer"
        cancelLabel="Annuler"
        onConfirm={confirmRestore}
        onCancel={() => setRestoreItem(null)}
      />

      <ConfirmModal
        open={!!deleteItem}
        title="Supprimer la sauvegarde"
        message={`Supprimer définitivement « ${deleteItem?.nom_fichier ?? ''} » ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteItem(null)}
      />

      {/* Info-bulle de sécurité */}
      <div className="sauvegarde-info">
        <Database size={16} />
        <span>
          Sauvegarde réalisée via <code>pg_dump</code>. La restauration utilise <code>pg_restore</code>{' '}
          et <strong>remplace l'intégralité</strong> des données de la base.
        </span>
      </div>
    </div>
  );
}
