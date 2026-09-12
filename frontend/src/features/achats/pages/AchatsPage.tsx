import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { achats, achatsLignes, fournisseurs } from '@/data/mockData';
import { formatCurrency, formatDate, getStatutBadgeClass, formatStatut } from '@/utils/formatters';
import type { Achat, AchatLigne } from '@/types';

export function AchatsPage() {
  const columns: Column<Achat>[] = [
    { key: 'id', label: '#' },
    { key: 'numero', label: 'N°' },
    {
      key: 'date_achat',
      label: 'Date',
      render: (row) => formatDate(row.date_achat),
    },
    {
      key: 'fournisseur',
      label: 'Fournisseur',
      render: (row) => row.fournisseur?.nom ?? '—',
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

  const ligneColumns: Column<AchatLigne>[] = [
    { key: 'id', label: '#' },
    {
      key: 'produit',
      label: 'Produit',
      render: (row) => row.produit?.nom ?? '—',
    },
    { key: 'numero_lot', label: 'N° de lot' },
    {
      key: 'date_peremption',
      label: 'Péremption',
      render: (row) => (row.date_peremption ? formatDate(row.date_peremption) : '—'),
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
        title="Achats"
        subtitle={`${achats.length} achat(s) enregistré(s)`}
      />

      <SectionCard title="Liste des achats">
        <DataTable
          data={achats}
          columns={columns}
          emptyMessage="Aucun achat enregistré."
        />
      </SectionCard>

      <SectionCard title="Lignes d’achat" subtitle={`${achatsLignes.length} ligne(s)`}>
        <DataTable
          data={achatsLignes}
          columns={ligneColumns}
          emptyMessage="Aucune ligne d’achat."
        />
      </SectionCard>

      <SectionCard title="Fournisseurs associés" subtitle={`${fournisseurs.length} fournisseur(s)`}>
        <DataTable
          data={fournisseurs}
          columns={[
            { key: 'id', label: '#' },
            { key: 'nom', label: 'Nom' },
            { key: 'telephone', label: 'Téléphone' },
            { key: 'email', label: 'Email' },
          ]}
          emptyMessage="Aucun fournisseur."
        />
      </SectionCard>
    </div>
  );
}
