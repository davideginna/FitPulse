import React, { useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import {
  FreeTimerControls,
  getRestRemainingMs,
  getTabataRemainingMs,
  toDisplaySeconds
} from '../hooks/useFreeTimer';

interface Props {
  /** Stato e azioni del timer, posseduti da App (vedi useFreeTimer) per sopravvivere al cambio tab. */
  timer: FreeTimerControls;
}

const DISPLAY_REFRESH_MS = 250;

export const FreeTimerTab: React.FC<Props> = ({ timer }) => {
  const { state, isAnyRunning } = timer;

  // Questo componente non conta il tempo: legge Date.now() a ogni render e calcola
  // il residuo da `endsAt`. Lo stato qui sotto serve solo a forzare un re-render
  // periodico mentre un timer scorre, per aggiornare il display.
  const [, setRefreshTick] = useState(0);
  useEffect(() => {
    if (!isAnyRunning) return;
    const interval = setInterval(() => setRefreshTick((n) => n + 1), DISPLAY_REFRESH_MS);
    return () => clearInterval(interval);
  }, [isAnyRunning]);

  const now = Date.now();
  const mode = state.mode;
  const soundEnabled = state.soundEnabled;

  const restDuration = state.restDurationSec;
  const restTimeLeft = toDisplaySeconds(getRestRemainingMs(state, now));
  const isRestRunning = state.rest.status === 'running';
  // Con "+15s" il residuo può superare la durata scelta: limitiamo l'anello a pieno.
  const restProgress = Math.min(1, restTimeLeft / restDuration);

  const workSec = state.workSec;
  const pauseSec = state.pauseSec;
  const totalRounds = state.totalRounds;
  const currentRound = state.tabataRound;
  const tabataPhase = state.tabataPhase;
  const tabataTimeLeft = toDisplaySeconds(getTabataRemainingMs(state, now));
  const isTabataRunning = state.tabata.status === 'running';

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
          onClick={timer.toggleSound}
          className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 hover:text-white"
        >
          {soundEnabled ? <Volume2 className="w-5 h-5 text-emerald-400" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
        </button>
      </div>

      {/* Mode Switcher */}
      <div className="grid grid-cols-2 p-1 bg-slate-900 rounded-2xl border border-slate-800">
        <button
          onClick={() => timer.setMode('rest')}
          className={`py-2 rounded-xl text-xs font-bold transition ${
            mode === 'rest'
              ? 'bg-emerald-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Recupero Tra Serie
        </button>
        <button
          onClick={() => timer.setMode('tabata')}
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
                  strokeDashoffset={(2 * Math.PI * 100) - (restProgress * (2 * Math.PI * 100))}
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
                onClick={timer.resetRest}
                className="p-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl active:scale-95 transition"
                title="Reset"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button
                onClick={timer.toggleRest}
                className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl shadow-lg shadow-emerald-500/25 active:scale-95 transition flex items-center gap-2 text-base"
              >
                {isRestRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                <span>{isRestRunning ? 'Pausa' : 'Avvia'}</span>
              </button>

              <button
                onClick={() => timer.addRestTime(15)}
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
                  onClick={() => timer.selectRestPreset(secs)}
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
                onClick={timer.resetTabata}
                className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl active:scale-95 transition"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button
                onClick={timer.toggleTabata}
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
                  <button onClick={() => timer.changeWorkSec(-5)} className="p-1 bg-slate-800 rounded text-xs">-</button>
                  <button onClick={() => timer.changeWorkSec(5)} className="p-1 bg-slate-800 rounded text-xs">+</button>
                </div>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block mb-1">Riposo</span>
                <span className="text-base font-extrabold text-cyan-400">{pauseSec}s</span>
                <div className="flex justify-center gap-1 mt-1">
                  <button onClick={() => timer.changePauseSec(-5)} className="p-1 bg-slate-800 rounded text-xs">-</button>
                  <button onClick={() => timer.changePauseSec(5)} className="p-1 bg-slate-800 rounded text-xs">+</button>
                </div>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block mb-1">Round</span>
                <span className="text-base font-extrabold text-white">{totalRounds}</span>
                <div className="flex justify-center gap-1 mt-1">
                  <button onClick={() => timer.changeTotalRounds(-1)} className="p-1 bg-slate-800 rounded text-xs">-</button>
                  <button onClick={() => timer.changeTotalRounds(1)} className="p-1 bg-slate-800 rounded text-xs">+</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
