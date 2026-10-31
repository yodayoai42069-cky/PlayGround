#!/usr/bin/env bash
# Capture final desktop + mobile screenshots of the running preview.
# Contract:
#   * CAPTURE_URL  -> exact URL opened in the browser
#   * CAPTURE_DIR  -> where final-desktop.png / final-mobile.png are written
#   * Waits for rendered content before shooting (CAPTURE_READY_SELECTOR).
#   * Closes its own browser; leaves the app/server running untouched.
#   * exit 75 = temporary navigation/browser infrastructure failure (retryable)
#   * exit 1  = script or rendering defect
# Capture output stays in CAPTURE_DIR (outside the source tree).
set -euo pipefail
cd "$(dirname "$0")"

: "${CAPTURE_URL:?Set CAPTURE_URL}"
: "${CAPTURE_DIR:?Set CAPTURE_DIR}"

# Wait for real rendered content, not a blank shell: the app always renders
# its menu panel with exactly ONE highlighted (selected) item, so
# "#panel .mitem.sel" resolves to a single element (the runtime capture script
# uses Playwright's strict locator, which fails on multi-element matches —
# "#panel .mitem" alone resolves to ~9 items on the title screen).
export CAPTURE_READY_SELECTOR="${CAPTURE_READY_SELECTOR:-#panel .mitem.sel}"
: "${RUNTIME_DIR:=/home/runner/work/_temp/omgithub-runtime}"
export RUNTIME_DIR

# Timing per internal stage; the browser closes in the capture script's finally block.
/usr/bin/time -p mkdir -p "$CAPTURE_DIR"
/usr/bin/time -p test -f "$RUNTIME_DIR/scripts/default-capture.mjs"
/usr/bin/time -p echo "capture.sh: capturing $CAPTURE_URL -> $CAPTURE_DIR (selector: $CAPTURE_READY_SELECTOR)"

/usr/bin/time -p node "${RUNTIME_DIR:?}/scripts/default-capture.mjs"
