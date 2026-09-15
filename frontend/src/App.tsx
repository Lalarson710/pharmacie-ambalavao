import { useEffect } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';
import { Layout } from './components/Layout';
import { LoginPage } from './features/auth/pages/LoginPage';
import { DashboardPage } from './features/dashboard/pages/DashboardPage';
import { ProduitsPage } from './features/produits/pages/ProduitsPage';
import { StockPage } from './features/stock/pages/StockPage';
import { FournisseursPage } from './features/fournisseurs/pages/FournisseursPage';
import { AchatsPage } from './features/achats/pages/AchatsPage';
import { ClientsPage } from './features/clients/pages/ClientsPage';
import { VentesPage } from './features/ventes/pages/VentesPage';
import { CaissesPage } from './features/caisses/pages/CaissesPage';
import { PersonnelPage } from './features/personnel/pages/PersonnelPage';
import { PermissionsPage } from './features/personnel/pages/PermissionsPage';
import { AlertesPage } from './features/alertes/pages/AlertesPage';
import { StatistiquesPage } from './features/statistiques/pages/StatistiquesPage';
import { RapportsPage } from './features/rapports/pages/RapportsPage';
import { SauvegardesPage } from './features/sauvegardes/pages/SauvegardesPage';
import { useAuth } from './features/auth/store/authStore';
import { RouterProvider } from 'react-router-dom';

function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirection vers la page de login en conservant l'URL demandée
      window.location.href = '/login';
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <div className="page-container">
        <p>Chargement…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <Outlet />;
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/fournisseurs" element={<FournisseursPage />} />
          <Route path="/produits" element={<ProduitsPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/achats" element={<AchatsPage />} />
          <Route path="/stock" element={<StockPage />} />
          <Route path="/ventes" element={<VentesPage />} />
          <Route path="/caisses" element={<CaissesPage />} />
          <Route path="/personnels" element={<PersonnelPage />} />
          <Route path="/personnels/permissions" element={<PermissionsPage />} />
          <Route path="/alertes" element={<AlertesPage />} />
          <Route path="/statistiques" element={<StatistiquesPage />} />
          <Route path="/rapports" element={<RapportsPage />} />
          <Route path="/sauvegardes" element={<SauvegardesPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </>
  ),
  { basename: '/' }
);

export default function App() {
  return <RouterProvider router={router} />;
}
