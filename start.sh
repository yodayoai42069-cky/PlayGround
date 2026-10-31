#!/usr/bin/env bash
# LOVE TOWN ∞ (∞ anime dating sim) — static site startup.
# Builds/refreshes the static output inside PROJECT_DIR, publishes worker
# metadata (deployment-output.json), then serves it in the FOREGROUND on PORT
# (default 3000). The controller (tmux app-server) owns this process and
# reuses it; this script is foreground so tmux keeps it alive.
set -euo pipefail

PROJECT_DIR="$(cd -- "$(dirname -- "$0")" && pwd)"
cd "$PROJECT_DIR"
: "${PORT:=3000}"
export PORT
DIST_DIR="$PROJECT_DIR/dist"
SRC="$PROJECT_DIR/anime-love-town"
export DIST_DIR PROJECT_DIR

fail() { echo "start.sh: $*" >&2; exit 1; }

# ---- 1. Static source must exist -------------------------------------------
/usr/bin/time -p test -f "$SRC/index.html" || fail "missing anime-love-town/index.html"
/usr/bin/time -p bash -n "$0"

# ---- 2. Install dependencies (none: pure static HTML/JS/CSS) ---------------
# No package.json => nothing to install. Timing recorded for the check.
/usr/bin/time -p bash -c '[[ -f package.json ]] || echo "start.sh: no package.json — static project, nothing to install."'

# ---- 3. Build (stage) static output into PROJECT_DIR/dist ------------------
if [[ -f "$DIST_DIR/index.html" && "$DIST_DIR/index.html" -nt "$SRC/index.html" ]]; then
  /usr/bin/time -p echo "start.sh: dist/index.html is up to date — skipping rebuild."
else
  /usr/bin/time -p rm -rf "$DIST_DIR"
  /usr/bin/time -p mkdir -p "$DIST_DIR"
  /usr/bin/time -p cp "$SRC/index.html" "$DIST_DIR/index.html"
  [[ -f "$SRC/README.md" ]] && /usr/bin/time -p cp "$SRC/README.md" "$DIST_DIR/README.md" || true
  /usr/bin/time -p test -f "$DIST_DIR/index.html" || fail "build produced no dist/index.html"
  /usr/bin/time -p echo "start.sh: built static output in $DIST_DIR"
fi

# ---- 4. Publish worker metadata (deployment-output.json) -------------------
if [[ -n "${OPENCODE_WEB_DIR:-}" ]]; then
  /usr/bin/time -p mkdir -p "$OPENCODE_WEB_DIR"
  /usr/bin/time -p node -e 'const fs=require("fs"),path=require("path");const out=path.join(process.env.OPENCODE_WEB_DIR,"deployment-output.json");fs.writeFileSync(out,JSON.stringify({project:process.env.PROJECT_DIR,directory:process.env.DIST_DIR}));console.log("start.sh: wrote "+out+" -> "+fs.readFileSync(out,"utf8"));'
else
  /usr/bin/time -p echo 'start.sh: OPENCODE_WEB_DIR not set — skipping deployment-output.json (worker metadata only).'
fi

# ---- 5. Serve static dist in the FOREGROUND on PORT ------------------------
/usr/bin/time -p echo "start.sh: serving $DIST_DIR in foreground on 0.0.0.0:$PORT ..."
exec /usr/bin/time -p node -e '
const http = require("http"), fs = require("fs"), path = require("path");
const root = path.resolve(process.env.DIST_DIR || "/tmp");
const port = Number(process.env.PORT || 3000);
const mime = { ".html":"text/html", ".js":"application/javascript", ".css":"text/css",
  ".json":"application/json", ".svg":"image/svg+xml", ".png":"image/png", ".jpg":"image/jpeg",
  ".jpeg":"image/jpeg", ".webp":"image/webp", ".gif":"image/gif", ".ico":"image/x-icon",
  ".woff":"font/woff", ".woff2":"font/woff2", ".md":"text/markdown" };
http.createServer((req, res) => {
  try {
    let rel = "." + decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    let file = path.resolve(root, rel);
    if (file !== path.resolve(root) && !file.startsWith(path.resolve(root) + path.sep)) { res.writeHead(404); return res.end(); }
    let st; try { st = fs.statSync(file); } catch { res.writeHead(404); return res.end("Not found"); }
    if (st.isDirectory() && fs.existsSync(path.join(file, "index.html"))) file = path.join(file, "index.html");
    res.writeHead(200, { "Content-Type": mime[path.extname(file).toLowerCase()] || "application/octet-stream", "Cache-Control": "no-cache" });
    fs.createReadStream(file).on("error", () => { res.destroy(); }).pipe(res);
  } catch { res.writeHead(404); res.end("Not found"); }
}).listen(port, "0.0.0.0", () => console.log("Served http://127.0.0.1:" + port + " from " + root));
'
