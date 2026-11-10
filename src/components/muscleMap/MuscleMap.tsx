import React from 'react';
import { MuscleRegion } from '../../types';
import { BODY_OUTLINE_LEFT, HEAD, MUSCLE_SHAPES, Polygon } from './muscleShapes';

interface Props {
  primary: MuscleRegion[];
  secondary: MuscleRegion[];
  className?: string;
}

const VIEW_WIDTH = 100;
const toPoints = (polygon: Polygon): string => polygon.map(([x, y]) => `${x},${y}`).join(' ');

/** Sagoma completa: metà sinistra + la stessa specchiata, percorsa al contrario. */
const BODY_OUTLINE = toPoints([
  ...BODY_OUTLINE_LEFT,
  ...[...BODY_OUTLINE_LEFT].reverse().map(([x, y]): [number, number] => [VIEW_WIDTH - x, y])
]);

/** I colori seguono il tema (variabili definite in src/index.css). */
const FILL = {
  silhouette: 'var(--color-slate-800)',
  idle: 'var(--color-slate-700)',
  primary: 'var(--fig-active)',
  secondary: 'var(--fig-active-far)',
  edge: 'var(--color-slate-900)'
};

const BodyView: React.FC<{ side: 'front' | 'back'; offsetX: number; fillFor: (r: MuscleRegion) => string; label: string }> = ({
  side,
  offsetX,
  fillFor,
  label
}) => (
  <g transform={`translate(${offsetX} 0)`}>
    <circle cx={HEAD.cx} cy={HEAD.cy} r={HEAD.r} style={{ fill: FILL.silhouette }} />
    <polygon points={BODY_OUTLINE} style={{ fill: FILL.silhouette }} />
    {(Object.keys(MUSCLE_SHAPES) as MuscleRegion[]).map((region) =>
      (MUSCLE_SHAPES[region][side] ?? []).map((polygon, i) => {
        const style = { fill: fillFor(region), stroke: FILL.edge };
        return (
          <g key={`${region}-${i}`}>
            <polygon points={toPoints(polygon)} style={style} strokeWidth="0.8" strokeLinejoin="round" />
            {/* Lato destro: stessa forma specchiata attorno all'asse centrale. */}
            <polygon
              points={toPoints(polygon)}
              transform={`translate(${VIEW_WIDTH} 0) scale(-1 1)`}
              style={style}
              strokeWidth="0.8"
              strokeLinejoin="round"
            />
          </g>
        );
      })
    )}
    <text x={VIEW_WIDTH / 2} y="199" textAnchor="middle" fontSize="8" fontWeight="bold" style={{ fill: 'var(--color-slate-400)' }}>
      {label}
    </text>
  </g>
);

const LegendRow: React.FC<{ title: string; regions: MuscleRegion[]; dotColor: string }> = ({ title, regions, dotColor }) =>
  regions.length === 0 ? null : (
    <div className="flex items-start gap-2">
      <span className="w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: dotColor }} />
      <p className="text-xs text-slate-300 leading-relaxed">
        <span className="font-bold text-white">{title}: </span>
        {regions.map((r) => MUSCLE_SHAPES[r].label).join(', ')}
      </p>
    </div>
  );

/**
 * Mappa dei muscoli fronte/retro: a colore pieno le zone principali,
 * a colore attenuato quelle secondarie. La legenda testuale rende
 * l'informazione leggibile anche senza distinguere i colori.
 */
export const MuscleMap: React.FC<Props> = ({ primary, secondary, className = '' }) => {
  const fillFor = (region: MuscleRegion): string => {
    if (primary.includes(region)) return FILL.primary;
    if (secondary.includes(region)) return FILL.secondary;
    return FILL.idle;
  };

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <svg viewBox="0 0 210 202" className="w-40 flex-shrink-0" role="img" aria-label="Mappa dei muscoli coinvolti">
        <BodyView side="front" offsetX={0} fillFor={fillFor} label="Fronte" />
        <BodyView side="back" offsetX={110} fillFor={fillFor} label="Retro" />
      </svg>
      <div className="space-y-2">
        <LegendRow title="Principali" regions={primary} dotColor={FILL.primary} />
        <LegendRow title="Secondari" regions={secondary} dotColor={FILL.secondary} />
      </div>
    </div>
  );
};
