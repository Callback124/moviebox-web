import express from 'express';
import app from './api/index';
import { createServer as createViteServer } from 'vite';

const PORT = 3000;

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MovieBox Full-Stack Server running on port ${PORT}`);
  });
}

// Only start standalone HTTP server in non-serverless environments (local dev)
if (!process.env.VERCEL) {
  startServer();
}

export default app;
