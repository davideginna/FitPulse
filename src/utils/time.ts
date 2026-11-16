/** Formattazione dei tempi mostrati da timer e allenamento. */

/** "m:ss" (oppure "h:mm:ss" dall'ora in su), es. 75 → "1:15". */
export function formatClock(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const pad = (n: number) => (n < 10 ? '0' : '') + n;
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

/** Durata in parole brevi: 45 → "45s", 600 → "10 min", 90 → "1:30". */
export function formatDuration(totalSeconds: number): string {
  if (totalSeconds < 60) return `${totalSeconds}s`;
  if (totalSeconds % 60 === 0) return `${totalSeconds / 60} min`;
  return formatClock(totalSeconds);
}

/** Secondi da mostrare in un conto alla rovescia: per eccesso, così "0" compare solo alla fine. */
export function toCountdownSeconds(ms: number): number {
  return Math.ceil(ms / 1000);
}
