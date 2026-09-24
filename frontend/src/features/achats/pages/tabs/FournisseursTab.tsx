import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { RowActions } from '@/components/RowActions';
import type { Fournisseur } from '@/types';

interface FournisseursTabProps {
  data: Fournisseur[];
  search: string;
  loading?: boolean;
  onOpenEdit: (item: Fournisseur) => void;
  onDelete: (item: Fournisseur) => void;
}

export function FournisseursTab({
  data,
  search,
  loading,
  onOpenEdit,
  onDelete,
}: FournisseursTabProps) {
  const filteredFournisseurs = search
    ? data.filter((row) =>
        [row.nom, row.telephone ?? '', row.email ?? '', row.adresse ?? '']
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(search.toLowerCase()))
      )
    : data;

  const columns: Column<Fournisseur>[] = [
    { key: 'id', label: '#' },
    { key: 'nom', label: 'Nom' },
    { key: 'telephone', label: 'Téléphone' },
    { key: 'email', label: 'Email' },
    { key: 'adresse', label: 'Adresse' },
  ];

    return (
    <SectionCard title="Fournisseurs associés" subtitle={`${data.length} fournisseur(s)`}>
      {loading ? (
        <div className="empty-state">Chargement des fournisseurs...</div>
      ) : (
        <DataTable
          data={filteredFournisseurs}
          columns={columns}
          emptyMessage="Aucun fournisseur."
        />
      )}
    </SectionCard>
  );
}
