import { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { reglements, factures } from '@/data/mockData';
import { formatCurrency, formatDate } from '@/utils/formatters';
import type { Reglement, Facture } from '@/types';

interface ReglementForm {
  facture_id: string;
  montant: string;
  mode: string;
  date_reglement: string;
  reference: string;
}

const modes = ['espèces', 'virement', 'carte', 'chèque', 'mobile money'];

export function ReglementsPage() {
  const [form, setForm] = useState<ReglementForm>({
    facture_id: '',
    montant: '',
    mode: 'espèces',
    date_reglement: new Date().toISOString().slice(0, 16),
    reference: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const totalReglements = reglements.reduce(
    (sum, r) => sum + Number(r.montant),
    0
  );

  const columns: Column<Reglement>[] = [
    { key: 'id', label: '#' },
    {
      key: 'facture',
      label: 'Facture',
      render: (row) => row.facture?.numero ?? '—',
    },
    {
      key: 'client',
      label: 'Client',
      render: (row) => row.facture?.vente?.client?.nom ?? '—',
    },
    {
      key: 'montant',
      label: 'Montant',
      render: (row) => formatCurrency(row.montant),
    },
    { key: 'mode', label: 'Mode' },
    {
      key: 'date_reglement',
      label: 'Date',
      render: (row) => formatDate(row.date_reglement),
    },
    { key: 'reference', label: 'Référence' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!form.facture_id) {
      setError('Veuillez sélectionner une facture.');
      return;
    }
    if (!form.montant || Number(form.montant) <= 0) {
      setError('Le montant doit être supérieur à 0.');
      return;
    }

    setSuccess('Règlement enregistré avec succès (démo).');
    setForm({
      facture_id: '',
      montant: '',
      mode: 'espèces',
      date_reglement: new Date().toISOString().slice(0, 16),
      reference: '',
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="page-container">
      <PageHeader
        title="Règlements"
        subtitle={`${reglements.length} règlement(s) — ${formatCurrency(totalReglements)} au total}`}
      />

      <SectionCard title="Enregistrer un règlement">
        <form className="form-grid" onSubmit={handleSubmit}>
          {error && <p className="form-error">{error}</p>}
          {success && <p className="form-success">{success}</p>}

          <div className="form-field">
            <label htmlFor="facture_id">Facture *</label>
            <select
              id="facture_id"
              name="facture_id"
              value={form.facture_id}
              onChange={handleInputChange}
            >
              <option value="">— Choisir une facture —</option>
              {factures.map((f: Facture) => (
                <option key={f.id} value={f.id}>
                  {f.numero} — {formatCurrency(f.montant_total)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="montant">Montant (MGA) *</label>
            <input
              type="number"
              id="montant"
              name="montant"
              min="0.01"
              step="0.01"
              value={form.montant}
              onChange={handleInputChange}
              placeholder="0.00"
            />
          </div>

          <div className="form-field">
            <label htmlFor="mode">Mode de paiement *</label>
            <select
              id="mode"
              name="mode"
              value={form.mode}
              onChange={handleInputChange}
            >
              {modes.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="date_reglement">Date du règlement *</label>
            <input
              type="datetime-local"
              id="date_reglement"
              name="date_reglement"
              value={form.date_reglement}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-field">
            <label htmlFor="reference">Référence</label>
            <input
              type="text"
              id="reference"
              name="reference"
              value={form.reference}
              onChange={handleInputChange}
              placeholder="N° chèque, virement, etc."
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              Enregistrer le règlement
            </button>
          </div>
        </form>
      </SectionCard>

      <SectionCard title="Liste des règlements" subtitle={`${reglements.length} règlement(s)`}>
        <DataTable
          data={reglements}
          columns={columns}
          emptyMessage="Aucun règlement enregistré."
        />
      </SectionCard>
    </div>
  );
}
