import { useState } from 'react';
import { Printer, Plus } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { PageToolbar } from '@/components/PageToolbar';
import { RowActions } from '@/components/RowActions';
import { rapports } from '@/data/mockData';
import { formatCurrency, formatDate } from '@/utils/formatters';
import type { Rapport } from '@/types';

// Types de rapport disponibles (ordre d'affichage).
const TYPES_RAPPORT: { value: string; label: string }[] = [
  { value: 'ventes', label: 'Rapport des ventes' },
  { value: 'achats', label: 'Rapport des achats' },
  { value: 'stock', label: 'Rapport du stock' },
  { value: 'produits', label: 'Rapport des produits' },
  { value: 'clients', label: 'Rapport des clients' },
  { value: 'financier', label: 'Rapport financier' },
];

export function RapportsPage() {
  const [data, setData] = useState<Rapport[]>(rapports);
  const [search, setSearch] = useState('');
  const [typeRapport, setTypeRapport] = useState<string>('ventes');
  const [dateDebut, setDateDebut] = useState<string>('');
  const [dateFin, setDateFin] = useState<string>('');

  const filtered = search
    ? data.filter(
        (r) =>
          r.type.toLowerCase().includes(search.toLowerCase()) ||
          (r.description ?? '').toLowerCase().includes(search.toLowerCase())
      )
    : data;

  const columns: Column<Rapport>[] = [
    { key: 'id', label: '#' },
    {
      key: 'type',
      label: 'Type',
      render: (row) =>
        TYPES_RAPPORT.find((t) => t.value === row.type)?.label ?? row.type,
    },
    {
      key: 'date_debut',
      label: 'Date de début',
      render: (row) => formatDate(row.date_debut),
    },
    {
      key: 'date_fin',
      label: 'Date de fin',
      render: (row) => formatDate(row.date_fin),
    },
    {
      key: 'montant_total',
      label: 'Montant total',
      render: (row) => formatCurrency(row.montant_total),
    },
    { key: 'description', label: 'Description' },
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleGenerer = () => {
    if (!dateDebut || !dateFin) {
      alert('Veuillez renseigner la date de début et la date de fin.');
      return;
    }
    if (dateDebut > dateFin) {
      alert('La date de début ne peut pas être après la date de fin.');
      return;
    }

    const typeLabel =
      TYPES_RAPPORT.find((t) => t.value === typeRapport)?.label ?? typeRapport;

    const nouveauRapport: Rapport = {
      id: data.length > 0 ? Math.max(...data.map((r) => r.id)) + 1 : 1,
      type: typeRapport,
      date_debut: dateDebut,
      date_fin: dateFin,
      montant_total: '0.00',
      description: `${typeLabel} du ${formatDate(dateDebut)} au ${formatDate(dateFin)}.`,
    };

    // Le rapport généré s'affiche dans le tableau « Liste des rapports ».
    setData((prev) => [...prev, nouveauRapport]);
    setDateDebut('');
    setDateFin('');
  };

  return (
    <div className="page-container">
      <PageHeader
        title="Rapports"
        subtitle={`${data.length} rapport(s) enregistré(s)`}
      />

      <PageToolbar
        search={search}
        onSearch={setSearch}
        placeholder="Rechercher un rapport..."
        actions={
          <button type="button" className="btn-primary" onClick={handlePrint}>
            <Printer size={15} /> Imprimer
          </button>
        }
      />

      {/* Formulaire de génération + rapport sélectionné */}
      <SectionCard
        title={
          <>
            Rapport sélectionné :{' '}
            <strong>
              {TYPES_RAPPORT.find((t) => t.value === typeRapport)?.label ?? ''}
            </strong>
          </>
        }
      >
        <form className="report-form" onSubmit={handleGenerer}>
          <div className="form-field">
            <label htmlFor="type-rapport">Type de rapport</label>
            <select
              id="type-rapport"
              name="type-rapport"
              className="inline-input"
              value={typeRapport}
              onChange={(e) => setTypeRapport(e.target.value)}
            >
              {TYPES_RAPPORT.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="date-debut">Date de début</label>
            <input
              id="date-debut"
              name="date-debut"
              type="date"
              className="inline-input"
              value={dateDebut}
              onChange={(e) => setDateDebut(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label htmlFor="date-fin">Date de fin</label>
            <input
              id="date-fin"
              name="date-fin"
              type="date"
              className="inline-input"
              value={dateFin}
              onChange={(e) => setDateFin(e.target.value)}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              <Plus size={16} /> Générer le rapport
            </button>
          </div>
        </form>
      </SectionCard>

      <SectionCard title="Liste des rapports">
        <DataTable
          data={filtered}
          columns={columns}
          emptyMessage="Aucun rapport enregistré."
          actionsHeaderLabel="Actions"
          actions={(row) => (
            <RowActions
              onEdit={() => {
                setTypeRapport(row.type);
                setDateDebut(row.date_debut);
                setDateFin(row.date_fin);
              }}
              onDelete={() => {
                setData((prev) => prev.filter((r) => r.id !== row.id));
              }}
            />
          )}
        />
      </SectionCard>
    </div>
  );
}
