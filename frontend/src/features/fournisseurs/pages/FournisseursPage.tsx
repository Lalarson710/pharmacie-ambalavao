import { useState, useEffect } from 'react';
import { Building2, Plus } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { PageToolbar } from '@/components/PageToolbar';
import { RowActions } from '@/components/RowActions';
import { EntityFormModal } from '@/components/EntityFormModal';
import { ConfirmModal } from '@/components/ConfirmModal';
import { useToast } from '@/components/Toast';
import type { Fournisseur } from '@/types';
import { fournisseursApi } from '../api/fournisseurs';

export function FournisseursPage() {
  const { showToast } = useToast();
  const [data, setData] = useState<Fournisseur[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Fournisseur | null>(null);
  const [deleteItem, setDeleteItem] = useState<Fournisseur | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadFournisseurs = async () => {
      try {
        const fetched = await fournisseursApi.getAll();
        console.log('%c[LOG] Fournisseurs chargés:', 'color: blue', fetched);
        setData(fetched);
      } catch (error) {
        console.error('Erreur chargement:', error);
        showToast('Impossible de charger les fournisseurs.', 'error');
      } finally {
        setLoading(false);
      }
    };
    loadFournisseurs();
  }, [showToast]);

  const filtered = search
    ? data.filter(
        (r) =>
          r.nom.toLowerCase().includes(search.toLowerCase()) ||
          (r.telephone ?? '').includes(search) ||
          (r.email ?? '').toLowerCase().includes(search.toLowerCase()) ||
          (r.adresse ?? '').toLowerCase().includes(search.toLowerCase())
      )
    : data;

  const columns: Column<Fournisseur>[] = [
    { key: 'id', label: '#' },
    { key: 'nom', label: 'Nom' },
    { key: 'telephone', label: 'Téléphone' },
    { key: 'email', label: 'Email' },
    { key: 'adresse', label: 'Adresse' },
    {
      key: 'actif',
      label: 'Actif',
      render: (row) => (
        <span className={`badge ${row.actif ? 'badge-active' : 'badge-inactive'}`}>
          {row.actif ? 'Oui' : 'Non'}
        </span>
      ),
    },
  ];

  const handleSubmit = async (formData: Record<string, unknown>) => {
    console.log('%c[LOG] handleSubmit appelé:', 'color: green', { editItem, formData });
    try {
      const payload = {
        nom: String(formData.nom),
        telephone: (formData.telephone as string) || null,
        email: (formData.email as string) || null,
        adresse: (formData.adresse as string) || null,
        actif: formData.actif === 'true',
      };

      if (editItem) {
        const saved = await fournisseursApi.update(editItem.id, payload);
        setData((prev) => prev.map((r) => (r.id === editItem.id ? saved : r)));
        showToast('Fournisseur modifié avec succès', 'success');
      } else {
        const saved = await fournisseursApi.create(payload);
        setData((prev) => [...prev, saved]);
        showToast('Fournisseur créé avec succès', 'success');
      }
      setModalOpen(false);
      setEditItem(null);
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
      const msg =
        axiosError.response?.data?.message ||
        (axiosError.response?.data?.errors
          ? Object.values(axiosError.response.data.errors).flat().join(', ')
          : '') ||
        'Erreur lors de la sauvegarde';
      showToast(msg, 'error');
    }
  };

  const confirmDelete = () => {
    if (!deleteItem) return;
    setData((prev) => prev.filter((r) => r.id !== deleteItem.id));
    setDeleteItem(null);
    (async () => {
      try {
        await fournisseursApi.delete(deleteItem.id);
        showToast(`Fournisseur « ${deleteItem.nom} » supprimé`, 'success');
      } catch (error: unknown) {
        console.error('Erreur suppression:', error);
        const axiosError = error as { response?: { data?: { message?: string } } };
        const specificMessage = axiosError.response?.data?.message;
        if (specificMessage) {
          showToast(specificMessage, 'error');
        } else {
          showToast('Impossible de supprimer ce fournisseur.', 'error');
        }
        setData((prev) => [...prev, deleteItem]);
      }
    })();
  };

  const handleEditClick = (row: Fournisseur) => {
    console.log('%c[LOG] handleEditClick — clique modify:', 'color: purple', row);
    setEditItem(row);
    setModalOpen(true);
  };

  const handleAddClick = () => {
    console.log('%c[LOG] handleAddClick — clique Ajouter', 'color: purple');
    setEditItem(null);
    setModalOpen(true);
  };

  const getInitialData = (item: Fournisseur | null) => {
    const result = {
      nom: item?.nom ?? '',
      telephone: item?.telephone ?? '',
      email: item?.email ?? '',
      adresse: item?.adresse ?? '',
      actif: item ? String(item.actif) : 'true',
    };
    console.log('%c[LOG] getInitialData:', 'color: orange', { item, result });
    return result;
  };

  const validate = (fd: Record<string, unknown>): Record<string, string> => {
    const errs: Record<string, string> = {};
    if (!fd.nom) errs.nom = 'Le nom est obligatoire.';
    return errs;
  };

  const renderForm = (
    _formData: Record<string, unknown>,
    onChange: (name: string, value: string) => void,
    errors: Record<string, string>
  ) => {
    return (
      <>
        <div className="form-field form-field-full">
          <label htmlFor="fournisseur-nom">
            Nom <span className="required-mark">*</span>
          </label>
          <input
            id="fournisseur-nom"
            name="nom"
            type="text"
            className="inline-input"
            value={String(_formData.nom ?? '')}
            onChange={(e) => onChange('nom', e.target.value)}
          />
          {errors.nom && <span className="form-error">{errors.nom}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="fournisseur-telephone">Téléphone</label>
          <input
            id="fournisseur-telephone"
            name="telephone"
            type="text"
            className="inline-input"
            value={String(_formData.telephone ?? '')}
            onChange={(e) => onChange('telephone', e.target.value)}
          />
        </div>
        <div className="form-field">
          <label htmlFor="fournisseur-email">Email</label>
          <input
            id="fournisseur-email"
            name="email"
            type="email"
            className="inline-input"
            value={String(_formData.email ?? '')}
            onChange={(e) => onChange('email', e.target.value)}
          />
        </div>
        <div className="form-field form-field-full">
          <label htmlFor="fournisseur-adresse">Adresse</label>
          <input
            id="fournisseur-adresse"
            name="adresse"
            type="text"
            className="inline-input"
            value={String(_formData.adresse ?? '')}
            onChange={(e) => onChange('adresse', e.target.value)}
          />
        </div>
        <div className="form-field">
          <label htmlFor="fournisseur-actif">Statut</label>
          <select
            id="fournisseur-actif"
            name="actif"
            className="inline-input"
            value={String(_formData.actif ?? 'true')}
            onChange={(e) => onChange('actif', e.target.value)}
          >
            <option value="true">Oui</option>
            <option value="false">Non</option>
          </select>
        </div>
      </>
    );
  };

  return (
    <div className="page-container">
      <PageHeader
        title="Fournisseurs"
        subtitle={`${data.length} fournisseur(s) enregistré(s)`}
      />

      <PageToolbar
        search={search}
        onSearch={setSearch}
        placeholder="Rechercher un fournisseur..."
        actions={
          <button type="button" className="btn-primary" onClick={handleAddClick}>
            <Plus size={15} /> Ajouter
          </button>
        }
      />

      <SectionCard title="Liste des fournisseurs">
        <DataTable
          data={loading ? [] : filtered}
          columns={columns}
          emptyMessage={loading ? 'Chargement des fournisseurs...' : 'Aucun fournisseur enregistré.'}
          actionsHeaderLabel="Actions"
          actions={(row) => (
            <RowActions
              onEdit={() => handleEditClick(row)}
              onDelete={() => setDeleteItem(row)}
            />
          )}
        />
      </SectionCard>

      <EntityFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditItem(null);
        }}
        title={editItem ? 'Modifier le fournisseur' : 'Ajouter un fournisseur'}
        icon={<Building2 size={18} />}
        subtitle={
          editItem
            ? 'Actualisez les coordonnées de ce fournisseur.'
            : 'Enregistrez un nouveau fournisseur pour vos achats.'
        }
        editItem={editItem}
        onSubmit={handleSubmit}
        renderForm={renderForm}
        getInitialData={getInitialData}
        validate={validate}
        size="md"
      />

      <ConfirmModal
        open={!!deleteItem}
        title="Supprimer le fournisseur"
        message={`Confirmer la suppression de « ${deleteItem?.nom ?? ''} » ?`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteItem(null)}
      />
    </div>
  );
}
