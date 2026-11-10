import React from 'react';
import { Dumbbell, BookOpen, Timer, TrendingUp } from 'lucide-react';

export type TabType = 'workout' | 'exercises' | 'timer' | 'progress';

interface Props {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const Navbar: React.FC<Props> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'workout' as TabType, label: 'Allenati', icon: Dumbbell },
    { id: 'exercises' as TabType, label: 'Esercizi', icon: BookOpen },
    { id: 'timer' as TabType, label: 'Timer', icon: Timer },
    { id: 'progress' as TabType, label: 'Guida & Dati', icon: TrendingUp }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800/90 px-3 py-2 pb-safe">
      <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all ${
                isActive
                  ? 'text-emerald-400 font-bold bg-emerald-500/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 transition-transform ${isActive ? 'scale-110 stroke-[2.5]' : ''}`} />
              <span className="text-[10px] tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
