/**
 * Lettura di CHANGELOG.md per mostrarlo nell'app.
 *
 * Non è un parser Markdown generico: riconosce solo il formato descritto in
 * cima a CHANGELOG.md (## release, ### sezione, - voce). Così non serve una
 * libreria esterna; se in futuro servisse Markdown completo, sostituire
 * parseChangelog con una libreria come "marked".
 */
import changelogMarkdown from '../../CHANGELOG.md?raw';

export interface ChangelogSection {
  title: string;
  items: string[];
}

export interface ChangelogRelease {
  version: string;
  date: string;
  sections: ChangelogSection[];
}

/** "## 1.3.0 — 2026-11-11": versione e data (la data è facoltativa). */
const RELEASE_HEADING = /^##\s+(\S+)(?:\s+[—-]\s+(.+))?$/;

export function parseChangelog(markdown: string): ChangelogRelease[] {
  const withoutComments = markdown.replace(/<!--[\s\S]*?-->/g, '');
  const releases: ChangelogRelease[] = [];

  for (const rawLine of withoutComments.split('\n')) {
    const line = rawLine.trim();
    const release = releases[releases.length - 1];

    const releaseMatch = line.match(RELEASE_HEADING);
    if (releaseMatch) {
      releases.push({ version: releaseMatch[1], date: releaseMatch[2] ?? '', sections: [] });
    } else if (line.startsWith('### ') && release) {
      release.sections.push({ title: line.slice(4).trim(), items: [] });
    } else if (line.startsWith('- ') && release) {
      // Voce fuori da una sezione: la mettiamo in una sezione senza titolo.
      if (release.sections.length === 0) release.sections.push({ title: '', items: [] });
      release.sections[release.sections.length - 1].items.push(line.slice(2).trim());
    }
    // Altre righe (titolo "#", testo libero, righe vuote) vengono ignorate.
  }
  return releases;
}

export const CHANGELOG: ChangelogRelease[] = parseChangelog(changelogMarkdown);

/** Versione più recente, cioè la prima release del file. */
export const LATEST_VERSION: string = CHANGELOG[0]?.version ?? '';

/** Repository GitHub dell'app: qui finiscono le segnalazioni di bug. */
const REPOSITORY_URL = 'https://github.com/davideginna/FitPulse';

/**
 * Link per aprire una nuova issue su GitHub, già etichettata "bug" e con un
 * modello da compilare. Contiene solo la versione dell'app: nessun dato personale.
 */
export function buildBugReportUrl(): string {
  const body = [
    `**Versione app:** ${LATEST_VERSION}`,
    '',
    '**Cosa è successo**',
    '',
    '',
    '**Cosa ti aspettavi**',
    '',
    '',
    '**Passi per riprodurre**',
    '1. ',
    ''
  ].join('\n');
  const params = new URLSearchParams({ labels: 'bug', body });
  return `${REPOSITORY_URL}/issues/new?${params.toString()}`;
}
