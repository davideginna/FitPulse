import { ExerciseLog, Routine, WorkoutHistoryItem, WorkoutSetRecord } from '../types';

/**
 * Logica della sessione di allenamento guidata (schermata ActiveWorkoutView).
 *
 * Una scheda viene "srotolata" in una lista di passi, uno per serie. Ogni passo
 * attraversa fino a tre fasi:
 *   'prepare' (pausa di avvio, solo alla prima serie di un esercizio o dopo un salto)
 *   'work'    (esecuzione: conto alla rovescia se l'esercizio è a tempo, cronometro
 *              che sale se è a ripetizioni e finisce con "Serie fatta")
 *   'rest'    (recupero prima della serie successiva)
 * Dopo l'ultima serie la sessione passa a 'finished'.
 *
 * Tutto il tempo è espresso con istanti assoluti (ms di Date.now()), non con
 * contatori decrementati: i browser rallentano o sospendono i timer a schermo
 * spento, e un contatore resterebbe indietro. Per lo stesso motivo le funzioni
 * qui sotto sono pure e ricevono `now` come parametro: si possono verificare
 * senza orologio (vedi scripts/checkWorkoutSession.ts).
 *
 * Pausa: `pausedAt` congela l'orologio; alla ripresa gli istanti della fase
 * vengono spostati in avanti della durata della pausa.
 */

export type SessionPhase = 'prepare' | 'work' | 'rest' | 'finished';

export interface SessionStep {
  /** Indice in `routine.exercises`. */
  exerciseIndex: number;
  /** Indice della serie (0 = prima). */
  setIndex: number;
  totalSets: number;
  /** Durata dell'esecuzione per gli esercizi a tempo; null = a ripetizioni. */
  workSec: number | null;
  restSec: number;
}

export interface WorkoutSession {
  routine: Routine;
  /** Durata della pausa di avvio in secondi (0 = nessuna). */
  prepareSec: number;
  stepIndex: number;
  phase: SessionPhase;
  /** Inizio della fase corrente. In 'finished' è l'istante di fine allenamento. */
  phaseStartedAt: number;
  /** Fine prevista della fase; null se non ha scadenza (serie a ripetizioni, fine). */
  phaseEndsAt: number | null;
  /** Istante in cui è stata messa in pausa; null se sta scorrendo. */
  pausedAt: number | null;
  startedAt: number;
  /** Somma delle pause già concluse (quella in corso si ricava da `pausedAt`). */
  totalPausedMs: number;
  logs: ExerciseLog[];
}

/**
 * Se una fase risulta scaduta da più di così, l'app non stava girando (schermo
 * spento, app in background): la fase successiva parte in pausa invece di
 * consumarsi da sola mentre nessuno guarda.
 */
const MAX_LATE_MS = 5000;

/** Oltre questo intervallo senza salvataggi consideriamo l'app chiusa (non un semplice ricaricamento). */
const RELOAD_GAP_MS = 15000;

/** Un allenamento interrotto da più di così non viene riproposto. */
const MAX_RESTORE_AGE_MS = 6 * 60 * 60 * 1000;

/**
 * Durata in secondi di un obiettivo a tempo ("45 sec", "10 min", "30 - 45 sec":
 * negli intervalli vale il minimo). Restituisce null per gli obiettivi a
 * ripetizioni ("12", "10 per gamba", "max").
 */
export function parseWorkSeconds(reps: string): number | null {
  const match = /^\s*(\d+)(?:\s*-\s*\d+)?\s*(sec|min)/i.exec(reps);
  if (!match) return null;
  const value = parseInt(match[1], 10);
  const seconds = match[2].toLowerCase() === 'min' ? value * 60 : value;
  return seconds > 0 ? seconds : null;
}

export function buildSteps(routine: Routine): SessionStep[] {
  const steps: SessionStep[] = [];
  routine.exercises.forEach((item, exerciseIndex) => {
    const totalSets = Math.max(1, item.sets || 1);
    const workSec = parseWorkSeconds(item.reps);
    const restSec = Math.max(0, item.restSeconds || 0);
    for (let setIndex = 0; setIndex < totalSets; setIndex++) {
      steps.push({ exerciseIndex, setIndex, totalSets, workSec, restSec });
    }
  });
  return steps;
}

function buildEmptyLogs(routine: Routine, weightsByExerciseId: Record<string, number>): ExerciseLog[] {
  return routine.exercises.map((item) => {
    const isTimed = parseWorkSeconds(item.reps) !== null;
    const sets: WorkoutSetRecord[] = Array.from({ length: Math.max(1, item.sets || 1) }, (_, index) => ({
      setNumber: index + 1,
      targetReps: item.reps,
      // Negli esercizi a tempo non ci sono ripetizioni da contare.
      completedReps: isTimed ? 0 : parseInt(item.reps, 10) || 0,
      weightKg: weightsByExerciseId[item.exerciseId] ?? 0,
      completed: false
    }));
    return { exerciseId: item.exerciseId, sets };
  });
}

/**
 * Nuova sessione. La scheda deve avere almeno un esercizio.
 * `weightsByExerciseId` sono i pesi proposti (vedi utils/weights.ts), modificabili durante l'allenamento.
 */
export function createSession(
  routine: Routine,
  prepareSec: number,
  now: number,
  weightsByExerciseId: Record<string, number> = {}
): WorkoutSession {
  const base: WorkoutSession = {
    routine,
    prepareSec,
    stepIndex: 0,
    phase: 'work',
    phaseStartedAt: now,
    phaseEndsAt: null,
    pausedAt: null,
    startedAt: now,
    totalPausedMs: 0,
    logs: buildEmptyLogs(routine, weightsByExerciseId)
  };
  return enterStep(base, 0, now, true);
}

/** Entra in un passo: dalla pausa di avvio (se richiesta e attiva) oppure direttamente dall'esecuzione. */
function enterStep(session: WorkoutSession, stepIndex: number, at: number, withPrepare: boolean): WorkoutSession {
  if (withPrepare && session.prepareSec > 0) {
    return { ...session, stepIndex, phase: 'prepare', phaseStartedAt: at, phaseEndsAt: at + session.prepareSec * 1000 };
  }
  const step = buildSteps(session.routine)[stepIndex];
  return {
    ...session,
    stepIndex,
    phase: 'work',
    phaseStartedAt: at,
    phaseEndsAt: step.workSec !== null ? at + step.workSec * 1000 : null
  };
}

function markSetCompleted(session: WorkoutSession, step: SessionStep, at: number): WorkoutSession {
  const durationSeconds = Math.max(0, Math.round((at - session.phaseStartedAt) / 1000));
  return updateSetRecord(session, step.exerciseIndex, step.setIndex, { completed: true, durationSeconds });
}

/** Chiude la fase corrente all'istante `at` e apre la successiva. */
function endPhase(session: WorkoutSession, at: number): WorkoutSession {
  const steps = buildSteps(session.routine);
  const step = steps[session.stepIndex];

  if (session.phase === 'prepare') {
    return enterStep(session, session.stepIndex, at, false);
  }
  if (session.phase === 'work') {
    const done = markSetCompleted(session, step, at);
    const isLastStep = session.stepIndex >= steps.length - 1;
    if (isLastStep) {
      return { ...done, phase: 'finished', phaseStartedAt: at, phaseEndsAt: null };
    }
    if (step.restSec > 0) {
      return { ...done, phase: 'rest', phaseStartedAt: at, phaseEndsAt: at + step.restSec * 1000 };
    }
    return enterNextStep(done, steps, at);
  }
  if (session.phase === 'rest') {
    return enterNextStep(session, steps, at);
  }
  return session;
}

function enterNextStep(session: WorkoutSession, steps: SessionStep[], at: number): WorkoutSession {
  const nextIndex = session.stepIndex + 1;
  // Pausa di avvio solo quando cambia l'esercizio: tra le serie c'è già il recupero.
  return enterStep(session, nextIndex, at, steps[nextIndex].setIndex === 0);
}

/**
 * Porta la sessione all'istante `now`, chiudendo le fasi a tempo scadute.
 * Restituisce lo stesso oggetto se non è cambiato nulla.
 */
export function advance(session: WorkoutSession, now: number): WorkoutSession {
  let current = session;
  while (
    current.pausedAt === null &&
    current.phase !== 'finished' &&
    current.phaseEndsAt !== null &&
    current.phaseEndsAt <= now
  ) {
    const endedAt = current.phaseEndsAt;
    // La fase successiva parte dalla fine teorica della precedente, non da `now`,
    // così i piccoli ritardi dei tick non si accumulano.
    current = endPhase(current, endedAt);
    if (now - endedAt > MAX_LATE_MS && current.phase !== 'finished') {
      current = { ...current, pausedAt: endedAt };
    }
  }
  return current;
}

export function pause(session: WorkoutSession, now: number): WorkoutSession {
  const current = advance(session, now);
  if (current.pausedAt !== null || current.phase === 'finished') return current;
  return { ...current, pausedAt: now };
}

export function resume(session: WorkoutSession, now: number): WorkoutSession {
  if (session.pausedAt === null) return session;
  const pausedMs = Math.max(0, now - session.pausedAt);
  return {
    ...session,
    pausedAt: null,
    totalPausedMs: session.totalPausedMs + pausedMs,
    phaseStartedAt: session.phaseStartedAt + pausedMs,
    phaseEndsAt: session.phaseEndsAt === null ? null : session.phaseEndsAt + pausedMs
  };
}

/**
 * Conclude subito la fase corrente: "Parti ora" nella pausa di avvio, "Serie fatta"
 * nell'esecuzione (la serie viene segnata come completata), "Salta recupero" nel recupero.
 * Se la sessione era in pausa riparte.
 */
export function finishPhase(session: WorkoutSession, now: number): WorkoutSession {
  const current = resume(advance(session, now), now);
  if (current.phase === 'finished') return current;
  return endPhase(current, now);
}

/** Allunga la fase a tempo corrente (pausa di avvio, esecuzione a tempo, recupero). */
export function addTime(session: WorkoutSession, seconds: number): WorkoutSession {
  if (session.phaseEndsAt === null || session.phase === 'finished') return session;
  return { ...session, phaseEndsAt: session.phaseEndsAt + seconds * 1000 };
}

/**
 * Salta a un altro esercizio senza segnare nulla come completato. Riparte dalla
 * prima serie non ancora fatta (o dalla prima, se sono tutte fatte), con pausa di avvio.
 */
export function goToExercise(session: WorkoutSession, exerciseIndex: number, now: number): WorkoutSession {
  const current = resume(advance(session, now), now);
  if (current.phase === 'finished') return current;
  const steps = buildSteps(current.routine);
  const firstStepIndex = steps.findIndex((step) => step.exerciseIndex === exerciseIndex);
  if (firstStepIndex < 0) return current;
  const firstPendingIndex = steps.findIndex(
    (step) => step.exerciseIndex === exerciseIndex && !current.logs[exerciseIndex].sets[step.setIndex].completed
  );
  return enterStep(current, firstPendingIndex >= 0 ? firstPendingIndex : firstStepIndex, now, true);
}

/** Termina l'allenamento adesso; la serie in corso non viene segnata come completata. */
export function finishNow(session: WorkoutSession, now: number): WorkoutSession {
  const current = resume(advance(session, now), now);
  if (current.phase === 'finished') return current;
  return { ...current, phase: 'finished', phaseStartedAt: now, phaseEndsAt: null };
}

export function setPrepareSec(session: WorkoutSession, prepareSec: number): WorkoutSession {
  return { ...session, prepareSec };
}

export function updateSetRecord(
  session: WorkoutSession,
  exerciseIndex: number,
  setIndex: number,
  changes: Partial<WorkoutSetRecord>
): WorkoutSession {
  const logs = session.logs.map((log, logIndex) =>
    logIndex !== exerciseIndex
      ? log
      : { ...log, sets: log.sets.map((set, index) => (index === setIndex ? { ...set, ...changes } : set)) }
  );
  return { ...session, logs };
}

// --- Letture ---

/** L'orologio della sessione: fermo all'istante della pausa, altrimenti `now`. */
function sessionClock(session: WorkoutSession, now: number): number {
  return session.pausedAt ?? now;
}

/** Tempo residuo della fase corrente; null se la fase non ha scadenza. */
export function getPhaseRemainingMs(session: WorkoutSession, now: number): number | null {
  if (session.phaseEndsAt === null) return null;
  return Math.max(0, session.phaseEndsAt - sessionClock(session, now));
}

export function getPhaseElapsedMs(session: WorkoutSession, now: number): number {
  return Math.max(0, sessionClock(session, now) - session.phaseStartedAt);
}

/** Durata dell'allenamento escluse le pause. */
export function getTotalElapsedMs(session: WorkoutSession, now: number): number {
  const end = session.phase === 'finished' ? session.phaseStartedAt : sessionClock(session, now);
  return Math.max(0, end - session.startedAt - session.totalPausedMs);
}

export function countCompletedSets(session: WorkoutSession): number {
  return session.logs.reduce((total, log) => total + log.sets.filter((set) => set.completed).length, 0);
}

/**
 * Stima delle calorie: MET × peso corporeo (kg) × ore, con MET 5 (lavoro
 * aerobico moderato / circuito con pesi). È un ordine di grandezza, non una misura.
 */
const WORKOUT_MET = 5;
export function estimateCalories(durationSeconds: number, bodyWeightKg: number): number {
  return Math.round(WORKOUT_MET * bodyWeightKg * (durationSeconds / 3600));
}

/** Voce dello storico per una sessione conclusa. */
export function buildHistoryItem(session: WorkoutSession, now: number, bodyWeightKg: number): WorkoutHistoryItem {
  const durationSeconds = Math.round(getTotalElapsedMs(session, now) / 1000);
  let totalVolumeKg = 0;
  let exercisesCompletedCount = 0;
  session.logs.forEach((log) => {
    const completedSets = log.sets.filter((set) => set.completed);
    if (completedSets.length > 0) exercisesCompletedCount += 1;
    completedSets.forEach((set) => {
      totalVolumeKg += set.completedReps * set.weightKg;
    });
  });
  const endMs = session.phase === 'finished' ? session.phaseStartedAt : now;
  return {
    id: 'wkt_' + endMs,
    routineTitle: session.routine.title,
    startTime: new Date(session.startedAt).toISOString(),
    endTime: new Date(endMs).toISOString(),
    durationSeconds,
    estimatedCalories: estimateCalories(durationSeconds, bodyWeightKg),
    totalVolumeKg,
    exercisesCompletedCount,
    logs: session.logs
  };
}

// --- Ripristino dopo la chiusura dell'app ---

export interface SavedWorkoutSession {
  session: WorkoutSession;
  /** Ultimo istante in cui l'app era sicuramente viva. */
  savedAt: number;
}

/**
 * Sessione da riprendere all'avvio dell'app, o null se non c'è, è troppo vecchia
 * o non è valida. Se l'app è rimasta chiusa (non un semplice ricaricamento) la
 * sessione torna in pausa all'ultimo istante noto: il tempo passato ad app chiusa
 * non viene contato.
 */
export function restoreSession(saved: SavedWorkoutSession | null, now: number): WorkoutSession | null {
  if (!saved || !isValidSession(saved.session) || typeof saved.savedAt !== 'number') return null;
  const { session, savedAt } = saved;
  if (session.phase === 'finished' || now - savedAt > MAX_RESTORE_AGE_MS) return null;
  if (now - savedAt > RELOAD_GAP_MS) return pause(session, savedAt);
  return session;
}

function isValidSession(session: WorkoutSession | undefined): session is WorkoutSession {
  if (!session || !Array.isArray(session.routine?.exercises) || !Array.isArray(session.logs)) return false;
  const stepCount = buildSteps(session.routine).length;
  return (
    session.logs.length === session.routine.exercises.length &&
    typeof session.stepIndex === 'number' &&
    session.stepIndex >= 0 &&
    session.stepIndex < stepCount &&
    typeof session.phaseStartedAt === 'number' &&
    typeof session.startedAt === 'number' &&
    typeof session.totalPausedMs === 'number'
  );
}
