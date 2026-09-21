import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { PageTabs } from '@/components/PageTabs';
import { PageToolbar } from '@/components/PageToolbar';
import { ConfirmModal } from '@/components/ConfirmModal';
import { useToast } from '@/components/Toast';
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
import { produitsApi } from '../api/produits';
import { categoriesApi } from '../api/categories';
import { unitesApi } from '../api/unites';
import { lotsApi } from '../api/lots';

type CatalogueDeleteTarget = {
  kind: CatalogueModalState['kind'];
  item: Produit | Categorie | Unite | Lot;
};

const tabKind: Record<string, CatalogueModalState['kind']> = {
  produits: 'produit',
  lots: 'lot',
  categories: 'categories',
  unites: 'unite',
};

const addLabels: Record<CatalogueModalState['kind'], string> = {
  produit: 'Ajouter un produit',
  lot: 'Ajouter un lot',
  categories: 'Ajouter une catégorie',
  unite: 'Ajouter une unité',
};

export function ProduitsPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('unites');
  const [products, setProducts] = useState<Produit[]>([]);
  const [categoriesData, setCategoriesData] = useState<Categorie[]>([]);
  const [unitsData, setUnitsData] = useState<Unite[]>([]);
  const [lotsData, setLotsData] = useState<Lot[]>([]);
  const [loading, setLoading] = useState({
    produits: true,
    categories: true,
    unites: true,
    lots: true,
  });
  const [modal, setModal] = useState<CatalogueModalState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CatalogueDeleteTarget | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await produitsApi.getAll();
        setProducts(data);
      } catch (error) {
        console.error(' chargement produits:', error);
        showToast('Impossible de charger les produits.', 'error');
      } finally {
        setLoading((prev) => ({ ...prev, produits: false }));
      }
    };
    load();
  }, [showToast]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await categoriesApi.getAll();
        setCategoriesData(data);
      } catch (error) {
        console.error(' chargement catégories:', error);
        showToast('Impossible de charger les catégories.', 'error');
      } finally {
        setLoading((prev) => ({ ...prev, categories: false }));
      }
    };
    load();
  }, [showToast]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await unitesApi.getAll();
        setUnitsData(data);
      } catch (error) {
        console.error(' chargement unités:', error);
        showToast('Impossible de charger les unités.', 'error');
      } finally {
        setLoading((prev) => ({ ...prev, unites: false }));
      }
    };
    load();
  }, [showToast]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await lotsApi.getAll();
        setLotsData(data);
      } catch (error) {
        console.error(' chargement lots:', error);
        showToast('Impossible de charger les lots.', 'error');
      } finally {
        setLoading((prev) => ({ ...prev, lots: false }));
      }
    };
    load();
  }, [showToast]);

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

    const { kind, item } = deleteTarget;

    if (kind === 'produit') {
      setProducts((prev) => prev.filter((row) => row.id !== item.id));
    } else if (kind === 'categories') {
      setCategoriesData((prev) => prev.filter((row) => row.id !== item.id));
    } else if (kind === 'unite') {
      setUnitsData((prev) => prev.filter((row) => row.id !== item.id));
    } else {
      setLotsData((prev) => prev.filter((row) => row.id !== item.id));
    }

    setDeleteTarget(null);

    (async () => {
      try {
        if (kind === 'produit') {
          await produitsApi.delete(item.id);
        } else if (kind === 'categories') {
          await categoriesApi.delete(item.id);
        } else if (kind === 'unite') {
          await unitesApi.delete(item.id);
        } else {
          await lotsApi.delete(item.id);
        }
        const label = kind === 'produit' ? 'Produit' : kind === 'categories' ? 'Catégorie' : kind === 'unite' ? 'Unité' : 'Lot';
        showToast(`${label} supprimé avec succès`, 'success');
      } catch (error: unknown) {
        console.error(' suppression:', error);
        const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
        const specificMessage = axiosError.response?.data?.message;

        if (specificMessage) {
          showToast(specificMessage, 'error');
        } else {
          showToast('Impossible de supprimer cet élément.', 'error');
        }

        if (kind === 'produit') {
          setProducts((prev) => [...prev, item as Produit]);
        } else if (kind === 'categories') {
          setCategoriesData((prev) => [...prev, item as Categorie]);
        } else if (kind === 'unite') {
          setUnitsData((prev) => [...prev, item as Unite]);
        } else {
          setLotsData((prev) => [...prev, item as Lot]);
        }
      }
    })();
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
          loading={loading.produits}
          onOpenEdit={(item) => openEdit('produit', item)}
          onDelete={(item) => setDeleteTarget({ kind: 'produit', item })}
        />
      )}

      {activeTab === 'lots' && (
        <LotsTab
          data={lotsData}
          search={search}
          loading={loading.lots}
          onOpenEdit={(item) => openEdit('lot', item)}
          onDelete={(item) => setDeleteTarget({ kind: 'lot', item })}
        />
      )}

      {activeTab === 'categories' && (
        <CategoriesTab
          data={categoriesData}
          search={search}
          loading={loading.categories}
          onOpenEdit={(item) => openEdit('categories', item)}
          onDelete={(item) => setDeleteTarget({ kind: 'categories', item })}
        />
      )}

      {activeTab === 'unites' && (
        <UnitesTab
          data={unitsData}
          search={search}
          loading={loading.unites}
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
