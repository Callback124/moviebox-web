import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Film, Tv, Sparkles, Clock, Trash2, Star, Play } from 'lucide-react';
import { MediaItem } from '../types/media';
import { searchTitles } from '../services/tmdbApi';
import { MediaCard } from './MediaCard';

interface SearchOverlayProps {
  onClose: () => void;
  onPlay: (item: MediaItem) => void;
  onOpenDetails: (item: MediaItem) => void;
  onToggleWatchlist: (item: MediaItem) => void;
  isInWatchlist: (id: number) => boolean;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({
  onClose,
  onPlay,
  onOpenDetails,
  onToggleWatchlist,
  isInWatchlist
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('cinescope_recent_searches_v1');
      return raw ? JSON.parse(raw) : ['Dune', 'Stranger Things', 'Demon Slayer', 'Oppenheimer', 'Jawan'];
    } catch {
      return ['Dune', 'Stranger Things', 'Demon Slayer'];
    }
  });

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const genres = ['All', 'Action', 'Science Fiction', 'Drama', 'Animation', 'Thriller', 'Fantasy'];

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await searchTitles(query.trim());
        setResults(res);
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectRecent = (term: string) => {
    setQuery(term);
  };

  const handleSaveSearchTerm = (term: string) => {
    const updated = [term, ...recentSearches.filter((s) => s.toLowerCase() !== term.toLowerCase())].slice(0, 8);
    setRecentSearches(updated);
    try {
      localStorage.setItem('cinescope_recent_searches_v1', JSON.stringify(updated));
    } catch {}
  };

  const handleClearRecents = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem('cinescope_recent_searches_v1');
    } catch {}
  };

  const filteredResults = results.filter((item) => {
    if (selectedGenre === 'All') return true;
    return item.genres.some((g) => g.toLowerCase().includes(selectedGenre.toLowerCase()));
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex flex-col p-4 md:p-8 select-none">
      {/* Search Header Bar */}
      <div className="max-w-4xl w-full mx-auto space-y-4">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative flex items-center">
            <Search className="w-5 h-5 text-cyan-400 absolute left-4 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && query.trim()) {
                  handleSaveSearchTerm(query.trim());
                } else if (e.key === 'Escape') {
                  onClose();
                }
              }}
              placeholder="Search across movies, TV series, anime, actors, genres..."
              className="w-full bg-[#141724] border border-white/10 hover:border-cyan-500/40 focus:border-cyan-400 rounded-2xl pl-12 pr-12 py-3.5 text-sm sm:text-base text-white placeholder-zinc-500 outline-none shadow-2xl transition-all"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 p-1 rounded-full text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
            title="Close Search (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Genre Quick Filter Chips */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
          {genres.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedGenre === g
                  ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-5xl w-full mx-auto flex-1 overflow-y-auto no-scrollbar mt-6">
        {/* Recent Searches */}
        {!query && recentSearches.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-zinc-500 font-bold uppercase tracking-wider">
              <span className="flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Recent Searches</span>
              </span>
              <button
                onClick={handleClearRecents}
                className="hover:text-red-400 flex items-center space-x-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => handleSelectRecent(term)}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-cyan-300 text-xs flex items-center space-x-1.5 border border-white/5"
                >
                  <span>{term}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="py-16 flex flex-col items-center justify-center space-y-3 text-cyan-400">
            <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
            <span className="text-xs text-zinc-400">Searching global streaming index...</span>
          </div>
        )}

        {/* Search Results Grid */}
        {!isLoading && query && filteredResults.length > 0 && (
          <div className="space-y-4">
            <div className="text-xs text-zinc-400">
              Found <strong className="text-white">{filteredResults.length}</strong> titles for "{query}"
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredResults.map((item) => (
                <MediaCard
                  key={item.id}
                  item={item}
                  onPlay={onPlay}
                  onOpenDetails={onOpenDetails}
                  onToggleWatchlist={onToggleWatchlist}
                  isInWatchlist={isInWatchlist(item.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {!isLoading && query && filteredResults.length === 0 && (
          <div className="py-20 text-center text-zinc-500 space-y-2">
            <Film className="w-12 h-12 mx-auto text-zinc-700" />
            <h4 className="text-base font-bold text-zinc-300">No titles found for "{query}"</h4>
            <p className="text-xs text-zinc-500">
              Try searching for "Dune", "Interstellar", "Stranger Things", "Demon Slayer", or "Jawan".
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
