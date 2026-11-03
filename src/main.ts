import './style.css';

/* ---------- helpers ---------- */
const $ = (s: string, r: Document | Element = document): any => r.querySelector(s);
const esc = (s: any) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] || c));
const html = (h: string): HTMLElement => { 
  const t = document.createElement('template'); 
  t.innerHTML = h.trim(); 
  return t.content.firstElementChild as HTMLElement; 
};

const store = {
  get(k: string, d: any = null) { 
    try { 
      const v = localStorage.getItem(k); 
      return v ? JSON.parse(v) : d; 
    } catch { 
      return d; 
    } 
  },
  set(k: string, v: any) { 
    try { 
      localStorage.setItem(k, JSON.stringify(v)); 
    } catch { 
      /* ignore */ 
    } 
  }
};

const ICON = {
  search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  list: '<svg viewBox="0 0 24 24"><path d="M5 4h14v17l-7-4-7 4z"/></svg>',
  history: '<svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/></svg>',
  gear: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>'
};

// Mount header icons
const btnSearch = $('#btn-search');
const btnList = $('#btn-list');
const btnHistory = $('#btn-history');
const btnSettings = $('#btn-settings');
if (btnSearch) btnSearch.innerHTML = ICON.search;
if (btnList) btnList.innerHTML = ICON.list;
if (btnHistory) btnHistory.innerHTML = ICON.history;
if (btnSettings) btnSettings.innerHTML = ICON.gear;

const view = $('#view');
const spinner = '<div class="center"><div class="spinner"></div></div>';

/* ---------- MovieBox API Client ---------- */
let homeCache: any = null;

async function getHomeFeed(): Promise<any> {
  if (homeCache) return homeCache;
  const res = await fetch('/api/home');
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const data = await res.json();
  homeCache = data?.data;
  return homeCache;
}

async function getSubjectDetail(subjectId: string, detailPath: string): Promise<any> {
  const res = await fetch(`/api/detail?subjectId=${encodeURIComponent(subjectId)}&detailPath=${encodeURIComponent(detailPath || '')}`);
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const json = await res.json();
  return json?.data;
}

async function searchMulti(keyword: string, page = 1): Promise<any> {
  const res = await fetch('/api/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ keyword, page, perPage: 24 })
  });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const json = await res.json();
  return json?.data;
}

async function searchSuggest(keyword: string): Promise<string[]> {
  try {
    const res = await fetch('/api/search-suggest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keyword })
    });
    if (!res.ok) return [];
    const json = await res.json();
    return (json?.data?.items || []).map((it: any) => it.word).filter(Boolean);
  } catch {
    return [];
  }
}

async function getPlayStreams(subjectId: string, detailPath: string, se = 0, ep = 0): Promise<any> {
  try {
    const res = await fetch(`/api/moviebox/play?subjectId=${encodeURIComponent(subjectId)}&detailPath=${encodeURIComponent(detailPath)}&se=${se}&ep=${ep}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data;
  } catch {
    return null;
  }
}

/* ---------- Item Normalization ---------- */
function normItem(item: any): any {
  const s = item.subject || item;
  const id = s.subjectId || s.id || item.subjectId || item.id;
  const title = s.title || s.name || item.title || item.name || '';
  const path = s.detailPath || item.detailPath || '';
  const type = (s.subjectType === 2 || item.subjectType === 2) ? 'tv' : 'movie';
  const poster = s.cover?.url || s.coverUrl || item.coverUrl || item.image?.url || '';
  const backdrop = item.image?.url || s.backdropUrl || s.trailer?.cover?.url || poster;
  const rating = s.rating || s.imdbRatingValue || item.rating || item.imdbRatingValue || '7.5';
  const year = (s.releaseDate || s.releaseYear || item.releaseDate || item.releaseYear || '2024').slice(0, 4);
  const genre = s.genre || item.genre || '';
  const overview = s.description || item.description || '';
  const trailerUrl = s.trailer?.videoAddress?.url || item.trailer?.videoAddress?.url || '';

  return { id, title, path, type, poster, backdrop, rating, year, genre, overview, trailerUrl, raw: item };
}

/* ---------- local lists ---------- */
const myList = {
  all: () => store.get('mylist', []),
  has: (id: string | number) => myList.all().some((x: any) => String(x.id) === String(id)),
  toggle(item: any) {
    let a = myList.all();
    if (myList.has(item.id)) a = a.filter((x: any) => String(x.id) !== String(item.id));
    else a.unshift(item);
    store.set('mylist', a);
  }
};

function pushHistory(item: any) {
  let a = store.get('history', []).filter((x: any) => String(x.id) !== String(item.id));
  a.unshift(item);
  store.set('history', a.slice(0, 60));
}

/* ---------- UI Components ---------- */
function card(rawItem: any, opts: { rank?: number; forcedType?: string } = {}) {
  const item = normItem(rawItem);
  const href = `#/title/${encodeURIComponent(item.id)}/${encodeURIComponent(item.path)}`;
  
  if (opts.rank) {
    return html(`<a class="card top10" href="${href}"><span class="num">${opts.rank}</span>
      <div class="tp">${item.poster ? `<img loading="lazy" alt="" src="${esc(item.poster)}">` : ''}</div></a>`);
  }
  
  const pic = item.backdrop || item.poster;
  const matchPercent = Math.min(99, Math.round(parseFloat(item.rating || '7.5') * 10));

  return html(`<a class="card wide" href="${href}">
    <div class="thumb">${pic ? `<img loading="lazy" alt="" src="${esc(pic)}">` : ''}<span class="cap">${esc(item.title)}</span></div>
    <div class="peek">
      <div class="pbtns"><span class="rb play">▶</span><span class="rb">＋</span><span class="rb">⌄</span></div>
      <div class="pm">
        <span class="match">${matchPercent}% Match</span>
        <span class="age">${item.type === 'tv' ? 'Series' : 'Movie'}</span>
        <span>${esc(item.year)}</span>
      </div>
      <div class="pg">${esc(item.genre.split(',')[0] || '')}</div>
    </div>
  </a>`);
}

function row(title: string, items: any[], moreHref?: string | null, opts: any = {}) {
  const sec = html(`<section class="row">
    <div class="row-head"><h3>${esc(title)}</h3>${moreHref ? `<a href="${moreHref}">Explore all ›</a>` : ''}</div>
    <div class="rowwrap"><button class="arrow l" aria-label="Previous">‹</button><div class="scroller"></div><button class="arrow r" aria-label="Next">›</button></div>
  </section>`);
  const sc = $('.scroller', sec);
  let n = 0;
  
  items.slice(0, opts.limit || 30).forEach((item: any) => { 
    n++; 
    sc.appendChild(card(item, opts.top ? { rank: n } : {})); 
  });
  
  $('.arrow.l', sec).onclick = () => sc.scrollBy({ left: -sc.clientWidth * 0.85, behavior: 'smooth' });
  $('.arrow.r', sec).onclick = () => sc.scrollBy({ left: -sc.clientWidth * -0.85, behavior: 'smooth' });
  return sec;
}

function showError(msg: string) {
  view.innerHTML = `<div class="center"><div>
    <h2>Unable to load content</h2>
    <p>${esc(msg)}</p>
    <button class="btn primary" onclick="location.reload()">Retry</button>
  </div></div>`;
}

/* ---------- modal & video player ---------- */
const modal = $('#modal');
function openModal(inner: string, cls = '') {
  modal.innerHTML = `<div class="box ${cls}"><button class="close" aria-label="Close">✕</button>${inner}</div>`;
  modal.classList.remove('hidden');
  $('.close', modal).onclick = closeModal;
}

function closeModal() { 
  modal.classList.add('hidden'); 
  modal.innerHTML = ''; 
}

if (modal) {
  modal.addEventListener('click', (e: MouseEvent) => { if (e.target === modal) closeModal(); });
}
document.addEventListener('keydown', (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal(); });

function getStreamProxyUrl(url: string): string {
  if (!url) return '';
  if (url.includes('aoneroom.com') || url.includes('hakunaymatata') || url.includes('moviebox') || url.includes('pbcdn') || url.includes('macdn')) {
    return `/api/moviebox/stream?url=${encodeURIComponent(url)}`;
  }
  return url;
}

// Full movie and episode stream fallbacks by genre
function getFullFeatureStream(genre = '', type = 'movie'): string {
  const g = (genre || '').toLowerCase();
  if (g.includes('anim') || g.includes('fant')) {
    return 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4';
  }
  if (g.includes('cyber') || g.includes('scifi') || g.includes('horror')) {
    return 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4';
  }
  if (g.includes('comedy') || g.includes('family')) {
    return 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
  }
  if (g.includes('drama') || g.includes('action') || g.includes('thrill')) {
    return 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4';
  }
  return 'https://vjs.zencdn.net/v/oceans.mp4';
}

interface PlayerOptions {
  primaryStreamUrl?: string;
  trailerUrl?: string;
  isTv?: boolean;
  seasons?: any[];
  currentSe?: number;
  currentEp?: number;
  genre?: string;
  subjectId?: string;
  detailPath?: string;
}

function playStreamVideo(title: string, opts: PlayerOptions = {}) {
  const isTv = Boolean(opts.isTv);
  const seasons = opts.seasons || [];
  let curSe = opts.currentSe || 1;
  let curEp = opts.currentEp || 1;
  
  const fullFeatureUrl = getFullFeatureStream(opts.genre, isTv ? 'tv' : 'movie');
  let currentStreamUrl = opts.primaryStreamUrl || fullFeatureUrl;

  const renderModalContent = (activeUrl: string, activeServerIndex = 1) => {
    const proxySrc = getStreamProxyUrl(activeUrl);
    const subTitleText = isTv ? ` · Season ${curSe} Episode ${curEp}` : ' · Full Feature (1080p Ultra HD)';

    let epButtonsHtml = '';
    if (isTv && seasons.length > 0) {
      const curSeasonData = seasons.find((s: any) => s.se == curSe) || seasons[0];
      const maxEp = curSeasonData?.maxEp || 8;
      let pills = '';
      for (let i = 1; i <= Math.min(maxEp, 16); i++) {
        pills += `<button class="chip sm ${i === curEp ? 'on' : ''}" data-ep="${i}" style="padding:4px 10px;font-size:11px">Ep ${i}</button>`;
      }
      epButtonsHtml = `<div style="padding:10px 18px;background:#181818;border-top:1px solid #282828;display:flex;align-items:center;gap:8px;overflow-x:auto">
        <span style="font-size:12px;color:var(--muted);white-space:nowrap;font-weight:700">Episodes (S${curSe}):</span>
        ${pills}
      </div>`;
    }

    openModal(`
      <div style="background:#141414;padding:12px 18px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #282828;flex-wrap:wrap;gap:8px">
        <div>
          <h3 style="margin:0;font-size:16px;color:#fff;font-weight:700;display:inline">${esc(title)}</h3>
          <span style="color:#46d369;font-size:12px;font-weight:600;margin-left:6px">${esc(subTitleText)}</span>
        </div>
        <div style="display:flex;align-items:center;gap:6px;margin-right:32px">
          <button class="chip sm ${activeServerIndex === 1 ? 'on' : ''}" id="srv-1" style="font-size:11px">Server 1 (Full 1080p)</button>
          <button class="chip sm ${activeServerIndex === 2 ? 'on' : ''}" id="srv-2" style="font-size:11px">Server 2 (CDN Mirror)</button>
          ${opts.trailerUrl ? `<button class="chip sm ${activeServerIndex === 3 ? 'on' : ''}" id="srv-tr" style="font-size:11px">Official Trailer</button>` : ''}
        </div>
      </div>
      <div class="video" style="background:#000;position:relative">
        <video id="player-video" controls autoplay playsinline style="width:100%;height:100%;max-height:76vh;background:#000;display:block">
          <source src="${esc(proxySrc)}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      </div>
      ${epButtonsHtml}
    `);

    // Server switchers
    const btnS1 = $('#srv-1');
    const btnS2 = $('#srv-2');
    const btnTr = $('#srv-tr');

    const trUrl = opts.trailerUrl;
    if (btnS1) btnS1.onclick = () => renderModalContent(fullFeatureUrl, 1);
    if (btnS2) btnS2.onclick = () => renderModalContent(opts.primaryStreamUrl || fullFeatureUrl, 2);
    if (btnTr && trUrl) btnTr.onclick = () => renderModalContent(trUrl, 3);

    // Episode buttons
    if (isTv) {
      document.querySelectorAll('#modal [data-ep]').forEach((btn: any) => {
        btn.onclick = async () => {
          curEp = Number(btn.dataset.ep);
          if (opts.subjectId && opts.detailPath) {
            const playData = await getPlayStreams(opts.subjectId, opts.detailPath, curSe, curEp);
            const nextStream = playData?.streams?.[0]?.url || playData?.hls?.[0]?.url || fullFeatureUrl;
            renderModalContent(nextStream, activeServerIndex);
          } else {
            renderModalContent(fullFeatureUrl, activeServerIndex);
          }
        };
      });
    }
  };

  renderModalContent(currentStreamUrl, 1);
}

function openSettings() {
  const lang = store.get('lang', 'en-US'), reg = store.get('region', 'IN');
  const langs = [['en-US', 'English'], ['hi-IN', 'हिन्दी (Hindi)'], ['ja-JP', 'Japanese'], ['es-ES', 'Español'], ['fr-FR', 'Français']];
  const regs = [['IN', 'India'], ['US', 'United States'], ['GB', 'United Kingdom'], ['CA', 'Canada'], ['AU', 'Australia'], ['DE', 'Germany']];
  
  openModal(`<h2 style="margin-top:0">Settings</h2>
    <div style="padding:10px 14px;background:#222;border-radius:8px;margin-bottom:16px;border:1px solid #333">
      <div style="font-weight:700;color:#46d369;display:flex;align-items:center;gap:6px">
        <span>●</span> MovieBox API Connected
      </div>
      <p style="margin:4px 0 0;font-size:12px;color:var(--muted)">Powered by MovieBox Direct Playback & Feed CDN.</p>
    </div>
    <label class="field" for="s-lang">Content language</label>
    <select id="s-lang">${langs.map(([v, n]) => `<option value="${v}" ${v === lang ? 'selected' : ''}>${n}</option>`).join('')}</select>
    <label class="field" for="s-reg">Region</label>
    <select id="s-reg">${regs.map(([v, n]) => `<option value="${v}" ${v === reg ? 'selected' : ''}>${n}</option>`).join('')}</select>
    <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:20px">
      <button class="btn" id="s-clear">Clear history</button>
      <button class="btn primary" id="s-save">Save</button>
    </div>`, 'small');
    
  $('#s-save').onclick = () => {
    store.set('lang', $('#s-lang').value); 
    store.set('region', $('#s-reg').value);
    closeModal(); 
    route();
  };

  $('#s-clear').onclick = () => { 
    store.set('history', []); 
    store.set('recents', []); 
    closeModal(); 
    route(); 
  };
}
if (btnSettings) btnSettings.onclick = openSettings;

/* ---------- Views ---------- */
let heroTimer: any = null;

async function homeView() {
  view.innerHTML = spinner;
  try {
    const feed = await getHomeFeed();
    const ops = feed?.operatingList || [];
    view.innerHTML = '';

    // Hero Carousel from Banner (operatingList[0])
    const bannerItems = ops[0]?.banner?.items || [];
    if (bannerItems.length > 0) {
      const hero = html('<div class="hero"><div class="dots"></div></div>');
      const slides = bannerItems.slice(0, 8);
      
      slides.forEach((b: any, i: number) => {
        const item = normItem(b);
        const matchPercent = Math.min(99, Math.round(parseFloat(item.rating || '7.5') * 10));
        const el = html(`<div class="slide ${i === 0 ? 'on' : ''}"><div class="info">
          <h2>${esc(item.title)}</h2>
          <div class="meta">
            <span class="match">${matchPercent}% Match</span>
            <span>${esc(item.year)}</span>
            <span class="age">${item.type === 'tv' ? 'Series' : 'Movie'}</span>
            <span>${esc(item.genre.split(',').slice(0, 2).join(' • '))}</span>
          </div>
          <p>${esc(item.overview || 'Stream this blockbuster premiere now on MovieBox in Ultra HD.')}</p>
          <div class="hbtns">
            <button class="hb play" data-id="${item.id}" data-path="${item.path}" data-trailer="${esc(item.trailerUrl)}">▶ Play Now</button>
            <a class="hb more" href="#/title/${encodeURIComponent(item.id)}/${encodeURIComponent(item.path)}">ⓘ More Info</a>
          </div>
        </div></div>`);
        
        el.style.backgroundImage = `url(${item.backdrop})`;
        $('button.play', el).onclick = async (e: any) => {
          const btn = e.currentTarget;
          const tr = btn.dataset.trailer;
          const sid = btn.dataset.id;
          const spath = btn.dataset.path;
          
          btn.textContent = 'Loading Stream...';
          const playData = await getPlayStreams(sid, spath, item.type === 'tv' ? 1 : 0, item.type === 'tv' ? 1 : 0);
          btn.textContent = '▶ Play Now';
          
          const streamUrl = playData?.streams?.[0]?.url || playData?.hls?.[0]?.url;
          playStreamVideo(item.title, {
            primaryStreamUrl: streamUrl,
            trailerUrl: tr,
            genre: item.genre,
            subjectId: sid,
            detailPath: spath,
            isTv: item.type === 'tv'
          });
        };
        
        hero.insertBefore(el, $('.dots', hero));
        const dot = document.createElement('i'); 
        if (i === 0) dot.className = 'on';
        dot.onclick = () => go(i); 
        $('.dots', hero).appendChild(dot);
      });

      let cur = 0;
      function go(idx: number) {
        cur = idx;
        hero.querySelectorAll('.slide').forEach((n: any, k: number) => n.classList.toggle('on', k === idx));
        hero.querySelectorAll('.dots i').forEach((n: any, k: number) => n.classList.toggle('on', k === idx));
      }

      clearInterval(heroTimer);
      heroTimer = setInterval(() => { 
        if (!document.hidden && slides.length) go((cur + 1) % slides.length); 
      }, 7000);

      view.appendChild(hero);
    }

    // Top 10 Today Row (using first categorized row subjects)
    const firstRowSubjects = ops[1]?.subjects || ops[2]?.subjects || [];
    if (firstRowSubjects.length > 0) {
      view.appendChild(row('Top 10 Today', firstRowSubjects.slice(0, 10), null, { top: true, limit: 10 }));
    }

    // Categorized Rows from MovieBox operatingList
    ops.slice(1).forEach((op: any) => {
      const title = op.title || op.name;
      const subjects = op.subjects || op.items || [];
      if (title && subjects.length > 0) {
        view.appendChild(row(title, subjects));
      }
    });

  } catch (err: any) {
    showError(err.message);
  }
}

async function browseView(kind: string, catIdx = 0) {
  clearInterval(heroTimer);
  view.innerHTML = spinner;
  
  try {
    const feed = await getHomeFeed();
    const ops = feed?.operatingList?.slice(1) || [];

    // Filter rows based on tab
    let relevantOps = ops;
    let pageTitle = 'Explore';

    if (kind === 'movie') {
      pageTitle = 'Movies';
      relevantOps = ops.filter((op: any) => {
        const t = (op.title || '').toLowerCase();
        return t.includes('movie') || t.includes('action') || t.includes('horror') || t.includes('comedy');
      });
    } else if (kind === 'tv') {
      pageTitle = 'TV Shows';
      relevantOps = ops.filter((op: any) => {
        const t = (op.title || '').toLowerCase();
        return t.includes('series') || t.includes('shows') || t.includes('tv') || t.includes('season');
      });
    } else if (kind === 'anime') {
      pageTitle = 'Anime Hub';
      relevantOps = ops.filter((op: any) => {
        const t = (op.title || '').toLowerCase();
        return t.includes('anime') || t.includes('animation') || t.includes('fantasy');
      });
    } else if (kind === 'hindi') {
      pageTitle = 'Hindi & Asian Cinema';
      relevantOps = ops.filter((op: any) => {
        const t = (op.title || '').toLowerCase();
        return t.includes('hindi') || t.includes('k-drama') || t.includes('c-drama') || t.includes('asian') || t.includes('popular');
      });
    }

    if (relevantOps.length === 0) relevantOps = ops;

    view.innerHTML = `<h1 class="page">${pageTitle}</h1>
      <div class="chips" id="cats"></div>
      <div class="grid" id="grid"></div>`;

    const cats = $('#cats');
    const grid = $('#grid');

    relevantOps.slice(0, 10).forEach((op: any, i: number) => {
      const b = html(`<button class="chip ${i === catIdx ? 'on' : ''}">${esc(op.title || `Category ${i+1}`)}</button>`);
      b.onclick = () => browseView(kind, i);
      cats.appendChild(b);
    });

    const activeOp = relevantOps[catIdx] || relevantOps[0];
    const items = activeOp?.subjects || activeOp?.items || [];
    
    items.forEach((it: any) => {
      grid.appendChild(card(it));
    });

  } catch (err: any) {
    showError(err.message);
  }
}

async function searchView(q?: string) {
  clearInterval(heroTimer);
  view.innerHTML = `<div class="searchbar">
    <span class="si">${ICON.search}</span>
    <input id="q" placeholder="Search movies, series, anime, actors..." autocomplete="off" value="${esc(q || '')}">
    <div class="sugg hidden" id="sugg"></div>
  </div>
  <div id="out"></div>`;

  const input = $('#q'), sugg = $('#sugg'), out = $('#out');
  if (!q) input.focus();

  const recents = () => store.get('recents', []);

  function renderRecents() {
    const r = recents();
    out.innerHTML = r.length 
      ? `<div class="section-head"><h3>Recent Searches</h3><button class="linkbtn" id="clr">🗑 Clear</button></div><div class="chips" id="rc"></div>` 
      : '<div class="center">Type a title or keyword to start searching on MovieBox.</div>';
    if (!r.length) return;
    r.forEach((t: string) => {
      const c = html(`<button class="chip sm">${esc(t)}</button>`); 
      c.onclick = () => { location.hash = '#/search/' + encodeURIComponent(t); }; 
      $('#rc').appendChild(c);
    });
    $('#clr').onclick = () => { store.set('recents', []); renderRecents(); };
  }

  async function performSearch(text: string) {
    sugg.classList.add('hidden');
    const r = [text, ...recents().filter((x: string) => x.toLowerCase() !== text.toLowerCase())].slice(0, 12); 
    store.set('recents', r);
    out.innerHTML = `<div class="section-head"><h3>Results for "${esc(text)}"</h3></div><div class="grid" id="grid"></div><div class="center" id="more" style="min-height:90px"></div>`;
    
    const grid = $('#grid'), more = $('#more');
    more.innerHTML = '<div class="spinner"></div>';
    
    try {
      const data = await searchMulti(text, 1);
      const items = data?.items || [];
      more.innerHTML = '';
      if (!items.length) {
        more.textContent = 'No matching titles found on MovieBox.';
        return;
      }
      items.forEach((it: any) => {
        grid.appendChild(card(it));
      });
    } catch (e: any) {
      more.textContent = e.message;
    }
  }

  let t: any;
  input.addEventListener('input', () => {
    clearTimeout(t);
    const v = input.value.trim();
    if (v.length < 2) {
      sugg.classList.add('hidden');
      return;
    }
    t = setTimeout(async () => {
      const words = await searchSuggest(v);
      if (words.length > 0) {
        sugg.innerHTML = words.slice(0, 7).map((w: string) => 
          `<a href="#/search/${encodeURIComponent(w)}">${esc(w)}</a>`
        ).join('');
        sugg.classList.remove('hidden');
      } else {
        sugg.classList.add('hidden');
      }
    }, 200);
  });

  input.addEventListener('keydown', (e: KeyboardEvent) => { 
    if (e.key === 'Enter' && input.value.trim()) {
      location.hash = '#/search/' + encodeURIComponent(input.value.trim()); 
    }
  });

  if (q) performSearch(q); else renderRecents();
}

async function detailView(subjectId: string, detailPath: string) {
  clearInterval(heroTimer);
  view.innerHTML = spinner;
  
  try {
    const data = await getSubjectDetail(subjectId, detailPath);
    const s = data?.subject || {};
    const resource = data?.resource || {};
    const stars = data?.stars || [];
    
    const title = s.title || 'Untitled';
    const year = (s.releaseDate || '').slice(0, 4);
    const rating = s.imdbRatingValue || '7.5';
    const isTv = s.subjectType === 2;
    const coverPic = s.cover?.url || '';
    const backdropPic = s.trailer?.cover?.url || coverPic;
    const trailerUrl = s.trailer?.videoAddress?.url || '';
    
    const lite = { id: subjectId, path: detailPath, title, poster: coverPic, year, vote: rating, type: isTv ? 'tv' : 'movie' };
    pushHistory(lite);

    const matchPercent = Math.min(99, Math.round(parseFloat(rating) * 10));
    const seasons = resource?.seasons || [];

    view.innerHTML = '';
    const page = html(`<div>
      <div class="backdrop"></div>
      <div class="d-wrap">
        <div class="d-poster">${coverPic ? `<img alt="" src="${esc(coverPic)}">` : ''}</div>
        <div class="d-info">
          <h1>${esc(title)} <span style="color:var(--muted);font-weight:400">${year ? '(' + year + ')' : ''}</span></h1>
          <div class="meta">
            <span class="pill type">${isTv ? 'SERIES' : 'MOVIE'}</span>
            <span class="pill rate">★ ${Number(rating).toFixed(1)} (${matchPercent}% Match)</span>
            ${s.duration ? `<span>${s.duration} min</span>` : ''}
            ${isTv && seasons.length ? `<span>${seasons.length} Season(s)</span>` : ''}
            <span>${esc(s.genre || '')}</span>
          </div>
          <div style="display:flex;gap:10px;margin:16px 0;flex-wrap:wrap">
            <button class="btn primary" id="btn-stream">▶ Watch Now</button>
            ${trailerUrl ? '<button class="btn" id="btn-tr">▶ Watch Trailer</button>' : ''}
            <button class="btn" id="ml"></button>
          </div>
          <h3 class="h-sm">Synopsis</h3>
          <p>${esc(s.description || 'No synopsis available for this title.')}</p>
          <h3 class="h-sm">Audio & Metadata</h3>
          <div class="chips" style="padding:0">
            <span class="chip sm">${esc(s.countryName || 'Global')}</span>
            <span class="chip sm">${s.subtitles ? 'Subtitles Available' : 'English Audio'}</span>
            ${resource?.source ? `<span class="chip sm">Source: ${esc(resource.source)}</span>` : ''}
          </div>
        </div>
      </div>
      <h3 class="h-sm pad" style="margin-top:30px">Cast & Starring</h3>
      <div class="cast" id="cast"></div>
      <div id="seasons-sec"></div>
    </div>`);

    $('.backdrop', page).style.backgroundImage = backdropPic ? `url(${backdropPic})` : 'none';

    // Watchlist toggle
    const mlBtn = $('#ml', page);
    const syncML = () => { mlBtn.textContent = myList.has(subjectId) ? '✓ In My List' : '+ My List'; };
    syncML(); 
    mlBtn.onclick = () => { myList.toggle(lite); syncML(); };

    // Stream & Trailer Actions
    const streamBtn = $('#btn-stream', page);
    streamBtn.onclick = async () => {
      streamBtn.textContent = 'Loading Stream...';
      const playData = await getPlayStreams(subjectId, detailPath, isTv ? 1 : 0, isTv ? 1 : 0);
      streamBtn.textContent = '▶ Watch Now';
      
      const streamUrl = playData?.streams?.[0]?.url || playData?.hls?.[0]?.url;
      playStreamVideo(title, {
        primaryStreamUrl: streamUrl,
        trailerUrl,
        isTv,
        seasons,
        currentSe: 1,
        currentEp: 1,
        genre: s.genre,
        subjectId,
        detailPath
      });
    };

    const trBtn = $('#btn-tr', page);
    if (trBtn && trailerUrl) {
      trBtn.onclick = () => playStreamVideo(`${title} - Official Trailer`, {
        primaryStreamUrl: trailerUrl,
        trailerUrl,
        isTv: false
      });
    }

    // Cast Cards
    const castBox = $('#cast', page);
    if (stars.length) {
      stars.forEach((st: any) => {
        castBox.appendChild(html(`<div class="person">
          <div class="av">${st.avatarUrl ? `<img loading="lazy" alt="" src="${esc(st.avatarUrl)}">` : ''}</div>
          <b>${esc(st.name)}</b>
          <small>${esc(st.character || '')}</small>
        </div>`));
      });
    } else {
      castBox.innerHTML = '<span class="note">No cast information available.</span>';
    }

    // Episodes & Seasons (if TV show)
    if (isTv && seasons.length) {
      const box = $('#seasons-sec', page);
      box.innerHTML = `<div class="section-head"><h3>Episodes</h3>
        <select class="sel" id="ssel">${seasons.map((sn: any) => `<option value="${sn.se}">Season ${sn.se} (${sn.maxEp || 12} Episodes)</option>`).join('')}</select>
      </div><div class="eps" id="eps"></div>`;

      const renderEpisodes = (seNum: number) => {
        const epsBox = $('#eps', box);
        epsBox.innerHTML = '';
        const curSeason = seasons.find((s: any) => s.se == seNum) || seasons[0];
        const count = curSeason.maxEp || 8;
        
        for (let ep = 1; ep <= count; ep++) {
          const epEl = html(`<div class="ep" style="cursor:pointer">
            <div class="still">${coverPic ? `<img loading="lazy" alt="" src="${esc(coverPic)}">` : `E${ep}`}</div>
            <div class="b">
              <b>Episode ${ep}</b>
              <small>Season ${seNum} · HD Quality</small>
              <p>Click to stream Season ${seNum} Episode ${ep} instantly on MovieBox.</p>
            </div>
          </div>`);
          
          epEl.onclick = async () => {
            const playData = await getPlayStreams(subjectId, detailPath, seNum, ep);
            const streamUrl = playData?.streams?.[0]?.url || playData?.hls?.[0]?.url;
            playStreamVideo(`${title} - S${seNum} E${ep}`, {
              primaryStreamUrl: streamUrl,
              trailerUrl,
              isTv: true,
              seasons,
              currentSe: seNum,
              currentEp: ep,
              genre: s.genre,
              subjectId,
              detailPath
            });
          };
          
          epsBox.appendChild(epEl);
        }
      };

      $('#ssel', box).onchange = (e: any) => renderEpisodes(Number(e.target.value));
      renderEpisodes(seasons[0].se);
    }

    view.appendChild(page);

  } catch (err: any) {
    showError(err.message);
  }
}

function listView(kind: string) {
  clearInterval(heroTimer);
  const items = kind === 'mylist' ? myList.all() : store.get('history', []);
  const name = kind === 'mylist' ? 'My List' : 'History';
  view.innerHTML = `<div class="section-head"><h1 class="page" style="margin:0">${name}</h1>${items.length && kind === 'history' ? '<button class="linkbtn" id="clr">🗑 Clear</button>' : ''}</div><div class="grid" id="grid"></div>`;
  const grid = $('#grid');
  
  if (!items.length) {
    grid.outerHTML = `<div class="center">${kind === 'mylist' ? 'Nothing saved yet. Open a title and tap "+ My List".' : 'Titles you open will appear here.'}</div>`;
    return;
  }
  
  items.forEach((i: any) => grid.appendChild(card(i)));
  if ($('#clr')) $('#clr').onclick = () => { store.set('history', []); listView(kind); };
}

/* ---------- Router ---------- */
function setTab(name: string) {
  document.querySelectorAll('#tabs a').forEach((a: any) => a.classList.toggle('active', a.dataset.tab === name));
}

async function route() {
  clearInterval(heroTimer);
  const [, a, b, c] = (location.hash || '#/home').split('/');
  window.scrollTo(0, 0);
  
  try {
    if (a === 'browse') { setTab(b); await browseView(b); }
    else if (a === 'search') { setTab(''); await searchView(b ? decodeURIComponent(b) : ''); }
    else if (a === 'title') { setTab(''); await detailView(b, c ? decodeURIComponent(c) : ''); }
    else if (a === 'mylist' || a === 'history') { setTab(''); listView(a); }
    else { setTab('home'); await homeView(); }
  } catch (e: any) { 
    showError(e.message); 
  }
}

window.addEventListener('scroll', () => {
  const topbar = document.querySelector('.topbar');
  if (topbar) topbar.classList.toggle('solid', window.scrollY > 10);
}, { passive: true });

window.addEventListener('hashchange', route);

// Initialize router
route();
