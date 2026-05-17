#!/bin/bash
# Crawler simulation — hits the metadata proxy with a Twitterbot User-Agent
# and prints the meta tags it returns.
#
# Usage:
#   ./scripts/test-meta.sh <route> [target]
#
# Targets:
#   (omitted)   → http://localhost:3000   — needs `vercel dev` + a built `dist/`
#   live        → https://another-creation.xyz
#   https://…   → any URL (Vercel preview deploys, staging, etc.)
#
# Examples:
#   ./scripts/test-meta.sh /shop
#   ./scripts/test-meta.sh /blog/some-article live
#   ./scripts/test-meta.sh /handmade https://kol-client-acyr-website-git-meta.vercel.app

URL=$1
TARGET=${2:-local}

if [ -z "$URL" ]; then
  echo "Usage: $0 <route> [local|live|https://...]"
  exit 1
fi

case "$TARGET" in
  local)
    BASE="http://localhost:3000"
    ;;
  live)
    BASE="https://another-creation.xyz"
    ;;
  http://*|https://*)
    BASE="${TARGET%/}"   # strip trailing slash if any
    ;;
  *)
    echo "Unknown target: $TARGET"
    echo "Pass 'live', a full https:// URL, or omit for localhost."
    exit 1
    ;;
esac

echo "→ Crawler simulation: ${BASE}${URL}"
echo

curl -s -A "Twitterbot" -L "${BASE}${URL}" \
  | grep -E 'og:|twitter:|<title|name="description"|name="robots"|rel="canonical"'
