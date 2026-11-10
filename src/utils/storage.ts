import { WorkoutHistoryItem, UserStats, Routine } from '../types';
import { PRESET_ROUTINES } from '../data/routines';

const STORAGE_KEYS = {
  HISTORY: 'fitpulse_workout_history',
  USER_STATS: 'fitpulse_user_stats',
  CUSTOM_ROUTINES: 'fitpulse_custom_routines',
  ACTIVE_WORKOUT: 'fitpulse_active_workout_state'
};

export function getWorkoutHistory(): WorkoutHistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveWorkoutHistory(item: WorkoutHistoryItem): WorkoutHistoryItem[] {
  try {
    const history = getWorkoutHistory();
    const updated = [item, ...history];
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));

    // Update stats
    const stats = getUserStats();
    stats.workoutsCompleted += 1;
    stats.totalMinutesTrained += Math.round(item.durationSeconds / 60);
    stats.estimatedCaloriesBurned += item.estimatedCalories;
    saveUserStats(stats);

    return updated;
  } catch {
    return [];
  }
}

/**
 * Elimina un allenamento dallo storico e toglie il suo contributo dai totali
 * (sessioni, minuti, calorie). Restituisce lo storico aggiornato.
 */
export function deleteWorkoutHistoryItem(id: string): WorkoutHistoryItem[] {
  const history = getWorkoutHistory();
  const removed = history.find((item) => item.id === id);
  if (!removed) return history;

  const updated = history.filter((item) => item.id !== id);
  try {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
  } catch {
    return history;
  }

  const stats = getUserStats();
  stats.workoutsCompleted = Math.max(0, stats.workoutsCompleted - 1);
  stats.totalMinutesTrained = Math.max(0, stats.totalMinutesTrained - Math.round(removed.durationSeconds / 60));
  stats.estimatedCaloriesBurned = Math.max(0, stats.estimatedCaloriesBurned - removed.estimatedCalories);
  saveUserStats(stats);
  return updated;
}

/** Svuota lo storico e azzera i totali. Peso attuale e obiettivo restano invariati. */
export function clearWorkoutHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  } catch {
    return;
  }
  saveUserStats({ ...getUserStats(), workoutsCompleted: 0, totalMinutesTrained: 0, estimatedCaloriesBurned: 0 });
}

export function getUserStats(): UserStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_STATS);
    return raw ? JSON.parse(raw) : {
      currentWeightKg: 82,
      targetWeightKg: 75,
      workoutsCompleted: 0,
      totalMinutesTrained: 0,
      estimatedCaloriesBurned: 0
    };
  } catch {
    return {
      currentWeightKg: 82,
      targetWeightKg: 75,
      workoutsCompleted: 0,
      totalMinutesTrained: 0,
      estimatedCaloriesBurned: 0
    };
  }
}

export function saveUserStats(stats: UserStats): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(stats));
  } catch (e) {
    console.error('Error saving user stats', e);
  }
}

export function getCustomRoutines(): Routine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_ROUTINES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomRoutine(routine: Routine): Routine[] {
  try {
    const custom = getCustomRoutines();
    const existingIdx = custom.findIndex(r => r.id === routine.id);
    let updated: Routine[];
    if (existingIdx >= 0) {
      updated = [...custom];
      updated[existingIdx] = routine;
    } else {
      updated = [routine, ...custom];
    }
    localStorage.setItem(STORAGE_KEYS.CUSTOM_ROUTINES, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function getAllRoutines(): Routine[] {
  const custom = getCustomRoutines();
  return [...PRESET_ROUTINES, ...custom];
}
