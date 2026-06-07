import type { Dimension } from './questions';
import { dimensionLabels } from './questions';

interface RadarChartProps {
  scores: Record<Dimension, number>;
}

const dimensions: Dimension[] = [
  'lssMaturity',
  'resultsTrajectory',
  'contradictionExposure',
  'qualitySystemRisk',
  'changeReadiness',
  'innovationPipeline',
];

export default function RadarChart({ scores }: RadarChartProps) {
  const cx = 160;
  const cy = 160;
  const maxR = 100;
  const levels = [25, 50, 75, 100];
  const n = dimensions.length;
  const angleStep = (2 * Math.PI) / n;
  const startAngle = -Math.PI / 2; // top

  function polarToXY(angle: number, r: number) {
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  }

  // Grid polygons
  const gridPolygons = levels.map((level) => {
    const points = dimensions.map((_, i) => {
      const angle = startAngle + i * angleStep;
      const r = (level / 100) * maxR;
      const { x, y } = polarToXY(angle, r);
      return `${x},${y}`;
    });
    return points.join(' ');
  });

  // Data polygon
  const dataPoints = dimensions.map((dim, i) => {
    const angle = startAngle + i * angleStep;
    const r = (scores[dim] / 100) * maxR;
    return polarToXY(angle, r);
  });
  const dataPolygon = dataPoints.map((p) => `${p.x},${p.y}`).join(' ');

  // Axis lines and labels
  const axes = dimensions.map((dim, i) => {
    const angle = startAngle + i * angleStep;
    const end = polarToXY(angle, maxR);
    const labelPos = polarToXY(angle, maxR + 22);
    return { dim, end, labelPos, angle };
  });

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 320 320" className="w-full max-w-[300px]">
        {/* Grid */}
        {gridPolygons.map((points, i) => (
          <polygon
            key={i}
            points={points}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="0.5"
          />
        ))}

        {/* Axes */}
        {axes.map(({ dim, end }) => (
          <line
            key={dim}
            x1={cx}
            y1={cy}
            x2={end.x}
            y2={end.y}
            stroke="#e2e8f0"
            strokeWidth="0.5"
          />
        ))}

        {/* Data */}
        <polygon
          points={dataPolygon}
          fill="rgba(35, 136, 221, 0.15)"
          stroke="#2388DD"
          strokeWidth="2"
        />

        {/* Data points */}
        {dataPoints.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="3"
            fill="#2388DD"
          />
        ))}

        {/* Labels */}
        {axes.map(({ dim, labelPos, angle }) => {
          const shortLabels: Record<Dimension, string> = {
            lssMaturity: 'LSS Maturity',
            resultsTrajectory: 'Results',
            contradictionExposure: 'Contradictions',
            qualitySystemRisk: 'Quality Risk',
            changeReadiness: 'Change',
            innovationPipeline: 'Innovation',
          };
          const label = shortLabels[dim];
          // Determine text-anchor based on position
          let anchor = 'middle';
          if (Math.cos(angle) > 0.3) anchor = 'start';
          else if (Math.cos(angle) < -0.3) anchor = 'end';

          let dy = '0.35em';
          if (Math.sin(angle) < -0.5) dy = '0em';
          else if (Math.sin(angle) > 0.5) dy = '0.8em';

          return (
            <text
              key={dim}
              x={labelPos.x}
              y={labelPos.y}
              textAnchor={anchor}
              dy={dy}
              fontSize="8"
              fill="#4a4a5a"
              fontFamily="Poppins, sans-serif"
            >
              {label}
            </text>
          );
        })}
      </svg>

      {/* Score legend */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4 w-full">
        {dimensions.map((dim) => (
          <div key={dim} className="text-center">
            <p className="text-lg font-bold" style={{ color: '#2388DD' }}>
              {scores[dim]}
            </p>
            <p className="text-[0.65rem] text-[#4a4a5a]">{dimensionLabels[dim]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
