import { useState, useEffect } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { PageToolbar } from '@/components/PageToolbar';
import { RowActions } from '@/components/RowActions';
import { ConfirmModal } from '@/components/ConfirmModal';
import { sauvegardes } from '@/data/mockData';
import { formatFileSize, formatDateTime } from '@/utils/formatters';
import type { Sauvegarde } from '@/types';
import { usePermissions } from '@/hooks/usePermissions';
import { useToast } from '@/components/Toast';

export function SauvegardesPage() {
  const { hasPermission } = usePermissions();
  const { showToast } = useToast();

  // Check permissions
  const canView = hasPermission('sauvegarde.view');
  const canCreate = hasPermission('sauvegarde.create');
  const canRestore = hasPermission('sauvegarde.restore');
  const canImport = hasPermission('sauvegarde.import');
  const canDelete = hasPermission('sauvegarde.delete');

  const [search, setSearch] = useState('');
  const [restoreItem, setRestoreItem] = useState<Sauvegarde | null>(null);
  const [createConfirm, setCreateConfirm] = useState(false);
  const [data, setData] = useState<Sauvegarde[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data if user has view permission
  useEffect(() => {
    if (!canView) return;
    const loadData = async () => {
      try {
        // TODO: Replace with actual API call
        // const data = await sauvegardesApi.getAll();
        setData(sauvegardes);
      } catch (error) {
        console.error('Erreur lors du chargement des sauvegardes:', error);
        const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
        if (axiosError.response?.status === 403 || axiosError.response?.status === 500) {
          showToast('Accès refusé : vous n\'avez pas la permission de voir les sauvegardes.', 'error');
        }
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [canView, showToast]);

  const filtered = search
    ? data.filter(
        (r) =>
          r.nom_fichier.toLowerCase().includes(search.toLowerCase()) ||
          r.chemin.toLowerCase().includes(search.toLowerCase())
      )
    : data;

  const columns: Column<Sauvegarde>[] = [
    { key: 'id', label: '#' },
    { key: 'nom_fichier', label: 'Fichier' },
    {
      key: 'taille',
      label: 'Taille',
      render: (row) => formatFileSize(row.taille),
    },
    {
      key: 'date_creation',
      label: 'Date de création',
      render: (row) => formatDateTime(row.date_creation),
    },
    { key: 'chemin', label: 'Chemin' },
  ];

  const handleSauvegarder = () => {
    setCreateConfirm(true);
  };

  const confirmCreate = () => {
    alert('Sauvegarde déclenchée.');
    setCreateConfirm(false);
  };

  const handleRestore = (row: Sauvegarde) => {
    setRestoreItem(row);
  };

  const confirmRestore = () => {
    if (restoreItem) {
      alert(`Restauration de ${restoreItem.nom_fichier} effectuée.`);
    }
    setRestoreItem(null);
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
        subtitle={`${data.length} sauvegarde(s) disponible(s)`}
      />

      <PageToolbar
        search={search}
        onSearch={setSearch}
        placeholder="Rechercher une sauvegarde..."
        actions={
          <>
            {canCreate && (
              <button
                type="button"
                className="btn-primary"
                onClick={handleSauvegarder}
              >
                <Plus size={15} /> Créer une sauvegarde
              </button>
            )}
            {canImport && (
              <button type="button" className="btn-secondary" onClick={() => { /* TODO: import */ }}>
                Importer
              </button>
            )}
          </>
        }
      />

      <SectionCard title="Liste des sauvegardes">
        <DataTable
          data={loading ? [] : filtered}
          columns={columns}
          emptyMessage={loading ? 'Chargement des sauvegardes...' : 'Aucune sauvegarde disponible.'}
          actionsHeaderLabel="Actions"
          actions={(row) => (
            <RowActions>
              {canRestore && (
                <button
                  type="button"
                  className="btn-ghost btn-sm"
                  onClick={() => handleRestore(row)}
                  title="Restaurer"
                  aria-label="Restaurer"
                >
                  <RefreshCw size={14} /> Restaurer
                </button>
              )}
              {canDelete && (
                <button
                  type="button"
                  className="btn-ghost btn-sm"
                  onClick={() => { /* TODO: delete */ }}
                  title="Supprimer"
                  aria-label="Supprimer"
                >
                  Supprimer
                </button>
              )}
            </RowActions>
          )}
        />
      </SectionCard>

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
        open={createConfirm}
        title="Créer une sauvegarde"
        message="Confirmer la création d'une nouvelle sauvegarde ? Cette opération peut prendre plusieurs minutes."
        confirmLabel="Créer"
        cancelLabel="Annuler"
        onConfirm={confirmCreate}
        onCancel={() => setCreateConfirm(false)}
      />
    </div>
  );
}
