import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { caisses, mouvementsCaisse } from '@/data/mockData';
import { formatCurrency, formatDateTime, getStatutBadgeClass, formatStatut } from '@/utils/formatters';
import type { Caisse, MouvementCaisse } from '@/types';

export function CaissesPage() {
  const columns: Column<Caisse>[] = [
    { key: 'id', label: '#' },
    {
      key: 'date_ouverture',
      label: 'Ouverture',
      render: (row) => formatDateTime(row.date_ouverture),
    },
    {
      key: 'date_fermeture',
      label: 'Fermeture',
      render: (row) => (row.date_fermeture ? formatDateTime(row.date_fermeture) : '—'),
    },
    {
      key: 'montant_initial',
      label: 'Montant initial',
      render: (row) => formatCurrency(row.montant_initial),
    },
    {
      key: 'montant_final',
      label: 'Montant final',
      render: (row) => (row.montant_final ? formatCurrency(row.montant_final) : '—'),
    },
    {
      key: 'ecart',
      label: 'Écart',
      render: (row) => (row.ecart ? formatCurrency(row.ecart) : '—'),
    },
    {
      key: 'utilisateur',
      label: 'Ouvert par',
      render: (row) => row.utilisateur?.name ?? '—',
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
  ];

  const mouvementColumns: Column<MouvementCaisse>[] = [
    { key: 'id', label: '#' },
    {
      key: 'caisse',
      label: 'Caisse',
      render: (row) => `#${row.caisse_id}`,
    },
    {
      key: 'type',
      label: 'Type',
      render: (row) => (
        <span className={`badge ${row.type === 'entree' ? 'badge-active' : 'badge-inactive'}`}>
          {row.type === 'entree' ? 'Entrée' : 'Sortie'}
        </span>
      ),
    },
    {
      key: 'montant',
      label: 'Montant',
      render: (row) => formatCurrency(row.montant),
    },
    { key: 'motif', label: 'Motif' },
    {
      key: 'reglement',
      label: 'Règlement',
      render: (row) => row.reglement?.reference ?? '—',
    },
    {
      key: 'created_at',
      label: 'Date',
      render: (row) => formatDateTime(row.created_at ?? ''),
    },
  ];

  return (
    <div className="page-container">
      <PageHeader
        title="Caisse"
        subtitle={`${caisses.length} caisse(s) enregistrée(s)`}
      />

      <SectionCard title="Liste des caisses">
        <DataTable
          data={caisses}
          columns={columns}
          emptyMessage="Aucune caisse enregistrée."
        />
      </SectionCard>

      <SectionCard title="Mouvements de caisse" subtitle={`${mouvementsCaisse.length} mouvement(s)`}>
        <DataTable
          data={mouvementsCaisse}
          columns={mouvementColumns}
          emptyMessage="Aucun mouvement de caisse."
        />
      </SectionCard>
    </div>
  );
}
