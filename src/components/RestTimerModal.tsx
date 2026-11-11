import React, { useEffect, useState, useRef } from 'react';
import { Play, Pause, Plus, Minus, SkipForward, Volume2, VolumeX, Minimize2, Maximize2 } from 'lucide-react';
import { playCountdownBeep, playRestCompleteSound } from '../utils/audio';

interface Props {
  initialSeconds: number;
  exerciseName: string;
  nextExerciseName?: string;
  setNumber: number;
  totalSets: number;
  onComplete: () => void;
  onClose: () => void;
}

export const RestTimerModal: React.FC<Props> = ({
  initialSeconds,
  exerciseName,
  nextExerciseName,
  setNumber,
  totalSets,
  onComplete,
  onClose
}) => {
  const [totalTime, setTotalTime] = useState(initialSeconds);
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const hasAlertedRef = useRef(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          const next = prev - 1;
          if (soundEnabled && next <= 3 && next > 0) {
            playCountdownBeep(520, 0.1);
          }
          if (next === 0 && !hasAlertedRef.current) {
            hasAlertedRef.current = true;
            if (soundEnabled) playRestCompleteSound();
            setTimeout(() => {
              onComplete();
            }, 600);
          }
          return Math.max(0, next);
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, secondsLeft, soundEnabled, onComplete]);

  const progress = totalTime > 0 ? (secondsLeft / totalTime) * 100 : 0;
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const addTime = (delta: number) => {
    setSecondsLeft((prev) => {
      const next = Math.max(5, prev + delta);
      if (next > totalTime) setTotalTime(next);
      return next;
    });
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const isEnding = secondsLeft <= 5;

  if (isMinimized) {
    const miniLength = 2 * Math.PI * 16;
    return (
      <div className="fixed bottom-24 left-4 right-4 z-50 max-w-md mx-auto bg-surface-container-highest rounded-2xl p-3 shadow-xl flex items-center justify-between gap-2 animate-in slide-in-from-bottom">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative w-10 h-10 flex-shrink-0 flex items-center justify-center">
            <svg className="w-10 h-10 -rotate-90" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="16" className="stroke-outline-variant" strokeWidth="3" fill="transparent" />
              <circle
                cx="20"
                cy="20"
                r="16"
                className="stroke-primary"
                strokeWidth="3"
                fill="transparent"
                strokeDasharray={miniLength}
                strokeDashoffset={miniLength - (secondsLeft / totalTime) * miniLength}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-xs font-semibold tabular-nums text-on-surface">{secondsLeft}</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs text-on-surface-variant">Recupero</p>
            <p className="text-sm font-medium text-on-surface truncate">{exerciseName}</p>
          </div>
        </div>
        <div className="flex items-center">
          <button onClick={() => setIsRunning(!isRunning)} className="icon-btn" aria-label={isRunning ? 'Pausa' : 'Riprendi'}>
            {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <button onClick={() => setIsMinimized(false)} className="icon-btn" aria-label="Espandi">
            <Maximize2 className="w-5 h-5" />
          </button>
          <button onClick={onClose} className="btn-text px-3">
            Salta
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="scrim flex items-center justify-center p-4 animate-in fade-in">
      <div className="dialog relative w-full max-w-sm flex flex-col items-center text-center">
        <div className="w-full flex items-center justify-between -mt-2 mb-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="icon-btn -ml-2"
            aria-label={soundEnabled ? 'Disattiva suono' : 'Attiva suono'}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-primary" /> : <VolumeX className="w-5 h-5" />}
          </button>
          <span className="text-sm font-medium text-on-surface-variant">Recupero</span>
          <button onClick={() => setIsMinimized(true)} className="icon-btn -mr-2" aria-label="Riduci" title="Riduci">
            <Minimize2 className="w-5 h-5" />
          </button>
        </div>

        <h3 className="text-xl font-semibold text-on-surface line-clamp-2">{exerciseName}</h3>
        <p className="text-sm text-on-surface-variant mb-5">
          Serie {setNumber} di {totalSets} completata
        </p>

        <div className="relative w-56 h-56 flex items-center justify-center mb-5">
          <svg className="w-56 h-56 -rotate-90" viewBox="0 0 224 224">
            <circle cx="112" cy="112" r={radius} className="stroke-surface-container-highest" strokeWidth="10" fill="transparent" />
            <circle
              cx="112"
              cy="112"
              r={radius}
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={`transition-all duration-300 ${isEnding ? 'stroke-error' : 'stroke-primary'}`}
            />
          </svg>

          <div className="absolute flex flex-col items-center">
            <span className={`text-6xl font-normal tabular-nums ${isEnding ? 'text-error' : 'text-on-surface'}`}>
              {formatTime(secondsLeft)}
            </span>
            <span className="text-sm text-on-surface-variant mt-1">{isRunning ? 'Riposa e bevi' : 'In pausa'}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => addTime(-15)} className="btn-tonal px-4">
            <Minus className="w-4 h-4" />
            15s
          </button>
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="btn-filled w-16 h-16 p-0 rounded-2xl"
            aria-label={isRunning ? 'Pausa' : 'Riprendi'}
          >
            {isRunning ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 fill-current" />}
          </button>
          <button onClick={() => addTime(15)} className="btn-tonal px-4">
            <Plus className="w-4 h-4" />
            15s
          </button>
        </div>

        {nextExerciseName && (
          <div className="w-full bg-surface-container-highest rounded-xl px-4 py-3 mb-4 text-left">
            <span className="text-xs text-on-surface-variant">Prossimo</span>
            <p className="text-sm font-medium text-on-surface truncate">{nextExerciseName}</p>
          </div>
        )}

        <button onClick={onClose} className="btn-outlined w-full">
          <SkipForward className="w-4 h-4" />
          Salta il recupero
        </button>
      </div>
    </div>
  );
};
