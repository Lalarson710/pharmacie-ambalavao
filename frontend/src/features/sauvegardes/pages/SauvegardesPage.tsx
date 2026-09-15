import { useState } from 'react';
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

export function SauvegardesPage() {
  const [search, setSearch] = useState('');
  const [restoreItem, setRestoreItem] = useState<Sauvegarde | null>(null);
  const [createConfirm, setCreateConfirm] = useState(false);

  const filtered = search
    ? sauvegardes.filter(
        (r) =>
          r.nom_fichier.toLowerCase().includes(search.toLowerCase()) ||
          r.chemin.toLowerCase().includes(search.toLowerCase())
      )
    : sauvegardes;

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

  return (
    <div className="page-container">
      <PageHeader
        title="Sauvegardes"
        subtitle={`${sauvegardes.length} sauvegarde(s) disponible(s)`}
      />

      <PageToolbar
        search={search}
        onSearch={setSearch}
        placeholder="Rechercher une sauvegarde..."
        actions={
          <button
            type="button"
            className="btn-primary"
            onClick={handleSauvegarder}
          >
            <Plus size={15} /> Créer une sauvegarde
          </button>
        }
      />

      <SectionCard title="Liste des sauvegardes">
        <DataTable
          data={filtered}
          columns={columns}
          emptyMessage="Aucune sauvegarde disponible."
          actionsHeaderLabel="Actions"
          actions={(row) => (
            <RowActions>
              <button
                type="button"
                className="btn-ghost btn-sm"
                onClick={() => handleRestore(row)}
                title="Restaurer"
                aria-label="Restaurer"
              >
                <RefreshCw size={14} /> Restaurer
              </button>
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
