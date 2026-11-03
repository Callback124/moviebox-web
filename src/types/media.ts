export type MediaType = 'movie' | 'tv';

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path?: string;
}

export interface StreamProvider {
  name: string;
  logo: string;
  type: 'stream' | 'rent' | 'buy';
}

export interface Episode {
  id: number;
  season_number: number;
  episode_number: number;
  name: string;
  overview: string;
  still_path?: string;
  air_date?: string;
  runtime?: number;
  vote_average?: number;
  stream_url?: string;
}

export interface Season {
  season_number: number;
  name: string;
  episode_count: number;
  episodes?: Episode[];
}

export interface MediaItem {
  id: number;
  title: string;
  type: MediaType;
  overview: string;
  backdrop_path: string;
  poster_path: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  genres: string[];
  tagline?: string;
  runtime?: number; // minutes
  seasons_count?: number;
  episodes_count?: number;
  seasons?: Season[];
  cast?: CastMember[];
  director?: string;
  origin_country?: string[];
  languages?: string[];
  trailer_key?: string;
  stream_url?: string;
  backup_stream_url?: string;
  providers?: StreamProvider[];
  is_4k?: boolean;
  is_hdr?: boolean;
  quality_badge?: string; // '4K UHD', 'IMAX Enhanced', 'Dolby Vision'
  category?: 'trending' | 'movie' | 'tv' | 'anime' | 'hindi';
  user_progress?: number; // seconds watched
  total_duration?: number; // seconds
}

export interface DownloadItem {
  id: string;
  mediaId: number;
  title: string;
  type: MediaType;
  poster: string;
  quality: '4K HDR' | '1080p FHD' | '720p HD';
  fileSize: string; // e.g., '3.4 GB'
  progress: number; // 0 to 100
  status: 'downloading' | 'completed' | 'paused';
  speed: string; // e.g. '18.2 MB/s'
  stream_url: string;
  downloadedAt: string;
}

export interface UserPreferences {
  tmdbApiKey: string;
  region: string;
  language: string;
  preferredQuality: 'Auto' | '4K UHD' | '1080p' | '720p';
  audioMode: 'Stereo' | '5.1 Surround' | 'Dolby Atmos Emulation';
  hardwareAcceleration: boolean;
  accentColor: 'cyan' | 'crimson' | 'emerald' | 'amber';
  subtitleSize: 'small' | 'medium' | 'large';
  subtitleColor: 'yellow' | 'white';
}
