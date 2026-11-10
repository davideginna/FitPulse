import React, { useEffect, useRef, useState } from 'react';
import { Exercise } from '../types';
import { Play, Pause, Gauge, Dumbbell } from 'lucide-react';
import { ExerciseFigure } from './exerciseFigure/ExerciseFigure';
import { getExerciseAnimation } from './exerciseFigure/animations';

interface Props {
  exercise: Exercise;
  className?: string;
  isAnimated?: boolean;
  /** Miniatura: solo il disegno statico, senza controlli né animazione. */
  compact?: boolean;
}

type ViewMode = 'animated' | 'phase1' | 'phase2';

/** Istanti del ciclo mostrati dai pulsanti "Partenza" e "Picco" e nelle miniature. */
const START_T = 0;
const PEAK_T = 0.5;

/**
 * Contenitore dell'animazione: gestisce i controlli (play/pausa, rallentatore,
 * fasi) e fa avanzare il tempo t con requestAnimationFrame.
 * Il disegno vero e proprio è in exerciseFigure/.
 */
export const ExerciseIllustration: React.FC<Props> = ({
  exercise,
  className = 'w-full h-56',
  isAnimated = true,
  compact = false
}) => {
  const [isPlaying, setIsPlaying] = useState(isAnimated);
  const [viewMode, setViewMode] = useState<ViewMode>('animated');
  const [isSlowMo, setIsSlowMo] = useState(false);
  const [squatVariant, setSquatVariant] = useState<'barbell' | 'dumbbell'>('barbell');
  const [t, setT] = useState(START_T);

  const animationKey =
    exercise.svgType === 'squat' && squatVariant === 'dumbbell' ? 'squat_dumbbell' : exercise.svgType;
  const animation = getExerciseAnimation(animationKey);
  const isRunning = isPlaying && viewMode === 'animated' && !compact;

  // Il tempo continua da dove era rimasto quando si riprende dopo una pausa.
  const tRef = useRef(t);
  tRef.current = t;

  useEffect(() => {
    if (!isRunning) return;
    const cycleMs = animation.durationSeconds * 1000 * (isSlowMo ? 2 : 1);
    let last = performance.now();
    let frameId = requestAnimationFrame(function tick(now) {
      const next = (tRef.current + (now - last) / cycleMs) % 1;
      last = now;
      setT(next);
      frameId = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frameId);
  }, [isRunning, isSlowMo, animation]);

  let shownT = t;
  if (compact || viewMode === 'phase2') shownT = PEAK_T;
  else if (viewMode === 'phase1') shownT = START_T;

  return (
    <div className={`relative flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 rounded-2xl overflow-hidden border border-slate-800/90 shadow-2xl select-none ${className}`}>
      {/* Griglia luminosa di sfondo */}
      <div className="absolute inset-0 bg-[radial-gradient(var(--color-emerald-500)_1px,transparent_1px)] [background-size:18px_18px] opacity-15 pointer-events-none" />
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

      {!compact && (
        <div className="absolute top-2.5 left-3 right-3 z-10 flex items-center justify-between pointer-events-auto">
          <div className="flex items-center space-x-1 bg-slate-950/85 backdrop-blur-md px-1.5 py-1 rounded-xl border border-slate-800/80 text-[10px] font-semibold shadow-lg">
            <button
              onClick={() => { setViewMode('animated'); setIsPlaying(true); }}
              className={`px-2.5 py-0.5 rounded-lg transition-all ${
                viewMode === 'animated' ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Movimento
            </button>
            <button
              onClick={() => { setViewMode('phase1'); setIsPlaying(false); }}
              className={`px-2 py-0.5 rounded-lg transition-all ${
                viewMode === 'phase1' ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              1. Partenza
            </button>
            <button
              onClick={() => { setViewMode('phase2'); setIsPlaying(false); }}
              className={`px-2 py-0.5 rounded-lg transition-all ${
                viewMode === 'phase2' ? 'bg-emerald-400 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              2. Picco
            </button>
          </div>

          {viewMode === 'animated' && (
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsSlowMo(!isSlowMo)}
                className={`px-2 py-1 rounded-xl border border-slate-800/80 backdrop-blur-md text-[10px] font-bold transition flex items-center gap-1 ${
                  isSlowMo ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' : 'bg-slate-950/80 text-slate-400 hover:text-white'
                }`}
                title="Attiva rallentatore per analizzare la forma"
              >
                <Gauge className="w-3 h-3" />
                <span>{isSlowMo ? '0.5x' : '1x'}</span>
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 bg-slate-950/85 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-800/80 backdrop-blur-md transition active:scale-95 shadow-lg"
                title={isPlaying ? 'Pausa animazione' : 'Riproduci animazione'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 text-emerald-400" /> : <Play className="w-3.5 h-3.5 fill-current text-emerald-400" />}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Variante squat: bilanciere o manubri */}
      {!compact && exercise.svgType === 'squat' && (
        <div className="absolute top-12 left-3 z-10 flex items-center bg-slate-950/90 backdrop-blur-md p-0.5 rounded-lg border border-slate-800/80 text-[9px] font-bold shadow-md">
          <button
            onClick={() => setSquatVariant('barbell')}
            className={`px-2 py-0.5 rounded-md transition ${
              squatVariant === 'barbell' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Bilanciere
          </button>
          <button
            onClick={() => setSquatVariant('dumbbell')}
            className={`px-2 py-0.5 rounded-md transition flex items-center gap-1 ${
              squatVariant === 'dumbbell' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Dumbbell className="w-2.5 h-2.5" />
            Manubri
          </button>
        </div>
      )}

      <div className={`w-full h-full flex items-center justify-center ${compact ? 'p-1' : 'p-2 pt-5 pb-5'}`}>
        <ExerciseFigure animationKey={animationKey} t={shownT} className="w-full h-full max-h-56" />
      </div>

      {!compact && (
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] font-medium pointer-events-none">
          <span className="bg-slate-900/90 backdrop-blur px-2.5 py-1 rounded-md border border-slate-700/60 text-emerald-400 font-bold shadow-md">
            {viewMode === 'animated'
              ? isPlaying
                ? `In movimento${isSlowMo ? ' · rallentatore' : ''}`
                : 'In pausa'
              : viewMode === 'phase1'
                ? '1. Partenza'
                : '2. Picco del movimento'}
          </span>
          <span className="bg-slate-900/90 backdrop-blur px-2.5 py-1 rounded-md border border-slate-700/60 text-cyan-400 font-semibold shadow-md">
            {exercise.category}
          </span>
        </div>
      )}
    </div>
  );
};
