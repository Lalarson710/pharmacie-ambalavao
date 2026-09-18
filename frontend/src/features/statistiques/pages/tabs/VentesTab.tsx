import { useMemo, useState } from 'react';
import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import type { Vente } from '@/types';
import { formatDate, formatStatut, formatCurrency } from '@/utils/formatters';
import { PeriodFilter } from './PeriodFilter';

interface VentesTabProps {
  ventesPeriode: Vente[];
  dateDebut: string;
  dateFin: string;
  onDateDebutChange: (value: string) => void;
  onDateFinChange: (value: string) => void;
  onRefresh: () => void;
}

export function VentesTab({
  ventesPeriode,
  dateDebut,
  dateFin,
  onDateDebutChange,
  onDateFinChange,
  onRefresh,
}: VentesTabProps) {
  const [search, setSearch] = useState('');
  const filteredVentes = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) return ventesPeriode;

    return ventesPeriode.filter(
      (vente) =>
        vente.numero.toLowerCase().includes(normalizedSearch) ||
        (vente.client?.nom ?? '').toLowerCase().includes(normalizedSearch),
    );
  }, [search, ventesPeriode]);

  const columns: Column<Vente>[] = [
    { key: 'id', label: '#' },
    { key: 'numero', label: 'N° Vente' },
    { key: 'date_vente', label: 'Date', render: (row) => formatDate(row.date_vente) },
    { key: 'client', label: 'Client', render: (row) => row.client?.nom ?? '—' },
    {
      key: 'montant_total',
      label: 'Montant',
      render: (row) => formatCurrency(row.montant_total),
    },
    {
      key: 'statut',
      label: 'Statut',
      render: (row) => formatStatut(row.statut),
    },
  ];

  return (
    <SectionCard title="Ventes" subtitle={`${filteredVentes.length} vente(s)`}>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '24px',
          marginBottom: '20px',
          flexWrap: 'nowrap',
        }}
      >
        <PeriodFilter
          dateDebut={dateDebut}
          dateFin={dateFin}
          onDateDebutChange={onDateDebutChange}
          onDateFinChange={onDateFinChange}
          onRefresh={onRefresh}
        />

        <div className="form-field">
          <label htmlFor="search-vente">Recherche</label>
          <input
            id="search-vente"
            type="text"
            className="inline-input"
            placeholder="N° vente, client..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            style={{ width: '220px', height: '38px' }}
          />
        </div>
      </div>

      <DataTable
        data={filteredVentes}
        columns={columns}
        emptyMessage="Aucune donnée disponible pour cette période."
      />
    </SectionCard>
  );
}
