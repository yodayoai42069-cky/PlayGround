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
# the menu rail + at least one selectable item.
export CAPTURE_READY_SELECTOR="${CAPTURE_READY_SELECTOR:-#panel .mitem}"

# Timing per internal stage; the browser closes in the script's finally block.
/usr/bin/time -p test -f "${RUNTIME_DIR:?}/scripts/default-capture.mjs"
/usr/bin/time -p echo "capture.sh: capturing $CAPTURE_URL -> $CAPTURE_DIR (selector: $CAPTURE_READY_SELECTOR)"

/usr/bin/time -p node "${RUNTIME_DIR:?}/scripts/default-capture.mjs"
