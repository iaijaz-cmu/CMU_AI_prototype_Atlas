#!/usr/bin/env bash
# Pre-flight for recording Atlas demo — does not start servers (use demo.sh for that).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
API_PORT="${ATLAS_API_PORT:-8787}"
WEB_PORT="${ATLAS_WEB_PORT:-5173}"

echo "== Atlas record prep =="
echo ""

if [[ ! -f "$ROOT/api/.env" ]]; then
  echo "⚠️  Missing api/.env — copy from .env.example and set OPENAI_API_KEY"
  exit 1
fi

if ! curl -sf "http://127.0.0.1:${API_PORT}/api/health" >/dev/null 2>&1; then
  echo "⚠️  API not reachable on :${API_PORT}. Run: ./scripts/demo.sh"
  exit 1
fi

if ! curl -sf "http://127.0.0.1:${WEB_PORT}/" >/dev/null 2>&1; then
  echo "⚠️  Frontend not reachable on :${WEB_PORT}. Run: ./scripts/demo.sh"
  exit 1
fi

HEALTH="$(curl -s "http://127.0.0.1:${API_PORT}/api/health")"
echo "✓ API health: $HEALTH"
echo "✓ Frontend: http://127.0.0.1:${WEB_PORT}"
echo ""
echo "Recording checklist:"
echo "  • Use incognito → http://127.0.0.1:${WEB_PORT} (clean chat threads)"
echo "  • Script: docs/RECORDED_DEMO.md"
echo "  • Zoom 100%, hide bookmarks, Do Not Disturb on"
echo "  • Do not open api/.env on screen"
echo ""
echo "Open script:"
echo "  open \"$ROOT/docs/RECORDED_DEMO.md\" 2>/dev/null || echo \"  $ROOT/docs/RECORDED_DEMO.md\""
