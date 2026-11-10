import React, { useState } from 'react';
import { 
  Play, 
  Flame, 
  Clock, 
  Plus, 
  Sparkles
} from 'lucide-react';
import { Routine } from '../types';
import { EXERCISES } from '../data/exercises';
import { getUserStats } from '../utils/storage';

/** Esercizi mostrati nella scheda prima di "+N altri". */
const PREVIEW_COUNT = 4;

interface Props {
  routines: Routine[];
  onSelectRoutine: (routine: Routine) => void;
  onOpenBuilder: () => void;
  onSelectExercisePreview: (exerciseId: string) => void;
}

export const WorkoutTab: React.FC<Props> = ({
  routines,
  onSelectRoutine,
  onOpenBuilder,
  onSelectExercisePreview
}) => {
  const [selectedRoutinePreview, setSelectedRoutinePreview] = useState<Routine | null>(null);
  // Schede di cui l'utente ha aperto l'elenco completo degli esercizi ("+N altri").
  const [expandedRoutineIds, setExpandedRoutineIds] = useState<string[]>([]);

  const toggleExpanded = (routineId: string) => {
    setExpandedRoutineIds((ids) =>
      ids.includes(routineId) ? ids.filter((id) => id !== routineId) : [...ids, routineId]
    );
  };
  const userStats = getUserStats();

  return (
    <div className="space-y-6 pb-24">
      {/* Hero Goal Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-slate-900 to-cyan-950 rounded-3xl p-5 border border-emerald-500/30 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-36 h-36 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center space-x-2 text-emerald-400 mb-2">
          <Sparkles className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Obiettivo Principale</span>
        </div>

        <h1 className="text-xl font-black text-white leading-tight mb-1">
          Perdere Peso & Sgonfiare la Pancia
        </h1>
        <p className="text-xs text-slate-300 leading-relaxed mb-4 max-w-sm">
          Schede basate su multiarticolari pesanti, contrazione del trasverso addominale e recuperi calibrati per massimizzare il deficit calorico.
        </p>

        {/* Quick Stats Pill */}
        <div className="grid grid-cols-3 gap-2 bg-slate-950/70 backdrop-blur rounded-2xl p-3 border border-slate-800/80">
          <div className="text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Sessioni</span>
            <span className="text-base font-black text-white">{userStats.workoutsCompleted}</span>
          </div>
          <div className="text-center border-x border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Minuti</span>
            <span className="text-base font-black text-emerald-400">{userStats.totalMinutesTrained}m</span>
          </div>
          <div className="text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Calorie</span>
            <span className="text-base font-black text-orange-400">~{userStats.estimatedCaloriesBurned}</span>
          </div>
        </div>
      </div>

      {/* Action Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-white">Schede Consigliate</h2>
          <p className="text-xs text-slate-400">Programmi scientifici ad alta intensità metabolica</p>
        </div>
        <button
          onClick={onOpenBuilder}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold active:scale-95 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Crea Scheda</span>
        </button>
      </div>

      {/* Routine Cards List */}
      <div className="space-y-3.5">
        {routines.map((routine) => {
          const isExpanded = expandedRoutineIds.includes(routine.id);
          const visibleExercises = isExpanded ? routine.exercises : routine.exercises.slice(0, PREVIEW_COUNT);
          const hiddenCount = routine.exercises.length - PREVIEW_COUNT;
          return (
          <div
            key={routine.id}
            className="bg-slate-900/90 border border-slate-800/80 hover:border-emerald-500/40 rounded-3xl p-4 transition-all shadow-lg hover:shadow-emerald-500/5 group"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 pr-2">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800/40">
                    {routine.level}
                  </span>
                  <span className="text-[10px] font-medium text-slate-400">
                    {routine.exercises.length} esercizi
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-white group-hover:text-emerald-300 transition">
                  {routine.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                  {routine.subtitle}
                </p>
              </div>
            </div>

            {/* Tags and metrics */}
            <div className="flex items-center space-x-4 text-xs text-slate-400 my-3">
              <div className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>{routine.estimatedDurationMinutes} min</span>
              </div>
              <div className="flex items-center space-x-1">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                <span>~{routine.estimatedCaloriesBurn} kcal</span>
              </div>
            </div>

            {/* Exercise preview pills */}
            <div className="flex flex-wrap gap-1.5 mb-3.5">
              {visibleExercises.map((item, idx) => {
                const ex = EXERCISES.find((e) => e.id === item.exerciseId);
                return (
                  <button
                    key={idx}
                    onClick={() => ex && onSelectExercisePreview(ex.id)}
                    className="text-[10px] bg-slate-950 border border-slate-800/80 hover:border-slate-700 text-slate-300 px-2.5 py-1 rounded-lg font-medium transition active:scale-95 flex items-center gap-1"
                  >
                    <span>{ex?.name.split(' ')[0]}</span>
                    <span className="text-emerald-400 font-bold">{item.sets}x{item.reps}</span>
                  </button>
                );
              })}
              {hiddenCount > 0 && (
                <button
                  onClick={() => toggleExpanded(routine.id)}
                  className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 py-1 px-1.5 transition active:scale-95"
                  aria-expanded={isExpanded}
                >
                  {isExpanded ? 'Mostra meno' : `+${hiddenCount} altri`}
                </button>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
              <button
                onClick={() => setSelectedRoutinePreview(routine)}
                className="text-xs font-semibold text-slate-400 hover:text-slate-200 transition"
              >
                Vedi Dettagli
              </button>
              <button
                onClick={() => onSelectRoutine(routine)}
                className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Inizia Allenamento</span>
              </button>
            </div>
          </div>
          );
        })}
      </div>

      {/* Routine Detail Modal */}
      {selectedRoutinePreview && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col shadow-2xl">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Dettagli Scheda
                </span>
                <h3 className="text-base font-bold text-white">{selectedRoutinePreview.title}</h3>
              </div>
              <button
                onClick={() => setSelectedRoutinePreview(null)}
                className="text-slate-400 hover:text-white p-2"
              >
                ✕
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-3">
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedRoutinePreview.description}
              </p>

              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 pt-2">
                Sequenza Esercizi, Ripetizioni e Tempi di Recupero:
              </h4>

              <div className="space-y-2">
                {selectedRoutinePreview.exercises.map((item, idx) => {
                  const ex = EXERCISES.find((e) => e.id === item.exerciseId);
                  return (
                    <div
                      key={idx}
                      className="bg-slate-950 border border-slate-800 rounded-2xl p-3 flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-emerald-400">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="text-xs font-bold text-white">{ex?.name}</p>
                          <p className="text-[11px] text-slate-400">
                            {item.sets} serie • {item.reps} rip • <span className="text-emerald-400">recupero {item.restSeconds}s</span>
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedRoutinePreview(null);
                          if (ex) onSelectExercisePreview(ex.id);
                        }}
                        className="text-xs text-cyan-400 font-semibold p-1.5"
                      >
                        Guida
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-4 border-t border-slate-800">
              <button
                onClick={() => {
                  const target = selectedRoutinePreview;
                  setSelectedRoutinePreview(null);
                  onSelectRoutine(target);
                }}
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl shadow-lg shadow-emerald-500/20 active:scale-98 transition text-sm flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" /> Inizia Questa Scheda Ora
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
