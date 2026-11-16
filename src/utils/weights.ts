import { EXERCISES } from '../data/exercises';
import { Routine, WorkoutHistoryItem } from '../types';

/**
 * Peso da proporre per ogni esercizio di una scheda (chiave = id esercizio):
 * l'ultimo usato in una serie completata, se c'è nello storico; altrimenti il
 * carico di partenza del catalogo (`Exercise.startingWeight`). Gli esercizi
 * senza pesi non compaiono nel risultato.
 *
 * `history` è ordinato dal più recente, come lo restituisce getWorkoutHistory().
 */
export function getSuggestedWeights(routine: Routine, history: WorkoutHistoryItem[]): Record<string, number> {
  const suggested: Record<string, number> = {};
  routine.exercises.forEach(({ exerciseId }) => {
    const lastUsed = findLastUsedWeightKg(exerciseId, history);
    const starting = EXERCISES.find((exercise) => exercise.id === exerciseId)?.startingWeight?.kg;
    const weightKg = lastUsed ?? starting;
    if (weightKg !== undefined) suggested[exerciseId] = weightKg;
  });
  return suggested;
}

function findLastUsedWeightKg(exerciseId: string, history: WorkoutHistoryItem[]): number | undefined {
  for (const workout of history) {
    const log = workout.logs.find((entry) => entry.exerciseId === exerciseId);
    // L'ultima serie completata con un peso: è il carico a cui si era arrivati.
    const lastSet = log?.sets.filter((set) => set.completed && set.weightKg > 0).pop();
    if (lastSet) return lastSet.weightKg;
  }
  return undefined;
}
