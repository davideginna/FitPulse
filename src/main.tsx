import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { registerSW } from 'virtual:pwa-register';
import { applyTheme, getSavedTheme } from './utils/theme';

// Applica il tema salvato prima del primo render, così non si vede il tema predefinito per un attimo.
applyTheme(getSavedTheme());

// Aggiornamenti della PWA. Con registerType 'autoUpdate' la pagina si ricarica da
// sola quando è attiva una versione nuova (senza questa registrazione restava
// quella vecchia fino a una chiusura completa dell'app). Un'app installata non
// "naviga" mai, quindi il browser non cerca aggiornamenti da solo: lo chiediamo
// noi ogni volta che l'app torna in primo piano. Un allenamento in corso
// sopravvive al ricaricamento (vedi restoreSession).
registerSW({
  immediate: true,
  onRegisteredSW(_swUrl, registration) {
    if (!registration) return;
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') void registration.update();
    });
  }
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
