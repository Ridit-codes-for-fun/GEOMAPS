// Zero-dependency static server for local use: `npm start` → http://127.0.0.1:5173/
import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 5173;
const HOST = process.env.HOST || "127.0.0.1";

const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8", ".gz": "application/octet-stream", ".svg": "image/svg+xml",
  ".png": "image/png", ".ico": "image/x-icon", ".md": "text/markdown; charset=utf-8", ".txt": "text/plain; charset=utf-8",
};
// Clean URLs for pages, e.g. /terms → terms.html (used once legal pages exist).
const PAGES = new Set(["terms", "privacy", "cookies", "demo"]);
// Never serve dot-folders/files (.git, .claude, .env…), dependencies, backups or tests.
const BLOCKED = /(^|[\\/])(\.[^\\/]*|node_modules|_backup|tests)([\\/]|$)/;

const CSP = [
  "default-src 'self'", "script-src 'self'", "style-src 'self' 'unsafe-inline'", "img-src 'self' data:",
  "connect-src 'self' https://api.open-meteo.com https://air-quality-api.open-meteo.com https://nominatim.openstreetmap.org https://overpass-api.de",
  "base-uri 'self'", "form-action 'self'", "frame-ancestors 'none'",
].join("; ");

const server = http.createServer(async (req, res) => {
  try {
    if (req.method !== "GET" && req.method !== "HEAD") { res.writeHead(405, { Allow: "GET, HEAD" }); return res.end(); }
    let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (p === "/") p = "/index.html";
    else if (PAGES.has(p.slice(1))) p += ".html";
    const file = path.normalize(path.join(ROOT, p));
    if (!file.startsWith(ROOT + path.sep) || BLOCKED.test(path.relative(ROOT, file))) { res.writeHead(404); return res.end("Not found"); }
    const s = await stat(file).catch(() => null);
    if (!s || !s.isFile()) { res.writeHead(404, { "Content-Type": "text/plain" }); return res.end("Not found"); }
    const ext = path.extname(file).toLowerCase();
    res.writeHead(200, {
      "Content-Type": TYPES[ext] || "application/octet-stream",
      "Content-Length": s.size,
      "Cache-Control": ext === ".gz" ? "public, max-age=86400" : "no-cache",
      "Content-Security-Policy": CSP,
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Permissions-Policy": "geolocation=(self), camera=(), microphone=()",
    });
    if (req.method === "HEAD") return res.end();
    res.end(await readFile(file));
  } catch (e) {
    res.writeHead(400); res.end("Bad request");
  }
});

server.listen(PORT, HOST, () => console.log(`HeatShield Mumbai running at http://${HOST}:${PORT}/  (Ctrl+C to stop)`));
