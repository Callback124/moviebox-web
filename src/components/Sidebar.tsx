import React from 'react';
import { 
  Home, 
  Film, 
  Tv, 
  Sparkles, 
  Flame, 
  Bookmark, 
  Clock, 
  Download, 
  Settings, 
  FolderDown, 
  PlaySquare, 
  HardDrive, 
  ShieldCheck,
  Compass,
  Radio,
  Layers
} from 'lucide-react';

export type TabType = 'home' | 'movies' | 'tv' | 'anime' | 'hindi' | 'watchlist' | 'history' | 'downloads';

interface SidebarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  watchlistCount: number;
  downloadCount: number;
  hasActiveDownload: boolean;
  onOpenSettings: () => void;
  onOpenDownloads: () => void;
  apiKeyPresent: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  watchlistCount,
  downloadCount,
  hasActiveDownload,
  onOpenSettings,
  onOpenDownloads,
  apiKeyPresent,
  isCollapsed,
  onToggleCollapse
}) => {
  const mainNav = [
    { id: 'home' as TabType, label: 'Home', icon: Home, badge: 'New' },
    { id: 'movies' as TabType, label: 'Movies', icon: Film, badge: '4K' },
    { id: 'tv' as TabType, label: 'TV Shows', icon: Tv, badge: 'HD' },
    { id: 'anime' as TabType, label: 'Anime Hub', icon: Sparkles, badge: 'Sub/Dub' },
    { id: 'hindi' as TabType, label: 'Hindi Cinema', icon: Flame, badge: 'Top' }
  ];

  const libraryNav = [
    { 
      id: 'watchlist' as TabType, 
      label: 'My Watchlist', 
      icon: Bookmark, 
      count: watchlistCount 
    },
    { 
      id: 'history' as TabType, 
      label: 'Watch History', 
      icon: Clock 
    },
    { 
      id: 'downloads' as TabType, 
      label: 'PC Downloads', 
      icon: Download, 
      count: downloadCount,
      hasPulse: hasActiveDownload 
    }
  ];

  return (
    <aside 
      className={`bg-[#0B0D14]/90 backdrop-blur-2xl border-r border-white/5 flex flex-col justify-between transition-all duration-300 z-40 select-none ${
        isCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Top Section: Nav Links */}
      <div className="flex-1 py-4 px-3 space-y-6 overflow-y-auto no-scrollbar">
        {/* Navigation Category: Discover */}
        <div>
          {!isCollapsed && (
            <div className="px-3 mb-2 text-[10px] uppercase font-bold tracking-wider text-zinc-500 flex items-center justify-between">
              <span>DISCOVERY</span>
              <Compass className="w-3 h-3 text-zinc-500" />
            </div>
          )}
          <nav className="space-y-1">
            {mainNav.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  title={item.label}
                  className={`w-full flex items-center rounded-xl px-3 py-2.5 transition-all text-xs font-medium group relative ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 font-semibold border border-cyan-500/30 shadow-lg shadow-cyan-950/40'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-cyan-400' : 'text-zinc-400'}`} />
                  
                  {!isCollapsed && (
                    <div className="flex-1 flex items-center justify-between ml-3 overflow-hidden">
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono ${
                          isActive 
                            ? 'bg-cyan-500/20 text-cyan-300' 
                            : 'bg-white/5 text-zinc-400 group-hover:text-zinc-200'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}

                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-cyan-400" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Navigation Category: Library */}
        <div>
          {!isCollapsed && (
            <div className="px-3 mb-2 text-[10px] uppercase font-bold tracking-wider text-zinc-500 flex items-center justify-between">
              <span>MY DESKTOP VAULT</span>
              <FolderDown className="w-3 h-3 text-zinc-500" />
            </div>
          )}
          <nav className="space-y-1">
            {libraryNav.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'downloads') {
                      onOpenDownloads();
                    } else {
                      onSelectTab(item.id);
                    }
                  }}
                  title={item.label}
                  className={`w-full flex items-center rounded-xl px-3 py-2.5 transition-all text-xs font-medium group relative ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 font-semibold border border-cyan-500/30'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-cyan-400' : 'text-zinc-400'}`} />
                  
                  {!isCollapsed && (
                    <div className="flex-1 flex items-center justify-between ml-3 overflow-hidden">
                      <span className="truncate">{item.label}</span>
                      {item.count !== undefined && item.count > 0 && (
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                          item.hasPulse 
                            ? 'bg-cyan-500 text-black animate-pulse' 
                            : 'bg-white/10 text-zinc-300'
                        }`}>
                          {item.count}
                        </span>
                      )}
                    </div>
                  )}

                  {item.hasPulse && isCollapsed && (
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Feature Banner: 4K Stream Engine */}
        {!isCollapsed && (
          <div className="p-3 rounded-2xl bg-gradient-to-b from-cyan-950/40 via-blue-950/20 to-transparent border border-cyan-500/20 relative overflow-hidden">
            <div className="flex items-center space-x-2 text-cyan-400 mb-1">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span className="text-[11px] font-bold tracking-wide uppercase">CineDirect™ 4K</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Ultra-low latency streaming with zero buffering & Dolby Spatial Audio.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Section: System Status & Settings */}
      <div className="p-3 border-t border-white/5 space-y-2 bg-[#080A10]/95">
        {/* PC Storage & Network Widget */}
        {!isCollapsed && (
          <div className="px-3 py-2 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] space-y-1.5">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="flex items-center space-x-1.5">
                <HardDrive className="w-3 h-3 text-zinc-400" />
                <span>PC Disk Cache</span>
              </span>
              <span className="text-zinc-200 font-mono text-[10px]">34.8 / 512 GB</span>
            </div>
            {/* Storage Progress Bar */}
            <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full w-[28%]" />
            </div>
          </div>
        )}

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          title="Settings"
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors text-xs"
        >
          <div className="flex items-center space-x-2.5">
            <Settings className="w-4 h-4 text-zinc-400 group-hover:text-cyan-400" />
            {!isCollapsed && <span>Preferences</span>}
          </div>
          {!isCollapsed && (
            <span className={`w-2 h-2 rounded-full ${apiKeyPresent ? 'bg-emerald-400 ring-2 ring-emerald-500/20' : 'bg-cyan-400'}`} title={apiKeyPresent ? 'TMDB Key Active' : 'Curated Stream Ready'} />
          )}
        </button>
      </div>
    </aside>
  );
};
