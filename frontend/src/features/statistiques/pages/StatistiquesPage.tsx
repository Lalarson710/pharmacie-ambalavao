import { useMemo, useState, useEffect } from 'react';
import { Printer } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { PageTabs } from '@/components/PageTabs';
import { PageToolbar } from '@/components/PageToolbar';
import { produitsPlusVendus, ventes } from '@/data/mockData';
import { ChiffreAffairesTab } from './tabs/ChiffreAffairesTab';
import { ProduitsPlusVendusTab } from './tabs/ProduitsPlusVendusTab';
import { ResumeTab } from './tabs/ResumeTab';
import { statistiquesTabs } from './tabs/tabsConfig';
import { VentesTab } from './tabs/VentesTab';
import { usePermissions } from '@/hooks/usePermissions';

export function StatistiquesPage() {
  const { hasPermission } = usePermissions();

  // Permission mapping for tabs
  const tabPermissions: Record<string, string> = {
    resume: 'statistique.view',
    ca: 'statistique.view',
    ventes: 'statistique.view',
    produits: 'statistique.view',
  };

  // Filter tabs based on view permissions
  const allowedTabs = statistiquesTabs.filter((tab) => hasPermission(tabPermissions[tab.id]));
  const defaultActiveTab = allowedTabs[0]?.id ?? 'resume';

  const [activeTab, setActiveTab] = useState(defaultActiveTab);
  const [dateDebut, setDateDebut] = useState('2025-09-01');
  const [dateFin, setDateFin] = useState('2025-09-12');
  const [appliedDateDebut, setAppliedDateDebut] = useState('2025-09-01');
  const [appliedDateFin, setAppliedDateFin] = useState('2025-09-12');

  // Check permissions for active tab
  const canView = hasPermission(tabPermissions[activeTab]);
  const canPrint = hasPermission('statistique.print');
  const canExport = hasPermission('statistique.export');

  const handleRefresh = () => {
    if (!dateDebut || !dateFin) {
      alert('Veuillez renseigner les deux dates.');
      return;
    }

    if (dateDebut > dateFin) {
      alert('La date de début ne peut pas être après la date de fin.');
      return;
    }

    setAppliedDateDebut(dateDebut);
    setAppliedDateFin(dateFin);
  };

  // Load data if user has view permission
  useEffect(() => {
    if (!canView) return;
    // Simulate data loading
    setTimeout(() => {
      // No loading state needed
    }, 300);
  }, [canView]);

  const ventesPeriode = useMemo(
    () =>
      ventes.filter(
        (vente) =>
          vente.date_vente >= appliedDateDebut &&
          vente.date_vente <= appliedDateFin,
      ),
    [appliedDateDebut, appliedDateFin],
  );

  const chiffreAffairesTotal = ventesPeriode.reduce(
    (total, vente) => total + Number(vente.montant_total),
    0,
  );

  const handlePrint = () => {
    window.print();
  };

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
        subtitle="Analyse des ventes et du chiffre d'affaires"
      />

      <PageToolbar
        actions={
          <>
            {canPrint && (
              <button type="button" className="btn-primary" onClick={handlePrint}>
                <Printer size={15} />
                Imprimer
              </button>
            )}
            {canExport && (
              <button type="button" className="btn-secondary" onClick={() => { /* TODO: export */ }}>
                Exporter
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
          chiffreAffairesTotal={chiffreAffairesTotal}
          dateDebut={dateDebut}
          dateFin={dateFin}
          onDateDebutChange={setDateDebut}
          onDateFinChange={setDateFin}
          onRefresh={handleRefresh}
        />
      )}

      {activeTab === 'ca' && (
        <ChiffreAffairesTab
          chiffreAffairesTotal={chiffreAffairesTotal}
          appliedDateDebut={appliedDateDebut}
          appliedDateFin={appliedDateFin}
          dateDebut={dateDebut}
          dateFin={dateFin}
          onDateDebutChange={setDateDebut}
          onDateFinChange={setDateFin}
          onRefresh={handleRefresh}
        />
      )}

      {activeTab === 'ventes' && (
        <VentesTab
          ventesPeriode={ventesPeriode}
          dateDebut={dateDebut}
          dateFin={dateFin}
          onDateDebutChange={setDateDebut}
          onDateFinChange={setDateFin}
          onRefresh={handleRefresh}
        />
      )}

      {activeTab === 'produits' && (
        <ProduitsPlusVendusTab
          produitsPlusVendus={produitsPlusVendus}
          dateDebut={dateDebut}
          dateFin={dateFin}
          onDateDebutChange={setDateDebut}
          onDateFinChange={setDateFin}
          onRefresh={handleRefresh}
        />
      )}
    </div>
  );
}
