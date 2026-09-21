import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { RowActions } from '@/components/RowActions';
import { formatCurrency } from '@/utils/formatters';
import type { Produit } from '@/types';

interface ProduitsTabProps {
  data: Produit[];
  search: string;
  loading?: boolean;
  onOpenEdit: (item: Produit) => void;
  onDelete: (item: Produit) => void;
}

export function ProduitsTab({ data, search, loading, onOpenEdit, onDelete }: ProduitsTabProps) {
  const filteredProducts = search
    ? data.filter((row) =>
        [row.nom, row.code_barres, row.description]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(search.toLowerCase()))
      )
    : data;

  const columns: Column<Produit>[] = [
    { key: 'id', label: '#' },
    { key: 'nom', label: 'Produit' },
    { key: 'categories', label: 'Catégorie', render: (row) => row.categorie?.nom ?? '—' },
    { key: 'unite', label: 'Unité', render: (row) => row.unite?.nom ?? '—' },
    { key: 'code_barres', label: 'Code-barres' },
    { key: 'description', label: 'Description' },
    { key: 'prix_achat', label: "Prix d'achat", render: (row) => formatCurrency(row.prix_achat) },
    { key: 'prix_vente', label: 'Prix de vente', render: (row) => formatCurrency(row.prix_vente) },
    { key: 'stock_minimum', label: 'Stock min.' },
    { key: 'actif', label: 'Actif', render: (row) => <span className={`badge ${row.actif ? 'badge-active' : 'badge-inactive'}`}>{row.actif ? 'Oui' : 'Non'}</span> },
  ];

  return (
    <SectionCard title="Liste des produits">
      {loading ? (
        <div className="empty-state">Chargement des produits...</div>
      ) : (
        <DataTable
          data={filteredProducts}
          columns={columns}
          emptyMessage="Aucun produit enregistré."
          actionsHeaderLabel="Actions"
          actions={(row) => (
            <RowActions
              onEdit={() => onOpenEdit(row)}
              onDelete={() => onDelete(row)}
            />
          )}
        />
      )}
    </SectionCard>
  );
}
