import React from 'react';
import { Dumbbell, BookOpen, Timer, TrendingUp } from 'lucide-react';

export type TabType = 'workout' | 'exercises' | 'timer' | 'progress';

interface Props {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  /** Mostra un pallino sull'icona Timer quando il timer libero sta scorrendo. */
  isTimerRunning?: boolean;
}

export const Navbar: React.FC<Props> = ({ activeTab, onTabChange, isTimerRunning = false }) => {
  const tabs = [
    { id: 'workout' as TabType, label: 'Allenati', icon: Dumbbell },
    { id: 'exercises' as TabType, label: 'Esercizi', icon: BookOpen },
    { id: 'timer' as TabType, label: 'Timer', icon: Timer },
    { id: 'progress' as TabType, label: 'Guida & Dati', icon: TrendingUp }
  ];

  // Barra di navigazione M3: indicatore a pillola dietro l'icona della tab attiva.
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-surface-container pb-safe">
      <div className="max-w-md mx-auto grid grid-cols-4 h-20">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const showTimerBadge = tab.id === 'timer' && isTimerRunning && !isActive;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="group flex flex-col items-center justify-center gap-1"
              aria-current={isActive ? 'page' : undefined}
            >
              <span
                className={`relative flex items-center justify-center w-16 h-8 rounded-full transition-colors ${
                  isActive
                    ? 'bg-secondary-container text-on-secondary-container'
                    : 'text-on-surface-variant group-hover:bg-on-surface/8'
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.25]' : ''}`} />
                {showTimerBadge && (
                  <span
                    className="absolute top-0.5 right-4 w-2 h-2 rounded-full bg-error animate-pulse"
                    aria-label="Timer in corso"
                  />
                )}
              </span>
              <span className={`text-xs ${isActive ? 'font-bold text-on-surface' : 'font-medium text-on-surface-variant'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
