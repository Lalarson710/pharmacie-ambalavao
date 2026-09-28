import { useState, useEffect, useMemo } from 'react';
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
import { usePermissions } from '@/hooks/usePermissions';

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

// Mapping des onglets vers les permissions requises pour les afficher
const tabPermissions: Record<string, string> = {
  produits: 'produit.view',
  categories: 'categorie.view',
  unites: 'unite.view',
  lots: 'lot.view',
};

// Mapping des actions par onglet
const tabActionPermissions: Record<string, { create?: string; update?: string; delete?: string }> = {
  produits: { create: 'produit.create', update: 'produit.update', delete: 'produit.delete' },
  categories: { create: 'categorie.create', update: 'categorie.update', delete: 'categorie.delete' },
  unites: { create: 'unite.create', update: 'unite.update', delete: 'unite.delete' },
  lots: { create: 'lot.create', update: 'lot.update', delete: 'lot.delete' },
};

export function ProduitsPage() {
  const { showToast } = useToast();
  const { hasPermission } = usePermissions();

  // Filtrer les onglets selon les permissions de l'utilisateur
  const allowedTabs = useMemo(() => {
    return produitsTabs.filter((tab) => {
      const permCode = tabPermissions[tab.id];
      return permCode ? hasPermission(permCode) : true;
    });
  }, [hasPermission]);

  // Déterminer l'onglet actif par défaut (premier onglet autorisé)
  const defaultActiveTab = allowedTabs.length > 0 ? allowedTabs[0].id : 'produits';

  const [activeTab, setActiveTab] = useState(defaultActiveTab);
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

  // Charger les produits si l'utilisateur a la permission
  useEffect(() => {
    if (!hasPermission('produit.view')) {
      setLoading((prev) => ({ ...prev, produits: false }));
      return;
    }

    const load = async () => {
      try {
        const data = await produitsApi.getAll();
        setProducts(data);
      } catch (error: unknown) {
        const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
        if (axiosError.response?.status === 403 || axiosError.response?.status === 500) {
          showToast('Accès refusé : vous n\'avez pas la permission de consulter les produits.', 'error');
        } else {
          console.error(' chargement produits:', error);
          showToast('Impossible de charger les produits.', 'error');
        }
      } finally {
        setLoading((prev) => ({ ...prev, produits: false }));
      }
    };
    load();
  }, [showToast, hasPermission]);

  // Charger les catégories si l'utilisateur a la permission
  useEffect(() => {
    if (!hasPermission('categorie.view')) {
      setLoading((prev) => ({ ...prev, categories: false }));
      return;
    }

    const load = async () => {
      try {
        const data = await categoriesApi.getAll();
        setCategoriesData(data);
      } catch (error: unknown) {
        const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
        if (axiosError.response?.status === 403 || axiosError.response?.status === 500) {
          showToast('Accès refusé : vous n\'avez pas la permission de consulter les catégories.', 'error');
        } else {
          console.error(' chargement catégories:', error);
          showToast('Impossible de charger les catégories.', 'error');
        }
      } finally {
        setLoading((prev) => ({ ...prev, categories: false }));
      }
    };
    load();
  }, [showToast, hasPermission]);

  // Charger les unités si l'utilisateur a la permission
  useEffect(() => {
    if (!hasPermission('unite.view')) {
      setLoading((prev) => ({ ...prev, unites: false }));
      return;
    }

    const load = async () => {
      try {
        const data = await unitesApi.getAll();
        setUnitsData(data);
      } catch (error: unknown) {
        const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
        if (axiosError.response?.status === 403 || axiosError.response?.status === 500) {
          showToast('Accès refusé : vous n\'avez pas la permission de consulter les unités.', 'error');
        } else {
          console.error(' chargement unités:', error);
          showToast('Impossible de charger les unités.', 'error');
        }
      } finally {
        setLoading((prev) => ({ ...prev, unites: false }));
      }
    };
    load();
  }, [showToast, hasPermission]);

  // Charger les lots si l'utilisateur a la permission
  useEffect(() => {
    if (!hasPermission('lot.view')) {
      setLoading((prev) => ({ ...prev, lots: false }));
      return;
    }

    const load = async () => {
      try {
        const data = await lotsApi.getAll();
        setLotsData(data);
      } catch (error: unknown) {
        const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
        if (axiosError.response?.status === 403 || axiosError.response?.status === 500) {
          showToast('Accès refusé : vous n\'avez pas la permission de consulter les lots.', 'error');
        } else {
          console.error(' chargement lots:', error);
          showToast('Impossible de charger les lots.', 'error');
        }
      } finally {
        setLoading((prev) => ({ ...prev, lots: false }));
      }
    };
    load();
  }, [showToast, hasPermission]);

  // Vérifier si l'utilisateur peut ajouter pour l'onglet actif
  const canAdd = useMemo(() => {
    const perms = tabActionPermissions[activeTab];
    return perms?.create ? hasPermission(perms.create) : false;
  }, [activeTab, hasPermission]);

  // Vérifier si l'utilisateur peut modifier pour l'onglet actif
  const canEdit = useMemo(() => {
    const perms = tabActionPermissions[activeTab];
    return perms?.update ? hasPermission(perms.update) : false;
  }, [activeTab, hasPermission]);

  // Vérifier si l'utilisateur peut supprimer pour l'onglet actif
  const canDelete = useMemo(() => {
    const perms = tabActionPermissions[activeTab];
    return perms?.delete ? hasPermission(perms.delete) : false;
  }, [activeTab, hasPermission]);

  const openAdd = () => {
    if (!canAdd) {
      showToast('Vous n\'avez pas la permission d\'ajouter cet élément.', 'error');
      return;
    }
    const kind = tabKind[activeTab] ?? 'produit';
    setModal({ kind, item: null });
  };

  const openEdit = (
    kind: CatalogueModalState['kind'],
    item: Produit | Categorie | Unite | Lot
  ) => {
    if (!canEdit) {
      showToast('Vous n\'avez pas la permission de modifier cet élément.', 'error');
      return;
    }
    setModal({ kind, item });
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    if (!canDelete) {
      showToast('Vous n\'avez pas la permission de supprimer cet élément.', 'error');
      setDeleteTarget(null);
      return;
    }

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

        if (axiosError.response?.status === 403) {
          showToast('Accès refusé : vous n\'avez pas la permission de supprimer cet élément.', 'error');
        } else if (specificMessage) {
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

  // Si aucun onglet n'est autorisé, afficher un message
  if (allowedTabs.length === 0) {
    return (
      <div className="page-container">
        <PageHeader
          title="Produits"
          subtitle="Aucune permission pour accéder à ce module"
        />
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-800">
            Vous n'avez pas les permissions nécessaires pour accéder à aucune section de ce module.
            Contactez votre administrateur pour obtenir les droits d'accès.
          </p>
        </div>
      </div>
    );
  }

  // Réinitialiser l'onglet actif s'il n'est plus dans la liste autorisée
  useEffect(() => {
    if (!allowedTabs.some((tab) => tab.id === activeTab)) {
      setActiveTab(defaultActiveTab);
    }
  }, [allowedTabs, activeTab, defaultActiveTab]);

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
          canAdd && activeTab !== 'lots' ? (
            <button type="button" className="btn-primary" onClick={openAdd}>
              <Plus size={15} /> {currentLabel}
            </button>
          ) : null
        }
      />

      <PageTabs
        tabs={allowedTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'produits' && (
        <ProduitsTab
          data={products}
          search={search}
          loading={loading.produits}
          onOpenEdit={canEdit ? (item) => openEdit('produit', item) : undefined}
          onDelete={canDelete ? (item) => setDeleteTarget({ kind: 'produit', item }) : undefined}
        />
      )}

      {activeTab === 'lots' && (
        <LotsTab
          data={lotsData}
          search={search}
          loading={loading.lots}
          onOpenEdit={canEdit ? (item) => openEdit('lot', item) : undefined}
          onDelete={canDelete ? (item) => setDeleteTarget({ kind: 'lot', item }) : undefined}
        />
      )}

      {activeTab === 'categories' && (
        <CategoriesTab
          data={categoriesData}
          search={search}
          loading={loading.categories}
          onOpenEdit={canEdit ? (item) => openEdit('categories', item) : undefined}
          onDelete={canDelete ? (item) => setDeleteTarget({ kind: 'categories', item }) : undefined}
        />
      )}

      {activeTab === 'unites' && (
        <UnitesTab
          data={unitsData}
          search={search}
          loading={loading.unites}
          onOpenEdit={canEdit ? (item) => openEdit('unite', item) : undefined}
          onDelete={canDelete ? (item) => setDeleteTarget({ kind: 'unite', item }) : undefined}
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
