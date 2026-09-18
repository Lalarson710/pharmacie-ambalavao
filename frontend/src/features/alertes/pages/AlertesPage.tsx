import { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { PageTabs } from '@/components/PageTabs';
import { PageToolbar } from '@/components/PageToolbar';
import { alertesStockFaible, alertesRupture, alertesPeremption } from '@/data/mockData';
import { alertesTabs } from './tabs/tabsConfig';
import { StocksFaiblesTab } from './tabs/StocksFaiblesTab';
import { RupturesTab } from './tabs/RupturesTab';
import { PeremptionsTab } from './tabs/PeremptionsTab';

export function AlertesPage() {
  const [activeTab, setActiveTab] = useState('stocks-faibles');
  const [search, setSearch] = useState('');

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
        tabs={alertesTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'stocks-faibles' && (
        <StocksFaiblesTab data={alertesStockFaible} search={search} />
      )}

      {activeTab === 'ruptures' && (
        <RupturesTab data={alertesRupture} search={search} />
      )}

      {activeTab === 'peremptions' && (
        <PeremptionsTab data={alertesPeremption} search={search} />
      )}
    </div>
  );
}
