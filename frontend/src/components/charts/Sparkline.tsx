interface SparklineProps {
  values: number[];
  color?: string;
  width?: number;
  height?: number;
}

/**
 * Micro-courbe de tendance, ideale dans les cartes KPI.
 */
export function Sparkline({
  values,
  color = '#67af1a',
  width = 96,
  height = 34,
}: SparklineProps) {
  if (values.length < 2) {
    return null;
  }

  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  return (
    <svg width={width} height={height} className="sparkline" aria-hidden="true">
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
