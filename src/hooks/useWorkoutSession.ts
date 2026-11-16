import { useEffect, useMemo, useRef, useState } from 'react';
import { WorkoutSetRecord } from '../types';
import { playCountdownBeep, playRestCompleteSound, playStartSound } from '../utils/audio';
import { clearSavedWorkoutSession, getWorkoutPrefs, saveWorkoutPrefs, saveWorkoutSession } from '../utils/storage';
import { toCountdownSeconds } from '../utils/time';
import * as sessionLogic from '../utils/workoutSession';
import { SessionStep, WorkoutSession } from '../utils/workoutSession';

/**
 * Collega la logica pura di utils/workoutSession.ts a React: fa scorrere il
 * tempo, emette i suoni, salva la sessione. Tutte le regole (fasi, pausa,
 * recupero dopo lo schermo spento) stanno nel modulo puro, non qui.
 */

/** Ogni quanto aggiorniamo display e controlliamo le scadenze. */
const TICK_MS = 250;
/** Ogni quanto riscriviamo `savedAt` mentre non succede nulla (serve al ripristino). */
const HEARTBEAT_SAVE_MS = 10000;

export interface WorkoutSessionControls {
  session: WorkoutSession;
  steps: SessionStep[];
  /** Istante dell'ultimo aggiornamento, da passare alle funzioni di lettura della sessione. */
  now: number;
  soundEnabled: boolean;
  toggleSound: () => void;
  togglePause: () => void;
  /** "Parti ora" / "Serie fatta" / "Salta recupero", secondo la fase. */
  finishPhase: () => void;
  addTime: (seconds: number) => void;
  goToExercise: (exerciseIndex: number) => void;
  finishNow: () => void;
  changePrepareSec: (prepareSec: number) => void;
  updateSet: (exerciseIndex: number, setIndex: number, changes: Partial<WorkoutSetRecord>) => void;
}

export function useWorkoutSession(initialSession: WorkoutSession): WorkoutSessionControls {
  const [session, setSession] = useState(initialSession);
  const [now, setNow] = useState(() => Date.now());
  const [soundEnabled, setSoundEnabled] = useState(() => getWorkoutPrefs().soundEnabled);

  const steps = useMemo(() => sessionLogic.buildSteps(session.routine), [session.routine]);
  const isTicking = session.pausedAt === null && session.phase !== 'finished';

  // Sempre l'ultima sessione, per i salvataggi fatti fuori dal render (tick, pagina nascosta).
  const sessionRef = useRef(session);
  sessionRef.current = session;
  const lastSavedAtRef = useRef(0);

  const persist = () => {
    lastSavedAtRef.current = Date.now();
    if (sessionRef.current.phase === 'finished') {
      clearSavedWorkoutSession();
    } else {
      saveWorkoutSession(sessionRef.current);
    }
  };

  useEffect(persist, [session]);

  // Android può chiudere l'app in background senza preavviso: salviamo quando viene nascosta.
  useEffect(() => {
    const saveWhenHidden = () => {
      if (document.visibilityState === 'hidden') persist();
    };
    document.addEventListener('visibilitychange', saveWhenHidden);
    window.addEventListener('pagehide', persist);
    return () => {
      document.removeEventListener('visibilitychange', saveWhenHidden);
      window.removeEventListener('pagehide', persist);
    };
  }, []);

  // Tick: aggiorna `now` (per il display) e chiude le fasi scadute.
  useEffect(() => {
    if (!isTicking) return;
    const tick = () => {
      const tickNow = Date.now();
      setNow(tickNow);
      setSession((prev) => sessionLogic.advance(prev, tickNow));
      if (tickNow - lastSavedAtRef.current > HEARTBEAT_SAVE_MS) persist();
    };
    tick();
    const interval = setInterval(tick, TICK_MS);
    // Al ritorno in primo piano non aspettiamo il prossimo tick (in background sono rallentati).
    document.addEventListener('visibilitychange', tick);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', tick);
    };
  }, [isTicking]);

  // Beep 3-2-1 prima della fine di ogni fase a tempo.
  const lastBeepKeyRef = useRef('');
  useEffect(() => {
    if (!isTicking || !soundEnabled) return;
    const remainingMs = sessionLogic.getPhaseRemainingMs(session, now);
    if (remainingMs === null) return;
    const seconds = toCountdownSeconds(remainingMs);
    const beepKey = `${session.stepIndex}:${session.phase}:${seconds}`;
    if (seconds >= 1 && seconds <= 3 && lastBeepKeyRef.current !== beepKey) {
      lastBeepKeyRef.current = beepKey;
      playCountdownBeep(600, 0.1);
    }
  }, [session, now, isTicking, soundEnabled]);

  // Suono al cambio di fase: "via" quando parte l'esecuzione, "fine" quando parte il recupero.
  // La fine dell'allenamento la festeggia la schermata.
  const previousPhaseRef = useRef({ phase: session.phase, stepIndex: session.stepIndex });
  useEffect(() => {
    const previous = previousPhaseRef.current;
    previousPhaseRef.current = { phase: session.phase, stepIndex: session.stepIndex };
    const hasChanged = previous.phase !== session.phase || previous.stepIndex !== session.stepIndex;
    // In pausa = fase scaduta a schermo spento: niente suono, l'utente la riavvia a mano.
    if (!hasChanged || !soundEnabled || session.pausedAt !== null) return;
    if (session.phase === 'work') playStartSound();
    if (session.phase === 'rest') playRestCompleteSound();
  }, [session.phase, session.stepIndex, session.pausedAt, soundEnabled]);

  /** Applica un'azione dell'utente all'istante corrente. */
  const apply = (action: (current: WorkoutSession, actionNow: number) => WorkoutSession) => {
    const actionNow = Date.now();
    // `now` va aggiornato insieme alla sessione: dopo una pausa gli istanti della
    // fase vengono spostati e con un `now` vecchio il display mostrerebbe un tempo sbagliato.
    setNow(actionNow);
    setSession((prev) => action(prev, actionNow));
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    saveWorkoutPrefs({ ...getWorkoutPrefs(), soundEnabled: next });
  };

  const changePrepareSec = (prepareSec: number) => {
    saveWorkoutPrefs({ ...getWorkoutPrefs(), prepareSec });
    apply((current) => sessionLogic.setPrepareSec(current, prepareSec));
  };

  return {
    session,
    steps,
    now,
    soundEnabled,
    toggleSound,
    togglePause: () =>
      apply((current, actionNow) =>
        current.pausedAt === null ? sessionLogic.pause(current, actionNow) : sessionLogic.resume(current, actionNow)
      ),
    finishPhase: () => apply(sessionLogic.finishPhase),
    addTime: (seconds) => apply((current) => sessionLogic.addTime(current, seconds)),
    goToExercise: (exerciseIndex) =>
      apply((current, actionNow) => sessionLogic.goToExercise(current, exerciseIndex, actionNow)),
    finishNow: () => apply(sessionLogic.finishNow),
    changePrepareSec,
    updateSet: (exerciseIndex, setIndex, changes) =>
      apply((current) => sessionLogic.updateSetRecord(current, exerciseIndex, setIndex, changes))
  };
}
