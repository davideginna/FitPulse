/**
 * Verifica automatica della sessione di allenamento guidata (npm run check:session).
 *
 * Simula una scheda con un orologio finto e controlla le regole di
 * src/utils/workoutSession.ts: sequenza delle fasi, pausa, recupero dopo lo
 * schermo spento, ripristino dopo la chiusura dell'app, voce dello storico.
 *
 * Esce con codice 1 al primo controllo fallito.
 */
import assert from 'node:assert/strict';
import { Routine } from '../src/types';
import {
  addTime,
  advance,
  buildHistoryItem,
  buildSteps,
  countCompletedSets,
  createSession,
  finishNow,
  finishPhase,
  getPhaseElapsedMs,
  getPhaseRemainingMs,
  getTotalElapsedMs,
  goToExercise,
  parseWorkSeconds,
  pause,
  restoreSession,
  resume
} from '../src/utils/workoutSession';

const SEC = 1000;
const T0 = 1_000_000;

/** Tapis roulant a tempo (1 serie da 2 min) + squat a ripetizioni (2 serie). */
const ROUTINE: Routine = {
  id: 'test',
  title: 'Test',
  subtitle: '',
  description: '',
  goal: '',
  level: 'Principiante',
  estimatedDurationMinutes: 10,
  estimatedCaloriesBurn: 50,
  tags: [],
  exercises: [
    { exerciseId: 'treadmill', sets: 1, reps: '2 min', restSeconds: 30 },
    { exerciseId: 'squat', sets: 2, reps: '12', restSeconds: 45 }
  ]
};

let checks = 0;
function check(name: string, run: () => void) {
  run();
  checks += 1;
  console.log(`  ✓ ${name}`);
}

check('obiettivi a tempo e a ripetizioni', () => {
  assert.equal(parseWorkSeconds('45 sec'), 45);
  assert.equal(parseWorkSeconds('10 min'), 600);
  assert.equal(parseWorkSeconds('30 - 45 sec'), 30);
  assert.equal(parseWorkSeconds('12'), null);
  assert.equal(parseWorkSeconds('10-12'), null);
  assert.equal(parseWorkSeconds('10 per gamba'), null);
  assert.equal(parseWorkSeconds('max'), null);
});

check('un passo per serie', () => {
  const steps = buildSteps(ROUTINE);
  assert.equal(steps.length, 3);
  assert.deepEqual(steps[0], { exerciseIndex: 0, setIndex: 0, totalSets: 1, workSec: 120, restSec: 30 });
  assert.equal(steps[2].workSec, null);
});

check('sequenza completa: avvio, esecuzione, recupero', () => {
  let s = createSession(ROUTINE, 10, T0);
  assert.equal(s.phase, 'prepare');
  assert.equal(getPhaseRemainingMs(s, T0 + 4 * SEC), 6 * SEC);

  s = advance(s, T0 + 10 * SEC);
  assert.equal(s.phase, 'work');
  assert.equal(getPhaseRemainingMs(s, T0 + 10 * SEC), 120 * SEC);

  // Esercizio a tempo: finisce da solo e passa al recupero.
  s = advance(s, T0 + 130 * SEC);
  assert.equal(s.phase, 'rest');
  assert.equal(s.logs[0].sets[0].completed, true);
  assert.equal(s.logs[0].sets[0].durationSeconds, 120);

  // Nuovo esercizio: di nuovo pausa di avvio, poi esecuzione senza scadenza.
  s = advance(s, T0 + 160 * SEC);
  assert.equal(s.phase, 'prepare');
  assert.equal(s.stepIndex, 1);
  s = advance(s, T0 + 170 * SEC);
  assert.equal(s.phase, 'work');
  assert.equal(getPhaseRemainingMs(s, T0 + 175 * SEC), null);
  assert.equal(getPhaseElapsedMs(s, T0 + 175 * SEC), 5 * SEC);
  assert.equal(advance(s, T0 + 999 * SEC), s, 'una serie a ripetizioni non finisce da sola');

  // "Serie fatta" → recupero → seconda serie dello stesso esercizio senza pausa di avvio.
  s = finishPhase(s, T0 + 200 * SEC);
  assert.equal(s.phase, 'rest');
  assert.equal(s.logs[1].sets[0].durationSeconds, 30);
  s = advance(s, T0 + 245 * SEC);
  assert.equal(s.phase, 'work');
  assert.equal(s.stepIndex, 2);

  s = finishPhase(s, T0 + 275 * SEC);
  assert.equal(s.phase, 'finished');
  assert.equal(countCompletedSets(s), 3);
  assert.equal(getTotalElapsedMs(s, T0 + 9999 * SEC), 275 * SEC, 'dopo la fine il tempo totale non cresce');
});

check('i piccoli ritardi dei tick non si accumulano', () => {
  let s = createSession(ROUTINE, 10, T0);
  s = advance(s, T0 + 10 * SEC + 400);
  assert.equal(s.phaseStartedAt, T0 + 10 * SEC);
  assert.equal(s.pausedAt, null);
});

check('pausa: il tempo si ferma e riparte da dove era', () => {
  let s = advance(createSession(ROUTINE, 10, T0), T0 + 10 * SEC);
  s = pause(s, T0 + 40 * SEC);
  assert.equal(getPhaseRemainingMs(s, T0 + 500 * SEC), 90 * SEC);
  assert.equal(getTotalElapsedMs(s, T0 + 500 * SEC), 40 * SEC);
  assert.equal(advance(s, T0 + 500 * SEC), s, 'in pausa le fasi non scadono');

  s = resume(s, T0 + 100 * SEC);
  assert.equal(getPhaseRemainingMs(s, T0 + 100 * SEC), 90 * SEC);
  assert.equal(getTotalElapsedMs(s, T0 + 110 * SEC), 50 * SEC);
});

check('fase scaduta a schermo spento: la successiva aspetta in pausa', () => {
  let s = advance(createSession(ROUTINE, 10, T0), T0 + 10 * SEC);
  // L'app si risveglia 5 minuti dopo la fine dei 2 minuti di tapis roulant.
  s = advance(s, T0 + 430 * SEC);
  assert.equal(s.phase, 'rest');
  assert.equal(s.logs[0].sets[0].completed, true);
  assert.equal(s.pausedAt, T0 + 130 * SEC);
  assert.equal(getPhaseRemainingMs(s, T0 + 430 * SEC), 30 * SEC, 'il recupero è ancora intero');
  assert.equal(getTotalElapsedMs(s, T0 + 430 * SEC), 130 * SEC);
});

check('tempo aggiunto, anche in pausa', () => {
  let s = createSession(ROUTINE, 10, T0);
  s = addTime(s, 15);
  assert.equal(getPhaseRemainingMs(s, T0), 25 * SEC);
  s = addTime(pause(s, T0 + 5 * SEC), 15);
  assert.equal(getPhaseRemainingMs(s, T0 + 60 * SEC), 35 * SEC);
});

check('salto a un altro esercizio: nessuna serie segnata, riparte dalla prima da fare', () => {
  let s = advance(createSession(ROUTINE, 10, T0), T0 + 10 * SEC);
  s = goToExercise(s, 1, T0 + 20 * SEC);
  assert.equal(s.stepIndex, 1);
  assert.equal(s.phase, 'prepare');
  assert.equal(countCompletedSets(s), 0);

  s = finishPhase(finishPhase(s, T0 + 21 * SEC), T0 + 50 * SEC); // parti ora, serie fatta
  s = goToExercise(s, 0, T0 + 60 * SEC);
  s = goToExercise(s, 1, T0 + 70 * SEC);
  assert.equal(s.stepIndex, 2, 'la prima serie di squat è già fatta');
});

check('senza pausa di avvio si parte subito', () => {
  const s = createSession(ROUTINE, 0, T0);
  assert.equal(s.phase, 'work');
  assert.equal(getPhaseRemainingMs(s, T0), 120 * SEC);
});

check('termina subito: la serie in corso non conta', () => {
  let s = advance(createSession(ROUTINE, 10, T0), T0 + 10 * SEC);
  s = advance(s, T0 + 130 * SEC); // tapis fatto, in recupero
  s = finishNow(s, T0 + 140 * SEC);
  assert.equal(s.phase, 'finished');
  const item = buildHistoryItem(s, T0 + 999 * SEC, 96);
  assert.equal(item.durationSeconds, 140);
  assert.equal(item.exercisesCompletedCount, 1);
  assert.equal(item.estimatedCalories, Math.round(5 * 96 * (140 / 3600)));
});

check('pesi proposti e volume delle sole serie completate', () => {
  let s = createSession(ROUTINE, 0, T0, { squat: 20 });
  assert.equal(s.logs[0].sets[0].weightKg, 0, 'il tapis roulant non ha pesi');
  assert.equal(s.logs[1].sets[1].weightKg, 20);
  s = goToExercise(s, 1, T0);
  s = finishPhase(finishPhase(s, T0 + SEC), T0 + 30 * SEC);
  assert.equal(buildHistoryItem(finishNow(s, T0 + 40 * SEC), T0 + 40 * SEC, 96).totalVolumeKg, 12 * 20);
});

check('ripristino dopo la chiusura dell\'app', () => {
  const s = advance(createSession(ROUTINE, 10, T0), T0 + 10 * SEC);
  const savedAt = T0 + 40 * SEC;

  assert.equal(restoreSession(null, savedAt), null);
  assert.equal(restoreSession({ session: s, savedAt }, savedAt + 2 * SEC), s, 'ricaricamento: continua');

  const reopened = restoreSession({ session: s, savedAt }, savedAt + 600 * SEC);
  assert.ok(reopened);
  assert.equal(reopened.pausedAt, savedAt, 'app chiusa: torna in pausa all\'ultimo istante noto');
  assert.equal(getPhaseRemainingMs(reopened, savedAt + 600 * SEC), 90 * SEC);

  assert.equal(restoreSession({ session: s, savedAt }, savedAt + 7 * 3600 * SEC), null, 'troppo vecchio');
  assert.equal(restoreSession({ session: finishNow(s, savedAt), savedAt }, savedAt + SEC), null, 'già finito');
  assert.equal(restoreSession({ session: { ...s, stepIndex: 99 }, savedAt }, savedAt + SEC), null, 'non valido');
});

console.log(`✓ sessione di allenamento: ${checks} controlli superati`);
