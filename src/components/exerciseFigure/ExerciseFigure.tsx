/**
 * Disegno puro della figura: dato un esercizio e un istante t ∈ [0,1) del ciclo
 * restituisce l'SVG. Non contiene stato né timer: l'animazione è guidata da
 * ExerciseIllustration, che fa avanzare t con requestAnimationFrame.
 */
import React from 'react';
import { Point } from './kinematics';
import { BODY, Skeleton, SolvedLimb, solvePose } from './skeleton';
import { COLORS, Caption, Floor } from './equipment';
import { BodyPart, getExerciseAnimation } from './animations';

interface Props {
  animationKey: string;
  t: number;
  className?: string;
}

const LIMB_WIDTH = {
  upperArm: 8,
  forearm: 7,
  thigh: 11,
  shin: 9,
  torso: 15
};

/**
 * Segmento del corpo con un sottile contorno del colore di sfondo,
 * così braccia e busto restano distinguibili anche quando hanno lo stesso colore.
 */
const Segment: React.FC<{ from: Point; to: Point; width: number; color: string }> = ({ from, to, width, color }) => (
  <g>
    <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} style={{ stroke: COLORS.outline }} strokeWidth={width + 3} strokeLinecap="round" />
    <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} style={{ stroke: color }} strokeWidth={width} strokeLinecap="round" />
  </g>
);

const Arm: React.FC<{ limb: SolvedLimb; color: string }> = ({ limb, color }) => (
  <g>
    <Segment from={limb.root} to={limb.joint} width={LIMB_WIDTH.upperArm} color={color} />
    <Segment from={limb.joint} to={limb.end} width={LIMB_WIDTH.forearm} color={color} />
  </g>
);

const Leg: React.FC<{ limb: SolvedLimb; toe: Point; color: string }> = ({ limb, toe, color }) => (
  <g>
    <Segment from={limb.root} to={limb.joint} width={LIMB_WIDTH.thigh} color={color} />
    <Segment from={limb.joint} to={limb.end} width={LIMB_WIDTH.shin} color={color} />
    <Segment from={limb.end} to={toe} width={6} color={color} />
  </g>
);

function colorFor(part: BodyPart, highlight: BodyPart[], far: boolean): string {
  if (highlight.includes(part)) return far ? COLORS.activeFar : COLORS.active;
  return far ? COLORS.bodyFar : COLORS.body;
}

const Figure: React.FC<{ skeleton: Skeleton; highlight: BodyPart[] }> = ({ skeleton: s, highlight }) => {
  // In vista frontale entrambi i lati sono "vicini": niente ombreggiatura del lato lontano.
  const farIsShaded = s.view === 'side';
  const nearShoulder = s.nearArm.root;
  const farShoulder = s.farArm.root;
  return (
    <g>
      <Arm limb={s.farArm} color={colorFor('arms', highlight, farIsShaded)} />
      <Leg limb={s.farLeg} toe={s.farToe} color={colorFor('legs', highlight, farIsShaded)} />
      <Segment from={s.hip} to={s.shoulder} width={LIMB_WIDTH.torso} color={colorFor('torso', highlight, false)} />
      {s.view === 'front' && (
        <>
          <Segment from={nearShoulder} to={farShoulder} width={9} color={colorFor('torso', highlight, false)} />
          <Segment from={s.nearLeg.root} to={s.farLeg.root} width={10} color={colorFor('torso', highlight, false)} />
        </>
      )}
      <circle cx={s.head.x} cy={s.head.y} r={BODY.headRadius} style={{ fill: COLORS.head }} />
      <Leg limb={s.nearLeg} toe={s.nearToe} color={colorFor('legs', highlight, false)} />
      <Arm limb={s.nearArm} color={colorFor('arms', highlight, false)} />
    </g>
  );
};

export const ExerciseFigure: React.FC<Props> = ({ animationKey, t, className }) => {
  const animation = getExerciseAnimation(animationKey);
  const skeleton = solvePose(animation.pose(t));
  return (
    <svg viewBox="0 0 260 200" className={className} role="img" aria-label="Animazione esercizio">
      <Floor />
      {animation.behind?.(skeleton, t)}
      <Figure skeleton={skeleton} highlight={animation.highlight} />
      {animation.inFront?.(skeleton, t)}
      {animation.caption && <Caption text={animation.caption} />}
    </svg>
  );
};
