import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { RowActions } from '@/components/RowActions';
import { formatDate } from '@/utils/formatters';
import type { Personnel } from '@/types';

interface PersonnelTabProps {
  personnelData: Personnel[];
  search: string;
  onOpenEdit: (item: Personnel) => void;
  onDelete: (item: Personnel) => void;
  loading?: boolean;          // ← AJOUT
}

export function PersonnelTab({ personnelData, search, onOpenEdit, onDelete, loading = false }: PersonnelTabProps) {
  const filteredPersonnel = search
    ? personnelData.filter((row) =>
        [
          row.id,
          row.nom,
          row.prenom,
          row.telephone ?? '',
          row.email ?? '',
          row.adresse ?? '',
          row.fonction,
          row.date_embauche ?? '',
        ]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(search.toLowerCase()))
      )
    : personnelData;

  const personnelColumns: Column<Personnel>[] = [
    { key: 'id', label: '#' },
    { key: 'nom', label: 'Nom' },
    { key: 'prenom', label: 'Prénom' },
    { key: 'telephone', label: 'Téléphone' },
    { key: 'email', label: 'Email' },
    { key: 'adresse', label: 'Adresse' },
    { key: 'fonction', label: 'Fonction' },
    {
      key: 'date_embauche',
      label: 'Date d’embauche',
      render: (row) => (row.date_embauche ? formatDate(row.date_embauche) : '—'),
    },
    {
      key: 'actif',
      label: 'Actif',
      render: (row) => (
        <span className={`badge ${row.actif ? 'badge-active' : 'badge-inactive'}`}>
          {row.actif ? 'Oui' : 'Non'}
        </span>
      ),
    },
  ];

  // ← AJOUT : état chargement
  if (loading) {
    return (
      <SectionCard title="Liste du personnel" subtitle="Chargement...">
        <div className="table-loading">
          <div className="loading-spinner" />
          <p>Chargement du personnel...</p>
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard title="Liste du personnel" subtitle={`${personnelData.length} membre(s)`}>
      <DataTable
        data={filteredPersonnel}
        columns={personnelColumns}
        emptyMessage="Aucun membre du personnel."
        actionsHeaderLabel="Actions"
        actions={(row) => (
          <RowActions
            onEdit={() => onOpenEdit(row)}
            onDelete={() => onDelete(row)}
          />
        )}
      />
    </SectionCard>
  );
}
