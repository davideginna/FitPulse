import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { playCountdownBeep, playRestCompleteSound } from '../utils/audio';

export const FreeTimerTab: React.FC = () => {
  const [mode, setMode] = useState<'rest' | 'tabata'>('rest');

  // Quick Rest State
  const [restDuration, setRestDuration] = useState(60);
  const [restTimeLeft, setRestTimeLeft] = useState(60);
  const [isRestRunning, setIsRestRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Tabata / HIIT State
  const [workSec, setWorkSec] = useState(30);
  const [pauseSec, setPauseSec] = useState(15);
  const [totalRounds, setTotalRounds] = useState(8);
  const [currentRound, setCurrentRound] = useState(1);
  const [tabataPhase, setTabataPhase] = useState<'work' | 'rest'>('work');
  const [tabataTimeLeft, setTabataTimeLeft] = useState(30);
  const [isTabataRunning, setIsTabataRunning] = useState(false);

  // Quick Rest countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRestRunning && restTimeLeft > 0) {
      interval = setInterval(() => {
        setRestTimeLeft((prev) => {
          const next = prev - 1;
          if (soundEnabled && next <= 3 && next > 0) {
            playCountdownBeep(580, 0.1);
          }
          if (next === 0) {
            if (soundEnabled) playRestCompleteSound();
            setIsRestRunning(false);
          }
          return Math.max(0, next);
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRestRunning, restTimeLeft, soundEnabled]);

  // Tabata countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTabataRunning) {
      interval = setInterval(() => {
        setTabataTimeLeft((prev) => {
          const next = prev - 1;
          if (soundEnabled && next <= 3 && next > 0) {
            playCountdownBeep(650, 0.08);
          }
          if (next <= 0) {
            if (soundEnabled) playRestCompleteSound();
            if (tabataPhase === 'work') {
              // Switch to rest phase
              setTabataPhase('rest');
              return pauseSec;
            } else {
              // End of rest phase -> check round
              if (currentRound >= totalRounds) {
                setIsTabataRunning(false);
                return 0;
              }
              setCurrentRound((r) => r + 1);
              setTabataPhase('work');
              return workSec;
            }
          }
          return next;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTabataRunning, tabataTimeLeft, tabataPhase, currentRound, totalRounds, workSec, pauseSec, soundEnabled]);

  const selectRestPreset = (secs: number) => {
    setRestDuration(secs);
    setRestTimeLeft(secs);
    setIsRestRunning(false);
  };

  const resetRest = () => {
    setIsRestRunning(false);
    setRestTimeLeft(restDuration);
  };

  const resetTabata = () => {
    setIsTabataRunning(false);
    setCurrentRound(1);
    setTabataPhase('work');
    setTabataTimeLeft(workSec);
  };

  const formatMinSec = (total: number) => {
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-5 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white">Timer & Recupero</h1>
          <p className="text-xs text-slate-400">Cronometro da palestra e intervalli brucia-grassi</p>
        </div>
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 hover:text-white"
        >
          {soundEnabled ? <Volume2 className="w-5 h-5 text-emerald-400" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
        </button>
      </div>

      {/* Mode Switcher */}
      <div className="grid grid-cols-2 p-1 bg-slate-900 rounded-2xl border border-slate-800">
        <button
          onClick={() => setMode('rest')}
          className={`py-2 rounded-xl text-xs font-bold transition ${
            mode === 'rest'
              ? 'bg-emerald-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Recupero Tra Serie
        </button>
        <button
          onClick={() => setMode('tabata')}
          className={`py-2 rounded-xl text-xs font-bold transition ${
            mode === 'tabata'
              ? 'bg-emerald-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          HIIT / Circuiti Brucia Grassi
        </button>
      </div>

      {mode === 'rest' ? (
        /* QUICK REST TIMER */
        <div className="space-y-5">
          {/* Circular Countdown Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden">
            <div className="relative w-60 h-60 flex items-center justify-center">
              <svg className="w-60 h-60 -rotate-90">
                <circle cx="120" cy="120" r="100" className="stroke-slate-800" strokeWidth="12" fill="transparent" />
                <circle
                  cx="120"
                  cy="120"
                  r="100"
                  
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 100}
                  strokeDashoffset={(2 * Math.PI * 100) - ((restTimeLeft / restDuration) * (2 * Math.PI * 100))}
                  strokeLinecap="round"
                  className={`transition-all duration-300 ${restTimeLeft <= 5 ? 'stroke-red-500' : 'stroke-emerald-500'}`}
                />
              </svg>

              <div className="absolute flex flex-col items-center">
                <span className="text-5xl font-black font-mono text-white tracking-tight">
                  {formatMinSec(restTimeLeft)}
                </span>
                <span className="text-xs uppercase font-bold text-slate-400 mt-2">
                  {isRestRunning ? 'Recupero attivo' : 'In attesa'}
                </span>
              </div>
            </div>

            {/* Play / Pause / Reset Actions */}
            <div className="flex items-center space-x-4 mt-6">
              <button
                onClick={resetRest}
                className="p-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl active:scale-95 transition"
                title="Reset"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button
                onClick={() => setIsRestRunning(!isRestRunning)}
                className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl shadow-lg shadow-emerald-500/25 active:scale-95 transition flex items-center gap-2 text-base"
              >
                {isRestRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                <span>{isRestRunning ? 'Pausa' : 'Avvia'}</span>
              </button>

              <button
                onClick={() => setRestTimeLeft((prev) => prev + 15)}
                className="p-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl active:scale-95 transition font-bold text-xs"
              >
                +15s
              </button>
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Tempi Consigliati da Palestra:
            </span>
            <div className="grid grid-cols-3 gap-2">
              {[30, 45, 60, 75, 90, 120].map((secs) => (
                <button
                  key={secs}
                  onClick={() => selectRestPreset(secs)}
                  className={`py-3 rounded-2xl text-xs font-bold transition border ${
                    restDuration === secs
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-inner'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {secs} secondi
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800/60">
              💡 <strong className="text-white">Consiglio Dimagrimento:</strong> Per perdere grasso addominale mantieni i recuperi tra <strong className="text-emerald-400">45 e 75 secondi</strong>. In questo modo ottimizzi il debito d'ossigeno e la secrezione dell'ormone GH.
            </p>
          </div>
        </div>
      ) : (
        /* TABATA & HIIT TIMER */
        <div className="space-y-5">
          <div
            className={`border rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-2xl transition-all ${
              tabataPhase === 'work'
                ? 'bg-emerald-950/40 border-emerald-500/40'
                : 'bg-cyan-950/40 border-cyan-500/40'
            }`}
          >
            <div className="flex items-center space-x-2 mb-2">
              <span
                className={`text-xs uppercase font-extrabold px-3 py-1 rounded-full ${
                  tabataPhase === 'work'
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-cyan-400 text-slate-950'
                }`}
              >
                {tabataPhase === 'work' ? '🔥 LAVORO INTENSO' : '💧 RECUPERO'}
              </span>
            </div>

            <p className="text-xs font-bold text-slate-400 mb-1">
              Round {currentRound} di {totalRounds}
            </p>

            <span className="text-7xl font-black font-mono text-white tracking-tight my-4">
              {tabataTimeLeft}s
            </span>

            <div className="flex items-center space-x-4">
              <button
                onClick={resetTabata}
                className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl active:scale-95 transition"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button
                onClick={() => setIsTabataRunning(!isTabataRunning)}
                className="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl shadow-lg shadow-emerald-500/25 active:scale-95 transition flex items-center gap-2"
              >
                {isTabataRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                <span>{isTabataRunning ? 'Pausa' : 'Avvia HIIT'}</span>
              </button>
            </div>
          </div>

          {/* Configuration controls */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Parametri Circuito
            </h4>

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block mb-1">Lavoro</span>
                <span className="text-base font-extrabold text-emerald-400">{workSec}s</span>
                <div className="flex justify-center gap-1 mt-1">
                  <button onClick={() => setWorkSec((p) => Math.max(10, p - 5))} className="p-1 bg-slate-800 rounded text-xs">-</button>
                  <button onClick={() => setWorkSec((p) => p + 5)} className="p-1 bg-slate-800 rounded text-xs">+</button>
                </div>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block mb-1">Riposo</span>
                <span className="text-base font-extrabold text-cyan-400">{pauseSec}s</span>
                <div className="flex justify-center gap-1 mt-1">
                  <button onClick={() => setPauseSec((p) => Math.max(5, p - 5))} className="p-1 bg-slate-800 rounded text-xs">-</button>
                  <button onClick={() => setPauseSec((p) => p + 5)} className="p-1 bg-slate-800 rounded text-xs">+</button>
                </div>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block mb-1">Round</span>
                <span className="text-base font-extrabold text-white">{totalRounds}</span>
                <div className="flex justify-center gap-1 mt-1">
                  <button onClick={() => setTotalRounds((p) => Math.max(1, p - 1))} className="p-1 bg-slate-800 rounded text-xs">-</button>
                  <button onClick={() => setTotalRounds((p) => p + 1)} className="p-1 bg-slate-800 rounded text-xs">+</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
