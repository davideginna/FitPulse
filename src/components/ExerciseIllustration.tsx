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
  /** Altezza del riquadro con la figura (solo versione completa; i controlli stanno sopra). */
  figureHeightClass?: string;
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
  className = 'w-full',
  isAnimated = true,
  compact = false,
  figureHeightClass = 'h-56'
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

  const statusLabel =
    viewMode === 'animated'
      ? isPlaying
        ? `In movimento${isSlowMo ? ' · 0.5x' : ''}`
        : 'In pausa'
      : viewMode === 'phase1'
        ? 'Partenza'
        : 'Picco del movimento';

  const segmentClass = (selected: boolean) => (selected ? 'segment-selected' : 'segment');

  if (compact) {
    return (
      <div className={`flex items-center justify-center bg-surface-container-high select-none ${className}`}>
        <ExerciseFigure
          animationKey={animationKey}
          t={shownT}
          primaryMuscles={exercise.primaryMuscles}
          secondaryMuscles={exercise.secondaryMuscles}
          className="w-full h-full"
        />
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-2 select-none ${className}`}>
      {/* Controlli: pulsante segmentato M3 per la fase + play/pausa e velocità */}
      <div className="flex items-center gap-2">
        <div className="segmented flex-1 bg-surface-container-low">
          <button onClick={() => { setViewMode('animated'); setIsPlaying(true); }} className={segmentClass(viewMode === 'animated')}>
            Movimento
          </button>
          <button onClick={() => { setViewMode('phase1'); setIsPlaying(false); }} className={segmentClass(viewMode === 'phase1')}>
            Partenza
          </button>
          <button onClick={() => { setViewMode('phase2'); setIsPlaying(false); }} className={segmentClass(viewMode === 'phase2')}>
            Picco
          </button>
        </div>
        {viewMode === 'animated' && (
          <>
            <button
              onClick={() => setIsSlowMo(!isSlowMo)}
              className={`icon-btn w-10 text-xs font-semibold ${isSlowMo ? 'bg-secondary-container text-on-secondary-container' : ''}`}
              title="Rallentatore per analizzare la forma"
              aria-pressed={isSlowMo}
            >
              {isSlowMo ? '0.5x' : <Gauge className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="icon-btn bg-primary text-on-primary hover:bg-primary"
              title={isPlaying ? 'Pausa animazione' : 'Riproduci animazione'}
              aria-label={isPlaying ? 'Pausa animazione' : 'Riproduci animazione'}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
            </button>
          </>
        )}
      </div>

      {/* Variante squat: bilanciere o manubri */}
      {exercise.svgType === 'squat' && (
        <div className="segmented self-start">
          <button onClick={() => setSquatVariant('barbell')} className={segmentClass(squatVariant === 'barbell')}>
            Bilanciere
          </button>
          <button onClick={() => setSquatVariant('dumbbell')} className={segmentClass(squatVariant === 'dumbbell')}>
            <Dumbbell className="w-3.5 h-3.5" />
            Manubri
          </button>
        </div>
      )}

      <div className={`relative ${figureHeightClass} rounded-2xl bg-surface-container-high overflow-hidden flex items-center justify-center p-2 pb-7`}>
        <ExerciseFigure
          animationKey={animationKey}
          t={shownT}
          primaryMuscles={exercise.primaryMuscles}
          secondaryMuscles={exercise.secondaryMuscles}
          className="w-full h-full"
        />
        <span className="absolute bottom-2 left-3 text-xs font-medium text-on-surface-variant pointer-events-none">
          {statusLabel}
        </span>
      </div>
    </div>
  );
};
