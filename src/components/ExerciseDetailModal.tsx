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
  const metrics = [
    { icon: RotateCcw, label: 'Ripetizioni', value: exercise.recommendedReps },
    { icon: Clock, label: 'Recupero', value: `${exercise.recommendedRestSeconds}s` },
    { icon: Flame, label: 'Consumo', value: exercise.calorieBurnRating }
  ];

  // Bottom sheet M3 (su schermi larghi diventa un dialog centrato).
  return (
    <div className="scrim flex items-end sm:items-center justify-center sm:p-4 animate-in fade-in" onClick={onClose}>
      <div
        className="sheet relative w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sheet-handle sm:hidden" />
        <div className="px-6 pt-3 pb-2 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs font-medium text-on-surface-variant">
              {exercise.category} · {exercise.equipment}
            </p>
            <h2 className="text-xl font-semibold text-on-surface leading-snug">{exercise.name}</h2>
          </div>
          <button onClick={onClose} className="icon-btn -mr-2" aria-label="Chiudi">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto px-6 pb-6 pt-2 space-y-6">
          <ExerciseIllustration exercise={exercise} isAnimated={true} />

          <div className="grid grid-cols-3 gap-2">
            {metrics.map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-surface-container-high rounded-xl p-3 text-center">
                <Icon className="w-5 h-5 mx-auto text-primary mb-1" />
                <p className="text-sm font-semibold text-on-surface">{value}</p>
                <span className="text-xs text-on-surface-variant">{label}</span>
              </div>
            ))}
          </div>

          <section>
            <h4 className="text-base font-semibold text-on-surface mb-3">Muscoli coinvolti</h4>
            <MuscleMap
              primary={exercise.primaryMuscles}
              secondary={exercise.secondaryMuscles}
              className="bg-surface-container-high rounded-2xl p-3 mb-3"
            />
            <div className="flex flex-wrap gap-2">
              {exercise.targetMuscles.map((muscle) => (
                <span key={muscle} className="chip h-7 text-xs">
                  {muscle}
                </span>
              ))}
            </div>
          </section>

          <section className="rounded-2xl p-4 bg-primary-container text-on-primary-container">
            <h4 className="text-sm font-semibold mb-1.5 flex items-center gap-2">
              <Flame className="w-4 h-4" /> Per dimagrire e sgonfiare la pancia
            </h4>
            <p className="text-sm leading-relaxed">{exercise.tipsForFatLoss}</p>
          </section>

          <section>
            <h4 className="text-base font-semibold text-on-surface mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" /> Come eseguirlo
            </h4>
            <ol className="space-y-3">
              {exercise.instructions.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-on-surface">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container font-semibold flex items-center justify-center text-xs">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </section>

          {exercise.commonMistakes.length > 0 && (
            <section className="rounded-2xl p-4 bg-error-container text-on-error-container">
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Errori da evitare
              </h4>
              <ul className="space-y-1.5">
                {exercise.commonMistakes.map((mistake, idx) => (
                  <li key={idx} className="text-sm flex items-start gap-2">
                    <span aria-hidden="true">•</span>
                    <span>{mistake}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {onStartWithExercise && (
          <div className="px-6 py-4 pb-safe border-t border-outline-variant/60">
            <button onClick={() => onStartWithExercise(exercise)} className="btn-filled w-full h-14 text-base">
              <Dumbbell className="w-5 h-5" /> Inizia questo esercizio
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
