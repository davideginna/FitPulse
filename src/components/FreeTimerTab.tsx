import React, { useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Check, Minus, Plus } from 'lucide-react';
import {
  FreeTimerControls,
  TabataPhase,
  getRestRemainingMs,
  getStopwatchElapsedMs,
  getTabataRemainingMs
} from '../hooks/useFreeTimer';
import { formatClock, toCountdownSeconds } from '../utils/time';

interface Props {
  /** Stato e azioni del timer, posseduti da App (vedi useFreeTimer) per sopravvivere al cambio tab. */
  timer: FreeTimerControls;
}

/** Il cronometro mostra i decimi, quindi si aggiorna più spesso dei conti alla rovescia. */
const DISPLAY_REFRESH_MS = 100;

const TABATA_PHASE_LOOK: Record<TabataPhase, { label: string; cardClass: string }> = {
  prepare: { label: '⏳ Preparati', cardClass: 'bg-surface-container-highest text-on-surface' },
  work: { label: '🔥 Lavoro', cardClass: 'bg-primary-container text-on-primary-container' },
  rest: { label: '💧 Recupero', cardClass: 'bg-secondary-container text-on-secondary-container' }
};

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
  const restTimeLeft = toCountdownSeconds(getRestRemainingMs(state, now));
  const isRestRunning = state.rest.status === 'running';
  // Con "+15s" il residuo può superare la durata scelta: limitiamo l'anello a pieno.
  const restProgress = Math.min(1, restTimeLeft / restDuration);

  const workSec = state.workSec;
  const pauseSec = state.pauseSec;
  const totalRounds = state.totalRounds;
  const currentRound = state.tabataRound;
  const tabataPhase = state.tabataPhase;
  const tabataTimeLeft = toCountdownSeconds(getTabataRemainingMs(state, now));
  const isTabataRunning = state.tabata.status === 'running';

  const tabataLook = TABATA_PHASE_LOOK[tabataPhase];
  // Lavoro e riposo che mancano dopo la fase in corso (il circuito finisce con l'ultimo lavoro).
  const roundsAfterCurrent = totalRounds - currentRound;
  const tabataTotalLeft =
    tabataTimeLeft +
    roundsAfterCurrent * (workSec + pauseSec) +
    (tabataPhase === 'prepare' ? workSec : 0) -
    (tabataPhase === 'rest' ? pauseSec : 0);

  const stopwatchMs = getStopwatchElapsedMs(state, now);
  const isStopwatchRunning = state.stopwatch.startedAt !== null;
  const stopwatchTenths = Math.floor((stopwatchMs % 1000) / 100);

  /** Riga "etichetta, valore, - e +" per i parametri del circuito HIIT. */
  const stepper = (label: string, value: string, onMinus: () => void, onPlus: () => void) => (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-on-surface">{label}</span>
      <div className="flex items-center gap-1">
        <button onClick={onMinus} className="icon-btn" aria-label={`Diminuisci ${label}`}>
          <Minus className="w-5 h-5" />
        </button>
        <span className="w-12 text-center text-base font-semibold tabular-nums text-on-surface">{value}</span>
        <button onClick={onPlus} className="icon-btn" aria-label={`Aumenta ${label}`}>
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  const RING_RADIUS = 100;
  const ringLength = 2 * Math.PI * RING_RADIUS;

  return (
    <div className="space-y-5 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-on-surface">Timer</h1>
          <p className="text-sm text-on-surface-variant">Recuperi, intervalli HIIT e cronometro</p>
        </div>
        <button
          onClick={timer.toggleSound}
          className="icon-btn"
          aria-label={soundEnabled ? 'Disattiva suono' : 'Attiva suono'}
          title={soundEnabled ? 'Suono attivo' : 'Suono disattivato'}
        >
          {soundEnabled ? <Volume2 className="w-5 h-5 text-primary" /> : <VolumeX className="w-5 h-5" />}
        </button>
      </div>

      <div className="segmented w-full">
        <button onClick={() => timer.setMode('rest')} className={mode === 'rest' ? 'segment-selected min-h-10' : 'segment min-h-10'}>
          {mode === 'rest' && <Check className="w-4 h-4" />}
          Recupero
        </button>
        <button onClick={() => timer.setMode('tabata')} className={mode === 'tabata' ? 'segment-selected min-h-10' : 'segment min-h-10'}>
          {mode === 'tabata' && <Check className="w-4 h-4" />}
          HIIT
        </button>
        <button onClick={() => timer.setMode('stopwatch')} className={mode === 'stopwatch' ? 'segment-selected min-h-10' : 'segment min-h-10'}>
          {mode === 'stopwatch' && <Check className="w-4 h-4" />}
          Cronometro
        </button>
      </div>

      {mode === 'stopwatch' && (
        <div className="card p-6 flex flex-col items-center text-center">
          <span className="text-7xl font-normal tabular-nums text-on-surface my-6" role="timer">
            {formatClock(stopwatchMs / 1000)}
            <span className="text-4xl text-on-surface-variant">.{stopwatchTenths}</span>
          </span>
          <div className="flex items-center gap-3">
            <button onClick={timer.resetStopwatch} className="icon-btn w-14 h-14 bg-surface-container-highest" aria-label="Azzera" title="Azzera">
              <RotateCcw className="w-6 h-6" />
            </button>
            <button onClick={timer.toggleStopwatch} className="btn-filled h-14 px-8 text-base min-w-36">
              {isStopwatchRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
              {isStopwatchRunning ? 'Pausa' : stopwatchMs > 0 ? 'Riprendi' : 'Avvia'}
            </button>
          </div>
        </div>
      )}

      {mode === 'rest' && (
        <div className="space-y-5">
          <div className="card p-6 flex flex-col items-center text-center">
            <div className="relative w-60 h-60 flex items-center justify-center">
              <svg className="w-60 h-60 -rotate-90" viewBox="0 0 240 240">
                <circle cx="120" cy="120" r={RING_RADIUS} className="stroke-surface-container-highest" strokeWidth="10" fill="transparent" />
                <circle
                  cx="120"
                  cy="120"
                  r={RING_RADIUS}
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray={ringLength}
                  strokeDashoffset={ringLength - restProgress * ringLength}
                  strokeLinecap="round"
                  className={`transition-all duration-300 ${restTimeLeft <= 5 ? 'stroke-error' : 'stroke-primary'}`}
                />
              </svg>

              <div className="absolute flex flex-col items-center">
                <span className="text-6xl font-normal tabular-nums text-on-surface">{formatClock(restTimeLeft)}</span>
                <span className="text-sm text-on-surface-variant mt-1">{isRestRunning ? 'Recupero in corso' : state.rest.status === 'paused' ? 'In pausa' : 'Pronto'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button onClick={timer.resetRest} className="icon-btn w-14 h-14 bg-surface-container-highest" aria-label="Azzera" title="Azzera">
                <RotateCcw className="w-6 h-6" />
              </button>
              <button onClick={timer.toggleRest} className="btn-filled h-14 px-8 text-base min-w-36">
                {isRestRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                {isRestRunning ? 'Pausa' : state.rest.status === 'paused' ? 'Riprendi' : 'Avvia'}
              </button>
              <button onClick={() => timer.addRestTime(15)} className="icon-btn w-14 h-14 bg-surface-container-highest text-sm font-semibold text-on-surface">
                +15s
              </button>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-on-surface-variant mb-2">Durata del recupero</p>
            <div className="flex flex-wrap gap-2">
              {[30, 45, 60, 75, 90, 120].map((secs) => (
                <button
                  key={secs}
                  onClick={() => timer.selectRestPreset(secs)}
                  aria-pressed={restDuration === secs}
                  className={restDuration === secs ? 'chip-selected' : 'chip'}
                >
                  {restDuration === secs && <Check className="w-4 h-4" />}
                  {secs}s
                </button>
              ))}
            </div>
            <p className="text-sm text-on-surface-variant mt-3 leading-relaxed">
              💡 Per dimagrire tieni i recuperi tra <strong className="text-on-surface">45 e 75 secondi</strong>: il cuore resta
              alto e consumi di più.
            </p>
          </div>
        </div>
      )}

      {mode === 'tabata' && (
        <div className="space-y-5">
          <div className={`rounded-3xl p-6 flex flex-col items-center text-center transition-colors ${tabataLook.cardClass}`}>
            <span className="text-sm font-semibold">{tabataLook.label}</span>
            <p className="text-sm opacity-80 mt-1">
              Round {currentRound} di {totalRounds} · mancano {formatClock(tabataTotalLeft)}
            </p>
            <span className="text-7xl font-normal tabular-nums my-5" role="timer">
              {formatClock(tabataTimeLeft)}
            </span>

            <div className="flex items-center gap-3">
              <button onClick={timer.resetTabata} className="icon-btn w-14 h-14 bg-surface/40 text-current" aria-label="Azzera">
                <RotateCcw className="w-6 h-6" />
              </button>
              <button onClick={timer.toggleTabata} className="btn-filled h-14 px-8 text-base min-w-36">
                {isTabataRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                {isTabataRunning ? 'Pausa' : state.tabata.status === 'paused' ? 'Riprendi' : 'Avvia'}
              </button>
            </div>
          </div>

          <div className="card px-4 py-2 divide-y divide-outline-variant/60">
            {stepper('Avvio', `${state.prepareSec}s`, () => timer.changePrepareSec(-5), () => timer.changePrepareSec(5))}
            {stepper('Lavoro', `${workSec}s`, () => timer.changeWorkSec(-5), () => timer.changeWorkSec(5))}
            {stepper('Riposo', `${pauseSec}s`, () => timer.changePauseSec(-5), () => timer.changePauseSec(5))}
            {stepper('Round', String(totalRounds), () => timer.changeTotalRounds(-1), () => timer.changeTotalRounds(1))}
          </div>
        </div>
      )}
    </div>
  );
};
