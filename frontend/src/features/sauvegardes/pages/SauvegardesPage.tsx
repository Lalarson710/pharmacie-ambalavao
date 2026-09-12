import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { sauvegardes } from '@/data/mockData';
import { formatFileSize, formatDateTime } from '@/utils/formatters';
import type { Sauvegarde } from '@/types';

export function SauvegardesPage() {
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

  return (
    <div className="page-container">
      <PageHeader
        title="Sauvegardes"
        subtitle={`${sauvegardes.length} sauvegarde(s) disponible(s)`}
      />

      <SectionCard title="Liste des sauvegardes">
        <DataTable
          data={sauvegardes}
          columns={columns}
          emptyMessage="Aucune sauvegarde disponible."
        />
      </SectionCard>
    </div>
  );
}
