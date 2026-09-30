import { SectionCard } from '@/components/SectionCard';
import type { ProduitPlusVendu, Vente } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { PeriodFilter } from './PeriodFilter';

interface ResumeTabProps {
  ventesPeriode: Vente[];
  chiffreAffairesTotal: number;
  produitsPlusVendus: ProduitPlusVendu[];
  loading?: boolean;
  dateDebut: string;
  dateFin: string;
  onDateDebutChange: (value: string) => void;
  onDateFinChange: (value: string) => void;
  onRefresh: () => void;
}

export function ResumeTab({
  ventesPeriode,
  chiffreAffairesTotal,
  produitsPlusVendus,
  loading = false,
  dateDebut,
  dateFin,
  onDateDebutChange,
  onDateFinChange,
  onRefresh,
}: ResumeTabProps) {
  const panierMoyen =
    ventesPeriode.length > 0 ? chiffreAffairesTotal / ventesPeriode.length : 0;
  const uniteeVendue = produitsPlusVendus.reduce(
    (total, row) => total + Number(row.quantite_vendue ?? 0),
    0,
  );

  return (
    <SectionCard
      title="Résumé des ventes"
      subtitle={loading ? 'Chargement...' : 'Indicateurs calculés sur la période'}
    >
      <PeriodFilter
        dateDebut={dateDebut}
        dateFin={dateFin}
        onDateDebutChange={onDateDebutChange}
        onDateFinChange={onDateFinChange}
        onRefresh={onRefresh}
      />

      <div className="stat-mini-group" style={{ marginTop: '24px' }}>
        <div className="stat-mini">
          <span className="stat-mini-label">Nombre de ventes</span>
          <span className="stat-mini-value">{ventesPeriode.length}</span>
        </div>

        <div className="stat-mini">
          <span className="stat-mini-label">Chiffre d'affaires</span>
          <span className="stat-mini-value stat-amount">
            {formatCurrency(chiffreAffairesTotal)}
          </span>
        </div>

        <div className="stat-mini">
          <span className="stat-mini-label">Panier moyen</span>
          <span className="stat-mini-value stat-amount">
            {formatCurrency(panierMoyen)}
          </span>
        </div>

        <div className="stat-mini">
          <span className="stat-mini-label">Unités vendues</span>
          <span className="stat-mini-value">{uniteeVendue}</span>
        </div>

        <div className="stat-mini">
          <span className="stat-mini-label">Produits distincts</span>
          <span className="stat-mini-value">{produitsPlusVendus.length}</span>
        </div>
      </div>
    </SectionCard>
  );
}
