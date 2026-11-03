import express, { Request, Response } from 'express';
import http from 'http';
import https from 'https';

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
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36',
  'Origin': 'https://movieboxph.org',
  'Referer': 'https://movieboxph.org/',
  'x-client-info': '{"timezone":"Asia/Calcutta"}',
  'Accept': '*/*',
  'Accept-Language': 'en-US,en;q=0.9',
  'Connection': 'close'
};

const STATIC_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEzNzc5NDUxNDIxODgwNDAwNDgsImF0cCI6MywiZXh0IjoiMTc4OTkwNTk2NyIsImV4cCI6MTc5NzY4MTk2NywiaWF0IjoxNzg5OTA1NjY3fQ.nu-oeO3EcNKS1WUqxDeH2MKM7-v9-l1EPTvSmlQNiio';

const apiRouter = express.Router();

// 1. Home Feed (Hero Banners + Categorized Rows)
apiRouter.get('/home', async (_req: Request, res: Response) => {
  try {
    const response = await fetch('https://h5-api.aoneroom.com/wefeed-h5api-bff/home', {
      headers: MOVIEBOX_HEADERS
    });
    if (!response.ok) {
      return res.status(response.status).json({ code: response.status, message: response.statusText });
    }
    const data = await response.json();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Movie & Series Detail
apiRouter.get('/detail', async (req: Request, res: Response) => {
  try {
    const { subjectId, detailPath } = req.query;
    if (!subjectId) return res.status(400).json({ error: 'Missing subjectId' });
    
    const url = `https://h5-api.aoneroom.com/wefeed-h5api-bff/detail?subjectId=${encodeURIComponent(String(subjectId))}&detailPath=${encodeURIComponent(String(detailPath || ''))}`;
    const response = await fetch(url, { headers: MOVIEBOX_HEADERS });
    const data = await response.json();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Search Suggestions (Autocomplete)
apiRouter.post('/search-suggest', async (req: Request, res: Response) => {
  try {
    const { keyword } = req.body;
    const response = await fetch('https://h5-api.aoneroom.com/wefeed-h5api-bff/subject/search-suggest', {
      method: 'POST',
      headers: {
        ...MOVIEBOX_HEADERS,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ keyword: keyword || '' })
    });
    const data = await response.json();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Search Movies & TV Series
apiRouter.post('/search', async (req: Request, res: Response) => {
  try {
    const { keyword, page = 1, perPage = 20 } = req.body;
    const response = await fetch('https://h5-api.aoneroom.com/wefeed-h5api-bff/subject/search', {
      method: 'POST',
      headers: {
        ...MOVIEBOX_HEADERS,
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STATIC_TOKEN}`,
        'x-user': STATIC_TOKEN
      },
      body: JSON.stringify({ keyword: keyword || '', page, perPage })
    });
    const data = await response.json();
    res.json(data);
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
      const playUrl = `https://movieboxph.org/wefeed-h5api-bff/subject/play?subjectId=${encodeURIComponent(String(subjectId))}&se=${s}&ep=${e}&detailPath=${encodeURIComponent(String(detailPath))}`;
      const r = await fetch(playUrl, { 
        headers: {
          ...MOVIEBOX_HEADERS,
          'Authorization': `Bearer ${STATIC_TOKEN}`,
          'x-user': STATIC_TOKEN
        }
      });
      return r.json();
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

    res.json(playData);
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
