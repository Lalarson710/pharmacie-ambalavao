import { useState } from 'react';
import { Plus, Printer } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { PageTabs } from '@/components/PageTabs';
import { PageToolbar } from '@/components/PageToolbar';
import { ConfirmModal } from '@/components/ConfirmModal';
import { caisses, mouvementsCaisse } from '@/data/mockData';
import type { Caisse, MouvementCaisse } from '@/types';
import { caisseTabs } from './tabs/tabsConfig';
import {
  CaisseModal,
  type CaisseModalKind,
  type CaisseModalState,
} from './tabs/CaisseModal';
import { CaissesTab } from './tabs/CaissesTab';
import { MouvementsCaisseTab } from './tabs/MouvementsCaisseTab';

export function CaissesPage() {
  const [activeTab, setActiveTab] = useState('caisses');
  const [caisseData, setCaisseData] = useState<Caisse[]>(caisses);
  const [mouvementsData, setMouvementsData] =
    useState<MouvementCaisse[]>(mouvementsCaisse);
  const [modal, setModal] = useState<CaisseModalState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Caisse | null>(null);
  const [search, setSearch] = useState('');

  const handlePrint = () => {
    window.print();
  };

  const openAdd = (kind: CaisseModalKind) => {
    setModal({ kind, item: null });
  };

  const openEdit = (kind: CaisseModalKind, item: Caisse | MouvementCaisse) => {
    setModal({ kind, item });
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    setCaisseData((prev) =>
      prev.filter((row) => row.id !== deleteTarget.id)
    );
    setDeleteTarget(null);
  };

  return (
    <div className="page-container">
      <PageHeader
        title="Caisse"
        subtitle="Gestion des caisses et des mouvements financiers"
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
                  onClick={() => openAdd('caisse')}
                >
                  <Plus size={15} />
                  Ajouter
                </button>

                <button
                  type="button"
                  className="btn-ghost"
                  onClick={handlePrint}
                >
                  <Printer size={15} />
                  Imprimer
                </button>
              </>
            )}

            {activeTab === 'mouvements' && (
              <button
                type="button"
                className="btn-primary"
                onClick={() => openAdd('mouvement')}
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
          onOpenEdit={(item) => openEdit('caisse', item)}
          onDelete={(item) => setDeleteTarget(item)}
          onPrint={handlePrint}
        />
      )}

      {activeTab === 'mouvements' && (
        <MouvementsCaisseTab data={mouvementsData} search={search} />
      )}

      <CaisseModal
        modal={modal}
        setModal={setModal}
        caisseData={caisseData}
        setCaisseData={setCaisseData}
        setMouvementsData={setMouvementsData}
      />

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Supprimer la caisse"
        message={`Voulez-vous vraiment supprimer la caisse ${
          deleteTarget ? `#${deleteTarget.id}` : ''
        } ?`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
