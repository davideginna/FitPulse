import React from 'react';
import { X, Flame, Clock, RotateCcw, AlertTriangle, CheckCircle2, Dumbbell } from 'lucide-react';
import { Exercise } from '../types';
import { ExerciseIllustration } from './ExerciseIllustration';
import { MuscleMap } from './muscleMap/MuscleMap';

interface Props {
  exercise: Exercise;
  onClose: () => void;
  onStartWithExercise?: (exercise: Exercise) => void;
}

export const ExerciseDetailModal: React.FC<Props> = ({
  exercise,
  onClose,
  onStartWithExercise
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-slate-900/90 backdrop-blur border-b border-slate-800 px-5 py-4 flex items-center justify-between">
          <div className="flex-1 pr-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              {exercise.category} • {exercise.equipment}
            </span>
            <h2 className="text-lg font-bold text-white leading-snug">{exercise.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/80 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-5 space-y-5">
          {/* Visual Animation */}
          <ExerciseIllustration exercise={exercise} isAnimated={true} className="w-full h-56" />

          {/* Quick Metrics Bar: Reps, Rest, Calorie Burn */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3 text-center">
              <div className="flex items-center justify-center text-cyan-400 mb-1">
                <RotateCcw className="w-4 h-4" />
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Ripetizioni</span>
              <p className="text-sm font-extrabold text-white mt-0.5">{exercise.recommendedReps}</p>
            </div>

            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3 text-center">
              <div className="flex items-center justify-center text-emerald-400 mb-1">
                <Clock className="w-4 h-4" />
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Recupero</span>
              <p className="text-sm font-extrabold text-white mt-0.5">{exercise.recommendedRestSeconds}s</p>
            </div>

            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3 text-center">
              <div className="flex items-center justify-center text-orange-400 mb-1">
                <Flame className="w-4 h-4" />
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Consumo</span>
              <p className="text-sm font-extrabold text-white mt-0.5">{exercise.calorieBurnRating}</p>
            </div>
          </div>

          {/* Target Muscles */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Dumbbell className="w-3.5 h-3.5 text-emerald-400" /> Muscoli Coinvolti
            </h4>
            <MuscleMap
              primary={exercise.primaryMuscles}
              secondary={exercise.secondaryMuscles}
              className="bg-slate-950/50 border border-slate-800/80 rounded-2xl p-3 mb-2.5"
            />
            <div className="flex flex-wrap gap-1.5">
              {exercise.targetMuscles.map((muscle) => (
                <span
                  key={muscle}
                  className="bg-emerald-950/50 text-emerald-300 border border-emerald-800/50 text-xs px-2.5 py-1 rounded-lg font-medium"
                >
                  {muscle}
                </span>
              ))}
            </div>
          </div>

          {/* Fat Loss / Belly Focus Note */}
          <div className="bg-gradient-to-r from-emerald-950/50 to-teal-950/40 border border-emerald-500/30 rounded-2xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1.5 flex items-center gap-1.5">
              🔥 Focus Dimagrimento & Pancia Piatta
            </h4>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              {exercise.tipsForFatLoss}
            </p>
          </div>

          {/* Step by Step Execution */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Come Eseguirlo Correttamente
            </h4>
            <ol className="space-y-2.5">
              {exercise.instructions.map((step, idx) => (
                <li key={idx} className="flex items-start text-xs text-slate-300 bg-slate-950/40 rounded-xl p-3 border border-slate-800/60">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-[10px] mr-2.5 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Common Mistakes */}
          {exercise.commonMistakes.length > 0 && (
            <div className="bg-red-950/20 border border-red-900/30 rounded-2xl p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" /> Errori Comuni da Evitare
              </h4>
              <ul className="space-y-1.5">
                {exercise.commonMistakes.map((mistake, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-red-400 font-bold">•</span>
                    <span>{mistake}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        {onStartWithExercise && (
          <div className="sticky bottom-0 bg-slate-900/95 border-t border-slate-800 p-4">
            <button
              onClick={() => onStartWithExercise(exercise)}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold rounded-2xl shadow-lg shadow-emerald-500/20 active:scale-98 transition flex items-center justify-center gap-2 text-sm"
            >
              <Dumbbell className="w-4 h-4" /> Inizia Serie di Questo Esercizio
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
