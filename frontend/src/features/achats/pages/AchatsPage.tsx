import { useState } from 'react';
import { Plus, Printer } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { PageTabs } from '@/components/PageTabs';
import { PageToolbar } from '@/components/PageToolbar';
import { ConfirmModal } from '@/components/ConfirmModal';
import { achats, achatsLignes, fournisseurs } from '@/data/mockData';
import type { Achat, AchatLigne } from '@/types';
import { achatsTabs } from './tabs/tabsConfig';
import {
  AchatsModal,
  type AchatModalKind,
  type AchatModalState,
} from './tabs/AchatsModal';
import { AchatsTab } from './tabs/AchatsTab';
import { FournisseursTab } from './tabs/FournisseursTab';
import { LignesAchatTab } from './tabs/LignesAchatTab';

interface AchatDeleteTarget {
  kind: AchatModalKind;
  item: Achat | AchatLigne;
}

export function AchatsPage() {
  const [activeTab, setActiveTab] = useState('achats');
  const [data, setData] = useState<Achat[]>(achats);
  const [lignesData, setLignesData] = useState<AchatLigne[]>(achatsLignes);
  const [modal, setModal] = useState<AchatModalState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AchatDeleteTarget | null>(null);
  const [search, setSearch] = useState('');

  const handlePrint = () => {
    window.print();
  };

  const openAdd = (kind: AchatModalKind) => {
    setModal({ kind, item: null });
  };

  const openEdit = (kind: AchatModalKind, item: Achat | AchatLigne) => {
    setModal({ kind, item });
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.kind === 'achat') {
      setData((prev) => prev.filter((row) => row.id !== deleteTarget.item.id));
    } else {
      setLignesData((prev) =>
        prev.filter((row) => row.id !== deleteTarget.item.id)
      );
    }

    setDeleteTarget(null);
  };

  return (
    <div className="page-container">
      <PageHeader
        title="Achats"
        subtitle={`${data.length} achat(s) enregistré(s)`}
      />

      <PageToolbar
        search={search}
        onSearch={setSearch}
        placeholder="Rechercher dans l’onglet..."
        actions={
          <>
            {activeTab === 'achats' && (
              <button type="button" className="btn-primary" onClick={() => openAdd('achat')}>
                <Plus size={15} /> Ajouter un achat
              </button>
            )}
            {activeTab === 'lignes' && (
              <button type="button" className="btn-primary" onClick={() => openAdd('ligne')}>
                <Plus size={15} /> Ajouter une ligne
              </button>
            )}
            {activeTab === 'achats' && (
              <button type="button" className="btn-secondary" onClick={handlePrint}>
                <Printer size={15} /> Imprimer
              </button>
            )}
          </>
        }
      />

      <PageTabs
        tabs={achatsTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'achats' && (
        <AchatsTab
          data={data}
          search={search}
          onOpenEdit={(item) => openEdit('achat', item)}
          onDelete={(item) => setDeleteTarget({ kind: 'achat', item })}
          onPrint={handlePrint}
        />
      )}

      {activeTab === 'lignes' && (
        <LignesAchatTab
          data={lignesData}
          search={search}
          onOpenEdit={(item) => openEdit('ligne', item)}
          onDelete={(item) => setDeleteTarget({ kind: 'ligne', item })}
        />
      )}

      {activeTab === 'fournisseurs' && (
        <FournisseursTab data={fournisseurs} search={search} />
      )}

      <AchatsModal
        modal={modal}
        setModal={setModal}
        data={data}
        setData={setData}
        lignesData={lignesData}
        setLignesData={setLignesData}
      />

      <ConfirmModal
        open={Boolean(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Confirmer la suppression"
        message={
          deleteTarget?.kind === 'achat'
            ? `Voulez-vous vraiment supprimer l’achat « ${
                deleteTarget.item && 'numero' in deleteTarget.item
                  ? deleteTarget.item.numero
                  : ''
              } » ?`
            : 'Voulez-vous vraiment supprimer cette ligne d’achat ?'
        }
        confirmLabel="Supprimer"
      />
    </div>
  );
}
