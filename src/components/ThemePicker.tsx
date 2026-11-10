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
        className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white active:scale-95 transition"
        title="Cambia tema"
        aria-label="Cambia tema"
        aria-expanded={isOpen}
      >
        <Palette className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-1.5 z-50">
          <div className="px-2.5 pt-1 pb-2 text-[11px] font-bold uppercase tracking-wide text-slate-400">Tema</div>
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => choose(theme.id)}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-sm text-left transition ${
                current === theme.id ? 'bg-slate-800 text-white font-bold' : 'text-slate-300 hover:bg-slate-800/60'
              }`}
            >
              {/* Anteprima con colori fissi: deve mostrare il tema anche quando non è attivo. */}
              <span className="flex -space-x-1.5">
                {theme.swatch.map((color, i) => (
                  <span key={i} className="w-4 h-4 rounded-full border border-slate-600" style={{ backgroundColor: color }} />
                ))}
              </span>
              <span className="flex-1">{theme.label}</span>
              {current === theme.id && <Check className="w-4 h-4 text-emerald-400" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
