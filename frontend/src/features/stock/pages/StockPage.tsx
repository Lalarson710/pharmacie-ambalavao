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
import { inventaires, lots, mouvementsStock, produits } from '@/data/mockData';
import { formatCurrency, formatDate } from '@/utils/formatters';
import type { Inventaire, Lot, MouvementStock, Produit } from '@/types';

const stockTabs = [
  { id: 'stock-produit', label: 'Stock par produit' },
  { id: 'lots', label: 'Lots' },
  { id: 'entrees', label: 'Entrées' },
  { id: 'sorties', label: 'Sorties' },
  { id: 'mouvements', label: 'Mouvements' },
  { id: 'inventaires', label: 'Inventaires' },
];

type StockModalKind = 'mouvement' | 'inventaire';

interface StockModalState {
  kind: StockModalKind;
  item: MouvementStock | Inventaire | null;
}

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

  const stockColumns: Column<Produit & { quantite_totale: number }>[] = [
    { key: 'id', label: '#' },
    { key: 'nom', label: 'Produit' },
    { key: 'categories', label: 'Catégorie', render: (row) => row.categorie?.nom ?? '—' },
    {
      key: 'unite',
      label: 'Unité',
      render: (row) => row.unite?.abreviation ?? '—',
    },
    {
      key: 'quantite_totale',
      label: 'Qté en stock',
      render: (row) => row.quantite_totale,
    },
    {
      key: 'stock_minimum',
      label: 'Stock min.',
      render: (row) => row.stock_minimum,
    },
    {
      key: 'valeur_stock',
      label: 'Valeur stock',
      render: (row) =>
        formatCurrency(Number(row.prix_achat) * row.quantite_totale),
    },
  ];

  const lotColumns: Column<Lot>[] = [
    { key: 'id', label: '#' },
    {
      key: 'produit',
      label: 'Produit',
      render: (row) => row.produit?.nom ?? '—',
    },
    { key: 'numero_lot', label: 'N° de lot' },
    {
      key: 'date_peremption',
      label: 'Date de péremption',
      render: (row) => formatDate(row.date_peremption),
    },
    { key: 'quantite', label: 'Quantité' },
  ];

  const mouvementColumns: Column<MouvementStock>[] = [
    { key: 'id', label: '#' },
    {
      key: 'lot',
      label: 'Produit',
      render: (row) => row.lot?.produit?.nom ?? '—',
    },
    { key: 'type', label: 'Type' },
    { key: 'quantite', label: 'Quantité' },
    { key: 'motif', label: 'Motif' },
    { key: 'created_at', label: 'Date', render: (row) => formatDate(row.created_at ?? '') },
  ];

  const inventaireColumns: Column<Inventaire>[] = [
    { key: 'id', label: '#' },
    {
      key: 'date_inventaire',
      label: 'Date',
      render: (row) => formatDate(row.date_inventaire),
    },
    { key: 'motif', label: 'Motif' },
    {
      key: 'lignes',
      label: 'Lignes',
      render: (row) => row.lignes?.length ?? 0,
    },
  ];

  const filteredStock = search
    ? stockParProduit.filter((row) =>
        [row.nom, row.categorie?.nom, row.unite?.abreviation]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(search.toLowerCase()))
      )
    : stockParProduit;

  const filteredLots = search
    ? lots.filter((row) =>
        [row.produit?.nom, row.numero_lot]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(search.toLowerCase()))
      )
    : lots;

  const filteredMouvements = search
    ? mouvementsData.filter((row) =>
        [row.lot?.produit?.nom, row.type, row.motif ?? '', row.quantite]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(search.toLowerCase()))
      )
    : mouvementsData;

  const filteredInventaires = search
    ? inventairesData.filter((row) =>
        [row.date_inventaire, row.motif ?? '', row.lignes?.map((line) => line.lot?.produit?.nom).join(' ')]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(search.toLowerCase()))
      )
    : inventairesData;

  const handlePrint = () => {
    window.print();
  };

  const openAdd = (kind: StockModalKind) => {
    setModal({ kind, item: null });
  };

  const openEdit = (kind: StockModalKind, item: MouvementStock | Inventaire) => {
    setModal({ kind, item });
  };

  const handleSave = (formData: Record<string, unknown>) => {
    if (!modal) return;

    if (modal.kind === 'mouvement') {
      const lot = lots.find((row) => row.id === Number(formData.lot_id));
      const mouvementData = {
        lot_id: Number(formData.lot_id),
        type: formData.type as MouvementStock['type'],
        quantite: Number(formData.quantite),
        motif: (formData.motif as string) || null,
        lot,
      };

      if (modal.item) {
        setMouvementsData((prev) =>
          prev.map((row) => (row.id === modal.item?.id ? { ...row, ...mouvementData } : row))
        );
      } else {
        const newMouvement: MouvementStock = {
          id: mouvementsData.length > 0 ? Math.max(...mouvementsData.map((row) => row.id)) + 1 : 1,
          ...mouvementData,
        };
        setMouvementsData((prev) => [...prev, newMouvement]);
      }
    }

    if (modal.kind === 'inventaire') {
      const inventaireData = {
        date_inventaire: String(formData.date_inventaire),
        motif: (formData.motif as string) || null,
      };

      if (modal.item) {
        setInventairesData((prev) =>
          prev.map((row) => (row.id === modal.item?.id ? { ...row, ...inventaireData } : row))
        );
      } else {
        const newInventaire: Inventaire = {
          id: inventairesData.length > 0 ? Math.max(...inventairesData.map((row) => row.id)) + 1 : 1,
          ...inventaireData,
        };
        setInventairesData((prev) => [...prev, newInventaire]);
      }
    }

    setModal(null);
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

  const getInitialData = (item: MouvementStock | Inventaire | null) => {
    if (!modal) return {};

    if (modal.kind === 'mouvement') {
      const row = item as MouvementStock | null;
      return {
        lot_id: row ? String(row.lot_id) : '',
        type: row?.type ?? 'entree',
        quantite: row ? String(row.quantite) : '',
        motif: row?.motif ?? '',
      };
    }

    const row = item as Inventaire | null;
    return {
      date_inventaire: row?.date_inventaire ?? new Date().toISOString().slice(0, 10),
      motif: row?.motif ?? '',
    };
  };

  const validate = (formData: Record<string, unknown>) => {
    const errors: Record<string, string> = {};
    if (modal?.kind === 'mouvement') {
      if (!formData.lot_id) errors.lot_id = 'Le lot est obligatoire.';
      if (!formData.quantite || Number(formData.quantite) <= 0) {
        errors.quantite = 'La quantité est invalide.';
      }
    }
    if (modal?.kind === 'inventaire' && !formData.date_inventaire) {
      errors.date_inventaire = 'La date est obligatoire.';
    }
    return errors;
  };

  const renderForm = (
    _formData: Record<string, unknown>,
    onChange: (name: string, value: string) => void,
    errors: Record<string, string>
  ) => {
    if (!modal) return null;

    if (modal.kind === 'mouvement') {
      return (
        <>
          <div className="form-field">
            <label htmlFor="mouvement-lot">Lot *</label>
            <select
              id="mouvement-lot"
              name="lot_id"
              className="inline-input"
              onChange={(e) => onChange('lot_id', e.target.value)}
            >
              <option value="">— Choisir un lot —</option>
              {lots.map((row) => (
                <option key={row.id} value={row.id}>
                  {row.produit?.nom} — {row.numero_lot}
                </option>
              ))}
            </select>
            {errors.lot_id && <span className="form-error">{errors.lot_id}</span>}
          </div>
          <div className="form-field">
            <label htmlFor="mouvement-type">Type *</label>
            <select
              id="mouvement-type"
              name="type"
              className="inline-input"
              onChange={(e) => onChange('type', e.target.value)}
            >
              <option value="entree">Entrée</option>
              <option value="sortie">Sortie</option>
              <option value="ajustement">Ajustement</option>
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="mouvement-quantite">Quantité *</label>
            <input
              id="mouvement-quantite"
              name="quantite"
              type="number"
              min="1"
              step="1"
              className="inline-input"
              onChange={(e) => onChange('quantite', e.target.value)}
            />
            {errors.quantite && <span className="form-error">{errors.quantite}</span>}
          </div>
          <div className="form-field">
            <label htmlFor="mouvement-motif">Motif</label>
            <input
              id="mouvement-motif"
              name="motif"
              type="text"
              className="inline-input"
              onChange={(e) => onChange('motif', e.target.value)}
            />
          </div>
        </>
      );
    }

    return (
      <>
        <div className="form-field">
          <label htmlFor="inventaire-date">Date *</label>
          <input
            id="inventaire-date"
            name="date_inventaire"
            type="date"
            className="inline-input"
            onChange={(e) => onChange('date_inventaire', e.target.value)}
          />
          {errors.date_inventaire && <span className="form-error">{errors.date_inventaire}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="inventaire-motif">Motif</label>
          <input
            id="inventaire-motif"
            name="motif"
            type="text"
            className="inline-input"
            onChange={(e) => onChange('motif', e.target.value)}
          />
        </div>
      </>
    );
  };

  return (
    <div className="page-container">
      <PageHeader
        title="Gestion du stock"
        subtitle="Vue d’ensemble des quantités, lots et mouvements"
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
        <SectionCard title="Stock par produit">
          <DataTable
            data={filteredStock}
            columns={stockColumns}
            emptyMessage="Aucun produit en stock."
          />
        </SectionCard>
      )}

      {activeTab === 'lots' && (
        <SectionCard title="Lots">
          <DataTable
            data={filteredLots}
            columns={lotColumns}
            emptyMessage="Aucun lot enregistré."
          />
        </SectionCard>
      )}

      {activeTab === 'entrees' && (
        <SectionCard title="Entrées de stock">
          <DataTable
            data={filteredMouvements.filter((row) => row.type === 'entree')}
            columns={mouvementColumns}
            emptyMessage="Aucune entrée enregistrée."
            actionsHeaderLabel="Actions"
            actions={(row) => (
              <RowActions
                onEdit={() => openEdit('mouvement', row)}
                onDelete={() => setDeleteTarget({ kind: 'mouvement', item: row })}
              />
            )}
          />
        </SectionCard>
      )}

      {activeTab === 'sorties' && (
        <SectionCard title="Sorties de stock">
          <DataTable
            data={filteredMouvements.filter((row) => row.type === 'sortie')}
            columns={mouvementColumns}
            emptyMessage="Aucune sortie enregistrée."
            actionsHeaderLabel="Actions"
            actions={(row) => (
              <RowActions
                onEdit={() => openEdit('mouvement', row)}
                onDelete={() => setDeleteTarget({ kind: 'mouvement', item: row })}
              />
            )}
          />
        </SectionCard>
      )}

      {activeTab === 'mouvements' && (
        <SectionCard title="Historique des mouvements">
          <DataTable
            data={filteredMouvements}
            columns={mouvementColumns}
            emptyMessage="Aucun mouvement enregistré."
          />
        </SectionCard>
      )}

      {activeTab === 'inventaires' && (
        <SectionCard title="Inventaires">
          <DataTable
            data={filteredInventaires}
            columns={inventaireColumns}
            emptyMessage="Aucun inventaire enregistré."
            actionsHeaderLabel="Actions"
            actions={(row) => (
              <RowActions
                onEdit={() => openEdit('inventaire', row)}
                onDelete={() => setDeleteTarget({ kind: 'inventaire', item: row })}
              />
            )}
          />
        </SectionCard>
      )}

      <EntityFormModal
        open={Boolean(modal)}
        onClose={() => setModal(null)}
        title={modal ? `${modal.item ? 'Modifier' : 'Ajouter'} ${modal.kind === 'mouvement' ? 'un mouvement' : 'un inventaire'}` : ''}
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
          deleteTarget?.kind === 'mouvement'
            ? 'Voulez-vous vraiment supprimer ce mouvement ?'
            : 'Voulez-vous vraiment supprimer cet inventaire ?'
        }
        confirmLabel="Supprimer"
      />
    </div>
  );
}
