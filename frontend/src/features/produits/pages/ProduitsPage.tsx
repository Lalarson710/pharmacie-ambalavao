import { useState } from 'react';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { PageTabs } from '@/components/PageTabs';
import { PageToolbar } from '@/components/PageToolbar';
import { ConfirmModal } from '@/components/ConfirmModal';
import { categories, lots, produits, unites } from '@/data/mockData';
import type { Categorie, Lot, Produit, Unite } from '@/types';
import {
  CatalogueModal,
  type CatalogueModalState,
} from './tabs/CatalogueModal';
import { CategoriesTab } from './tabs/CategoriesTab';
import { LotsTab } from './tabs/LotsTab';
import { ProduitsTab } from './tabs/ProduitsTab';
import { produitsTabs } from './tabs/tabsConfig';
import { UnitesTab } from './tabs/UnitesTab';

type CatalogueDeleteTarget = {
  kind: CatalogueModalState['kind'];
  item: Produit | Categorie | Unite | Lot;
};

const tabKind: Record<string, CatalogueModalState['kind']> = {
  produits: 'produit',
  lots: 'lot',
  categories: 'categorie',
  unites: 'unite',
};

const addLabels: Record<CatalogueModalState['kind'], string> = {
  produit: 'Ajouter un produit',
  lot: 'Ajouter un lot',
  categorie: 'Ajouter une catégorie',
  unite: 'Ajouter une unité',
};

export function ProduitsPage() {
  const [activeTab, setActiveTab] = useState('produits');
  const [products, setProducts] = useState<Produit[]>(produits);
  const [categoriesData, setCategoriesData] = useState<Categorie[]>(categories);
  const [unitsData, setUnitsData] = useState<Unite[]>(unites);
  const [lotsData, setLotsData] = useState<Lot[]>(lots);
  const [modal, setModal] = useState<CatalogueModalState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CatalogueDeleteTarget | null>(null);
  const [search, setSearch] = useState('');

  const openAdd = () => {
    const kind = tabKind[activeTab] ?? 'produit';
    setModal({ kind, item: null });
  };

  const openEdit = (
    kind: CatalogueModalState['kind'],
    item: Produit | Categorie | Unite | Lot
  ) => {
    setModal({ kind, item });
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.kind === 'produit') {
      setProducts((prev) =>
        prev.filter((row) => row.id !== deleteTarget.item.id)
      );
    } else if (deleteTarget.kind === 'categorie') {
      setCategoriesData((prev) =>
        prev.filter((row) => row.id !== deleteTarget.item.id)
      );
    } else if (deleteTarget.kind === 'unite') {
      setUnitsData((prev) =>
        prev.filter((row) => row.id !== deleteTarget.item.id)
      );
    } else {
      setLotsData((prev) =>
        prev.filter((row) => row.id !== deleteTarget.item.id)
      );
    }

    setDeleteTarget(null);
  };

  const currentKind = tabKind[activeTab] ?? 'produit';
  const currentLabel = addLabels[currentKind].replace('Ajouter ', '');

  return (
    <div className="page-container">
      <PageHeader
        title="Produits"
        subtitle={`${products.length} produit(s) enregistré(s)`}
      />

      <PageToolbar
        search={search}
        onSearch={setSearch}
        placeholder="Rechercher dans l'onglet..."
        actions={
          <button type="button" className="btn-primary" onClick={openAdd}>
            <Plus size={15} /> {currentLabel}
          </button>
        }
      />

      <PageTabs
        tabs={produitsTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'produits' && (
        <ProduitsTab
          data={products}
          search={search}
          onOpenEdit={(item) => openEdit('produit', item)}
          onDelete={(item) => setDeleteTarget({ kind: 'produit', item })}
        />
      )}

      {activeTab === 'lots' && (
        <LotsTab
          data={lotsData}
          search={search}
          onOpenEdit={(item) => openEdit('lot', item)}
          onDelete={(item) => setDeleteTarget({ kind: 'lot', item })}
        />
      )}

      {activeTab === 'categories' && (
        <CategoriesTab
          data={categoriesData}
          search={search}
          onOpenEdit={(item) => openEdit('categorie', item)}
          onDelete={(item) => setDeleteTarget({ kind: 'categorie', item })}
        />
      )}

      {activeTab === 'unites' && (
        <UnitesTab
          data={unitsData}
          search={search}
          onOpenEdit={(item) => openEdit('unite', item)}
          onDelete={(item) => setDeleteTarget({ kind: 'unite', item })}
        />
      )}

      <CatalogueModal
        modal={modal}
        setModal={setModal}
        products={products}
        setProducts={setProducts}
        categoriesData={categoriesData}
        setCategoriesData={setCategoriesData}
        unitsData={unitsData}
        setUnitsData={setUnitsData}
        lotsData={lotsData}
        setLotsData={setLotsData}
      />

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Supprimer l'élément"
        message={`Confirmer la suppression de « ${
          deleteTarget?.item && 'nom' in deleteTarget.item
            ? deleteTarget.item.nom
            : (deleteTarget?.item as Lot)?.numero_lot ?? ''
        } » ?`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
