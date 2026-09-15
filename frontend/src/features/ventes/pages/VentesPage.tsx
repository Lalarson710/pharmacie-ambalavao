import { useState } from 'react';
import { Plus, Printer } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { PageTabs } from '@/components/PageTabs';
import { PageToolbar } from '@/components/PageToolbar';
import { RowActions } from '@/components/RowActions';
import { EntityFormModal } from '@/components/EntityFormModal';
import { ConfirmModal } from '@/components/ConfirmModal';
import { clients, factures, reglements, ventes, ventesLignes } from '@/data/mockData';
import { formatCurrency, formatDate, getStatutBadgeClass, formatStatut } from '@/utils/formatters';
import type { Facture, Reglement, Vente, VenteLigne } from '@/types';

const ventesTabs = [
  { id: 'ventes', label: 'Ventes' },
  { id: 'lignes', label: 'Lignes de vente' },
  { id: 'clients', label: 'Clients associés' },
  { id: 'factures', label: 'Factures' },
  { id: 'reglements', label: 'Règlements' },
];

type VenteModalKind = 'vente' | 'reglement';

interface VenteModalState {
  kind: VenteModalKind;
  item: Vente | Reglement | null;
}

interface VenteDeleteTarget {
  kind: VenteModalKind;
  item: Vente | Reglement;
}

export function VentesPage() {
  const [activeTab, setActiveTab] = useState('ventes');
  const [data, setData] = useState<Vente[]>(ventes);
  const lignesData = ventesLignes;
  const clientsData = clients;
  const facturesData = factures;
  const [reglementsData, setReglementsData] = useState<Reglement[]>(reglements);
  const [modal, setModal] = useState<VenteModalState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<VenteDeleteTarget | null>(null);
  const [search, setSearch] = useState('');

  const filteredVentes = search
    ? data.filter((row) =>
        [row.numero, row.client?.nom, row.statut, row.observation ?? '']
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(search.toLowerCase()))
      )
    : data;

  const filteredLignes = search
    ? lignesData.filter((row) =>
        [row.produit?.nom, row.lot?.numero_lot, row.quantite]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(search.toLowerCase()))
      )
    : lignesData;

  const filteredClients = search
    ? clientsData.filter((row) =>
        [row.nom, row.telephone ?? '', row.email ?? '', row.adresse ?? '']
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(search.toLowerCase()))
      )
    : clientsData;

  const filteredFactures = search
    ? facturesData.filter((row) =>
        [row.numero, row.vente?.numero, row.vente?.client?.nom, row.statut]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(search.toLowerCase()))
      )
    : facturesData;

  const filteredReglements = search
    ? reglementsData.filter((row) =>
        [row.facture?.numero, row.mode, row.reference ?? '', row.montant]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(search.toLowerCase()))
      )
    : reglementsData;

  const venteColumns: Column<Vente>[] = [
    { key: 'id', label: '#' },
    { key: 'numero', label: 'N°' },
    {
      key: 'date_vente',
      label: 'Date',
      render: (row) => formatDate(row.date_vente),
    },
    {
      key: 'client',
      label: 'Client',
      render: (row) => row.client?.nom ?? '—',
    },
    {
      key: 'montant_total',
      label: 'Montant',
      render: (row) => formatCurrency(row.montant_total),
    },
    {
      key: 'statut',
      label: 'Statut',
      render: (row) => (
        <span className={`badge ${getStatutBadgeClass(row.statut)}`}>
          {formatStatut(row.statut)}
        </span>
      ),
    },
    { key: 'observation', label: 'Observation' },
  ];

  const ligneColumns: Column<VenteLigne>[] = [
    { key: 'id', label: '#' },
    {
      key: 'produit',
      label: 'Produit',
      render: (row) => row.produit?.nom ?? '—',
    },
    {
      key: 'lot',
      label: 'Lot',
      render: (row) => row.lot?.numero_lot ?? '—',
    },
    { key: 'quantite', label: 'Qté' },
    {
      key: 'prix_unitaire',
      label: 'Prix unitaire',
      render: (row) => formatCurrency(row.prix_unitaire),
    },
    {
      key: 'montant',
      label: 'Montant',
      render: (row) => formatCurrency(row.montant),
    },
  ];

  const clientColumns: Column<(typeof clientsData)[number]>[] = [
    { key: 'id', label: '#' },
    { key: 'nom', label: 'Nom' },
    { key: 'telephone', label: 'Téléphone' },
    { key: 'email', label: 'Email' },
    { key: 'adresse', label: 'Adresse' },
  ];

  const factureColumns: Column<Facture>[] = [
    { key: 'id', label: '#' },
    { key: 'numero', label: 'N°' },
    {
      key: 'date_facture',
      label: 'Date',
      render: (row) => formatDate(row.date_facture),
    },
    {
      key: 'vente',
      label: 'Vente',
      render: (row) => row.vente?.numero ?? '—',
    },
    {
      key: 'client',
      label: 'Client',
      render: (row) => row.vente?.client?.nom ?? '—',
    },
    {
      key: 'montant_total',
      label: 'Montant',
      render: (row) => formatCurrency(row.montant_total),
    },
    {
      key: 'statut',
      label: 'Statut',
      render: (row) => (
        <span className={`badge ${getStatutBadgeClass(row.statut)}`}>
          {formatStatut(row.statut)}
        </span>
      ),
    },
  ];

  const reglementColumns: Column<Reglement>[] = [
    { key: 'id', label: '#' },
    {
      key: 'date_reglement',
      label: 'Date',
      render: (row) => formatDate(row.date_reglement),
    },
    {
      key: 'facture',
      label: 'Facture',
      render: (row) => row.facture?.numero ?? '—',
    },
    {
      key: 'montant',
      label: 'Montant',
      render: (row) => formatCurrency(row.montant),
    },
    { key: 'mode', label: 'Mode' },
    { key: 'reference', label: 'Référence' },
  ];

  const handlePrint = () => {
    window.print();
  };

  const openAdd = (kind: VenteModalKind) => {
    setModal({ kind, item: null });
  };

  const openEdit = (kind: VenteModalKind, item: Vente | Reglement) => {
    setModal({ kind, item });
  };

  const handleSave = (formData: Record<string, unknown>) => {
    if (!modal) return;

    if (modal.kind === 'vente') {
      const client = clientsData.find((row) => row.id === Number(formData.client_id));
      const venteData = {
        client_id: Number(formData.client_id) || null,
        numero: String(formData.numero),
        date_vente: String(formData.date_vente),
        montant_total: String(formData.montant_total),
        statut: formData.statut as Vente['statut'],
        observation: (formData.observation as string) || null,
        client,
      };

      if (modal.item) {
        setData((prev) =>
          prev.map((row) => (row.id === modal.item?.id ? { ...row, ...venteData } : row))
        );
      } else {
        const newVente: Vente = {
          id: data.length > 0 ? Math.max(...data.map((row) => row.id)) + 1 : 1,
          ...venteData,
        };
        setData((prev) => [...prev, newVente]);
      }
    }

    if (modal.kind === 'reglement') {
      const facture = facturesData.find((row) => row.id === Number(formData.facture_id));
      const reglementData = {
        facture_id: Number(formData.facture_id),
        montant: String(formData.montant),
        mode: String(formData.mode),
        date_reglement: String(formData.date_reglement),
        reference: (formData.reference as string) || null,
        facture,
      };

      if (modal.item) {
        setReglementsData((prev) =>
          prev.map((row) => (row.id === modal.item?.id ? { ...row, ...reglementData } : row))
        );
      } else {
        const newReglement: Reglement = {
          id: reglementsData.length > 0 ? Math.max(...reglementsData.map((row) => row.id)) + 1 : 1,
          ...reglementData,
        };
        setReglementsData((prev) => [...prev, newReglement]);
      }
    }

    setModal(null);
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

  const getInitialData = (item: Vente | Reglement | null) => {
    if (!modal) return {};

    if (modal.kind === 'vente') {
      const row = item as Vente | null;
      return {
        client_id: row?.client_id ? String(row.client_id) : '',
        numero: row?.numero ?? '',
        date_vente: row?.date_vente ?? new Date().toISOString().slice(0, 10),
        montant_total: row?.montant_total ?? '',
        statut: row?.statut ?? 'brouillon',
        observation: row?.observation ?? '',
      };
    }

    const row = item as Reglement | null;
    return {
      facture_id: row ? String(row.facture_id) : String(facturesData[0]?.id ?? ''),
      montant: row?.montant ?? '',
      mode: row?.mode ?? 'espèces',
      date_reglement: row?.date_reglement ? row.date_reglement.slice(0, 16) : new Date().toISOString().slice(0, 16),
      reference: row?.reference ?? '',
    };
  };

  const validate = (formData: Record<string, unknown>) => {
    const errors: Record<string, string> = {};
    if (modal?.kind === 'vente') {
      if (!formData.numero) errors.numero = 'Le numéro est obligatoire.';
      if (!formData.date_vente) errors.date_vente = 'La date est obligatoire.';
      if (!formData.montant_total || Number(formData.montant_total) < 0) {
        errors.montant_total = 'Le montant est invalide.';
      }
    }
    if (modal?.kind === 'reglement') {
      if (!formData.facture_id) errors.facture_id = 'La facture est obligatoire.';
      if (!formData.montant || Number(formData.montant) <= 0) errors.montant = 'Le montant est invalide.';
      if (!formData.date_reglement) errors.date_reglement = 'La date est obligatoire.';
    }
    return errors;
  };

  const renderForm = (
    _formData: Record<string, unknown>,
    onChange: (name: string, value: string) => void,
    errors: Record<string, string>
  ) => {
    if (!modal) return null;

    if (modal.kind === 'vente') {
      return (
        <>
          <div className="form-field">
            <label htmlFor="vente-client">Client</label>
            <select
              id="vente-client"
              name="client_id"
              className="inline-input"
              onChange={(e) => onChange('client_id', e.target.value)}
            >
              <option value="">Client de passage</option>
              {clientsData.map((row) => (
                <option key={row.id} value={row.id}>
                  {row.nom}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="vente-numero">Numéro *</label>
            <input
              id="vente-numero"
              name="numero"
              type="text"
              className="inline-input"
              onChange={(e) => onChange('numero', e.target.value)}
            />
            {errors.numero && <span className="form-error">{errors.numero}</span>}
          </div>
          <div className="form-field">
            <label htmlFor="vente-date">Date *</label>
            <input
              id="vente-date"
              name="date_vente"
              type="date"
              className="inline-input"
              onChange={(e) => onChange('date_vente', e.target.value)}
            />
            {errors.date_vente && <span className="form-error">{errors.date_vente}</span>}
          </div>
          <div className="form-field">
            <label htmlFor="vente-montant">Montant total *</label>
            <input
              id="vente-montant"
              name="montant_total"
              type="number"
              min="0"
              step="0.01"
              className="inline-input"
              onChange={(e) => onChange('montant_total', e.target.value)}
            />
            {errors.montant_total && <span className="form-error">{errors.montant_total}</span>}
          </div>
          <div className="form-field">
            <label htmlFor="vente-statut">Statut *</label>
            <select
              id="vente-statut"
              name="statut"
              className="inline-input"
              onChange={(e) => onChange('statut', e.target.value)}
            >
              <option value="brouillon">Brouillon</option>
              <option value="confirmee">Confirmée</option>
              <option value="annulee">Annulée</option>
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="vente-observation">Observation</label>
            <input
              id="vente-observation"
              name="observation"
              type="text"
              className="inline-input"
              onChange={(e) => onChange('observation', e.target.value)}
            />
          </div>
        </>
      );
    }

    return (
      <>
        <div className="form-field">
          <label htmlFor="reglement-facture">Facture *</label>
          <select
            id="reglement-facture"
            name="facture_id"
            className="inline-input"
            onChange={(e) => onChange('facture_id', e.target.value)}
          >
            <option value="">— Choisir une facture —</option>
            {facturesData.map((row) => (
              <option key={row.id} value={row.id}>
                {row.numero}
              </option>
            ))}
          </select>
          {errors.facture_id && <span className="form-error">{errors.facture_id}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="reglement-montant">Montant *</label>
          <input
            id="reglement-montant"
            name="montant"
            type="number"
            min="0.01"
            step="0.01"
            className="inline-input"
            onChange={(e) => onChange('montant', e.target.value)}
          />
          {errors.montant && <span className="form-error">{errors.montant}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="reglement-mode">Mode *</label>
          <select
            id="reglement-mode"
            name="mode"
            className="inline-input"
            onChange={(e) => onChange('mode', e.target.value)}
          >
            <option value="espèces">Espèces</option>
            <option value="virement">Virement</option>
            <option value="cheque">Chèque</option>
            <option value="mobile">Mobile money</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="reglement-date">Date *</label>
          <input
            id="reglement-date"
            name="date_reglement"
            type="datetime-local"
            className="inline-input"
            onChange={(e) => onChange('date_reglement', e.target.value)}
          />
          {errors.date_reglement && <span className="form-error">{errors.date_reglement}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="reglement-reference">Référence</label>
          <input
            id="reglement-reference"
            name="reference"
            type="text"
            className="inline-input"
            onChange={(e) => onChange('reference', e.target.value)}
          />
        </div>
      </>
    );
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
        placeholder="Rechercher dans l’onglet..."
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
        <SectionCard title="Liste des ventes">
          <DataTable
            data={filteredVentes}
            columns={venteColumns}
            emptyMessage="Aucune vente enregistrée."
            actionsHeaderLabel="Actions"
            actions={(row) => (
              <RowActions
                onEdit={() => openEdit('vente', row)}
                onDelete={() => setDeleteTarget({ kind: 'vente', item: row })}
                onPrint={handlePrint}
              />
            )}
          />
        </SectionCard>
      )}

      {activeTab === 'lignes' && (
        <SectionCard title="Lignes de vente" subtitle={`${lignesData.length} ligne(s)`}>
          <DataTable
            data={filteredLignes}
            columns={ligneColumns}
            emptyMessage="Aucune ligne de vente."
          />
        </SectionCard>
      )}

      {activeTab === 'clients' && (
        <SectionCard title="Clients associés" subtitle={`${clientsData.length} client(s)`}>
          <DataTable
            data={filteredClients}
            columns={clientColumns}
            emptyMessage="Aucun client."
          />
        </SectionCard>
      )}

      {activeTab === 'factures' && (
        <SectionCard title="Liste des factures">
          <DataTable
            data={filteredFactures}
            columns={factureColumns}
            emptyMessage="Aucune facture."
            actionsHeaderLabel="Actions"
            actions={() => <RowActions onPrint={handlePrint} />}
          />
        </SectionCard>
      )}

      {activeTab === 'reglements' && (
        <SectionCard title="Liste des règlements">
          <DataTable
            data={filteredReglements}
            columns={reglementColumns}
            emptyMessage="Aucun règlement."
            
          />
        </SectionCard>
      )}

      <EntityFormModal
        open={Boolean(modal)}
        onClose={() => setModal(null)}
        title={modal ? `${modal.item ? 'Modifier' : 'Ajouter'} ${modal.kind === 'vente' ? 'une vente' : 'un règlement'}` : ''}
        editItem={modal?.item ?? null}
        onSubmit={handleSave}
        renderForm={renderForm}
        getInitialData={getInitialData}
        validate={validate}
        size="md"
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
