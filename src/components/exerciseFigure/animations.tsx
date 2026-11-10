/**
 * Catalogo delle animazioni: una voce per ogni `svgType` di src/types/index.ts.
 *
 * Ogni voce descrive la posa come funzione di t ∈ [0,1) (un ciclo completo):
 *  - esercizi di forza: t=0 posizione di partenza, t=0.5 picco della contrazione
 *    (si usa `repCurve(t)` che va 0 → 1 → 0);
 *  - cardio: ciclo continuo (pedalata, passo, gradino).
 * Si indicano solo anca, inclinazione del busto e bersagli di mani/piedi:
 * gomiti e ginocchia sono calcolati da skeleton.ts.
 *
 * Coordinate: viewBox 260x200, pavimento a y=175, la figura guarda a destra.
 *
 * Per aggiungere un esercizio: aggiungere il valore a `svgType` in src/types,
 * poi una voce in ANIMATIONS qui sotto; `npm run check:figures` verifica che
 * mani e piedi raggiungano i bersagli dichiarati.
 */
import React from 'react';
import { BendDirection, Point, distance, lerp, lerpPoint, polar, pt, repCurve } from './kinematics';
import { ANKLE_Y, BODY, LimbGoal, PoseSpec, Skeleton, keyframePose, shoulderOf } from './skeleton';
import { Bench, COLORS, Cable, Dumbbell, Kettlebell, Plate } from './equipment';

export type BodyPart = 'arms' | 'legs' | 'torso';

export interface ExerciseAnimation {
  /** Durata di un ciclo a velocità normale. */
  durationSeconds: number;
  /** Parti del corpo evidenziate col colore dei muscoli attivi. */
  highlight: BodyPart[];
  caption?: string;
  pose: (t: number) => PoseSpec;
  /** Attrezzi dietro la figura (macchine, panche). */
  behind?: (s: Skeleton, t: number) => React.ReactNode;
  /** Attrezzi davanti alla figura (pesi impugnati, pedali lato vicino). */
  inFront?: (s: Skeleton, t: number) => React.ReactNode;
}

// ---------------------------------------------------------------------------
// Piccoli aiuti per scrivere le pose
// ---------------------------------------------------------------------------

const goal = (target: Point, bend: BendDirection): LimbGoal => ({ target, bend });

/** Piedi a terra leggermente sfalsati (il lontano poco più indietro). */
const feetOnFloor = (x: number): { nearLeg: LimbGoal; farLeg: LimbGoal } => ({
  nearLeg: goal(pt(x, ANKLE_Y), 1),
  farLeg: goal(pt(x - 6, ANKLE_Y), 1)
});

/** Braccia tese verso il basso (es. manubri lungo i fianchi). */
const armsHanging = (shoulder: Point, angle = 90): { nearArm: LimbGoal; farArm: LimbGoal } => ({
  nearArm: goal(polar(shoulder, 45, angle), -1),
  farArm: goal(polar(shoulder, 45, angle - 4), -1)
});

/**
 * Corpo in linea retta da spalla a piede (plank, piegamenti):
 * restituisce posizione dell'anca e angolo del busto.
 */
function straightBody(shoulder: Point, foot: Point): { hip: Point; torsoAngle: number } {
  const angleToShoulder = (Math.atan2(shoulder.y - foot.y, shoulder.x - foot.x) * 180) / Math.PI;
  const legLength = distance(shoulder, foot) - 44;
  return { hip: polar(foot, legLength, angleToShoulder), torsoAngle: angleToShoulder };
}

/** Angolo anca→spalla di uno scheletro già risolto. */
const torsoAngleOf = (s: Skeleton): number => (Math.atan2(s.shoulder.y - s.hip.y, s.shoulder.x - s.hip.x) * 180) / Math.PI;

const DumbbellsInHands: React.FC<{ s: Skeleton }> = ({ s }) => (
  <>
    <Dumbbell at={s.farArm.end} scale={0.9} />
    <Dumbbell at={s.nearArm.end} />
  </>
);

// ---------------------------------------------------------------------------
// Esercizi di forza
// ---------------------------------------------------------------------------

function squatPose(t: number, withDumbbells: boolean): PoseSpec {
  const p = repCurve(t);
  const hip = pt(lerp(118, 98, p), lerp(105, 138, p));
  const torsoAngle = lerp(-86, -50, p);
  const shoulder = shoulderOf(hip, torsoAngle);
  // Bilanciere appoggiato sui trapezi, appena dietro la spalla.
  const bar = polar(shoulder, 5, torsoAngle - 90);
  const arms = withDumbbells
    ? armsHanging(shoulder, 92)
    : { nearArm: goal(bar, 1), farArm: goal(bar, 1) };
  return { hip, torsoAngle, ...arms, ...feetOnFloor(126) };
}

const squatBarbell: ExerciseAnimation = {
  durationSeconds: 2.8,
  highlight: ['legs'],
  caption: 'Cosce parallele',
  pose: (t) => squatPose(t, false),
  inFront: (s) => <Plate at={polar(s.shoulder, 5, torsoAngleOf(s) - 90)} radius={10} />
};

const squatDumbbell: ExerciseAnimation = {
  ...squatBarbell,
  pose: (t) => squatPose(t, true),
  inFront: (s) => <DumbbellsInHands s={s} />
};

/**
 * Multipower: il bilanciere scorre su guide verticali, quindi la spalla resta
 * sulla stessa verticale e il bacino si sposta indietro. Piedi più avanti
 * rispetto allo squat libero.
 */
const SMITH_RAIL_X = 108;
const smithSquat: ExerciseAnimation = {
  durationSeconds: 2.8,
  highlight: ['legs'],
  caption: 'Piedi avanti',
  pose: (t) => {
    const p = repCurve(t);
    const torsoAngle = lerp(-88, -62, p);
    const shoulder = pt(112, lerp(63, 92, p));
    const hip = polar(shoulder, 44, torsoAngle + 180);
    const bar = polar(shoulder, 5, torsoAngle - 90);
    return { hip, torsoAngle, nearArm: goal(bar, 1), farArm: goal(bar, 1), ...feetOnFloor(128) };
  },
  behind: () => (
    <g>
      <line x1={SMITH_RAIL_X - 6} y1="175" x2={SMITH_RAIL_X - 6} y2="18" style={{ stroke: COLORS.equipmentDark }} strokeWidth="5" />
      <line x1={SMITH_RAIL_X - 18} y1="18" x2={SMITH_RAIL_X + 10} y2="18" style={{ stroke: COLORS.equipmentDark }} strokeWidth="5" />
      <line x1={SMITH_RAIL_X - 18} y1="175" x2={SMITH_RAIL_X - 18} y2="18" style={{ stroke: COLORS.equipmentDark }} strokeWidth="5" />
    </g>
  ),
  inFront: (s) => {
    const bar = polar(s.shoulder, 5, torsoAngleOf(s) - 90);
    return (
      <g>
        <line x1={SMITH_RAIL_X + 4} y1="175" x2={SMITH_RAIL_X + 4} y2="18" style={{ stroke: COLORS.equipment }} strokeWidth="4" />
        <line x1={bar.x} y1={bar.y} x2={SMITH_RAIL_X + 4} y2={bar.y} style={{ stroke: COLORS.equipmentLight }} strokeWidth="4" />
        <Plate at={bar} radius={10} />
      </g>
    );
  }
};

/**
 * Adductor / abductor machine, vista frontale da seduti: le gambe si aprono e
 * si chiudono. `spread` è la distanza dei piedi dal centro.
 */
const HIP_MACHINE_CENTER = pt(130, 112);
function hipMachinePose(spread: number): PoseSpec {
  const shoulder = shoulderOf(HIP_MACHINE_CENTER, -90);
  return {
    view: 'front',
    hip: HIP_MACHINE_CENTER,
    torsoAngle: -90,
    // Mani sulle maniglie laterali del sedile.
    nearArm: goal(pt(shoulder.x - 26, HIP_MACHINE_CENTER.y + 2), -1),
    farArm: goal(pt(shoulder.x + 26, HIP_MACHINE_CENTER.y + 2), 1),
    nearLeg: goal(pt(HIP_MACHINE_CENTER.x - spread, 165), -1),
    farLeg: goal(pt(HIP_MACHINE_CENTER.x + spread, 165), 1)
  };
}

const HipMachineSeat: React.FC = () => (
  <g>
    <rect x="112" y="52" width="36" height="66" rx="6" style={{ fill: COLORS.equipmentDark }} />
    <rect x="98" y="116" width="64" height="9" rx="4" style={{ fill: COLORS.equipment }} />
    <line x1="130" y1="125" x2="130" y2="175" style={{ stroke: COLORS.equipmentDark }} strokeWidth="6" />
    <line x1="80" y1="172" x2="180" y2="172" style={{ stroke: COLORS.equipmentDark }} strokeWidth="5" strokeLinecap="round" />
  </g>
);

/** Cuscinetti sulle ginocchia: all'interno (adductor) o all'esterno (abductor). */
const KneePads: React.FC<{ s: Skeleton; side: 'inside' | 'outside' }> = ({ s, side }) => {
  const offset = side === 'inside' ? 9 : -9;
  const pads = [pt(s.nearLeg.joint.x + offset, s.nearLeg.joint.y), pt(s.farLeg.joint.x - offset, s.farLeg.joint.y)];
  return (
    <g>
      {pads.map((pad, i) => (
        <rect key={i} x={pad.x - 4} y={pad.y - 10} width="8" height="20" rx="4" style={{ fill: COLORS.weight }} />
      ))}
    </g>
  );
};

const adductorMachine: ExerciseAnimation = {
  durationSeconds: 2.8,
  highlight: ['legs'],
  caption: 'Stringi le gambe',
  pose: (t) => hipMachinePose(lerp(44, 10, repCurve(t))),
  behind: () => <HipMachineSeat />,
  inFront: (s) => <KneePads s={s} side="inside" />
};

const abductorMachine: ExerciseAnimation = {
  durationSeconds: 2.8,
  highlight: ['legs'],
  caption: 'Apri le gambe',
  pose: (t) => hipMachinePose(lerp(10, 44, repCurve(t))),
  behind: () => <HipMachineSeat />,
  inFront: (s) => <KneePads s={s} side="outside" />
};

const lunges: ExerciseAnimation = {
  durationSeconds: 2.8,
  highlight: ['legs'],
  caption: 'Ginocchio a 90°',
  pose: (t) => {
    const p = repCurve(t);
    const hip = pt(lerp(121, 120, p), lerp(110, 137, p));
    const torsoAngle = -88;
    return {
      hip,
      torsoAngle,
      ...armsHanging(shoulderOf(hip, torsoAngle)),
      nearLeg: goal(pt(146, ANKLE_Y), 1),
      // Gamba posteriore in appoggio sull'avampiede.
      farLeg: goal(pt(94, 166), 1),
      farFootAngle: 60
    };
  },
  inFront: (s) => <DumbbellsInHands s={s} />
};

const deadlift: ExerciseAnimation = {
  durationSeconds: 2.8,
  highlight: ['legs', 'torso'],
  caption: 'Schiena neutra',
  pose: (t) => {
    const p = repCurve(t);
    const hip = pt(lerp(88, 114, p), lerp(128, 105, p));
    const torsoAngle = lerp(-22, -88, p);
    const shoulder = shoulderOf(hip, torsoAngle);
    const hands = polar(shoulder, 45, 90);
    return { hip, torsoAngle, nearArm: goal(hands, -1), farArm: goal(hands, -1), ...feetOnFloor(120) };
  },
  inFront: (s) => <Plate at={s.nearArm.end} />
};

const HIP_THRUST_SHOULDER = pt(64, 134);
const hipThrust: ExerciseAnimation = {
  durationSeconds: 2.8,
  highlight: ['legs'],
  caption: 'Stringi i glutei',
  pose: (t) => {
    const p = repCurve(t);
    // Le spalle restano appoggiate alla panca: il busto ruota attorno a esse.
    const angleFromShoulder = lerp(42, 0, p);
    const hip = polar(HIP_THRUST_SHOULDER, 44, angleFromShoulder);
    const hands = pt(hip.x - 2, hip.y - 8);
    return {
      hip,
      torsoAngle: angleFromShoulder + 180,
      nearArm: goal(hands, -1),
      farArm: goal(hands, -1),
      nearLeg: goal(pt(140, ANKLE_Y), 1),
      farLeg: goal(pt(135, ANKLE_Y), 1)
    };
  },
  behind: () => <Bench x1={22} x2={68} top={140} />,
  inFront: (s) => <Plate at={pt(s.hip.x + 2, s.hip.y - 12)} radius={12} />
};

const LEG_PRESS_HIP = pt(92, 146);
const LEG_PRESS_RAIL = -35;
const legPress: ExerciseAnimation = {
  durationSeconds: 2.8,
  highlight: ['legs'],
  caption: 'Spinta sui talloni',
  pose: (t) => {
    const p = repCurve(t);
    const foot = polar(LEG_PRESS_HIP, lerp(64, 38, p), LEG_PRESS_RAIL);
    const handles = pt(LEG_PRESS_HIP.x + 2, LEG_PRESS_HIP.y + 2);
    return {
      hip: LEG_PRESS_HIP,
      torsoAngle: -145,
      nearArm: goal(handles, -1),
      farArm: goal(handles, -1),
      nearLeg: goal(foot, 1),
      farLeg: goal(pt(foot.x - 3, foot.y + 2), 1),
      nearFootAngle: LEG_PRESS_RAIL - 90,
      farFootAngle: LEG_PRESS_RAIL - 90
    };
  },
  behind: (s) => {
    const backrestOffset = 125; // perpendicolare al busto, verso la schiena
    const railStart = polar(polar(LEG_PRESS_HIP, 8, LEG_PRESS_RAIL + 90), 20, LEG_PRESS_RAIL);
    const railEnd = polar(railStart, 80, LEG_PRESS_RAIL);
    return (
      <g>
        <line
          x1={polar(s.hip, 9, backrestOffset).x}
          y1={polar(s.hip, 9, backrestOffset).y}
          x2={polar(s.shoulder, 14, backrestOffset - 10).x}
          y2={polar(s.shoulder, 14, backrestOffset - 10).y}
          style={{ stroke: COLORS.equipment }}
          strokeWidth="7"
          strokeLinecap="round"
        />
        <line x1="70" y1="175" x2="88" y2="156" style={{ stroke: COLORS.equipmentDark }} strokeWidth="6" />
        <line x1={railStart.x} y1={railStart.y} x2={railEnd.x} y2={railEnd.y} style={{ stroke: COLORS.equipmentDark }} strokeWidth="5" strokeLinecap="round" />
        <line x1={railEnd.x} y1={railEnd.y} x2={railEnd.x} y2="175" style={{ stroke: COLORS.equipmentDark }} strokeWidth="5" />
      </g>
    );
  },
  inFront: (s) => {
    const foot = s.nearLeg.end;
    const top = polar(foot, 16, LEG_PRESS_RAIL - 90);
    const bottom = polar(foot, 8, LEG_PRESS_RAIL + 90);
    return (
      <g>
        <line x1={top.x} y1={top.y} x2={bottom.x} y2={bottom.y} style={{ stroke: COLORS.equipmentLight }} strokeWidth="5" strokeLinecap="round" />
        <Plate at={polar(polar(foot, 6, LEG_PRESS_RAIL), 6, LEG_PRESS_RAIL + 90)} radius={9} />
      </g>
    );
  }
};

const benchPress: ExerciseAnimation = {
  durationSeconds: 2.8,
  highlight: ['arms', 'torso'],
  caption: 'Bilanciere al petto',
  pose: (t) => {
    const p = repCurve(t);
    const hands = pt(lerp(108, 112, p), lerp(88, 118, p));
    return {
      hip: pt(150, 134),
      torsoAngle: 180,
      nearArm: goal(hands, -1),
      farArm: goal(hands, -1),
      nearLeg: goal(pt(184, ANKLE_Y), 1),
      farLeg: goal(pt(178, ANKLE_Y), 1)
    };
  },
  behind: () => <Bench x1={60} x2={170} top={141} />,
  inFront: (s) => <Plate at={s.nearArm.end} radius={15} />
};

// Figure a terra rivolte a destra come le altre: mani a destra, piedi a sinistra.
const PUSHUP_FOOT = pt(46, 166);
const PUSHUP_HANDS = pt(146, 170);
const pushups: ExerciseAnimation = {
  durationSeconds: 2.4,
  highlight: ['arms', 'torso'],
  caption: 'Corpo in linea',
  pose: (t) => {
    const p = repCurve(t);
    const shoulder = lerpPoint(pt(148.5, 124.6), pt(155, 147), p);
    const body = straightBody(shoulder, PUSHUP_FOOT);
    return {
      ...body,
      nearArm: goal(PUSHUP_HANDS, -1),
      farArm: goal(pt(PUSHUP_HANDS.x - 3, PUSHUP_HANDS.y), -1),
      nearLeg: goal(PUSHUP_FOOT, 1),
      farLeg: goal(PUSHUP_FOOT, 1),
      nearFootAngle: 70,
      farFootAngle: 70
    };
  }
};

const LAT_PULLEY = pt(124, 22);
const latMachine: ExerciseAnimation = {
  durationSeconds: 2.8,
  highlight: ['arms', 'torso'],
  caption: 'Tira al petto',
  pose: (t) => {
    const p = repCurve(t);
    const hands = lerpPoint(pt(122, 50), pt(128, 90), p);
    return {
      hip: pt(118, 138),
      torsoAngle: -96,
      nearArm: goal(hands, -1),
      farArm: goal(hands, -1),
      nearLeg: goal(pt(150, ANKLE_Y), 1),
      farLeg: goal(pt(145, ANKLE_Y), 1)
    };
  },
  behind: (s, t) => {
    const stackY = lerp(146, 118, repCurve(t));
    const knee = s.nearLeg.joint;
    return (
      <g>
        <line x1="190" y1="175" x2="190" y2="16" style={{ stroke: COLORS.equipmentDark }} strokeWidth="6" />
        <line x1="190" y1="18" x2="116" y2="18" style={{ stroke: COLORS.equipmentDark }} strokeWidth="5" />
        <circle cx={LAT_PULLEY.x} cy={LAT_PULLEY.y} r="4" style={{ fill: COLORS.equipmentLight }} />
        <Cable from={pt(176, 22)} to={pt(176, stackY)} />
        <Cable from={LAT_PULLEY} to={pt(176, 22)} />
        <rect x="166" y={stackY} width="20" height="22" rx="2" style={{ fill: COLORS.weight }} />
        <rect x="98" y="144" width="40" height="7" rx="3" style={{ fill: COLORS.equipment }} />
        <line x1="118" y1="151" x2="118" y2="175" style={{ stroke: COLORS.equipmentDark }} strokeWidth="5" />
        <rect x={knee.x - 9} y={knee.y - 16} width="16" height="8" rx="4" style={{ fill: COLORS.equipment }} />
      </g>
    );
  },
  inFront: (s) => (
    <g>
      <Cable from={LAT_PULLEY} to={s.nearArm.end} />
      <line x1={s.nearArm.end.x - 14} y1={s.nearArm.end.y} x2={s.nearArm.end.x + 14} y2={s.nearArm.end.y} style={{ stroke: COLORS.equipmentLight }} strokeWidth="4" strokeLinecap="round" />
    </g>
  )
};

const row: ExerciseAnimation = {
  durationSeconds: 2.8,
  highlight: ['arms', 'torso'],
  caption: 'Gomiti indietro',
  pose: (t) => {
    const p = repCurve(t);
    const hip = pt(100, 110);
    const torsoAngle = -22;
    const shoulder = shoulderOf(hip, torsoAngle);
    const hands = polar(shoulder, lerp(45, 28, p), lerp(92, 125, p));
    return { hip, torsoAngle, nearArm: goal(hands, -1), farArm: goal(pt(hands.x - 3, hands.y), -1), ...feetOnFloor(116) };
  },
  inFront: (s) => <DumbbellsInHands s={s} />
};

const shoulderPress: ExerciseAnimation = {
  durationSeconds: 2.8,
  highlight: ['arms'],
  caption: 'Spinta verticale',
  pose: (t) => {
    const p = repCurve(t);
    const hands = lerpPoint(pt(131, 88), pt(122, 51), p);
    return {
      hip: pt(116, 140),
      torsoAngle: -90,
      nearArm: goal(hands, -1),
      farArm: goal(pt(hands.x - 4, hands.y), -1),
      nearLeg: goal(pt(150, ANKLE_Y), 1),
      farLeg: goal(pt(145, ANKLE_Y), 1)
    };
  },
  behind: () => <rect x="94" y="146" width="40" height="29" rx="3" style={{ fill: COLORS.equipment }} />,
  inFront: (s) => <DumbbellsInHands s={s} />
};

/** Curl e pushdown: il gomito resta fermo, l'avambraccio ruota attorno a esso. */
function fixedElbowPose(t: number, hip: Point, torsoAngle: number, forearmFrom: number, forearmTo: number): PoseSpec {
  const shoulder = shoulderOf(hip, torsoAngle);
  const elbow = pt(shoulder.x - 1, shoulder.y + 25);
  const hands = polar(elbow, 23, lerp(forearmFrom, forearmTo, repCurve(t)));
  return {
    hip,
    torsoAngle,
    nearArm: goal(hands, -1),
    farArm: goal(pt(hands.x - 3, hands.y), -1),
    ...feetOnFloor(hip.x + 4)
  };
}

const bicepsCurl: ExerciseAnimation = {
  durationSeconds: 2.8,
  highlight: ['arms'],
  caption: 'Gomiti fermi',
  pose: (t) => fixedElbowPose(t, pt(120, 106), -90, 88, -70),
  inFront: (s) => <DumbbellsInHands s={s} />
};

const PUSHDOWN_PULLEY = pt(178, 26);
const tricepsPushdown: ExerciseAnimation = {
  durationSeconds: 2.8,
  highlight: ['arms'],
  caption: 'Gomiti fermi',
  pose: (t) => fixedElbowPose(t, pt(112, 106), -82, -50, 85),
  behind: () => (
    <g>
      <line x1="188" y1="175" x2="188" y2="18" style={{ stroke: COLORS.equipmentDark }} strokeWidth="6" />
      <line x1="188" y1="22" x2={PUSHDOWN_PULLEY.x} y2={PUSHDOWN_PULLEY.y} style={{ stroke: COLORS.equipmentDark }} strokeWidth="4" />
      <circle cx={PUSHDOWN_PULLEY.x} cy={PUSHDOWN_PULLEY.y} r="4" style={{ fill: COLORS.equipmentLight }} />
    </g>
  ),
  inFront: (s) => (
    <g>
      <Cable from={PUSHDOWN_PULLEY} to={s.nearArm.end} />
      <line x1={s.nearArm.end.x - 4} y1={s.nearArm.end.y - 3} x2={s.nearArm.end.x + 4} y2={s.nearArm.end.y + 3} style={{ stroke: COLORS.equipmentLight }} strokeWidth="4" strokeLinecap="round" />
    </g>
  )
};

const lateralRaises: ExerciseAnimation = {
  durationSeconds: 2.8,
  highlight: ['arms'],
  caption: 'Spalle a 90°',
  pose: (t) => {
    const p = repCurve(t);
    const hip = pt(130, 106);
    const shoulder = shoulderOf(hip, -90);
    return {
      view: 'front',
      hip,
      torsoAngle: -90,
      nearArm: goal(polar(pt(shoulder.x - 13, shoulder.y), 45, lerp(98, 178, p)), 1),
      farArm: goal(polar(pt(shoulder.x + 13, shoulder.y), 45, lerp(82, 2, p)), -1),
      nearLeg: goal(pt(121, ANKLE_Y), -1),
      farLeg: goal(pt(139, ANKLE_Y), 1)
    };
  },
  inFront: (s) => <DumbbellsInHands s={s} />
};

// ---------------------------------------------------------------------------
// Core e corpo libero
// ---------------------------------------------------------------------------

const PLANK_FOOT = pt(41, 166);
const plank: ExerciseAnimation = {
  durationSeconds: 3.6,
  highlight: ['torso'],
  caption: 'Addome contratto',
  pose: (t) => {
    // Tenuta isometrica: solo un lieve respiro del busto.
    const shoulder = pt(150, 145 - 1.5 * repCurve(t));
    return {
      ...straightBody(shoulder, PLANK_FOOT),
      // Gomito sotto la spalla, avambraccio a terra in avanti.
      nearArm: goal(pt(174, 170), -1),
      farArm: goal(pt(170, 170), -1),
      nearLeg: goal(PLANK_FOOT, 1),
      farLeg: goal(PLANK_FOOT, 1),
      nearFootAngle: 70,
      farFootAngle: 70
    };
  }
};

const russianTwist: ExerciseAnimation = {
  durationSeconds: 2.4,
  highlight: ['torso'],
  caption: 'Ruota il busto',
  pose: (t) => {
    const swing = Math.sin(2 * Math.PI * t);
    const hip = pt(112, 162);
    const torsoAngle = -125 + 3 * swing;
    const shoulder = shoulderOf(hip, torsoAngle);
    // Le mani passano da un fianco all'altro: di lato si vede come un movimento
    // verso il basso (lato vicino) e verso l'alto (lato lontano).
    const hands = pt(shoulder.x + 30 + 4 * swing, shoulder.y + 12 + 10 * swing);
    return {
      hip,
      torsoAngle,
      nearArm: goal(hands, -1),
      farArm: goal(pt(hands.x - 2, hands.y - 2), -1),
      nearLeg: goal(pt(165, 150), 1),
      farLeg: goal(pt(161, 153), 1)
    };
  },
  inFront: (s, t) => <Dumbbell at={s.nearArm.end} scale={1 + 0.3 * Math.sin(2 * Math.PI * t)} />
};

const CLIMBER_SHOULDER = pt(150, 124);
const CLIMBER_BACK_FOOT = pt(50, 169);

/**
 * Posizione del piede nei mountain climbers, calcolata con gli angoli
 * (non con un bersaglio fisso) per controllare il percorso del ginocchio:
 * la coscia ruota da distesa indietro (p=0) a ginocchio al petto (p=1),
 * mentre il ginocchio si flette subito, così piede e ginocchio non strisciano a terra.
 */
function climberFoot(hip: Point, p: number): Point {
  const thighAngle = lerp(158, 0, p);
  const kneeFlexion = 130 * Math.sin((p * Math.PI) / 2);
  const knee = polar(hip, BODY.thigh, thighAngle);
  return polar(knee, BODY.shin, thighAngle + kneeFlexion);
}

const mountainClimbers: ExerciseAnimation = {
  durationSeconds: 1.0,
  highlight: ['legs', 'torso'],
  caption: 'Ginocchia al petto',
  pose: (t) => {
    const nearP = repCurve(t);
    const farP = repCurve(t + 0.5);
    // Le gambe si incrociano a metà corsa: lì il bacino sale un poco.
    const base = straightBody(CLIMBER_SHOULDER, CLIMBER_BACK_FOOT);
    const hip = pt(base.hip.x, base.hip.y - 8 * Math.sin(Math.PI * nearP));
    const torsoAngle = (Math.atan2(CLIMBER_SHOULDER.y - hip.y, CLIMBER_SHOULDER.x - hip.x) * 180) / Math.PI;
    return {
      hip,
      torsoAngle,
      nearArm: goal(pt(152, 171), -1),
      farArm: goal(pt(149, 171), -1),
      // Con la figura rivolta a destra la flessione del ginocchio corrisponde a bend = 1.
      nearLeg: goal(climberFoot(hip, nearP), 1),
      farLeg: goal(climberFoot(hip, farP), 1),
      nearFootAngle: lerp(70, 10, nearP),
      farFootAngle: lerp(70, 10, farP)
    };
  }
};

const crunch: ExerciseAnimation = {
  durationSeconds: 2.4,
  highlight: ['torso'],
  caption: 'Solleva le spalle',
  pose: (t) => {
    const hip = pt(122, 165);
    const torsoAngle = lerp(180, 212, repCurve(t));
    const hands = polar(shoulderOf(hip, torsoAngle), 18, torsoAngle + 20);
    return {
      hip,
      torsoAngle,
      nearArm: goal(hands, -1),
      farArm: goal(hands, -1),
      nearLeg: goal(pt(160, ANKLE_Y), 1),
      farLeg: goal(pt(155, ANKLE_Y), 1)
    };
  }
};

/**
 * Panca addominali declinata: testa in basso a sinistra, piedi agganciati
 * ai rulli in alto a destra. Il bacino resta fermo sulla panca, il busto si arrotola.
 */
const DECLINE_BENCH_LOW = pt(36, 160);
const DECLINE_BENCH_HIGH = pt(172, 116);
const DECLINE_SLOPE = (Math.atan2(DECLINE_BENCH_HIGH.y - DECLINE_BENCH_LOW.y, DECLINE_BENCH_HIGH.x - DECLINE_BENCH_LOW.x) * 180) / Math.PI;
const DECLINE_HIP = pt(128, 124);
const DECLINE_FEET = pt(176, 136);
/** Busto appoggiato alla panca (verso la testa) → busto arrotolato verso le ginocchia. */
const declineTorsoAngle = (p: number): number => lerp(DECLINE_SLOPE + 180, 248, p);
const handsBehindHead = (shoulder: Point, torsoAngle: number): Point => polar(shoulder, 18, torsoAngle + 20);

const DeclineBench: React.FC = () => {
  const roller = pt(DECLINE_FEET.x + 3, DECLINE_FEET.y - 10);
  return (
    <g>
      <line x1={DECLINE_BENCH_LOW.x} y1={DECLINE_BENCH_LOW.y} x2={DECLINE_BENCH_HIGH.x} y2={DECLINE_BENCH_HIGH.y} style={{ stroke: COLORS.equipment }} strokeWidth="8" strokeLinecap="round" />
      <line x1="56" y1="156" x2="56" y2="175" style={{ stroke: COLORS.equipmentDark }} strokeWidth="5" />
      <line x1="164" y1="122" x2="164" y2="175" style={{ stroke: COLORS.equipmentDark }} strokeWidth="5" />
      <line x1="164" y1="140" x2={roller.x} y2={roller.y} style={{ stroke: COLORS.equipmentDark }} strokeWidth="4" />
      <circle cx={roller.x} cy={roller.y} r="6" style={{ fill: COLORS.equipmentLight }} />
      <circle cx={roller.x + 2} cy={roller.y + 16} r="5" style={{ fill: COLORS.equipmentLight }} />
    </g>
  );
};

const declineLegs = { nearLeg: goal(DECLINE_FEET, 1), farLeg: goal(pt(DECLINE_FEET.x - 4, DECLINE_FEET.y + 1), 1), nearFootAngle: 10, farFootAngle: 10 };

const declineCrunch: ExerciseAnimation = {
  durationSeconds: 2.8,
  highlight: ['torso'],
  caption: 'Arrotola il busto',
  pose: (t) => {
    const torsoAngle = declineTorsoAngle(repCurve(t));
    const hands = handsBehindHead(shoulderOf(DECLINE_HIP, torsoAngle), torsoAngle);
    return { hip: DECLINE_HIP, torsoAngle, nearArm: goal(hands, -1), farArm: goal(hands, -1), ...declineLegs };
  },
  behind: () => <DeclineBench />
};

/**
 * Versione obliqua: salendo il busto ruota e il braccio vicino si allunga
 * verso il ginocchio opposto (in vista laterale: verso le ginocchia).
 */
const declineObliqueCrunch: ExerciseAnimation = {
  durationSeconds: 2.8,
  highlight: ['torso'],
  caption: 'Gomito al ginocchio opposto',
  pose: (t) => {
    const p = repCurve(t);
    const torsoAngle = declineTorsoAngle(p * 0.9);
    const shoulder = shoulderOf(DECLINE_HIP, torsoAngle);
    const behindHead = handsBehindHead(shoulder, torsoAngle);
    const towardKnees = polar(shoulder, 44, torsoAngle + 70);
    return {
      hip: DECLINE_HIP,
      torsoAngle,
      neckOffset: 10 * p,
      nearArm: goal(lerpPoint(behindHead, towardKnees, p), -1),
      farArm: goal(behindHead, -1),
      ...declineLegs
    };
  },
  behind: () => <DeclineBench />
};

const kettlebellSwing: ExerciseAnimation = {
  durationSeconds: 2.0,
  highlight: ['legs', 'torso'],
  caption: "Spinta d'anca",
  pose: (t) => {
    const p = repCurve(t);
    const hip = pt(lerp(96, 114, p), lerp(122, 105, p));
    const torsoAngle = lerp(-38, -88, p);
    const hands = polar(shoulderOf(hip, torsoAngle), 46, lerp(98, -2, p));
    return { hip, torsoAngle, nearArm: goal(hands, -1), farArm: goal(hands, -1), ...feetOnFloor(122) };
  },
  inFront: (s) => <Kettlebell at={s.nearArm.end} />
};

const BURPEE_STAND: PoseSpec = {
  hip: pt(118, 106),
  torsoAngle: -88,
  ...armsHanging(shoulderOf(pt(118, 106), -88)),
  ...feetOnFloor(122)
};
/** Fase intermedia: busto che si piega con le braccia ancora rilassate. */
const BURPEE_BEND: PoseSpec = {
  hip: pt(112, 120),
  torsoAngle: -50,
  ...armsHanging(shoulderOf(pt(112, 120), -50)),
  ...feetOnFloor(124)
};
const BURPEE_SQUAT: PoseSpec = {
  hip: pt(108, 142),
  torsoAngle: -25,
  nearArm: goal(pt(150, 170), -1),
  farArm: goal(pt(147, 170), -1),
  ...feetOnFloor(126)
};
// Nella plank la figura resta rivolta a destra come nelle altre fasi:
// mani avanti (destra), piedi spinti indietro (sinistra).
const BURPEE_PLANK_FOOT = pt(48, 166);
const BURPEE_PLANK: PoseSpec = {
  ...straightBody(pt(150, 126), BURPEE_PLANK_FOOT),
  nearArm: goal(pt(152, 170), -1),
  farArm: goal(pt(149, 170), -1),
  nearLeg: goal(BURPEE_PLANK_FOOT, 1),
  farLeg: goal(BURPEE_PLANK_FOOT, 1),
  nearFootAngle: 70,
  farFootAngle: 70
};
const BURPEE_JUMP: PoseSpec = {
  hip: pt(118, 92),
  torsoAngle: -88,
  nearArm: goal(polar(shoulderOf(pt(118, 92), -88), 47, -80), -1),
  farArm: goal(polar(shoulderOf(pt(118, 92), -88), 47, -84), -1),
  nearLeg: goal(pt(122, 156), 1),
  farLeg: goal(pt(116, 156), 1),
  nearFootAngle: 30,
  farFootAngle: 30
};
const burpees: ExerciseAnimation = {
  durationSeconds: 3.6,
  highlight: ['legs', 'torso'],
  caption: 'Ritmo costante',
  pose: (t) => keyframePose(t, [BURPEE_STAND, BURPEE_BEND, BURPEE_SQUAT, BURPEE_PLANK, BURPEE_SQUAT, BURPEE_JUMP])
};

const jumpingJacks: ExerciseAnimation = {
  durationSeconds: 1.2,
  highlight: ['legs', 'arms'],
  caption: 'Salta e apri',
  pose: (t) => {
    const p = repCurve(t);
    // Aprendo le gambe l'anca scende, altrimenti i piedi non toccherebbero terra.
    const hip = pt(130, lerp(106, 108, p));
    const shoulder = shoulderOf(hip, -90);
    return {
      view: 'front',
      hip,
      torsoAngle: -90,
      nearArm: goal(polar(pt(shoulder.x - 13, shoulder.y), 47.5, lerp(100, 245, p)), -1),
      farArm: goal(polar(pt(shoulder.x + 13, shoulder.y), 47.5, lerp(80, -65, p)), 1),
      nearLeg: goal(pt(lerp(122, 102, p), ANKLE_Y), -1),
      farLeg: goal(pt(lerp(138, 158, p), ANKLE_Y), 1)
    };
  }
};

// ---------------------------------------------------------------------------
// Macchine cardio
// ---------------------------------------------------------------------------

/** Nastro del tapis roulant, inclinato (più alto verso la console a destra). */
const treadmillBeltY = (x: number): number => 162 - (x - 120) * 0.1;
const TREADMILL_STRIDE = 24;

function treadmillFoot(phase: number): Point {
  // Prima metà del ciclo: piede in appoggio che scorre indietro col nastro.
  // Seconda metà: piede sollevato che torna avanti.
  const x = 120 + TREADMILL_STRIDE * Math.cos(phase);
  const lift = 14 * Math.max(0, -Math.sin(phase));
  return pt(x, treadmillBeltY(x) - 4 - lift);
}

/** Mano di chi corre: braccio all'angolo dato, avambraccio ruotato di 80° in avanti. */
function runningHand(shoulder: Point, upperArmAngle: number): Point {
  const elbow = polar(shoulder, 25, upperArmAngle);
  return polar(elbow, 23, upperArmAngle - 80);
}

const treadmill: ExerciseAnimation = {
  durationSeconds: 1.0,
  highlight: ['legs'],
  caption: 'Pendenza 6%',
  pose: (t) => {
    const phase = 2 * Math.PI * t;
    const hip = pt(118, 100 + 2 * Math.cos(2 * phase));
    const torsoAngle = -84;
    const shoulder = shoulderOf(hip, torsoAngle);
    // Braccia in opposizione alle gambe, gomito piegato a ~90° con la mano in avanti.
    return {
      hip,
      torsoAngle,
      nearArm: goal(runningHand(shoulder, 90 + 35 * Math.cos(phase)), -1),
      farArm: goal(runningHand(shoulder, 90 - 35 * Math.cos(phase)), -1),
      nearLeg: goal(treadmillFoot(phase), 1),
      farLeg: goal(treadmillFoot(phase + Math.PI), 1),
      nearFootAngle: -6 + 30 * Math.max(0, -Math.sin(phase)),
      farFootAngle: -6 + 30 * Math.max(0, Math.sin(phase))
    };
  },
  behind: (_s, t) => (
    <g>
      <line x1="48" y1={treadmillBeltY(48) + 4} x2="188" y2={treadmillBeltY(188) + 4} style={{ stroke: COLORS.equipment }} strokeWidth="9" strokeLinecap="round" />
      <line x1="44" y1="175" x2="52" y2={treadmillBeltY(48) + 8} style={{ stroke: COLORS.equipmentDark }} strokeWidth="4" />
      <rect x="182" y="140" width="20" height="35" rx="4" style={{ fill: COLORS.equipmentDark }} />
      <line x1="194" y1="142" x2="200" y2="76" style={{ stroke: COLORS.equipment }} strokeWidth="5" strokeLinecap="round" />
      <rect x="188" y="62" width="26" height="15" rx="3" style={{ fill: COLORS.equipmentDark, stroke: COLORS.accent }} strokeWidth="1.5" />
      <line x1="150" y1="96" x2="198" y2="86" style={{ stroke: COLORS.equipment }} strokeWidth="4" strokeLinecap="round" />
      {/* Strisce del nastro che scorrono all'indietro. Periodo 16px, 96px per ciclo: nessuno scatto al riavvio. */}
      <line
        x1="50"
        y1={treadmillBeltY(50)}
        x2="184"
        y2={treadmillBeltY(184)}
        style={{ stroke: COLORS.accent }}
        strokeWidth="2"
        strokeDasharray="8 8"
        strokeDashoffset={t * 96}
      />
    </g>
  )
};

const BIKE_HIP = pt(104, 104);
const BIKE_CRANK = pt(130, 148);
const BIKE_CRANK_RADIUS = 15;
const BIKE_HANDLEBAR = pt(168, 84);
const bikePedal = (t: number, offsetDeg: number): Point => polar(BIKE_CRANK, BIKE_CRANK_RADIUS, 360 * t + offsetDeg);

const stationaryBike: ExerciseAnimation = {
  durationSeconds: 0.9,
  highlight: ['legs'],
  caption: 'Cadenza 80 RPM',
  pose: (t) => ({
    hip: BIKE_HIP,
    torsoAngle: -48,
    nearArm: goal(BIKE_HANDLEBAR, -1),
    farArm: goal(pt(BIKE_HANDLEBAR.x - 3, BIKE_HANDLEBAR.y + 1), -1),
    // Pedali opposti: i piedi sono sempre a 180° l'uno dall'altro.
    nearLeg: goal(bikePedal(t, 0), 1),
    farLeg: goal(bikePedal(t, 180), 1),
    nearFootAngle: 10,
    farFootAngle: 10
  }),
  behind: (_s, t) => {
    const farPedal = bikePedal(t, 180);
    const spoke = polar(pt(174, 146), 18, 720 * t);
    return (
      <g>
        <line x1="66" y1="172" x2="200" y2="172" style={{ stroke: COLORS.equipmentDark }} strokeWidth="6" strokeLinecap="round" />
        <circle cx="174" cy="146" r="20" style={{ fill: COLORS.equipmentDark, stroke: COLORS.equipment }} strokeWidth="3" />
        <line x1="174" y1="146" x2={spoke.x} y2={spoke.y} style={{ stroke: COLORS.accent }} strokeWidth="2" />
        <line x1="100" y1="110" x2={BIKE_CRANK.x} y2={BIKE_CRANK.y} style={{ stroke: COLORS.equipment }} strokeWidth="6" strokeLinecap="round" />
        <line x1={BIKE_CRANK.x} y1={BIKE_CRANK.y} x2="96" y2="172" style={{ stroke: COLORS.equipment }} strokeWidth="6" />
        <line x1={BIKE_CRANK.x} y1={BIKE_CRANK.y} x2="164" y2="90" style={{ stroke: COLORS.equipment }} strokeWidth="6" strokeLinecap="round" />
        <line x1="158" y1="86" x2="174" y2="82" style={{ stroke: COLORS.equipmentLight }} strokeWidth="5" strokeLinecap="round" />
        <rect x="86" y="106" width="30" height="7" rx="3" style={{ fill: COLORS.equipmentLight }} />
        <line x1={BIKE_CRANK.x} y1={BIKE_CRANK.y} x2={farPedal.x} y2={farPedal.y} style={{ stroke: COLORS.equipmentDark }} strokeWidth="4" />
      </g>
    );
  },
  inFront: (_s, t) => {
    const nearPedal = bikePedal(t, 0);
    return (
      <g>
        <line x1={BIKE_CRANK.x} y1={BIKE_CRANK.y} x2={nearPedal.x} y2={nearPedal.y} style={{ stroke: COLORS.equipmentLight }} strokeWidth="4" strokeLinecap="round" />
        <circle cx={BIKE_CRANK.x} cy={BIKE_CRANK.y} r="5" style={{ fill: COLORS.equipmentLight }} />
      </g>
    );
  }
};

const ELLIPTICAL_PEDAL_CENTER = pt(122, 156);
const ELLIPTICAL_HANDLE_PIVOT = pt(172, 140);
const ELLIPTICAL_FLYWHEEL = pt(52, 152);
const ellipticalFoot = (phase: number): Point =>
  pt(ELLIPTICAL_PEDAL_CENTER.x + 22 * Math.cos(phase), ELLIPTICAL_PEDAL_CENTER.y + 6 * Math.sin(phase));
const ellipticalGrip = (phase: number, sign: number): Point =>
  polar(ELLIPTICAL_HANDLE_PIVOT, 74, -112 + sign * 10 * Math.cos(phase));

const elliptical: ExerciseAnimation = {
  durationSeconds: 1.4,
  highlight: ['legs', 'arms'],
  caption: 'Spingi e tira',
  pose: (t) => {
    const phase = 2 * Math.PI * t;
    return {
      hip: pt(116, 98 + 1.5 * Math.cos(2 * phase)),
      torsoAngle: -86,
      // Quando il piede vicino va avanti, la maniglia vicina viene tirata indietro.
      nearArm: goal(ellipticalGrip(phase, -1), -1),
      farArm: goal(ellipticalGrip(phase, 1), -1),
      nearLeg: goal(ellipticalFoot(phase), 1),
      farLeg: goal(ellipticalFoot(phase + Math.PI), 1)
    };
  },
  behind: (_s, t) => {
    const phase = 2 * Math.PI * t;
    const farFoot = ellipticalFoot(phase + Math.PI);
    const farGrip = ellipticalGrip(phase, 1);
    const farCrank = polar(ELLIPTICAL_FLYWHEEL, 11, 360 * t + 180);
    return (
      <g>
        <line x1="36" y1="172" x2="204" y2="172" style={{ stroke: COLORS.equipmentDark }} strokeWidth="6" strokeLinecap="round" />
        <circle cx={ELLIPTICAL_FLYWHEEL.x} cy={ELLIPTICAL_FLYWHEEL.y} r="16" style={{ fill: COLORS.equipmentDark, stroke: COLORS.equipment }} strokeWidth="3" />
        <line x1="198" y1="172" x2="192" y2="60" style={{ stroke: COLORS.equipment }} strokeWidth="6" strokeLinecap="round" />
        <rect x="180" y="48" width="26" height="15" rx="3" style={{ fill: COLORS.equipmentDark, stroke: COLORS.accent }} strokeWidth="1.5" />
        <line x1={ELLIPTICAL_HANDLE_PIVOT.x} y1={ELLIPTICAL_HANDLE_PIVOT.y} x2={farGrip.x} y2={farGrip.y} style={{ stroke: COLORS.equipmentDark }} strokeWidth="4" strokeLinecap="round" />
        <line x1={farCrank.x} y1={farCrank.y} x2={farFoot.x + 8} y2={farFoot.y + 5} style={{ stroke: COLORS.equipmentDark }} strokeWidth="4" strokeLinecap="round" />
      </g>
    );
  },
  inFront: (s, t) => {
    const phase = 2 * Math.PI * t;
    const nearFoot = ellipticalFoot(phase);
    const nearCrank = polar(ELLIPTICAL_FLYWHEEL, 11, 360 * t);
    return (
      <g>
        <line x1={nearCrank.x} y1={nearCrank.y} x2={nearFoot.x + 8} y2={nearFoot.y + 5} style={{ stroke: COLORS.equipmentLight }} strokeWidth="4" strokeLinecap="round" />
        <line x1={ELLIPTICAL_HANDLE_PIVOT.x} y1={ELLIPTICAL_HANDLE_PIVOT.y} x2={s.nearArm.end.x} y2={s.nearArm.end.y} style={{ stroke: COLORS.equipmentLight }} strokeWidth="4" strokeLinecap="round" />
        <circle cx={ELLIPTICAL_HANDLE_PIVOT.x} cy={ELLIPTICAL_HANDLE_PIVOT.y} r="4" style={{ fill: COLORS.equipmentLight }} />
      </g>
    );
  }
};

/** Gradino: largo e alto quanto lo spostamento del piede in mezzo ciclo. */
const STAIR_STEP = 28;
const STAIR_FOOT_CENTER = pt(126, 150);
function stairFoot(phase: number): Point {
  // Appoggio: il gradino scende in diagonale portando il piede in basso e indietro.
  // Recupero: il piede risale sollevandosi per superare il gradino.
  const travel = (STAIR_STEP / 2) * Math.cos(phase);
  const lift = 12 * Math.max(0, -Math.sin(phase));
  return pt(STAIR_FOOT_CENTER.x + travel, STAIR_FOOT_CENTER.y - travel - lift);
}

const stairClimber: ExerciseAnimation = {
  durationSeconds: 1.3,
  highlight: ['legs'],
  caption: 'Spinta sul tallone',
  pose: (t) => {
    const phase = 2 * Math.PI * t;
    const rails = pt(146, 86);
    return {
      hip: pt(110, 98 + 2 * Math.cos(2 * phase)),
      torsoAngle: -80,
      nearArm: goal(rails, -1),
      farArm: goal(pt(rails.x - 3, rails.y + 1), -1),
      nearLeg: goal(stairFoot(phase), 1),
      farLeg: goal(stairFoot(phase + Math.PI), 1)
    };
  },
  behind: (_s, t) => {
    // I gradini scorrono in diagonale verso il basso: uno intero ogni mezzo ciclo.
    const offset = ((2 * t) % 1) * STAIR_STEP;
    const firstTread = pt(STAIR_FOOT_CENTER.x - STAIR_STEP / 2, STAIR_FOOT_CENTER.y - STAIR_STEP / 2 + 4);
    const steps = [-2, -1, 0, 1, 2].map((k) => ({
      x: firstTread.x + STAIR_STEP * k - offset,
      y: firstTread.y - STAIR_STEP * k + offset
    }));
    return (
      <g>
        <defs>
          <clipPath id="stair-window">
              <rect x="70" y="100" width="106" height="72" />
          </clipPath>
        </defs>
        <line x1="66" y1="172" x2="200" y2="172" style={{ stroke: COLORS.equipmentDark }} strokeWidth="6" strokeLinecap="round" />
        <g clipPath="url(#stair-window)">
          {steps.map((step, i) => (
            <g key={i}>
              <rect x={step.x} y={step.y} width={STAIR_STEP} height={STAIR_STEP} style={{ fill: COLORS.equipment, stroke: COLORS.equipmentDark }} strokeWidth="1.5" />
              <line x1={step.x} y1={step.y} x2={step.x + STAIR_STEP} y2={step.y} style={{ stroke: COLORS.accent }} strokeWidth="3" />
            </g>
          ))}
        </g>
        <line x1="182" y1="172" x2="174" y2="64" style={{ stroke: COLORS.equipment }} strokeWidth="6" strokeLinecap="round" />
        <rect x="162" y="52" width="26" height="15" rx="3" style={{ fill: COLORS.equipmentDark, stroke: COLORS.accent }} strokeWidth="1.5" />
        <line x1="140" y1="88" x2="176" y2="80" style={{ stroke: COLORS.equipment }} strokeWidth="4" strokeLinecap="round" />
      </g>
    );
  }
};

// ---------------------------------------------------------------------------
// Catalogo
// ---------------------------------------------------------------------------

/** Usata per svgType senza animazione dedicata (es. esercizi futuri). */
const genericStanding: ExerciseAnimation = {
  durationSeconds: 2.8,
  highlight: ['arms'],
  pose: (t) => {
    const p = repCurve(t);
    const hip = pt(130, 106);
    const shoulder = shoulderOf(hip, -90);
    return {
      view: 'front',
      hip,
      torsoAngle: -90,
      nearArm: goal(polar(pt(shoulder.x - 13, shoulder.y), 45, lerp(100, 235, p)), -1),
      farArm: goal(polar(pt(shoulder.x + 13, shoulder.y), 45, lerp(80, -55, p)), 1),
      nearLeg: goal(pt(121, ANKLE_Y), -1),
      farLeg: goal(pt(139, ANKLE_Y), 1)
    };
  }
};

/** Chiave = `svgType` dell'esercizio; 'squat_dumbbell' è la variante con manubri dello squat. */
export const ANIMATIONS: Record<string, ExerciseAnimation> = {
  squat: squatBarbell,
  squat_dumbbell: squatDumbbell,
  smith_squat: smithSquat,
  adductor_machine: adductorMachine,
  abductor_machine: abductorMachine,
  lunges,
  deadlift,
  hip_thrust: hipThrust,
  leg_press: legPress,
  bench_press: benchPress,
  pushups,
  lat_machine: latMachine,
  row,
  shoulder_press: shoulderPress,
  biceps_curl: bicepsCurl,
  triceps_pushdown: tricepsPushdown,
  lateral_raises: lateralRaises,
  plank,
  russian_twist: russianTwist,
  mountain_climbers: mountainClimbers,
  crunch,
  decline_crunch: declineCrunch,
  decline_oblique_crunch: declineObliqueCrunch,
  kettlebell_swing: kettlebellSwing,
  burpees,
  jumping_jacks: jumpingJacks,
  treadmill,
  stationary_bike: stationaryBike,
  elliptical,
  stair_climber: stairClimber
};

export function getExerciseAnimation(key: string): ExerciseAnimation {
  return ANIMATIONS[key] ?? genericStanding;
}
