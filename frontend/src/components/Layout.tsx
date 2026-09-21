import { useState, type ReactNode } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { ToastProvider } from './Toast';
import {
  BarChart3,
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
import { ConfirmModal } from '@/components/ConfirmModal';

interface NavItem {
  label: string;
  to: string;
  icon: ReactNode;
  permission?: string;
}

const navItems: NavItem[] = [
  { label: 'Tableau de bord', to: '/dashboard', icon: <LayoutDashboard size={18} />, permission: 'dashboard.view' },
  { label: 'Fournisseurs', to: '/fournisseurs', icon: <Building size={18} />, permission: 'fournisseur.view' },
  { label: 'Produits & Lots', to: '/produits', icon: <Package size={18} />, permission: 'produit.view' },
  { label: 'Clients', to: '/clients', icon: <Users size={18} />, permission: 'client.view' },
  { label: 'Achats', to: '/achats', icon: <ShoppingCart size={18} />, permission: 'achat.view' },
  { label: 'Stock', to: '/stock', icon: <Warehouse size={18} />, permission: 'stock.view' },
  { label: 'Ventes', to: '/ventes', icon: <Receipt size={18} />, permission: 'vente.view' },
  { label: 'Caisse', to: '/caisses', icon: <PiggyBank size={18} />, permission: 'caisse.open' },
  { label: 'Personnel', to: '/personnels', icon: <Users size={18} />, permission: 'personnel.view' },
  { label: 'Alertes', to: '/alertes', icon: <ClipboardList size={18} />, permission: 'alerte.view' },
  { label: 'Statistiques', to: '/statistiques', icon: <BarChart3 size={18} />, permission: 'statistique.view' },
  { label: 'Rapports', to: '/rapports', icon: <FileText size={18} />, permission: 'rapport.view' },
  { label: 'Sauvegardes', to: '/sauvegardes', icon: <Package size={18} />, permission: 'sauvegarde.view' },
];

const ROLE_LABELS: Record<number, string> = {
  1: 'Pharmacien Titulaire',
  2: 'Pharmacien Adjoint',
  3: 'Préparateur',
};

export function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = async () => {
    setShowLogoutConfirm(false);
    await logout();
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const hasPermission = (permission: string): boolean => {
    if (!user?.permissions) return false;
    return user.permissions.some((p) => p.code === permission && p.pivot?.autorise === true);
  };

  const visibleNavItems = navItems.filter((item) => {
    if (!item.permission) return true;
    return hasPermission(item.permission);
  });

  const getRoleDisplay = () => {
    if (user?.role?.nom_affichage) {
      return user.role.nom_affichage;
    }
    if (user?.role_id && ROLE_LABELS[user.role_id]) {
      return ROLE_LABELS[user.role_id];
    }
    if (user?.role_id) {
      return `Rôle #${user.role_id}`;
    }
    return 'Rôle non défini';
  };

  return (
    <div className="app-layout">
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
            {visibleNavItems.map((item) => (
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
          <button className="logout-button" onClick={handleLogoutClick} title="Déconnexion">
            <LogOut size={18} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      <div className={`main-content ${collapsed ? 'sidebar-collapsed' : ''}`}>
        <header className="top-header">
          <div className="brand-lockup-header">
            <img src="/logo pharmacie.png" alt="Logo Pharmacie" className="header-logo" />
            <div>
              <span className="header-brand">PHARMA<span>GESTION</span> PRO</span>
              <span className="header-subtitle">Ambalavao</span>
            </div>
          </div>
          <div className="user-info">
            <span className="user-name">{user?.name ?? 'Utilisateur'}</span>
            <span className="user-role">{getRoleDisplay()}</span>
          </div>
        </header>

        <main className="content-area">
          <ToastProvider>
            <Outlet />
          </ToastProvider>
        </main>
      </div>

      <ConfirmModal
        open={showLogoutConfirm}
        title="Déconnexion"
        message="Êtes-vous sûr de vouloir vous déconnecter ?"
        confirmLabel="Se déconnecter"
        cancelLabel="Annuler"
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
      />
    </div>
  );
}
