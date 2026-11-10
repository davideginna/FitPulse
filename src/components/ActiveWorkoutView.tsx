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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col pb-24">
      {/* Top sticky bar */}
      <div className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <button
          onClick={onCancel}
          className="text-slate-400 hover:text-white p-1.5 rounded-lg active:scale-95 text-xs font-semibold flex items-center gap-1"
        >
          <X className="w-4 h-4" /> Annulla
        </button>

        {/* Live workout timer */}
        <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-full border border-slate-800">
          <Clock className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="font-mono text-sm font-bold text-white tracking-wider">
            {formatElapsed(elapsedSeconds)}
          </span>
        </div>

        <button
          onClick={handleCompleteWorkout}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3.5 py-1.5 rounded-xl text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition"
        >
          Termina
        </button>
      </div>

      {/* Routine title & exercise stepper */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="truncate font-medium">{routine.title}</span>
          <span className="font-bold text-cyan-400">
            Esercizio {currentExIndex + 1} di {routine.exercises.length}
          </span>
        </div>

        {/* Progress bar across routine */}
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full transition-all duration-300"
            style={{ width: `${((currentExIndex + 1) / routine.exercises.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Exercise Presentation Card */}
      <div className="px-4 mt-2">
        <div className="bg-slate-900 border border-slate-800/80 rounded-3xl p-4 shadow-xl">
          <div className="flex items-start justify-between mb-3">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                {currentExerciseData.category} • {currentExerciseData.equipment}
              </span>
              <h2 className="text-lg font-extrabold text-white leading-tight">
                {currentExerciseData.name}
              </h2>
            </div>
            <button
              onClick={() => setShowDetailModal(true)}
              className="p-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl active:scale-95 transition flex items-center gap-1 text-xs font-semibold"
            >
              <Info className="w-4 h-4 text-cyan-400" />
              <span>Guida</span>
            </button>
          </div>

          {/* Visual SVG Animation */}
          <ExerciseIllustration exercise={currentExerciseData} className="w-full h-44 mb-3" />

          {/* Target Reps and Suggested Rest Badges */}
          <div className="flex items-center justify-between bg-slate-950/60 rounded-xl p-2.5 border border-slate-800/60 text-xs">
            <div className="flex items-center space-x-1.5 text-slate-300">
              <span className="text-slate-400">Obiettivo:</span>
              <span className="font-bold text-white bg-slate-800 px-2 py-0.5 rounded-md">
                {currentRoutineEx.reps} rip
              </span>
            </div>
            <div className="flex items-center space-x-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-400">Recupero:</span>
              <span className="font-bold text-emerald-400">
                {currentRoutineEx.restSeconds}s
              </span>
            </div>
          </div>

          {currentRoutineEx.notes && (
            <p className="text-[11px] text-emerald-300/90 bg-emerald-950/30 border border-emerald-900/40 rounded-lg p-2 mt-2">
              💡 {currentRoutineEx.notes}
            </p>
          )}
        </div>
      </div>

      {/* Sets Logger Table */}
      <div className="px-4 mt-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
          <Dumbbell className="w-3.5 h-3.5 text-emerald-400" /> Serie e Ripetizioni
        </h3>

        <div className="space-y-2">
          {currentExLog?.sets.map((set, sIdx) => (
            <div
              key={sIdx}
              className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                set.completed
                  ? 'bg-emerald-950/20 border-emerald-500/40'
                  : 'bg-slate-900/90 border-slate-800'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">
                  {set.setNumber}
                </span>
                <span className="text-xs text-slate-400">Serie</span>
              </div>

              {/* Weight Input (Kg) */}
              <div className="flex items-center space-x-1">
                <input
                  type="number"
                  inputMode="decimal"
                  value={set.weightKg || ''}
                  onChange={(e) => handleWeightChange(sIdx, parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className="w-14 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-center font-bold text-sm text-white focus:outline-none focus:border-cyan-400"
                />
                <span className="text-[11px] text-slate-400">kg</span>
              </div>

              {/* Reps Input */}
              <div className="flex items-center space-x-1">
                <input
                  type="number"
                  inputMode="numeric"
                  value={set.completedReps || ''}
                  onChange={(e) => handleRepsChange(sIdx, parseInt(e.target.value) || 0)}
                  placeholder="12"
                  className="w-14 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-center font-bold text-sm text-white focus:outline-none focus:border-cyan-400"
                />
                <span className="text-[11px] text-slate-400">rip</span>
              </div>

              {/* Checkmark Complete Button */}
              <button
                onClick={() => handleSetToggle(sIdx)}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition active:scale-90 ${
                  set.completed
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                    : 'bg-slate-800 text-slate-500 hover:text-slate-300 border border-slate-700'
                }`}
              >
                <Check className="w-5 h-5 stroke-[3]" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Footer for Exercises */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-slate-900/95 backdrop-blur border-t border-slate-800 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setCurrentExIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentExIndex === 0}
          className="flex items-center space-x-1 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none active:scale-95 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Precedente</span>
        </button>

        {currentExIndex < routine.exercises.length - 1 ? (
          <button
            onClick={() => setCurrentExIndex((prev) => prev + 1)}
            className="flex items-center space-x-1 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 shadow-md shadow-cyan-500/20 active:scale-95 transition"
          >
            <span>Successivo</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleCompleteWorkout}
            className="flex items-center space-x-1 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-md shadow-emerald-500/30 active:scale-95 transition"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Completa Scheda</span>
          </button>
        )}
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

      {/* Finish Workout Summary Modal */}
      {showFinishModal && completedWorkoutItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 text-center shadow-2xl">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/40">
              <Trophy className="w-8 h-8" />
            </div>

            <h2 className="text-xl font-black text-white mb-1">Grande Lavoro! 🔥</h2>
            <p className="text-xs text-slate-400 mb-6">
              Hai completato l'allenamento. Il tuo metabolismo è al massimo!
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3">
                <span className="text-[10px] uppercase font-bold text-slate-400">Durata</span>
                <p className="text-lg font-black text-white">
                  {Math.round(completedWorkoutItem.durationSeconds / 60)} min
                </p>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3">
                <span className="text-[10px] uppercase font-bold text-slate-400">Calorie Stimate</span>
                <p className="text-lg font-black text-orange-400">
                  ~{completedWorkoutItem.estimatedCalories} kcal
                </p>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3">
                <span className="text-[10px] uppercase font-bold text-slate-400">Volume Totale</span>
                <p className="text-lg font-black text-cyan-400">
                  {completedWorkoutItem.totalVolumeKg} kg
                </p>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3">
                <span className="text-[10px] uppercase font-bold text-slate-400">Esercizi</span>
                <p className="text-lg font-black text-emerald-400">
                  {completedWorkoutItem.exercisesCompletedCount}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setShowFinishModal(false);
                onFinish();
              }}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-2xl shadow-lg shadow-emerald-500/20 active:scale-98 transition text-sm"
            >
              Salva e Torna alla Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
