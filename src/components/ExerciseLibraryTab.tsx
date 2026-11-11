import React, { useState } from 'react';
import { Search, Flame, Clock, RotateCcw, Dumbbell, X } from 'lucide-react';
import { Exercise } from '../types';
import { EXERCISES, MUSCLE_GROUPS } from '../data/exercises';
import { ExerciseIllustration } from './ExerciseIllustration';

interface Props {
  onSelectExercise: (exercise: Exercise) => void;
}

export const ExerciseLibraryTab: React.FC<Props> = ({ onSelectExercise }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tutti');

  const filtered = EXERCISES.filter((ex) => {
    const matchesCategory = selectedCategory === 'Tutti' || ex.category === selectedCategory;
    const matchesSearch =
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.targetMuscles.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase())) ||
      ex.equipment.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categoryChip = (category: string, label: string) => (
    <button
      key={category}
      onClick={() => setSelectedCategory(category)}
      aria-pressed={selectedCategory === category}
      className={selectedCategory === category ? 'chip-selected' : 'chip'}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-4 pb-24">
      <div>
        <h1 className="text-2xl font-semibold text-on-surface">Esercizi</h1>
        <p className="text-sm text-on-surface-variant">Guida visiva, ripetizioni e recuperi consigliati</p>
      </div>

      {/* Barra di ricerca M3 */}
      <div className="relative">
        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
        <input
          type="text"
          placeholder="Cerca (es. squat, addome, panca)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-14 rounded-full bg-surface-container-high pl-12 pr-12 text-base text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="icon-btn absolute right-2 top-1/2 -translate-y-1/2"
            aria-label="Cancella ricerca"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4">
        {categoryChip('Tutti', `Tutti (${EXERCISES.length})`)}
        {MUSCLE_GROUPS.map((cat) => categoryChip(cat, `${cat} (${EXERCISES.filter((e) => e.category === cat).length})`))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="card text-center py-12">
            <Dumbbell className="w-10 h-10 text-on-surface-variant mx-auto mb-2" />
            <p className="text-sm font-semibold text-on-surface">Nessun esercizio trovato</p>
            <p className="text-sm text-on-surface-variant mt-1">Prova a cambiare termine di ricerca</p>
          </div>
        ) : (
          filtered.map((exercise) => (
            <button
              key={exercise.id}
              onClick={() => onSelectExercise(exercise)}
              className="card w-full text-left p-3 flex gap-3 hover:bg-surface-container-high transition-colors"
            >
              <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden">
                <ExerciseIllustration exercise={exercise} isAnimated={false} compact={true} className="w-full h-full p-1" />
              </div>

              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-on-surface-variant">
                    {exercise.category} · {exercise.equipment}
                  </p>
                  <h3 className="text-base font-semibold text-on-surface leading-snug line-clamp-2">{exercise.name}</h3>
                  <p className="text-xs text-on-surface-variant line-clamp-2 mt-0.5">{exercise.description}</p>
                </div>

                <div className="flex items-center gap-3 text-xs text-on-surface-variant pt-1.5">
                  <span className="flex items-center gap-1">
                    <RotateCcw className="w-3.5 h-3.5" />
                    {exercise.recommendedReps}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {exercise.recommendedRestSeconds}s
                  </span>
                  <span className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5" />
                    {exercise.calorieBurnRating}
                  </span>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};
