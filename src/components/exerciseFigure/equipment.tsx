/**
 * Attrezzi disegnati intorno alla figura (pesi, panche, macchine).
 * I colori sono variabili CSS definite in src/index.css (--fig-*),
 * così seguono il tema scelto dall'utente.
 */
import React from 'react';
import { Point } from './kinematics';
import { FLOOR_Y } from './skeleton';

export const COLORS = {
  body: 'var(--fig-body)',
  bodyFar: 'var(--fig-body-far)',
  active: 'var(--fig-active)',
  activeFar: 'var(--fig-active-far)',
  head: 'var(--fig-head)',
  equipment: 'var(--fig-equipment)',
  equipmentLight: 'var(--fig-equipment-light)',
  equipmentDark: 'var(--fig-equipment-dark)',
  weight: 'var(--fig-weight)',
  accent: 'var(--fig-accent)',
  floor: 'var(--fig-floor)',
  outline: 'var(--fig-outline)'
} as const;

export const Floor: React.FC = () => (
  <line x1="12" y1={FLOOR_Y} x2="248" y2={FLOOR_Y} style={{ stroke: COLORS.floor }} strokeWidth="2.5" strokeLinecap="round" />
);

/** Disco del bilanciere visto di lato. */
export const Plate: React.FC<{ at: Point; radius?: number }> = ({ at, radius = 14 }) => (
  <g>
    <circle cx={at.x} cy={at.y} r={radius} style={{ fill: COLORS.weight, stroke: COLORS.body }} strokeWidth="2" />
    <circle cx={at.x} cy={at.y} r={radius * 0.35} style={{ fill: COLORS.equipmentDark }} />
  </g>
);

/** Manubrio visto di lato (piccolo disco con impugnatura). */
export const Dumbbell: React.FC<{ at: Point; scale?: number }> = ({ at, scale = 1 }) => (
  <rect
    x={at.x - 6 * scale}
    y={at.y - 5 * scale}
    width={12 * scale}
    height={10 * scale}
    rx={3 * scale}
    style={{ fill: COLORS.weight, stroke: COLORS.body }}
    strokeWidth="1.5"
  />
);

export const Kettlebell: React.FC<{ at: Point }> = ({ at }) => (
  <g>
    <path
      d={`M ${at.x - 5} ${at.y + 2} Q ${at.x} ${at.y - 7} ${at.x + 5} ${at.y + 2}`}
      fill="none"
      style={{ stroke: COLORS.equipmentLight }}
      strokeWidth="2.5"
    />
    <circle cx={at.x} cy={at.y + 10} r="9" style={{ fill: COLORS.weight, stroke: COLORS.body }} strokeWidth="1.5" />
  </g>
);

/** Panca orizzontale con due gambe. */
export const Bench: React.FC<{ x1: number; x2: number; top: number }> = ({ x1, x2, top }) => (
  <g>
    <rect x={x1} y={top} width={x2 - x1} height="8" rx="3" style={{ fill: COLORS.equipment }} />
    <line x1={x1 + 10} y1={top + 8} x2={x1 + 10} y2={FLOOR_Y} style={{ stroke: COLORS.equipmentDark }} strokeWidth="5" />
    <line x1={x2 - 10} y1={top + 8} x2={x2 - 10} y2={FLOOR_Y} style={{ stroke: COLORS.equipmentDark }} strokeWidth="5" />
  </g>
);

/** Cavo teso fra due punti (lat machine, pushdown). */
export const Cable: React.FC<{ from: Point; to: Point }> = ({ from, to }) => (
  <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} style={{ stroke: COLORS.equipmentLight }} strokeWidth="1.5" />
);

/** Etichetta tecnica in alto a destra dell'illustrazione. */
export const Caption: React.FC<{ text: string }> = ({ text }) => (
  <text x="250" y="52" textAnchor="end" fontSize="10" fontWeight="bold" style={{ fill: COLORS.active }}>
    {text}
  </text>
);
