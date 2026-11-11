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
    <div className="scrim flex items-end sm:items-center justify-center sm:p-4 animate-in fade-in">
      <div className="sheet relative w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden">
        <div className="sheet-handle sm:hidden" />
        {/* Header */}
        <div className="px-6 pt-3 pb-2 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-on-surface">
            {isPickingExercise ? 'Scegli un esercizio' : 'Nuova scheda'}
          </h2>
          <button
            onClick={() => (isPickingExercise ? setIsPickingExercise(false) : onClose())}
            className="icon-btn -mr-2"
            aria-label={isPickingExercise ? 'Torna alla scheda' : 'Chiudi'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-6 pb-6 pt-2 space-y-5">
          {isPickingExercise ? (
            /* Exercise picker */
            <div className="space-y-3">
              {/* Filter pills */}
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-6 px-6">
                <button
                  onClick={() => setSelectedCategory('Tutti')}
                  className={selectedCategory === 'Tutti' ? 'chip-selected' : 'chip'}
                >
                  Tutti
                </button>
                {MUSCLE_GROUPS.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={selectedCategory === cat ? 'chip-selected' : 'chip'}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* List */}
              <div className="card overflow-hidden divide-y divide-outline-variant/60">
                {filteredExercises.map((ex) => (
                  <button
                    key={ex.id}
                    onClick={() => addExercise(ex)}
                    className="w-full text-left px-4 py-3 flex items-center justify-between gap-3 hover:bg-on-surface/5 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-on-surface">{ex.name}</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        {ex.category} · {ex.defaultSets}x{ex.recommendedReps} · recupero {ex.recommendedRestSeconds}s
                      </p>
                    </div>
                    <div className="w-8 h-8 flex-shrink-0 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
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
                <label className="block text-xs font-medium text-on-surface-variant mb-1">
                  Nome scheda
                </label>
                <input
                  type="text"
                  placeholder="Es. Circuito Brucia Grassi Lunedì"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-field"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-1">
                  Obiettivo
                </label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="text-field bg-surface-container-low"
                >
                  <option value="Dimagrimento e Pancia Piatta">Dimagrimento e Pancia Piatta</option>
                  <option value="Definizione e Tonificazione">Definizione e Tonificazione</option>
                  <option value="Circuito Alta Spesa Energetica">Circuito Alta Spesa Energetica</option>
                  <option value="Forza & Metabolismo">Forza & Metabolismo</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-semibold text-on-surface">
                    Esercizi ({selectedExercises.length})
                  </h3>
                  <button
                    onClick={() => setIsPickingExercise(true)}
                    className="btn-text -mr-3"
                  >
                    <Plus className="w-4 h-4" /> Aggiungi
                  </button>
                </div>

                {selectedExercises.length === 0 ? (
                  <div className="card p-6 text-center">
                    <Dumbbell className="w-8 h-8 text-on-surface-variant mx-auto mb-2" />
                    <p className="text-sm text-on-surface-variant mb-3">Nessun esercizio ancora aggiunto</p>
                    <button
                      onClick={() => setIsPickingExercise(true)}
                      className="btn-tonal"
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
                          className="card p-4 space-y-3"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="text-xs text-on-surface-variant">
                                {idx + 1} · {exData?.category}
                              </span>
                              <h4 className="text-sm font-semibold text-on-surface">{exData?.name}</h4>
                            </div>
                            <button
                              onClick={() => removeExercise(idx)}
                              className="icon-btn -mr-2 -mt-2 hover:text-error"
                              aria-label="Rimuovi esercizio"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <span className="text-xs text-on-surface-variant block mb-1">Serie</span>
                              <input
                                type="number"
                                min="1"
                                max="10"
                                value={item.sets}
                                onChange={(e) =>
                                  updateExercise(idx, 'sets', parseInt(e.target.value) || 3)
                                }
                                className="text-field h-10 px-2 text-center text-sm"
                              />
                            </div>
                            <div>
                              <span className="text-xs text-on-surface-variant block mb-1">Ripetizioni</span>
                              <input
                                type="text"
                                value={item.reps}
                                onChange={(e) => updateExercise(idx, 'reps', e.target.value)}
                                className="text-field h-10 px-2 text-center text-sm"
                              />
                            </div>
                            <div>
                              <span className="text-xs text-on-surface-variant block mb-1">Riposo (sec)</span>
                              <input
                                type="number"
                                step="15"
                                min="15"
                                max="300"
                                value={item.restSeconds}
                                onChange={(e) =>
                                  updateExercise(idx, 'restSeconds', parseInt(e.target.value) || 60)
                                }
                                className="text-field h-10 px-2 text-center text-sm"
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
          <div className="px-6 py-4 pb-safe border-t border-outline-variant/60">
            <button
              onClick={handleSave}
              disabled={!title.trim() || selectedExercises.length === 0}
              className="btn-filled w-full h-14 text-base"
            >
              <Check className="w-5 h-5" /> Salva scheda
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
