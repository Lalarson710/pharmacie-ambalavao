import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import type { Client } from '@/types';

interface ClientsAssociesTabProps {
  data: Client[];
  search: string;
}

export function ClientsAssociesTab({ data, search }: ClientsAssociesTabProps) {
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
        data={filteredClients}
        columns={columns}
        emptyMessage="Aucun client."
      />
    </SectionCard>
  );
}
