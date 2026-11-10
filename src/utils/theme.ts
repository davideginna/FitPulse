/**
 * Temi dell'app. I colori veri e propri sono in src/index.css
 * (blocchi :root[data-theme="..."]); qui c'è l'elenco mostrato all'utente,
 * il salvataggio della scelta e l'applicazione sul documento.
 */

export type ThemeId = 'smeraldo' | 'oceano' | 'tramonto' | 'viola' | 'carbone' | 'chiaro';

export interface ThemeOption {
  id: ThemeId;
  label: string;
  /** Colori dell'anteprima nel selettore: sfondo, accento, secondario. */
  swatch: [string, string, string];
  /** Colore della barra di stato del telefono (meta theme-color). */
  statusBarColor: string;
}

export const THEMES: ThemeOption[] = [
  { id: 'smeraldo', label: 'Smeraldo', swatch: ['#020617', '#10b981', '#06b6d4'], statusBarColor: '#020617' },
  { id: 'oceano', label: 'Oceano', swatch: ['#020617', '#0ea5e9', '#6366f1'], statusBarColor: '#020617' },
  { id: 'tramonto', label: 'Tramonto', swatch: ['#020617', '#f97316', '#f43f5e'], statusBarColor: '#020617' },
  { id: 'viola', label: 'Viola', swatch: ['#020617', '#8b5cf6', '#d946ef'], statusBarColor: '#020617' },
  { id: 'carbone', label: 'Carbone (OLED)', swatch: ['#000000', '#84cc16', '#14b8a6'], statusBarColor: '#000000' },
  { id: 'chiaro', label: 'Chiaro', swatch: ['#f8fafc', '#059669', '#0284c7'], statusBarColor: '#f8fafc' }
];

export const DEFAULT_THEME: ThemeId = 'smeraldo';

const THEME_STORAGE_KEY = 'fitpulse_theme';

export function getSavedTheme(): ThemeId {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return THEMES.some((t) => t.id === saved) ? (saved as ThemeId) : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

export function saveTheme(id: ThemeId): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, id);
  } catch {
    // Archiviazione non disponibile (es. navigazione privata): il tema vale solo per questa sessione.
  }
}

/** Applica il tema al documento. Va chiamata anche prima del primo render per evitare lampeggi. */
export function applyTheme(id: ThemeId): void {
  const root = document.documentElement;
  if (id === DEFAULT_THEME) delete root.dataset.theme;
  else root.dataset.theme = id;

  const option = THEMES.find((t) => t.id === id);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (option && meta) meta.setAttribute('content', option.statusBarColor);
}
