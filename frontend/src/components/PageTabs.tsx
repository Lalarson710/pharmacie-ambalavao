import { type ReactNode } from 'react';

interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
  /** Compteur optionnel affiche dans l'onglet (badge). */
  badge?: number;
}

interface PageTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

export function PageTabs({ tabs, activeTab, onTabChange }: PageTabsProps) {
  return (
    <div className="page-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`page-tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.icon}
          <span>{tab.label}</span>
          {typeof tab.badge === 'number' && tab.badge > 0 && (
            <span className={`page-tab-badge ${tab.badge > 99 ? 'is-max' : ''}`}>
              {tab.badge > 99 ? '99+' : tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}