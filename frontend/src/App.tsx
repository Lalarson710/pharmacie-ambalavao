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
import { ProtectedRoute } from './components/ProtectedRoute';

const loadingStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  background: '#f6f5eb',
};

const spinnerStyle = {
  width: '40px',
  height: '40px',
  border: '3px solid #e0e0e0',
  borderTopColor: '#67af1a',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
  margin: '0 auto 16px',
};

const textStyle = {
  color: '#5a6e6c',
  fontSize: '14px',
};

function RootProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={loadingStyle}>
        <div style={{ textAlign: 'center' }}>
          <div style={spinnerStyle} />
          <p style={textStyle}>Chargement de l'application...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<RootProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          
          <Route element={<ProtectedRoute permission="fournisseur.view" />}>
            <Route path="/fournisseurs" element={<FournisseursPage />} />
          </Route>
          
          <Route element={<ProtectedRoute permission="produit.view" />}>
            <Route path="/produits" element={<ProduitsPage />} />
          </Route>
          
          <Route element={<ProtectedRoute permission="client.view" />}>
            <Route path="/clients" element={<ClientsPage />} />
          </Route>
          
          <Route element={<ProtectedRoute permission="achat.view" />}>
            <Route path="/achats" element={<AchatsPage />} />
          </Route>
          
          <Route element={<ProtectedRoute permission="stock.view" />}>
            <Route path="/stock" element={<StockPage />} />
          </Route>
          
          <Route element={<ProtectedRoute permission="vente.view" />}>
            <Route path="/ventes" element={<VentesPage />} />
          </Route>
          
          <Route element={<ProtectedRoute permission="caisse.open" />}>
            <Route path="/caisses" element={<CaissesPage />} />
          </Route>
          
          <Route element={<ProtectedRoute permission="personnel.view" />}>
            <Route path="/personnels" element={<PersonnelPage />} />
            <Route path="/personnels/permissions" element={<PermissionsPage />} />
          </Route>
          
          <Route element={<ProtectedRoute permission="alerte.view" />}>
            <Route path="/alertes" element={<AlertesPage />} />
          </Route>
          
          <Route element={<ProtectedRoute permission="statistique.view" />}>
            <Route path="/statistiques" element={<StatistiquesPage />} />
          </Route>
          
          <Route element={<ProtectedRoute permission="rapport.view" />}>
            <Route path="/rapports" element={<RapportsPage />} />
          </Route>
          
          <Route element={<ProtectedRoute permission="sauvegarde.view" />}>
            <Route path="/sauvegardes" element={<SauvegardesPage />} />
          </Route>
          
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
