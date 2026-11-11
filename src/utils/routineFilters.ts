/**
 * Filtri e ordinamento delle schede nella tab "Allenati".
 * Funzioni pure (nessuno stato React) così si possono verificare a parte.
 */
import { Routine } from '../types';

/** Fasce di difficoltà mostrate all'utente; raggruppano i valori di Routine.level. */
export type DifficultyFilter = 'tutte' | 'facile' | 'media' | 'difficile';
/** Fasce di durata, in minuti stimati. */
export type DurationFilter = 'tutte' | 'breve' | 'media' | 'lunga';
export type RoutineSort = 'difficolta_asc' | 'difficolta_desc' | 'durata_asc' | 'durata_desc';

export const DEFAULT_SORT: RoutineSort = 'difficolta_asc';

export const DIFFICULTY_OPTIONS: { id: DifficultyFilter; label: string }[] = [
  { id: 'tutte', label: 'Tutte' },
  { id: 'facile', label: 'Facile' },
  { id: 'media', label: 'Media' },
  { id: 'difficile', label: 'Difficile' }
];

/** Limiti delle fasce di durata (minuti, inclusi). */
const SHORT_MAX_MINUTES = 25;
const MEDIUM_MAX_MINUTES = 45;

export const DURATION_OPTIONS: { id: DurationFilter; label: string }[] = [
  { id: 'tutte', label: 'Qualsiasi' },
  { id: 'breve', label: `Fino a ${SHORT_MAX_MINUTES}'` },
  { id: 'media', label: `${SHORT_MAX_MINUTES + 1}–${MEDIUM_MAX_MINUTES}'` },
  { id: 'lunga', label: `Oltre ${MEDIUM_MAX_MINUTES}'` }
];

export const SORT_OPTIONS: { id: RoutineSort; label: string }[] = [
  { id: 'difficolta_asc', label: 'Dalla più facile' },
  { id: 'difficolta_desc', label: 'Dalla più difficile' },
  { id: 'durata_asc', label: 'Dalla più breve' },
  { id: 'durata_desc', label: 'Dalla più lunga' }
];

/**
 * Grado di difficoltà di ogni livello, dal più facile.
 * "Tutti i livelli" è adattabile a un principiante, quindi sta subito dopo.
 * Il tipo Record obbliga ad aggiornare questa tabella se si aggiunge un livello.
 */
const LEVEL_RANK: Record<Routine['level'], number> = {
  Principiante: 0,
  'Tutti i livelli': 1,
  Intermedio: 2,
  Avanzato: 3,
  Intenso: 4
};

function difficultyBand(level: Routine['level']): Exclude<DifficultyFilter, 'tutte'> {
  const rank = LEVEL_RANK[level];
  if (rank <= LEVEL_RANK['Tutti i livelli']) return 'facile';
  if (rank === LEVEL_RANK.Intermedio) return 'media';
  return 'difficile';
}

function durationBand(minutes: number): Exclude<DurationFilter, 'tutte'> {
  if (minutes <= SHORT_MAX_MINUTES) return 'breve';
  if (minutes <= MEDIUM_MAX_MINUTES) return 'media';
  return 'lunga';
}

export function filterAndSortRoutines(
  routines: Routine[],
  difficulty: DifficultyFilter,
  duration: DurationFilter,
  sort: RoutineSort
): Routine[] {
  const filtered = routines.filter(
    (r) =>
      (difficulty === 'tutte' || difficultyBand(r.level) === difficulty) &&
      (duration === 'tutte' || durationBand(r.estimatedDurationMinutes) === duration)
  );

  const byDifficulty = (a: Routine, b: Routine) => LEVEL_RANK[a.level] - LEVEL_RANK[b.level];
  const byDuration = (a: Routine, b: Routine) => a.estimatedDurationMinutes - b.estimatedDurationMinutes;

  // A parità del criterio principale si usa l'altro, così l'ordine è sempre stabile e sensato.
  const compare = (a: Routine, b: Routine): number => {
    switch (sort) {
      case 'difficolta_asc':
        return byDifficulty(a, b) || byDuration(a, b);
      case 'difficolta_desc':
        return byDifficulty(b, a) || byDuration(b, a);
      case 'durata_asc':
        return byDuration(a, b) || byDifficulty(a, b);
      case 'durata_desc':
        return byDuration(b, a) || byDifficulty(b, a);
    }
  };

  return [...filtered].sort(compare);
}
