import React, { useState } from 'react';
import { 
  X, 
  Play, 
  Plus, 
  Check, 
  Download, 
  Star, 
  Tv, 
  Film, 
  Calendar, 
  Clock, 
  Globe, 
  Sparkles,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { MediaItem, Episode } from '../types/media';

interface MediaDetailModalProps {
  media: MediaItem;
  onClose: () => void;
  onPlay: (media: MediaItem, episode?: Episode) => void;
  onToggleWatchlist: (media: MediaItem) => void;
  isInWatchlist: boolean;
  onDownloadRequest: (media: MediaItem, quality: '4K HDR' | '1080p FHD' | '720p HD') => void;
}

export const MediaDetailModal: React.FC<MediaDetailModalProps> = ({
  media,
  onClose,
  onPlay,
  onToggleWatchlist,
  isInWatchlist,
  onDownloadRequest
}) => {
  const [selectedSeasonIndex, setSelectedSeasonIndex] = useState(0);
  const [downloadDropdown, setDownloadDropdown] = useState(false);

  const releaseYear = (media.release_date || media.first_air_date || '').slice(0, 4);
  const currentSeason = media.seasons ? media.seasons[selectedSeasonIndex] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-xl select-none overflow-y-auto">
      {/* Modal Dialog Card */}
      <div 
        className="relative w-full max-w-4xl bg-[#0E111A] border border-white/10 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button Top Right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/60 hover:bg-white/20 border border-white/10 text-white transition-colors"
          title="Close (Esc)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Container */}
        <div className="overflow-y-auto flex-1 no-scrollbar">
          {/* Header Backdrop Banner */}
          <div className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden">
            <img
              src={media.backdrop_path}
              alt={media.title}
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E111A] via-[#0E111A]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0E111A] via-transparent to-transparent w-1/2" />

            {/* Quick Actions in Backdrop */}
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
              <div>
                {/* Badges */}
                <div className="flex items-center space-x-2 mb-2 flex-wrap gap-y-1">
                  <span className="px-2.5 py-0.5 rounded-md bg-cyan-500 text-black text-xs font-mono font-bold uppercase tracking-wider">
                    {media.type === 'tv' ? 'TV Series' : 'Feature Film'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-amber-400 text-xs font-bold border border-white/10 flex items-center space-x-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{media.vote_average.toFixed(1)} / 10</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white/10 text-zinc-300 text-xs font-mono font-semibold">
                    {media.quality_badge || '4K ULTRA HD'}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                  {media.title}
                </h2>
                {media.tagline && (
                  <p className="text-xs sm:text-sm text-cyan-300/80 italic mt-0.5">
                    "{media.tagline}"
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Body Info */}
          <div className="p-6 space-y-6">
            {/* Main Action Bar */}
            <div className="flex items-center space-x-3 flex-wrap gap-y-2">
              <button
                onClick={() => onPlay(media)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-sm flex items-center space-x-2 shadow-lg shadow-cyan-500/30 hover:scale-105 active:scale-95 transition-all"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>Stream Now (4K)</span>
              </button>

              <button
                onClick={() => onToggleWatchlist(media)}
                className={`px-4 py-2.5 rounded-xl border text-sm font-semibold flex items-center space-x-2 transition-all ${
                  isInWatchlist
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                    : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                }`}
              >
                {isInWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                <span>{isInWatchlist ? 'In My Watchlist' : 'Add to List'}</span>
              </button>

              {/* Download Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDownloadDropdown(!downloadDropdown)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold flex items-center space-x-1.5 transition-all"
                >
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>Download to PC</span>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                </button>

                {downloadDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-[#141724] border border-white/10 rounded-2xl shadow-2xl p-2 z-40 text-xs text-zinc-300">
                    <div className="text-[10px] uppercase font-bold text-zinc-500 px-2 py-1">Select Quality</div>
                    <button
                      onClick={() => { onDownloadRequest(media, '4K HDR'); setDownloadDropdown(false); }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-cyan-500/20 hover:text-cyan-300 flex items-center justify-between"
                    >
                      <span>4K HDR (HEVC)</span>
                      <span className="text-[10px] text-zinc-500">4.2 GB</span>
                    </button>
                    <button
                      onClick={() => { onDownloadRequest(media, '1080p FHD'); setDownloadDropdown(false); }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-cyan-500/20 hover:text-cyan-300 flex items-center justify-between"
                    >
                      <span>1080p Full HD</span>
                      <span className="text-[10px] text-zinc-500">1.8 GB</span>
                    </button>
                    <button
                      onClick={() => { onDownloadRequest(media, '720p HD'); setDownloadDropdown(false); }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-cyan-500/20 hover:text-cyan-300 flex items-center justify-between"
                    >
                      <span>720p HD Compact</span>
                      <span className="text-[10px] text-zinc-500">850 MB</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Meta Tags Row */}
            <div className="flex items-center space-x-4 text-xs text-zinc-400 flex-wrap gap-y-2 border-y border-white/5 py-3">
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                <span>{releaseYear || '2024'}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-zinc-500" />
                <span>{media.type === 'tv' ? `${media.seasons_count || 1} Season(s)` : `${media.runtime || 120} min`}</span>
              </span>
              {media.director && (
                <span>Director: <strong className="text-zinc-200">{media.director}</strong></span>
              )}
              <div className="flex items-center space-x-1">
                {media.genres.map((g) => (
                  <span key={g} className="px-2 py-0.5 rounded bg-white/5 text-zinc-300 text-[11px]">
                    {g}
                  </span>
                ))}
              </div>
            </div>

            {/* Synopsis */}
            <div>
              <h4 className="text-xs font-bold uppercase text-zinc-400 tracking-wider mb-2">
                Synopsis
              </h4>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {media.overview}
              </p>
            </div>

            {/* Streaming Availability (Where to Watch) */}
            {media.providers && media.providers.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase text-zinc-400 tracking-wider mb-2">
                  Streaming Availability (Regional Providers)
                </h4>
                <div className="flex items-center space-x-2 flex-wrap gap-y-2">
                  {media.providers.map((p) => (
                    <div
                      key={p.name}
                      className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/5 text-xs text-white"
                    >
                      <img src={p.logo} alt={p.name} className="w-4 h-4 rounded object-cover" />
                      <span>{p.name}</span>
                      <span className="text-[10px] text-cyan-400 font-mono uppercase bg-cyan-950/60 px-1 py-0.2 rounded">
                        {p.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cast & Crew Horizontal Avatar Cards */}
            {media.cast && media.cast.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase text-zinc-400 tracking-wider mb-3">
                  Starring Cast
                </h4>
                <div className="flex items-center space-x-3 overflow-x-auto no-scrollbar py-1">
                  {media.cast.map((actor) => (
                    <div
                      key={actor.id}
                      className="w-24 shrink-0 text-center flex flex-col items-center group/cast"
                    >
                      <div className="w-14 h-14 rounded-full overflow-hidden bg-zinc-800 border border-white/10 mb-2 group-hover/cast:border-cyan-400 transition-colors">
                        {actor.profile_path ? (
                          <img src={actor.profile_path} alt={actor.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-zinc-500 font-bold">
                            {actor.name[0]}
                          </div>
                        )}
                      </div>
                      <span className="text-[11px] font-semibold text-white truncate w-full" title={actor.name}>
                        {actor.name}
                      </span>
                      <span className="text-[10px] text-zinc-500 truncate w-full" title={actor.character}>
                        {actor.character}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Episodes Accordion (For TV Shows & Anime) */}
            {media.type === 'tv' && media.seasons && media.seasons.length > 0 && (
              <div className="border-t border-white/5 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase text-zinc-400 tracking-wider flex items-center space-x-2">
                    <Tv className="w-4 h-4 text-cyan-400" />
                    <span>Episodes & Seasons</span>
                  </h4>
                  {/* Season Selector */}
                  {media.seasons.length > 1 && (
                    <select
                      value={selectedSeasonIndex}
                      onChange={(e) => setSelectedSeasonIndex(Number(e.target.value))}
                      className="bg-[#141724] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white outline-none focus:border-cyan-400"
                    >
                      {media.seasons.map((s, idx) => (
                        <option key={s.season_number} value={idx}>
                          {s.name} ({s.episode_count} eps)
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Episodes List */}
                <div className="space-y-2">
                  {currentSeason?.episodes?.map((ep) => (
                    <div
                      key={ep.id}
                      onClick={() => onPlay(media, ep)}
                      className="p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-cyan-500/30 cursor-pointer transition-all flex items-center space-x-3.5 group/ep"
                    >
                      <div className="w-24 sm:w-28 h-16 rounded-xl bg-zinc-900 overflow-hidden relative shrink-0">
                        {ep.still_path ? (
                          <img src={ep.still_path} alt={ep.name} className="w-full h-full object-cover group-hover/ep:scale-105 transition-transform" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-zinc-600 font-mono">
                            EP {ep.episode_number}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/ep:opacity-100 flex items-center justify-center transition-opacity">
                          <Play className="w-5 h-5 fill-cyan-400 text-cyan-400" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h5 className="text-xs font-bold text-white group-hover/ep:text-cyan-300 truncate">
                            {ep.episode_number}. {ep.name}
                          </h5>
                          <span className="text-[10px] text-zinc-500 font-mono">
                            {ep.runtime ? `${ep.runtime} min` : '45 min'}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 line-clamp-2">
                          {ep.overview}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
