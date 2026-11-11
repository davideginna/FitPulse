import React, { useEffect, useRef, useState } from 'react';
import { Check, Palette } from 'lucide-react';
import { THEMES, ThemeId, applyTheme, getSavedTheme, saveTheme } from '../utils/theme';

/** Pulsante nell'intestazione che apre l'elenco dei temi. */
export const ThemePicker: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [current, setCurrent] = useState<ThemeId>(() => getSavedTheme());
  const containerRef = useRef<HTMLDivElement>(null);

  // Chiude il menu toccando fuori.
  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isOpen]);

  const choose = (id: ThemeId) => {
    setCurrent(id);
    applyTheme(id);
    saveTheme(id);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="icon-btn"
        title="Cambia tema"
        aria-label="Cambia tema"
        aria-expanded={isOpen}
      >
        <Palette className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-56 bg-surface-container-high rounded-xl shadow-xl py-2 z-50">
          <div className="px-4 pt-1 pb-2 text-xs font-medium text-on-surface-variant">Tema</div>
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => choose(theme.id)}
              className={`w-full flex items-center gap-3 px-4 h-12 text-sm text-left transition ${
                current === theme.id ? 'bg-on-surface/10 text-on-surface font-semibold' : 'text-on-surface hover:bg-on-surface/8'
              }`}
            >
              {/* Anteprima con colori fissi: deve mostrare il tema anche quando non è attivo. */}
              <span className="flex -space-x-1.5">
                {theme.swatch.map((color, i) => (
                  <span key={i} className="w-4 h-4 rounded-full border border-outline-variant" style={{ backgroundColor: color }} />
                ))}
              </span>
              <span className="flex-1">{theme.label}</span>
              {current === theme.id && <Check className="w-4 h-4 text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
