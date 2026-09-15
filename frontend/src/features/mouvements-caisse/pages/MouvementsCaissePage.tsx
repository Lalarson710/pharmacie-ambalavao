import { useState } from 'react';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { PageToolbar } from '@/components/PageToolbar';
import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { RowActions } from '@/components/RowActions';
import { EntityFormModal } from '@/components/EntityFormModal';
import { caisses, mouvementsCaisse } from '@/data/mockData';
import { formatCurrency, formatDateTime } from '@/utils/formatters';
import type { MouvementCaisse } from '@/types';

interface MouvementModalState {
  item: MouvementCaisse | null;
}

export function MouvementsCaissePage() {
  const [data, setData] = useState<MouvementCaisse[]>(mouvementsCaisse);
  const [modal, setModal] = useState<MouvementModalState | null>(null);
  const [search, setSearch] = useState('');

  const filtered = search
    ? data.filter(
        (row) =>
          (row.motif ?? '').toLowerCase().includes(search.toLowerCase()) ||
          row.type.toLowerCase().includes(search.toLowerCase()) ||
          String(row.montant).includes(search),
      )
    : data;

  const columns: Column<MouvementCaisse>[] = [
    { key: 'id', label: '#' },
    {
      key: 'caisse',
      label: 'Caisse',
      render: (row) => `#${row.caisse_id}`,
    },
    {
      key: 'type',
      label: 'Type',
      render: (row) => (
        <span className={`badge ${row.type === 'entree' ? 'badge-active' : 'badge-inactive'}`}>
          {row.type === 'entree' ? 'Entrée' : 'Sortie'}
        </span>
      ),
    },
    {
      key: 'montant',
      label: 'Montant',
      render: (row) => formatCurrency(row.montant),
    },
    { key: 'motif', label: 'Motif' },
    {
      key: 'reglement',
      label: 'Règlement',
      render: (row) => row.reglement?.reference ?? '—',
    },
    {
      key: 'created_at',
      label: 'Date',
      render: (row) => formatDateTime(row.created_at ?? ''),
    },
  ];

  const handleSave = (formData: Record<string, unknown>) => {
    const caisse = caisses.find((row) => row.id === Number(formData.caisse_id));
    const mouvementData = {
      caisse_id: Number(formData.caisse_id),
      reglement_id: null,
      type: formData.type as MouvementCaisse['type'],
      montant: String(formData.montant),
      motif: (formData.motif as string) || null,
      caisse,
    };

    if (modal?.item) {
      setData((prev) =>
        prev.map((row) =>
          row.id === modal.item?.id ? { ...row, ...mouvementData } : row,
        ),
      );
    } else {
      const newMouvement: MouvementCaisse = {
        id: data.length > 0 ? Math.max(...data.map((row) => row.id)) + 1 : 1,
        ...mouvementData,
        created_at: new Date().toISOString(),
      };
      setData((prev) => [...prev, newMouvement]);
    }

    setModal(null);
  };

  const getInitialData = (item: MouvementCaisse | null) => ({
    caisse_id: item ? String(item.caisse_id) : String(caisses[0]?.id ?? ''),
    type: item?.type ?? 'entree',
    montant: item?.montant ?? '',
    motif: item?.motif ?? '',
  });

  const validate = (formData: Record<string, unknown>) => {
    const errors: Record<string, string> = {};
    if (!formData.caisse_id) errors.caisse_id = 'La caisse est obligatoire.';
    if (!formData.montant || Number(formData.montant) <= 0) {
      errors.montant = 'Le montant est invalide.';
    }
    return errors;
  };

  const renderForm = (
    _formData: Record<string, unknown>,
    onChange: (name: string, value: string) => void,
    errors: Record<string, string>,
  ) => (
    <>
      <div className="form-field">
        <label htmlFor="mouvement-caisse">Caisse *</label>
        <select
          id="mouvement-caisse"
          name="caisse_id"
          className="inline-input"
          onChange={(event) => onChange('caisse_id', event.target.value)}
        >
          <option value="">— Choisir une caisse —</option>
          {caisses.map((row) => (
            <option key={row.id} value={row.id}>
              Caisse #{row.id}
            </option>
          ))}
        </select>
        {errors.caisse_id && <span className="form-error">{errors.caisse_id}</span>}
      </div>
      <div className="form-field">
        <label htmlFor="mouvement-type">Type *</label>
        <select
          id="mouvement-type"
          name="type"
          className="inline-input"
          onChange={(event) => onChange('type', event.target.value)}
        >
          <option value="entree">Entrée</option>
          <option value="sortie">Sortie</option>
        </select>
      </div>
      <div className="form-field">
        <label htmlFor="mouvement-montant">Montant (MGA) *</label>
        <input
          id="mouvement-montant"
          name="montant"
          type="number"
          min="0.01"
          step="0.01"
          className="inline-input"
          onChange={(event) => onChange('montant', event.target.value)}
          placeholder="0.00"
        />
        {errors.montant && <span className="form-error">{errors.montant}</span>}
      </div>
      <div className="form-field">
        <label htmlFor="mouvement-motif">Motif</label>
        <input
          id="mouvement-motif"
          name="motif"
          type="text"
          className="inline-input"
          onChange={(event) => onChange('motif', event.target.value)}
          placeholder="Motif du mouvement"
        />
      </div>
    </>
  );

  return (
    <div className="page-container">
      <PageHeader
        title="Mouvements de caisse"
        subtitle={`${data.length} mouvement(s)`}
      />

      <PageToolbar
        search={search}
        onSearch={setSearch}
        placeholder="Rechercher dans les mouvements..."
        actions={
          <button type="button" className="btn-primary" onClick={() => setModal({ item: null })}>
            <Plus size={15} /> Ajouter un mouvement
          </button>
        }
      />

      <SectionCard title="Liste des mouvements de caisse">
        <DataTable
          data={filtered}
          columns={columns}
          emptyMessage="Aucun mouvement de caisse."
          actionsHeaderLabel="Actions"
          actions={(row) => (
            <RowActions
              onEdit={() => setModal({ item: row })}
              editLabel="Modifier"
            />
          )}
        />
      </SectionCard>

      <EntityFormModal
        open={Boolean(modal)}
        onClose={() => setModal(null)}
        title={modal?.item ? 'Modifier le mouvement' : 'Ajouter un mouvement'}
        editItem={modal?.item ?? null}
        onSubmit={handleSave}
        renderForm={renderForm}
        getInitialData={getInitialData}
        validate={validate}
        size="md"
      />
    </div>
  );
}
