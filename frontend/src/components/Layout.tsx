import { useState, type ReactNode } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  BarChart3,
  Box,
  Building,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  PiggyBank,
  Receipt,
  ShoppingCart,
  Users,
  Warehouse,
} from 'lucide-react';
import { useAuth } from '@/features/auth/store/authStore';

interface NavItem {
  label: string;
  to: string;
  icon: ReactNode;
}

const navItems: NavItem[] = [
  { label: 'Tableau de bord', to: '/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'Fournisseurs', to: '/fournisseurs', icon: <Building size={18} /> },
  { label: 'Produits', to: '/produits', icon: <Package size={18} /> },
  { label: 'Clients', to: '/clients', icon: <Users size={18} /> },
  { label: 'Achats', to: '/achats', icon: <ShoppingCart size={18} /> },
  { label: 'Stock', to: '/stock', icon: <Warehouse size={18} /> },
  { label: 'Ventes', to: '/ventes', icon: <Receipt size={18} /> },
  { label: 'Caisse', to: '/caisses', icon: <PiggyBank size={18} /> },
  { label: 'Personnel', to: '/personnels', icon: <Users size={18} /> },
  { label: 'Rôles & Permissions', to: '/roles', icon: <Box size={18} /> },
  { label: 'Alertes', to: '/alertes', icon: <ClipboardList size={18} /> },
  { label: 'Statistiques', to: '/statistiques', icon: <BarChart3 size={18} /> },
  { label: 'Rapports', to: '/rapports', icon: <FileText size={18} /> },
  { label: 'Sauvegardes', to: '/sauvegardes', icon: <Package size={18} /> },
];

export function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <button
            className="sidebar-toggle"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Développer le menu' : 'Replier le menu'}
            title={collapsed ? 'Développer le menu' : 'Replier le menu'}
          >
            <Menu size={18} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul>
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={`nav-link ${location.pathname === item.to ? 'active' : ''}`}
                  title={collapsed ? item.label : undefined}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-button" onClick={handleLogout} title="Déconnexion">
            <LogOut size={18} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className={`main-content ${collapsed ? 'sidebar-collapsed' : ''}`}>
        <header className="top-header">
          <div className="brand-lockup-header">
            <img
              src="/logo pharmacie.png"
              alt="Logo Pharmacie"
              className="header-logo"
            />
            <div>
              <span className="header-brand">PHARMA<span>GESTION</span> PRO</span>
              <span className="header-subtitle">Ambalavao</span>
            </div>
          </div>
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
