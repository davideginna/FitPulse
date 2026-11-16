import { useEffect } from 'react';

/**
 * Tiene acceso lo schermo finché `active` è true (Screen Wake Lock API), così
 * durante un allenamento o con un timer in corso il telefono non va in standby.
 *
 * Il browser rilascia il blocco da solo quando la pagina va in background:
 * per questo lo richiediamo di nuovo ogni volta che torna visibile.
 * Dove l'API manca (o il sistema la nega, es. risparmio energetico) non succede nulla.
 */
export function useScreenWakeLock(active: boolean): void {
  useEffect(() => {
    if (!active || !('wakeLock' in navigator)) return;

    let sentinel: WakeLockSentinel | null = null;
    let cancelled = false;

    const acquire = async () => {
      if (document.visibilityState !== 'visible') return;
      if (sentinel && !sentinel.released) return;
      try {
        const acquired = await navigator.wakeLock.request('screen');
        if (cancelled) {
          void acquired.release();
        } else {
          sentinel = acquired;
        }
      } catch {
        // Richiesta negata dal sistema: lo schermo seguirà le impostazioni del telefono.
      }
    };

    void acquire();
    document.addEventListener('visibilitychange', acquire);
    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', acquire);
      void sentinel?.release().catch(() => undefined);
    };
  }, [active]);
}
