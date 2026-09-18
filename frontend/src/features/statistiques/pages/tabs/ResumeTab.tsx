import { SectionCard } from '@/components/SectionCard';
import type { Vente } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { PeriodFilter } from './PeriodFilter';

interface ResumeTabProps {
  ventesPeriode: Vente[];
  chiffreAffairesTotal: number;
  dateDebut: string;
  dateFin: string;
  onDateDebutChange: (value: string) => void;
  onDateFinChange: (value: string) => void;
  onRefresh: () => void;
}

export function ResumeTab({
  ventesPeriode,
  chiffreAffairesTotal,
  dateDebut,
  dateFin,
  onDateDebutChange,
  onDateFinChange,
  onRefresh,
}: ResumeTabProps) {
  return (
    <SectionCard title="Résumé des ventes">
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
          <span className="stat-mini-value">
            {formatCurrency(chiffreAffairesTotal)}
          </span>
        </div>
      </div>
    </SectionCard>
  );
}
