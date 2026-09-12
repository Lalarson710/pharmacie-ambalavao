import { type ReactNode, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  BarChart3,
  Box,
  Building,
  ClipboardList,
  FileText,
  History,
  LayoutDashboard,
  LogOut,
  Package,
  PackageOpen,
  Percent,
  PiggyBank,
  Receipt,
  ShoppingCart,
  TrendingUp,
  Users,
  Warehouse,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '@/features/auth/store/authStore';

interface NavItem {
  label: string;
  to: string;
  icon: ReactNode;
}

const navItems: NavItem[] = [
  { label: 'Tableau de bord', to: '/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'Produits', to: '/produits', icon: <Package size={18} /> },
  { label: 'Lots', to: '/lots', icon: <PackageOpen size={18} /> },
  { label: 'Catégories', to: '/categories', icon: <Box size={18} /> },
  { label: 'Unités', to: '/unites', icon: <Percent size={18} /> },
  { label: 'Stock', to: '/stock', icon: <Warehouse size={18} /> },
  { label: 'Mouvements de stock', to: '/mouvements-stock', icon: <History size={18} /> },
  { label: 'Inventaires', to: '/inventaires', icon: <ClipboardList size={18} /> },
  { label: 'Fournisseurs', to: '/fournisseurs', icon: <Building size={18} /> },
  { label: 'Achats', to: '/achats', icon: <ShoppingCart size={18} /> },
  { label: 'Clients', to: '/clients', icon: <Users size={18} /> },
  { label: 'Ventes', to: '/ventes', icon: <Receipt size={18} /> },
  { label: 'Factures', to: '/factures', icon: <FileText size={18} /> },
  { label: 'Règlements', to: '/reglements', icon: <Percent size={18} /> },
  { label: 'Caisse', to: '/caisses', icon: <PiggyBank size={18} /> },
  { label: 'Mouvements de caisse', to: '/mouvements-caisse', icon: <History size={18} /> },
  { label: 'Personnel', to: '/personnels', icon: <Users size={18} /> },
  { label: 'Utilisateurs', to: '/utilisateurs', icon: <Users size={18} /> },
  { label: 'Rôles & Permissions', to: '/roles', icon: <Box size={18} /> },
  { label: 'Alertes', to: '/alertes', icon: <Percent size={18} /> },
  { label: 'Statistiques', to: '/statistiques', icon: <BarChart3 size={18} /> },
  { label: 'Rapports', to: '/rapports', icon: <FileText size={18} /> },
  { label: 'Sauvegardes', to: '/sauvegardes', icon: <Package size={18} /> },
];

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="app-layout">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="brand-lockup-sidebar">
            <img
              src="/logo pharmacie.png"
              alt="Logo Pharmacie"
              className="sidebar-logo"
            />
            <div>
              <span className="sidebar-brand">PHARMA<span>GESTION</span> PRO</span>
              <span className="sidebar-subtitle">Ambalavao</span>
            </div>
          </div>
          <button
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Fermer le menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul>
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={`nav-link ${isActive ? 'active' : ''}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-button" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="main-content">
        <header className="top-header">
          <button
            className="menu-toggle"
            onClick={() => setSidebarOpen(true)}
            aria-label="Ouvrir le menu"
          >
            <Menu size={20} />
          </button>
          <div className="user-info">
            <span className="user-name">{user?.name ?? 'Utilisateur'}</span>
            <span className="user-role">
              {user?.role?.nom_affichage ?? 'Rôle inconnu'}
            </span>
          </div>
        </header>

        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
