/**
 * Modello della figura umana: proporzioni, descrizione di una posa e
 * risoluzione della posa in coordinate delle articolazioni.
 *
 * Una posa (PoseSpec) dice DOVE devono stare anca, busto, mani e piedi;
 * `solvePose` calcola gomiti e ginocchia con la cinematica inversa, così
 * chi descrive un esercizio pensa solo a "mani sul bilanciere, piedi a terra".
 */
import { BendDirection, Point, lerp, lerpPoint, polar, solveTwoBone } from './kinematics';

/** Lunghezze dei segmenti in unità del viewBox (260x200, pavimento a y=175). */
export const BODY = {
  torso: 44, // anca → spalla
  neck: 7,
  headRadius: 10,
  upperArm: 25,
  forearm: 23,
  thigh: 34,
  shin: 33,
  foot: 10,
  /** Metà larghezza spalle / anche nella vista frontale. */
  frontShoulderHalfWidth: 13,
  frontHipHalfWidth: 7
} as const;

export const FLOOR_Y = 175;
/** Quota della caviglia quando il piede è appoggiato a terra. */
export const ANKLE_Y = FLOOR_Y - 4;

export interface LimbGoal {
  target: Point; // posizione desiderata di mano o caviglia
  bend: BendDirection; // vedi kinematics.ts
}

/**
 * Vista laterale: la figura guarda verso destra; "near" = lato vicino a chi guarda
 * (disegnato sopra e con colori pieni), "far" = lato lontano (più scuro, dietro).
 * Vista frontale: "near" = lato sinistro dello schermo, "far" = lato destro.
 */
export interface PoseSpec {
  view?: 'side' | 'front';
  hip: Point;
  /** Direzione anca→spalla in gradi (0 = destra, -90 = verticale verso l'alto). */
  torsoAngle: number;
  /** Rotazione della testa rispetto al prolungamento del busto (gradi). */
  neckOffset?: number;
  nearArm: LimbGoal;
  farArm: LimbGoal;
  nearLeg: LimbGoal;
  farLeg: LimbGoal;
  /** Direzione del piede (gradi). Default 0 = piede piatto rivolto a destra. */
  nearFootAngle?: number;
  farFootAngle?: number;
}

export interface SolvedLimb {
  root: Point;
  joint: Point;
  end: Point;
}

export interface Skeleton {
  view: 'side' | 'front';
  hip: Point;
  shoulder: Point;
  head: Point;
  nearArm: SolvedLimb;
  farArm: SolvedLimb;
  nearLeg: SolvedLimb;
  farLeg: SolvedLimb;
  nearToe: Point;
  farToe: Point;
}

export const shoulderOf = (hip: Point, torsoAngle: number): Point => polar(hip, BODY.torso, torsoAngle);

function solveLimb(root: Point, goal: LimbGoal, upper: number, lower: number): SolvedLimb {
  const { joint, end } = solveTwoBone(root, goal.target, upper, lower, goal.bend);
  return { root, joint, end };
}

export function solvePose(pose: PoseSpec): Skeleton {
  const view = pose.view ?? 'side';
  const shoulder = shoulderOf(pose.hip, pose.torsoAngle);
  const head = polar(shoulder, BODY.neck + BODY.headRadius, pose.torsoAngle + (pose.neckOffset ?? 0));

  // Nella vista frontale spalle e anche hanno una larghezza; di lato coincidono.
  const sideOffset = (half: number, sign: number): Point =>
    view === 'front' ? { x: sign * half, y: 0 } : { x: 0, y: 0 };
  const shift = (p: Point, o: Point): Point => ({ x: p.x + o.x, y: p.y + o.y });

  const nearShoulder = shift(shoulder, sideOffset(BODY.frontShoulderHalfWidth, -1));
  const farShoulder = shift(shoulder, sideOffset(BODY.frontShoulderHalfWidth, 1));
  const nearHip = shift(pose.hip, sideOffset(BODY.frontHipHalfWidth, -1));
  const farHip = shift(pose.hip, sideOffset(BODY.frontHipHalfWidth, 1));

  const nearLeg = solveLimb(nearHip, pose.nearLeg, BODY.thigh, BODY.shin);
  const farLeg = solveLimb(farHip, pose.farLeg, BODY.thigh, BODY.shin);

  // In vista frontale i piedi puntano verso l'esterno.
  const defaultNearFoot = view === 'front' ? 180 : 0;
  return {
    view,
    hip: pose.hip,
    shoulder,
    head,
    nearArm: solveLimb(nearShoulder, pose.nearArm, BODY.upperArm, BODY.forearm),
    farArm: solveLimb(farShoulder, pose.farArm, BODY.upperArm, BODY.forearm),
    nearLeg,
    farLeg,
    nearToe: polar(nearLeg.end, view === 'front' ? 5 : BODY.foot, pose.nearFootAngle ?? defaultNearFoot),
    farToe: polar(farLeg.end, view === 'front' ? 5 : BODY.foot, pose.farFootAngle ?? 0)
  };
}

const mixGoal = (a: LimbGoal, b: LimbGoal, p: number): LimbGoal => ({
  target: lerpPoint(a.target, b.target, p),
  bend: p < 0.5 ? a.bend : b.bend
});

/** Interpolazione lineare fra due pose (p=0 → a, p=1 → b). */
export function mixPose(a: PoseSpec, b: PoseSpec, p: number): PoseSpec {
  return {
    view: a.view,
    hip: lerpPoint(a.hip, b.hip, p),
    torsoAngle: lerp(a.torsoAngle, b.torsoAngle, p),
    neckOffset: lerp(a.neckOffset ?? 0, b.neckOffset ?? 0, p),
    nearArm: mixGoal(a.nearArm, b.nearArm, p),
    farArm: mixGoal(a.farArm, b.farArm, p),
    nearLeg: mixGoal(a.nearLeg, b.nearLeg, p),
    farLeg: mixGoal(a.farLeg, b.farLeg, p),
    nearFootAngle: mixOptional(a.nearFootAngle, b.nearFootAngle, p),
    farFootAngle: mixOptional(a.farFootAngle, b.farFootAngle, p)
  };
}

/** Mantiene `undefined` (= valore di default) se nessuna delle due pose lo specifica. */
function mixOptional(a: number | undefined, b: number | undefined, p: number): number | undefined {
  if (a === undefined && b === undefined) return undefined;
  return lerp(a ?? 0, b ?? 0, p);
}

/**
 * Sequenza ciclica di pose a intervalli uguali (es. burpees).
 * Fra una posa e la successiva il passaggio è ammorbidito (smoothstep).
 */
export function keyframePose(t: number, frames: PoseSpec[]): PoseSpec {
  const scaled = (((t % 1) + 1) % 1) * frames.length;
  const index = Math.floor(scaled);
  const local = scaled - index;
  const eased = local * local * (3 - 2 * local);
  return mixPose(frames[index], frames[(index + 1) % frames.length], eased);
}
