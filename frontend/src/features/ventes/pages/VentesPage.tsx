import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { ventes, ventesLignes, clients } from '@/data/mockData';
import { formatCurrency, formatDate, getStatutBadgeClass, formatStatut } from '@/utils/formatters';
import type { Vente, VenteLigne } from '@/types';

export function VentesPage() {
  const columns: Column<Vente>[] = [
    { key: 'id', label: '#' },
    { key: 'numero', label: 'N°' },
    {
      key: 'date_vente',
      label: 'Date',
      render: (row) => formatDate(row.date_vente),
    },
    {
      key: 'client',
      label: 'Client',
      render: (row) => row.client?.nom ?? '—',
    },
    {
      key: 'montant_total',
      label: 'Montant',
      render: (row) => formatCurrency(row.montant_total),
    },
    {
      key: 'statut',
      label: 'Statut',
      render: (row) => (
        <span className={`badge ${getStatutBadgeClass(row.statut)}`}>
          {formatStatut(row.statut)}
        </span>
      ),
    },
    { key: 'observation', label: 'Observation' },
  ];

  const ligneColumns: Column<VenteLigne>[] = [
    { key: 'id', label: '#' },
    {
      key: 'produit',
      label: 'Produit',
      render: (row) => row.produit?.nom ?? '—',
    },
    {
      key: 'lot',
      label: 'Lot',
      render: (row) => row.lot?.numero_lot ?? '—',
    },
    { key: 'quantite', label: 'Qté' },
    {
      key: 'prix_unitaire',
      label: 'Prix unitaire',
      render: (row) => formatCurrency(row.prix_unitaire),
    },
    {
      key: 'montant',
      label: 'Montant',
      render: (row) => formatCurrency(row.montant),
    },
  ];

  return (
    <div className="page-container">
      <PageHeader
        title="Ventes"
        subtitle={`${ventes.length} vente(s) enregistrée(s)`}
      />

      <SectionCard title="Liste des ventes">
        <DataTable
          data={ventes}
          columns={columns}
          emptyMessage="Aucune vente enregistrée."
        />
      </SectionCard>

      <SectionCard title="Lignes de vente" subtitle={`${ventesLignes.length} ligne(s)`}>
        <DataTable
          data={ventesLignes}
          columns={ligneColumns}
          emptyMessage="Aucune ligne de vente."
        />
      </SectionCard>

      <SectionCard title="Clients associés" subtitle={`${clients.length} client(s)`}>
        <DataTable
          data={clients}
          columns={[
            { key: 'id', label: '#' },
            { key: 'nom', label: 'Nom' },
            { key: 'telephone', label: 'Téléphone' },
            { key: 'email', label: 'Email' },
          ]}
          emptyMessage="Aucun client."
        />
      </SectionCard>
    </div>
  );
}
