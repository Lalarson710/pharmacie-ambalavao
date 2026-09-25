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
  const [activeTab, setActiveTab] = useState<StockReportTab>('stock-produit');
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
      const [stocks, lots, mouvements, inventaires] = await Promise.all([
        stockApi.getStockParProduit(),
        stockApi.getLots(),
        stockApi.getMouvements(),
        stockApi.getInventaires(),
      ]);

      setStockData(stocks);
      setLotsData(lots);
      setMouvementsData(mouvements);
      setInventairesData(inventaires);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Impossible de charger les données du stock.';
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

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

  function openAdd(kind: StockModalKind) {
    setModal({ kind, item: null });
  }


  async function handleSaved() {
    await loadStockData();
    setModal(null);
    showToast('Données du stock mises à jour.', 'success');
  }

  function handleExportPdf() {
    if (loading) return;

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
            <button
              type="button"
              className="btn-export-pdf"
              onClick={handleExportPdf}
              disabled={loading}
              title="Télécharger le rapport PDF"
            >
              <Download size={15} /> Exporter PDF
            </button>

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

            {['entrees', 'sorties'].includes(activeTab) && (
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

            {activeTab === 'inventaires' && (
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
        tabs={stockTabs}
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id as StockReportTab)}
      />

      {activeTab === 'stock-produit' && (
        <StockProduitTab
          data={stockParProduit}
          search={search}
          loading={loading}
        />
      )}

      {activeTab === 'lots' && (
        <LotsTab
          data={lotsFiltres}
          search={search}
          loading={loading}
        />
      )}

      {activeTab === 'entrees' && (
        <EntreesTab
          data={entreesData}
          search={search}
          loading={loading}
        />
      )}

      {activeTab === 'sorties' && (
        <SortiesTab
          data={sortiesData}
          search={search}
          loading={loading}
        />
      )}

      {activeTab === 'mouvements' && (
        <MouvementsTab
          data={mouvementsPeriode}
          search={search}
          loading={loading}
        />
      )}

      {activeTab === 'inventaires' && (
        <InventairesTab
          data={inventairesData}
          search={search}
          loading={loading}
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
