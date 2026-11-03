import express, { Request, Response } from 'express';
import http from 'http';
import https from 'https';
import { HOME_FALLBACK } from './homeFallback';

const app = express();

app.use(express.json());

// Enable CORS for all API requests
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-user, Range');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

const MOVIEBOX_HEADERS: Record<string, string> = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  'Origin': 'https://movieboxph.org',
  'Referer': 'https://movieboxph.org/',
  'x-client-info': '{"timezone":"Asia/Calcutta"}',
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'en-US,en;q=0.9',
  'Connection': 'close'
};

const STATIC_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEzNzc5NDUxNDIxODgwNDAwNDgsImF0cCI6MywiZXh0IjoiMTc4OTkwNTk2NyIsImV4cCI6MTc5NzY4MTk2NywiaWF0IjoxNzg5OTA1NjY3fQ.nu-oeO3EcNKS1WUqxDeH2MKM7-v9-l1EPTvSmlQNiio';

// In-memory 5-minute cache for Home Feed
let homeFeedCache: any = null;
let homeFeedCacheTime = 0;
const CACHE_TTL_MS = 5 * 60 * 1000;

const apiRouter = express.Router();

// Helper to fetch with timeout and mirror fallback
async function fetchWithFallback(urls: string[], init?: RequestInit): Promise<any> {
  for (const url of urls) {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 7000);
      const res = await fetch(url, {
        ...init,
        headers: {
          ...MOVIEBOX_HEADERS,
          ...(init?.headers || {})
        },
        signal: controller.signal
      });
      clearTimeout(id);
      if (res.ok) {
        const json = await res.json();
        if (json && (json.code === 0 || json.data)) {
          return json;
        }
      }
    } catch (e: any) {
      console.warn(`Fetch error for ${url}:`, e?.message);
    }
  }
  return null;
}

// 1. Home Feed (Hero Banners + Categorized Rows)
apiRouter.get('/home', async (_req: Request, res: Response) => {
  const now = Date.now();
  if (homeFeedCache && (now - homeFeedCacheTime < CACHE_TTL_MS)) {
    return res.json(homeFeedCache);
  }

  const result = await fetchWithFallback([
    'https://h5-api.aoneroom.com/wefeed-h5api-bff/home',
    'https://movieboxph.org/wefeed-h5api-bff/home'
  ]);

  if (result && result.data?.operatingList?.length) {
    homeFeedCache = result;
    homeFeedCacheTime = now;
    return res.json(result);
  }

  // Graceful fallback to verified authentic MovieBox production seed
  res.json(HOME_FALLBACK);
});

// 2. Movie & Series Detail
apiRouter.get('/detail', async (req: Request, res: Response) => {
  try {
    const { subjectId, detailPath } = req.query;
    if (!subjectId) return res.status(400).json({ error: 'Missing subjectId' });
    
    const sid = encodeURIComponent(String(subjectId));
    const spath = encodeURIComponent(String(detailPath || ''));
    
    const result = await fetchWithFallback([
      `https://h5-api.aoneroom.com/wefeed-h5api-bff/detail?subjectId=${sid}&detailPath=${spath}`,
      `https://movieboxph.org/wefeed-h5api-bff/detail?subjectId=${sid}&detailPath=${spath}`
    ]);

    if (result) {
      return res.json(result);
    }

    res.status(502).json({ code: 502, message: 'Detail upstream unavailable' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Search Suggestions (Autocomplete)
apiRouter.post('/search-suggest', async (req: Request, res: Response) => {
  try {
    const { keyword } = req.body;
    const bodyStr = JSON.stringify({ keyword: keyword || '' });
    
    const result = await fetchWithFallback([
      'https://h5-api.aoneroom.com/wefeed-h5api-bff/subject/search-suggest',
      'https://movieboxph.org/wefeed-h5api-bff/subject/search-suggest'
    ], {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: bodyStr
    });

    if (result) return res.json(result);
    res.json({ code: 0, data: { items: [] } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Search Movies & TV Series
apiRouter.post('/search', async (req: Request, res: Response) => {
  try {
    const { keyword, page = 1, perPage = 20 } = req.body;
    const bodyStr = JSON.stringify({ keyword: keyword || '', page, perPage });

    const result = await fetchWithFallback([
      'https://h5-api.aoneroom.com/wefeed-h5api-bff/subject/search',
      'https://movieboxph.org/wefeed-h5api-bff/subject/search'
    ], {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STATIC_TOKEN}`,
        'x-user': STATIC_TOKEN
      },
      body: bodyStr
    });

    if (result) return res.json(result);
    res.json({ code: 0, data: { items: [], pager: { hasMore: false } } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Video Playback Streams (with dual fallback rule)
const handlePlay = async (req: Request, res: Response) => {
  try {
    const { subjectId, se = '0', ep = '0', detailPath = '' } = req.query;
    if (!subjectId) return res.status(400).json({ error: 'Missing subjectId' });

    const fetchPlay = async (s: string, e: string) => {
      const sid = encodeURIComponent(String(subjectId));
      const spath = encodeURIComponent(String(detailPath));
      const urls = [
        `https://movieboxph.org/wefeed-h5api-bff/subject/play?subjectId=${sid}&se=${s}&ep=${e}&detailPath=${spath}`,
        `https://h5-api.aoneroom.com/wefeed-h5api-bff/subject/play?subjectId=${sid}&se=${s}&ep=${e}&detailPath=${spath}`
      ];
      return fetchWithFallback(urls, {
        headers: {
          'Authorization': `Bearer ${STATIC_TOKEN}`,
          'x-user': STATIC_TOKEN
        }
      });
    };

    let playData = await fetchPlay(String(se), String(ep));
    const streams = playData?.data?.streams || [];
    const hls = playData?.data?.hls || [];

    if (streams.length === 0 && hls.length === 0) {
      if (String(se) === '0' && String(ep) === '0') {
        const fallback = await fetchPlay('1', '1');
        if ((fallback?.data?.streams || []).length > 0 || (fallback?.data?.hls || []).length > 0) {
          playData = fallback;
        }
      } else {
        const fallback = await fetchPlay('0', '0');
        if ((fallback?.data?.streams || []).length > 0 || (fallback?.data?.hls || []).length > 0) {
          playData = fallback;
        }
      }
    }

    res.json(playData || { code: 0, data: { hasResource: false, streams: [] } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

apiRouter.get('/moviebox/play', handlePlay);
apiRouter.get('/play', handlePlay);

// 6. Stream Video Proxy (Handles Byte-Range for instant seeking & custom Referer)
const handleStream = (req: Request, res: Response) => {
  const videoUrl = (req.query.url as string) || '';
  if (!videoUrl) return res.status(400).send('Missing video URL');

  try {
    const isMovieBoxCdn = videoUrl.includes('moviebox') || 
                          videoUrl.includes('aoneroom') || 
                          videoUrl.includes('hakunaymatata') || 
                          videoUrl.includes('pbcdn') || 
                          videoUrl.includes('macdn');

    const streamHeaders: Record<string, string> = {
      ...(isMovieBoxCdn ? MOVIEBOX_HEADERS : { 'User-Agent': MOVIEBOX_HEADERS['User-Agent'] }),
      ...(req.headers.range ? { 'Range': String(req.headers.range) } : {})
    };

    const client = videoUrl.startsWith('https:') ? https : http;
    client.get(videoUrl, { headers: streamHeaders }, (upstream) => {
      res.writeHead(upstream.statusCode || 200, upstream.headers);
      upstream.pipe(res);
    }).on('error', (err) => {
      if (!res.headersSent) {
        res.status(502).send(err.message);
      }
    });
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

apiRouter.get('/moviebox/stream', handleStream);
apiRouter.get('/stream', handleStream);

// Mount API routes under both /api and root /
app.use('/api', apiRouter);
app.use('/', apiRouter);

export default app;
