import React, { useState } from 'react';
import { Play, Flame, Clock, Plus, X, ArrowUpDown, SlidersHorizontal } from 'lucide-react';
import { GoalId, Routine } from '../types';
import { EXERCISES } from '../data/exercises';
import { TRAINING_GOALS, getGoal } from '../data/goals';
import { getUserStats, getSelectedGoal, saveSelectedGoal } from '../utils/storage';
import {
  DEFAULT_SORT,
  DIFFICULTY_OPTIONS,
  DURATION_OPTIONS,
  SORT_OPTIONS,
  DifficultyFilter,
  DurationFilter,
  RoutineSort,
  filterAndSortRoutines
} from '../utils/routineFilters';

/**
 * Nome breve per le pillole delle schede: prime due parole, senza la parte tra
 * parentesi (es. "Crunch Bicicletta" invece di solo "Crunch", che sarebbe ambiguo).
 */
function shortExerciseName(name: string): string {
  return name.split('(')[0].trim().split(' ').slice(0, 2).join(' ');
}

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
  const [selectedGoal, setSelectedGoal] = useState<GoalId>(() => getSelectedGoal());
  const [showAllRoutines, setShowAllRoutines] = useState(false);
  const goal = getGoal(selectedGoal);

  const chooseGoal = (id: GoalId) => {
    setSelectedGoal(id);
    saveSelectedGoal(id);
    setShowAllRoutines(false);
  };

  // Filtri e ordinamento (si azzerano cambiando tab, come la scelta "Mostra tutte").
  const [difficulty, setDifficulty] = useState<DifficultyFilter>('tutte');
  const [duration, setDuration] = useState<DurationFilter>('tutte');
  const [sort, setSort] = useState<RoutineSort>(DEFAULT_SORT);
  const [showFilters, setShowFilters] = useState(false);
  const activeFilterCount = (difficulty !== 'tutte' ? 1 : 0) + (duration !== 'tutte' ? 1 : 0);
  const resetFilters = () => {
    setDifficulty('tutte');
    setDuration('tutte');
  };

  // Schede dell'obiettivo scelto; quelle senza `goals` (create dall'utente) si vedono sempre.
  const goalRoutines = routines.filter((r) => !r.goals || r.goals.includes(selectedGoal));
  const visibleRoutines = filterAndSortRoutines(showAllRoutines ? routines : goalRoutines, difficulty, duration, sort);
  const hiddenRoutinesCount = routines.length - goalRoutines.length;

  return (
    <div className="space-y-5 pb-24">
      {/* Selettore obiettivo (chip di filtro M3) */}
      <div>
        <p className="text-sm font-medium text-on-surface-variant mb-2">Il tuo obiettivo</p>
        <div className="flex gap-2 overflow-x-auto scrollbar-none -mx-4 px-4 pb-1">
          {TRAINING_GOALS.map((g) => {
            const isActive = g.id === selectedGoal;
            return (
              <button
                key={g.id}
                onClick={() => chooseGoal(g.id)}
                aria-pressed={isActive}
                className={isActive ? 'chip-selected' : 'chip'}
              >
                <span aria-hidden="true">{g.emoji}</span>
                {g.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Card obiettivo */}
      <div className="rounded-3xl p-5 bg-primary-container text-on-primary-container">
        <h1 className="text-2xl font-semibold leading-tight mb-1.5">{goal.title}</h1>
        <p className="text-sm leading-relaxed opacity-90 mb-4">{goal.description}</p>

        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Sessioni', value: String(userStats.workoutsCompleted) },
            { label: 'Minuti', value: String(userStats.totalMinutesTrained) },
            { label: 'Calorie', value: `~${userStats.estimatedCaloriesBurned}` }
          ].map((stat) => (
            <div key={stat.label} className="bg-surface/40 rounded-2xl py-2.5 text-center">
              <span className="block text-xl font-semibold tabular-nums">{stat.value}</span>
              <span className="text-xs opacity-80">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Intestazione elenco + azioni */}
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-on-surface">Schede</h2>
          <p className="text-xs text-on-surface-variant">
            {visibleRoutines.length} {showAllRoutines ? 'in totale' : `per ${goal.label}`}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`relative ${showFilters ? 'icon-btn bg-secondary-container text-on-secondary-container' : 'icon-btn'}`}
            aria-expanded={showFilters}
            aria-label="Filtra e ordina le schede"
            title="Filtra e ordina"
          >
            <SlidersHorizontal className="w-5 h-5" />
            {activeFilterCount > 0 && (
              <span className="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-error text-[10px] font-bold text-surface flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
          <button onClick={onOpenBuilder} className="btn-tonal px-4">
            <Plus className="w-4 h-4" />
            Crea
          </button>
        </div>
      </div>

      {/* Pannello filtri */}
      {showFilters && (
        <div className="card p-4 space-y-4">
          <div>
            <p className="text-xs font-medium text-on-surface-variant mb-2">Difficoltà</p>
            <div className="flex flex-wrap gap-2">
              {DIFFICULTY_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setDifficulty(option.id)}
                  aria-pressed={difficulty === option.id}
                  className={difficulty === option.id ? 'chip-selected' : 'chip'}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-on-surface-variant mb-2">Durata</p>
            <div className="flex flex-wrap gap-2">
              {DURATION_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setDuration(option.id)}
                  aria-pressed={duration === option.id}
                  className={duration === option.id ? 'chip-selected' : 'chip'}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-3">
            <ArrowUpDown className="w-4 h-4 text-on-surface-variant" />
            <span className="text-xs font-medium text-on-surface-variant">Ordina</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as RoutineSort)}
              className="flex-1 h-10 px-3 rounded-lg border border-outline bg-surface-container text-sm text-on-surface"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          {activeFilterCount > 0 && (
            <button onClick={resetFilters} className="btn-text -ml-3">
              <X className="w-4 h-4" />
              Rimuovi filtri
            </button>
          )}
        </div>
      )}

      {/* Elenco schede */}
      <div className="space-y-3">
        {visibleRoutines.length === 0 && (
          <div className="card p-6 text-center">
            <p className="text-sm text-on-surface-variant mb-3">Nessuna scheda con questi filtri.</p>
            <button onClick={resetFilters} className="btn-outlined">
              Rimuovi filtri
            </button>
          </div>
        )}
        {visibleRoutines.map((routine) => {
          const isExpanded = expandedRoutineIds.includes(routine.id);
          const visibleExercises = isExpanded ? routine.exercises : routine.exercises.slice(0, PREVIEW_COUNT);
          const hiddenCount = routine.exercises.length - PREVIEW_COUNT;
          return (
            <div key={routine.id} className="card p-4">
              <div className="flex items-center gap-2 mb-1.5 text-xs text-on-surface-variant">
                <span className="px-2 py-0.5 rounded-md bg-surface-container-highest font-medium text-on-surface">
                  {routine.level}
                </span>
                <span>{routine.exercises.length} esercizi</span>
              </div>
              <h3 className="text-base font-semibold text-on-surface leading-snug">{routine.title}</h3>
              <p className="text-sm text-on-surface-variant mt-0.5">{routine.subtitle}</p>

              <div className="flex items-center gap-4 text-sm text-on-surface-variant my-3">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {routine.estimatedDurationMinutes} min
                </span>
                <span className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4" />~{routine.estimatedCaloriesBurn} kcal
                </span>
              </div>

              {/* Anteprima esercizi */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {visibleExercises.map((item, idx) => {
                  const ex = EXERCISES.find((e) => e.id === item.exerciseId);
                  return (
                    <button
                      key={idx}
                      onClick={() => ex && onSelectExercisePreview(ex.id)}
                      className="chip h-7 px-2.5 text-xs"
                    >
                      <span>{ex ? shortExerciseName(ex.name) : ''}</span>
                      <span className="text-primary font-semibold">{item.sets}x{item.reps}</span>
                    </button>
                  );
                })}
                {hiddenCount > 0 && (
                  <button
                    onClick={() => toggleExpanded(routine.id)}
                    className="btn-text min-h-7 px-2 text-xs"
                    aria-expanded={isExpanded}
                  >
                    {isExpanded ? 'Mostra meno' : `+${hiddenCount} altri`}
                  </button>
                )}
              </div>

              <div className="flex items-center justify-end gap-2">
                <button onClick={() => setSelectedRoutinePreview(routine)} className="btn-text">
                  Dettagli
                </button>
                <button onClick={() => onSelectRoutine(routine)} className="btn-filled">
                  <Play className="w-4 h-4 fill-current" />
                  Inizia
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {hiddenRoutinesCount > 0 && (
        <button onClick={() => setShowAllRoutines(!showAllRoutines)} className="btn-outlined w-full">
          {showAllRoutines ? `Mostra solo le schede per ${goal.label}` : `Mostra tutte le schede (+${hiddenRoutinesCount})`}
        </button>
      )}

      {/* Dettaglio scheda (bottom sheet) */}
      {selectedRoutinePreview && (
        <div className="scrim flex items-end sm:items-center justify-center sm:p-4" onClick={() => setSelectedRoutinePreview(null)}>
          <div
            className="sheet relative w-full max-w-lg max-h-[90vh] flex flex-col animate-in slide-in-from-bottom"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sheet-handle sm:hidden" />
            <div className="px-6 pt-4 pb-2 flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-medium text-on-surface-variant">{selectedRoutinePreview.level} · {selectedRoutinePreview.estimatedDurationMinutes} min</p>
                <h3 className="text-xl font-semibold text-on-surface">{selectedRoutinePreview.title}</h3>
              </div>
              <button onClick={() => setSelectedRoutinePreview(null)} className="icon-btn -mr-2" aria-label="Chiudi">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 pb-4 overflow-y-auto space-y-3">
              <p className="text-sm text-on-surface-variant leading-relaxed">{selectedRoutinePreview.description}</p>

              <h4 className="text-sm font-semibold text-on-surface pt-2">Esercizi</h4>

              <div className="divide-y divide-outline-variant/60">
                {selectedRoutinePreview.exercises.map((item, idx) => {
                  const ex = EXERCISES.find((e) => e.id === item.exerciseId);
                  return (
                    <div key={idx} className="py-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-8 h-8 flex-shrink-0 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center text-sm font-semibold">
                          {idx + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-on-surface">{ex?.name}</p>
                          <p className="text-xs text-on-surface-variant">
                            {item.sets} serie · {item.reps} rip · recupero {item.restSeconds}s
                          </p>
                        </div>
                      </div>
                      <button
                        // Il dettaglio scheda resta aperto sotto: chiudendo la guida si torna all'elenco esercizi.
                        onClick={() => ex && onSelectExercisePreview(ex.id)}
                        className="btn-text px-3 text-xs"
                      >
                        Guida
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-4 pb-safe">
              <button
                onClick={() => {
                  const target = selectedRoutinePreview;
                  setSelectedRoutinePreview(null);
                  onSelectRoutine(target);
                }}
                className="btn-filled w-full h-14 text-base"
              >
                <Play className="w-5 h-5 fill-current" /> Inizia questa scheda
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
