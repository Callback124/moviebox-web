import React, { useState, useEffect } from 'react';
import { 
  DesktopTitlebar 
} from './components/DesktopTitlebar';
import { 
  Sidebar, 
  TabType 
} from './components/Sidebar';
import { 
  HeroCarousel 
} from './components/HeroCarousel';
import { 
  MediaRow 
} from './components/MediaRow';
import { 
  MediaCard 
} from './components/MediaCard';
import { 
  VideoPlayerModal 
} from './components/VideoPlayerModal';
import { 
  MediaDetailModal 
} from './components/MediaDetailModal';
import { 
  DownloadsManagerModal 
} from './components/DownloadsManagerModal';
import { 
  SettingsModal 
} from './components/SettingsModal';
import { 
  SearchOverlay 
} from './components/SearchOverlay';
import { 
  MediaItem, 
  DownloadItem, 
  UserPreferences, 
  Episode 
} from './types/media';
import { 
  CURATED_MEDIA, 
  INITIAL_DOWNLOADS 
} from './data/curatedMedia';
import { 
  getCategoryMedia, 
  loadMediaDetails, 
  WATCHLIST_STORAGE_KEY, 
  HISTORY_STORAGE_KEY, 
  PREFS_STORAGE_KEY, 
  DOWNLOADS_STORAGE_KEY 
} from './services/tmdbApi';
import { 
  Play, 
  Film, 
  Tv, 
  Sparkles, 
  Flame, 
  Clock, 
  Bookmark, 
  Download, 
  TrendingUp, 
  Star, 
  SlidersHorizontal,
  HardDrive,
  FolderOpen
} from 'lucide-react';

export default function App() {
  // Navigation & View State
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'popular' | 'top_rated' | '4k'>('popular');

  // Media Data State
  const [items, setItems] = useState<MediaItem[]>(CURATED_MEDIA);
  const [isLoading, setIsLoading] = useState(false);

  // User Library State
  const [watchlist, setWatchlist] = useState<MediaItem[]>(() => {
    try {
      const raw = localStorage.getItem(WATCHLIST_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [CURATED_MEDIA[0], CURATED_MEDIA[2]];
    } catch {
      return [CURATED_MEDIA[0], CURATED_MEDIA[2]];
    }
  });

  const [history, setHistory] = useState<MediaItem[]>(() => {
    try {
      const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [
        { ...CURATED_MEDIA[1], user_progress: 1800, total_duration: 7200 },
        { ...CURATED_MEDIA[3], user_progress: 850, total_duration: 1440 }
      ];
    } catch {
      return [];
    }
  });

  const [downloads, setDownloads] = useState<DownloadItem[]>(() => {
    try {
      const raw = localStorage.getItem(DOWNLOADS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : INITIAL_DOWNLOADS;
    } catch {
      return INITIAL_DOWNLOADS;
    }
  });

  // User Preferences
  const [userPrefs, setUserPrefs] = useState<UserPreferences>(() => {
    try {
      const raw = localStorage.getItem(PREFS_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return {
      tmdbApiKey: '',
      region: 'IN',
      language: 'en-US',
      preferredQuality: 'Auto',
      audioMode: 'Dolby Atmos Emulation',
      hardwareAcceleration: true,
      accentColor: 'cyan',
      subtitleSize: 'medium',
      subtitleColor: 'yellow'
    };
  });

  // Modals State
  const [activePlayerMedia, setActivePlayerMedia] = useState<MediaItem | null>(null);
  const [activePlayerEpisode, setActivePlayerEpisode] = useState<Episode | undefined>(undefined);
  const [inspectorMedia, setInspectorMedia] = useState<MediaItem | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDownloadsOpen, setIsDownloadsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Persistence effects
  useEffect(() => {
    try {
      localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(watchlist));
    } catch {}
  }, [watchlist]);

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch {}
  }, [history]);

  useEffect(() => {
    try {
      localStorage.setItem(DOWNLOADS_STORAGE_KEY, JSON.stringify(downloads));
    } catch {}
  }, [downloads]);

  useEffect(() => {
    try {
      localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(userPrefs));
    } catch {}
  }, [userPrefs]);

  // Load items when currentTab or activeFilter changes
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      if (['watchlist', 'history', 'downloads'].includes(currentTab)) return;

      setIsLoading(true);
      try {
        const res = await getCategoryMedia(
          currentTab as 'home' | 'movies' | 'tv' | 'anime' | 'hindi',
          activeFilter
        );
        if (isMounted && res.length > 0) {
          setItems(res);
        }
      } catch {
        if (isMounted) setItems(CURATED_MEDIA);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [currentTab, activeFilter, userPrefs.tmdbApiKey]);

  // Download Progress Simulator
  useEffect(() => {
    const activeDls = downloads.filter((d) => d.status === 'downloading');
    if (activeDls.length === 0) return;

    const timer = setInterval(() => {
      setDownloads((prev) =>
        prev.map((d) => {
          if (d.status !== 'downloading') return d;
          const nextProgress = d.progress + 4;
          if (nextProgress >= 100) {
            return {
              ...d,
              progress: 100,
              status: 'completed',
              speed: '0 KB/s',
              downloadedAt: 'Just Now'
            };
          }
          return {
            ...d,
            progress: nextProgress,
            speed: `${(18 + Math.random() * 8).toFixed(1)} MB/s`
          };
        })
      );
    }, 1200);

    return () => clearInterval(timer);
  }, [downloads]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleGlobalKeys = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setIsDownloadsOpen(true);
      } else if ((e.ctrlKey || e.metaKey) && e.key === ',') {
        e.preventDefault();
        setIsSettingsOpen(true);
      } else if (e.key === 'F11') {
        e.preventDefault();
        toggleAppFullscreen();
      }
    };

    window.addEventListener('keydown', handleGlobalKeys);
    return () => window.removeEventListener('keydown', handleGlobalKeys);
  }, [isFullscreen]);

  const toggleAppFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Watchlist Handlers
  const isInWatchlist = (id: number) => watchlist.some((m) => m.id === id);

  const toggleWatchlist = (item: MediaItem) => {
    if (isInWatchlist(item.id)) {
      setWatchlist((prev) => prev.filter((m) => m.id !== item.id));
    } else {
      setWatchlist((prev) => [item, ...prev]);
    }
  };

  // Playback Handlers
  const handlePlayMedia = (media: MediaItem, episode?: Episode) => {
    setActivePlayerMedia(media);
    setActivePlayerEpisode(episode);
    // Push into history
    setHistory((prev) => {
      const filtered = prev.filter((m) => m.id !== media.id);
      return [media, ...filtered].slice(0, 50);
    });
  };

  const handleUpdateWatchProgress = (id: number, progress: number, duration: number) => {
    setHistory((prev) =>
      prev.map((m) => (m.id === id ? { ...m, user_progress: progress, total_duration: duration } : m))
    );
  };

  // Download Handler
  const handleDownloadRequest = (media: MediaItem, quality: '4K HDR' | '1080p FHD' | '720p HD') => {
    const newDownload: DownloadItem = {
      id: `dl-${Date.now()}`,
      mediaId: media.id,
      title: `${media.title} (${(media.release_date || media.first_air_date || '2024').slice(0, 4)})`,
      type: media.type,
      poster: media.poster_path,
      quality,
      fileSize: quality === '4K HDR' ? '4.2 GB' : quality === '1080p FHD' ? '1.8 GB' : '850 MB',
      progress: 0,
      status: 'downloading',
      speed: '22.5 MB/s',
      stream_url: media.stream_url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      downloadedAt: 'Downloading...'
    };

    setDownloads((prev) => [newDownload, ...prev]);
    setIsDownloadsOpen(true);
  };

  const handlePlayOffline = (download: DownloadItem) => {
    const found = items.find((m) => m.id === download.mediaId) || CURATED_MEDIA.find((m) => m.id === download.mediaId);
    if (found) {
      handlePlayMedia(found);
      setIsDownloadsOpen(false);
    } else {
      const syntheticMedia: MediaItem = {
        id: download.mediaId,
        title: download.title,
        type: download.type,
        overview: 'Downloaded offline media ready for playback on this PC.',
        backdrop_path: download.poster,
        poster_path: download.poster,
        vote_average: 9.0,
        genres: ['Offline Download', 'High Definition'],
        stream_url: download.stream_url,
        is_4k: download.quality === '4K HDR'
      };
      handlePlayMedia(syntheticMedia);
      setIsDownloadsOpen(false);
    }
  };

  const handleDeleteDownload = (id: string) => {
    setDownloads((prev) => prev.filter((d) => d.id !== id));
  };

  const handleTogglePauseDownload = (id: string) => {
    setDownloads((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: d.status === 'paused' ? 'downloading' : 'paused' } : d))
    );
  };

  const handleClearCompletedDownloads = () => {
    setDownloads((prev) => prev.filter((d) => d.status !== 'completed'));
  };

  // Open Details Inspector
  const handleOpenDetails = async (item: MediaItem) => {
    setInspectorMedia(item);
    // Enrich with live TMDB data in background
    try {
      const enriched = await loadMediaDetails(item.id, item.type);
      setInspectorMedia(enriched);
    } catch {}
  };

  const getTabTitle = () => {
    switch (currentTab) {
      case 'home': return 'Home Premiere';
      case 'movies': return 'Movies & Blockbusters';
      case 'tv': return 'TV Shows & Binge Series';
      case 'anime': return 'Anime Hub (Sub & Dub)';
      case 'hindi': return 'Hindi Cinema & Bollywood';
      case 'watchlist': return 'My Watchlist';
      case 'history': return 'Watch History';
      case 'downloads': return 'PC Downloads';
      default: return 'Discover';
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-[#08090D] text-[#ECEFF4] overflow-hidden select-none">
      {/* PC Window Header with Menus & Window Controls */}
      <DesktopTitlebar
        onSearchClick={() => setIsSearchOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenDownloads={() => setIsDownloadsOpen(true)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleAppFullscreen}
        currentViewTitle={getTabTitle()}
      />

      {/* Main Desktop Workspace Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Desktop Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          watchlistCount={watchlist.length}
          downloadCount={downloads.length}
          hasActiveDownload={downloads.some((d) => d.status === 'downloading')}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenDownloads={() => setIsDownloadsOpen(true)}
          apiKeyPresent={Boolean(userPrefs.tmdbApiKey)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Viewport Content View */}
        <main className="flex-1 overflow-y-auto no-scrollbar relative p-4 sm:p-6 lg:p-8">
          {/* Main Views Router */}
          {currentTab === 'home' && (
            <div>
              {/* Featured Hero Carousel */}
              <HeroCarousel
                items={items}
                onPlay={handlePlayMedia}
                onOpenDetails={handleOpenDetails}
                onToggleWatchlist={toggleWatchlist}
                isInWatchlist={isInWatchlist}
              />

              {/* Continue Watching Section (If history available) */}
              {history.length > 0 && (
                <section className="mb-8">
                  <div className="flex items-center space-x-2 mb-3">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                      Continue Watching on PC
                    </h3>
                  </div>
                  <div className="flex items-center space-x-4 overflow-x-auto no-scrollbar py-1">
                    {history.slice(0, 6).map((item) => (
                      <MediaCard
                        key={`cw-${item.id}`}
                        item={item}
                        onPlay={handlePlayMedia}
                        onOpenDetails={handleOpenDetails}
                        onToggleWatchlist={toggleWatchlist}
                        isInWatchlist={isInWatchlist(item.id)}
                        progressPercent={Math.min(90, Math.round(((item.user_progress || 1200) / (item.total_duration || 7200)) * 100))}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Top 10 Today Row */}
              <MediaRow
                title="Top 10 Streaming on CineScope Today"
                subtitle="Ranked by millions of stream hours worldwide"
                items={items.slice(0, 10)}
                isTop10={true}
                onPlay={handlePlayMedia}
                onOpenDetails={handleOpenDetails}
                onToggleWatchlist={toggleWatchlist}
                isInWatchlist={isInWatchlist}
              />

              {/* Trending Now */}
              <MediaRow
                title="Trending Movies & Shows"
                icon={<TrendingUp className="w-5 h-5" />}
                items={items}
                onPlay={handlePlayMedia}
                onOpenDetails={handleOpenDetails}
                onToggleWatchlist={toggleWatchlist}
                isInWatchlist={isInWatchlist}
              />

              {/* Popular Movies */}
              <MediaRow
                title="4K Ultra HD Cinema"
                icon={<Film className="w-5 h-5" />}
                items={items.filter((m) => m.type === 'movie')}
                onPlay={handlePlayMedia}
                onOpenDetails={handleOpenDetails}
                onToggleWatchlist={toggleWatchlist}
                isInWatchlist={isInWatchlist}
              />

              {/* Popular TV Series */}
              <MediaRow
                title="Binge-Worthy TV Series"
                icon={<Tv className="w-5 h-5" />}
                items={items.filter((m) => m.type === 'tv' && m.category !== 'anime')}
                onPlay={handlePlayMedia}
                onOpenDetails={handleOpenDetails}
                onToggleWatchlist={toggleWatchlist}
                isInWatchlist={isInWatchlist}
              />

              {/* Anime Hub */}
              <MediaRow
                title="Anime Spotlight (Sub & Dub)"
                icon={<Sparkles className="w-5 h-5" />}
                items={items.filter((m) => m.category === 'anime' || m.origin_country?.includes('JP'))}
                onPlay={handlePlayMedia}
                onOpenDetails={handleOpenDetails}
                onToggleWatchlist={toggleWatchlist}
                isInWatchlist={isInWatchlist}
              />

              {/* Hindi Cinema */}
              <MediaRow
                title="Hindi Blockbusters & Originals"
                icon={<Flame className="w-5 h-5" />}
                items={items.filter((m) => m.category === 'hindi' || m.languages?.includes('Hindi'))}
                onPlay={handlePlayMedia}
                onOpenDetails={handleOpenDetails}
                onToggleWatchlist={toggleWatchlist}
                isInWatchlist={isInWatchlist}
              />
            </div>
          )}

          {/* Browse Categories (Movies, TV, Anime, Hindi) */}
          {['movies', 'tv', 'anime', 'hindi'].includes(currentTab) && (
            <div>
              {/* Category Page Header & Filters */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-white/5 gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-2">
                    <span>{getTabTitle()}</span>
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Stream unlimited titles in Ultra HD with multi-channel spatial audio.
                  </p>
                </div>

                {/* Sub-Filters */}
                <div className="flex items-center space-x-2 bg-[#121522] p-1.5 rounded-2xl border border-white/5">
                  <button
                    onClick={() => setActiveFilter('popular')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      activeFilter === 'popular'
                        ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Popular
                  </button>
                  <button
                    onClick={() => setActiveFilter('top_rated')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      activeFilter === 'top_rated'
                        ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Top Rated
                  </button>
                  <button
                    onClick={() => setActiveFilter('4k')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      activeFilter === '4k'
                        ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    4K Mastered
                  </button>
                </div>
              </div>

              {/* Grid of Titles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {items.map((item) => (
                  <MediaCard
                    key={`grid-${item.id}`}
                    item={item}
                    onPlay={handlePlayMedia}
                    onOpenDetails={handleOpenDetails}
                    onToggleWatchlist={toggleWatchlist}
                    isInWatchlist={isInWatchlist(item.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Watchlist View */}
          {currentTab === 'watchlist' && (
            <div>
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/5">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-2">
                    <Bookmark className="w-6 h-6 text-cyan-400" />
                    <span>My Watchlist ({watchlist.length})</span>
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Your personal saved list for quick streaming and offline queueing.
                  </p>
                </div>
              </div>

              {watchlist.length === 0 ? (
                <div className="py-24 text-center text-zinc-500">
                  <Bookmark className="w-12 h-12 mx-auto mb-3 opacity-30 text-cyan-400" />
                  <h4 className="text-base font-bold text-zinc-300">Your Watchlist is Empty</h4>
                  <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                    Browse movies or TV shows and click the "+ Add to List" button to pin titles here.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {watchlist.map((item) => (
                    <MediaCard
                      key={`wl-${item.id}`}
                      item={item}
                      onPlay={handlePlayMedia}
                      onOpenDetails={handleOpenDetails}
                      onToggleWatchlist={toggleWatchlist}
                      isInWatchlist={true}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Watch History View */}
          {currentTab === 'history' && (
            <div>
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/5">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-2">
                    <Clock className="w-6 h-6 text-cyan-400" />
                    <span>Watch History & Resume</span>
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Resume playback from where you left off on this device.
                  </p>
                </div>

                {history.length > 0 && (
                  <button
                    onClick={() => setHistory([])}
                    className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-xs font-semibold text-zinc-400 hover:text-red-400 transition-colors"
                  >
                    Clear History
                  </button>
                )}
              </div>

              {history.length === 0 ? (
                <div className="py-24 text-center text-zinc-500">
                  <Clock className="w-12 h-12 mx-auto mb-3 opacity-30 text-cyan-400" />
                  <h4 className="text-base font-bold text-zinc-300">No Watch History Yet</h4>
                  <p className="text-xs text-zinc-500 mt-1">
                    Titles you play will automatically appear here with progress tracking.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {history.map((item) => (
                    <MediaCard
                      key={`hist-${item.id}`}
                      item={item}
                      onPlay={handlePlayMedia}
                      onOpenDetails={handleOpenDetails}
                      onToggleWatchlist={toggleWatchlist}
                      isInWatchlist={isInWatchlist(item.id)}
                      progressPercent={Math.min(95, Math.round(((item.user_progress || 1400) / (item.total_duration || 7200)) * 100))}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Full Cinematic Video Player Modal */}
      {activePlayerMedia && (
        <VideoPlayerModal
          media={activePlayerMedia}
          initialEpisode={activePlayerEpisode}
          onClose={() => {
            setActivePlayerMedia(null);
            setActivePlayerEpisode(undefined);
          }}
          onDownloadRequest={handleDownloadRequest}
          onUpdateWatchProgress={handleUpdateWatchProgress}
        />
      )}

      {/* Media Detail & Cast Inspector Modal */}
      {inspectorMedia && (
        <MediaDetailModal
          media={inspectorMedia}
          onClose={() => setInspectorMedia(null)}
          onPlay={handlePlayMedia}
          onToggleWatchlist={toggleWatchlist}
          isInWatchlist={isInWatchlist(inspectorMedia.id)}
          onDownloadRequest={handleDownloadRequest}
        />
      )}

      {/* Global Quick Search Overlay */}
      {isSearchOpen && (
        <SearchOverlay
          onClose={() => setIsSearchOpen(false)}
          onPlay={handlePlayMedia}
          onOpenDetails={handleOpenDetails}
          onToggleWatchlist={toggleWatchlist}
          isInWatchlist={isInWatchlist}
        />
      )}

      {/* PC Downloads Manager Modal */}
      {isDownloadsOpen && (
        <DownloadsManagerModal
          downloads={downloads}
          onClose={() => setIsDownloadsOpen(false)}
          onPlayOffline={handlePlayOffline}
          onDeleteDownload={handleDeleteDownload}
          onTogglePauseDownload={handleTogglePauseDownload}
          onClearCompleted={handleClearCompletedDownloads}
        />
      )}

      {/* Preferences & Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal
          prefs={userPrefs}
          onSavePrefs={setUserPrefs}
          onClearHistory={() => setHistory([])}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </div>
  );
}
