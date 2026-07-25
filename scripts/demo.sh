#!/usr/bin/env bash
# Start Atlas API + frontend for a live demo. Logs: /tmp/atlas-demo-api.log, /tmp/atlas-demo-web.log
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
API_DIR="$ROOT/api"
WEB_DIR="$ROOT/frontend"
API_PORT="${ATLAS_API_PORT:-8787}"
WEB_PORT="${ATLAS_WEB_PORT:-5173}"
API_LOG="${ATLAS_API_LOG:-/tmp/atlas-demo-api.log}"
WEB_LOG="${ATLAS_WEB_LOG:-/tmp/atlas-demo-web.log}"

cleanup() {
  if [[ -n "${API_PID:-}" ]] && kill -0 "$API_PID" 2>/dev/null; then
    kill "$API_PID" 2>/dev/null || true
  fi
  if [[ -n "${WEB_PID:-}" ]] && kill -0 "$WEB_PID" 2>/dev/null; then
    kill "$WEB_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT INT TERM

echo "== Atlas demo launcher =="
echo "Repo: $ROOT"
echo ""

if [[ ! -f "$API_DIR/.env" ]]; then
  echo "⚠️  Missing api/.env — copying from .env.example"
  cp "$API_DIR/.env.example" "$API_DIR/.env"
  echo "   Edit api/.env and set OPENAI_API_KEY, then re-run this script."
  exit 1
fi

if ! grep -qE '^OPENAI_API_KEY=sk-' "$API_DIR/.env" 2>/dev/null; then
  echo "⚠️  OPENAI_API_KEY does not look set in api/.env (expect sk-...)."
  echo "   Demo generations will fail until you add a key."
fi

echo "→ Installing API deps (if needed)…"
python3 -m pip install -q -r "$API_DIR/requirements.txt"

echo "→ Installing frontend deps (if needed)…"
(cd "$WEB_DIR" && npm install --silent)

if curl -sf "http://127.0.0.1:${API_PORT}/api/health" >/dev/null 2>&1; then
  echo "✓ API already running on port $API_PORT"
else
  echo "→ Starting API on port $API_PORT (log: $API_LOG)"
  (cd "$API_DIR" && python3 -m uvicorn main:app --host 127.0.0.1 --port "$API_PORT") >>"$API_LOG" 2>&1 &
  API_PID=$!
  for _ in $(seq 1 30); do
    if curl -sf "http://127.0.0.1:${API_PORT}/api/health" >/dev/null 2>&1; then
      break
    fi
    sleep 0.5
  done
  if ! curl -sf "http://127.0.0.1:${API_PORT}/api/health" >/dev/null 2>&1; then
    echo "✗ API failed to start. Tail log: tail -f $API_LOG"
    exit 1
  fi
  echo "✓ API healthy"
fi

if curl -sf "http://127.0.0.1:${WEB_PORT}/" >/dev/null 2>&1; then
  echo "✓ Frontend already running on port $WEB_PORT"
else
  echo "→ Starting frontend on port $WEB_PORT (log: $WEB_LOG)"
  (cd "$WEB_DIR" && npm run dev -- --host 127.0.0.1 --port "$WEB_PORT") >>"$WEB_LOG" 2>&1 &
  WEB_PID=$!
  for _ in $(seq 1 40); do
    if curl -sf "http://127.0.0.1:${WEB_PORT}/" >/dev/null 2>&1; then
      break
    fi
    sleep 0.5
  done
  if ! curl -sf "http://127.0.0.1:${WEB_PORT}/" >/dev/null 2>&1; then
    echo "✗ Frontend failed to start. Tail log: tail -f $WEB_LOG"
    exit 1
  fi
  echo "✓ Frontend up"
fi

HEALTH="$(curl -s "http://127.0.0.1:${API_PORT}/api/health")"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Open:  http://127.0.0.1:${WEB_PORT}"
echo "  API:   http://127.0.0.1:${API_PORT}/api/health"
echo "  Script: docs/DEMO_SCRIPT.md"
echo "  Health: $HEALTH"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Press Ctrl+C to stop servers started by this script."
echo "(If ports were already in use, those processes were left running.)"

if [[ -n "${API_PID:-}" ]] || [[ -n "${WEB_PID:-}" ]]; then
  wait
fi
