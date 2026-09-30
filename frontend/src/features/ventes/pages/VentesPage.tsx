import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { PageTabs } from '@/components/PageTabs';
import { PageToolbar } from '@/components/PageToolbar';
import { ConfirmModal } from '@/components/ConfirmModal';
import { useToast } from '@/components/Toast';
import { usePermissions } from '@/hooks/usePermissions';
import type { Client, Facture, Lot, Produit, ProduitConditionnement, Reglement, Vente, VenteLigne } from '@/types';
import { clientsApi } from '../../clients/api/clients';
import { produitsApi } from '../../produits/api/produits';
import { lotsApi } from '../../produits/api/lots';
import { conditionnementsApi } from '../../produits/api/conditionnements';
import { ventesApi, ventesLignesApi, facturesApi, reglementsApi } from '../api/ventes';
import { ventesTabs } from './tabs/tabsConfig';
import {
  VentesModal,
  type VenteModalKind,
  type VenteModalState,
} from './tabs/VentesModal';
import { VentesTab } from './tabs/VentesTab';
import { LignesVenteTab } from './tabs/LignesVenteTab';
import { ClientsAssociesTab } from './tabs/ClientsAssociesTab';
import { FacturesTab } from './tabs/FacturesTab';
import { ReglementsTab } from './tabs/ReglementsTab';
import { VenteDetailModal } from '@/components/VenteDetailModal';
import { FactureTicketModal } from '@/components/FactureTicketModal';

interface VenteDeleteTarget {
  kind: VenteModalKind;
  item: Vente | VenteLigne;
}

interface VenteActionTarget {
  action: 'confirmer' | 'annuler';
  item: Vente;
}

export function VentesPage() {
  const { showToast } = useToast();
  const { hasPermission } = usePermissions();

  // Permission mapping for tabs
  const tabPermissions: Record<string, string> = {
    ventes: 'vente.view',
    lignes: 'vente_ligne.view',
    clients: 'client.view',
    factures: 'facture.view',
    reglements: 'reglement.view',
  };

  // Permission mapping for actions per tab
  const tabActionPermissions: Record<string, { create: string; update: string; delete: string }> = {
    ventes: { create: 'vente.create', update: 'vente.update', delete: 'vente.delete' },
    lignes: { create: 'vente_ligne.create', update: 'vente_ligne.update', delete: 'vente_ligne.delete' },
    clients: { create: 'client.create', update: 'client.update', delete: 'client.delete' },
    factures: { create: 'facture.create', update: 'facture.update', delete: 'facture.delete' },
    reglements: { create: 'reglement.create', update: 'reglement.update', delete: 'reglement.delete' },
  };

  // Filter tabs based on view permissions
  const allowedTabs = ventesTabs.filter((tab) => hasPermission(tabPermissions[tab.id]));
  const defaultActiveTab = allowedTabs[0]?.id ?? 'ventes';

  const [activeTab, setActiveTab] = useState(defaultActiveTab);
  const [data, setData] = useState<Vente[]>([]);
  const [lignesData, setLignesData] = useState<VenteLigne[]>([]);
  const [clientsData, setClientsData] = useState<Client[]>([]);
  const [produitsData, setProduitsData] = useState<Produit[]>([]);
  const [lotsData, setLotsData] = useState<Lot[]>([]);
  const [conditionnementsData, setConditionnementsData] = useState<ProduitConditionnement[]>([]);
  const [facturesData, setFacturesData] = useState<Facture[]>([]);
  const [reglementsData, setReglementsData] = useState<Reglement[]>([]);
  const [modal, setModal] = useState<VenteModalState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<VenteDeleteTarget | null>(null);
  const [actionTarget, setActionTarget] = useState<VenteActionTarget | null>(null);
  const [search, setSearch] = useState('');
  const [previewVente, setPreviewVente] = useState<Vente | null>(null);
  const [printAfterOpen, setPrintAfterOpen] = useState(false);
  const [ticketFacture, setTicketFacture] = useState<Facture | null>(null);
  const [printTicket, setPrintTicket] = useState(false);
  const [dateImpression, setDateImpression] = useState<Date | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [loading, setLoading] = useState({
    ventes: true,
    lignes: true,
    clients: true,
    produits: true,
    lots: true,
    conditionnements: true,
    factures: true,
    reglements: true,
  });

  // Check permissions for active tab
  const canCreate = hasPermission(tabActionPermissions[activeTab]?.create);
  const canEdit = hasPermission(tabActionPermissions[activeTab]?.update);
  const canDelete = hasPermission(tabActionPermissions[activeTab]?.delete);

  useEffect(() => {
    if (!hasPermission('vente.view')) return;
    const load = async () => {
      try {
        const result = await ventesApi.getAll();
        setData(result);
      } catch (error) {
        console.error('chargement ventes:', error);
        const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
        if (axiosError.response?.status === 403 || axiosError.response?.status === 500) {
          showToast('Accès refusé : vous n\'avez pas la permission de voir les ventes.', 'error');
        } else {
          showToast('Impossible de charger les ventes.', 'error');
        }
      } finally {
        setLoading((prev) => ({ ...prev, ventes: false }));
      }
    };
    load();
  }, [showToast]);

  useEffect(() => {
    if (!hasPermission('vente_ligne.view')) return;
    const load = async () => {
      try {
        const result = await ventesLignesApi.getAll();
        setLignesData(result);
      } catch (error) {
        console.error('chargement lignes de vente:', error);
        const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
        if (axiosError.response?.status === 403 || axiosError.response?.status === 500) {
          showToast('Accès refusé : vous n\'avez pas la permission de voir les lignes de vente.', 'error');
        } else {
          showToast('Impossible de charger les lignes de vente.', 'error');
        }
      } finally {
        setLoading((prev) => ({ ...prev, lignes: false }));
      }
    };
    load();
  }, [showToast]);

  useEffect(() => {
    if (!hasPermission('client.view')) return;
    const load = async () => {
      try {
        const result = await clientsApi.getAll();
        setClientsData(result);
      } catch (error) {
        console.error('chargement clients:', error);
        const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
        if (axiosError.response?.status === 403 || axiosError.response?.status === 500) {
          showToast('Accès refusé : vous n\'avez pas la permission de voir les clients.', 'error');
        } else {
          showToast('Impossible de charger les clients.', 'error');
        }
      } finally {
        setLoading((prev) => ({ ...prev, clients: false }));
      }
    };
    load();
  }, [showToast]);

  useEffect(() => {
    if (!hasPermission('produit.view')) return;
    const load = async () => {
      try {
        const result = await produitsApi.getAll();
        setProduitsData(result);
      } catch (error) {
        console.error('chargement produits:', error);
      } finally {
        setLoading((prev) => ({ ...prev, produits: false }));
      }
    };
    load();
  }, [showToast]);

  useEffect(() => {
    if (!hasPermission('lot.view')) return;
    const load = async () => {
      try {
        const result = await lotsApi.getAll();
        setLotsData(result);
      } catch (error) {
        console.error('chargement lots:', error);
      } finally {
        setLoading((prev) => ({ ...prev, lots: false }));
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

  useEffect(() => {
    if (!hasPermission('facture.view')) return;
    const load = async () => {
      try {
        const result = await facturesApi.getAll();
        setFacturesData(result);
      } catch (error) {
        console.error('chargement factures:', error);
        const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
        if (axiosError.response?.status === 403 || axiosError.response?.status === 500) {
          showToast('Accès refusé : vous n\'avez pas la permission de voir les factures.', 'error');
        } else {
          showToast('Impossible de charger les factures.', 'error');
        }
      } finally {
        setLoading((prev) => ({ ...prev, factures: false }));
      }
    };
    load();
  }, [showToast]);

  useEffect(() => {
    if (!hasPermission('reglement.view')) return;
    const load = async () => {
      try {
        const result = await reglementsApi.getAll();
        setReglementsData(result);
      } catch (error) {
        console.error('chargement règlements:', error);
        const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
        if (axiosError.response?.status === 403 || axiosError.response?.status === 500) {
          showToast('Accès refusé : vous n\'avez pas la permission de voir les règlements.', 'error');
        } else {
          showToast('Impossible de charger les règlements.', 'error');
        }
      } finally {
        setLoading((prev) => ({ ...prev, reglements: false }));
      }
    };
    load();
  }, [showToast]);

  const openAdd = (kind: VenteModalKind) => {
    setModal({ kind, item: null });
  };

  const openEdit = (kind: VenteModalKind, item: Vente | VenteLigne) => {
    setModal({ kind, item });
  };

  const handlePreview = (vente: Vente) => {
    setPreviewVente(vente);
  };

  // Ouvre le meme modal de details que l'apercu, puis declenche l'impression
  const handlePrint = (vente: Vente) => {
    setPreviewVente(vente);
    setPrintAfterOpen(true);
  };

  const closePreview = () => {
    setPreviewVente(null);
  };

  useEffect(() => {
    if (printAfterOpen && previewVente) {
      const timer = setTimeout(() => {
        window.print();
        setPrintAfterOpen(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [printAfterOpen, previewVente]);

  // ── Ticket de caisse (imprimante thermique) ──
  // La date/heure affichee sur le ticket est capturee au moment du clic
  // sur « Imprimer » dans la liste des factures.
  const openTicket = (facture: Facture) => {
    setDateImpression(new Date());
    setTicketFacture(facture);
  };

  const handlePrintTicket = () => {
    // On rafraichit l'horodatage a chaque impression.
    setDateImpression(new Date());
    setPrintTicket(true);
  };

  const closeTicket = () => {
    setTicketFacture(null);
    setPrintTicket(false);
    setDateImpression(null);
  };

  useEffect(() => {
    if (printTicket && ticketFacture) {
      const timer = setTimeout(() => {
        window.print();
        setPrintTicket(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [printTicket, ticketFacture]);

  const confirmDelete = () => {
    if (!deleteTarget) return;

    const previous = deleteTarget.item;

    if (deleteTarget.kind === 'vente') {
      setData((prev) => prev.filter((row) => row.id !== previous.id));
      setLignesData((prev) => prev.filter((row) => row.vente_id !== previous.id));
    } else {
      setLignesData((prev) => prev.filter((row) => row.id !== previous.id));
    }

    setDeleteTarget(null);

    (async () => {
      try {
        if (deleteTarget.kind === 'vente') {
          await ventesApi.delete(previous.id);
          showToast('Vente supprimée avec succès', 'success');
        } else {
          await ventesLignesApi.delete(previous.id);
          showToast('Ligne de vente supprimée avec succès', 'success');
          // Le backend recalcule le montant de la vente apres suppression.
          if (!('vente_id' in previous)) return;
          try {
            const venteActualisee = await ventesApi.getById(previous.vente_id);
            setData((prev) =>
              prev.map((row) => (row.id === previous.vente_id ? venteActualisee : row))
            );
          } catch {
            /* le total sera rafraichi au prochain chargement */
          }
        }
      } catch (error: unknown) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        showToast(
          axiosError.response?.data?.message || 'Impossible de supprimer cet élément.',
          'error'
        );
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
          const updated = await ventesApi.confirmer(item.id);
          setData((prev) => prev.map((row) => (row.id === item.id ? updated : row)));
          showToast('Vente confirmée avec succès', 'success');

          // La confirmation genere une facture : on rafraichit la liste.
          try {
            const factures = await facturesApi.getAll();
            setFacturesData(factures);
          } catch {
            /* non bloquant */
          }
        } else {
          const updated = await ventesApi.annuler(item.id);
          setData((prev) => prev.map((row) => (row.id === item.id ? updated : row)));
          showToast('Vente annulée avec succès', 'success');
        }
      } catch (error: unknown) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        showToast(
          axiosError.response?.data?.message || 'Impossible d\'effectuer cette action.',
          'error'
        );
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
      return `Voulez-vous confirmer la vente « ${item.numero} » ?\n\nLa confirmation enregistrera définitivement la vente, créera la facture correspondante et sortira les articles du stock.`;
    }
    return `Voulez-vous annuler la vente « ${item.numero} » ?\n\nCette action est irréversible.`;
  };

  const getActionTitle = () => {
    if (!actionTarget) return '';
    return actionTarget.action === 'confirmer' ? 'Confirmer la vente' : 'Annuler la vente';
  };

  const getActionConfirmLabel = () => {
    if (!actionTarget) return '';
    return actionTarget.action === 'confirmer' ? 'Confirmer' : 'Annuler';
  };

  const clientsAssocies = clientsData.filter((client) =>
    data.some((vente) => vente.client_id === client.id)
  );

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
            title="Ventes"
            subtitle={`${data.length} vente(s) enregistrée(s)`}
          />

          <PageToolbar
            search={search}
            onSearch={setSearch}
            placeholder="Rechercher dans l'onglet..."
            actions={
              <>
                {activeTab === 'ventes' && canCreate && (
                  <button type="button" className="btn-primary" onClick={() => openAdd('vente')}>
                    <Plus size={15} /> Ajouter une vente
                  </button>
                )}
                {activeTab === 'lignes' && canCreate && (
                  <button type="button" className="btn-primary" onClick={() => openAdd('ligne')}>
                    <Plus size={15} /> Ajouter une ligne
                  </button>
                )}
                {activeTab === 'reglements' && canCreate && (
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => openAdd('reglement')}
                  >
                    <Plus size={15} /> Ajouter un règlement
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

          {activeTab === 'ventes' && (
            <VentesTab
              data={data}
              search={search}
              loading={loading.ventes}
              onOpenEdit={canEdit ? (item) => openEdit('vente', item) : undefined}
              onDelete={canDelete ? (item) => setDeleteTarget({ kind: 'vente', item }) : undefined}
              onConfirm={canEdit ? (item) => setActionTarget({ action: 'confirmer', item }) : undefined}
              onAnnuler={canEdit ? (item) => setActionTarget({ action: 'annuler', item }) : undefined}
              onPrint={handlePrint}
              onPreview={handlePreview}
            />
          )}

          {activeTab === 'lignes' && (
            <LignesVenteTab
              data={lignesData}
              ventes={data}
              search={search}
              loading={loading.lignes}
              onOpenEdit={canEdit ? (item) => openEdit('ligne', item) : undefined}
              onDelete={canDelete ? (item) => setDeleteTarget({ kind: 'ligne', item }) : undefined}
            />
          )}

          {activeTab === 'clients' && (
            <ClientsAssociesTab
              data={clientsAssocies}
              search={search}
              loading={loading.clients}
            />
          )}

          {activeTab === 'factures' && (
            <FacturesTab
              data={facturesData}
              search={search}
              loading={loading.factures}
              onPrint={openTicket}
            />
          )}

          {activeTab === 'reglements' && (
            <ReglementsTab
              data={reglementsData}
              search={search}
              loading={loading.reglements}
            />
          )}
        </>
      )}

      <VentesModal
        modal={modal}
        setModal={setModal}
        data={data}
        setData={setData}
        setLignesData={setLignesData}
        clientsData={clientsData}
        produitsData={produitsData}
        lotsData={lotsData}
        conditionnementsData={conditionnementsData}
        facturesData={facturesData}
        setReglementsData={setReglementsData}
      />

      <VenteDetailModal
        open={Boolean(previewVente)}
        vente={previewVente}
        lignes={lignesData}
        onClose={closePreview}
      />

      <FactureTicketModal
        open={Boolean(ticketFacture)}
        facture={ticketFacture}
        vente={
          ticketFacture
            ? data.find((vente) => vente.id === ticketFacture.vente_id) ?? null
            : null
        }
        lignes={
          ticketFacture
            ? lignesData.filter(
                (ligne) =>
                  ligne.vente_id ===
                  (data.find((vente) => vente.id === ticketFacture.vente_id)?.id ??
                    ticketFacture.vente_id)
              )
            : []
        }
        reglements={reglementsData}
        dateImpression={dateImpression}
        onClose={closeTicket}
        onPrint={handlePrintTicket}
      />

      <ConfirmModal
        open={Boolean(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Confirmer la suppression"
        message={
          deleteTarget?.kind === 'vente'
            ? `Voulez-vous vraiment supprimer la vente « ${
                deleteTarget.item && 'numero' in deleteTarget.item
                  ? deleteTarget.item.numero
                  : ''
              } » ?`
            : 'Voulez-vous vraiment supprimer cette ligne de vente ?'
        }
        confirmLabel="Supprimer"
      />

      <ConfirmModal
        open={Boolean(actionTarget)}
        onCancel={() => {
          setActionTarget(null);
          setActionLoading(false);
        }}
        onConfirm={confirmAction}
        title={getActionTitle()}
        message={getActionMessage()}
        confirmLabel={getActionConfirmLabel()}
        cancelLabel="Retour"
      />
    </div>
  );
}
