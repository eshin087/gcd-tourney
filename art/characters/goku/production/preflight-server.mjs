import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] || 'art/characters/goku/production/preflight-v01');
const port = Number(process.argv[3] || 5251);
const mime = { '.html': 'text/html; charset=utf-8', '.json': 'application/json', '.png': 'image/png' };
http.createServer((req, res) => {
  try {
    const requested = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = path.resolve(root, '.' + (requested === '/' ? '/index.html' : requested));
    if (!file.startsWith(root + path.sep) || !fs.statSync(file).isFile()) throw new Error('not found');
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'text/plain', 'Cache-Control': 'no-store' });
    fs.createReadStream(file).pipe(res);
  } catch {
    res.writeHead(404); res.end('Not found');
  }
}).listen(port, '127.0.0.1', () => console.log(`Goku diagnostic viewer: http://127.0.0.1:${port}/`));
