import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import type { Fournisseur } from '@/types';

interface FournisseursTabProps {
  data: Fournisseur[];
  search: string;
}

export function FournisseursTab({ data, search }: FournisseursTabProps) {
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
  ];

  return (
    <SectionCard title="Fournisseurs associés" subtitle={`${data.length} fournisseur(s)`}>
      <DataTable
        data={filteredFournisseurs}
        columns={columns}
        emptyMessage="Aucun fournisseur."
      />
    </SectionCard>
  );
}
