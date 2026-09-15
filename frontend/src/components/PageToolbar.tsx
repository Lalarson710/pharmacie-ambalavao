import { Search } from 'lucide-react';
import type { ReactNode } from 'react';

interface PageToolbarProps {
  search: string;
  onSearch: (value: string) => void;
  placeholder?: string;
  actions?: ReactNode;
  ariaLabel?: string;
}

export function PageToolbar({
  search,
  onSearch,
  placeholder = 'Rechercher...',
  actions,
  ariaLabel = 'Recherche dans la page',
}: PageToolbarProps) {
  return (
    <div className="page-toolbar">
      <div className="page-search">
        <Search size={16} aria-hidden="true" />
        <input
          aria-label={ariaLabel}
          type="search"
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder={placeholder}
        />
      </div>
      {actions && <div className="page-toolbar-actions">{actions}</div>}
    </div>
  );
}
