import { MediaItem } from '../types/media';

// High-fidelity curated catalog with working HD/4K streams, trailers, episodes, cast, and providers
export const CURATED_MEDIA: MediaItem[] = [
  {
    id: 101,
    title: 'Dune: Part Two',
    type: 'movie',
    overview: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, he endeavors to prevent a terrible future only he can foresee.',
    backdrop_path: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1920&auto=format&fit=crop',
    poster_path: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
    vote_average: 8.7,
    release_date: '2024-03-01',
    genres: ['Science Fiction', 'Adventure', 'Action', 'Drama'],
    tagline: 'Long live the fighters.',
    runtime: 166,
    director: 'Denis Villeneuve',
    origin_country: ['US'],
    languages: ['English', 'Chakobsa'],
    trailer_key: 'Way9Dexny3w',
    stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    backup_stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    is_4k: true,
    is_hdr: true,
    quality_badge: '4K IMAX Enhanced',
    category: 'trending',
    cast: [
      { id: 1, name: 'Timothée Chalamet', character: 'Paul Atreides', profile_path: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop' },
      { id: 2, name: 'Zendaya', character: 'Chani', profile_path: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop' },
      { id: 3, name: 'Rebecca Ferguson', character: 'Lady Jessica', profile_path: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop' },
      { id: 4, name: 'Austin Butler', character: 'Feyd-Rautha Harkonnen', profile_path: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop' },
      { id: 5, name: 'Florence Pugh', character: 'Princess Irulan', profile_path: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop' }
    ],
    providers: [
      { name: 'Max', logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=80&auto=format&fit=crop', type: 'stream' },
      { name: 'Prime Video', logo: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=80&auto=format&fit=crop', type: 'rent' },
      { name: 'Apple TV', logo: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?q=80&w=80&auto=format&fit=crop', type: 'buy' }
    ]
  },
  {
    id: 102,
    title: 'Interstellar: Remastered',
    type: 'movie',
    overview: 'The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.',
    backdrop_path: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1920&auto=format&fit=crop',
    poster_path: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=800&auto=format&fit=crop',
    vote_average: 8.9,
    release_date: '2014-11-07',
    genres: ['Adventure', 'Drama', 'Science Fiction'],
    tagline: 'Mankind was born on Earth. It was never meant to die here.',
    runtime: 169,
    director: 'Christopher Nolan',
    origin_country: ['US', 'GB'],
    languages: ['English'],
    trailer_key: 'zSWdZVtXT7E',
    stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    backup_stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    is_4k: true,
    is_hdr: true,
    quality_badge: '4K Dolby Vision',
    category: 'movie',
    cast: [
      { id: 11, name: 'Matthew McConaughey', character: 'Joseph Cooper', profile_path: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=200&auto=format&fit=crop' },
      { id: 12, name: 'Anne Hathaway', character: 'Dr. Amelia Brand', profile_path: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop' },
      { id: 13, name: 'Jessica Chastain', character: 'Murphy Cooper', profile_path: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop' }
    ],
    providers: [
      { name: 'Paramount+', logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=80&auto=format&fit=crop', type: 'stream' },
      { name: 'Prime Video', logo: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=80&auto=format&fit=crop', type: 'stream' }
    ]
  },
  {
    id: 103,
    title: 'Stranger Things',
    type: 'tv',
    overview: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl with telekinetic powers.',
    backdrop_path: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1920&auto=format&fit=crop',
    poster_path: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    vote_average: 8.8,
    first_air_date: '2016-07-15',
    genres: ['Sci-Fi & Fantasy', 'Drama', 'Mystery'],
    tagline: 'Every ending has a beginning.',
    runtime: 55,
    seasons_count: 4,
    episodes_count: 34,
    director: 'The Duffer Brothers',
    origin_country: ['US'],
    languages: ['English', 'Russian'],
    trailer_key: 'b9EkMc79ZSU',
    stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    is_4k: true,
    is_hdr: true,
    quality_badge: '4K Atmos',
    category: 'tv',
    seasons: [
      {
        season_number: 1,
        name: 'Season 1',
        episode_count: 8,
        episodes: [
          { id: 1001, season_number: 1, episode_number: 1, name: 'Chapter One: The Vanishing of Will Byers', overview: 'On his way home from a friend’s house, young Will sees something terrifying. Nearby, a sinister secret lurks in the depths of a government lab.', runtime: 48, vote_average: 8.6, still_path: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=400&auto=format&fit=crop' },
          { id: 1002, season_number: 1, episode_number: 2, name: 'Chapter Two: The Weirdo on Maple Street', overview: 'Lucas, Mike and Dustin try to talk to the girl they found in the woods. Hopper questions an anxious Joyce about a bizarre phone call.', runtime: 55, vote_average: 8.7, still_path: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format&fit=crop' },
          { id: 1003, season_number: 1, episode_number: 3, name: 'Chapter Three: Holly, Jolly', overview: 'An increasingly frantic Joyce seeks to contact Will through festive lights. Nancy looks into Barbara’s disappearance.', runtime: 51, vote_average: 8.9, still_path: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400&auto=format&fit=crop' },
          { id: 1004, season_number: 1, episode_number: 4, name: 'Chapter Four: The Body', overview: 'Refusing to believe Will is dead, Joyce investigates further while the boys give Eleven a makeover to blend in.', runtime: 50, vote_average: 9.1, still_path: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=400&auto=format&fit=crop' }
        ]
      },
      {
        season_number: 4,
        name: 'Season 4',
        episode_count: 9,
        episodes: [
          { id: 4001, season_number: 4, episode_number: 1, name: 'Chapter One: The Hellfire Club', overview: 'El struggles to fit in at school in California. Back in Hawkins, the high school D&D club welcomes new members.', runtime: 76, vote_average: 8.8, still_path: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=400&auto=format&fit=crop' },
          { id: 4004, season_number: 4, episode_number: 4, name: 'Chapter Four: Dear Billy', overview: 'Max is in grave danger as a secret past trauma threatens her life, prompting the group to search for musical salvation.', runtime: 78, vote_average: 9.6, still_path: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format&fit=crop' }
        ]
      }
    ],
    cast: [
      { id: 21, name: 'Millie Bobby Brown', character: 'Eleven', profile_path: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop' },
      { id: 22, name: 'David Harbour', character: 'Jim Hopper', profile_path: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop' },
      { id: 23, name: 'Winona Ryder', character: 'Joyce Byers', profile_path: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop' }
    ],
    providers: [{ name: 'Netflix', logo: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=80&auto=format&fit=crop', type: 'stream' }]
  },
  {
    id: 104,
    title: 'Demon Slayer: Hashira Training Arc',
    type: 'tv',
    overview: 'Tanjiro visits the Stone Hashira, Himejima, who intends to prepare him for the battles to come. The training to become a Hashira—a high-ranking member of the Demon Slayer Corps—is intense and demanding, and offering approval from Himejima seems impossible.',
    backdrop_path: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1920&auto=format&fit=crop',
    poster_path: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop',
    vote_average: 8.9,
    first_air_date: '2024-05-12',
    genres: ['Animation', 'Action & Adventure', 'Fantasy'],
    tagline: 'Sharpen your blade. The final battle begins.',
    runtime: 24,
    seasons_count: 4,
    episodes_count: 55,
    director: 'Haruo Sotozaki',
    origin_country: ['JP'],
    languages: ['Japanese', 'English'],
    trailer_key: 'atY3x5jZkZ0',
    stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    is_4k: true,
    is_hdr: true,
    quality_badge: '1080p Ultra',
    category: 'anime',
    seasons: [
      {
        season_number: 1,
        name: 'Hashira Training',
        episode_count: 8,
        episodes: [
          { id: 301, season_number: 1, episode_number: 1, name: 'To Defeat Muzan Kibutsuji', overview: 'The Hashira gather at the Ubuyashiki estate to conduct an emergency meeting regarding the Demon Slayer mark.', runtime: 45, vote_average: 9.1, still_path: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=400&auto=format&fit=crop' },
          { id: 302, season_number: 1, episode_number: 2, name: 'The Water Hashira Giyu Tomioka’s Pain', overview: 'Tanjiro undergoes special guidance from Giyu, uncovering the unspoken burden carried by the Water Hashira.', runtime: 24, vote_average: 8.9, still_path: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=400&auto=format&fit=crop' }
        ]
      }
    ],
    cast: [
      { id: 31, name: 'Natsuki Hanae', character: 'Tanjiro Kamado', profile_path: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop' },
      { id: 32, name: 'Akari Kito', character: 'Nezuko Kamado', profile_path: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop' }
    ],
    providers: [
      { name: 'Crunchyroll', logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=80&auto=format&fit=crop', type: 'stream' },
      { name: 'Netflix', logo: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=80&auto=format&fit=crop', type: 'stream' }
    ]
  },
  {
    id: 105,
    title: 'Jawan: Extended Cut',
    type: 'movie',
    overview: 'A high-octane action thriller which outlines the emotional journey of a man who is set to rectify the wrongs in the society. Driven by a personal vendetta while keeping a promise made years ago, he faces a monstrous outlaw who knows no mercy.',
    backdrop_path: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1920&auto=format&fit=crop',
    poster_path: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
    vote_average: 8.4,
    release_date: '2023-09-07',
    genres: ['Action', 'Thriller', 'Drama'],
    tagline: 'Ready Chief?',
    runtime: 171,
    director: 'Atlee',
    origin_country: ['IN'],
    languages: ['Hindi', 'Tamil', 'Telugu'],
    trailer_key: 'COv52Qyctws',
    stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    is_4k: true,
    is_hdr: true,
    quality_badge: '4K Dolby Atmos',
    category: 'hindi',
    cast: [
      { id: 41, name: 'Shah Rukh Khan', character: 'Vikram Rathore / Azad', profile_path: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop' },
      { id: 42, name: 'Nayanthara', character: 'Narmada Rai', profile_path: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop' },
      { id: 43, name: 'Vijay Sethupathi', character: 'Kalee Gaikwad', profile_path: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop' },
      { id: 44, name: 'Deepika Padukone', character: 'Aishwarya Rathore', profile_path: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop' }
    ],
    providers: [
      { name: 'Netflix', logo: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=80&auto=format&fit=crop', type: 'stream' },
      { name: 'Zee5', logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=80&auto=format&fit=crop', type: 'stream' }
    ]
  },
  {
    id: 106,
    title: 'Oppenheimer',
    type: 'movie',
    overview: 'The story of J. Robert Oppenheimer’s role in the development of the atomic bomb during World War II, probing deep into moral dilemmas, political intrigue, and the shattering consequences of unlocking scientific power.',
    backdrop_path: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1920&auto=format&fit=crop',
    poster_path: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    vote_average: 8.8,
    release_date: '2023-07-21',
    genres: ['Drama', 'History', 'Biography'],
    tagline: 'The world forever changes.',
    runtime: 180,
    director: 'Christopher Nolan',
    origin_country: ['US'],
    languages: ['English', 'German'],
    trailer_key: 'uYPbbksJxIg',
    stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    is_4k: true,
    is_hdr: true,
    quality_badge: '4K Ultra HD',
    category: 'movie',
    cast: [
      { id: 51, name: 'Cillian Murphy', character: 'J. Robert Oppenheimer', profile_path: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop' },
      { id: 52, name: 'Emily Blunt', character: 'Katherine Oppenheimer', profile_path: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop' },
      { id: 53, name: 'Robert Downey Jr.', character: 'Lewis Strauss', profile_path: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop' }
    ],
    providers: [
      { name: 'Prime Video', logo: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=80&auto=format&fit=crop', type: 'stream' },
      { name: 'JioCinema', logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=80&auto=format&fit=crop', type: 'stream' }
    ]
  },
  {
    id: 107,
    title: 'The Last of Us',
    type: 'tv',
    overview: 'Twenty years after modern civilization has been destroyed, Joel, a hardened survivor, is hired to smuggle Ellie, a 14-year-old girl, out of an oppressive quarantine zone. What starts as a small job soon becomes a brutal, heartbreaking journey.',
    backdrop_path: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1920&auto=format&fit=crop',
    poster_path: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
    vote_average: 8.8,
    first_air_date: '2023-01-15',
    genres: ['Drama', 'Sci-Fi & Fantasy', 'Action'],
    tagline: 'When you’re lost in the darkness, look for the light.',
    runtime: 58,
    seasons_count: 1,
    episodes_count: 9,
    director: 'Craig Mazin & Neil Druckmann',
    origin_country: ['US'],
    languages: ['English'],
    trailer_key: 'uLtkt8BonwM',
    stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    is_4k: true,
    is_hdr: true,
    quality_badge: '4K Dolby Atmos',
    category: 'tv',
    cast: [
      { id: 61, name: 'Pedro Pascal', character: 'Joel Miller', profile_path: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop' },
      { id: 62, name: 'Bella Ramsey', character: 'Ellie Williams', profile_path: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop' }
    ],
    providers: [
      { name: 'Max', logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=80&auto=format&fit=crop', type: 'stream' },
      { name: 'JioCinema', logo: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=80&auto=format&fit=crop', type: 'stream' }
    ]
  },
  {
    id: 108,
    title: 'Attack on Titan: The Final Chapters',
    type: 'tv',
    overview: 'After his hometown is destroyed and his mother is killed, young Eren Jaeger vows to cleanse the earth of the giant humanoid Titans that have brought humanity to the brink of extinction.',
    backdrop_path: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1920&auto=format&fit=crop',
    poster_path: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop',
    vote_average: 9.1,
    first_air_date: '2013-04-07',
    genres: ['Animation', 'Action & Adventure', 'Sci-Fi & Fantasy'],
    tagline: 'Dedicate your heart.',
    runtime: 24,
    seasons_count: 4,
    episodes_count: 89,
    director: 'Tetsuro Araki & Yuichiro Hayashi',
    origin_country: ['JP'],
    languages: ['Japanese', 'English'],
    trailer_key: 'E7WytQM244o',
    stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    is_4k: true,
    is_hdr: false,
    quality_badge: '1080p Master Audio',
    category: 'anime',
    cast: [
      { id: 71, name: 'Yuki Kaji', character: 'Eren Jaeger', profile_path: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop' },
      { id: 72, name: 'Yui Ishikawa', character: 'Mikasa Ackerman', profile_path: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop' }
    ],
    providers: [
      { name: 'Crunchyroll', logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=80&auto=format&fit=crop', type: 'stream' },
      { name: 'Netflix', logo: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=80&auto=format&fit=crop', type: 'stream' }
    ]
  },
  {
    id: 109,
    title: '12th Fail',
    type: 'movie',
    overview: 'Based on the true story of IPS officer Manoj Kumar Sharma, 12th Fail tells the resilient journey of a boy from Chambal who restarts his academic journey despite extreme poverty and clears one of the toughest civil service exams in the world.',
    backdrop_path: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1920&auto=format&fit=crop',
    poster_path: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=800&auto=format&fit=crop',
    vote_average: 9.0,
    release_date: '2023-10-27',
    genres: ['Drama', 'Biography'],
    tagline: 'Restart.',
    runtime: 147,
    director: 'Vidhu Vinod Chopra',
    origin_country: ['IN'],
    languages: ['Hindi'],
    trailer_key: 'we3H1_Vq_Fw',
    stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    is_4k: true,
    is_hdr: true,
    quality_badge: '4K Masterpiece',
    category: 'hindi',
    cast: [
      { id: 81, name: 'Vikrant Massey', character: 'Manoj Kumar Sharma', profile_path: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop' },
      { id: 82, name: 'Medha Shankr', character: 'Shraddha Joshi', profile_path: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop' }
    ],
    providers: [
      { name: 'Disney+ Hotstar', logo: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=80&auto=format&fit=crop', type: 'stream' }
    ]
  },
  {
    id: 110,
    title: 'Cyberpunk: Edgerunners',
    type: 'tv',
    overview: 'A street kid trying to survive in a technology and body modification-obsessed city of the future. Having everything to lose, he chooses to stay alive by becoming an edgerunner: a mercenary outlaw also known as a cyberpunk.',
    backdrop_path: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1920&auto=format&fit=crop',
    poster_path: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop',
    vote_average: 8.6,
    first_air_date: '2022-09-13',
    genres: ['Animation', 'Sci-Fi & Fantasy', 'Action'],
    tagline: 'Night City will consume you.',
    runtime: 25,
    seasons_count: 1,
    episodes_count: 10,
    director: 'Hiroyuki Imaishi',
    origin_country: ['JP', 'PL'],
    languages: ['Japanese', 'English'],
    trailer_key: 'JtqIas3bYhg',
    stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    is_4k: true,
    is_hdr: true,
    quality_badge: '1080p Neo-Tokyo',
    category: 'anime',
    cast: [
      { id: 91, name: 'KENN', character: 'David Martinez', profile_path: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop' },
      { id: 92, name: 'Aoi Yuuki', character: 'Lucy', profile_path: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop' }
    ],
    providers: [
      { name: 'Netflix', logo: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=80&auto=format&fit=crop', type: 'stream' }
    ]
  },
  {
    id: 111,
    title: 'The Dark Knight',
    type: 'movie',
    overview: 'Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets.',
    backdrop_path: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1920&auto=format&fit=crop',
    poster_path: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    vote_average: 9.0,
    release_date: '2008-07-18',
    genres: ['Drama', 'Action', 'Crime', 'Thriller'],
    tagline: 'Why so serious?',
    runtime: 152,
    director: 'Christopher Nolan',
    origin_country: ['US', 'GB'],
    languages: ['English', 'Mandarin'],
    trailer_key: 'EXeTwQWrcwY',
    stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    is_4k: true,
    is_hdr: true,
    quality_badge: '4K Ultra HD',
    category: 'movie',
    cast: [
      { id: 101, name: 'Christian Bale', character: 'Bruce Wayne / Batman', profile_path: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop' },
      { id: 102, name: 'Heath Ledger', character: 'Joker', profile_path: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop' }
    ],
    providers: [
      { name: 'Max', logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=80&auto=format&fit=crop', type: 'stream' },
      { name: 'Prime Video', logo: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=80&auto=format&fit=crop', type: 'stream' }
    ]
  },
  {
    id: 112,
    title: 'Kalki 2898 AD',
    type: 'movie',
    overview: 'A modern avatar of the Hindu god Vishnu is said to have descended on Earth to protect the world from evil forces in a dystopian world set in the year 2898 AD, starting from the post-Mahabharata era to a futuristic city called Kasi.',
    backdrop_path: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1920&auto=format&fit=crop',
    poster_path: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=800&auto=format&fit=crop',
    vote_average: 8.3,
    release_date: '2024-06-27',
    genres: ['Science Fiction', 'Action', 'Fantasy'],
    tagline: 'The future begins in the past.',
    runtime: 181,
    director: 'Nag Ashwin',
    origin_country: ['IN'],
    languages: ['Hindi', 'Telugu', 'Tamil'],
    trailer_key: 'kQDd1AhGIHk',
    stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    is_4k: true,
    is_hdr: true,
    quality_badge: '4K Dolby Atmos',
    category: 'hindi',
    cast: [
      { id: 111, name: 'Prabhas', character: 'Bhairava', profile_path: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop' },
      { id: 112, name: 'Amitabh Bachchan', character: 'Ashwatthama', profile_path: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop' },
      { id: 113, name: 'Deepika Padukone', character: 'SUM-80', profile_path: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop' },
      { id: 114, name: 'Kamal Haasan', character: 'Supreme Yaskin', profile_path: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=200&auto=format&fit=crop' }
    ],
    providers: [
      { name: 'Netflix', logo: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=80&auto=format&fit=crop', type: 'stream' },
      { name: 'Prime Video', logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=80&auto=format&fit=crop', type: 'stream' }
    ]
  }
];

export const INITIAL_DOWNLOADS = [
  {
    id: 'dl-1',
    mediaId: 101,
    title: 'Dune: Part Two (2024)',
    type: 'movie' as const,
    poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
    quality: '4K HDR' as const,
    fileSize: '4.8 GB',
    progress: 100,
    status: 'completed' as const,
    speed: '0 KB/s',
    stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    downloadedAt: 'Today at 02:14 AM'
  },
  {
    id: 'dl-2',
    mediaId: 104,
    title: 'Demon Slayer - Ep 1: Hashira Training',
    type: 'tv' as const,
    poster: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop',
    quality: '1080p FHD' as const,
    fileSize: '1.2 GB',
    progress: 74,
    status: 'downloading' as const,
    speed: '28.4 MB/s',
    stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    downloadedAt: 'In Progress'
  }
];
