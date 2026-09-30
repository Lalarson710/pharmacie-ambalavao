import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Download, Printer, RefreshCw } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { PageTabs } from '@/components/PageTabs';
import { PageToolbar } from '@/components/PageToolbar';
import { useToast } from '@/components/Toast';
import type { ProduitPlusVendu, Vente } from '@/types';
import { ChiffreAffairesTab } from './tabs/ChiffreAffairesTab';
import { ProduitsPlusVendusTab } from './tabs/ProduitsPlusVendusTab';
import { ResumeTab } from './tabs/ResumeTab';
import { statistiquesTabs } from './tabs/tabsConfig';
import { VentesTab } from './tabs/VentesTab';
import { ExportModal } from './tabs/ExportModal';
import { statistiquesApi } from '../api/statistiques';
import { usePermissions } from '@/hooks/usePermissions';

const tabPermissions: Record<string, string> = {
  resume: 'statistique.view',
  ca: 'statistique.view',
  ventes: 'statistique.view',
  produits: 'statistique.view',
};

/** Periode par defaut : mois en cours (aligne sur le backend). */
function defaultPeriod() {
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  const iso = (date: Date) => date.toISOString().slice(0, 10);
  return { debut: iso(first), fin: iso(now) };
}

export function StatistiquesPage() {
  const { hasPermission } = usePermissions();
  const { showToast } = useToast();

  const allowedTabs = statistiquesTabs.filter((tab) =>
    hasPermission(tabPermissions[tab.id]),
  );

  const [activeTab, setActiveTab] = useState(allowedTabs[0]?.id ?? 'resume');

  const initial = defaultPeriod();
  const [dateDebut, setDateDebut] = useState(initial.debut);
  const [dateFin, setDateFin] = useState(initial.fin);
  const [appliedDateDebut, setAppliedDateDebut] = useState(initial.debut);
  const [appliedDateFin, setAppliedDateFin] = useState(initial.fin);

  const [ventes, setVentes] = useState<Vente[]>([]);
  const [produitsPlusVendus, setProduitsPlusVendus] = useState<ProduitPlusVendu[]>([]);
  const [chiffreAffaires, setChiffreAffaires] = useState(0);
  const [loading, setLoading] = useState(true);
  const [exportOpen, setExportOpen] = useState(false);

  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const canView = hasPermission('statistique.view');
  const canPrint = hasPermission('statistique.print');
  const canExport = hasPermission('statistique.export');

  const load = useCallback(async () => {
    if (!canView) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const params = { date_debut: appliedDateDebut, date_fin: appliedDateFin };
      const [statsVentes, topProduits, ca] = await Promise.all([
        statistiquesApi.getVentes(params),
        statistiquesApi.getProduitsPlusVendus(params),
        statistiquesApi.getChiffreAffaires(params),
      ]);

      if (!mounted.current) return;

      setVentes(statsVentes?.ventes ?? []);
      setProduitsPlusVendus(topProduits ?? []);
      setChiffreAffaires(Number(ca?.chiffre_affaires ?? 0));
    } catch (error: unknown) {
      if (!mounted.current) return;
      const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
      showToast(
        axiosError.response?.data?.message ??
          'Impossible de charger les statistiques.',
        'error',
      );
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, [appliedDateDebut, appliedDateFin, canView, showToast]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleRefresh = () => {
    if (!dateDebut || !dateFin) {
      showToast('Veuillez renseigner les deux dates.', 'error');
      return;
    }
    if (dateDebut > dateFin) {
      showToast('La date de début ne peut pas être après la date de fin.', 'error');
      return;
    }
    setAppliedDateDebut(dateDebut);
    setAppliedDateFin(dateFin);
  };

  const ventesPeriode = useMemo(() => ventes, [ventes]);

  const onRefresh = useMemo(
    () => () => {
      if (appliedDateDebut === dateDebut && appliedDateFin === dateFin) {
        void load();
      } else {
        handleRefresh();
      }
    },
    [appliedDateDebut, appliedDateFin, dateDebut, dateFin, load],
  );

  if (!canView || allowedTabs.length === 0) {
    return (
      <div className="page-container">
        <div className="page-empty-state">
          <div className="empty-state-icon">🔒</div>
          <h2>Accès non autorisé</h2>
          <p>Vous n'avez pas les permissions nécessaires pour accéder à ce module.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <PageHeader
        title="Statistiques"
        subtitle={`${ventes.length} vente(s) — ${produitsPlusVendus.length} produit(s) sur la période`}
      />

      <PageToolbar
        actions={
          <>
            <button
              type="button"
              className="btn-ghost btn-sm"
              onClick={handleRefresh}
              disabled={loading}
              title="Appliquer la période"
            >
              <RefreshCw size={15} /> Actualiser
            </button>

            {canPrint && (
              <button
                type="button"
                className="btn-primary"
                onClick={() => window.print()}
              >
                <Printer size={15} /> Imprimer
              </button>
            )}

            {canExport && (
              <button
                type="button"
                className="btn-export-pdf"
                onClick={() => setExportOpen(true)}
                disabled={loading}
                title="Exporter les données"
              >
                <Download size={15} /> Exporter
              </button>
            )}
          </>
        }
      />

      <PageTabs
        tabs={allowedTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'resume' && (
        <ResumeTab
          ventesPeriode={ventesPeriode}
          chiffreAffairesTotal={chiffreAffaires}
          dateDebut={dateDebut}
          dateFin={dateFin}
          onDateDebutChange={setDateDebut}
          onDateFinChange={setDateFin}
          onRefresh={onRefresh}
          loading={loading}
          produitsPlusVendus={produitsPlusVendus}
        />
      )}

      {activeTab === 'ca' && (
        <ChiffreAffairesTab
          chiffreAffairesTotal={chiffreAffaires}
          appliedDateDebut={appliedDateDebut}
          appliedDateFin={appliedDateFin}
          dateDebut={dateDebut}
          dateFin={dateFin}
          onDateDebutChange={setDateDebut}
          onDateFinChange={setDateFin}
          onRefresh={onRefresh}
        />
      )}

      {activeTab === 'ventes' && (
        <VentesTab
          ventesPeriode={ventesPeriode}
          dateDebut={dateDebut}
          dateFin={dateFin}
          onDateDebutChange={setDateDebut}
          onDateFinChange={setDateFin}
          onRefresh={onRefresh}
        />
      )}

      {activeTab === 'produits' && (
        <ProduitsPlusVendusTab
          produitsPlusVendus={produitsPlusVendus}
          dateDebut={dateDebut}
          dateFin={dateFin}
          onDateDebutChange={setDateDebut}
          onDateFinChange={setDateFin}
          onRefresh={onRefresh}
        />
      )}

      <ExportModal
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        dateDebut={appliedDateDebut}
        dateFin={appliedDateFin}
        ventes={ventes}
        produitsPlusVendus={produitsPlusVendus}
        chiffreAffaires={chiffreAffaires}
      />
    </div>
  );
}
