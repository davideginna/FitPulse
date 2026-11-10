import React, { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Finestra di conferma per azioni distruttive (es. eliminazione dallo storico).
 * Si chiude con "Annulla", toccando lo sfondo o premendo Esc.
 */
export const ConfirmModal: React.FC<Props> = ({ title, message, confirmLabel, onConfirm, onCancel }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
      onClick={onCancel}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-message"
        className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start gap-3 mb-5">
          <div className="p-2.5 rounded-2xl bg-red-500/15 text-red-400 flex-shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 id="confirm-modal-title" className="text-base font-extrabold text-white">
              {title}
            </h3>
            <p id="confirm-modal-message" className="text-xs text-slate-400 mt-1 leading-relaxed">
              {message}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onCancel}
            autoFocus
            className="py-2.5 rounded-xl bg-slate-800 text-slate-200 text-sm font-bold active:scale-95 transition"
          >
            Annulla
          </button>
          <button
            onClick={onConfirm}
            className="py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-bold active:scale-95 transition"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
