#!/usr/bin/env bash
# Capture desktop and mobile screenshots of CAPTURE_URL into CAPTURE_DIR.
set -euo pipefail

cd "$(dirname "$0")"

: "${CAPTURE_URL:?CAPTURE_URL must be set}"
: "${CAPTURE_DIR:?CAPTURE_DIR must be set}"

mkdir -p "$CAPTURE_DIR"
CAPTURE_DIR="$(cd "$CAPTURE_DIR" && pwd)"
export CAPTURE_DIR

STARTED_AT="$(date +%s%3N)"
printf '==> capture %s -> %s\n' "$CAPTURE_URL" "$CAPTURE_DIR"
set +e
/usr/bin/time -p node capture.mjs
CODE=$?
set -e
printf '<== capture exit=%s total=%sms\n' "$CODE" "$(( $(date +%s%3N) - STARTED_AT ))"
exit "$CODE"
