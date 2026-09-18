import { useMemo, useState } from 'react';
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

export function StatistiquesPage() {
  const [activeTab, setActiveTab] = useState('resume');
  const [dateDebut, setDateDebut] = useState('2025-09-01');
  const [dateFin, setDateFin] = useState('2025-09-12');
  const [appliedDateDebut, setAppliedDateDebut] = useState('2025-09-01');
  const [appliedDateFin, setAppliedDateFin] = useState('2025-09-12');

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

  return (
    <div className="page-container">
      <PageHeader
        title="Statistiques"
        subtitle="Analyse des ventes et du chiffre d'affaires"
      />

      <PageToolbar
        actions={
          <button type="button" className="btn-primary" onClick={handlePrint}>
            <Printer size={15} />
            Imprimer
          </button>
        }
      />

      <PageTabs
        tabs={statistiquesTabs}
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
