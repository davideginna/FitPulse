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

  // Dialog M3: icona, titolo, testo e azioni testuali allineate a destra.
  return (
    <div className="scrim flex items-center justify-center p-6 animate-in fade-in" onClick={onCancel}>
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-message"
        className="dialog w-full max-w-sm text-center"
        onClick={(event) => event.stopPropagation()}
      >
        <AlertTriangle className="w-6 h-6 mx-auto text-error" />
        <h3 id="confirm-modal-title" className="text-2xl font-normal text-on-surface mt-4">
          {title}
        </h3>
        <p id="confirm-modal-message" className="text-sm text-on-surface-variant mt-4 leading-relaxed text-left">
          {message}
        </p>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onCancel} autoFocus className="btn-text">
            Annulla
          </button>
          <button onClick={onConfirm} className="btn-text text-error hover:bg-error/10">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
