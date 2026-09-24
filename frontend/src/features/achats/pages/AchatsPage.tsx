import { useState, useEffect } from 'react';
import { Plus, Printer } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { PageTabs } from '@/components/PageTabs';
import { PageToolbar } from '@/components/PageToolbar';
import { ConfirmModal } from '@/components/ConfirmModal';
import { useToast } from '@/components/Toast';
import type { Achat, AchatLigne, Fournisseur, AchatStatut } from '@/types';
import { achatsApi, achatsLignesApi } from '../api/achats';
import { fournisseursApi } from '../../fournisseurs/api/fournisseurs';
import { achatsTabs } from './tabs/tabsConfig';
import {
  AchatsModal,
  type AchatModalKind,
  type AchatModalState,
} from './tabs/AchatsModal';
import { AchatsTab } from './tabs/AchatsTab';
import { LignesAchatTab } from './tabs/LignesAchatTab';
import { FournisseursTab } from './tabs/FournisseursTab';
import { AchatDetailModal } from '@/components/AchatDetailModal';

interface AchatDeleteTarget {
  kind: AchatModalKind;
  item: Achat | AchatLigne | Fournisseur;
}

interface AchatActionTarget {
  action: 'confirmer' | 'annuler';
  item: Achat;
}

export function AchatsPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('achats');
  const [data, setData] = useState<Achat[]>([]);
  const [lignesData, setLignesData] = useState<AchatLigne[]>([]);
  const [fournisseursData, setFournisseursData] = useState<Fournisseur[]>([]);
  const [modal, setModal] = useState<AchatModalState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AchatDeleteTarget | null>(null);
  const [actionTarget, setActionTarget] = useState<AchatActionTarget | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState({ achats: true, lignes: true, fournisseurs: true });
  const [previewAchat, setPreviewAchat] = useState<Achat | null>(null);
  const [printAfterOpen, setPrintAfterOpen] = useState(false);
  const [statutHistory, setStatutHistory] = useState<AchatStatut[]>([]);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await achatsApi.getAll();
        setData(result);
      } catch (error) {
        console.error('chargement achats:', error);
        showToast('Impossible de charger les achats.', 'error');
      } finally {
        setLoading((prev) => ({ ...prev, achats: false }));
      }
    };
    load();
  }, [showToast]);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await achatsLignesApi.getAll();
        setLignesData(result);
      } catch (error) {
        console.error('chargement lignes:', error);
        showToast('Impossible de charger les lignes.', 'error');
      } finally {
        setLoading((prev) => ({ ...prev, lignes: false }));
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
        showToast('Impossible de charger les fournisseurs.', 'error');
      } finally {
        setLoading((prev) => ({ ...prev, fournisseurs: false }));
      }
    };
    load();
  }, [showToast]);

  const handlePrint = async (achat: Achat) => {
    await handlePreview(achat);
    setPrintAfterOpen(true);
  };


  const openAdd = (kind: AchatModalKind) => {
    setModal({ kind, item: null });
  };

  const handlePreview = async (achat: Achat) => {
    setPreviewAchat(achat);
    try {
      const history = await achatsApi.getStatutHistory(achat.id);
      setStatutHistory(history);
    } catch (error: unknown) {
        console.error(' chargement historique:', error);
        const axiosError = error as { response?: { data?: { message?: string } } };
        const msg = axiosError.response?.data?.message || 'Impossible de charger l\'historique.';
        showToast(msg, 'error');
      }
  };

  const closePreview = () => {
    setPreviewAchat(null);
    setStatutHistory([]);
  };

  useEffect(() => {
    if (printAfterOpen && previewAchat) {
      const timer = setTimeout(() => {
        window.print();
        setPrintAfterOpen(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [printAfterOpen, previewAchat]);


  const openEdit = (kind: AchatModalKind, item: Achat | AchatLigne | Fournisseur) => {
    setModal({ kind, item });
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    const previous = deleteTarget.item;
    if (deleteTarget.kind === 'achat') {
      setData((prev) => prev.filter((row) => row.id !== previous.id));
    } else if (deleteTarget.kind === 'ligne') {
      setLignesData((prev) => prev.filter((row) => row.id !== previous.id));
    } else if (deleteTarget.kind === 'fournisseur') {
      setFournisseursData((prev) => prev.filter((row) => row.id !== previous.id));
    }

    setDeleteTarget(null);

    (async () => {
      try {
        if (deleteTarget.kind === 'achat') {
          await achatsApi.delete(previous.id);
          showToast('Achat supprimé avec succès', 'success');
        } else if (deleteTarget.kind === 'ligne') {
          await achatsLignesApi.delete(previous.id);
          showToast('Ligne supprimée avec succès', 'success');
        } else if (deleteTarget.kind === 'fournisseur') {
          await fournisseursApi.delete(previous.id);
          showToast('Fournisseur supprimé avec succès', 'success');
        }
      } catch (error: unknown) {
        const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
        const specificMessage = axiosError.response?.data?.message;

        if (specificMessage) {
          showToast(specificMessage, 'error');
        } else {
          showToast('Impossible de supprimer cet élément.', 'error');
        }

        if (deleteTarget.kind === 'achat') {
          setData((prev) => [...prev, previous as Achat]);
        } else if (deleteTarget.kind === 'ligne') {
          setLignesData((prev) => [...prev, previous as AchatLigne]);
        } else if (deleteTarget.kind === 'fournisseur') {
          setFournisseursData((prev) => [...prev, previous as Fournisseur]);
        }
      }
    })();
  };

  const confirmAction = () => {
    if (!actionTarget || actionLoading) return;

    const { action, item } = actionTarget;
    setActionLoading(true);

    (async () => {
      try {
        if (action === 'confirmer') {
          const updated = await achatsApi.confirmer(item.id);
          setData((prev) => prev.map((row) => (row.id === item.id ? updated : row)));
          showToast('Achat confirmé avec succès', 'success');
        } else if (action === 'annuler') {
          const updated = await achatsApi.annuler(item.id);
          setData((prev) => prev.map((row) => (row.id === item.id ? updated : row)));
          showToast('Achat annulé avec succès', 'success');
        }
      } catch (error: unknown) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        const msg = axiosError.response?.data?.message || 'Impossible d\'effectuer cette action.';
        showToast(msg, 'error');
      } finally {
        setActionTarget(null);
        setActionLoading(false);
      }
    })();
  };

  const getActionMessage = () => {
    if (!actionTarget) return '';
    const { action, item } = actionTarget;
    if (action === 'confirmer') {
      return `Voulez-vous confirmer l'achat « ${item.numero} » ?\n\nLa confirmation enregistrera définitivement l'achat, créera les lots correspondant aux lignes d'achat et mettra à jour le stock.`;
    }
    return `Voulez-vous annuler l'achat « ${item.numero} » ?\n\nCette action est irréversible.`;
  };

  const getActionTitle = () => {
    if (!actionTarget) return '';
    return actionTarget.action === 'confirmer' ? "Confirmer l'achat" : "Annuler l'achat";
  };

  const getActionConfirmLabel = () => {
    if (!actionTarget) return '';
    return actionTarget.action === 'confirmer' ? 'Confirmer' : 'Annuler';
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
        placeholder="Rechercher dans l'onglet..."
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
          loading={loading.achats}
          onOpenEdit={(item) => openEdit('achat', item)}
          onDelete={(item) => setDeleteTarget({ kind: 'achat', item })}
          onConfirm={(item) => setActionTarget({ action: 'confirmer', item })}
          onAnnuler={(item) => setActionTarget({ action: 'annuler', item })}
          onPrint={handlePrint}
          onPreview={handlePreview}
        />
      )}

      {activeTab === 'lignes' && (
        <LignesAchatTab
          data={lignesData}
          achats={data}
          search={search}
          loading={loading.lignes}
          onOpenEdit={(item) => openEdit('ligne', item)}
          onDelete={(item) => setDeleteTarget({ kind: 'ligne', item })}
        />
      )}

      {activeTab === 'fournisseurs' && (
        <FournisseursTab
          data={fournisseursData.filter((f) =>
            data.some((a) => a.fournisseur_id === f.id)
          )}
          search={search}
          loading={loading.fournisseurs}
          onOpenEdit={(item) => openEdit('fournisseur', item)}
          onDelete={(item) => setDeleteTarget({ kind: 'fournisseur', item })}
        />
      )}

      <AchatsModal
        modal={modal}
        setModal={setModal}
        data={data}
        setData={setData}
        lignesData={lignesData}
        setLignesData={setLignesData}
        fournisseursData={fournisseursData}
        setFournisseursData={setFournisseursData}
      />

      <AchatDetailModal
        open={Boolean(previewAchat)}
        achat={previewAchat}
        lignes={lignesData}
        statutHistory={statutHistory}
        onClose={closePreview}
      />

      <ConfirmModal
        open={Boolean(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Confirmer la suppression"
        message={
          deleteTarget?.kind === 'achat'
            ? `Voulez-vous vraiment supprimer l'achat « ${
                deleteTarget.item && 'numero' in deleteTarget.item
                  ? deleteTarget.item.numero
                  : ''
              } » ?`
            : deleteTarget?.kind === 'ligne'
            ? 'Voulez-vous vraiment supprimer cette ligne d\'achat ?'
            : deleteTarget?.kind === 'fournisseur'
            ? 'Voulez-vous vraiment supprimer ce fournisseur ?'
            : ''
        }
        confirmLabel="Supprimer"
      />

      <ConfirmModal
        open={Boolean(actionTarget)}
        onCancel={() => { setActionTarget(null); setActionLoading(false); }}
        onConfirm={confirmAction}
        title={getActionTitle()}
        message={getActionMessage()}
        confirmLabel={getActionConfirmLabel()}
        cancelLabel="Retour"
      />
    </div>
  );
}
