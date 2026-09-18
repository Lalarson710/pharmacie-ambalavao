import { useState } from 'react';
import { Plus, Printer } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { PageTabs } from '@/components/PageTabs';
import { PageToolbar } from '@/components/PageToolbar';
import { ConfirmModal } from '@/components/ConfirmModal';
import { inventaires, lots, mouvementsStock, produits } from '@/data/mockData';
import type { Inventaire, Lot, MouvementStock, Produit } from '@/types';
import { stockTabs } from './tabs/tabsConfig';
import { StockProduitTab } from './tabs/StockProduitTab';
import { LotsTab } from './tabs/LotsTab';
import { EntreesTab } from './tabs/EntreesTab';
import { SortiesTab } from './tabs/SortiesTab';
import { MouvementsTab } from './tabs/MouvementsTab';
import { InventairesTab } from './tabs/InventairesTab';
import { StockModal, type StockModalKind, type StockModalState } from './tabs/StockModal';

interface StockDeleteTarget {
  kind: StockModalKind;
  item: MouvementStock | Inventaire;
}

export function StockPage() {
  const [activeTab, setActiveTab] = useState('stock-produit');
  const [mouvementsData, setMouvementsData] = useState<MouvementStock[]>(mouvementsStock);
  const [inventairesData, setInventairesData] = useState<Inventaire[]>(inventaires);
  const [modal, setModal] = useState<StockModalState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<StockDeleteTarget | null>(null);
  const [search, setSearch] = useState('');

  const stockParProduit = produits.map((p) => {
    const lotsProduit = lots.filter((l) => l.produit_id === p.id);
    const quantiteTotale = lotsProduit.reduce((sum, l) => sum + l.quantite, 0);
    return { ...p, quantite_totale: quantiteTotale };
  });

  const handlePrint = () => {
    window.print();
  };

  const openAdd = (kind: StockModalKind) => {
    setModal({ kind, item: null });
  };

  const openEdit = (kind: StockModalKind, item: MouvementStock | Inventaire) => {
    setModal({ kind, item });
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.kind === 'mouvement') {
      setMouvementsData((prev) => prev.filter((row) => row.id !== deleteTarget.item.id));
    } else {
      setInventairesData((prev) => prev.filter((row) => row.id !== deleteTarget.item.id));
    }

    setDeleteTarget(null);
  };

  return (
    <div className="page-container">
      <PageHeader
        title="Gestion du stock"
        subtitle="Vue d'ensemble des quantités, lots et mouvements"
      />

      <PageToolbar
        search={search}
        onSearch={setSearch}
        placeholder="Rechercher dans le stock..."
        actions={
          <>
            {(activeTab === 'stock-produit' || activeTab === 'inventaires') && (
              <button type="button" className="btn-secondary" onClick={handlePrint}>
                <Printer size={15} /> Imprimer
              </button>
            )}
            {['entrees', 'sorties', 'inventaires'].includes(activeTab) && (
              <button type="button" className="btn-primary" onClick={() => openAdd(activeTab === 'inventaires' ? 'inventaire' : 'mouvement')}>
                <Plus size={15} /> Ajouter
              </button>
            )}
          </>
        }
      />

      <PageTabs
        tabs={stockTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'stock-produit' && (
        <StockProduitTab data={stockParProduit} search={search} />
      )}

      {activeTab === 'lots' && (
        <LotsTab data={lots} search={search} />
      )}

      {activeTab === 'entrees' && (
        <EntreesTab
          data={mouvementsData}
          search={search}
          onOpenEdit={(item) => openEdit('mouvement', item)}
          onDelete={(item) => setDeleteTarget({ kind: 'mouvement', item })}
        />
      )}

      {activeTab === 'sorties' && (
        <SortiesTab
          data={mouvementsData}
          search={search}
          onOpenEdit={(item) => openEdit('mouvement', item)}
          onDelete={(item) => setDeleteTarget({ kind: 'mouvement', item })}
        />
      )}

      {activeTab === 'mouvements' && (
        <MouvementsTab data={mouvementsData} search={search} />
      )}

      {activeTab === 'inventaires' && (
        <InventairesTab
          data={inventairesData}
          search={search}
          onOpenEdit={(item) => openEdit('inventaire', item)}
          onDelete={(item) => setDeleteTarget({ kind: 'inventaire', item })}
        />
      )}

      <StockModal
        modal={modal}
        setModal={setModal}
        mouvementsData={mouvementsData}
        setMouvementsData={setMouvementsData}
        inventairesData={inventairesData}
        setInventairesData={setInventairesData}
      />

      <ConfirmModal
        open={Boolean(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Confirmer la suppression"
        message={
          deleteTarget?.kind === 'mouvement'
            ? 'Voulez-vous vraiment supprimer ce mouvement ?'
            : 'Voulez-vous vraiment supprimer cet inventaire ?'
        }
        confirmLabel="Supprimer"
      />
    </div>
  );
}
