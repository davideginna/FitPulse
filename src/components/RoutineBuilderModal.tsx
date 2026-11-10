import React, { useState } from 'react';
import { X, Plus, Trash2, Dumbbell, Check } from 'lucide-react';
import { Exercise, Routine, RoutineExercise } from '../types';
import { EXERCISES, MUSCLE_GROUPS } from '../data/exercises';
import { saveCustomRoutine } from '../utils/storage';

interface Props {
  onClose: () => void;
  onSaved: (routine: Routine) => void;
}

export const RoutineBuilderModal: React.FC<Props> = ({ onClose, onSaved }) => {
  const [title, setTitle] = useState('');
  const [goal, setGoal] = useState('Dimagrimento e Pancia Piatta');
  const [selectedExercises, setSelectedExercises] = useState<RoutineExercise[]>([]);
  const [isPickingExercise, setIsPickingExercise] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tutti');

  const addExercise = (ex: Exercise) => {
    setSelectedExercises((prev) => [
      ...prev,
      {
        exerciseId: ex.id,
        sets: ex.defaultSets || 3,
        reps: ex.recommendedReps || '12',
        restSeconds: ex.recommendedRestSeconds || 60,
        notes: ''
      }
    ]);
    setIsPickingExercise(false);
  };

  const removeExercise = (index: number) => {
    setSelectedExercises((prev) => prev.filter((_, idx) => idx !== index));
  };

  const updateExercise = (index: number, field: keyof RoutineExercise, value: any) => {
    setSelectedExercises((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSave = () => {
    if (!title.trim() || selectedExercises.length === 0) return;

    const newRoutine: Routine = {
      id: 'custom_' + Date.now(),
      title: title.trim(),
      subtitle: `${selectedExercises.length} esercizi personalizzati`,
      description: 'Scheda su misura creata per il tuo obiettivo di dimagrimento.',
      goal,
      level: 'Intermedio',
      estimatedDurationMinutes: selectedExercises.length * 7,
      estimatedCaloriesBurn: selectedExercises.length * 60,
      tags: ['Personalizzata', 'Definizione'],
      exercises: selectedExercises
    };

    saveCustomRoutine(newRoutine);
    onSaved(newRoutine);
  };

  const filteredExercises = EXERCISES.filter(
    (e) => selectedCategory === 'Tutti' || e.category === selectedCategory
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-slate-900/90 backdrop-blur border-b border-slate-800 px-5 py-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-white">
            {isPickingExercise ? 'Scegli un Esercizio' : 'Crea Nuova Scheda'}
          </h2>
          <button
            onClick={() => (isPickingExercise ? setIsPickingExercise(false) : onClose())}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/80 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-5 space-y-4">
          {isPickingExercise ? (
            /* Exercise picker */
            <div className="space-y-3">
              {/* Filter pills */}
              <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
                <button
                  onClick={() => setSelectedCategory('Tutti')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                    selectedCategory === 'Tutti'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Tutti
                </button>
                {MUSCLE_GROUPS.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                      selectedCategory === cat
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* List */}
              <div className="space-y-2">
                {filteredExercises.map((ex) => (
                  <button
                    key={ex.id}
                    onClick={() => addExercise(ex)}
                    className="w-full text-left p-3.5 bg-slate-950/70 hover:bg-slate-800 border border-slate-800/80 rounded-2xl flex items-center justify-between active:scale-98 transition"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase">
                        {ex.category} • {ex.equipment}
                      </span>
                      <p className="text-sm font-bold text-white">{ex.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Consigliato: {ex.defaultSets} serie x {ex.recommendedReps} | Riposo {ex.recommendedRestSeconds}s
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                      <Plus className="w-4 h-4" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Main Form */
            <>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Nome Scheda
                </label>
                <input
                  type="text"
                  placeholder="Es. Circuito Brucia Grassi Lunedì"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Obiettivo
                </label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Dimagrimento e Pancia Piatta">Dimagrimento e Pancia Piatta</option>
                  <option value="Definizione e Tonificazione">Definizione e Tonificazione</option>
                  <option value="Circuito Alta Spesa Energetica">Circuito Alta Spesa Energetica</option>
                  <option value="Forza & Metabolismo">Forza & Metabolismo</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Esercizi Selezionati ({selectedExercises.length})
                  </label>
                  <button
                    onClick={() => setIsPickingExercise(true)}
                    className="text-xs text-emerald-400 font-bold flex items-center gap-1 hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" /> Aggiungi Esercizio
                  </button>
                </div>

                {selectedExercises.length === 0 ? (
                  <div className="bg-slate-950/50 border border-dashed border-slate-800 rounded-2xl p-6 text-center">
                    <Dumbbell className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-xs text-slate-400 mb-3">Nessun esercizio ancora aggiunto</p>
                    <button
                      onClick={() => setIsPickingExercise(true)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-xl text-xs font-bold transition"
                    >
                      Scegli dalla libreria
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedExercises.map((item, idx) => {
                      const exData = EXERCISES.find((e) => e.id === item.exerciseId);
                      return (
                        <div
                          key={idx}
                          className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 space-y-3"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="text-[10px] font-bold text-emerald-400 uppercase">
                                #{idx + 1} • {exData?.category}
                              </span>
                              <h4 className="text-sm font-bold text-white">{exData?.name}</h4>
                            </div>
                            <button
                              onClick={() => removeExercise(idx)}
                              className="text-slate-500 hover:text-red-400 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <span className="text-[10px] text-slate-400 block mb-1">Serie</span>
                              <input
                                type="number"
                                min="1"
                                max="10"
                                value={item.sets}
                                onChange={(e) =>
                                  updateExercise(idx, 'sets', parseInt(e.target.value) || 3)
                                }
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-center text-xs font-bold text-white"
                              />
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 block mb-1">Ripetizioni</span>
                              <input
                                type="text"
                                value={item.reps}
                                onChange={(e) => updateExercise(idx, 'reps', e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-center text-xs font-bold text-white"
                              />
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 block mb-1">Riposo (sec)</span>
                              <input
                                type="number"
                                step="15"
                                min="15"
                                max="300"
                                value={item.restSeconds}
                                onChange={(e) =>
                                  updateExercise(idx, 'restSeconds', parseInt(e.target.value) || 60)
                                }
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-center text-xs font-bold text-emerald-400"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!isPickingExercise && (
          <div className="sticky bottom-0 bg-slate-900/95 border-t border-slate-800 p-4">
            <button
              onClick={handleSave}
              disabled={!title.trim() || selectedExercises.length === 0}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-slate-950 font-bold rounded-2xl shadow-lg shadow-emerald-500/20 active:scale-98 transition disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2 text-sm"
            >
              <Check className="w-4 h-4 stroke-[3]" /> Salva Scheda Personalizzata
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
