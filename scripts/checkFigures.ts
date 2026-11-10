/**
 * Verifica automatica delle animazioni delle figure (npm run check:figures).
 *
 * Per ogni esercizio campiona la posa in 20 istanti del ciclo e controlla che:
 *  1. le ossa abbiano sempre la loro lunghezza (arti mai staccati o allungati);
 *  2. mani e piedi raggiungano il bersaglio dichiarato nella posa
 *     (es. piedi sui pedali della cyclette, mani sul manubrio). Se un bersaglio
 *     è fuori portata l'arto si allunga verso di esso ma non lo tocca: è un
 *     errore nei numeri della posa.
 *
 * Esce con codice 1 se trova problemi.
 */
import { ANIMATIONS } from '../src/components/exerciseFigure/animations';
import { BODY, LimbGoal, SolvedLimb, solvePose } from '../src/components/exerciseFigure/skeleton';
import { distance } from '../src/components/exerciseFigure/kinematics';

const SAMPLES = 20;
const BONE_TOLERANCE = 0.05;
/** Scarto ammesso fra estremità e bersaglio, in unità del viewBox. */
const REACH_TOLERANCE = 1.5;

const problems: string[] = [];

function checkLimb(name: string, limb: SolvedLimb, goal: LimbGoal, upper: number, lower: number, where: string) {
  const upperLen = distance(limb.root, limb.joint);
  const lowerLen = distance(limb.joint, limb.end);
  if (Math.abs(upperLen - upper) > BONE_TOLERANCE || Math.abs(lowerLen - lower) > BONE_TOLERANCE) {
    problems.push(`${where} ${name}: lunghezza ossa ${upperLen.toFixed(1)}/${lowerLen.toFixed(1)} invece di ${upper}/${lower}`);
  }
  const miss = distance(limb.end, goal.target);
  if (miss > REACH_TOLERANCE) {
    problems.push(`${where} ${name}: bersaglio mancato di ${miss.toFixed(1)}`);
  }
}

for (const [key, animation] of Object.entries(ANIMATIONS)) {
  for (let i = 0; i < SAMPLES; i++) {
    const t = i / SAMPLES;
    const pose = animation.pose(t);
    const s = solvePose(pose);
    const where = `${key} t=${t.toFixed(2)}`;
    checkLimb('braccio vicino', s.nearArm, pose.nearArm, BODY.upperArm, BODY.forearm, where);
    checkLimb('braccio lontano', s.farArm, pose.farArm, BODY.upperArm, BODY.forearm, where);
    checkLimb('gamba vicina', s.nearLeg, pose.nearLeg, BODY.thigh, BODY.shin, where);
    checkLimb('gamba lontana', s.farLeg, pose.farLeg, BODY.thigh, BODY.shin, where);
  }
}

if (problems.length > 0) {
  console.error(`✗ ${problems.length} problemi nelle animazioni:\n` + problems.join('\n'));
  process.exit(1);
}
console.log(`✓ ${Object.keys(ANIMATIONS).length} animazioni verificate (${SAMPLES} istanti ciascuna)`);
