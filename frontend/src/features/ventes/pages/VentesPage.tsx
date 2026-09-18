import { useState } from 'react';
import { Plus, Printer } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { PageTabs } from '@/components/PageTabs';
import { PageToolbar } from '@/components/PageToolbar';
import { ConfirmModal } from '@/components/ConfirmModal';
import { ventes, ventesLignes, clients, factures, reglements } from '@/data/mockData';
import type { Facture, Reglement, Vente, VenteLigne } from '@/types';
import { ventesTabs } from './tabs/tabsConfig';
import { VentesTab } from './tabs/VentesTab';
import { LignesVenteTab } from './tabs/LignesVenteTab';
import { ClientsAssociesTab } from './tabs/ClientsAssociesTab';
import { FacturesTab } from './tabs/FacturesTab';
import { ReglementsTab } from './tabs/ReglementsTab';
import { VentesModal, type VenteModalKind, type VenteModalState } from './tabs/VentesModal';

interface VenteDeleteTarget {
  kind: VenteModalKind;
  item: Vente | Reglement;
}

export function VentesPage() {
  const [activeTab, setActiveTab] = useState('ventes');
  const [data, setData] = useState<Vente[]>(ventes);
  const [lignesData] = useState<VenteLigne[]>(ventesLignes);
  const [clientsData] = useState(clients);
  const [facturesData] = useState<Facture[]>(factures);
  const [reglementsData, setReglementsData] = useState<Reglement[]>(reglements);
  const [modal, setModal] = useState<VenteModalState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<VenteDeleteTarget | null>(null);
  const [search, setSearch] = useState('');

  const handlePrint = () => {
    window.print();
  };

  const openAdd = (kind: VenteModalKind) => {
    setModal({ kind, item: null });
  };

  const openEdit = (kind: VenteModalKind, item: Vente | Reglement) => {
    setModal({ kind, item });
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.kind === 'vente') {
      setData((prev) => prev.filter((row) => row.id !== deleteTarget.item.id));
    } else {
      setReglementsData((prev) => prev.filter((row) => row.id !== deleteTarget.item.id));
    }

    setDeleteTarget(null);
  };

  return (
    <div className="page-container">
      <PageHeader
        title="Ventes"
        subtitle="Gestion des ventes, factures et règlements"
      />

      <PageToolbar
        search={search}
        onSearch={setSearch}
        placeholder="Rechercher dans l'onglet..."
        actions={
          <>
            {activeTab === 'ventes' && (
              <>
                <button type="button" className="btn-primary" onClick={() => openAdd('vente')}>
                  <Plus size={15} /> Ajouter une vente
                </button>
                <button type="button" className="btn-ghost" onClick={handlePrint}>
                  <Printer size={15} /> Imprimer
                </button>
              </>
            )}
            {activeTab === 'reglements' && (
              <button type="button" className="btn-primary" onClick={() => openAdd('reglement')}>
                <Plus size={15} /> Ajouter un règlement
              </button>
            )}
          </>
        }
      />

      <PageTabs
        tabs={ventesTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'ventes' && (
        <VentesTab
          data={data}
          search={search}
          onOpenEdit={(item) => openEdit('vente', item)}
          onDelete={(item) => setDeleteTarget({ kind: 'vente', item })}
          onPrint={handlePrint}
        />
      )}

      {activeTab === 'lignes' && (
        <LignesVenteTab data={lignesData} search={search} />
      )}

      {activeTab === 'clients' && (
        <ClientsAssociesTab data={clientsData} search={search} />
      )}

      {activeTab === 'factures' && (
        <FacturesTab data={facturesData} search={search} onPrint={handlePrint} />
      )}

      {activeTab === 'reglements' && (
        <ReglementsTab
          data={reglementsData}
          search={search}
          onOpenEdit={(item) => openEdit('reglement', item)}
          onDelete={(item) => setDeleteTarget({ kind: 'reglement', item })}
        />
      )}

      <VentesModal
        modal={modal}
        setModal={setModal}
        data={data}
        setData={setData}
        reglementsData={reglementsData}
        setReglementsData={setReglementsData}
      />

      <ConfirmModal
        open={Boolean(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Confirmer la suppression"
        message={
          deleteTarget?.kind === 'vente'
            ? `Voulez-vous vraiment supprimer la vente « ${deleteTarget?.item && 'numero' in deleteTarget.item ? deleteTarget.item.numero : ''} » ?`
            : 'Voulez-vous vraiment supprimer ce règlement ?'
        }
        confirmLabel="Supprimer"
      />
    </div>
  );
}
