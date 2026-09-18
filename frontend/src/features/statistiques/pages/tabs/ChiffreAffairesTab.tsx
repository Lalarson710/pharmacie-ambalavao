import { SectionCard } from '@/components/SectionCard';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { PeriodFilter } from './PeriodFilter';

interface ChiffreAffairesTabProps {
  chiffreAffairesTotal: number;
  appliedDateDebut: string;
  appliedDateFin: string;
  dateDebut: string;
  dateFin: string;
  onDateDebutChange: (value: string) => void;
  onDateFinChange: (value: string) => void;
  onRefresh: () => void;
}

export function ChiffreAffairesTab({
  chiffreAffairesTotal,
  appliedDateDebut,
  appliedDateFin,
  dateDebut,
  dateFin,
  onDateDebutChange,
  onDateFinChange,
  onRefresh,
}: ChiffreAffairesTabProps) {
  return (
    <SectionCard title="Chiffre d'affaires">
      <PeriodFilter
        dateDebut={dateDebut}
        dateFin={dateFin}
        onDateDebutChange={onDateDebutChange}
        onDateFinChange={onDateFinChange}
        onRefresh={onRefresh}
      />

      <div className="stat-mini-group" style={{ marginTop: '24px' }}>
        <div className="stat-mini">
          <span className="stat-mini-label">Date de début</span>
          <span className="stat-mini-value">{formatDate(appliedDateDebut)}</span>
        </div>

        <div className="stat-mini">
          <span className="stat-mini-label">Date de fin</span>
          <span className="stat-mini-value">{formatDate(appliedDateFin)}</span>
        </div>

        <div className="stat-mini">
          <span className="stat-mini-label">Montant total</span>
          <span className="stat-mini-value stat-amount">
            {formatCurrency(chiffreAffairesTotal)}
          </span>
        </div>
      </div>
    </SectionCard>
  );
}
