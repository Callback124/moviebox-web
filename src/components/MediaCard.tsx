import React, { useState } from 'react';
import { Play, Plus, Check, Info, Star, Sparkles, Volume2 } from 'lucide-react';
import { MediaItem } from '../types/media';

interface MediaCardProps {
  item: MediaItem;
  rank?: number;
  onPlay: (item: MediaItem) => void;
  onOpenDetails: (item: MediaItem) => void;
  onToggleWatchlist: (item: MediaItem) => void;
  isInWatchlist: boolean;
  progressPercent?: number; // for continue watching
}

export const MediaCard: React.FC<MediaCardProps> = ({
  item,
  rank,
  onPlay,
  onOpenDetails,
  onToggleWatchlist,
  isInWatchlist,
  progressPercent
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const releaseYear = (item.release_date || item.first_air_date || '').slice(0, 4);
  const matchScore = Math.round(item.vote_average * 10);

  return (
    <div 
      className="relative shrink-0 select-none group/card cursor-pointer transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onOpenDetails(item)}
    >
      {/* Top 10 Rank Style */}
      {rank !== undefined ? (
        <div className="flex items-end w-[240px] h-[190px]">
          {/* Big Rank Number */}
          <span className="text-[120px] font-black leading-none text-transparent stroke-zinc-700 select-none -mr-4 z-10 font-mono tracking-tighter"
            style={{
              WebkitTextStroke: '3px #27272a',
              textShadow: '0 0 20px rgba(0,0,0,0.8)'
            }}
          >
            {rank}
          </span>
          {/* Poster Box */}
          <div className="w-[140px] h-[180px] rounded-2xl overflow-hidden relative shadow-xl border border-white/10 group-hover/card:border-cyan-500/50 group-hover/card:scale-105 transition-all">
            <img 
              src={item.poster_path} 
              alt={item.title} 
              className="w-full h-full object-cover" 
              loading="lazy" 
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center">
              <button 
                onClick={(e) => { e.stopPropagation(); onPlay(item); }}
                className="w-10 h-10 rounded-full bg-cyan-400 text-black flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform"
              >
                <Play className="w-5 h-5 fill-black ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Standard 16:9 Backdrop Card or 2:3 Poster Card */
        <div className="w-[260px] md:w-[280px] rounded-2xl overflow-hidden bg-[#11131c] border border-white/5 group-hover/card:border-cyan-500/40 transition-all duration-300 shadow-lg group-hover/card:shadow-2xl group-hover/card:shadow-cyan-950/30 group-hover/card:-translate-y-1">
          {/* Thumbnail Container */}
          <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
            <img
              src={item.backdrop_path || item.poster_path}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
              loading="lazy"
            />

            {/* Quality Badge Top Right */}
            <div className="absolute top-2 right-2 flex items-center space-x-1">
              {item.is_4k && (
                <span className="px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-mono font-bold text-cyan-300 border border-cyan-500/30">
                  4K UHD
                </span>
              )}
            </div>

            {/* Type Badge Top Left */}
            <div className="absolute top-2 left-2">
              <span className="px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] font-mono text-zinc-300 border border-white/10 uppercase">
                {item.type === 'tv' ? 'Series' : 'Movie'}
              </span>
            </div>

            {/* Continue Watching Progress bar */}
            {progressPercent !== undefined && (
              <div className="absolute bottom-0 inset-x-0 h-1 bg-white/20">
                <div 
                  className="h-full bg-cyan-400" 
                  style={{ width: `${progressPercent}%` }} 
                />
              </div>
            )}

            {/* Play Button Overlay on Hover */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPlay(item);
                }}
                className="w-11 h-11 rounded-full bg-cyan-400 hover:bg-cyan-300 text-black flex items-center justify-center shadow-lg shadow-cyan-500/40 transform scale-90 group-hover/card:scale-100 hover:scale-110 active:scale-95 transition-all"
                title="Stream Now"
              >
                <Play className="w-5 h-5 fill-black ml-0.5" />
              </button>
            </div>
          </div>

          {/* Card Info Details */}
          <div className="p-3">
            <div className="flex items-center justify-between mb-1.5">
              <h4 className="text-xs font-bold text-white truncate max-w-[190px]" title={item.title}>
                {item.title}
              </h4>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleWatchlist(item);
                }}
                className={`p-1 rounded-md transition-colors ${
                  isInWatchlist ? 'text-cyan-400 bg-cyan-500/10' : 'text-zinc-500 hover:text-white'
                }`}
                title={isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
              >
                {isInWatchlist ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Meta Row */}
            <div className="flex items-center space-x-2 text-[11px] text-zinc-400">
              <span className="text-emerald-400 font-semibold">{matchScore}% Match</span>
              <span>•</span>
              <span>{releaseYear}</span>
              {item.runtime ? (
                <>
                  <span>•</span>
                  <span>{item.runtime}m</span>
                </>
              ) : item.seasons_count ? (
                <>
                  <span>•</span>
                  <span>{item.seasons_count}S</span>
                </>
              ) : null}
            </div>

            {/* Genres Tagline */}
            <div className="mt-1 text-[10px] text-zinc-500 truncate">
              {item.genres.slice(0, 2).join(' • ')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
