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

  if (isMinimized) {
    return (
      <div className="fixed bottom-20 left-4 right-4 z-50 bg-slate-900/95 backdrop-blur-md border border-emerald-500/40 rounded-2xl p-3.5 shadow-2xl flex items-center justify-between animate-in slide-in-from-bottom">
        <div className="flex items-center space-x-3">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <svg className="w-10 h-10 -rotate-90">
              <circle cx="20" cy="20" r="16" className="stroke-slate-700" strokeWidth="3" fill="transparent" />
              <circle
                cx="20"
                cy="20"
                r="16"
                className="stroke-emerald-500"
                strokeWidth="3"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 16}
                strokeDashoffset={(2 * Math.PI * 16) - ((secondsLeft / totalTime) * (2 * Math.PI * 16))}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-xs font-bold font-mono text-emerald-400">{secondsLeft}</span>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Recupero in corso</p>
            <p className="text-sm font-bold text-white truncate max-w-[150px]">{exerciseName}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="p-2 bg-slate-800 text-slate-200 rounded-lg active:scale-95 transition"
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-emerald-400" />}
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold active:scale-95"
          >
            Salta
          </button>
          <button
            onClick={() => setIsMinimized(false)}
            className="p-2 text-slate-400 hover:text-white"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center">
        {/* Top actions */}
        <div className="w-full flex items-center justify-between mb-4">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 text-slate-400 hover:text-slate-200 bg-slate-800/60 rounded-xl"
            title="Audio beeps"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-emerald-400" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
          </button>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Recupero Muscolare
          </span>
          <button
            onClick={() => setIsMinimized(true)}
            className="p-2 text-slate-400 hover:text-slate-200 bg-slate-800/60 rounded-xl"
            title="Riduci a icona"
          >
            <Minimize2 className="w-5 h-5" />
          </button>
        </div>

        {/* Exercise info */}
        <h3 className="text-lg font-bold text-white mb-0.5 line-clamp-2">{exerciseName}</h3>
        <p className="text-xs text-slate-400 mb-6">
          Serie {setNumber} di {totalSets} completata
        </p>

        {/* Big Circular Countdown Ring */}
        <div className="relative w-56 h-56 flex items-center justify-center mb-6">
          <svg className="w-56 h-56 -rotate-90">
            <circle
              cx="112"
              cy="112"
              r={radius}
              className="stroke-slate-800"
              strokeWidth="10"
              fill="transparent"
            />
            <circle
              cx="112"
              cy="112"
              r={radius}
              
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={`transition-all duration-300 ${secondsLeft <= 5 ? 'stroke-red-500' : 'stroke-emerald-500'}`}
            />
          </svg>

          <div className="absolute flex flex-col items-center">
            <span className={`text-5xl font-black font-mono tracking-tight ${secondsLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
              {formatTime(secondsLeft)}
            </span>
            <span className="text-xs text-slate-400 mt-1 uppercase font-semibold tracking-wider">
              {isRunning ? 'Riposati & Bevi' : 'In Pausa'}
            </span>
          </div>
        </div>

        {/* Time adjustment buttons */}
        <div className="flex items-center space-x-3 mb-6">
          <button
            onClick={() => addTime(-15)}
            className="flex items-center space-x-1 px-3.5 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold active:scale-95 transition"
          >
            <Minus className="w-3.5 h-3.5" />
            <span>15s</span>
          </button>
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="p-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl shadow-lg shadow-emerald-500/25 active:scale-95 transition"
          >
            {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-current" />}
          </button>
          <button
            onClick={() => addTime(15)}
            className="flex items-center space-x-1 px-3.5 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold active:scale-95 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>15s</span>
          </button>
        </div>

        {/* Next exercise teaser */}
        {nextExerciseName && (
          <div className="w-full bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 mb-4 text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">Prossimo:</span>
            <p className="text-xs font-medium text-slate-200 truncate">{nextExerciseName}</p>
          </div>
        )}

        {/* Skip button */}
        <button
          onClick={onClose}
          className="w-full flex items-center justify-center space-x-2 py-3 bg-slate-800/70 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-sm font-semibold transition active:scale-98"
        >
          <SkipForward className="w-4 h-4" />
          <span>Salta Recupero & Riparti</span>
        </button>
      </div>
    </div>
  );
};
