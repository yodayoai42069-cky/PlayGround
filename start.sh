#!/usr/bin/env bash
# Build the static site and serve it in the foreground on $PORT.
set -euo pipefail

cd "$(dirname "$0")"
PROJECT_ROOT="$(pwd)"
export PROJECT_ROOT
PORT="${PORT:-3000}"
export PORT

: "${OPENCODE_WEB_DIR:?OPENCODE_WEB_DIR must point at the worker metadata directory}"
mkdir -p "$OPENCODE_WEB_DIR"

timed() {
  local label="$1"
  shift
  local started
  started="$(date +%s%3N)"
  printf '==> %s\n' "$label"
  if /usr/bin/time -p "$@"; then
    printf '<== %s ok (%sms)\n' "$label" "$(( $(date +%s%3N) - started ))"
  else
    local code=$?
    printf '<== %s FAILED exit=%s (%sms)\n' "$label" "$code" "$(( $(date +%s%3N) - started ))" >&2
    return "$code"
  fi
}

if [[ -f package-lock.json ]]; then
  timed "install dependencies (npm ci)" npm ci --no-audit --no-fund
elif [[ -f package.json ]]; then
  timed "install dependencies (npm install)" npm install --no-audit --no-fund
fi

timed "build static output" npm run build --silent
timed "verify built entrypoint" test -s dist/index.html

timed "record deployment output" node -e '
  const { mkdirSync, writeFileSync } = require("node:fs");
  const { resolve } = require("node:path");
  const project = resolve(process.env.PROJECT_ROOT);
  const directory = resolve(project, "dist");
  const file = resolve(process.env.OPENCODE_WEB_DIR, "deployment-output.json");
  mkdirSync(process.env.OPENCODE_WEB_DIR, { recursive: true });
  writeFileSync(file, JSON.stringify({ project, directory }));
  console.log(file, JSON.stringify({ project, directory }));
'

printf '==> serving on port %s\n' "$PORT"
exec node server.mjs
