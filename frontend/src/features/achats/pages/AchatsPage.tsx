import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { PageTabs } from '@/components/PageTabs';
import { PageToolbar } from '@/components/PageToolbar';
import { ConfirmModal } from '@/components/ConfirmModal';
import { useToast } from '@/components/Toast';
import { usePermissions } from '@/hooks/usePermissions';
import type { Achat, AchatLigne, Fournisseur, AchatStatut, ProduitConditionnement } from '@/types';
import { achatsApi, achatsLignesApi } from '../api/achats';
import { fournisseursApi } from '../../fournisseurs/api/fournisseurs';
import { conditionnementsApi } from '../../produits/api/conditionnements';
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
  const { hasPermission } = usePermissions();

  // Permission mapping for tabs
  const tabPermissions: Record<string, string> = {
    achats: 'achat.view',
    lignes: 'achat_ligne.view',
    fournisseurs: 'fournisseur.view',
  };

  // Permission mapping for actions per tab
  const tabActionPermissions: Record<string, { create: string; update: string; delete: string }> = {
    achats: { create: 'achat.create', update: 'achat.update', delete: 'achat.delete' },
    lignes: { create: 'achat_ligne.create', update: 'achat_ligne.update', delete: 'achat_ligne.delete' },
    fournisseurs: { create: 'fournisseur.create', update: 'fournisseur.update', delete: 'fournisseur.delete' },
  };

  // Filter tabs based on view permissions
  const allowedTabs = achatsTabs.filter((tab) => hasPermission(tabPermissions[tab.id]));
  const defaultActiveTab = allowedTabs[0]?.id ?? 'achats';

  const [activeTab, setActiveTab] = useState(defaultActiveTab);
  const [data, setData] = useState<Achat[]>([]);
  const [lignesData, setLignesData] = useState<AchatLigne[]>([]);
  const [fournisseursData, setFournisseursData] = useState<Fournisseur[]>([]);
  const [conditionnementsData, setConditionnementsData] = useState<ProduitConditionnement[]>([]);
  const [modal, setModal] = useState<AchatModalState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AchatDeleteTarget | null>(null);
  const [actionTarget, setActionTarget] = useState<AchatActionTarget | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState({ achats: true, lignes: true, fournisseurs: true, conditionnements: true });
  const [previewAchat, setPreviewAchat] = useState<Achat | null>(null);
  const [printAfterOpen, setPrintAfterOpen] = useState(false);
  const [statutHistory, setStatutHistory] = useState<AchatStatut[]>([]);
  const [actionLoading, setActionLoading] = useState(false);

  // Check permissions for active tab
  const canCreate = hasPermission(tabActionPermissions[activeTab]?.create);
  const canEdit = hasPermission(tabActionPermissions[activeTab]?.update);
  const canDelete = hasPermission(tabActionPermissions[activeTab]?.delete);

  useEffect(() => {
    if (!hasPermission('achat.view')) return;
    const load = async () => {
      try {
        const result = await achatsApi.getAll();
        setData(result);
      } catch (error) {
        console.error('chargement achats:', error);
        const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
        if (axiosError.response?.status === 403 || axiosError.response?.status === 500) {
          showToast('Accès refusé : vous n\'avez pas la permission de voir les achats.', 'error');
        } else {
          showToast('Impossible de charger les achats.', 'error');
        }
      } finally {
        setLoading((prev) => ({ ...prev, achats: false }));
      }
    };
    load();
  }, [showToast]);

  useEffect(() => {
    if (!hasPermission('achat_ligne.view')) return;
    const load = async () => {
      try {
        const result = await achatsLignesApi.getAll();
        setLignesData(result);
      } catch (error) {
        console.error('chargement lignes:', error);
        const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
        if (axiosError.response?.status === 403 || axiosError.response?.status === 500) {
          showToast('Accès refusé : vous n\'avez pas la permission de voir les lignes d\'achat.', 'error');
        } else {
          showToast('Impossible de charger les lignes.', 'error');
        }
      } finally {
        setLoading((prev) => ({ ...prev, lignes: false }));
      }
    };
    load();
  }, [showToast]);

  useEffect(() => {
    if (!hasPermission('fournisseur.view')) return;
    const load = async () => {
      try {
        const result = await fournisseursApi.getAll();
        setFournisseursData(result);
      } catch (error) {
        console.error('chargement fournisseurs:', error);
        const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
        if (axiosError.response?.status === 403 || axiosError.response?.status === 500) {
          showToast('Accès refusé : vous n\'avez pas la permission de voir les fournisseurs.', 'error');
        } else {
          showToast('Impossible de charger les fournisseurs.', 'error');
        }
      } finally {
        setLoading((prev) => ({ ...prev, fournisseurs: false }));
      }
    };
    load();
  }, [showToast]);

  useEffect(() => {
    if (!hasPermission('produit.view')) return;
    const load = async () => {
      try {
        const result = await conditionnementsApi.getAll();
        setConditionnementsData(result);
      } catch (error) {
        console.error('chargement conditionnements:', error);
      } finally {
        setLoading((prev) => ({ ...prev, conditionnements: false }));
      }
    };
    load();
  }, [showToast]);

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

  // Ouvre le meme modal de details que l'apercu, puis declenche l'impression
  const handlePrint = async (achat: Achat) => {
    await handlePreview(achat);
    setPrintAfterOpen(true);
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
      {allowedTabs.length === 0 ? (
        <div className="page-empty-state">
          <div className="empty-state-icon">🔒</div>
          <h2>Accès non autorisé</h2>
          <p>Vous n'avez pas les permissions nécessaires pour accéder à ce module.</p>
        </div>
      ) : (
        <>
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
                {activeTab === 'achats' && canCreate && (
                  <button type="button" className="btn-primary" onClick={() => openAdd('achat')}>
                    <Plus size={15} /> Ajouter un achat
                  </button>
                )}
                {activeTab === 'lignes' && canCreate && (
                  <button type="button" className="btn-primary" onClick={() => openAdd('ligne')}>
                    <Plus size={15} /> Ajouter une ligne
                  </button>
                )}
                {activeTab === 'fournisseurs' && canCreate && (
                  <button type="button" className="btn-primary" onClick={() => openAdd('fournisseur')}>
                    <Plus size={15} /> Ajouter un fournisseur
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

          {activeTab === 'achats' && (
            <AchatsTab
              data={data}
              search={search}
              loading={loading.achats}
              onOpenEdit={canEdit ? (item) => openEdit('achat', item) : undefined}
              onDelete={canDelete ? (item) => setDeleteTarget({ kind: 'achat', item }) : undefined}
              onConfirm={canEdit ? (item) => setActionTarget({ action: 'confirmer', item }) : undefined}
              onAnnuler={canEdit ? (item) => setActionTarget({ action: 'annuler', item }) : undefined}
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
              onOpenEdit={canEdit ? (item) => openEdit('ligne', item) : undefined}
              onDelete={canDelete ? (item) => setDeleteTarget({ kind: 'ligne', item }) : undefined}
            />
          )}

          {activeTab === 'fournisseurs' && (
            <FournisseursTab
              data={fournisseursData.filter((f) =>
                data.some((a) => a.fournisseur_id === f.id)
              )}
              search={search}
              loading={loading.fournisseurs}
              onOpenEdit={canEdit ? (item) => openEdit('fournisseur', item) : undefined}
              onDelete={canDelete ? (item) => setDeleteTarget({ kind: 'fournisseur', item }) : undefined}
            />
          )}
        </>
      )}

      <AchatsModal
        modal={modal}
        setModal={setModal}
        data={data}
        setData={setData}
        setLignesData={setLignesData}
        fournisseursData={fournisseursData}
        setFournisseursData={setFournisseursData}
        conditionnementsData={conditionnementsData}
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
