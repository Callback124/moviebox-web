import { MediaItem, Episode, Season } from '../types/media';
import { CURATED_MEDIA } from '../data/curatedMedia';

const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/';

// Local storage key for user preferences
export const PREFS_STORAGE_KEY = 'cinescope_user_prefs_v1';
export const WATCHLIST_STORAGE_KEY = 'cinescope_watchlist_v1';
export const HISTORY_STORAGE_KEY = 'cinescope_history_v1';
export const DOWNLOADS_STORAGE_KEY = 'cinescope_downloads_v1';

export function getStoredKey(): string {
  try {
    const raw = localStorage.getItem(PREFS_STORAGE_KEY);
    if (!raw) return '';
    const parsed = JSON.parse(raw);
    return parsed.tmdbApiKey || '';
  } catch {
    return '';
  }
}

export function formatImageUrl(path: string | undefined, size: 'w342' | 'w500' | 'w780' | 'w1280' | 'original' = 'w500'): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${TMDB_IMAGE_BASE}${size}${path}`;
}

export async function fetchFromTmdb(endpoint: string, params: Record<string, string | number> = {}): Promise<any> {
  const apiKey = getStoredKey().trim();
  if (!apiKey) {
    throw new Error('NO_API_KEY');
  }

  const url = new URL(`${TMDB_BASE}${endpoint}`);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '') {
      url.searchParams.set(k, String(v));
    }
  });

  const headers: Record<string, string> = {
    'Accept': 'application/json'
  };

  if (apiKey.length > 40) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  } else {
    url.searchParams.set('api_key', apiKey);
  }

  const res = await fetch(url.toString(), { headers });
  if (res.status === 401) {
    throw new Error('INVALID_API_KEY');
  }
  if (!res.ok) {
    throw new Error(`TMDB error: ${res.statusText}`);
  }
  return res.json();
}

// Convert TMDB payload to standard MediaItem
export function tmdbToMediaItem(item: any, explicitType?: 'movie' | 'tv'): MediaItem {
  const type = explicitType || (item.media_type === 'tv' || item.name ? 'tv' : 'movie');
  const title = item.title || item.name || 'Untitled';
  const releaseDate = item.release_date || item.first_air_date || '';

  return {
    id: item.id,
    title,
    type,
    overview: item.overview || 'No synopsis available for this title.',
    backdrop_path: formatImageUrl(item.backdrop_path, 'original') || item.backdrop_path || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1920&auto=format&fit=crop',
    poster_path: formatImageUrl(item.poster_path, 'w500') || item.poster_path || 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
    vote_average: Number(item.vote_average ? item.vote_average.toFixed(1) : (7.5 + Math.random() * 1.5).toFixed(1)),
    release_date: item.release_date || (type === 'movie' ? releaseDate : undefined),
    first_air_date: item.first_air_date || (type === 'tv' ? releaseDate : undefined),
    genres: (item.genres && Array.isArray(item.genres))
      ? item.genres.map((g: any) => g.name)
      : (item.genre_ids ? ['Popular', 'Action'] : ['Drama']),
    tagline: item.tagline,
    runtime: item.runtime || (item.episode_run_time ? item.episode_run_time[0] : 120),
    seasons_count: item.number_of_seasons,
    episodes_count: item.number_of_episodes,
    director: item.credits?.crew?.find((c: any) => c.job === 'Director')?.name,
    cast: item.credits?.cast?.slice(0, 10).map((c: any) => ({
      id: c.id,
      name: c.name,
      character: c.character,
      profile_path: formatImageUrl(c.profile_path, 'w342')
    })),
    trailer_key: (item.videos?.results || []).find((v: any) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'))?.key,
    stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    backup_stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    is_4k: true,
    is_hdr: true,
    quality_badge: '4K Ultra HD',
    providers: [
      { name: 'Netflix', logo: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=80&auto=format&fit=crop', type: 'stream' },
      { name: 'Prime Video', logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=80&auto=format&fit=crop', type: 'stream' }
    ]
  };
}

// Full Title Loader (Live TMDB or Curated fallback)
export async function loadMediaDetails(id: number, type: 'movie' | 'tv'): Promise<MediaItem> {
  try {
    const raw = await fetchFromTmdb(`/${type}/${id}`, {
      append_to_response: 'videos,credits,recommendations,similar,watch/providers'
    });
    const parsed = tmdbToMediaItem(raw, type);

    // If TV show, fetch season 1 episodes
    if (type === 'tv' && raw.seasons?.length) {
      const activeSeason = raw.seasons.find((s: any) => s.season_number > 0) || raw.seasons[0];
      if (activeSeason) {
        try {
          const seasonData = await fetchFromTmdb(`/tv/${id}/season/${activeSeason.season_number}`);
          parsed.seasons = [
            {
              season_number: activeSeason.season_number,
              name: activeSeason.name,
              episode_count: activeSeason.episode_count,
              episodes: seasonData.episodes?.map((ep: any) => ({
                id: ep.id,
                season_number: ep.season_number,
                episode_number: ep.episode_number,
                name: ep.name,
                overview: ep.overview,
                still_path: formatImageUrl(ep.still_path, 'w500'),
                air_date: ep.air_date,
                runtime: ep.runtime,
                vote_average: ep.vote_average,
                stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
              }))
            }
          ];
        } catch {
          // ignore season fetch failure
        }
      }
    }
    return parsed;
  } catch {
    // Return matching curated item or synthesized item
    const found = CURATED_MEDIA.find((m) => m.id === id && m.type === type);
    if (found) return found;

    const anyFound = CURATED_MEDIA.find((m) => m.id === id);
    if (anyFound) return anyFound;

    return CURATED_MEDIA[0];
  }
}

// Media Catalog query helper
export async function getCategoryMedia(category: 'home' | 'movies' | 'tv' | 'anime' | 'hindi', filter?: string): Promise<MediaItem[]> {
  try {
    let endpoint = '/trending/all/day';
    let params: Record<string, string | number> = { page: 1 };

    if (category === 'movies') {
      endpoint = filter === 'top_rated' ? '/movie/top_rated' : '/movie/popular';
    } else if (category === 'tv') {
      endpoint = filter === 'top_rated' ? '/tv/top_rated' : '/tv/popular';
    } else if (category === 'anime') {
      endpoint = '/discover/tv';
      params = { with_genres: 16, with_original_language: 'ja', sort_by: 'popularity.desc' };
    } else if (category === 'hindi') {
      endpoint = '/discover/movie';
      params = { with_original_language: 'hi', sort_by: 'popularity.desc', 'vote_count.gte': 50 };
    }

    const data = await fetchFromTmdb(endpoint, params);
    if (data.results && data.results.length > 0) {
      return data.results.map((item: any) => tmdbToMediaItem(item));
    }
  } catch {
    // Fall back to curated library
  }

  // Filter local curated database
  if (category === 'movies') {
    return CURATED_MEDIA.filter((m) => m.type === 'movie');
  } else if (category === 'tv') {
    return CURATED_MEDIA.filter((m) => m.type === 'tv' && m.category !== 'anime');
  } else if (category === 'anime') {
    return CURATED_MEDIA.filter((m) => m.category === 'anime');
  } else if (category === 'hindi') {
    return CURATED_MEDIA.filter((m) => m.category === 'hindi');
  }

  return CURATED_MEDIA;
}

// Search
export async function searchTitles(query: string): Promise<MediaItem[]> {
  if (!query.trim()) return [];

  try {
    const data = await fetchFromTmdb('/search/multi', {
      query,
      include_adult: 'false',
      page: 1
    });
    if (data.results && data.results.length > 0) {
      return data.results
        .filter((i: any) => i.media_type !== 'person')
        .map((i: any) => tmdbToMediaItem(i));
    }
  } catch {
    // Fallback to local filtering
  }

  const q = query.toLowerCase();
  return CURATED_MEDIA.filter(
    (m) =>
      m.title.toLowerCase().includes(q) ||
      m.overview.toLowerCase().includes(q) ||
      m.genres.some((g) => g.toLowerCase().includes(q)) ||
      m.cast?.some((c) => c.name.toLowerCase().includes(q))
  );
}
