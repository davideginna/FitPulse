import { WorkoutHistoryItem, UserStats, Routine, GoalId } from '../types';
import { DEFAULT_GOAL, TRAINING_GOALS } from '../data/goals';
import { PRESET_ROUTINES } from '../data/routines';
import type { FreeTimerState } from '../hooks/useFreeTimer';

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

// --- Timer libero (tab "Timer") ---
// Chiave separata da STORAGE_KEYS: lo stato salvato contiene timestamp assoluti
// (`endsAt`), così dopo un ricaricamento il timer riprende con il tempo giusto.

const FREE_TIMER_KEY = 'fitpulse_free_timer_state';

/** Restituisce lo stato salvato del timer libero, o null se assente/non valido. */
export function getFreeTimerState(): FreeTimerState | null {
  try {
    const raw = localStorage.getItem(FREE_TIMER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as FreeTimerState;
    // Controllo minimo di forma: se il formato è cambiato si riparte dai valori predefiniti.
    const isValid =
      (parsed.mode === 'rest' || parsed.mode === 'tabata') &&
      typeof parsed.restDurationSec === 'number' &&
      typeof parsed.workSec === 'number' &&
      typeof parsed.pauseSec === 'number' &&
      typeof parsed.totalRounds === 'number' &&
      typeof parsed.tabataRound === 'number' &&
      typeof parsed.rest?.status === 'string' &&
      typeof parsed.tabata?.status === 'string';
    return isValid ? parsed : null;
  } catch {
    return null;
  }
}

export function saveFreeTimerState(state: FreeTimerState): void {
  try {
    localStorage.setItem(FREE_TIMER_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Error saving free timer state', e);
  }
}

// --- Obiettivo di allenamento scelto (tab "Allenati") ---

const SELECTED_GOAL_KEY = 'fitpulse_selected_goal';

/** Obiettivo salvato, oppure quello predefinito se assente o non più valido. */
export function getSelectedGoal(): GoalId {
  try {
    const saved = localStorage.getItem(SELECTED_GOAL_KEY);
    return TRAINING_GOALS.some((g) => g.id === saved) ? (saved as GoalId) : DEFAULT_GOAL;
  } catch {
    return DEFAULT_GOAL;
  }
}

export function saveSelectedGoal(goal: GoalId): void {
  try {
    localStorage.setItem(SELECTED_GOAL_KEY, goal);
  } catch (e) {
    console.error('Error saving selected goal', e);
  }
}

// --- Ultima versione del changelog vista (pallino sul pulsante "Novità") ---

const LAST_SEEN_CHANGELOG_KEY = 'fitpulse_last_seen_changelog';

export function getLastSeenChangelogVersion(): string | null {
  try {
    return localStorage.getItem(LAST_SEEN_CHANGELOG_KEY);
  } catch {
    return null;
  }
}

export function saveLastSeenChangelogVersion(version: string): void {
  try {
    localStorage.setItem(LAST_SEEN_CHANGELOG_KEY, version);
  } catch (e) {
    console.error('Error saving last seen changelog version', e);
  }
}
