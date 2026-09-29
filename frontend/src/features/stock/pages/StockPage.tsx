import { useCallback, useEffect, useMemo, useState } from 'react';
import { Download, Plus } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { PageTabs } from '@/components/PageTabs';
import { PageToolbar } from '@/components/PageToolbar';
import { useToast } from '@/components/Toast';
import type { Inventaire, Lot, MouvementStock } from '@/types';
import { stockApi, type StockParProduit } from '../api/stock';
import { stockTabs } from './tabs/tabsConfig';
import { StockProduitTab } from './tabs/StockProduitTab';
import { LotsTab } from './tabs/LotsTab';
import { EntreesTab } from './tabs/EntreesTab';
import { SortiesTab } from './tabs/SortiesTab';
import { MouvementsTab } from './tabs/MouvementsTab';
import { InventairesTab } from './tabs/InventairesTab';
import {
  StockModal,
  type StockModalKind,
  type StockModalState,
} from './tabs/StockModal';
import {
  downloadStockReport,
  type StockReportFilters,
  type StockReportTab,
} from '../utils/exportStockPdf';
import { usePermissions } from '@/hooks/usePermissions';

function isMovementInPeriod(
  movement: MouvementStock,
  dateFrom: string,
  dateTo: string,
): boolean {
  if (!dateFrom && !dateTo) return true;
  if (!movement.created_at) return false;

  const date = new Date(movement.created_at);
  const from = dateFrom ? new Date(`${dateFrom}T00:00:00`) : null;
  const to = dateTo ? new Date(`${dateTo}T23:59:59`) : null;

  return (!from || date >= from) && (!to || date <= to);
}

function getLotExpiryState(datePeremption: string): {
  label: string;
  days: number;
} {
  const expiry = new Date(`${datePeremption}T23:59:59`);
  const days = Number.isNaN(expiry.getTime())
    ? Number.POSITIVE_INFINITY
    : Math.ceil(
        (expiry.getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24),
      );

  if (days < 0) return { label: 'Expiré', days };
  if (days <= 30) return { label: 'Expire sous 30 jours', days };
  if (days <= 60) return { label: 'Expire sous 60 jours', days };
  if (days <= 90) return { label: 'Expire sous 90 jours', days };
  return { label: 'Valide', days };
}

export function StockPage() {
  const { showToast } = useToast();
  const { hasPermission } = usePermissions();

  // Filtrer les onglets selon les permissions
  const allowedTabs = useMemo(() => {
    const tabPermissions: Record<string, string> = {
      'stock-produit': 'stock.view',
      lots: 'lot.view',
      entrees: 'stock.entry.view',
      sorties: 'stock.exit.view',
      mouvements: 'mouvement_stock.view',
      inventaires: 'inventaire.view',
    };

    return stockTabs.filter((tab) => {
      const permCode = tabPermissions[tab.id];
      return permCode ? hasPermission(permCode) : true;
    });
  }, [hasPermission]);

  const defaultActiveTab = allowedTabs.length > 0 ? allowedTabs[0].id : 'stock-produit';

  const canExportStock = hasPermission('stock.export');
  const [activeTab, setActiveTab] = useState<StockReportTab>(defaultActiveTab as StockReportTab);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [expiryFilter, setExpiryFilter] =
    useState<StockReportFilters['expiryFilter']>('all');
  const [stockData, setStockData] = useState<StockParProduit[]>([]);
  const [lotsData, setLotsData] = useState<Lot[]>([]);
  const [mouvementsData, setMouvementsData] = useState<MouvementStock[]>([]);
  const [inventairesData, setInventairesData] = useState<Inventaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<StockModalState | null>(null);

  const loadStockData = useCallback(async () => {
    try {
      const promises: Promise<unknown>[] = [];

      if (hasPermission('stock.view')) {
        promises.push(
          stockApi.getStockParProduit().then((data) => setStockData(data))
        );
      }
      if (hasPermission('lot.view')) {
        promises.push(stockApi.getLots().then((data) => setLotsData(data)));
      }
      if (hasPermission('mouvement_stock.view')) {
        promises.push(
          stockApi.getMouvements().then((data) => setMouvementsData(data))
        );
      }
      if (hasPermission('inventaire.view')) {
        promises.push(
          stockApi.getInventaires().then((data) => setInventairesData(data))
        );
      }

      await Promise.all(promises);
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
      if (axiosError.response?.status === 403 || axiosError.response?.status === 500) {
        showToast('Accès refusé : vous n\'avez pas la permission de consulter ces données.', 'error');
      } else {
        const message =
          error instanceof Error
            ? error.message
            : 'Impossible de charger les données du stock.';
        showToast(message, 'error');
      }
    } finally {
      setLoading(false);
    }
  }, [showToast, hasPermission]);

  useEffect(() => {
    void loadStockData();
  }, [loadStockData]);

  const stockParProduit = stockData.map((product) => ({
    ...product,
    quantite_totale: Number(product.lots_sum_quantite ?? 0),
  }));

  const lotsFiltres = useMemo(() => {
    if (expiryFilter === 'all') return lotsData;

    return lotsData.filter((lot) => {
      const { days } = getLotExpiryState(lot.date_peremption);

      if (expiryFilter === 'expired') return days < 0;
      if (expiryFilter === '30') return days >= 0 && days <= 30;
      if (expiryFilter === '60') return days >= 0 && days <= 60;
      return days >= 0 && days <= 90;
    });
  }, [expiryFilter, lotsData]);

  const mouvementsPeriode = useMemo(
    () =>
      mouvementsData.filter((movement) =>
        isMovementInPeriod(movement, dateFrom, dateTo),
      ),
    [dateFrom, dateTo, mouvementsData],
  );

  const entreesData = mouvementsPeriode.filter(
    (movement) => movement.type === 'entree',
  );

  const sortiesData = mouvementsPeriode.filter(
    (movement) => movement.type === 'sortie',
  );

  // Permissions d'action pour l'onglet actif
  const canAdd = useMemo(() => {
    switch (activeTab) {
      case 'entrees':
        return hasPermission('stock.entry.create');
      case 'sorties':
        return hasPermission('stock.exit.create');
      case 'inventaires':
        return hasPermission('inventaire.create');
      default:
        return false;
    }
  }, [activeTab, hasPermission]);

  const canEdit = useMemo(() => {
    switch (activeTab) {
      case 'mouvements':
        return hasPermission('mouvement_stock.update');
      case 'inventaires':
        return hasPermission('inventaire.update');
      default:
        return false;
    }
  }, [activeTab, hasPermission]);

  const canDelete = useMemo(() => {
    switch (activeTab) {
      case 'mouvements':
        return hasPermission('mouvement_stock.delete');
      case 'inventaires':
        return hasPermission('inventaire.delete');
      default:
        return false;
    }
  }, [activeTab, hasPermission]);

  function openAdd(kind: StockModalKind) {
    if (!canAdd) {
      showToast('Vous n\'avez pas la permission d\'ajouter cet élément.', 'error');
      return;
    }
    setModal({ kind, item: null });
  }

  async function handleSaved() {
    await loadStockData();
    setModal(null);
    showToast('Données du stock mises à jour.', 'success');
  }

  function handleExportPdf() {
    if (loading) return;

    if (!canExportStock) {
      showToast('Vous n\'avez pas la permission d\'exporter le stock.', 'error');
      return;
    }

    const exported = downloadStockReport(
      activeTab,
      {
        products: stockParProduit,
        lots: lotsFiltres,
        movements: mouvementsPeriode,
        inventories: inventairesData,
      },
      { dateFrom, dateTo, expiryFilter },
    );

    if (!exported) {
      showToast('Impossible de générer le fichier PDF.', 'error');
      return;
    }

    showToast('PDF téléchargé avec succès.', 'success');
  }

  // Si aucun onglet n'est autorisé
  if (allowedTabs.length === 0) {
    return (
      <div className="page-container">
        <PageHeader
          title="Gestion du stock"
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

  // Réinitialiser l'onglet actif s'il n'est plus autorisé
  useEffect(() => {
    if (!allowedTabs.some((tab) => tab.id === activeTab)) {
      setActiveTab(defaultActiveTab as StockReportTab);
    }
  }, [allowedTabs, activeTab, defaultActiveTab]);

  return (
    <div className="page-container">
      <PageHeader
        title="Gestion du stock"
        subtitle={`${lotsData.length} lot(s) — ${mouvementsData.length} mouvement(s)`}
      />

      <PageToolbar
        search={search}
        onSearch={setSearch}
        placeholder="Rechercher dans l'onglet actif..."
        actions={
          <>
            {canExportStock && (
              <button
                type="button"
                className="btn-export-pdf"
                onClick={handleExportPdf}
                disabled={loading}
                title="Télécharger le rapport PDF"
              >
                <Download size={15} /> Exporter PDF
              </button>
            )}

            {activeTab === 'lots' && (
              <label className="stock-report-filter">
                <span>Péremption</span>
                <select
                  value={expiryFilter}
                  onChange={(event) =>
                    setExpiryFilter(
                      event.target.value as StockReportFilters['expiryFilter'],
                    )
                  }
                >
                  <option value="all">Tous les lots</option>
                  <option value="30">Expirant sous 30 jours</option>
                  <option value="60">Expirant sous 60 jours</option>
                  <option value="90">Expirant sous 90 jours</option>
                  <option value="expired">Déjà expirés</option>
                </select>
              </label>
            )}

            {['entrees', 'sorties', 'mouvements'].includes(activeTab) && (
              <div className="stock-date-filter">
                <label>
                  <span>Du</span>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(event) => setDateFrom(event.target.value)}
                  />
                </label>
                <label>
                  <span>Au</span>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(event) => setDateTo(event.target.value)}
                  />
                </label>
              </div>
            )}

            {['entrees', 'sorties'].includes(activeTab) && canAdd && (
              <button
                type="button"
                className="btn-primary"
                onClick={() =>
                  openAdd(activeTab === 'entrees' ? 'entree' : 'sortie')
                }
              >
                <Plus size={15} />
                {activeTab === 'entrees'
                  ? 'Ajouter une entrée'
                  : 'Ajouter une sortie'}
              </button>
            )}

            {activeTab === 'inventaires' && canAdd && (
              <button
                type="button"
                className="btn-primary"
                onClick={() => openAdd('inventaire')}
              >
                <Plus size={15} /> Ajouter un inventaire
              </button>
            )}

          </>
        }
      />

      <PageTabs
        tabs={allowedTabs}
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id as StockReportTab)}
      />

      {activeTab === 'stock-produit' && (
        <StockProduitTab
          data={stockParProduit}
          search={search}
          loading={loading}
          onOpenEdit={canEdit ? () => { /* TODO: implémenter édition stock produit */ } : undefined}
          onDelete={canDelete ? () => { /* TODO: implémenter suppression stock produit */ } : undefined}
        />
      )}

      {activeTab === 'lots' && (
        <LotsTab
          data={lotsFiltres}
          search={search}
          loading={loading}
          onOpenEdit={canEdit ? () => { /* TODO: implémenter édition lot */ } : undefined}
          onDelete={canDelete ? () => { /* TODO: implémenter suppression lot */ } : undefined}
        />
      )}

      {activeTab === 'entrees' && (
        <EntreesTab
          data={entreesData}
          search={search}
          loading={loading}
          onOpenEdit={canEdit ? () => openAdd('entree') : undefined}
          onDelete={canDelete ? () => { /* TODO: implémenter suppression entrée */ } : undefined}
        />
      )}

      {activeTab === 'sorties' && (
        <SortiesTab
          data={sortiesData}
          search={search}
          loading={loading}
          onOpenEdit={canEdit ? () => openAdd('sortie') : undefined}
          onDelete={canDelete ? () => { /* TODO: implémenter suppression sortie */ } : undefined}
        />
      )}

      {activeTab === 'mouvements' && (
        <MouvementsTab
          data={mouvementsPeriode}
          search={search}
          loading={loading}
          onOpenEdit={canEdit ? () => { /* TODO: implémenter édition mouvement */ } : undefined}
          onDelete={canDelete ? () => { /* TODO: implémenter suppression mouvement */ } : undefined}
        />
      )}

      {activeTab === 'inventaires' && (
        <InventairesTab
          data={inventairesData}
          search={search}
          loading={loading}
          onOpenEdit={canEdit ? () => openAdd('inventaire') : undefined}
          onDelete={canDelete ? () => { /* TODO: implémenter suppression inventaire */ } : undefined}
        />
      )}

      <StockModal
        modal={modal}
        lots={lotsData}
        onClose={() => setModal(null)}
        onSaved={handleSaved}
      />
    </div>
  );
}
