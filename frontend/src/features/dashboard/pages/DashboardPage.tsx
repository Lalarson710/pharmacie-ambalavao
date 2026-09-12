import {
  AlertTriangle,
  BarChart3,
  Box,
  Calendar,
  CreditCard,
  Package,
  PiggyBank,
  ShoppingCart,
  TrendingUp,
  Users,
} from 'lucide-react';
import { dashboardData, produits, lots, ventes, factures, caisses, alertesStockFaible, alertesRupture, alertesPeremption, produitsPlusVendus, statistiquesVentes, chiffreAffaires } from '@/data/mockData';
import type { DashboardData } from '@/types';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color?: 'green' | 'orange' | 'red' | 'blue' | 'purple';
}

function StatCard({ label, value, icon, color = 'green' }: StatCardProps) {
  const colorClasses = {
    green: 'bg-green-50 border-green-200 text-green-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
    red: 'bg-red-50 border-red-200 text-red-700',
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
  };

  return (
    <div className={`stat-card ${colorClasses[color]}`}>
      <div className="stat-card-icon">{icon}</div>
      <div className="stat-card-content">
        <div className="stat-card-label">{label}</div>
        <div className="stat-card-value">{value}</div>
      </div>
    </div>
  );
}

function formatCurrency(value: number | string): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'MGA',
    minimumFractionDigits: 0,
  }).format(Number(value));
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('fr-FR');
}

export function DashboardPage() {
  const data: DashboardData = dashboardData;

  const statCards: { label: string; value: string | number; icon: React.ReactNode; color: 'green' | 'orange' | 'red' | 'blue' | 'purple' }[] = [
    {
      label: 'Produits actifs',
      value: data.total_produits,
      icon: <Package size={20} />,
      color: 'green',
    },
    {
      label: 'Ventes du jour',
      value: data.ventes_jour,
      icon: <ShoppingCart size={20} />,
      color: 'blue',
    },
    {
      label: 'CA du jour',
      value: formatCurrency(data.chiffre_affaires_jour),
      icon: <TrendingUp size={20} />,
      color: 'green',
    },
    {
      label: 'Stocks faibles',
      value: data.stocks_faibles,
      icon: <AlertTriangle size={20} />,
      color: 'orange',
    },
    {
      label: 'Ruptures de stock',
      value: data.ruptures,
      icon: <Box size={20} />,
      color: 'red',
    },
    {
      label: 'Pérémations proches',
      value: data.peremptions_proches,
      icon: <Calendar size={20} />,
      color: 'orange',
    },
    {
      label: 'Factures impayées',
      value: data.factures_impayees,
      icon: <CreditCard size={20} />,
      color: 'purple',
    },
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Tableau de bord</h1>
        <p className="dashboard-subtitle">
          Vue d’ensemble de la pharmacie d’Ambalavao
        </p>
      </div>

      {/* Stat cards */}
      <section className="stat-cards-grid">
        {statCards.map((card) => (
          <StatCard
            key={card.label}
            label={card.label}
            value={card.value}
            icon={card.icon}
            color={card.color}
          />
        ))}
      </section>

      {/* Two-column layout for charts and tables */}
      <div className="dashboard-grid">
        {/* Left column */}
        <div className="dashboard-col">
          {/* Caisse ouverte */}
          <section className="dashboard-section">
            <h2>Caisse ouverte</h2>
            {caisses.find((c) => c.statut === 'ouverte') ? (
              <div className="caisse-ouverte-card">
                <div className="caisse-ouverte-row">
                  <span className="caisse-ouverte-label">Montant initial :</span>
                  <span className="caisse-ouverte-value">
                    {formatCurrency(caisses.find((c) => c.statut === 'ouverte')!.montant_initial)}
                  </span>
                </div>
                <div className="caisse-ouverte-row">
                  <span className="caisse-ouverte-label">Ouverture :</span>
                  <span className="caisse-ouverte-value">
                    {formatDate(caisses.find((c) => c.statut === 'ouverte')!.date_ouverture)}
                  </span>
                </div>
                <div className="caisse-ouverte-row">
                  <span className="caisse-ouverte-label">Ouvert par :</span>
                  <span className="caisse-ouverte-value">
                    {caisses.find((c) => c.statut === 'ouverte')!.utilisateur?.name ?? '—'}
                  </span>
                </div>
              </div>
            ) : (
              <p className="no-data">Aucune caisse ouverte.</p>
            )}
          </section>

          {/* Alertes */}
          <section className="dashboard-section">
            <h2>Alertes récentes</h2>
            <div className="alertes-list">
              {alertesStockFaible.length > 0 && (
                <div className="alerte-item alerte-stock-faible">
                  <AlertTriangle size={16} />
                  <span>
                    {alertesStockFaible.length} produit(s) en stock faible
                  </span>
                </div>
              )}
              {alertesRupture.length > 0 && (
                <div className="alerte-item alerte-rupture">
                  <AlertTriangle size={16} />
                  <span>
                    {alertesRupture.length} produit(s) en rupture
                  </span>
                </div>
              )}
              {alertesPeremption.length > 0 && (
                <div className="alerte-item alerte-peremption">
                  <AlertTriangle size={16} />
                  <span>
                    {alertesPeremption.length} lot(s) proche(s) de pérémation
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* Statistiques ventes */}
          <section className="dashboard-section">
            <h2>Statistiques des ventes</h2>
            <div className="stats-grid">
              <div className="stat-mini">
                <span className="stat-mini-label">Nombre de ventes</span>
                <span className="stat-mini-value">{statistiquesVentes.nombre_ventes}</span>
              </div>
              <div className="stat-mini">
                <span className="stat-mini-label">Chiffre d’affaires</span>
                <span className="stat-mini-value">{formatCurrency(statistiquesVentes.chiffre_affaires)}</span>
              </div>
            </div>
          </section>
        </div>

        {/* Right column */}
        <div className="dashboard-col">
          {/* Produits récents */}
          <section className="dashboard-section">
            <h2>Produits (6 actifs)</h2>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Produit</th>
                    <th>Catégorie</th>
                    <th>Unité</th>
                    <th>Prix vente</th>
                    <th>Stock min.</th>
                    <th>Actif</th>
                  </tr>
                </thead>
                <tbody>
                  {produits.map((p, i) => (
                    <tr key={p.id}>
                      <td>{i + 1}</td>
                      <td>{p.nom}</td>
                      <td>{p.categorie?.nom ?? '—'}</td>
                      <td>{p.unite?.abreviation ?? '—'}</td>
                      <td>{formatCurrency(p.prix_vente)}</td>
                      <td>{p.stock_minimum}</td>
                      <td>
                        <span className={`badge ${p.actif ? 'badge-active' : 'badge-inactive'}`}>
                          {p.actif ? 'Oui' : 'Non'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Lots proches de pérémation */}
          <section className="dashboard-section">
            <h2>Lots proches de pérémation</h2>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Produit</th>
                    <th>Numéro de lot</th>
                    <th>Date de péremption</th>
                    <th>Quantité</th>
                  </tr>
                </thead>
                <tbody>
                  {lots
                    .filter((l) => l.quantite > 0)
                    .sort(
                      (a, b) =>
                        new Date(a.date_peremption).getTime() -
                        new Date(b.date_peremption).getTime()
                    )
                    .slice(0, 5)
                    .map((l, i) => (
                      <tr key={l.id}>
                        <td>{i + 1}</td>
                        <td>{l.produit?.nom ?? '—'}</td>
                        <td>{l.numero_lot}</td>
                        <td>{formatDate(l.date_peremption)}</td>
                        <td>{l.quantite}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Ventes récentes */}
          <section className="dashboard-section">
            <h2>Ventes récentes</h2>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Numéro</th>
                    <th>Date</th>
                    <th>Client</th>
                    <th>Montant</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {ventes.map((v, i) => (
                    <tr key={v.id}>
                      <td>{i + 1}</td>
                      <td>{v.numero}</td>
                      <td>{formatDate(v.date_vente)}</td>
                      <td>{v.client?.nom ?? '—'}</td>
                      <td>{formatCurrency(v.montant_total)}</td>
                      <td>
                        <span className={`badge ${v.statut === 'confirmee' ? 'badge-active' : v.statut === 'brouillon' ? 'badge-draft' : 'badge-inactive'}`}>
                          {v.statut}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Factures impayées */}
          <section className="dashboard-section">
            <h2>Factures impayées</h2>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Numéro</th>
                    <th>Date</th>
                    <th>Montant</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {factures
                    .filter((f) => f.statut !== 'payee')
                    .map((f, i) => (
                      <tr key={f.id}>
                        <td>{i + 1}</td>
                        <td>{f.numero}</td>
                        <td>{formatDate(f.date_facture)}</td>
                        <td>{formatCurrency(f.montant_total)}</td>
                        <td>
                          <span className={`badge ${f.statut === 'partiellement_payee' ? 'badge-warning' : 'badge-inactive'}`}>
                            {f.statut}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Produits plus vendus */}
          <section className="dashboard-section">
            <h2>Produits plus vendus</h2>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Produit</th>
                    <th>Qté vendue</th>
                    <th>CA</th>
                  </tr>
                </thead>
                <tbody>
                  {produitsPlusVendus.map((p, i) => (
                    <tr key={p.id}>
                      <td>{i + 1}</td>
                      <td>{p.nom}</td>
                      <td>{p.quantite_vendue}</td>
                      <td>{formatCurrency(p.chiffre_affaires)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Chiffre d'affaires */}
          <section className="dashboard-section">
            <h2>Chiffre d’affaires</h2>
            <div className="ca-card">
              <div className="ca-row">
                <span className="ca-label">Période :</span>
                <span className="ca-value">
                  {formatDate(chiffreAffaires.date_debut)} — {formatDate(chiffreAffaires.date_fin)}
                </span>
              </div>
              <div className="ca-row">
                <span className="ca-label">Montant :</span>
                <span className="ca-value ca-amount">
                  {formatCurrency(chiffreAffaires.chiffre_affaires)}
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
