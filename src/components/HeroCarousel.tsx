import React, { useState, useEffect } from 'react';
import { Play, Info, Plus, Check, Volume2, VolumeX, ChevronRight, ChevronLeft, Sparkles, Star } from 'lucide-react';
import { MediaItem } from '../types/media';

interface HeroCarouselProps {
  items: MediaItem[];
  onPlay: (item: MediaItem) => void;
  onOpenDetails: (item: MediaItem) => void;
  onToggleWatchlist: (item: MediaItem) => void;
  isInWatchlist: (id: number) => boolean;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  items,
  onPlay,
  onOpenDetails,
  onToggleWatchlist,
  isInWatchlist
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAudioMuted, setIsAudioMuted] = useState(true);

  const heroSlides = items.slice(0, 6);
  const current = heroSlides[currentIndex] || items[0];

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroSlides.length);
    }, 7500);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  if (!current) return null;

  const inWatchlist = isInWatchlist(current.id);
  const releaseYear = (current.release_date || current.first_air_date || '2024').slice(0, 4);

  return (
    <div className="relative w-full h-[480px] lg:h-[540px] overflow-hidden rounded-3xl mb-8 group select-none shadow-2xl border border-white/5">
      {/* Background Backdrop Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 scale-105 group-hover:scale-100"
        style={{ backgroundImage: `url(${current.backdrop_path})` }}
      >
        {/* Cinematic Vignette & Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090D] via-[#08090D]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08090D] via-[#08090D]/80 to-transparent w-full md:w-3/4" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-transparent to-black/40" />
      </div>

      {/* Hero Content Overlay */}
      <div className="relative h-full flex flex-col justify-end p-6 md:p-10 z-10 max-w-2xl">
        {/* Badges Bar */}
        <div className="flex items-center space-x-2.5 mb-3 flex-wrap gap-y-2">
          <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold flex items-center space-x-1 shadow-sm">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>FEATURED PREMIERE</span>
          </span>
          <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center space-x-1">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{current.vote_average.toFixed(1)} Rating</span>
          </span>
          <span className="px-2 py-0.5 rounded bg-white/10 text-zinc-300 text-xs font-mono font-semibold">
            {current.quality_badge || '4K ULTRA HD'}
          </span>
          <span className="text-zinc-400 text-xs font-medium">
            {releaseYear}
          </span>
          <span className="text-zinc-400 text-xs">
            {current.type === 'tv' ? `${current.seasons_count || 1} Seasons` : `${current.runtime || 120} min`}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-2 drop-shadow-lg line-clamp-2">
          {current.title}
        </h1>

        {/* Tagline / Genres */}
        <div className="flex items-center space-x-2 text-xs text-zinc-400 mb-3">
          {current.genres.slice(0, 3).map((g, idx) => (
            <React.Fragment key={g}>
              <span className="text-zinc-300 hover:text-cyan-400 cursor-pointer">{g}</span>
              {idx < Math.min(current.genres.length - 1, 2) && <span className="text-zinc-600">•</span>}
            </React.Fragment>
          ))}
        </div>

        {/* Synopsis */}
        <p className="text-sm text-zinc-300/90 line-clamp-3 mb-6 max-w-xl font-normal leading-relaxed drop-shadow">
          {current.overview}
        </p>

        {/* CTAs */}
        <div className="flex items-center space-x-3 flex-wrap gap-y-2">
          {/* Main Play CTA */}
          <button
            onClick={() => onPlay(current)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-sm flex items-center space-x-2 shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 active:scale-95 transition-all"
          >
            <Play className="w-4 h-4 fill-black" />
            <span>Stream in 4K</span>
          </button>

          {/* Details CTA */}
          <button
            onClick={() => onOpenDetails(current)}
            className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm flex items-center space-x-2 backdrop-blur-md border border-white/10 transition-all hover:scale-105 active:scale-95"
          >
            <Info className="w-4 h-4 text-zinc-300" />
            <span>Inspector & Cast</span>
          </button>

          {/* Watchlist Toggle */}
          <button
            onClick={() => onToggleWatchlist(current)}
            className={`p-3 rounded-xl border backdrop-blur-md transition-all hover:scale-105 active:scale-95 ${
              inWatchlist
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                : 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white'
            }`}
            title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
          >
            {inWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Right Controls: Audio Ambient Preview & Slider Dots */}
      <div className="absolute right-6 bottom-6 z-20 flex items-center space-x-4">
        {/* Audio Ambient Mute Toggle */}
        <button
          onClick={() => setIsAudioMuted(!isAudioMuted)}
          className="p-2.5 rounded-full bg-black/50 hover:bg-black/70 border border-white/10 text-zinc-300 hover:text-white backdrop-blur-md transition-all"
          title={isAudioMuted ? 'Unmute Sound' : 'Mute Sound'}
        >
          {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
        </button>

        {/* Carousel Slide Indicators */}
        <div className="flex items-center space-x-1.5 bg-black/40 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all ${
                currentIndex === idx ? 'w-6 bg-cyan-400' : 'w-1.5 bg-white/30 hover:bg-white/60'
              }`}
              title={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Next / Prev Controls */}
        <div className="hidden sm:flex items-center space-x-1">
          <button
            onClick={() => setCurrentIndex((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1))}
            className="p-2 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 text-zinc-400 hover:text-white backdrop-blur-md transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % heroSlides.length)}
            className="p-2 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 text-zinc-400 hover:text-white backdrop-blur-md transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
