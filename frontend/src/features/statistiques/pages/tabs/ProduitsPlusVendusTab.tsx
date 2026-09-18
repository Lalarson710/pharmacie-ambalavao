import { useMemo, useState } from 'react';
import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import type { ProduitPlusVendu } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { PeriodFilter } from './PeriodFilter';

interface ProduitsPlusVendusTabProps {
  produitsPlusVendus: ProduitPlusVendu[];
  dateDebut: string;
  dateFin: string;
  onDateDebutChange: (value: string) => void;
  onDateFinChange: (value: string) => void;
  onRefresh: () => void;
}

export function ProduitsPlusVendusTab({
  produitsPlusVendus,
  dateDebut,
  dateFin,
  onDateDebutChange,
  onDateFinChange,
  onRefresh,
}: ProduitsPlusVendusTabProps) {
  const [search, setSearch] = useState('');
  const filteredProduits = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const result = normalizedSearch
      ? produitsPlusVendus.filter((produit) =>
          produit.nom.toLowerCase().includes(normalizedSearch),
        )
      : produitsPlusVendus;

    return [...result].sort(
      (a, b) => b.quantite_vendue - a.quantite_vendue,
    );
  }, [produitsPlusVendus, search]);

  const columns: Column<ProduitPlusVendu>[] = [
    { key: 'id', label: '#' },
    { key: 'nom', label: 'Produit' },
    { key: 'quantite_vendue', label: 'Qté vendue' },
    {
      key: 'chiffre_affaires',
      label: 'CA',
      render: (row) => formatCurrency(row.chiffre_affaires),
    },
  ];

  return (
    <SectionCard
      title="Produits les plus vendus"
      subtitle={`${filteredProduits.length} produit(s)`}
    >
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
          <label htmlFor="search-produit">Recherche</label>
          <input
            id="search-produit"
            type="text"
            className="inline-input"
            placeholder="Rechercher un produit..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            style={{ width: '220px', height: '38px' }}
          />
        </div>
      </div>

      <DataTable
        data={filteredProduits}
        columns={columns}
        emptyMessage="Aucune donnée disponible pour cette période."
      />
    </SectionCard>
  );
}
