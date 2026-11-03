import React, { useState } from 'react';
import { 
  Minus, 
  Square, 
  X, 
  Maximize2, 
  Minimize2, 
  Tv, 
  Search, 
  Volume2, 
  Sparkles, 
  Wifi, 
  Film,
  Download,
  Settings,
  HelpCircle,
  FolderOpen
} from 'lucide-react';

interface DesktopTitlebarProps {
  onSearchClick: () => void;
  onOpenSettings: () => void;
  onOpenDownloads: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  currentViewTitle: string;
}

export const DesktopTitlebar: React.FC<DesktopTitlebarProps> = ({
  onSearchClick,
  onOpenSettings,
  onOpenDownloads,
  isFullscreen,
  onToggleFullscreen,
  currentViewTitle
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isWindowMaximized, setIsWindowMaximized] = useState(false);
  const [showExitNotice, setShowExitNotice] = useState(false);

  const handleMinimize = () => {
    // Desktop simulation feedback
    const root = document.getElementById('root');
    if (root) {
      root.style.transform = 'scale(0.97)';
      root.style.opacity = '0.7';
      setTimeout(() => {
        root.style.transform = 'scale(1)';
        root.style.opacity = '1';
      }, 400);
    }
  };

  const handleMaximizeToggle = () => {
    setIsWindowMaximized(!isWindowMaximized);
  };

  const handleClose = () => {
    setShowExitNotice(true);
    setTimeout(() => setShowExitNotice(false), 2500);
  };

  return (
    <header className="h-10 bg-[#0B0D14] border-b border-white/5 select-none flex items-center justify-between px-3 text-xs text-zinc-400 z-50 sticky top-0 shadow-lg shadow-black/40">
      {/* Left: App Brand & Desktop Menus */}
      <div className="flex items-center space-x-3">
        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-2 text-white font-bold tracking-wider group cursor-pointer pr-2 border-r border-white/10">
          <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center shadow-md shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
            <Film className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent font-extrabold text-[13px] tracking-tight">
            CINESCOPE<span className="text-cyan-400 text-[10px] ml-1 font-mono uppercase bg-cyan-950/60 border border-cyan-800/60 px-1 py-0.5 rounded">PC</span>
          </span>
        </div>

        {/* Desktop Menus (File, View, Playback, Audio, Help) */}
        <div className="hidden md:flex items-center space-x-1 relative">
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'file' ? null : 'file')}
              className={`px-2 py-1 rounded hover:bg-white/5 transition-colors ${activeMenu === 'file' ? 'bg-white/10 text-white' : ''}`}
            >
              File
            </button>
            {activeMenu === 'file' && (
              <div 
                className="absolute top-full left-0 mt-1 w-48 bg-[#141722] border border-white/10 rounded-lg shadow-2xl py-1 text-zinc-300 z-50 backdrop-blur-xl"
                onMouseLeave={() => setActiveMenu(null)}
              >
                <button 
                  onClick={() => { onOpenDownloads(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-cyan-500/20 hover:text-cyan-300 flex items-center justify-between"
                >
                  <span className="flex items-center space-x-2"><Download className="w-3.5 h-3.5" /> <span>Download Center</span></span>
                  <span className="text-[10px] text-zinc-500 font-mono">Ctrl+J</span>
                </button>
                <button 
                  onClick={() => { onOpenSettings(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-cyan-500/20 hover:text-cyan-300 flex items-center justify-between"
                >
                  <span className="flex items-center space-x-2"><Settings className="w-3.5 h-3.5" /> <span>Preferences</span></span>
                  <span className="text-[10px] text-zinc-500 font-mono">Ctrl+,</span>
                </button>
                <div className="h-px bg-white/5 my-1" />
                <button 
                  onClick={() => { handleClose(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-red-500/20 hover:text-red-300 text-zinc-400"
                >
                  Exit CineScope
                </button>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'view' ? null : 'view')}
              className={`px-2 py-1 rounded hover:bg-white/5 transition-colors ${activeMenu === 'view' ? 'bg-white/10 text-white' : ''}`}
            >
              View
            </button>
            {activeMenu === 'view' && (
              <div 
                className="absolute top-full left-0 mt-1 w-44 bg-[#141722] border border-white/10 rounded-lg shadow-2xl py-1 text-zinc-300 z-50 backdrop-blur-xl"
                onMouseLeave={() => setActiveMenu(null)}
              >
                <button 
                  onClick={() => { onToggleFullscreen(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-cyan-500/20 hover:text-cyan-300 flex items-center justify-between"
                >
                  <span>Toggle Fullscreen</span>
                  <span className="text-[10px] text-zinc-500 font-mono">F11</span>
                </button>
                <button 
                  onClick={() => { onSearchClick(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-cyan-500/20 hover:text-cyan-300 flex items-center justify-between"
                >
                  <span>Quick Search</span>
                  <span className="text-[10px] text-zinc-500 font-mono">Ctrl+K</span>
                </button>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'audio' ? null : 'audio')}
              className={`px-2 py-1 rounded hover:bg-white/5 transition-colors ${activeMenu === 'audio' ? 'bg-white/10 text-white' : ''}`}
            >
              Audio & Engine
            </button>
            {activeMenu === 'audio' && (
              <div 
                className="absolute top-full left-0 mt-1 w-52 bg-[#141722] border border-white/10 rounded-lg shadow-2xl py-1 text-zinc-300 z-50 backdrop-blur-xl"
                onMouseLeave={() => setActiveMenu(null)}
              >
                <div className="px-3 py-1 text-[10px] text-zinc-500 uppercase font-semibold">Audio Output Mode</div>
                <div className="px-3 py-1 text-xs text-cyan-400 flex items-center justify-between">
                  <span>Dolby Atmos Virtualizer</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                </div>
                <div className="h-px bg-white/5 my-1" />
                <div className="px-3 py-1 text-[10px] text-zinc-500 uppercase font-semibold">Video Render Core</div>
                <div className="px-3 py-1 text-xs text-emerald-400 flex items-center justify-between">
                  <span>Hardware Accelerated 4K</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Current View Breadcrumb */}
        <div className="hidden lg:flex items-center space-x-1.5 text-zinc-500 pl-3 border-l border-white/5 text-[11px]">
          <span>App</span>
          <span>/</span>
          <span className="text-zinc-300 font-medium">{currentViewTitle}</span>
        </div>
      </div>

      {/* Center: Quick Search Bar trigger */}
      <div className="flex-1 max-w-md mx-4">
        <button
          onClick={onSearchClick}
          className="w-full bg-[#131620] hover:bg-[#1a1e2c] border border-white/5 hover:border-cyan-500/30 rounded-full px-3 py-1 flex items-center justify-between text-zinc-400 hover:text-white transition-all group"
        >
          <div className="flex items-center space-x-2 truncate">
            <Search className="w-3.5 h-3.5 text-zinc-400 group-hover:text-cyan-400 transition-colors" />
            <span className="text-xs truncate">Search movies, series, anime, actors...</span>
          </div>
          <kbd className="hidden sm:inline-block bg-white/5 border border-white/10 rounded px-1.5 py-0.2 text-[10px] font-mono text-zinc-400">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right: System HUD Indicators & Native Window Controls */}
      <div className="flex items-center space-x-2">
        {/* Hardware & Audio Status Badges */}
        <div className="hidden xl:flex items-center space-x-2 mr-2">
          <div className="flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>4K HDR DIRECT</span>
          </div>
          <div className="flex items-center space-x-1 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-mono">
            <Volume2 className="w-3 h-3 text-cyan-400" />
            <span>DOLBY ATMOS</span>
          </div>
        </div>

        {/* Windows / PC Standard Window Controls */}
        <div className="flex items-center -mr-2">
          {/* Minimize button */}
          <button
            onClick={handleMinimize}
            title="Minimize"
            className="w-10 h-10 flex items-center justify-center hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          {/* Maximize / Restore button */}
          <button
            onClick={handleMaximizeToggle}
            title={isWindowMaximized ? 'Restore Down' : 'Maximize'}
            className="w-10 h-10 flex items-center justify-center hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            {isWindowMaximized ? <Square className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
          </button>

          {/* Fullscreen Toggle (F11) */}
          <button
            onClick={onToggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen (F11)' : 'Enter Fullscreen (F11)'}
            className="w-10 h-10 flex items-center justify-center hover:bg-cyan-500/20 text-zinc-400 hover:text-cyan-300 transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Tv className="w-3.5 h-3.5" />}
          </button>

          {/* Close button */}
          <button
            onClick={handleClose}
            title="Close CineScope"
            className="w-11 h-10 flex items-center justify-center hover:bg-red-600 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Exit Notice Toast for desktop browser environment */}
      {showExitNotice && (
        <div className="fixed top-12 right-4 bg-zinc-900 border border-zinc-700 text-zinc-200 px-4 py-2.5 rounded-lg shadow-2xl flex items-center space-x-2 text-xs z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          <span>CineScope PC is running in active desktop stream session.</span>
        </div>
      )}
    </header>
  );
};
