import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MediaItem } from '../types/media';
import { MediaCard } from './MediaCard';

interface MediaRowProps {
  title: string;
  items: MediaItem[];
  icon?: React.ReactNode;
  subtitle?: string;
  isTop10?: boolean;
  onPlay: (item: MediaItem) => void;
  onOpenDetails: (item: MediaItem) => void;
  onToggleWatchlist: (item: MediaItem) => void;
  isInWatchlist: (id: number) => boolean;
}

export const MediaRow: React.FC<MediaRowProps> = ({
  title,
  items,
  icon,
  subtitle,
  isTop10 = false,
  onPlay,
  onOpenDetails,
  onToggleWatchlist,
  isInWatchlist
}) => {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const scrollAmount = rowRef.current.clientWidth * 0.8;
      rowRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <section className="mb-9 relative group/row select-none">
      {/* Row Header */}
      <div className="flex items-end justify-between px-1 mb-3">
        <div className="flex items-center space-x-2">
          {icon && <span className="text-cyan-400">{icon}</span>}
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center space-x-2">
              <span>{title}</span>
            </h3>
            {subtitle && <p className="text-xs text-zinc-500">{subtitle}</p>}
          </div>
        </div>

        {/* Scroll Arrows */}
        <div className="flex items-center space-x-1.5 opacity-0 group-hover/row:opacity-100 transition-opacity">
          <button
            onClick={() => scroll('left')}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            aria-label="Previous"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            aria-label="Next"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Row Horizontal Scroller */}
      <div
        ref={rowRef}
        className="flex items-center space-x-4 overflow-x-auto no-scrollbar scroll-smooth py-2 px-1"
      >
        {items.map((item, index) => (
          <MediaCard
            key={`${item.id}-${index}`}
            item={item}
            rank={isTop10 ? index + 1 : undefined}
            onPlay={onPlay}
            onOpenDetails={onOpenDetails}
            onToggleWatchlist={onToggleWatchlist}
            isInWatchlist={isInWatchlist(item.id)}
          />
        ))}
      </div>
    </section>
  );
};
