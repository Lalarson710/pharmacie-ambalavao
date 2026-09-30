import { useMemo, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { PageTabs } from '@/components/PageTabs';
import { PageToolbar } from '@/components/PageToolbar';
import { alertesTabs } from './tabs/tabsConfig';
import { StocksFaiblesTab } from './tabs/StocksFaiblesTab';
import { RupturesTab } from './tabs/RupturesTab';
import { PeremptionsTab } from './tabs/PeremptionsTab';
import { useAlertes } from '../hooks/useAlertes';
import { usePermissions } from '@/hooks/usePermissions';

export function AlertesPage() {
  const { hasPermission } = usePermissions();
  const { counts, stocksFaibles, ruptures, peremptions, loading, jours, setJours, reload } =
    useAlertes();

  const [activeTab, setActiveTab] = useState('stocks-faibles');
  const [search, setSearch] = useState('');

  // Badge dynamique sur chaque onglet, selon les donnees du backend
  const allowedTabs = useMemo(() => {
    const badges: Record<string, number> = {
      'stocks-faibles': counts.stocksFaibles,
      ruptures: counts.ruptures,
      peremptions: counts.peremptions,
    };

    return alertesTabs
      .filter(() => hasPermission('alerte.view'))
      .map((tab) => ({ ...tab, badge: badges[tab.id] ?? 0 }));
  }, [counts, hasPermission]);

  const canView = hasPermission('alerte.view');

  if (!canView || allowedTabs.length === 0) {
    return (
      <div className="page-container">
        <div className="page-empty-state">
          <div className="empty-state-icon">🔒</div>
          <h2>Accès non autorisé</h2>
          <p>Vous n'avez pas les permissions nécessaires pour accéder à ce module.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <PageHeader
        title="Alertes"
        subtitle={
          counts.total > 0
            ? `${counts.total} alerte(s) nécessitent votre attention`
            : 'Aucune alerte : tous les stocks sont sana'
        }
      />

      <PageToolbar
        search={search}
        onSearch={setSearch}
        placeholder="Rechercher dans les alertes..."
        actions={
          <>
            <label className="stock-report-filter">
              <span>Péremption</span>
              <select
                value={jours}
                onChange={(event) => setJours(Number(event.target.value))}
              >
                <option value={7}>Sous 7 jours</option>
                <option value={30}>Sous 30 jours</option>
                <option value={60}>Sous 60 jours</option>
                <option value={90}>Sous 90 jours</option>
                <option value={180}>Sous 180 jours</option>
              </select>
            </label>

            <button
              type="button"
              className="btn-ghost btn-sm"
              onClick={() => void reload()}
              disabled={loading}
              title="Actualiser les alertes"
            >
              <RefreshCw size={15} /> Actualiser
            </button>
          </>
        }
      />

      <PageTabs
        tabs={allowedTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'stocks-faibles' && (
        <StocksFaiblesTab data={stocksFaibles} search={search} loading={loading} />
      )}

      {activeTab === 'ruptures' && (
        <RupturesTab data={ruptures} search={search} loading={loading} />
      )}

      {activeTab === 'peremptions' && (
        <PeremptionsTab data={peremptions} search={search} loading={loading} />
      )}
    </div>
  );
}
