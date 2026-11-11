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
import { useFreeTimer } from './hooks/useFreeTimer';
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
  // Il timer della tab "Timer" vive qui (non in FreeTimerTab) perché la tab viene
  // smontata quando si cambia tab: così continua a scorrere e a suonare ovunque.
  const freeTimer = useFreeTimer();

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
    <div className="min-h-screen bg-surface text-on-surface flex flex-col antialiased">
      {/* Offline Alert Banner */}
      {isOffline && (
        <div className="bg-amber-500 text-amber-950 font-medium text-xs py-1.5 px-4 text-center flex items-center justify-center gap-1.5 sticky top-0 z-50">
          <WifiOff className="w-3.5 h-3.5" />
          <span>Sei offline: l'app funziona lo stesso</span>
        </div>
      )}

      {/* Top app bar (M3 "small") */}
      <header className="sticky top-0 z-30 bg-surface px-4 h-16 flex items-center">
        <div className="max-w-md mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center">
              <Flame className="w-5 h-5 fill-current" />
            </div>
            <span className="text-[22px] font-semibold tracking-tight text-on-surface">FitPulse</span>
          </div>

          <div className="flex items-center gap-1">
            {/* Install PWA Button if available */}
            {deferredPrompt && (
              <button onClick={handleInstallClick} className="btn-tonal min-h-9 px-4 text-xs">
                <Download className="w-4 h-4" />
                <span>Installa</span>
              </button>
            )}
            <ThemePicker />
          </div>
        </div>
      </header>

      {/* Main Tab Content */}
      <main className="flex-1 max-w-md mx-auto w-full px-4 pt-2">
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

          {activeTab === 'timer' && <FreeTimerTab timer={freeTimer} />}

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
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} isTimerRunning={freeTimer.isAnyRunning} />
    </div>
  );
};

export default App;
