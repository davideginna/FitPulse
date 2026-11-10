import { useEffect, useRef, useState } from 'react';
import { playCountdownBeep, playRestCompleteSound } from '../utils/audio';
import { getFreeTimerState, saveFreeTimerState } from '../utils/storage';

/**
 * Stato del timer libero (tab "Timer").
 *
 * Perché vive qui e non dentro FreeTimerTab: App smonta il componente della tab
 * quando l'utente cambia tab, e con lui sparivano stato e setInterval (il timer
 * si annullava). Questo hook è usato da App, che resta sempre montato, e passa
 * lo stato alla tab come prop.
 *
 * Perché timestamp assoluti (`endsAt`, ms da Date.now()) invece di un contatore
 * decrementato ogni secondo: i browser rallentano o sospendono gli interval in
 * background / a schermo spento, quindi un contatore resterebbe indietro.
 * Con `endsAt` il tempo residuo è sempre `endsAt - Date.now()`, qualunque sia
 * la frequenza dei tick.
 *
 * Ogni conto alla rovescia ha tre stati:
 * - 'idle':    mai avviato o concluso; mostra la durata piena.
 * - 'running': `endsAt` è valorizzato.
 * - 'paused':  `pausedRemainingMs` contiene il tempo residuo.
 */

export type TimerStatus = 'idle' | 'running' | 'paused';
export type FreeTimerMode = 'rest' | 'tabata';
export type TabataPhase = 'work' | 'rest';

export interface Countdown {
  status: TimerStatus;
  /** Istante di fine (Date.now() in ms). Valorizzato solo se status === 'running'. */
  endsAt: number | null;
  /** Tempo residuo congelato. Significativo solo se status === 'paused'. */
  pausedRemainingMs: number;
}

export interface FreeTimerState {
  mode: FreeTimerMode;
  soundEnabled: boolean;
  /** Recupero tra serie */
  restDurationSec: number;
  rest: Countdown;
  /** HIIT / Tabata */
  workSec: number;
  pauseSec: number;
  totalRounds: number;
  tabataPhase: TabataPhase;
  tabataRound: number;
  tabata: Countdown;
}

const IDLE_COUNTDOWN: Countdown = { status: 'idle', endsAt: null, pausedRemainingMs: 0 };

export const DEFAULT_FREE_TIMER_STATE: FreeTimerState = {
  mode: 'rest',
  soundEnabled: true,
  restDurationSec: 60,
  rest: IDLE_COUNTDOWN,
  workSec: 30,
  pauseSec: 15,
  totalRounds: 8,
  tabataPhase: 'work',
  tabataRound: 1,
  tabata: IDLE_COUNTDOWN
};

/** Ogni quanto controlliamo fine fase / beep finali. */
const TICK_MS = 250;

/** Tempo residuo in ms. `fullMs` è la durata mostrata quando il timer è fermo ('idle'). */
export function getRemainingMs(countdown: Countdown, fullMs: number, now: number): number {
  if (countdown.status === 'running' && countdown.endsAt !== null) {
    return Math.max(0, countdown.endsAt - now);
  }
  if (countdown.status === 'paused') {
    return countdown.pausedRemainingMs;
  }
  return fullMs;
}

/** Secondi da mostrare: arrotondati per eccesso, così "0" compare solo alla fine. */
export function toDisplaySeconds(ms: number): number {
  return Math.ceil(ms / 1000);
}

export function getRestRemainingMs(state: FreeTimerState, now: number): number {
  return getRemainingMs(state.rest, state.restDurationSec * 1000, now);
}

export function getTabataRemainingMs(state: FreeTimerState, now: number): number {
  // Da fermo il prossimo avvio parte sempre da una fase di lavoro.
  return getRemainingMs(state.tabata, state.workSec * 1000, now);
}

/** Avvia o mette in pausa un conto alla rovescia. */
function toggleCountdown(countdown: Countdown, fullMs: number, now: number): Countdown {
  if (countdown.status === 'running') {
    return { status: 'paused', endsAt: null, pausedRemainingMs: getRemainingMs(countdown, fullMs, now) };
  }
  const remainingMs = countdown.status === 'paused' ? countdown.pausedRemainingMs : fullMs;
  return { status: 'running', endsAt: now + remainingMs, pausedRemainingMs: 0 };
}

export interface FreeTimerControls {
  state: FreeTimerState;
  /** true se almeno uno dei due timer sta scorrendo (usato anche per il badge in Navbar). */
  isAnyRunning: boolean;
  setMode: (mode: FreeTimerMode) => void;
  toggleSound: () => void;
  selectRestPreset: (secs: number) => void;
  toggleRest: () => void;
  resetRest: () => void;
  addRestTime: (secs: number) => void;
  toggleTabata: () => void;
  resetTabata: () => void;
  changeWorkSec: (deltaSec: number) => void;
  changePauseSec: (deltaSec: number) => void;
  changeTotalRounds: (delta: number) => void;
}

export function useFreeTimer(): FreeTimerControls {
  const [state, setState] = useState<FreeTimerState>(() => getFreeTimerState() ?? DEFAULT_FREE_TIMER_STATE);

  // Ultimo secondo per cui è stato emesso il beep finale (3-2-1), per non ripeterlo
  // a ogni tick dello stesso secondo.
  const lastBeepSecondRef = useRef<{ rest: number | null; tabata: number | null }>({ rest: null, tabata: null });

  // Persistenza: così un ricaricamento della pagina non perde il timer in corso.
  // Lo stato cambia solo su azioni dell'utente o fine fase (non a ogni tick).
  useEffect(() => {
    saveFreeTimerState(state);
  }, [state]);

  const isAnyRunning = state.rest.status === 'running' || state.tabata.status === 'running';

  // Il tick controlla solo le transizioni (fine recupero, cambio fase HIIT) e i beep.
  // Non salva "now" nello stato: così App non si ri-renderizza 4 volte al secondo;
  // è FreeTimerTab, quando visibile, ad aggiornare il display per conto suo.
  // L'effetto si ricrea a ogni cambio di `state`, quindi la closure vede sempre lo stato attuale.
  useEffect(() => {
    if (!isAnyRunning) return;

    const beepIfLastSeconds = (which: 'rest' | 'tabata', remainingMs: number, frequency: number, duration: number) => {
      const seconds = toDisplaySeconds(remainingMs);
      if (seconds >= 1 && seconds <= 3 && lastBeepSecondRef.current[which] !== seconds) {
        lastBeepSecondRef.current[which] = seconds;
        if (state.soundEnabled) playCountdownBeep(frequency, duration);
      }
    };

    const tick = () => {
      const now = Date.now();

      // --- Recupero tra serie ---
      if (state.rest.status === 'running' && state.rest.endsAt !== null) {
        const remainingMs = state.rest.endsAt - now;
        if (remainingMs <= 0) {
          if (state.soundEnabled) playRestCompleteSound();
          lastBeepSecondRef.current.rest = null;
          // Concluso: torna a 'idle', pronto per la serie successiva con la stessa durata.
          setState((prev) => ({ ...prev, rest: IDLE_COUNTDOWN }));
        } else {
          beepIfLastSeconds('rest', remainingMs, 580, 0.1);
        }
      }

      // --- HIIT / Tabata ---
      if (state.tabata.status === 'running' && state.tabata.endsAt !== null) {
        let phase = state.tabataPhase;
        let round = state.tabataRound;
        let endsAt = state.tabata.endsAt;
        let phaseChanged = false;
        let finished = false;

        // Ciclo (non un singolo if) perché se la pagina è rimasta in background a lungo
        // possono essere trascorse più fasi: le recuperiamo tutte. Ogni fase parte dalla
        // fine teorica della precedente (`endsAt +=`), non da "now", per non accumulare ritardi.
        while (endsAt <= now) {
          phaseChanged = true;
          if (phase === 'work') {
            phase = 'rest';
            endsAt += state.pauseSec * 1000;
          } else if (round >= state.totalRounds) {
            finished = true;
            break;
          } else {
            round += 1;
            phase = 'work';
            endsAt += state.workSec * 1000;
          }
        }

        if (phaseChanged) {
          // Un solo suono anche se sono state recuperate più fasi insieme.
          if (state.soundEnabled) playRestCompleteSound();
          lastBeepSecondRef.current.tabata = null;
          if (finished) {
            setState((prev) => ({ ...prev, tabataPhase: 'work', tabataRound: 1, tabata: IDLE_COUNTDOWN }));
          } else {
            const nextCountdown: Countdown = { status: 'running', endsAt, pausedRemainingMs: 0 };
            setState((prev) => ({ ...prev, tabataPhase: phase, tabataRound: round, tabata: nextCountdown }));
          }
        } else {
          beepIfLastSeconds('tabata', endsAt - now, 650, 0.08);
        }
      }
    };

    tick(); // subito, così dopo un reload con timer già scaduto non si aspetta il primo tick
    const interval = setInterval(tick, TICK_MS);
    return () => clearInterval(interval);
  }, [state, isAnyRunning]);

  // --- Azioni ---

  const setMode = (mode: FreeTimerMode) => setState((prev) => ({ ...prev, mode }));

  const toggleSound = () => setState((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));

  const selectRestPreset = (secs: number) =>
    setState((prev) => ({ ...prev, restDurationSec: secs, rest: IDLE_COUNTDOWN }));

  const toggleRest = () => {
    lastBeepSecondRef.current.rest = null;
    const now = Date.now();
    setState((prev) => ({ ...prev, rest: toggleCountdown(prev.rest, prev.restDurationSec * 1000, now) }));
  };

  const resetRest = () => setState((prev) => ({ ...prev, rest: IDLE_COUNTDOWN }));

  /** Aggiunge tempo al recupero corrente senza cambiare la durata scelta. */
  const addRestTime = (secs: number) => {
    const now = Date.now();
    setState((prev) => {
      const extraMs = secs * 1000;
      if (prev.rest.status === 'running' && prev.rest.endsAt !== null) {
        return { ...prev, rest: { ...prev.rest, endsAt: prev.rest.endsAt + extraMs } };
      }
      // Da fermo o in pausa: il recupero resta in pausa con il tempo aumentato.
      const remainingMs = getRestRemainingMs(prev, now);
      return { ...prev, rest: { status: 'paused', endsAt: null, pausedRemainingMs: remainingMs + extraMs } };
    });
  };

  const toggleTabata = () => {
    lastBeepSecondRef.current.tabata = null;
    const now = Date.now();
    // Da 'idle' si parte sempre da round 1, fase di lavoro (garantito da resetTabata / fine circuito).
    setState((prev) => ({ ...prev, tabata: toggleCountdown(prev.tabata, prev.workSec * 1000, now) }));
  };

  const resetTabata = () =>
    setState((prev) => ({ ...prev, tabataPhase: 'work', tabataRound: 1, tabata: IDLE_COUNTDOWN }));

  // I nuovi parametri valgono dalla prossima fase; la fase in corso non viene accorciata.
  const changeWorkSec = (deltaSec: number) =>
    setState((prev) => ({ ...prev, workSec: Math.max(10, prev.workSec + deltaSec) }));

  const changePauseSec = (deltaSec: number) =>
    setState((prev) => ({ ...prev, pauseSec: Math.max(5, prev.pauseSec + deltaSec) }));

  const changeTotalRounds = (delta: number) =>
    setState((prev) => ({ ...prev, totalRounds: Math.max(1, prev.totalRounds + delta) }));

  return {
    state,
    isAnyRunning,
    setMode,
    toggleSound,
    selectRestPreset,
    toggleRest,
    resetRest,
    addRestTime,
    toggleTabata,
    resetTabata,
    changeWorkSec,
    changePauseSec,
    changeTotalRounds
  };
}
