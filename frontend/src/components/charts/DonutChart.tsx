import { useState } from 'react';

export interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DonutSlice[];
  size?: number;
  thickness?: number;
  formatValue?: (value: number) => string;
  centerLabel?: string;
  centerValue?: string;
  emptyMessage?: string;
}

/**
 * Anneau (donut) avec legende interactive : la part survolee est mise en
 * evidence et affichee au centre du graphique.
 */
export function DonutChart({
  data,
  size = 200,
  thickness = 26,
  formatValue = (v) => String(Math.round(v)),
  centerLabel = 'Total',
  centerValue,
  emptyMessage = 'Aucune donnée sur la période.',
}: DonutChartProps) {
  const [hover, setHover] = useState<number | null>(null);

  const total = data.reduce((sum, d) => sum + d.value, 0);

  if (!data.length || total <= 0) {
    return <p className="chart-empty">{emptyMessage}</p>;
  }

  const radius = (size - thickness) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;
  const arcs = data.map((d, i) => {
    const fraction = d.value / total;
    const arc = {
      ...d,
      fraction,
      dash: fraction * circumference,
      offset,
      index: i,
    };
    offset += fraction * circumference;
    return arc;
  });

  const active = hover !== null ? arcs[hover] : null;

  return (
    <div className="donut-layout">
      <div className="donut-figure">
        <svg width={size} height={size} role="img" className="donut-svg">
          <g transform={`rotate(-90 ${center} ${center})`}>
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="#eef3ea"
              strokeWidth={thickness}
            />
            {arcs.map((a) => (
              <circle
                key={a.label}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={a.color}
                strokeWidth={hover === a.index ? thickness + 6 : thickness}
                strokeDasharray={`${a.dash} ${circumference - a.dash}`}
                strokeDashoffset={-a.offset}
                opacity={hover === null || hover === a.index ? 1 : 0.35}
                style={{ transition: 'opacity .2s, stroke-width .2s', cursor: 'pointer' }}
                onMouseEnter={() => setHover(a.index)}
                onMouseLeave={() => setHover(null)}
              />
            ))}
          </g>
        </svg>
        <div className="donut-center">
          <span className="donut-center-value">
            {active ? formatValue(active.value) : (centerValue ?? formatValue(total))}
          </span>
          <span className="donut-center-label">{active ? active.label : centerLabel}</span>
        </div>
      </div>

      <ul className="donut-legend">
        {arcs.map((a) => (
          <li
            key={a.label}
            className={hover === a.index ? 'active' : ''}
            onMouseEnter={() => setHover(a.index)}
            onMouseLeave={() => setHover(null)}
          >
            <span className="donut-dot" style={{ background: a.color }} />
            <span className="donut-legend-label">{a.label}</span>
            <span className="donut-legend-value">{Math.round(a.fraction * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
