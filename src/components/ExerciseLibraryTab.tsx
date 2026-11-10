import React, { useState } from 'react';
import { Search, Flame, Clock, RotateCcw, ChevronRight, Dumbbell } from 'lucide-react';
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

  return (
    <div className="space-y-4 pb-24">
      {/* Header */}
      <div>
        <h1 className="text-xl font-black text-white">Libreria Esercizi</h1>
        <p className="text-xs text-slate-400">
          Guida visiva, ripetizioni consigliate e recuperi per ogni gruppo muscolare
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
        <input
          type="text"
          placeholder="Cerca esercizio (es. squat, addome, panca)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 shadow-inner"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-3 text-xs text-slate-400 p-1"
          >
            ✕
          </button>
        )}
      </div>

      {/* Category Pills Slider */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('Tutti')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition active:scale-95 ${
            selectedCategory === 'Tutti'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          Tutti ({EXERCISES.length})
        </button>
        {MUSCLE_GROUPS.map((cat) => {
          const count = EXERCISES.filter((e) => e.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition active:scale-95 ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Exercise Cards Grid */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/50 rounded-3xl border border-slate-800">
            <Dumbbell className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-300">Nessun esercizio trovato</p>
            <p className="text-xs text-slate-500 mt-1">Prova a cambiare termine di ricerca</p>
          </div>
        ) : (
          filtered.map((exercise) => (
            <div
              key={exercise.id}
              onClick={() => onSelectExercise(exercise)}
              className="bg-slate-900/90 border border-slate-800/80 hover:border-emerald-500/40 rounded-3xl p-4 transition-all shadow-md active:scale-99 cursor-pointer group"
            >
              <div className="flex gap-3.5">
                {/* Visual Thumbnail */}
                <div className="w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                  <ExerciseIllustration
                    exercise={exercise}
                    isAnimated={false}
                    compact={true}
                    className="w-full h-full p-1"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-emerald-400">
                        {exercise.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {exercise.equipment}
                      </span>
                    </div>

                    <h3 className="text-sm font-extrabold text-white group-hover:text-emerald-300 transition line-clamp-1 mt-0.5">
                      {exercise.name}
                    </h3>

                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                      {exercise.description}
                    </p>
                  </div>

                  {/* Recommended Reps and Rest metrics */}
                  <div className="flex items-center space-x-3 text-[11px] pt-1">
                    <div className="flex items-center space-x-1 text-slate-300">
                      <RotateCcw className="w-3 h-3 text-cyan-400" />
                      <span className="font-bold">{exercise.recommendedReps}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-slate-300">
                      <Clock className="w-3 h-3 text-emerald-400" />
                      <span className="font-bold text-emerald-400">{exercise.recommendedRestSeconds}s</span>
                    </div>
                    <div className="flex items-center space-x-1 text-slate-400">
                      <Flame className="w-3 h-3 text-orange-400" />
                      <span>{exercise.calorieBurnRating}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center text-slate-600 group-hover:text-emerald-400 transition">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
