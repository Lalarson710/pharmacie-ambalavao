import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { PageTabs } from '@/components/PageTabs';
import { PageToolbar } from '@/components/PageToolbar';
import { useToast } from '@/components/Toast';
import { CaisseDetailModal } from '@/components/CaisseDetailModal';
import type { Achat, Caisse, Fournisseur, MouvementCaisse } from '@/types';
import { caissesApi, mouvementsCaisseApi } from '../api/caisses';
import { fournisseursApi } from '../../fournisseurs/api/fournisseurs';
import { achatsApi } from '../../achats/api/achats';
import { caisseTabs } from './tabs/tabsConfig';
import { CaisseModal, type CaisseModalState } from './tabs/CaisseModal';
import { CaissesTab } from './tabs/CaissesTab';
import { MouvementsCaisseTab } from './tabs/MouvementsCaisseTab';

export function CaissesPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('caisses');
  const [caisseData, setCaisseData] = useState<Caisse[]>([]);
  const [mouvementsData, setMouvementsData] = useState<MouvementCaisse[]>([]);
  const [fournisseursData, setFournisseursData] = useState<Fournisseur[]>([]);
  const [achatsData, setAchatsData] = useState<Achat[]>([]);
  const [modal, setModal] = useState<CaisseModalState | null>(null);
  const [previewCaisse, setPreviewCaisse] = useState<Caisse | null>(null);
  const [printAfterOpen, setPrintAfterOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState({
    caisses: true,
    mouvements: true,
    fournisseurs: true,
    achats: true,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const result = await caissesApi.getAll();
        setCaisseData(result);
      } catch (error) {
        console.error('chargement caisses:', error);
        showToast('Impossible de charger les caisses.', 'error');
      } finally {
        setLoading((prev) => ({ ...prev, caisses: false }));
      }
    };
    load();
  }, [showToast]);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await mouvementsCaisseApi.getAll();
        setMouvementsData(result);
      } catch (error) {
        console.error('chargement mouvements de caisse:', error);
        showToast('Impossible de charger les mouvements de caisse.', 'error');
      } finally {
        setLoading((prev) => ({ ...prev, mouvements: false }));
      }
    };
    load();
  }, [showToast]);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await fournisseursApi.getAll();
        setFournisseursData(result);
      } catch (error) {
        console.error('chargement fournisseurs:', error);
      } finally {
        setLoading((prev) => ({ ...prev, fournisseurs: false }));
      }
    };
    load();
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await achatsApi.getAll();
        setAchatsData(result);
      } catch (error) {
        console.error('chargement achats:', error);
      } finally {
        setLoading((prev) => ({ ...prev, achats: false }));
      }
    };
    load();
  }, []);

  /**
   * Ouvre la fiche detaillee de la caisse puis declenche l'impression.
   * Le detail est charge depuis la liste : il ne requete pas l'API.
   */
  const handlePrint = (caisse: Caisse) => {
    setPreviewCaisse(caisse);
    setPrintAfterOpen(true);
  };

  const closePreview = () => {
    setPreviewCaisse(null);
  };

  useEffect(() => {
    if (printAfterOpen && previewCaisse) {
      const timer = setTimeout(() => {
        window.print();
        setPrintAfterOpen(false);
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [printAfterOpen, previewCaisse]);

  const caisseOuverte = caisseData.find((row) => row.statut === 'ouverte');

  /** Le backend n'autorise qu'une seule caisse ouverte par utilisateur. */
  const openCaisse = () => {
    if (caisseOuverte) {
      showToast(
        `La caisse #${caisseOuverte.id} est déjà ouverte. Fermez-la avant d'en ouvrir une nouvelle.`,
        'info'
      );
      return;
    }
    setModal({ kind: 'caisse', item: null });
  };

  /** Une sortie de caisse doit toujours partir d'une caisse ouverte. */
  const openSortie = () => {
    if (!caisseOuverte) {
      showToast('Ouvrez d’abord une caisse avant d’enregistrer une sortie.', 'info');
      return;
    }
    setModal({ kind: 'mouvement', item: null });
  };

  const openClose = (item: Caisse) => {
    setModal({ kind: 'fermeture', item });
  };

  return (
    <div className="page-container">
      <PageHeader
        title="Caisse"
        subtitle={`${caisseData.length} caisse(s) • ${mouvementsData.length} mouvement(s)`}
      />

      <PageToolbar
        search={search}
        onSearch={setSearch}
        placeholder="Rechercher dans l’onglet..."
        actions={
          <>
            {activeTab === 'caisses' && (
              <>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={openCaisse}
                >
                  <Plus size={15} />
                  Ouvrir une caisse
                </button>

              </>
            )}

            {activeTab === 'mouvements' && (
              <button
                type="button"
                className="btn-primary"
                onClick={openSortie}
              >
                <Plus size={15} />
                Sortie de caisse
              </button>
            )}
          </>
        }
      />

      <PageTabs
        tabs={caisseTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'caisses' && (
        <CaissesTab
          data={caisseData}
          search={search}
          loading={loading.caisses}
          onClose={openClose}
          onPrint={handlePrint}
        />
      )}

      {activeTab === 'mouvements' && (
        <MouvementsCaisseTab
          data={mouvementsData}
          search={search}
          loading={loading.mouvements}
        />
      )}

      <CaisseModal
        modal={modal}
        setModal={setModal}
        caisseData={caisseData}
        setCaisseData={setCaisseData}
        mouvementsData={mouvementsData}
        setMouvementsData={setMouvementsData}
        fournisseursData={fournisseursData}
        achatsData={achatsData}
      />

      <CaisseDetailModal
        open={Boolean(previewCaisse)}
        caisse={previewCaisse}
        mouvements={mouvementsData}
        onClose={closePreview}
      />
    </div>
  );
}
