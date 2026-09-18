import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { RowActions } from '@/components/RowActions';
import { formatCurrency, formatDate } from '@/utils/formatters';
import type { AchatLigne } from '@/types';

interface LignesAchatTabProps {
  data: AchatLigne[];
  search: string;
  onOpenEdit: (item: AchatLigne) => void;
  onDelete: (item: AchatLigne) => void;
}

export function LignesAchatTab({ data, search, onOpenEdit, onDelete }: LignesAchatTabProps) {
  const filteredLignes = search
    ? data.filter((row) =>
        [row.produit?.nom, row.numero_lot, row.date_peremption ?? '', String(row.quantite)]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(search.toLowerCase()))
      )
    : data;

  const columns: Column<AchatLigne>[] = [
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
    <SectionCard title="Lignes d’achat" subtitle={`${data.length} ligne(s)`}>
      <DataTable
        data={filteredLignes}
        columns={columns}
        emptyMessage="Aucune ligne d’achat."
        actionsHeaderLabel="Actions"
        actions={(row) => (
          <RowActions
            onEdit={() => onOpenEdit(row)}
            onDelete={() => onDelete(row)}
          />
        )}
      />
    </SectionCard>
  );
}
