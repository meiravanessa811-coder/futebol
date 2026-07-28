import React from 'react';
import { Users, Shuffle, PlayCircle, Trophy, DollarSign } from 'lucide-react';

export type TabType = 'sorteio' | 'partida' | 'jogadores' | 'estatisticas' | 'caixinha';

interface NavigationTabsProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  liveMatchActive?: boolean;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onChangeTab,
  liveMatchActive = false,
}) => {
  const tabs = [
    {
      id: 'sorteio' as TabType,
      label: 'Times & Sorteio',
      icon: Shuffle,
      badge: null,
    },
    {
      id: 'partida' as TabType,
      label: 'Partida Ao Vivo',
      icon: PlayCircle,
      badge: liveMatchActive ? 'AO VIVO' : null,
    },
    {
      id: 'jogadores' as TabType,
      label: 'Elenco',
      icon: Users,
      badge: null,
    },
    {
      id: 'estatisticas' as TabType,
      label: 'Artilharia & Ranking',
      icon: Trophy,
      badge: null,
    },
    {
      id: 'caixinha' as TabType,
      label: 'Pix / Financeiro',
      icon: DollarSign,
      badge: null,
    },
  ];

  return (
    <div className="sticky top-0 z-30 bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800 shadow-md">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2.5 scrollbar-none" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onChangeTab(tab.id)}
                className={`relative flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-950/40'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-zinc-950' : 'text-emerald-400'}`} />
                <span>{tab.label}</span>

                {tab.badge && (
                  <span className="relative flex h-2 w-2 ml-0.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
