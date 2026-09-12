import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { fournisseurs } from '@/data/mockData';
import type { Fournisseur } from '@/types';

export function FournisseursPage() {
  const columns: Column<Fournisseur>[] = [
    { key: 'id', label: '#' },
    { key: 'nom', label: 'Nom' },
    { key: 'telephone', label: 'Téléphone' },
    { key: 'email', label: 'Email' },
    { key: 'adresse', label: 'Adresse' },
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

  return (
    <div className="page-container">
      <PageHeader
        title="Fournisseurs"
        subtitle={`${fournisseurs.length} fournisseur(s) enregistré(s)`}
      />

      <SectionCard title="Liste des fournisseurs">
        <DataTable
          data={fournisseurs}
          columns={columns}
          emptyMessage="Aucun fournisseur enregistré."
        />
      </SectionCard>
    </div>
  );
}
