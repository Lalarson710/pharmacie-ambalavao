import { RefreshCw } from 'lucide-react';

interface PeriodFilterProps {
  dateDebut: string;
  dateFin: string;
  onDateDebutChange: (value: string) => void;
  onDateFinChange: (value: string) => void;
  onRefresh?: () => void;
}

export function PeriodFilter({
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
          onChange={(event) => onDateDebutChange(event.target.value)}
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
          onChange={(event) => onDateFinChange(event.target.value)}
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
