import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BadgeDollarSign,
  Banknote,
  Boxes,
  CalendarClock,
  ClipboardList,
  Package,
  RefreshCw,
  ShoppingCart,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/PageHeader';
import { BarChart } from '@/components/charts/BarChart';
import { DonutChart } from '@/components/charts/DonutChart';
import { LineAreaChart } from '@/components/charts/LineAreaChart';
import { Sparkline } from '@/components/charts/Sparkline';
import { useToast } from '@/components/Toast';
import { formatCurrency, formatStatut, getStatutBadgeClass } from '@/utils/formatters';
import {
  DASHBOARD_PERIODES,
  dashboardApi,
  type DashboardPayload,
} from '../api/dashboard';

type Tone = 'green' | 'amber' | 'red' | 'blue' | 'purple' | 'teal';

const CATEGORY_COLORS = [
  '#67af1a',
  '#2f9e8f',
  '#f0a202',
  '#4d7fe0',
  '#a3559b',
  '#e2603f',
  '#5c8a3a',
  '#7a8ca0',
];

const STATUT_COLORS: Record<string, string> = {
  confirmee: '#67af1a',
  brouillon: '#f0a202',
  annulee: '#e2603f',
};

// ─────────────────────────────────────────────────────────────────────────────
//  Sous-composants
// ─────────────────────────────────────────────────────────────────────────────

interface KpiCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  tone: Tone;
  evolution?: number;
  evolutionLabel?: string;
  spark?: number[];
  sparkColor?: string;
  footer?: string;
  to?: string;
}

function KpiCard({
  label,
  value,
  icon,
  tone,
  evolution,
  evolutionLabel = 'par rapport à la période précédente',
  spark,
  sparkColor,
  footer,
  to,
}: KpiCardProps) {
  const hasEvolution = typeof evolution === 'number' && Number.isFinite(evolution);
  const positive = hasEvolution && (evolution as number) >= 0;

  const content = (
    <>
      <div className="kpi-top">
        <span className={`kpi-icon kpi-icon-${tone}`}>{icon}</span>
        {hasEvolution && (
          <span className={`kpi-trend ${positive ? 'up' : 'down'}`}>
            {positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {Math.abs(evolution as number).toFixed(1)}%
          </span>
        )}
      </div>
      <span className="kpi-label">{label}</span>
      <span className="kpi-value">{value}</span>
      <div className="kpi-foot">
        {footer ? <span className="kpi-footer-text">{footer}</span> : null}
        {spark && spark.length > 1 ? (
          <Sparkline values={spark} color={sparkColor ?? '#67af1a'} />
        ) : null}
      </div>
      {hasEvolution && <span className="kpi-compare">{evolutionLabel}</span>}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={`kpi-card kpi-card-${tone} kpi-card-link`}>
        {content}
      </Link>
    );
  }

  return <div className={`kpi-card kpi-card-${tone}`}>{content}</div>;
}

interface PanelProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}

function Panel({ title, subtitle, icon, action, className, children }: PanelProps) {
  return (
    <section className={`dash-panel ${className ?? ''}`}>
      <header className="dash-panel-head">
        <div className="dash-panel-title">
          {icon}
          <div>
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
        </div>
        {action}
      </header>
      <div className="dash-panel-body">{children}</div>
    </section>
  );
}

function SkeletonDashboard() {
  return (
    <div className="dash-skeleton">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="dash-skeleton-block" />
      ))}
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="dash-error">
      <AlertTriangle size={34} />
      <h2>Impossible de charger le tableau de bord</h2>
      <p>Vérifiez la connexion au serveur puis relancez le chargement.</p>
      <button type="button" className="btn-primary" onClick={onRetry}>
        <RefreshCw size={15} />
        Réessayer
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Page
// ─────────────────────────────────────────────────────────────────────────────

export function DashboardPage() {
  const { showToast } = useToast();
  const [periode, setPeriode] = useState<number>(30);
  const [data, setData] = useState<DashboardPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const charger = useCallback(
    async (jours: number) => {
      setLoading(true);
      setError(false);
      try {
        const payload = await dashboardApi.get(jours);
        setData(payload);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void charger(periode);
  }, [charger, periode]);

  const handleRefresh = useCallback(() => {
    void charger(periode);
    showToast('Tableau de bord actualisé', 'success');
  }, [charger, periode, showToast]);

  const caSeries = useMemo(
    () => data?.evolution_ca.map((p) => ({ label: p.label, value: p.ca })) ?? [],
    [data],
  );

  /**
   * Phrase en toutes lettres sous la courbe principale : le montant total,
   * le meilleur jour et la tendance par rapport a la periode precedente.
   */
  const resumeCa = useMemo(() => {
    const k = data?.kpis;
    if (!k) return '';

    if (k.chiffre_affaires === 0) {
      return 'Aucune vente enregistrée sur la période.';
    }

    const points = data?.evolution_ca ?? [];
    const avecCa = points.filter((p) => p.ca > 0);
    const meilleur = avecCa.length
      ? avecCa.reduce((a, b) => (a.ca >= b.ca ? a : b))
      : null;

    const tendance =
      k.evolution_ca > 0
        ? `C'est en hausse de ${k.evolution_ca.toFixed(1)}% par rapport à la période précédente.`
        : k.evolution_ca < 0
          ? `C'est en baisse de ${Math.abs(k.evolution_ca).toFixed(1)}% par rapport à la période précédente.`
          : "C'est stable par rapport à la période précédente.";

    const record = meilleur
      ? ` Le meilleur jour est le ${meilleur.label} avec ${formatCurrency(meilleur.ca)}.`
      : '';

    return `Vous avez encaissé ${formatCurrency(k.chiffre_affaires)} au total. ${tendance}${record}`;
  }, [data]);

  /**
   * Nombre de ventes par jour. Au-dela de 45 jours l'histogramme est regroupe
   * par semaine afin de rester lisible et fluide.
   */
  const ventesSeries = useMemo(() => {
    const points = data?.evolution_ca ?? [];
    if (points.length <= 45) {
      return points.map((p) => ({ label: p.label, value: p.ventes }));
    }

    const semaine = 7;
    const groupes: { label: string; value: number }[] = [];

    for (let i = 0; i < points.length; i += semaine) {
      const tranche = points.slice(i, i + semaine);
      groupes.push({
        label: tranche[0].label,
        value: tranche.reduce((sum, p) => sum + p.ventes, 0),
      });
    }

    return groupes;
  }, [data]);

  const jourSemaineSeries = useMemo(
    () =>
      data?.repartition_ventes.map((p) => ({
        label: p.jour,
        value: p.ca,
        fullLabel: p.jour,
      })) ?? [],
    [data],
  );

  /**
   * Phrase en toutes lettres resumeant le jour le plus rentable, pour que
   * l'utilisateur n'ait pas a interpreter lui-meme l'histogramme.
   */
  const resumeJourSemaine = useMemo(() => {
    const points = data?.repartition_ventes ?? [];
    const avecCa = points.filter((p) => p.ca > 0);

    if (avecCa.length === 0) {
      return 'Aucune vente enregistrée sur la période.';
    }

    const meilleur = avecCa.reduce((a, b) => (a.ca >= b.ca ? a : b));
    const pire = avecCa.reduce((a, b) => (a.ca <= b.ca ? a : b));
    const moyenne = avecCa.reduce((s, p) => s + p.ca, 0) / avecCa.length;

    return `Le meilleur jour est ${meilleur.jour.toLowerCase()} avec ${formatCurrency(meilleur.ca)} d’TOTAL. Le jour le plus calme est ${pire.jour.toLowerCase()} (${formatCurrency(pire.ca)}). Moyenne : ${formatCurrency(moyenne)} par jour actif.`;
  }, [data]);

  /**
   * Phrase explicative du nombre de ventes par jour.
   */
  const resumeVentes = useMemo(() => {
    const nbJours = data?.evolution_ca.length ?? 0;
    const total = data?.kpis.nombre_ventes ?? 0;

    if (total === 0) {
      return 'Aucune vente enregistrée sur la période.';
    }

    const moyenne = total / Math.max(nbJours, 1);
    const parJour = ventesSeries.reduce((s, p) => s + p.value, 0);
    const meilleur = ventesSeries.reduce(
      (a, b) => (a.value >= b.value ? a : b),
      ventesSeries[0] ?? { label: '', value: 0 },
    );

    return `En moyenne ${moyenne.toFixed(1)} vente(s) par jour, soit ${parJour} au total. Le record est de ${meilleur.value} vente(s) le ${meilleur.label}.`;
  }, [data, ventesSeries]);

  const categoriesSlices = useMemo(
    () =>
      (data?.repartition_categories ?? []).slice(0, 6).map((c, i) => ({
        label: c.categorie,
        value: c.chiffre_affaires,
        color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
      })),
    [data],
  );

  const statutsSlices = useMemo(
    () =>
      (data?.repartition_statuts ?? []).map((s) => ({
        label: formatStatut(s.statut),
        value: s.total,
        color: STATUT_COLORS[s.statut] ?? '#7a8ca0',
      })),
    [data],
  );

  if (loading && !data) {
    return (
      <div className="page-container">
        <PageHeader title="Tableau de bord" subtitle="Analyse en cours…" />
        <SkeletonDashboard />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="page-container">
        <PageHeader title="Tableau de bord" subtitle="Vue d’ensemble" />
        <ErrorState onRetry={() => void charger(periode)} />
      </div>
    );
  }

  if (!data) return null;

  const { kpis, alertes, caisse, creances, valorisation_stock, approvisionnement } = data;
  const sparkRecent = data.evolution_ca.slice(-14).map((p) => p.ca);
  const sparkVentes = data.evolution_ca.slice(-14).map((p) => p.ventes);
  const totalAlertes = alertes.total;

  return (
    <div className="page-container dash-page">
      <PageHeader
        title="Tableau de bord"
        subtitle="L'essentiel de votre activité, en un coup d'œil"
        actions={
          <>
            <div className="period-switch" role="group" aria-label="Période d'analyse">
              {DASHBOARD_PERIODES.map((p) => (
                <button
                  key={p.jours}
                  type="button"
                  className={p.jours === periode ? 'active' : ''}
                  onClick={() => setPeriode(p.jours)}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="btn-ghost"
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCw size={15} className={loading ? 'spin' : ''} />
              Actualiser
            </button>
          </>
        }
      />

      {/* ── Bandeau de vigilance ── */}
      {totalAlertes > 0 && (
        <div className="dash-alert-banner">
          <AlertTriangle size={18} />
          <span>
            <strong>{totalAlertes}</strong> alerte{totalAlertes > 1 ? 's' : ''} nécessite
            {totalAlertes > 1 ? 'nt' : ''} votre attention
          </span>
          <div className="dash-alert-chips">
            {alertes.ruptures.length > 0 && (
              <span className="chip chip-red">{alertes.ruptures.length} rupture(s)</span>
            )}
            {alertes.stocks_faibles.length > 0 && (
              <span className="chip chip-amber">
                {alertes.stocks_faibles.length} stock(s) faible(s)
              </span>
            )}
            {alertes.peremptions.length > 0 && (
              <span className="chip chip-orange">
                {alertes.peremptions.length} péremption(s)
              </span>
            )}
          </div>
          <Link to="/alertes" className="btn-ghost btn-sm">
            Traiter
          </Link>
        </div>
      )}

      {/* ── KPIs principaux ── */}
      <section className="kpi-grid">
        <KpiCard
          label="Total encaissé"
          value={formatCurrency(kpis.chiffre_affaires)}
          icon={<TrendingUp size={19} />}
          tone="green"
          evolution={kpis.evolution_ca}
          spark={sparkRecent}
          to="/statistiques"
        />
        <KpiCard
          label="Ventes réalisées"
          value={String(kpis.nombre_ventes)}
          icon={<ShoppingCart size={19} />}
          tone="blue"
          evolution={kpis.evolution_ventes}
          spark={sparkVentes}
          sparkColor="#4d7fe0"
          to="/ventes"
        />
        <KpiCard
          label="Montant d'un achat type"
          value={formatCurrency(kpis.panier_moyen)}
          icon={<Wallet size={19} />}
          tone="purple"
          evolution={kpis.evolution_panier}
          to="/ventes"
        />
        <KpiCard
          label="Bénéfice réel"
          value={formatCurrency(kpis.marge_brute)}
          icon={<BadgeDollarSign size={19} />}
          tone="teal"
          footer={`Taux de marge ${kpis.taux_marge.toFixed(1)}%`}
          to="/statistiques"
        />
        <KpiCard
          label="Clients enregistrés"
          value={String(kpis.clients_actifs)}
          icon={<Users size={19} />}
          tone="blue"
          footer={`+${kpis.nouveaux_clients} sur la période`}
          to="/clients"
        />
        <KpiCard
          label="Produits en vente"
          value={String(kpis.produits_actifs)}
          icon={<Package size={19} />}
          tone="green"
          footer={`${kpis.categories_actives} catégorie(s)`}
          to="/produits"
        />
        <KpiCard
          label="Argent immobilisé en stock"
          value={formatCurrency(valorisation_stock.valeur_achat)}
          icon={<Boxes size={19} />}
          tone="amber"
          footer={`${valorisation_stock.unites.toLocaleString('fr-FR')} unités · rotation ${valorisation_stock.rotation_mois} mois`}
          to="/stock"
        />
        <KpiCard
          label="Impayés à relancer"
          value={formatCurrency(creances.montant_total)}
          icon={<Banknote size={19} />}
          tone="red"
          footer={`${creances.nombre} facture(s) non soldée(s)`}
          to="/ventes"
        />
      </section>

      {/* ── Courbe principale + caisse ── */}
      <section className="dash-grid dash-grid-main">
        <Panel
          title="Combien ai-je gagné ?"
          subtitle={`Total encaissé jour par jour sur les ${periode} derniers jours`}
          icon={<TrendingUp size={17} />}
          className="span-2"
        >
          <LineAreaChart
            data={caSeries}
            height={280}
            formatValue={(v) => `${Math.round(v / 1000)}k`}
            formatValueFull={formatCurrency}
          />
          <p className="chart-summary">{resumeCa}</p>
          <div className="dash-inline-stats">
            <div>
              <span>Gain aujourd'hui</span>
              <strong>{formatCurrency(data.chiffre_affaires_jour)}</strong>
            </div>
            <div>
              <span>Ventes aujourd'hui</span>
              <strong>{data.ventes_jour}</strong>
            </div>
            <div>
              <span>Dépensé en achats</span>
              <strong>{formatCurrency(kpis.montant_achats)}</strong>
            </div>
            <div>
              <span>Gain si tout se vend</span>
              <strong>{formatCurrency(valorisation_stock.marge_potentielle)}</strong>
            </div>
          </div>
        </Panel>

        <Panel
          title="Caisse du jour"
          subtitle={caisse ? `Ouverte par ${caisse.utilisateur}` : 'Aucune caisse ouverte'}
          icon={<Wallet size={17} />}
          action={
            <Link to="/caisses" className="btn-ghost btn-sm">
              Gérer
            </Link>
          }
        >
          {caisse ? (
            <div className="caisse-panel">
              <div className="caisse-sold">
                <span>Solde théorique</span>
                <strong>{formatCurrency(caisse.solde_theorique)}</strong>
              </div>
              <div className="caisse-rows">
                <div>
                  <span>Fond de caisse</span>
                  <b>{formatCurrency(caisse.montant_initial)}</b>
                </div>
                <div>
                  <span>Entrées</span>
                  <b className="text-green">{formatCurrency(caisse.entrees)}</b>
                </div>
                <div>
                  <span>Sorties</span>
                  <b className="text-red">{formatCurrency(caisse.sorties)}</b>
                </div>
                <div>
                  <span>Ouverte le</span>
                  <b>
                    {new Date(caisse.date_ouverture).toLocaleString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </b>
                </div>
              </div>
            </div>
          ) : (
            <div className="caisse-empty">
              <Wallet size={26} />
              <p>Aucune caisse ouverte. Ouvrez-en une pour encaisser des ventes.</p>
              <Link to="/caisses" className="btn-primary btn-sm">
                Ouvrir une caisse
              </Link>
            </div>
          )}

          <div className="caisse-appro">
            <div>
              <span>Achats en attente</span>
              <b>
                {approvisionnement.en_attente.nombre} ·{' '}
                {formatCurrency(approvisionnement.en_attente.montant)}
              </b>
            </div>
            <div>
              <span>Commandes confirmées</span>
              <b>
                {approvisionnement.confirmees.nombre} ·{' '}
                {formatCurrency(approvisionnement.confirmees.montant)}
              </b>
            </div>
          </div>
        </Panel>
      </section>

      {/* ── Graphiques secondaires ── */}
      <section className="dash-grid dash-grid-three">
        <Panel
          title="Quel jour rapporte le plus ?"
          subtitle="Total encaissé selon le jour de la semaine"
          icon={<CalendarClock size={17} />}
        >
          <BarChart
            data={jourSemaineSeries}
            height={230}
            formatValue={(v) => `${Math.round(v / 1000)}k`}
          />
          <p className="chart-summary">{resumeJourSemaine}</p>
        </Panel>

        <Panel
          title="Que vend-on le plus ?"
          subtitle="Part du chiffre d'affaires par famille de produits"
          icon={<ClipboardList size={17} />}
        >
          <DonutChart
            data={categoriesSlices}
            centerLabel="Total gagné"
            centerValue={formatCurrency(kpis.chiffre_affaires)}
            formatValue={formatCurrency}
          />
        </Panel>

        <Panel
          title="Où en sont les ventes ?"
          subtitle="Validées, en brouillon ou annulées"
          icon={<Boxes size={17} />}
        >
          <DonutChart
            data={statutsSlices}
            size={170}
            centerLabel="Ventes"
            formatValue={(v) => String(Math.round(v))}
          />
        </Panel>
      </section>

      {/* ── Palmarès + volumes ── */}
      <section className="dash-grid dash-grid-main">
        <Panel
          title="Les médicaments stars"
          subtitle="Ce qui rapporte le plus d'argent"
          icon={<Package size={17} />}
          className="span-2"
          action={
            <Link to="/statistiques" className="btn-ghost btn-sm">
              Détails
            </Link>
          }
        >
          {data.top_produits.length > 0 ? (
            <div className="ranking-list">
              {data.top_produits.map((p, i) => {
                const max = data.top_produits[0].chiffre_affaires || 1;
                return (
                  <div key={p.id} className="ranking-item">
                    <span className="ranking-rank">{i + 1}</span>
                    <div className="ranking-body">
                      <div className="ranking-head">
                        <span className="ranking-name">{p.nom}</span>
                        <span className="ranking-value">
                          {formatCurrency(p.chiffre_affaires)}
                        </span>
                      </div>
                      <div className="ranking-bar">
                        <div
                          style={{
                            width: `${Math.max((p.chiffre_affaires / max) * 100, 3)}%`,
                          }}
                        />
                      </div>
                      <span className="ranking-meta">{p.quantite} unités vendues</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="no-data">Aucune vente enregistrée sur la période.</p>
          )}
        </Panel>

        <Panel
          title="Combien de ventes chaque jour ?"
          subtitle="Nombre de tickets de caisse par jour"
          icon={<ShoppingCart size={17} />}
        >
          <BarChart
            data={ventesSeries}
            height={260}
            color="#4d7fe0"
            formatValue={(v) => String(Math.round(v))}
          />
          <p className="chart-summary">{resumeVentes}</p>
        </Panel>
      </section>

      {/* ── Alertes détaillées ── */}
      <section className="dash-grid dash-grid-three">
        <Panel
          title="Stocks faibles"
          subtitle="À réapprovisionner"
          icon={<AlertTriangle size={17} />}
          action={
            <Link to="/alertes" className="btn-ghost btn-sm">
              Voir tout
            </Link>
          }
        >
          {alertes.stocks_faibles.length === 0 ? (
            <p className="no-data">Tous les stocks sont au-dessus du seuil.</p>
          ) : (
            <ul className="mini-list">
              {alertes.stocks_faibles.slice(0, 6).map((a) => (
                <li key={a.id}>
                  <span className="mini-name">{a.nom}</span>
                  <span className="mini-meta">
                    {a.stock} / {a.stock_minimum} min.
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel
          title="Ruptures de stock"
          subtitle="Produits indisponibles"
          icon={<AlertTriangle size={17} />}
        >
          {alertes.ruptures.length === 0 ? (
            <p className="no-data">Aucune rupture de stock.</p>
          ) : (
            <ul className="mini-list mini-list-danger">
              {alertes.ruptures.slice(0, 6).map((a) => (
                <li key={a.id}>
                  <span className="mini-name">{a.nom}</span>
                  <span className="mini-meta">Rupture</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel
          title="Péremptions proches"
          subtitle="Lots à écouler en priorité"
          icon={<CalendarClock size={17} />}
        >
          {data.top_peremptions.length === 0 ? (
            <p className="no-data">Aucun lot à surveiller.</p>
          ) : (
            <ul className="mini-list mini-list-expiry">
              {data.top_peremptions.map((l) => (
                <li key={l.id}>
                  <span className="mini-name">{l.produit}</span>
                  <span
                    className={`expiry-tag expiry-${l.criticite}`}
                  >
                    {l.jours_restants <= 0
                      ? 'Expiré'
                      : `${l.jours_restants} j restants`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </section>

      {/* ── Tableaux de bord bas ── */}
      <section className="dash-grid dash-grid-main">
        <Panel
          title="Dernières ventes"
          subtitle="Activité récente de la pharmacie"
          icon={<ShoppingCart size={17} />}
          className="span-2"
          action={
            <Link to="/ventes" className="btn-ghost btn-sm">
              Toutes les ventes
            </Link>
          }
        >
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Numéro</th>
                  <th>Date</th>
                  <th>Client</th>
                  <th>Montant</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {data.dernieres_ventes.map((v) => (
                  <tr key={v.id}>
                    <td>{v.numero}</td>
                    <td>
                      {new Date(v.date_vente).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit',
                      })}
                    </td>
                    <td>{v.client}</td>
                    <td className="text-strong">{formatCurrency(v.montant_total)}</td>
                    <td>
                      <span className={`badge ${getStatutBadgeClass(v.statut)}`}>
                        {formatStatut(v.statut)}
                      </span>
                    </td>
                  </tr>
                ))}
                {data.dernieres_ventes.length === 0 && (
                  <tr>
                    <td colSpan={5} className="empty-cell">
                      Aucune vente enregistrée.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel
          title="Qui nous doit de l'argent ?"
          subtitle="Factures pas encore payées"
          icon={<Banknote size={17} />}
        >
          {creances.lignes.length === 0 ? (
            <p className="no-data">Aucune créance en cours.</p>
          ) : (
            <ul className="mini-list mini-list-claim">
              {creances.lignes.map((c) => (
                <li key={c.id}>
                  <div>
                    <span className="mini-name">{c.numero}</span>
                    <span className="mini-meta">
                      {c.anciennete_jours} j · {formatStatut(c.statut)}
                    </span>
                  </div>
                  <span className="mini-amount">{formatCurrency(c.reste_a_payer)}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </section>
    </div>
  );
}
