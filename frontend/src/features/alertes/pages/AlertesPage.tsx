import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { PageTabs } from '@/components/PageTabs';
import { PageToolbar } from '@/components/PageToolbar';
import { alertesStockFaible, alertesRupture, alertesPeremption } from '@/data/mockData';
import { alertesTabs } from './tabs/tabsConfig';
import { StocksFaiblesTab } from './tabs/StocksFaiblesTab';
import { RupturesTab } from './tabs/RupturesTab';
import { PeremptionsTab } from './tabs/PeremptionsTab';
import { usePermissions } from '@/hooks/usePermissions';
import { useToast } from '@/components/Toast';

export function AlertesPage() {
  const { hasPermission } = usePermissions();

  // Permission mapping for tabs
  const tabPermissions: Record<string, string> = {
    'stocks-faibles': 'alerte.view',
    ruptures: 'alerte.view',
    peremptions: 'alerte.view',
  };

  // Filter tabs based on view permissions
  const allowedTabs = alertesTabs.filter((tab) => hasPermission(tabPermissions[tab.id]));
  const defaultActiveTab = allowedTabs[0]?.id ?? 'stocks-faibles';

  const [activeTab, setActiveTab] = useState(defaultActiveTab);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Check permissions for active tab
  const canView = hasPermission(tabPermissions[activeTab]);

  // Load data if user has view permission
  useEffect(() => {
    if (!canView) return;
    // Simulate data loading
    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, [canView]);

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
        subtitle="Produits nécessitant une attention"
      />

      <PageToolbar
        search={search}
        onSearch={setSearch}
        placeholder="Rechercher dans les alertes..."
      />

      <PageTabs
        tabs={allowedTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'stocks-faibles' && (
        <StocksFaiblesTab data={alertesStockFaible} search={search} loading={loading} />
      )}

      {activeTab === 'ruptures' && (
        <RupturesTab data={alertesRupture} search={search} loading={loading} />
      )}

      {activeTab === 'peremptions' && (
        <PeremptionsTab data={alertesPeremption} search={search} loading={loading} />
      )}
    </div>
  );
}
