import { useState } from 'react';

export interface BarDatum {
  label: string;
  value: number;
  meta?: string;
  /** Libelle complet affiche dans l'infobulle (ex: « Mercredi »). */
  fullLabel?: string;
}

interface BarChartProps {
  data: BarDatum[];
  height?: number;
  color?: string;
  formatValue?: (value: number) => string;
  emptyMessage?: string;
}

/**
 * Histogramme vertical simple, colore point par point via `colors`.
 */
export function BarChart({
  data,
  height = 240,
  color = '#67af1a',
  formatValue = (v) => String(Math.round(v)),
  emptyMessage = 'Aucune donnée sur la période.',
}: BarChartProps) {
  const [hover, setHover] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; label: string; value: number } | null>(
    null,
  );

  if (!data.length) {
    return <p className="chart-empty">{emptyMessage}</p>;
  }

  const width = 640;
  const padTop = 18;
  const padBottom = 42;
  const padX = 10;
  const innerH = height - padTop - padBottom;
  const max = Math.max(...data.map((d) => d.value), 1);
  const slot = (width - padX * 2) / data.length;
  const barW = Math.min(slot * 0.58, 46);

  return (
    <div className="chart-wrapper">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="chart-svg"
        role="img"
        preserveAspectRatio="xMidYMid meet"
      >
        {[0, 1, 2, 3, 4].map((i) => {
          const y = padTop + (innerH * i) / 4;
          const value = max * (1 - i / 4);
          return (
            <g key={i}>
              <line x1={padX} x2={width - padX} y1={y} y2={y} stroke="#e7efe4" strokeWidth={1} />
              <text x={padX} y={y - 5} className="chart-axis-label" textAnchor="start">
                {formatValue(value)}
              </text>
            </g>
          );
        })}

        {data.map((d, i) => {
          const h = Math.max((d.value / max) * innerH, d.value > 0 ? 3 : 0);
          const x = padX + slot * i + (slot - barW) / 2;
          const y = padTop + innerH - h;
          return (
            <g
              key={i}
              onMouseEnter={() => {
                setHover(i);
                setTooltip({
                  x: padX + slot * i + slot / 2,
                  y: padTop + innerH - Math.max((d.value / max) * innerH, d.value > 0 ? 3 : 0),
                  label: d.fullLabel ?? d.label,
                  value: d.value,
                });
              }}
              onMouseLeave={() => {
                setHover(null);
                setTooltip(null);
              }}
            >
              <rect
                x={padX + slot * i}
                y={padTop}
                width={slot}
                height={innerH}
                fill="transparent"
              />
              <rect
                x={x}
                y={y}
                width={barW}
                height={h}
                rx={6}
                fill={color}
                opacity={hover === null || hover === i ? 0.92 : 0.45}
              />
              {hover === i && (
                <text x={x + barW / 2} y={y - 8} className="chart-value-label" textAnchor="middle">
                  {formatValue(d.value)}
                </text>
              )}
              <text
                x={padX + slot * i + slot / 2}
                y={height - 22}
                className="chart-axis-label"
                textAnchor="middle"
              >
                {abbreviate(d.label)}
              </text>
              {d.meta && (
                <text
                  x={padX + slot * i + slot / 2}
                  y={height - 8}
                  className="chart-axis-sub"
                  textAnchor="middle"
                >
                  {d.meta}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {tooltip && (
        <div
          className="chart-tooltip"
          style={{
            left: `${(tooltip.x / width) * 100}%`,
            top: `${(tooltip.y / height) * 100}%`,
          }}
        >
          <strong>{formatValue(tooltip.value)}</strong>
          <span>{tooltip.label}</span>
        </div>
      )}
    </div>
  );
}

/**
 * Raccourcit les libelles trop longs pour l'axe : « Mercredi » devient
 * « Mer. ». Le libelle complet reste visible dans l'infobulle.
 */
function abbreviate(label: string): string {
  if (label.length <= 5) return label;
  if (label.length <= 9) return `${label.slice(0, 4)}.`;
  return `${label.slice(0, 3)}.`;
}
