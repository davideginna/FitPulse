import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Clock, 
  Info, 
  CheckCircle2, 
  X,
  Trophy,
  Dumbbell
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Routine, Exercise, WorkoutSetRecord, ExerciseLog, WorkoutHistoryItem } from '../types';
import { EXERCISES } from '../data/exercises';
import { ExerciseIllustration } from './ExerciseIllustration';
import { RestTimerModal } from './RestTimerModal';
import { ExerciseDetailModal } from './ExerciseDetailModal';
import { playSuccessChime } from '../utils/audio';
import { saveWorkoutHistory } from '../utils/storage';

interface Props {
  routine: Routine;
  onFinish: () => void;
  onCancel: () => void;
}

export const ActiveWorkoutView: React.FC<Props> = ({
  routine,
  onFinish,
  onCancel
}) => {
  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [activeTimerRest, setActiveTimerRest] = useState<{
    show: boolean;
    seconds: number;
    setNum: number;
    totalSets: number;
  }>({
    show: false,
    seconds: 60,
    setNum: 1,
    totalSets: 3
  });
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [completedWorkoutItem, setCompletedWorkoutItem] = useState<WorkoutHistoryItem | null>(null);

  // Initialize logs state for each exercise in the routine
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLog[]>(() => {
    return routine.exercises.map((item) => {
      const sets: WorkoutSetRecord[] = Array.from({ length: item.sets }, (_, idx) => ({
        setNumber: idx + 1,
        targetReps: item.reps,
        completedReps: parseInt(item.reps) || 12,
        weightKg: 0,
        completed: false
      }));
      return {
        exerciseId: item.exerciseId,
        sets
      };
    });
  });

  // Elapsed workout timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentRoutineEx = routine.exercises[currentExIndex];
  const currentExerciseData: Exercise = 
    EXERCISES.find((e) => e.id === currentRoutineEx?.exerciseId) || EXERCISES[0];

  const currentExLog = exerciseLogs[currentExIndex];

  const handleSetToggle = (setIndex: number) => {
    const updatedLogs = [...exerciseLogs];
    const targetSet = updatedLogs[currentExIndex].sets[setIndex];
    const isNowCompleted = !targetSet.completed;
    targetSet.completed = isNowCompleted;

    setExerciseLogs(updatedLogs);

    // If just marked completed, trigger rest timer
    if (isNowCompleted) {
      const restSec = currentRoutineEx.restSeconds || currentExerciseData.recommendedRestSeconds || 60;
      setActiveTimerRest({
        show: true,
        seconds: restSec,
        setNum: setIndex + 1,
        totalSets: currentExLog.sets.length
      });
    }
  };

  const handleRepsChange = (setIndex: number, val: number) => {
    const updated = [...exerciseLogs];
    updated[currentExIndex].sets[setIndex].completedReps = Math.max(0, val);
    setExerciseLogs(updated);
  };

  const handleWeightChange = (setIndex: number, val: number) => {
    const updated = [...exerciseLogs];
    updated[currentExIndex].sets[setIndex].weightKg = Math.max(0, val);
    setExerciseLogs(updated);
  };

  const formatElapsed = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleCompleteWorkout = () => {
    // Calculate stats
    let totalVolume = 0;
    let completedSetsCount = 0;
    exerciseLogs.forEach((log) => {
      log.sets.forEach((s) => {
        if (s.completed) {
          completedSetsCount++;
          totalVolume += s.completedReps * s.weightKg;
        }
      });
    });

    // Approximate calories: ~7-8 kcal/min for circuit/metabolic training
    const estimatedCals = Math.max(80, Math.round((elapsedSeconds / 60) * 7.5));

    const historyItem: WorkoutHistoryItem = {
      id: 'wkt_' + Date.now(),
      routineTitle: routine.title,
      startTime: new Date(Date.now() - elapsedSeconds * 1000).toISOString(),
      endTime: new Date().toISOString(),
      durationSeconds: elapsedSeconds,
      estimatedCalories: estimatedCals,
      totalVolumeKg: totalVolume,
      exercisesCompletedCount: routine.exercises.length,
      logs: exerciseLogs
    };

    saveWorkoutHistory(historyItem);
    setCompletedWorkoutItem(historyItem);
    setShowFinishModal(true);

    // Play celebration audio and shoot confetti!
    playSuccessChime();
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const nextExName = 
    currentExIndex < routine.exercises.length - 1 
      ? EXERCISES.find(e => e.id === routine.exercises[currentExIndex + 1]?.exerciseId)?.name 
      : undefined;

  const progressPercent = ((currentExIndex + 1) / routine.exercises.length) * 100;

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col pb-28">
      {/* Top app bar: annulla, tempo trascorso, termina */}
      <div className="sticky top-0 z-30 bg-surface px-2 h-16 flex items-center justify-between gap-2">
        <button onClick={onCancel} className="icon-btn" aria-label="Annulla allenamento" title="Annulla">
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-2 text-on-surface">
          <Clock className="w-4 h-4 text-primary" />
          <span className="text-lg font-medium tabular-nums">{formatElapsed(elapsedSeconds)}</span>
        </div>

        <button onClick={handleCompleteWorkout} className="btn-text">
          Termina
        </button>
      </div>

      <div className="max-w-md mx-auto w-full">
        {/* Titolo scheda e avanzamento */}
        <div className="px-4 pb-3">
          <div className="flex items-center justify-between text-sm text-on-surface-variant mb-2 gap-2">
            <span className="truncate">{routine.title}</span>
            <span className="flex-shrink-0 font-medium text-on-surface">
              {currentExIndex + 1} / {routine.exercises.length}
            </span>
          </div>
          {/* Indicatore di avanzamento lineare M3 */}
          <div className="w-full bg-secondary-container h-1 rounded-full overflow-hidden">
            <div className="bg-primary h-full rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        {/* Esercizio corrente */}
        <div className="px-4">
          <div className="card p-4">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="min-w-0">
                <p className="text-xs text-on-surface-variant">
                  {currentExerciseData.category} · {currentExerciseData.equipment}
                </p>
                <h2 className="text-xl font-semibold text-on-surface leading-snug">{currentExerciseData.name}</h2>
              </div>
              <button onClick={() => setShowDetailModal(true)} className="btn-tonal min-h-9 px-3 text-xs flex-shrink-0">
                <Info className="w-4 h-4" />
                Guida
              </button>
            </div>

            <ExerciseIllustration exercise={currentExerciseData} figureHeightClass="h-44" className="w-full mb-3" />

            <div className="flex items-center justify-between text-sm text-on-surface-variant">
              <span>
                Obiettivo <strong className="text-on-surface font-semibold">{currentRoutineEx.reps} rip</strong>
              </span>
              <span>
                Recupero <strong className="text-on-surface font-semibold">{currentRoutineEx.restSeconds}s</strong>
              </span>
            </div>

            {currentRoutineEx.notes && (
              <p className="text-sm bg-primary-container text-on-primary-container rounded-xl p-3 mt-3">💡 {currentRoutineEx.notes}</p>
            )}
          </div>
        </div>

        {/* Registro serie */}
        <div className="px-4 mt-5">
          <h3 className="text-base font-semibold text-on-surface mb-2 flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-primary" /> Serie
          </h3>

          <div className="space-y-2">
            {currentExLog?.sets.map((set, sIdx) => (
              <div
                key={sIdx}
                className={`flex items-center justify-between gap-2 p-2 pl-3 rounded-2xl transition-colors ${
                  set.completed ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container'
                }`}
              >
                <span className="w-8 h-8 flex-shrink-0 rounded-full bg-surface/40 flex items-center justify-center text-sm font-semibold">
                  {set.setNumber}
                </span>

                <label className="flex items-center gap-1.5">
                  <input
                    type="number"
                    inputMode="decimal"
                    value={set.weightKg || ''}
                    onChange={(e) => handleWeightChange(sIdx, parseFloat(e.target.value) || 0)}
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
                    value={set.completedReps || ''}
                    onChange={(e) => handleRepsChange(sIdx, parseInt(e.target.value) || 0)}
                    placeholder="12"
                    className="text-field w-16 h-10 px-1 text-center font-semibold"
                    aria-label={`Ripetizioni serie ${set.setNumber}`}
                  />
                  <span className="text-xs opacity-80">rip</span>
                </label>

                <button
                  onClick={() => handleSetToggle(sIdx)}
                  className={`w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center transition active:scale-90 ${
                    set.completed ? 'bg-primary text-on-primary' : 'border border-outline text-on-surface-variant hover:bg-on-surface/8'
                  }`}
                  aria-pressed={set.completed}
                  aria-label={`Serie ${set.setNumber} completata`}
                >
                  <Check className="w-6 h-6 stroke-[2.5]" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Barra inferiore: esercizio precedente / successivo */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-surface-container pb-safe">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <button
            onClick={() => setCurrentExIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentExIndex === 0}
            className="btn-outlined h-12"
          >
            <ChevronLeft className="w-5 h-5" />
            Indietro
          </button>

          {currentExIndex < routine.exercises.length - 1 ? (
            <button onClick={() => setCurrentExIndex((prev) => prev + 1)} className="btn-filled h-12 flex-1">
              Successivo
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button onClick={handleCompleteWorkout} className="btn-filled h-12 flex-1">
              <CheckCircle2 className="w-5 h-5" />
              Completa scheda
            </button>
          )}
        </div>
      </div>

      {/* Rest Timer Modal when triggered */}
      {activeTimerRest.show && (
        <RestTimerModal
          initialSeconds={activeTimerRest.seconds}
          exerciseName={currentExerciseData.name}
          nextExerciseName={nextExName}
          setNumber={activeTimerRest.setNum}
          totalSets={activeTimerRest.totalSets}
          onComplete={() => setActiveTimerRest((prev) => ({ ...prev, show: false }))}
          onClose={() => setActiveTimerRest((prev) => ({ ...prev, show: false }))}
        />
      )}

      {/* Exercise Detail Modal */}
      {showDetailModal && (
        <ExerciseDetailModal
          exercise={currentExerciseData}
          onClose={() => setShowDetailModal(false)}
        />
      )}

      {/* Riepilogo finale (dialog) */}
      {showFinishModal && completedWorkoutItem && (
        <div className="scrim flex items-center justify-center p-6">
          <div className="dialog w-full max-w-sm text-center">
            <div className="w-16 h-16 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-normal text-on-surface mb-1">Grande lavoro! 🔥</h2>
            <p className="text-sm text-on-surface-variant mb-6">Allenamento completato e salvato.</p>

            <div className="grid grid-cols-2 gap-2 mb-6">
              {[
                { label: 'Durata', value: `${Math.round(completedWorkoutItem.durationSeconds / 60)} min` },
                { label: 'Calorie stimate', value: `~${completedWorkoutItem.estimatedCalories}` },
                { label: 'Volume', value: `${completedWorkoutItem.totalVolumeKg} kg` },
                { label: 'Esercizi', value: String(completedWorkoutItem.exercisesCompletedCount) }
              ].map((cell) => (
                <div key={cell.label} className="bg-surface-container-highest rounded-xl p-3">
                  <p className="text-lg font-semibold text-on-surface tabular-nums">{cell.value}</p>
                  <span className="text-xs text-on-surface-variant">{cell.label}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setShowFinishModal(false);
                onFinish();
              }}
              className="btn-filled w-full h-12"
            >
              Vai ai progressi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
