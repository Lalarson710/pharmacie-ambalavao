import { useMemo, useState } from 'react';

export interface LinePoint {
  label: string;
  value: number;
}

interface LineAreaChartProps {
  data: LinePoint[];
  height?: number;
  color?: string;
  gradientId?: string;
  /** Format compact utilise sur l'axe vertical (ex: « 120k »). */
  formatValue?: (value: number) => string;
  /** Format complet utilise dans l'infobulle (ex: « 120 000 MGA »). */
  formatValueFull?: (value: number) => string;
  emptyMessage?: string;
}

const PADDING = { top: 16, right: 12, bottom: 26, left: 52 };

/**
 * Courbe d'evolution avec aire degradee, grille horizontale et infobulle
 * au survol. Rendu 100% SVG afin de ne dependre d'aucune librairie externe.
 */
export function LineAreaChart({
  data,
  height = 260,
  color = '#67af1a',
  gradientId = 'lineAreaGradient',
  formatValue = (v) => String(Math.round(v)),
  formatValueFull,
  emptyMessage = 'Aucune donnée sur la période.',
}: LineAreaChartProps) {
  const [hover, setHover] = useState<number | null>(null);

  const width = 720;

  const { path, areaPath, points, ticks } = useMemo(() => {
    const values = data.map((d) => d.value);
    const rawMax = values.length ? Math.max(...values) : 0;
    const rawMin = values.length ? Math.min(...values) : 0;
    const maxValue = rawMax <= 0 ? 100 : rawMax * 1.15;
    const minValue = rawMin < 0 ? rawMin * 1.15 : 0;

    const innerW = width - PADDING.left - PADDING.right;
    const innerH = height - PADDING.top - PADDING.bottom;

    const pts = data.map((d, i) => {
      const x =
        data.length <= 1
          ? PADDING.left + innerW / 2
          : PADDING.left + (i / (data.length - 1)) * innerW;
      const ratio = maxValue === minValue ? 0 : (d.value - minValue) / (maxValue - minValue);
      const y = PADDING.top + innerH - ratio * innerH;
      return { x, y, ...d };
    });

    const line = pts
      .map((p, i) => {
        if (i === 0) return `M ${p.x} ${p.y}`;
        const prev = pts[i - 1];
        const cx = (prev.x + p.x) / 2;
        return `C ${cx} ${prev.y}, ${cx} ${p.y}, ${p.x} ${p.y}`;
      })
      .join(' ');

    const baseY = PADDING.top + innerH;
    const area = pts.length
      ? `${line} L ${pts[pts.length - 1].x} ${baseY} L ${pts[0].x} ${baseY} Z`
      : '';

    const gridTicks = 4;
    const t = Array.from({ length: gridTicks + 1 }, (_, i) => {
      const value = minValue + ((maxValue - minValue) * i) / gridTicks;
      const ratio = maxValue === minValue ? 0 : (value - minValue) / (maxValue - minValue);
      const y = PADDING.top + innerH - ratio * innerH;
      return { value, y };
    });

    return { path: line, areaPath: area, points: pts, ticks: t };
  }, [data, height]);

  if (!data.length) {
    return <p className="chart-empty">{emptyMessage}</p>;
  }

  const active = hover !== null ? points[hover] : null;

  return (
    <div className="chart-wrapper">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="chart-svg"
        role="img"
        preserveAspectRatio="xMidYMid meet"
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.34" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {ticks.map((t, i) => (
          <g key={i}>
            <line
              x1={PADDING.left}
              x2={width - PADDING.right}
              y1={t.y}
              y2={t.y}
              stroke="#e7efe4"
              strokeWidth={1}
            />
            <text x={PADDING.left - 8} y={t.y + 4} className="chart-axis-label" textAnchor="end">
              {formatValue(t.value)}
            </text>
          </g>
        ))}

        <path d={areaPath} fill={`url(#${gradientId})`} />
        <path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {points.map((p, i) => {
          const showLabel = points.length <= 10 || i % Math.ceil(points.length / 8) === 0;
          // Au-dela de 60 points, la zone de survol est espacee pour eviter
          // de rendre un nombre excessif de rectangles.
          const zone = hoverZone(points.length);
          return (
            <g key={i}>
              {zone && (
                <rect
                  x={p.x - zone / 2}
                  y={0}
                  width={zone}
                  height={height}
                  fill="transparent"
                  onMouseEnter={() => setHover(i)}
                />
              )}
              {showLabel && (
                <text
                  x={p.x}
                  y={height - 8}
                  className="chart-axis-label"
                  textAnchor="middle"
                >
                  {p.label}
                </text>
              )}
              {hover === i && (
                <circle cx={p.x} cy={p.y} r={5} fill="#fff" stroke={color} strokeWidth={2.5} />
              )}
            </g>
          );
        })}
      </svg>

      {active && (
        <div
          className="chart-tooltip"
          style={{
            left: `${(active.x / width) * 100}%`,
            top: `${(active.y / height) * 100}%`,
          }}
        >
          <strong>{(formatValueFull ?? formatValue)(active.value)}</strong>
          <span>{active.label}</span>
        </div>
      )}
    </div>
  );
}

/** Largeur de la zone de survol, ou 0 si leserie est trop dense. */
function hoverZone(count: number): number {
  if (count > 60) return 0;
  return count > 0 ? 720 / count : 0;
}
