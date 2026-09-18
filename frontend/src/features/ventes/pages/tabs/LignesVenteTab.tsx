import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { formatCurrency } from '@/utils/formatters';
import type { VenteLigne } from '@/types';

interface LignesVenteTabProps {
  data: VenteLigne[];
  search: string;
}

export function LignesVenteTab({ data, search }: LignesVenteTabProps) {
  const filteredLignes = search
    ? data.filter((row) =>
        [row.produit?.nom, row.lot?.numero_lot, String(row.quantite)]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(search.toLowerCase()))
      )
    : data;

  const columns: Column<VenteLigne>[] = [
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
    <SectionCard title="Lignes de vente" subtitle={`${data.length} ligne(s)`}>
      <DataTable
        data={filteredLignes}
        columns={columns}
        emptyMessage="Aucune ligne de vente."
      />
    </SectionCard>
  );
}
