import React, { useEffect, useRef, useState } from 'react';
import {
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Info,
  Pause,
  Play,
  Plus,
  SkipForward,
  Trophy,
  Volume2,
  VolumeX,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Exercise, WorkoutHistoryItem } from '../types';
import { EXERCISES } from '../data/exercises';
import { ExerciseIllustration } from './ExerciseIllustration';
import { ExerciseDetailModal } from './ExerciseDetailModal';
import { ConfirmModal } from './ConfirmModal';
import { MuscleMap } from './muscleMap/MuscleMap';
import { useWorkoutSession } from '../hooks/useWorkoutSession';
import { useScreenWakeLock } from '../hooks/useScreenWakeLock';
import { playSuccessChime } from '../utils/audio';
import { clearSavedWorkoutSession, getUserStats, saveWorkoutHistory } from '../utils/storage';
import { formatClock, formatDuration, toCountdownSeconds } from '../utils/time';
import {
  SessionPhase,
  WorkoutSession,
  buildHistoryItem,
  countCompletedSets,
  getPhaseElapsedMs,
  getPhaseRemainingMs,
  getTotalElapsedMs
} from '../utils/workoutSession';

interface Props {
  /** Sessione nuova (createSession) o ripristinata dopo la chiusura dell'app (restoreSession). */
  initialSession: WorkoutSession;
  onFinish: () => void;
  onCancel: () => void;
}

/** Fasi mostrate nel riquadro principale ('finished' apre il riepilogo). */
type VisiblePhase = Exclude<SessionPhase, 'finished'>;

const PHASE_LOOK: Record<VisiblePhase, { label: string; cardClass: string }> = {
  prepare: { label: 'Preparati', cardClass: 'bg-surface-container-highest text-on-surface' },
  work: { label: 'Esecuzione', cardClass: 'bg-primary-container text-on-primary-container' },
  rest: { label: 'Recupero', cardClass: 'bg-secondary-container text-on-secondary-container' }
};

const PREPARE_OPTIONS_SEC = [0, 5, 10, 15, 20];
/** Peso corporeo usato per la stima delle calorie se l'utente non l'ha indicato in "Guida & Dati". */
const FALLBACK_BODY_WEIGHT_KG = 80;

function findExercise(exerciseId: string): Exercise {
  return EXERCISES.find((exercise) => exercise.id === exerciseId) || EXERCISES[0];
}

/** "12" → "12 rip"; i testi che dicono già cosa fare ("10 per gamba", "max") restano uguali. */
function formatRepsTarget(reps: string): string {
  return /^[\d\s-]+$/.test(reps) ? `${reps} rip` : reps;
}

/**
 * Allenamento guidato a tutto schermo. In alto il riquadro della fase (pausa di
 * avvio, esecuzione, recupero) con il tempo e l'esercizio da fare; sotto
 * animazione, serie e muscoli coinvolti. Il tempo e le regole stanno in
 * useWorkoutSession / utils/workoutSession.ts: qui c'è solo l'interfaccia.
 */
export const ActiveWorkoutView: React.FC<Props> = ({ initialSession, onFinish, onCancel }) => {
  const workout = useWorkoutSession(initialSession);
  const { session, steps, now, soundEnabled } = workout;

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'cancel' | 'finish' | null>(null);
  const [summary, setSummary] = useState<WorkoutHistoryItem | null>(null);

  const isFinished = session.phase === 'finished';
  const isPaused = session.pausedAt !== null;
  useScreenWakeLock(!isFinished && !isPaused);

  // La pagina eredita lo scorrimento dell'elenco schede: si riparte dall'alto, dove c'è il tempo.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fine allenamento (ultima serie o "Termina"): salva una sola volta e mostra il riepilogo.
  const hasSavedRef = useRef(false);
  useEffect(() => {
    if (!isFinished || hasSavedRef.current) return;
    hasSavedRef.current = true;
    const bodyWeightKg = getUserStats().currentWeightKg || FALLBACK_BODY_WEIGHT_KG;
    const historyItem = buildHistoryItem(session, Date.now(), bodyWeightKg);
    saveWorkoutHistory(historyItem);
    setSummary(historyItem);
    if (soundEnabled) playSuccessChime();
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
  }, [isFinished, session, soundEnabled]);

  const step = steps[session.stepIndex];
  const nextStep = session.stepIndex < steps.length - 1 ? steps[session.stepIndex + 1] : null;
  // Durante il recupero conta quello che viene dopo: mostriamo già l'esercizio successivo.
  const shownStep = session.phase === 'rest' && nextStep ? nextStep : step;
  const shownRoutineExercise = session.routine.exercises[shownStep.exerciseIndex];
  const shownExercise = findExercise(shownRoutineExercise.exerciseId);
  const shownLog = session.logs[shownStep.exerciseIndex];
  const currentRoutineExercise = session.routine.exercises[step.exerciseIndex];

  // Peso della serie mostrata (proposto all'avvio, modificabile nell'elenco serie).
  const shownWeightKg = shownLog.sets[shownStep.setIndex].weightKg;
  const shownWeightText =
    shownStep.workSec === null && shownWeightKg > 0
      ? `${shownWeightKg} kg${shownExercise.startingWeight ? ` ${shownExercise.startingWeight.note}` : ''}`
      : null;

  const phase: VisiblePhase = isFinished ? 'work' : (session.phase as VisiblePhase);
  const look = PHASE_LOOK[phase];

  const remainingMs = getPhaseRemainingMs(session, now);
  const isCountdown = remainingMs !== null;
  const shownSeconds = isCountdown ? toCountdownSeconds(remainingMs) : Math.floor(getPhaseElapsedMs(session, now) / 1000);
  const totalSeconds = Math.floor(getTotalElapsedMs(session, now) / 1000);
  const isEnding = isCountdown && shownSeconds <= 3 && !isPaused;

  const completedSets = countCompletedSets(session);
  const progressPercent = (completedSets / steps.length) * 100;

  // I minuti in più hanno senso solo nelle esecuzioni lunghe (cardio); altrove 15 secondi.
  const extraTimeSec = phase === 'work' && step.workSec !== null && step.workSec >= 300 ? 60 : 15;

  let phaseHint: string;
  if (isPaused) phaseHint = 'In pausa';
  else if (phase === 'prepare') phaseHint = 'Mettiti in posizione';
  else if (phase === 'rest') phaseHint = 'Respira e bevi';
  else if (step.workSec !== null) phaseHint = `Obiettivo ${formatDuration(step.workSec)}`;
  else phaseHint = `Obiettivo ${formatRepsTarget(currentRoutineExercise.reps)}`;

  let primaryLabel: string;
  if (phase === 'prepare') primaryLabel = 'Parti ora';
  else if (phase === 'rest') primaryLabel = 'Salta recupero';
  else if (step.workSec !== null) primaryLabel = 'Concludi ora';
  else primaryLabel = 'Serie fatta';

  // Cosa succede dopo la fase corrente (riga sotto il riquadro).
  let upNext: string;
  if (phase === 'rest') {
    upNext = `Completata: serie ${step.setIndex + 1} di ${step.totalSets} · ${findExercise(currentRoutineExercise.exerciseId).name}`;
  } else if (!nextStep) {
    upNext = 'Ultima serie: poi hai finito!';
  } else {
    const restText = step.restSec > 0 ? `recupero ${formatDuration(step.restSec)}, poi ` : '';
    const nextText =
      nextStep.exerciseIndex === step.exerciseIndex
        ? `serie ${nextStep.setIndex + 1} di ${nextStep.totalSets}`
        : findExercise(session.routine.exercises[nextStep.exerciseIndex].exerciseId).name;
    upNext = `Poi: ${restText}${nextText}`;
  }

  // Le tre fasi con la durata prevista; quella attiva è evidenziata. L'esecuzione è
  // quella dell'esercizio mostrato: durante il recupero è già la prossima da fare.
  const phaseTiles: { id: VisiblePhase; label: string; value: string }[] = [
    { id: 'prepare', label: 'Avvio', value: session.prepareSec > 0 ? `${session.prepareSec}s` : '—' },
    {
      id: 'work',
      label: 'Esecuzione',
      value:
        shownStep.workSec !== null ? formatDuration(shownStep.workSec) : formatRepsTarget(shownRoutineExercise.reps)
    },
    { id: 'rest', label: 'Recupero', value: step.restSec > 0 ? formatDuration(step.restSec) : '—' }
  ];

  const leaveWorkout = () => {
    clearSavedWorkoutSession();
    onCancel();
  };

  const requestCancel = () => {
    // Senza serie fatte non c'è niente da perdere: si esce subito.
    if (completedSets === 0) leaveWorkout();
    else setConfirmAction('cancel');
  };

  const confirmFinish = () => {
    setConfirmAction(null);
    // Un allenamento senza serie completate non va nello storico.
    if (completedSets === 0) leaveWorkout();
    else workout.finishNow();
  };

  const lastExerciseIndex = session.routine.exercises.length - 1;

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col pb-28">
      {/* Top app bar: annulla, tempo totale, suono, termina */}
      <div className="sticky top-0 z-30 bg-surface px-2 h-16 flex items-center justify-between gap-1">
        <button onClick={requestCancel} className="icon-btn" aria-label="Abbandona allenamento" title="Abbandona">
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center leading-tight">
          <span className="text-xs text-on-surface-variant">Tempo totale</span>
          <span className="text-lg font-medium tabular-nums">{formatClock(totalSeconds)}</span>
        </div>

        <div className="flex items-center">
          <button
            onClick={workout.toggleSound}
            className="icon-btn"
            aria-label={soundEnabled ? 'Disattiva suono' : 'Attiva suono'}
            title={soundEnabled ? 'Suono attivo' : 'Suono disattivato'}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-primary" /> : <VolumeX className="w-5 h-5" />}
          </button>
          <button onClick={() => setConfirmAction('finish')} className="btn-text">
            Termina
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto w-full px-4 space-y-4">
        {/* Titolo scheda e avanzamento */}
        <div>
          <div className="flex items-center justify-between text-sm text-on-surface-variant mb-2 gap-2">
            <span className="truncate">{session.routine.title}</span>
            <span className="flex-shrink-0 font-medium text-on-surface">
              Esercizio {step.exerciseIndex + 1} / {session.routine.exercises.length}
            </span>
          </div>
          <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
            <div className="bg-primary h-full rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        {/* Riquadro della fase: cosa sto facendo, per quanto, quale esercizio */}
        <div className={`rounded-3xl p-5 text-center transition-colors ${look.cardClass}`}>
          <div className="flex items-center justify-between text-sm font-semibold">
            <span className="uppercase tracking-wide">{look.label}</span>
            <span>
              Serie {shownStep.setIndex + 1} di {shownStep.totalSets}
            </span>
          </div>

          <div
            className={`text-8xl font-normal tabular-nums leading-none mt-4 ${isEnding ? 'text-error' : ''} ${isPaused ? 'opacity-50' : ''}`}
            role="timer"
          >
            {formatClock(shownSeconds)}
          </div>
          <p className="text-sm font-medium opacity-80 mt-2">{phaseHint}</p>

          <p className="text-xs opacity-80 mt-4">
            {phase === 'rest' ? 'Prossimo esercizio' : 'Esercizio'}
            {shownRoutineExercise.section && ` · ${shownRoutineExercise.section}`}
          </p>
          <h2 className="text-2xl font-semibold leading-snug">{shownExercise.name}</h2>
          {shownWeightText && <p className="text-base font-semibold mt-1">🏋️ {shownWeightText}</p>}

          <div className="grid grid-cols-3 gap-2 mt-4">
            {phaseTiles.map((tile) => (
              <div
                key={tile.id}
                className={`rounded-xl px-1 py-2 ${tile.id === phase ? 'bg-surface text-on-surface' : 'bg-surface/30'}`}
                aria-current={tile.id === phase ? 'step' : undefined}
              >
                <p className="text-xs opacity-80">{tile.label}</p>
                <p className="text-sm font-semibold truncate">{tile.value}</p>
              </div>
            ))}
          </div>

          {isCountdown && (
            <button onClick={() => workout.addTime(extraTimeSec)} className="btn-text text-current mt-3">
              <Plus className="w-4 h-4" />
              {formatDuration(extraTimeSec)}
            </button>
          )}
        </div>

        <p className="text-sm text-on-surface-variant text-center">{upNext}</p>

        {shownRoutineExercise.notes && (
          <p className="text-sm bg-surface-container text-on-surface rounded-xl p-3">💡 {shownRoutineExercise.notes}</p>
        )}

        {/* Come si fa: animazione */}
        <ExerciseIllustration
          key={shownExercise.id}
          exercise={shownExercise}
          figureHeightClass="h-44"
          className="w-full"
        />

        {/* Serie dell'esercizio mostrato; kg e ripetizioni solo se l'esercizio è a ripetizioni */}
        <section>
          <h3 className="text-base font-semibold text-on-surface mb-2">Serie</h3>
          {shownStep.workSec === null && shownExercise.startingWeight && (
            <p className="text-sm text-on-surface-variant mb-2">
              Il peso proposto è l'ultimo che hai usato (la prima volta: {shownExercise.startingWeight.kg} kg{' '}
              {shownExercise.startingWeight.note}). Se chiudi tutte le serie con 2-3 ripetizioni di margine, la
              prossima volta aumenta di 1-2 kg; se non arrivi alle ripetizioni, scendi.
            </p>
          )}
          <div className="space-y-2">
            {shownLog.sets.map((set, setIndex) => {
              const isCurrentSet = setIndex === shownStep.setIndex;
              return (
                <div
                  key={setIndex}
                  className={`flex items-center gap-3 min-h-14 p-2 pl-3 rounded-2xl ${
                    set.completed ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container'
                  } ${isCurrentSet ? 'outline outline-2 outline-primary' : ''}`}
                >
                  <span className="w-8 h-8 flex-shrink-0 rounded-full bg-surface/40 flex items-center justify-center text-sm font-semibold">
                    {set.completed ? <Check className="w-4 h-4 stroke-[3]" /> : set.setNumber}
                  </span>

                  {shownStep.workSec !== null ? (
                    <span className="text-sm flex-1">
                      {set.completed && set.durationSeconds !== undefined
                        ? `Fatto in ${formatClock(set.durationSeconds)}`
                        : `Obiettivo ${formatDuration(shownStep.workSec)}`}
                    </span>
                  ) : (
                    <>
                      <label className="flex items-center gap-1.5">
                        <input
                          type="number"
                          inputMode="decimal"
                          min="0"
                          value={set.weightKg || ''}
                          onChange={(event) =>
                            workout.updateSet(shownStep.exerciseIndex, setIndex, {
                              weightKg: Math.max(0, parseFloat(event.target.value) || 0)
                            })
                          }
                          placeholder="0"
                          className="text-field w-16 h-10 px-1 text-center font-semibold"
                          aria-label={`Peso serie ${set.setNumber}`}
                        />
                        <span className="text-xs opacity-80">kg</span>
                      </label>
                      <label className="flex items-center gap-1.5">
                        <input
                          type="number"
                          inputMode="numeric"
                          min="0"
                          value={set.completedReps || ''}
                          onChange={(event) =>
                            workout.updateSet(shownStep.exerciseIndex, setIndex, {
                              completedReps: Math.max(0, parseInt(event.target.value, 10) || 0)
                            })
                          }
                          placeholder="0"
                          className="text-field w-16 h-10 px-1 text-center font-semibold"
                          aria-label={`Ripetizioni serie ${set.setNumber}`}
                        />
                        <span className="text-xs opacity-80">rip</span>
                      </label>
                      {set.completed && set.durationSeconds !== undefined && (
                        <span className="text-xs opacity-80 ml-auto pr-2 tabular-nums">{formatClock(set.durationSeconds)}</span>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Muscoli coinvolti e guida completa */}
        <section>
          <h3 className="text-base font-semibold text-on-surface mb-2">Muscoli coinvolti</h3>
          <MuscleMap
            primary={shownExercise.primaryMuscles}
            secondary={shownExercise.secondaryMuscles}
            className="bg-surface-container rounded-2xl p-3 mb-3"
          />
          <div className="flex flex-wrap gap-2 mb-3">
            {shownExercise.targetMuscles.map((muscle) => (
              <span key={muscle} className="chip h-7 text-xs">
                {muscle}
              </span>
            ))}
          </div>
          <button onClick={() => setShowDetailModal(true)} className="btn-tonal w-full">
            <Info className="w-4 h-4" />
            Guida completa: esecuzione ed errori da evitare
          </button>
        </section>

        {/* Durata della pausa di avvio */}
        <section>
          <h3 className="text-base font-semibold text-on-surface">Pausa di avvio</h3>
          <p className="text-sm text-on-surface-variant mb-2">
            Conto alla rovescia prima di ogni esercizio, per metterti in posizione.
          </p>
          <div className="flex flex-wrap gap-2">
            {PREPARE_OPTIONS_SEC.map((seconds) => {
              const isSelected = session.prepareSec === seconds;
              return (
                <button
                  key={seconds}
                  onClick={() => workout.changePrepareSec(seconds)}
                  aria-pressed={isSelected}
                  className={isSelected ? 'chip-selected' : 'chip'}
                >
                  {isSelected && <Check className="w-4 h-4" />}
                  {seconds === 0 ? 'No' : `${seconds}s`}
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {/* Barra inferiore: esercizio precedente, pausa, azione della fase, esercizio successivo */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-surface-container pb-safe">
        <div className="max-w-md mx-auto px-3 py-3 flex items-center gap-2">
          <button
            onClick={() => workout.goToExercise(step.exerciseIndex - 1)}
            disabled={step.exerciseIndex === 0}
            className="icon-btn w-12 h-12 disabled:opacity-40"
            aria-label="Esercizio precedente"
            title="Esercizio precedente"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={workout.togglePause}
            className="btn-tonal w-14 h-14 p-0"
            aria-label={isPaused ? 'Riprendi' : 'Pausa'}
            title={isPaused ? 'Riprendi' : 'Pausa'}
          >
            {isPaused ? <Play className="w-6 h-6 fill-current" /> : <Pause className="w-6 h-6" />}
          </button>

          <button onClick={workout.finishPhase} className="btn-filled h-14 flex-1 text-base">
            {phase === 'work' ? <CheckCircle2 className="w-5 h-5" /> : <SkipForward className="w-5 h-5" />}
            {primaryLabel}
          </button>

          <button
            onClick={() => workout.goToExercise(step.exerciseIndex + 1)}
            disabled={step.exerciseIndex >= lastExerciseIndex}
            className="icon-btn w-12 h-12 disabled:opacity-40"
            aria-label="Esercizio successivo"
            title="Esercizio successivo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {showDetailModal && <ExerciseDetailModal exercise={shownExercise} onClose={() => setShowDetailModal(false)} />}

      {confirmAction === 'cancel' && (
        <ConfirmModal
          title="Abbandonare l'allenamento?"
          message="Le serie fatte finora non verranno salvate nello storico. Per salvarle usa «Termina»."
          confirmLabel="Abbandona"
          onConfirm={leaveWorkout}
          onCancel={() => setConfirmAction(null)}
        />
      )}

      {confirmAction === 'finish' && (
        <ConfirmModal
          title="Terminare l'allenamento?"
          message={
            completedSets === 0
              ? 'Non hai ancora completato nessuna serie: l\'allenamento non verrà salvato.'
              : `Hai completato ${completedSets} serie su ${steps.length}. L'allenamento verrà salvato nello storico.`
          }
          confirmLabel="Termina"
          onConfirm={confirmFinish}
          onCancel={() => setConfirmAction(null)}
        />
      )}

      {/* Riepilogo finale (dialog) */}
      {summary && (
        <div className="scrim flex items-center justify-center p-6">
          <div className="dialog w-full max-w-sm text-center">
            <div className="w-16 h-16 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-normal text-on-surface mb-1">Grande lavoro! 🔥</h2>
            <p className="text-sm text-on-surface-variant mb-6">Allenamento completato e salvato.</p>

            <div className="grid grid-cols-2 gap-2 mb-6">
              {[
                { label: 'Durata', value: formatClock(summary.durationSeconds) },
                { label: 'Calorie stimate', value: `~${summary.estimatedCalories}` },
                { label: 'Serie completate', value: `${completedSets} / ${steps.length}` },
                { label: 'Volume', value: `${summary.totalVolumeKg} kg` }
              ].map((cell) => (
                <div key={cell.label} className="bg-surface-container-highest rounded-xl p-3">
                  <p className="text-lg font-semibold text-on-surface tabular-nums">{cell.value}</p>
                  <span className="text-xs text-on-surface-variant">{cell.label}</span>
                </div>
              ))}
            </div>

            <button onClick={onFinish} className="btn-filled w-full h-12">
              Vai ai progressi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
