import React, { useState } from 'react';
import { Trophy, ChevronDown, Scale, CheckCircle, Trash2, Pencil } from 'lucide-react';
import { FAT_LOSS_PILLARS } from '../data/fatLossGuide';
import {
  getWorkoutHistory,
  getUserStats,
  saveUserStats,
  deleteWorkoutHistoryItem,
  clearWorkoutHistory
} from '../utils/storage';
import { WorkoutHistoryItem } from '../types';
import { ConfirmModal } from './ConfirmModal';

export const ProgressGuideTab: React.FC = () => {
  const [history, setHistory] = useState<WorkoutHistoryItem[]>(() => getWorkoutHistory());
  // Eliminazione in attesa di conferma nella modale: un singolo allenamento oppure tutto lo storico.
  const [pendingDelete, setPendingDelete] = useState<
    { kind: 'one'; item: WorkoutHistoryItem } | { kind: 'all' } | null
  >(null);
  const [stats, setStats] = useState(() => getUserStats());
  const [isEditingWeight, setIsEditingWeight] = useState(false);
  const [currWeight, setCurrWeight] = useState(stats.currentWeightKg?.toString() || '80');
  const [targetWeight, setTargetWeight] = useState(stats.targetWeightKg?.toString() || '74');
  const [selectedPillarIndex, setSelectedPillarIndex] = useState<number | null>(0);

  const handleSaveWeight = () => {
    const updated = {
      ...stats,
      currentWeightKg: parseFloat(currWeight) || 80,
      targetWeightKg: parseFloat(targetWeight) || 74
    };
    saveUserStats(updated);
    setStats(updated);
    setIsEditingWeight(false);
  };

  const handleConfirmDelete = () => {
    if (!pendingDelete) return;
    if (pendingDelete.kind === 'one') {
      setHistory(deleteWorkoutHistoryItem(pendingDelete.item.id));
    } else {
      clearWorkoutHistory();
      setHistory([]);
    }
    setStats(getUserStats());
    setPendingDelete(null);
  };

  const formatWorkoutDate = (item: WorkoutHistoryItem) =>
    new Date(item.startTime).toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short' });

  const kgToLose = Math.max(0, (stats.currentWeightKg || 80) - (stats.targetWeightKg || 74));

  return (
    <div className="space-y-6 pb-24">
      <div>
        <h1 className="text-2xl font-semibold text-on-surface">Progressi</h1>
        <p className="text-sm text-on-surface-variant">Peso, guida per perdere grasso e storico allenamenti</p>
      </div>

      {/* Peso e obiettivo */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-on-surface">Peso e obiettivo</h3>
          </div>
          {!isEditingWeight && (
            <button onClick={() => setIsEditingWeight(true)} className="icon-btn" aria-label="Modifica peso">
              <Pencil className="w-5 h-5" />
            </button>
          )}
        </div>

        {isEditingWeight ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-xs font-medium text-on-surface-variant block mb-1">Peso attuale (kg)</span>
                <input
                  type="number"
                  step="0.1"
                  value={currWeight}
                  onChange={(e) => setCurrWeight(e.target.value)}
                  className="text-field text-center"
                />
              </label>
              <label className="block">
                <span className="text-xs font-medium text-on-surface-variant block mb-1">Obiettivo (kg)</span>
                <input
                  type="number"
                  step="0.1"
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(e.target.value)}
                  className="text-field text-center"
                />
              </label>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsEditingWeight(false)} className="btn-text">
                Annulla
              </button>
              <button onClick={handleSaveWeight} className="btn-filled">
                Salva
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              { label: 'Attuale', value: `${stats.currentWeightKg} kg`, color: 'text-on-surface' },
              { label: 'Obiettivo', value: `${stats.targetWeightKg} kg`, color: 'text-primary' },
              { label: 'Da perdere', value: `${kgToLose.toFixed(1)} kg`, color: 'text-secondary' }
            ].map((cell) => (
              <div key={cell.label} className="bg-surface-container-high rounded-xl py-3">
                <span className={`block text-lg font-semibold tabular-nums ${cell.color}`}>{cell.value}</span>
                <span className="text-xs text-on-surface-variant">{cell.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Guida: pannelli espandibili */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-on-surface">Guida per perdere grasso</h2>
        <div className="card overflow-hidden divide-y divide-outline-variant/60">
          {FAT_LOSS_PILLARS.map((pillar, idx) => {
            const isSelected = selectedPillarIndex === idx;
            return (
              <div key={idx}>
                <button
                  onClick={() => setSelectedPillarIndex(isSelected ? null : idx)}
                  className="w-full px-4 py-3 text-left flex items-center justify-between gap-3 hover:bg-on-surface/5 transition-colors"
                  aria-expanded={isSelected}
                >
                  <div className="min-w-0">
                    <span className="text-xs font-medium text-primary">{pillar.badge}</span>
                    <h4 className="text-sm font-medium text-on-surface">{pillar.title}</h4>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 flex-shrink-0 text-on-surface-variant transition-transform ${isSelected ? 'rotate-180' : ''}`}
                  />
                </button>

                {isSelected && (
                  <div className="px-4 pb-4 space-y-3 animate-in fade-in">
                    <p className="text-sm text-on-surface leading-relaxed">{pillar.summary}</p>
                    <div className="space-y-2">
                      {pillar.practicalTips.map((tip, tIdx) => (
                        <div key={tIdx} className="flex items-start text-sm text-on-surface-variant gap-2">
                          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Storico allenamenti */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-on-surface">Storico ({history.length})</h2>
          {history.length > 0 && (
            <button onClick={() => setPendingDelete({ kind: 'all' })} className="btn-text text-error hover:bg-error/10">
              <Trash2 className="w-4 h-4" />
              Cancella tutto
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="card p-8 text-center">
            <Trophy className="w-10 h-10 text-on-surface-variant mx-auto mb-2" />
            <p className="text-sm font-semibold text-on-surface">Nessun allenamento registrato</p>
            <p className="text-sm text-on-surface-variant mt-1">
              Completa una scheda per vedere qui durata, calorie e carichi sollevati.
            </p>
          </div>
        ) : (
          <div className="card overflow-hidden divide-y divide-outline-variant/60">
            {history.map((item) => {
              const dateStr = formatWorkoutDate(item);
              const mins = Math.round(item.durationSeconds / 60);

              return (
                <div key={item.id} className="pl-4 pr-1 py-3 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-xs text-on-surface-variant">{dateStr}</span>
                    <h4 className="text-sm font-medium text-on-surface line-clamp-1">{item.routineTitle}</h4>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      {mins} min · ~{item.estimatedCalories} kcal · {item.exercisesCompletedCount} esercizi · {item.totalVolumeKg} kg
                    </p>
                  </div>
                  <button
                    onClick={() => setPendingDelete({ kind: 'one', item })}
                    className="icon-btn hover:text-error"
                    title="Elimina allenamento"
                    aria-label={`Elimina allenamento ${item.routineTitle} del ${dateStr}`}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {pendingDelete && (
        <ConfirmModal
          title={pendingDelete.kind === 'all' ? 'Cancellare tutto lo storico?' : 'Eliminare questo allenamento?'}
          message={
            pendingDelete.kind === 'all'
              ? `Verranno eliminati tutti i ${history.length} allenamenti e azzerati sessioni, minuti e calorie. Peso e obiettivo restano. L'operazione non si può annullare.`
              : `"${pendingDelete.item.routineTitle}" del ${formatWorkoutDate(pendingDelete.item)} verrà rimosso e i totali aggiornati. L'operazione non si può annullare.`
          }
          confirmLabel={pendingDelete.kind === 'all' ? 'Cancella tutto' : 'Elimina'}
          onConfirm={handleConfirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  );
};
