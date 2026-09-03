#!/bin/bash
# Plesk Git — Additional deployment script
# In Plesk: Git → Repository → Deploy files to a folder named "git"
# (NOT httpdocs), then set additional commands to:
#   bash scripts/plesk-deploy.sh
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

# Plesk Node.js binaries (highest version first)
for node_bin in /opt/plesk/node/24/bin /opt/plesk/node/22/bin /opt/plesk/node/20/bin /opt/plesk/node/18/bin; do
  if [ -d "$node_bin" ]; then
    export PATH="$node_bin:$PATH"
    break
  fi
done

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js not found. In Plesk enable Node.js for this domain, then retry." >&2
  exit 1
fi

echo "Using $(command -v node) ($(node -v))"
echo "Using $(command -v npm) ($(npm -v))"

# Must not use GitHub Pages /1507 prefix on krabilinkstaxi.com
unset GITHUB_PAGES || true
export NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=2048}"

npm install --no-audit --no-fund
npm run build

DEST=""
if [ -d "$REPO_ROOT/../httpdocs" ] && [ "$(basename "$REPO_ROOT")" != "httpdocs" ]; then
  DEST="$(cd "$REPO_ROOT/../httpdocs" && pwd)"
elif [ -n "${HTTPDOCS:-}" ]; then
  DEST="$HTTPDOCS"
fi

if [ -z "$DEST" ]; then
  echo "Could not find ../httpdocs." >&2
  echo "In Plesk Git, deploy the repo to a folder named git (next to httpdocs), not into httpdocs." >&2
  exit 1
fi

if [ "$DEST" = "$REPO_ROOT" ]; then
  echo "Refusing to publish into the Git clone directory (would expose source)." >&2
  exit 1
fi

echo "Publishing $REPO_ROOT/out -> $DEST"
if command -v rsync >/dev/null 2>&1; then
  rsync -a --delete \
    --exclude '.well-known' \
    --exclude 'cgi-bin' \
    --exclude '.git' \
    "$REPO_ROOT/out/" "$DEST/"
else
  # Fallback if rsync is missing
  find "$DEST" -mindepth 1 -maxdepth 1 \
    ! -name '.well-known' \
    ! -name 'cgi-bin' \
    ! -name '.git' \
    -exec rm -rf {} +
  cp -a "$REPO_ROOT/out/." "$DEST/"
fi

echo "Plesk deploy finished."
