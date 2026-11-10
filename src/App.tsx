import React, { useState, useEffect } from 'react';
import { Navbar, TabType } from './components/Navbar';
import { WorkoutTab } from './components/WorkoutTab';
import { ExerciseLibraryTab } from './components/ExerciseLibraryTab';
import { FreeTimerTab } from './components/FreeTimerTab';
import { ProgressGuideTab } from './components/ProgressGuideTab';
import { ActiveWorkoutView } from './components/ActiveWorkoutView';
import { ExerciseDetailModal } from './components/ExerciseDetailModal';
import { RoutineBuilderModal } from './components/RoutineBuilderModal';
import { ThemePicker } from './components/ThemePicker';
import { Routine, Exercise } from './types';
import { getAllRoutines } from './utils/storage';
import { EXERCISES } from './data/exercises';
import { Flame, Download, WifiOff } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('workout');
  const [routines, setRoutines] = useState<Routine[]>(() => getAllRoutines());
  const [activeWorkout, setActiveWorkout] = useState<Routine | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Monitor online / offline status for PWA
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // PWA Install prompt listener
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choice: any) => {
        if (choice.outcome === 'accepted') {
          setDeferredPrompt(null);
        }
      });
    }
  };

  const handleStartWorkout = (routine: Routine) => {
    setActiveWorkout(routine);
  };

  const handleFinishWorkout = () => {
    setActiveWorkout(null);
    setRoutines(getAllRoutines());
    setActiveTab('progress');
  };

  const handleSelectExerciseById = (exerciseId: string) => {
    const found = EXERCISES.find((e) => e.id === exerciseId);
    if (found) setSelectedExercise(found);
  };

  const handleStartSingleExercise = (exercise: Exercise) => {
    const singleRoutine: Routine = {
      id: 'quick_' + Date.now(),
      title: exercise.name,
      subtitle: `${exercise.defaultSets} serie mirate`,
      description: exercise.description,
      goal: 'Tonificazione & Dimagrimento',
      level: exercise.difficulty,
      estimatedDurationMinutes: 10,
      estimatedCaloriesBurn: 70,
      tags: [exercise.category],
      exercises: [
        {
          exerciseId: exercise.id,
          sets: exercise.defaultSets,
          reps: exercise.recommendedReps,
          restSeconds: exercise.recommendedRestSeconds
        }
      ]
    };
    setSelectedExercise(null);
    setActiveWorkout(singleRoutine);
  };

  // If there's an active live workout session, render full screen
  if (activeWorkout) {
    return (
      <ActiveWorkoutView
        routine={activeWorkout}
        onFinish={handleFinishWorkout}
        onCancel={() => setActiveWorkout(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-emerald-500 selection:text-white">
      {/* Offline Alert Banner */}
      {isOffline && (
        <div className="bg-amber-600 text-slate-950 font-bold text-xs py-1 px-4 text-center flex items-center justify-center gap-1.5 sticky top-0 z-50">
          <WifiOff className="w-3.5 h-3.5" />
          <span>Modalità Offline attiva: l'app funziona perfettamente senza connessione</span>
        </div>
      )}

      {/* Main Top Header */}
      <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-xl border-b border-slate-900/80 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-400 p-0.5 shadow-md shadow-emerald-500/20 flex items-center justify-center">
              <Flame className="w-5 h-5 text-slate-950 fill-current" />
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-white flex items-center gap-1">
                FIT<span className="text-emerald-400">PULSE</span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded font-semibold ml-1">PWA</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
          {/* Install PWA Button if available */}
          {deferredPrompt && (
            <button
              onClick={handleInstallClick}
              className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 active:scale-95 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Installa App</span>
            </button>
          )}
          <ThemePicker />
          </div>
        </div>
      </header>

      {/* Main Tab Content */}
      <main className="flex-1 max-w-md mx-auto w-full px-4 pt-4">
        <div key={activeTab} className="tab-transition">
          {activeTab === 'workout' && (
            <WorkoutTab
              routines={routines}
              onSelectRoutine={handleStartWorkout}
              onOpenBuilder={() => setIsBuilderOpen(true)}
              onSelectExercisePreview={handleSelectExerciseById}
            />
          )}

          {activeTab === 'exercises' && (
            <ExerciseLibraryTab onSelectExercise={(ex) => setSelectedExercise(ex)} />
          )}

          {activeTab === 'timer' && <FreeTimerTab />}

          {activeTab === 'progress' && <ProgressGuideTab />}
        </div>
      </main>

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <ExerciseDetailModal
          exercise={selectedExercise}
          onClose={() => setSelectedExercise(null)}
          onStartWithExercise={handleStartSingleExercise}
        />
      )}

      {/* Routine Builder Modal */}
      {isBuilderOpen && (
        <RoutineBuilderModal
          onClose={() => setIsBuilderOpen(false)}
          onSaved={() => {
            setRoutines(getAllRoutines());
            setIsBuilderOpen(false);
          }}
        />
      )}

      {/* Bottom Navigation */}
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default App;
