import React, { useState } from 'react';
import { 
  Trophy, 
  Calendar, 
  ChevronRight, 
  Scale, 
  BookOpen, 
  CheckCircle,
  Trash2
} from 'lucide-react';
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
      {/* Header */}
      <div>
        <h1 className="text-xl font-black text-white">Progresso & Guida Dimagrimento</h1>
        <p className="text-xs text-slate-400">
          Monitora i tuoi risultati e impara la scienza per eliminare la pancia
        </p>
      </div>

      {/* Weight & Target Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Peso Corporeo & Obiettivo</h3>
              <p className="text-[11px] text-slate-400">Monitoraggio deficit e composizione</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditingWeight(!isEditingWeight)}
            className="text-xs text-emerald-400 font-bold px-3 py-1 bg-emerald-500/10 rounded-xl hover:bg-emerald-500/20 transition"
          >
            {isEditingWeight ? 'Annulla' : 'Modifica'}
          </button>
        </div>

        {isEditingWeight ? (
          <div className="space-y-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Peso Attuale (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={currWeight}
                  onChange={(e) => setCurrWeight(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-sm font-bold text-white text-center"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Peso Obiettivo (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-sm font-bold text-white text-center"
                />
              </div>
            </div>
            <button
              onClick={handleSaveWeight}
              className="w-full py-2.5 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs shadow-md shadow-emerald-500/20 active:scale-98 transition"
            >
              Salva Pesi
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 text-center bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Attuale</span>
              <span className="text-lg font-black text-white">{stats.currentWeightKg} kg</span>
            </div>
            <div className="border-x border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Obiettivo</span>
              <span className="text-lg font-black text-emerald-400">{stats.targetWeightKg} kg</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Da Perdere</span>
              <span className="text-lg font-black text-cyan-400">-{kgToLose.toFixed(1)} kg</span>
            </div>
          </div>
        )}
      </div>

      {/* Guide to Belly Fat Loss & Nutrition (Expandable Pillars) */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-300">
            Guida Scientifica: Perdere Grasso & Addominali
          </h2>
        </div>

        <div className="space-y-2.5">
          {FAT_LOSS_PILLARS.map((pillar, idx) => {
            const isSelected = selectedPillarIndex === idx;
            return (
              <div
                key={idx}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden transition"
              >
                <button
                  onClick={() => setSelectedPillarIndex(isSelected ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between hover:bg-slate-800/40 transition"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-800/50">
                      {pillar.badge}
                    </span>
                    <h4 className="text-xs font-bold text-white">{pillar.title}</h4>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      isSelected ? 'rotate-90 text-emerald-400' : ''
                    }`}
                  />
                </button>

                {isSelected && (
                  <div className="p-4 pt-0 space-y-3 border-t border-slate-800/60 bg-slate-950/40 animate-in fade-in">
                    <p className="text-xs text-slate-300 leading-relaxed font-medium mt-3">
                      {pillar.summary}
                    </p>
                    <div className="space-y-2">
                      {pillar.practicalTips.map((tip, tIdx) => (
                        <div key={tIdx} className="flex items-start text-xs text-slate-400 gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
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
      </div>

      {/* Workout History */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-300">
              Storico Allenamenti ({history.length})
            </h2>
          </div>
          {history.length > 0 && (
            <button
              onClick={() => setPendingDelete({ kind: 'all' })}
              className="flex items-center gap-1 text-[11px] font-bold text-red-400 hover:text-red-300 px-2.5 py-1 rounded-xl bg-red-500/10 transition active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Cancella tutto
            </button>
          )}
        </div>


        {history.length === 0 ? (
          <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl p-8 text-center">
            <Trophy className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-300">Nessun allenamento ancora registrato</p>
            <p className="text-[11px] text-slate-500 mt-1">
              Completa una scheda per vedere qui la durata, le calorie bruciate e i carichi sollevati.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {history.map((item) => {
              const dateStr = formatWorkoutDate(item);
              const mins = Math.round(item.durationSeconds / 60);

              return (
                <div
                  key={item.id}
                  className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-3.5 flex items-center justify-between"
                >
                  <div className="min-w-0">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                      {dateStr}
                    </span>
                    <h4 className="text-xs font-bold text-white line-clamp-1">
                      {item.routineTitle}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {item.exercisesCompletedCount} esercizi • {item.totalVolumeKg} kg volume
                    </p>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right">
                      <span className="text-xs font-black text-orange-400 block">
                        ~{item.estimatedCalories} kcal
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">{mins} min</span>
                    </div>
                    <button
                      onClick={() => setPendingDelete({ kind: 'one', item })}
                      className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition active:scale-95"
                      title="Elimina allenamento"
                      aria-label={`Elimina allenamento ${item.routineTitle} del ${dateStr}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

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
