#!/usr/bin/env bash
# =============================================================================
# deploy/update.sh
#
# Pull latest code and restart the backend service.
# Run this every time you push a new version to your VPS.
#
# Usage (from your VPS):
#   cd ~/portfolio && bash deploy/update.sh
# =============================================================================

set -euo pipefail

APP_DIR="$HOME/portfolio"
BACKEND_DIR="$APP_DIR/backend"
VENV_DIR="$BACKEND_DIR/venv"
SERVICE_NAME="portfolio-api"

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'
log()  { echo -e "${GREEN}[UPDATE]${NC} $*"; }
warn() { echo -e "${YELLOW}[WARN]${NC}  $*"; }

log "Pulling latest code..."
cd "$APP_DIR"
git pull origin main

log "Updating Python dependencies..."
source "$VENV_DIR/bin/activate"
pip install --quiet -r "$BACKEND_DIR/requirements.txt"

log "Restarting service..."
sudo systemctl restart "$SERVICE_NAME"

sleep 2
if sudo systemctl is-active --quiet "$SERVICE_NAME"; then
    log "Service restarted successfully."
    curl -sf http://127.0.0.1:8000/api/health | python3 -m json.tool || warn "Health check failed — check logs."
else
    warn "Service failed to restart. Logs:"
    sudo journalctl -u "$SERVICE_NAME" -n 30 --no-pager
fi
