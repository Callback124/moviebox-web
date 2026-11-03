import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  RotateCcw, 
  RotateCw, 
  X, 
  Settings, 
  ListVideo, 
  Download, 
  SlidersHorizontal,
  ChevronRight,
  Tv,
  Check,
  Subtitles,
  ExternalLink,
  Sparkles,
  Layers,
  FastForward
} from 'lucide-react';
import { MediaItem, Episode } from '../types/media';

interface VideoPlayerModalProps {
  media: MediaItem;
  initialEpisode?: Episode;
  onClose: () => void;
  onDownloadRequest: (media: MediaItem, quality: '4K HDR' | '1080p FHD' | '720p HD') => void;
  onUpdateWatchProgress: (id: number, progress: number, duration: number) => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  media,
  initialEpisode,
  onClose,
  onDownloadRequest,
  onUpdateWatchProgress
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(1);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlayerFullscreen, setIsPlayerFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [activeServer, setActiveServer] = useState<'server1' | 'server2' | 'trailer'>('server1');
  const [activeQuality, setActiveQuality] = useState<'4K' | '1080p' | '720p'>('4K');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '21:9' | 'fill'>('16:9');
  
  // Audio & Subtitles
  const [activeAudio, setActiveAudio] = useState('English (Dolby Atmos 5.1)');
  const [activeSubtitle, setActiveSubtitle] = useState<'off' | 'en' | 'hi' | 'ja'>('en');
  const [showAudioSubMenu, setShowAudioSubMenu] = useState(false);
  
  // Episode Drawer for TV / Anime
  const [showEpisodeDrawer, setShowEpisodeDrawer] = useState(false);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | undefined>(
    initialEpisode || media.seasons?.[0]?.episodes?.[0]
  );

  // Auto-hide controls timeout
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetControlsTimeout = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3200);
  };

  // Video time formatting
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const h = Math.floor(m / 60);
    if (h > 0) {
      return `${h}:${String(m % 60).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  // Play / Pause toggle
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    resetControlsTimeout();
  };

  // Seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = targetTime;
      setCurrentTime(targetTime);
    }
  };

  const seekBy = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(videoRef.current.currentTime + seconds, duration));
      resetControlsTimeout();
    }
  };

  // Volume
  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    setIsMuted(newVol === 0);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      if (videoRef.current) videoRef.current.volume = volume || 0.8;
    } else {
      setIsMuted(true);
      if (videoRef.current) videoRef.current.volume = 0;
    }
  };

  // Fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsPlayerFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsPlayerFullscreen(false);
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'ArrowLeft' || e.key === 'j') {
        seekBy(-10);
      } else if (e.key === 'ArrowRight' || e.key === 'l') {
        seekBy(10);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handleVolumeChange(Math.min(1, volume + 0.1));
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleVolumeChange(Math.max(0, volume - 0.1));
      } else if (e.key === 'm') {
        toggleMute();
      } else if (e.key === 'f') {
        toggleFullscreen();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, volume, isMuted, duration]);

  // Video stream source selection
  const streamSource = activeServer === 'server1' 
    ? (currentEpisode?.stream_url || media.stream_url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4')
    : (media.backup_stream_url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');

  return (
    <div 
      ref={containerRef}
      onMouseMove={resetControlsTimeout}
      className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center select-none overflow-hidden"
    >
      {/* Active Video Player or Trailer Iframe */}
      {activeServer === 'trailer' && media.trailer_key ? (
        <div className="w-full h-full relative flex items-center justify-center">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${media.trailer_key}?autoplay=1&rel=0&modestbranding=1`}
            title={`${media.title} Official Trailer`}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
          {/* Top Bar overlay for closing */}
          <div className="absolute top-4 right-4 z-30">
            <button
              onClick={() => setActiveServer('server1')}
              className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold text-xs mr-2 hover:bg-cyan-500/30"
            >
              Back to 4K Stream
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-black/60 hover:bg-red-600 text-white border border-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-full flex items-center justify-center bg-black">
          {/* Main Video Element */}
          <video
            ref={videoRef}
            src={streamSource}
            autoPlay
            playsInline
            onTimeUpdate={() => {
              if (videoRef.current) {
                setCurrentTime(videoRef.current.currentTime);
                onUpdateWatchProgress(media.id, videoRef.current.currentTime, videoRef.current.duration || 1);
              }
            }}
            onLoadedMetadata={() => {
              if (videoRef.current) {
                setDuration(videoRef.current.duration || 1);
                videoRef.current.playbackRate = playbackSpeed;
              }
            }}
            onEnded={() => setIsPlaying(false)}
            onClick={togglePlay}
            className={`w-full max-h-full transition-all duration-300 ${
              aspectRatio === '21:9' 
                ? 'scale-y-[0.85]' 
                : aspectRatio === 'fill' 
                  ? 'h-full object-cover' 
                  : 'object-contain'
            }`}
          />

          {/* Subtitle Display Simulation */}
          {activeSubtitle !== 'off' && currentTime > 3 && (
            <div className="absolute bottom-24 inset-x-0 flex justify-center pointer-events-none px-4 text-center">
              <span className="bg-black/75 backdrop-blur-sm text-yellow-300 px-4 py-1.5 rounded-lg text-sm sm:text-base md:text-lg font-medium tracking-wide shadow-2xl border border-white/5">
                {activeSubtitle === 'hi' 
                  ? '[हिन्दी उपशीर्षक] ब्रह्मांड का भाग्य हमारे हाथों में है...'
                  : activeSubtitle === 'ja'
                    ? '[日本語] 俺たちは最後まで戦い抜く！'
                    : '[English Subtitles] The fate of the known universe is within our grasp...'}
              </span>
            </div>
          )}

          {/* Skip Intro Button (Visible at 0:05 - 0:35) */}
          {currentTime > 4 && currentTime < 35 && (
            <div className="absolute left-6 bottom-24 z-30">
              <button
                onClick={() => seekBy(30)}
                className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/20 text-white text-xs font-bold tracking-wider uppercase flex items-center space-x-2 transition-transform hover:scale-105"
              >
                <FastForward className="w-4 h-4 text-cyan-400" />
                <span>Skip Intro</span>
              </button>
            </div>
          )}

          {/* Overlay Controls */}
          <div 
            className={`absolute inset-0 flex flex-col justify-between p-4 md:p-6 bg-gradient-to-t from-black/90 via-transparent to-black/80 transition-opacity duration-300 ${
              showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between z-20">
              <div className="flex items-center space-x-3">
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title="Close Player (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
                <div>
                  <h3 className="text-white font-bold text-sm sm:text-base flex items-center space-x-2">
                    <span>{media.title}</span>
                    {currentEpisode && (
                      <span className="text-cyan-400 text-xs font-mono font-normal">
                        - S{currentEpisode.season_number}:E{currentEpisode.episode_number} {currentEpisode.name}
                      </span>
                    )}
                  </h3>
                  <div className="flex items-center space-x-2 text-[11px] text-zinc-400">
                    <span className="text-emerald-400 font-mono">LIVE 4K 60FPS</span>
                    <span>•</span>
                    <span>{activeAudio}</span>
                    <span>•</span>
                    <span className="uppercase text-cyan-400">{activeQuality} DIRECT</span>
                  </div>
                </div>
              </div>

              {/* Top Right Actions */}
              <div className="flex items-center space-x-2">
                {/* Server Switcher */}
                <div className="hidden sm:flex items-center space-x-1 bg-black/50 p-1 rounded-xl border border-white/10 backdrop-blur-md">
                  <button
                    onClick={() => setActiveServer('server1')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                      activeServer === 'server1' ? 'bg-cyan-500 text-black font-bold' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Server 1 (4K)
                  </button>
                  <button
                    onClick={() => setActiveServer('server2')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                      activeServer === 'server2' ? 'bg-cyan-500 text-black font-bold' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Server 2 (1080p)
                  </button>
                  {media.trailer_key && (
                    <button
                      onClick={() => setActiveServer('trailer')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                        activeServer === 'trailer' ? 'bg-cyan-500 text-black font-bold' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Trailer HD
                    </button>
                  )}
                </div>

                {/* Episodes button for Series */}
                {media.type === 'tv' && media.seasons && media.seasons.length > 0 && (
                  <button
                    onClick={() => setShowEpisodeDrawer(!showEpisodeDrawer)}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors border border-white/10"
                    title="Episodes List"
                  >
                    <ListVideo className="w-4 h-4 text-cyan-400" />
                    <span className="hidden md:inline">Episodes</span>
                  </button>
                )}

                {/* Download Button */}
                <button
                  onClick={() => onDownloadRequest(media, '4K HDR')}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title="Download to PC for Offline Viewing"
                >
                  <Download className="w-4 h-4 text-cyan-400" />
                </button>
              </div>
            </div>

            {/* Center Big Play Indicator on Pause */}
            {!isPlaying && (
              <div className="self-center cursor-pointer" onClick={togglePlay}>
                <div className="w-20 h-20 rounded-full bg-cyan-400/90 text-black flex items-center justify-center shadow-2xl shadow-cyan-500/50 hover:scale-110 active:scale-95 transition-all">
                  <Play className="w-10 h-10 fill-black ml-1" />
                </div>
              </div>
            )}

            {/* Bottom Controls Bar */}
            <div className="space-y-3 z-20">
              {/* Scrubber Progress Slider */}
              <div className="group/scrub relative flex items-center">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  step="0.1"
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 bg-white/20 group-hover/scrub:h-2.5 rounded-full appearance-none cursor-pointer accent-cyan-400 transition-all"
                />
              </div>

              {/* Bottom Buttons Bar */}
              <div className="flex items-center justify-between text-xs text-white">
                {/* Left: Play, Seek, Volume, Timestamps */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={togglePlay}
                    className="p-2 rounded-lg hover:bg-white/10 text-white transition-colors"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
                  </button>

                  <button
                    onClick={() => seekBy(-10)}
                    className="p-2 rounded-lg hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
                    title="Rewind 10s (Left Arrow)"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => seekBy(10)}
                    className="p-2 rounded-lg hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
                    title="Forward 10s (Right Arrow)"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>

                  {/* Volume Slider */}
                  <div className="flex items-center space-x-1.5 group/vol">
                    <button
                      onClick={toggleMute}
                      className="p-2 rounded-lg hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
                    >
                      {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={isMuted ? 0 : volume}
                      onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                      className="w-16 h-1 bg-white/20 rounded-full appearance-none accent-cyan-400 cursor-pointer hidden group-hover/vol:inline-block"
                    />
                  </div>

                  {/* Time Counter */}
                  <span className="font-mono text-zinc-300 text-[11px] ml-1">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                {/* Right: Audio/Subtitles, Speed, Aspect, Fullscreen */}
                <div className="flex items-center space-x-2 relative">
                  {/* Audio & Subtitles Selector */}
                  <div className="relative">
                    <button
                      onClick={() => setShowAudioSubMenu(!showAudioSubMenu)}
                      className="p-2 rounded-lg hover:bg-white/10 text-zinc-300 hover:text-white transition-colors flex items-center space-x-1"
                      title="Audio & Subtitles"
                    >
                      <Subtitles className="w-4 h-4" />
                      <span className="text-[10px] uppercase font-mono">{activeSubtitle}</span>
                    </button>

                    {showAudioSubMenu && (
                      <div className="absolute bottom-full right-0 mb-2 w-64 bg-[#141724] border border-white/10 rounded-2xl shadow-2xl p-3 text-zinc-300 z-50 backdrop-blur-2xl">
                        <div className="text-[10px] text-zinc-500 uppercase font-bold mb-1.5">Audio Track</div>
                        <div className="space-y-1 mb-3">
                          {['English (Dolby Atmos 5.1)', 'Hindi (5.1 Surround)', 'Japanese (Master Audio)'].map((track) => (
                            <button
                              key={track}
                              onClick={() => { setActiveAudio(track); }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between ${
                                activeAudio === track ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'hover:bg-white/5'
                              }`}
                            >
                              <span>{track}</span>
                              {activeAudio === track && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                            </button>
                          ))}
                        </div>

                        <div className="h-px bg-white/10 my-2" />

                        <div className="text-[10px] text-zinc-500 uppercase font-bold mb-1.5">Subtitles</div>
                        <div className="grid grid-cols-2 gap-1">
                          {[
                            { id: 'off', label: 'Off' },
                            { id: 'en', label: 'English' },
                            { id: 'hi', label: 'Hindi' },
                            { id: 'ja', label: 'Japanese' }
                          ].map((sub) => (
                            <button
                              key={sub.id}
                              onClick={() => { setActiveSubtitle(sub.id as any); }}
                              className={`px-2.5 py-1 rounded-lg text-xs text-center ${
                                activeSubtitle === sub.id ? 'bg-cyan-500 text-black font-bold' : 'bg-white/5 hover:bg-white/10'
                              }`}
                            >
                              {sub.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Speed Selector */}
                  <button
                    onClick={() => {
                      const speeds = [0.75, 1, 1.25, 1.5, 2];
                      const next = speeds[(speeds.indexOf(playbackSpeed) + 1) % speeds.length];
                      setPlaybackSpeed(next);
                      if (videoRef.current) videoRef.current.playbackRate = next;
                    }}
                    className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-zinc-300 text-[11px] font-mono"
                    title="Playback Speed"
                  >
                    {playbackSpeed}x
                  </button>

                  {/* Aspect Ratio */}
                  <button
                    onClick={() => {
                      const ratios: ('16:9' | '21:9' | 'fill')[] = ['16:9', '21:9', 'fill'];
                      setAspectRatio(ratios[(ratios.indexOf(aspectRatio) + 1) % ratios.length]);
                    }}
                    className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-zinc-300 text-[10px] font-mono uppercase"
                    title="Toggle Aspect Ratio"
                  >
                    {aspectRatio}
                  </button>

                  {/* Fullscreen Toggle */}
                  <button
                    onClick={toggleFullscreen}
                    className="p-2 rounded-lg hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
                    title="Fullscreen (F)"
                  >
                    {isPlayerFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Episode Quick Drawer (Sliding from Right) */}
      {showEpisodeDrawer && media.seasons && (
        <div className="absolute right-0 inset-y-0 w-80 sm:w-96 bg-[#0E111A]/95 border-l border-white/10 backdrop-blur-2xl z-40 p-4 flex flex-col justify-between shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h4 className="text-sm font-bold text-white flex items-center space-x-2">
              <Tv className="w-4 h-4 text-cyan-400" />
              <span>Episodes Selection</span>
            </h4>
            <button
              onClick={() => setShowEpisodeDrawer(false)}
              className="p-1 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Episode List Scroll */}
          <div className="flex-1 overflow-y-auto space-y-2 py-3 pr-1">
            {media.seasons[0]?.episodes?.map((ep) => {
              const isSelected = currentEpisode?.id === ep.id;
              return (
                <div
                  key={ep.id}
                  onClick={() => {
                    setCurrentEpisode(ep);
                    if (videoRef.current) {
                      videoRef.current.currentTime = 0;
                      videoRef.current.play();
                    }
                  }}
                  className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center space-x-3 ${
                    isSelected 
                      ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-lg shadow-cyan-950/40' 
                      : 'bg-white/[0.03] border-white/5 text-zinc-300 hover:bg-white/10'
                  }`}
                >
                  <div className="w-20 h-12 rounded-lg bg-zinc-900 overflow-hidden relative shrink-0">
                    {ep.still_path ? (
                      <img src={ep.still_path} alt={ep.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-zinc-500 font-mono">
                        EP {ep.episode_number}
                      </div>
                    )}
                    {isSelected && (
                      <div className="absolute inset-0 bg-cyan-500/40 flex items-center justify-center">
                        <Play className="w-4 h-4 fill-white text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold truncate">
                      {ep.episode_number}. {ep.name}
                    </div>
                    <div className="text-[10px] text-zinc-500 flex items-center space-x-2">
                      <span>{ep.runtime || 24}m</span>
                      {ep.vote_average && (
                        <span>★ {ep.vote_average.toFixed(1)}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-white/10 text-center">
            <span className="text-[11px] text-zinc-500">
              Season 1 • {media.seasons[0]?.episodes?.length || 0} Episodes Available
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
