import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { applyTheme, getSavedTheme } from './utils/theme';

// Applica il tema salvato prima del primo render, così non si vede il tema predefinito per un attimo.
applyTheme(getSavedTheme());

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
