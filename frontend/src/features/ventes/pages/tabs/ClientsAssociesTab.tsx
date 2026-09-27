import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import type { Client } from '@/types';

interface ClientsAssociesTabProps {
  data: Client[];
  search: string;
  loading?: boolean;
}

export function ClientsAssociesTab({ data, search, loading }: ClientsAssociesTabProps) {
  const filteredClients = search
    ? data.filter((row) =>
        [row.nom, row.telephone ?? '', row.email ?? '', row.adresse ?? '']
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(search.toLowerCase()))
      )
    : data;

  const columns: Column<Client>[] = [
    { key: 'id', label: '#' },
    { key: 'nom', label: 'Nom' },
    { key: 'telephone', label: 'Téléphone' },
    { key: 'email', label: 'Email' },
    { key: 'adresse', label: 'Adresse' },
  ];

  return (
    <SectionCard title="Clients associés" subtitle={`${data.length} client(s)`}>
      <DataTable
        data={loading ? [] : filteredClients}
        columns={columns}
        emptyMessage={loading ? 'Chargement des clients...' : 'Aucun client associé à une vente.'}
      />
    </SectionCard>
  );
}
