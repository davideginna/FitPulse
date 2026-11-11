import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { CHANGELOG } from '../utils/changelog';

interface Props {
  onClose: () => void;
}

/**
 * Formattazione in linea ammessa nel changelog: **grassetto** e `codice`.
 * Restituisce nodi React (niente HTML iniettato).
 */
function renderInline(text: string): React.ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-on-surface">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="px-1 rounded bg-surface-container-highest text-[0.9em]">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  return Number.isNaN(date.getTime())
    ? isoDate
    : date.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
};

/** Bottom sheet "Novità": contenuto di CHANGELOG.md, release più recente in cima. */
export const ChangelogSheet: React.FC<Props> = ({ onClose }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="scrim flex items-end sm:items-center justify-center sm:p-4 animate-in fade-in" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="changelog-title"
        className="sheet w-full max-w-lg max-h-[85vh] flex flex-col"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sheet-handle sm:hidden" />
        <div className="px-6 pt-3 pb-2 flex items-center justify-between">
          <h2 id="changelog-title" className="text-xl font-semibold text-on-surface">
            Novità
          </h2>
          <button onClick={onClose} className="icon-btn -mr-2" aria-label="Chiudi">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto px-6 pb-8 space-y-6">
          {CHANGELOG.map((release, index) => (
            <section key={release.version}>
              <div className="flex items-baseline gap-2 mb-2">
                <h3 className="text-base font-semibold text-on-surface">Versione {release.version}</h3>
                {index === 0 && (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-primary-container text-on-primary-container">
                    Attuale
                  </span>
                )}
                {release.date && <span className="text-xs text-on-surface-variant ml-auto">{formatDate(release.date)}</span>}
              </div>
              {release.sections.map((section, sIdx) => (
                <div key={sIdx} className="mb-3">
                  {section.title && <h4 className="text-sm font-medium text-primary mb-1">{section.title}</h4>}
                  <ul className="space-y-1.5">
                    {section.items.map((item, iIdx) => (
                      <li key={iIdx} className="text-sm text-on-surface-variant leading-relaxed flex gap-2">
                        <span aria-hidden="true">•</span>
                        <span>{renderInline(item)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};
