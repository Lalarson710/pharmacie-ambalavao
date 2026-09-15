import { useMemo, useState } from 'react';
import { Printer, RefreshCw } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { PageTabs } from '@/components/PageTabs';
import { PageToolbar } from '@/components/PageToolbar';
import {
  statistiquesVentes,
  produitsPlusVendus,
  ventes,
} from '@/data/mockData';
import {
  formatCurrency,
  formatDate,
  formatStatut,
} from '@/utils/formatters';
import type { Vente, ProduitPlusVendu } from '@/types';

const statistiquesTabs = [
  { id: 'resume', label: 'Résumé des ventes' },
  { id: 'ca', label: "Chiffre d'affaires" },
  { id: 'ventes', label: 'Ventes' },
  { id: 'produits', label: 'Produits les plus vendus' },
];

interface PeriodFilterProps {
  dateDebut: string;
  dateFin: string;
  onDateDebutChange: (value: string) => void;
  onDateFinChange: (value: string) => void;
  onRefresh?: () => void;
}

function PeriodFilter({
  dateDebut,
  dateFin,
  onDateDebutChange,
  onDateFinChange,
  onRefresh,
}: PeriodFilterProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '16px',
        flexWrap: 'nowrap',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}
      >
        <label
          htmlFor="stat-date-debut"
          style={{
            fontSize: '13px',
            fontWeight: 500,
          }}
        >
          Date de début
        </label>

        <input
          id="stat-date-debut"
          type="date"
          className="inline-input"
          value={dateDebut}
          onChange={(e) => onDateDebutChange(e.target.value)}
          style={{
            width: '150px',
            height: '38px',
          }}
        />
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}
      >
        <label
          htmlFor="stat-date-fin"
          style={{
            fontSize: '13px',
            fontWeight: 500,
          }}
        >
          Date de fin
        </label>

        <input
          id="stat-date-fin"
          type="date"
          className="inline-input"
          value={dateFin}
          onChange={(e) => onDateFinChange(e.target.value)}
          style={{
            width: '150px',
            height: '38px',
          }}
        />
      </div>

      {onRefresh && (
        <button
          type="button"
          className="btn-primary"
          onClick={onRefresh}
          style={{
            height: '38px',
            whiteSpace: 'nowrap',
          }}
        >
          <RefreshCw size={15} />
          Actualiser
        </button>
      )}
    </div>
  );
}

export function StatistiquesPage() {
  const [activeTab, setActiveTab] = useState('resume');

  const [dateDebut, setDateDebut] = useState('2025-09-01');
  const [dateFin, setDateFin] = useState('2025-09-12');

  const [appliedDateDebut, setAppliedDateDebut] = useState('2025-09-01');
  const [appliedDateFin, setAppliedDateFin] = useState('2025-09-12');

  const [venteSearch, setVenteSearch] = useState('');
  const [produitSearch, setProduitSearch] = useState('');

  const handleRefresh = () => {
    if (!dateDebut || !dateFin) {
      alert('Veuillez renseigner les deux dates.');
      return;
    }

    if (dateDebut > dateFin) {
      alert('La date de début ne peut pas être après la date de fin.');
      return;
    }

    setAppliedDateDebut(dateDebut);
    setAppliedDateFin(dateFin);
  };

  const ventesPeriode = useMemo(() => {
    return ventes.filter(
      (vente) =>
        vente.date_vente >= appliedDateDebut &&
        vente.date_vente <= appliedDateFin
    );
  }, [appliedDateDebut, appliedDateFin]);

  const filteredVentes = useMemo(() => {
    const search = venteSearch.trim().toLowerCase();

    if (!search) {
      return ventesPeriode;
    }

    return ventesPeriode.filter(
      (vente) =>
        vente.numero.toLowerCase().includes(search) ||
        (vente.client?.nom ?? '').toLowerCase().includes(search)
    );
  }, [ventesPeriode, venteSearch]);

  const filteredProduits = useMemo(() => {
    const search = produitSearch.trim().toLowerCase();

    /*
     * Les données produits sont actuellement mockées.
     * Lorsque les lignes de vente seront disponibles dans l'API,
     * ce calcul sera remplacé par les statistiques fournies par Laravel.
     */
    let result = produitsPlusVendus;

    if (search) {
      result = result.filter((produit) =>
        produit.nom.toLowerCase().includes(search)
      );
    }

    return [...result].sort(
      (a, b) => b.quantite_vendue - a.quantite_vendue
    );
  }, [produitSearch]);

  const nombreVentes = ventesPeriode.length;

  const chiffreAffairesTotal = ventesPeriode.reduce(
    (total, vente) => total + Number(vente.montant_total),
    0
  );

  const venteColumns: Column<Vente>[] = [
    {
      key: 'id',
      label: '#',
    },
    {
      key: 'numero',
      label: 'N° Vente',
    },
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
      render: (row) => formatStatut(row.statut),
    },
  ];

  const produitColumns: Column<ProduitPlusVendu>[] = [
    {
      key: 'id',
      label: '#',
    },
    {
      key: 'nom',
      label: 'Produit',
    },
    {
      key: 'quantite_vendue',
      label: 'Qté vendue',
    },
    {
      key: 'chiffre_affaires',
      label: 'CA',
      render: (row) => formatCurrency(row.chiffre_affaires),
    },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="page-container">
      <PageHeader
        title="Statistiques"
        subtitle="Analyse des ventes et du chiffre d'affaires"
      />

      <PageToolbar
        actions={
          <button
            type="button"
            className="btn-primary"
            onClick={handlePrint}
          >
            <Printer size={15} />
            Imprimer
          </button>
        }
      />

      <PageTabs
        tabs={statistiquesTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Résumé des ventes */}
      {activeTab === 'resume' && (
        <SectionCard title="Résumé des ventes">
          <PeriodFilter
            dateDebut={dateDebut}
            dateFin={dateFin}
            onDateDebutChange={setDateDebut}
            onDateFinChange={setDateFin}
            onRefresh={handleRefresh}
          />

          <div className="stat-mini-group" style={{ marginTop: '24px' }}>
            <div className="stat-mini">
              <span className="stat-mini-label">
                Nombre de ventes
              </span>

              <span className="stat-mini-value">
                {nombreVentes}
              </span>
            </div>

            <div className="stat-mini">
              <span className="stat-mini-label">
                Chiffre d'affaires
              </span>

              <span className="stat-mini-value">
                {formatCurrency(chiffreAffairesTotal)}
              </span>
            </div>
          </div>
        </SectionCard>
      )}

      {/* Chiffre d'affaires */}
      {activeTab === 'ca' && (
        <SectionCard title="Chiffre d'affaires">
          <PeriodFilter
            dateDebut={dateDebut}
            dateFin={dateFin}
            onDateDebutChange={setDateDebut}
            onDateFinChange={setDateFin}
            onRefresh={handleRefresh}
          />

          <div className="stat-mini-group" style={{ marginTop: '24px' }}>
            <div className="stat-mini">
              <span className="stat-mini-label">
                Date de début
              </span>

              <span className="stat-mini-value">
                {formatDate(appliedDateDebut)}
              </span>
            </div>

            <div className="stat-mini">
              <span className="stat-mini-label">
                Date de fin
              </span>

              <span className="stat-mini-value">
                {formatDate(appliedDateFin)}
              </span>
            </div>

            <div className="stat-mini">
              <span className="stat-mini-label">
                Montant total
              </span>

              <span className="stat-mini-value stat-amount">
                {formatCurrency(chiffreAffairesTotal)}
              </span>
            </div>
          </div>
        </SectionCard>
      )}

      {/* Ventes */}
      {activeTab === 'ventes' && (
        <SectionCard
          title="Ventes"
          subtitle={`${filteredVentes.length} vente(s)`}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: '24px',
              marginBottom: '20px',
              flexWrap: 'nowrap',
            }}
          >
            <PeriodFilter
              dateDebut={dateDebut}
              dateFin={dateFin}
              onDateDebutChange={setDateDebut}
              onDateFinChange={setDateFin}
              onRefresh={handleRefresh}
            />

            <div className="form-field">
              <label htmlFor="search-vente">
                Recherche
              </label>

              <input
                id="search-vente"
                type="text"
                className="inline-input"
                placeholder="N° vente, client..."
                value={venteSearch}
                onChange={(e) => setVenteSearch(e.target.value)}
                style={{
                  width: '220px',
                  height: '38px',
                }}
              />
            </div>
          </div>

          <DataTable
            data={filteredVentes}
            columns={venteColumns}
            emptyMessage="Aucune donnée disponible pour cette période."
          />
        </SectionCard>
      )}

      {/* Produits les plus vendus */}
      {activeTab === 'produits' && (
        <SectionCard
          title="Produits les plus vendus"
          subtitle={`${filteredProduits.length} produit(s)`}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: '24px',
              marginBottom: '20px',
              flexWrap: 'nowrap',
            }}
          >
            <PeriodFilter
              dateDebut={dateDebut}
              dateFin={dateFin}
              onDateDebutChange={setDateDebut}
              onDateFinChange={setDateFin}
              onRefresh={handleRefresh}
            />

            <div className="form-field">
              <label htmlFor="search-produit">
                Recherche
              </label>

              <input
                id="search-produit"
                type="text"
                className="inline-input"
                placeholder="Rechercher un produit..."
                value={produitSearch}
                onChange={(e) => setProduitSearch(e.target.value)}
                style={{
                  width: '220px',
                  height: '38px',
                }}
              />
            </div>
          </div>

          <DataTable
            data={filteredProduits}
            columns={produitColumns}
            emptyMessage="Aucune donnée disponible pour cette période."
          />
        </SectionCard>
      )}
    </div>
  );
}