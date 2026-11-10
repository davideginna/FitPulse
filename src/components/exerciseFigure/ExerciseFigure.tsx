/**
 * Disegno puro della figura: dato un esercizio e un istante t ∈ [0,1) del ciclo
 * restituisce l'SVG. Non contiene stato né timer: l'animazione è guidata da
 * ExerciseIllustration, che fa avanzare t con requestAnimationFrame.
 *
 * Il corpo è disegnato con segmenti affusolati ("capsule" con raggio diverso
 * alle due estremità) sopra lo scheletro risolto da skeleton.ts. I colori dei
 * muscoli derivano da primaryMuscles / secondaryMuscles dell'esercizio, gli stessi
 * dati usati dalla mappa dei muscoli.
 */
import React, { useMemo } from 'react';
import { MuscleRegion } from '../../types';
import { Point, distance, polar } from './kinematics';
import { BODY, Skeleton, solvePose } from './skeleton';
import { COLORS, Caption, Floor } from './equipment';
import { ExerciseAnimation, getExerciseAnimation } from './animations';

interface Props {
  animationKey: string;
  t: number;
  primaryMuscles?: MuscleRegion[];
  secondaryMuscles?: MuscleRegion[];
  className?: string;
}

// ---------------------------------------------------------------------------
// Colori per parte del corpo
// ---------------------------------------------------------------------------

type BodyPart = 'thigh' | 'shin' | 'upperArm' | 'forearm' | 'torso' | 'glute' | 'deltoid';
type Intensity = 'primary' | 'secondary' | 'none';

/** Parte della figura su cui si vede ciascuna zona muscolare. */
const REGION_TO_PART: Record<MuscleRegion, BodyPart> = {
  quadricipiti: 'thigh',
  femorali: 'thigh',
  adduttori: 'thigh',
  abduttori: 'glute',
  glutei: 'glute',
  polpacci: 'shin',
  bicipiti: 'upperArm',
  tricipiti: 'upperArm',
  avambracci: 'forearm',
  deltoidi: 'deltoid',
  pettorali: 'torso',
  dorsali: 'torso',
  trapezio: 'torso',
  addominali: 'torso',
  obliqui: 'torso',
  lombari: 'torso',
  flessori_anca: 'torso'
};

function intensityByPart(primary: MuscleRegion[], secondary: MuscleRegion[]): Record<BodyPart, Intensity> {
  const result: Record<BodyPart, Intensity> = {
    thigh: 'none', shin: 'none', upperArm: 'none', forearm: 'none', torso: 'none', glute: 'none', deltoid: 'none'
  };
  secondary.forEach((r) => (result[REGION_TO_PART[r]] = 'secondary'));
  primary.forEach((r) => (result[REGION_TO_PART[r]] = 'primary'));
  return result;
}

function partColor(intensity: Intensity, far: boolean): string {
  const base = far ? COLORS.bodyFar : COLORS.body;
  if (intensity === 'primary') return far ? COLORS.activeFar : COLORS.active;
  if (intensity === 'secondary') {
    // Muscolo secondario: tinta a metà strada fra il colore attivo e quello del corpo.
    return `color-mix(in oklab, ${far ? COLORS.activeFar : COLORS.active} 45%, ${base})`;
  }
  return base;
}

// ---------------------------------------------------------------------------
// Forme
// ---------------------------------------------------------------------------

/** Segmento affusolato da `a` (raggio ra) a `b` (raggio rb), estremità arrotondate. */
function capsulePath(a: Point, b: Point, ra: number, rb: number): string {
  const len = distance(a, b) || 0.001;
  const nx = -(b.y - a.y) / len;
  const ny = (b.x - a.x) / len;
  const a1 = { x: a.x + nx * ra, y: a.y + ny * ra };
  const a2 = { x: a.x - nx * ra, y: a.y - ny * ra };
  const b1 = { x: b.x + nx * rb, y: b.y + ny * rb };
  const b2 = { x: b.x - nx * rb, y: b.y - ny * rb };
  return `M ${a1.x} ${a1.y} L ${b1.x} ${b1.y} A ${rb} ${rb} 0 0 0 ${b2.x} ${b2.y} L ${a2.x} ${a2.y} A ${ra} ${ra} 0 0 0 ${a1.x} ${a1.y} Z`;
}

const Capsule: React.FC<{ a: Point; b: Point; ra: number; rb: number; color: string }> = ({ a, b, ra, rb, color }) => (
  <path d={capsulePath(a, b, ra, rb)} style={{ fill: color, stroke: COLORS.outline }} strokeWidth="1.5" strokeLinejoin="round" />
);

/** Raggi (metà spessore) dei segmenti, alle due estremità. */
const RADIUS = {
  thigh: [6.5, 4.6],
  shin: [4.6, 3.1],
  upperArm: [4.2, 3.2],
  forearm: [3.2, 2.5],
  foot: [3, 2.2]
} as const;

/**
 * Busto sagomato lungo l'asse anca→spalla: bacino, vita più stretta, petto più largo.
 * In vista frontale è più largo (spalle e fianchi).
 */
function torsoPath(s: Skeleton): string {
  const front = s.view === 'front';
  // [posizione lungo il busto 0..1, mezza larghezza]
  const profile: [number, number][] = front
    ? [[0, 9.5], [0.4, 8], [0.78, 12], [1, 11]]
    : [[0, 7.5], [0.4, 6.2], [0.75, 8.2], [1, 6.5]];
  const len = distance(s.hip, s.shoulder) || 0.001;
  const ux = (s.shoulder.x - s.hip.x) / len;
  const uy = (s.shoulder.y - s.hip.y) / len;
  const at = (k: number, w: number, side: 1 | -1) => ({
    x: s.hip.x + ux * len * k - uy * w * side,
    y: s.hip.y + uy * len * k + ux * w * side
  });
  const left = profile.map(([k, w]) => at(k, w, 1));
  const right = profile.map(([k, w]) => at(k, w, -1)).reverse();
  const points = [...left, ...right];
  return `M ${points.map((p) => `${p.x} ${p.y}`).join(' L ')} Z`;
}

const Head: React.FC<{ s: Skeleton; faceAngle: number }> = ({ s, faceAngle }) => {
  const eyes =
    s.view === 'front'
      ? [polar(s.head, 4, -150), polar(s.head, 4, -30)]
      : [polar(s.head, 5.5, faceAngle - 20)];
  return (
    <g>
      <circle cx={s.head.x} cy={s.head.y} r={BODY.headRadius} style={{ fill: COLORS.head, stroke: COLORS.outline }} strokeWidth="1.5" />
      {eyes.map((eye, i) => (
        <circle key={i} cx={eye.x} cy={eye.y} r="1.6" style={{ fill: COLORS.outline }} />
      ))}
    </g>
  );
};

// ---------------------------------------------------------------------------
// Figura completa
// ---------------------------------------------------------------------------

const Figure: React.FC<{ s: Skeleton; parts: Record<BodyPart, Intensity> }> = ({ s, parts }) => {
  // Di lato il lato lontano è più scuro; di fronte entrambi i lati sono "vicini".
  const farShaded = s.view === 'side';
  const torsoAngle = (Math.atan2(s.shoulder.y - s.hip.y, s.shoulder.x - s.hip.x) * 180) / Math.PI;
  // Direzione in cui guarda la figura (davanti al petto).
  const faceAngle = torsoAngle + 90;

  const leg = (limb: Skeleton['nearLeg'], toe: Point, far: boolean) => (
    <g>
      <Capsule a={limb.root} b={limb.joint} ra={RADIUS.thigh[0]} rb={RADIUS.thigh[1]} color={partColor(parts.thigh, far)} />
      <Capsule a={limb.joint} b={limb.end} ra={RADIUS.shin[0]} rb={RADIUS.shin[1]} color={partColor(parts.shin, far)} />
      <Capsule a={limb.end} b={toe} ra={RADIUS.foot[0]} rb={RADIUS.foot[1]} color={far ? COLORS.bodyFar : COLORS.body} />
    </g>
  );
  const arm = (limb: Skeleton['nearArm'], far: boolean) => (
    <g>
      <Capsule a={limb.root} b={limb.joint} ra={RADIUS.upperArm[0]} rb={RADIUS.upperArm[1]} color={partColor(parts.upperArm, far)} />
      <Capsule a={limb.joint} b={limb.end} ra={RADIUS.forearm[0]} rb={RADIUS.forearm[1]} color={partColor(parts.forearm, far)} />
      <circle cx={limb.end.x} cy={limb.end.y} r="3" style={{ fill: far ? COLORS.bodyFar : COLORS.body, stroke: COLORS.outline }} strokeWidth="1.2" />
    </g>
  );
  const deltoid = (at: Point, far: boolean) => (
    <circle cx={at.x} cy={at.y} r="5" style={{ fill: partColor(parts.deltoid, far), stroke: COLORS.outline }} strokeWidth="1.2" />
  );

  // Gluteo: di lato sporge dietro il bacino; di fronte non si vede (resta il colore del bacino).
  const glute = s.view === 'side' ? polar(s.hip, 3.5, torsoAngle - 90 - 20) : null;

  return (
    <g>
      {arm(s.farArm, farShaded)}
      {leg(s.farLeg, s.farToe, farShaded)}
      {glute && (
        <circle cx={glute.x} cy={glute.y} r="7.5" style={{ fill: partColor(parts.glute, false), stroke: COLORS.outline }} strokeWidth="1.5" />
      )}
      <path d={torsoPath(s)} style={{ fill: partColor(parts.torso, false), stroke: COLORS.outline }} strokeWidth="1.5" strokeLinejoin="round" />
      {s.view === 'front' && (
        // Di fronte: bacino colorato come i glutei/abduttori se coinvolti.
        <circle cx={s.hip.x} cy={s.hip.y} r="7" style={{ fill: partColor(parts.glute, false) }} />
      )}
      {/* Collo: unisce la testa al busto anche quando la testa è inclinata. */}
      <Capsule a={s.shoulder} b={s.head} ra={3.6} rb={3.6} color={COLORS.body} />
      <Head s={s} faceAngle={faceAngle} />
      {leg(s.nearLeg, s.nearToe, false)}
      {s.view === 'front' && deltoid(s.farArm.root, false)}
      {deltoid(s.nearArm.root, false)}
      {arm(s.nearArm, false)}
    </g>
  );
};

// ---------------------------------------------------------------------------
// Traccia del movimento
// ---------------------------------------------------------------------------

const TRACE_SAMPLES = 36;
/** Sotto questa lunghezza (es. plank, tenute isometriche) la traccia non aiuta e non si disegna. */
const MIN_TRACE_LENGTH = 20;

/**
 * Percorso della mano o del piede che si muove di più durante il ciclo:
 * mostra "dove va" l'attrezzo o l'arto (es. traiettoria del bilanciere, cerchio del pedale).
 */
function computeTrace(animation: ExerciseAnimation): Point[] | null {
  const samples = Array.from({ length: TRACE_SAMPLES + 1 }, (_, i) => solvePose(animation.pose(i / TRACE_SAMPLES)));
  const candidates: ((s: Skeleton) => Point)[] = [(s) => s.nearArm.end, (s) => s.nearLeg.end];
  let best: Point[] | null = null;
  let bestLength = 0;
  for (const pick of candidates) {
    const path = samples.map(pick);
    const length = path.reduce((sum, p, i) => (i === 0 ? 0 : sum + distance(path[i - 1], p)), 0);
    if (length > bestLength) {
      bestLength = length;
      best = path;
    }
  }
  return bestLength >= MIN_TRACE_LENGTH ? best : null;
}

// ---------------------------------------------------------------------------

export const ExerciseFigure: React.FC<Props> = ({ animationKey, t, primaryMuscles = [], secondaryMuscles = [], className }) => {
  const animation = getExerciseAnimation(animationKey);
  const trace = useMemo(() => computeTrace(animation), [animation]);
  const parts = useMemo(() => intensityByPart(primaryMuscles, secondaryMuscles), [primaryMuscles, secondaryMuscles]);
  const skeleton = solvePose(animation.pose(t));
  const shadowX = (skeleton.hip.x + skeleton.nearLeg.end.x + skeleton.farLeg.end.x) / 3;

  return (
    <svg viewBox="0 0 260 200" className={className} role="img" aria-label="Animazione esercizio">
      <Floor />
      <ellipse cx={shadowX} cy="176" rx="46" ry="3.5" style={{ fill: COLORS.outline }} opacity="0.45" />
      {animation.behind?.(skeleton, t)}
      {trace && (
        <polyline
          points={trace.map((p) => `${p.x},${p.y}`).join(' ')}
          fill="none"
          style={{ stroke: COLORS.accent }}
          strokeWidth="1.5"
          strokeDasharray="3 4"
          strokeLinecap="round"
          opacity="0.55"
        />
      )}
      <Figure s={skeleton} parts={parts} />
      {animation.inFront?.(skeleton, t)}
      {animation.caption && <Caption text={animation.caption} />}
    </svg>
  );
};
