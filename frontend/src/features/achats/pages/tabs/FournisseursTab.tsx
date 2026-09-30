import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import type { Fournisseur } from '@/types';

interface FournisseursTabProps {
  data: Fournisseur[];
  search: string;
  loading?: boolean;
  onOpenEdit?: (item: Fournisseur) => void;
  onDelete?: (item: Fournisseur) => void;
}

export function FournisseursTab({ data, search, loading }: FournisseursTabProps) {
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
      <DataTable
        data={loading ? [] : filteredFournisseurs}
        columns={columns}
        emptyMessage={loading ? 'Chargement des fournisseurs...' : 'Aucun fournisseur.'}
      />
    </SectionCard>
  );
}
