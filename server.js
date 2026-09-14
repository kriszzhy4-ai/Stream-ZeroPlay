const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeJs(str) {
  if (!str) return '';
  return String(str)
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/</g, '\\x3c');
}

app.get('/', (req, res) => {
  const url   = req.query.url   || '';
  const img   = req.query.img   || '';
  const title = req.query.title || 'Video Player';
  const wm    = req.query.wm    || 'ZeroPlay·Anime';

  if (!url) {
    return res.status(400).send(`
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><title>Error</title></head>
      <body style="background:#000;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
        <div style="text-align:center;">
          <h2>⚠️ Parameter <code>url</code> wajib diisi</h2>
          <p>Contoh: <code>/?url=VIDEO_URL&img=POSTER_URL&title=JUDUL&wm=Watermark</code></p>
        </div>
      </body>
      </html>
    `);
  }

  const safeUrl   = escapeJs(url);
  const safeImg   = escapeJs(img);
  const safeTitle = escapeHtml(title);
  const safeWm    = escapeHtml(wm);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${safeTitle}</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    overflow: hidden;
    background: #000;
}
.player-wrapper { width: 100%; height: 100vh; }
iframe { width: 100%; height: 100%; border: 0; display: block; }

.art-layer.art-layer-layer0 {
    position: absolute !important;
    top: 50%;
    left: 8%;
    transform: translateY(-50%);
    width: 64px;
    height: 64px;
    background: rgba(0, 0, 0, 0.45);
    border-radius: 50%;
    display: flex !important;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 99;
    pointer-events: auto;
}
.art-layer.art-layer-layer1 {
    position: absolute !important;
    top: 50%;
    right:8%;
    transform: translateY(-50%);
    width: 64px;
    height: 64px;
    background: rgba(0,0,0,0.45);
    border-radius: 50%;
    display: flex !important;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 99;
    pointer-events: auto;
}
.art-layer.art-layer-layer0,
.art-layer.art-layer-layer1 {
    opacity: 0;
    visibility: hidden;
    transform: translateY(-50%) scale(0.8);
    transition: opacity 0.25s ease, transform 0.25s ease;
}
.art-control-show .art-layer.art-layer-layer0,
.art-control-show .art-layer.art-layer-layer1,
.art-hover .art-layer.art-layer-layer0,
.art-hover .art-layer.art-layer-layer1 {
    opacity: 1;
    visibility: visible;
    transform: translateY(-50%) scale(1);
}

.player-watermark {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 40;
    display: flex;
    align-items: center;
    gap: 6px;
    pointer-events: none;
    user-select: none;
    opacity: 0.9;
    transition: opacity 0.5s ease;
    font-family: inherit;
}
.player-watermark svg {
    width: 14px;
    height: 14px;
    color: #797D62;
    filter: drop-shadow(0 1px 3px rgba(0,0,0,0.7));
}
.player-watermark .wm-text {
    color: #fff;
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    text-shadow: 0 1px 4px rgba(0,0,0,0.85);
}
.player-watermark .wm-dot {
    color: #797D62;
    margin: 0 2px;
}
@media (min-width: 768px) {
    .player-watermark { top: 16px; right: 16px; gap: 8px; }
    .player-watermark svg { width: 16px; height: 16px; }
    .player-watermark .wm-text { font-size: 11px; }
}

@media (max-width: 768px) {
    .artplayer .art-layer > div {
        width: 70px;
        height: 70px;
    }
    .artplayer .art-layer svg {
        width: 32px;
        height: 32px;
    }
}
</style>
</head>
<body>

<div class="player-wrapper">
    <div id="artplayer" style="width:100%;height:100%;"></div>
    <script src="https://unpkg.com/artplayer/dist/artplayer.js"><\/script>
    <script>
    const VIDEO_URL = "${safeUrl}";
    const POSTER_URL = "${safeImg}";
    const WM_TEXT = "${safeWm}";

    const art = new Artplayer({
        container: document.getElementById('artplayer'),
        url: VIDEO_URL,
        poster: POSTER_URL,
        volume: 0.5,
        isLive: false,
        muted: false,
        autoplay: false,
        autoMini: true,
        setting: true,
        loop: true,
        flip: true,
        playbackRate: true,
        aspectRatio: true,
        fullscreen: true,
        miniProgressBar: true,
        mutex: true,
        backdrop: true,
        playsInline: true,
        autoPlayback: true,
        autoOrientation: true,
        lang: navigator.language.toLowerCase(),
        moreVideoAttr: {},
        theme: '#e7cc9f',
        contextmenu: [],

        controls: [{
            position: 'right',
            index: 11,
            html: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 240 240"><path fill="#fff" d="M113.2 131.078a21.589 21.589 0 0 0-17.7-10.6 21.589 21.589 0 0 0-17.7 10.6 44.769 44.769 0 0 0 0 46.3 21.589 21.589 0 0 0 17.7 10.6 21.589 21.589 0 0 0 17.7-10.6 44.769 44.769 0 0 0 0-46.3Zm-17.7 47.2c-7.8 0-14.4-11-14.4-24.1s6.6-24.1 14.4-24.1 14.4 11 14.4 24.1-6.5 24.1-14.4 24.1Zm-43.4 9.7v-51l-4.8 4.8-6.8-6.8 13-13a4.8 4.8 0 0 1 8.2 3.4v62.7l-9.6-.1Zm162-130.2v125.3a4.867 4.867 0 0 1-4.8 4.8h-62.7v-19.3h48.2v-96.4H79.1v19.3c0 5.3-3.6 7.2-8 4.3l-41.8-27.9a6.013 6.013 0 0 1-2.7-8 5.887 5.887 0 0 1 2.7-2.7l41.8-27.9c4.4-2.9 8-1 8 4.3v19.3h130.1a4.974 4.974 0 0 1 4.9 4.9Z"/></svg>',
            tooltip: '-10 Sec',
            click: function() { art.backward = 10; },
        }, {
            position: 'right',
            index: 12,
            html: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 240 240"><path fill="#fff" d="M25.994 57.778v125.3a4.867 4.867 0 0 0 4.8 4.8h62.7v-19.3h-48.2v-96.4h115.7v19.3c0 5.3 3.6 7.2 8 4.3l41.8-27.9a6.013 6.013 0 0 0 2.7-8 5.887 5.887 0 0 0-2.7-2.7l-41.8-27.9c-4.4-2.9-8-1-8 4.3v19.3h-130.1a4.974 4.974 0 0 0-4.9 4.9zm163.422 73.046a21.589 21.589 0 0 0-17.7-10.6 21.589 21.589 0 0 0-17.7 10.6 44.769 44.769 0 0 0 0 46.3 21.589 21.589 0 0 0 17.7 10.6 21.589 21.589 0 0 0 17.7-10.6 44.769 44.769 0 0 0 0-46.3zm-17.7 47.2c-7.8 0-14.4-11-14.4-24.1 0-13.1 6.6-24.1 14.4-24.1 7.8 0 14.4 11 14.4 24.1 0 13.1-6.5 24.1-14.4 24.1zm-47.77 9.728v-51l-4.8 4.8-6.8-6.8 13-13c3.025-3.036 8.21-.886 8.2 3.4v62.7z"/></svg>',
            tooltip: '+10 Sec',
            click: function() { art.forward = 10; },
        }],
        layers: [{
            html: ' <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 240 240"><path fill="#fff" d="M113.2 131.078a21.589 21.589 0 0 0-17.7-10.6 21.589 21.589 0 0 0-17.7 10.6 44.769 44.769 0 0 0 0 46.3 21.589 21.589 0 0 0 17.7 10.6 21.589 21.589 0 0 0 17.7-10.6 44.769 44.769 0 0 0 0-46.3Zm-17.7 47.2c-7.8 0-14.4-11-14.4-24.1s6.6-24.1 14.4-24.1 14.4 11 14.4 24.1-6.5 24.1-14.4 24.1Zm-43.4 9.7v-51l-4.8 4.8-6.8-6.8 13-13a4.8 4.8 0 0 1 8.2 3.4v62.7l-9.6-.1Zm162-130.2v125.3a4.867 4.867 0 0 1-4.8 4.8h-62.7v-19.3h48.2v-96.4H79.1v19.3c0 5.3-3.6 7.2-8 4.3l-41.8-27.9a6.013 6.013 0 0 1-2.7-8 5.887 5.887 0 0 1 2.7-2.7l41.8-27.9c4.4-2.9 8-1 8 4.3v19.3h130.1a4.974 4.974 0 0 1 4.9 4.9Z"/></svg>',
            position: 'left',
            tooltip: '-10 Sec',
            click: function() { art.backward = 10; },
        }, {
            html: ' <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 240 240"><path fill="#fff" d="M25.994 57.778v125.3a4.867 4.867 0 0 0 4.8 4.8h62.7v-19.3h-48.2v-96.4h115.7v19.3c0 5.3 3.6 7.2 8 4.3l41.8-27.9a6.013 6.013 0 0 0 2.7-8 5.887 5.887 0 0 0-2.7-2.7l-41.8-27.9c-4.4-2.9-8-1-8 4.3v19.3h-130.1a4.974 4.974 0 0 0-4.9 4.9zm163.422 73.046a21.589 21.589 0 0 0-17.7-10.6 21.589 21.589 0 0 0-17.7 10.6 44.769 44.769 0 0 0 0 46.3 21.589 21.589 0 0 0 17.7 10.6 21.589 21.589 0 0 0 17.7-10.6 44.769 44.769 0 0 0 0-46.3zm-17.7 47.2c-7.8 0-14.4-11-14.4-24.1 0-13.1 6.6-24.1 14.4-24.1 7.8 0 14.4 11 14.4 24.1 0 13.1-6.5 24.1-14.4 24.1zm-47.77 9.728v-51l-4.8 4.8-6.8-6.8 13-13c3.025-3.036 8.21-.886 8.2 3.4v62.7z"/></svg>',
            position: 'right',
            tooltip: '+10 Sec',
            click: function() { art.forward = 10; },
        }],
    });

    art.on('ready', () => {
        const hideInfo = () => {
            document.querySelectorAll('.art-info, .art-info-content').forEach(el => {
                el.style.display = 'none';
            });
        };
        hideInfo();
        const observer = new MutationObserver(hideInfo);
        observer.observe(document.body, { childList: true, subtree: true });

        const watermark = document.createElement('div');
        watermark.className = 'player-watermark';
        watermark.innerHTML = \`
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 14.414l-4.707-4.707 1.414-1.414L11 13.586l5.293-5.293 1.414 1.414L11 16.414z"/>
            </svg>
            <span class="wm-text">\${WM_TEXT}</span>
        \`;
        art.template.$player.appendChild(watermark);
    });

    document.getElementById('artplayer').addEventListener('contextmenu', e => e.preventDefault());

    art.on('info', () => {
        const vurl = document.querySelector('.art-info-content[data-video="src"]');
        if (vurl) { vurl.style.display = 'none'; }
    });
    art.on('contextmenu', () => {
        const purl = document.querySelector('.art-contextmenu-version');
        if (purl) { purl.innerHTML = ''; }
    });
    <\/script>
</div>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
