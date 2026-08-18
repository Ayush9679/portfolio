#!/usr/bin/env bash
# =============================================================================
# deploy/setup_vps.sh
#
# One-time VPS setup script for the FastAPI backend.
# Tested on Ubuntu 22.04 LTS.
#
# Usage:
#   ssh your-vps
#   git clone https://github.com/YOUR_USERNAME/cinematic-portfolio.git ~/portfolio
#   cd ~/portfolio
#   bash deploy/setup_vps.sh
# =============================================================================

set -euo pipefail

# ── Configuration ─────────────────────────────────────────────────────────────
APP_DIR="$HOME/portfolio/backend"
VENV_DIR="$APP_DIR/venv"
DATA_DIR="$APP_DIR/data"
SERVICE_NAME="portfolio-api"
NGINX_SITE="portfolio"
BACKEND_PORT=8000
DOMAIN=""   # Leave empty to skip SSL; set to your domain for Certbot

# ── Colors ────────────────────────────────────────────────────────────────────
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
log()  { echo -e "${GREEN}[SETUP]${NC} $*"; }
warn() { echo -e "${YELLOW}[WARN]${NC}  $*"; }
err()  { echo -e "${RED}[ERROR]${NC} $*"; exit 1; }

# ── Pre-flight ────────────────────────────────────────────────────────────────
[[ -d "$APP_DIR" ]] || err "Backend directory not found: $APP_DIR"
[[ -f "$APP_DIR/.env" ]] || err ".env not found. Copy backend/.env.example to backend/.env and fill in values first."

log "Installing system dependencies..."
sudo apt-get update -qq
sudo apt-get install -y -qq python3 python3-venv python3-pip nginx

# ── Python virtual environment ────────────────────────────────────────────────
log "Creating Python virtual environment..."
python3 -m venv "$VENV_DIR"
source "$VENV_DIR/bin/activate"

log "Installing Python dependencies..."
pip install --quiet --upgrade pip
pip install --quiet -r "$APP_DIR/requirements.txt"

# ── Data directory ────────────────────────────────────────────────────────────
log "Creating SQLite data directory..."
mkdir -p "$DATA_DIR"
chmod 750 "$DATA_DIR"

# ── systemd service ───────────────────────────────────────────────────────────
log "Installing systemd service: $SERVICE_NAME..."
sudo tee /etc/systemd/system/${SERVICE_NAME}.service > /dev/null << EOF
[Unit]
Description=Portfolio FastAPI Backend
After=network.target

[Service]
User=$USER
WorkingDirectory=$APP_DIR
EnvironmentFile=$APP_DIR/.env
ExecStart=$VENV_DIR/bin/gunicorn app.main:app \\
    --worker-class uvicorn.workers.UvicornWorker \\
    --workers 2 \\
    --bind 127.0.0.1:${BACKEND_PORT} \\
    --timeout 30 \\
    --access-logfile - \\
    --error-logfile -
Restart=always
RestartSec=3
StandardOutput=journal
StandardError=journal
SyslogIdentifier=$SERVICE_NAME

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable "$SERVICE_NAME"
sudo systemctl restart "$SERVICE_NAME"

# ── Nginx ─────────────────────────────────────────────────────────────────────
log "Configuring Nginx..."
sudo tee /etc/nginx/sites-available/${NGINX_SITE} > /dev/null << 'EOF'
server {
    listen 80;
    server_name _;          # Replace _ with your domain name

    # Security headers
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy strict-origin-when-cross-origin;

    # Proxy to FastAPI backend
    location / {
        proxy_pass         http://127.0.0.1:8000;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_read_timeout 30s;
        proxy_connect_timeout 10s;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/${NGINX_SITE} /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# ── SSL (optional) ────────────────────────────────────────────────────────────
if [[ -n "$DOMAIN" ]]; then
    log "Setting up SSL with Certbot for domain: $DOMAIN"
    sudo apt-get install -y -qq certbot python3-certbot-nginx
    sudo certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos --email "admin@$DOMAIN"
fi

# ── Status check ─────────────────────────────────────────────────────────────
log "Checking service status..."
sleep 2
if sudo systemctl is-active --quiet "$SERVICE_NAME"; then
    log "Backend service is RUNNING."
else
    warn "Backend service is NOT running. Check logs:"
    echo "  sudo journalctl -u $SERVICE_NAME -n 50 --no-pager"
fi

echo ""
log "Setup complete!"
echo ""
echo "  Backend API:   http://YOUR_VPS_IP/"
echo "  Health check:  curl http://YOUR_VPS_IP/api/health"
echo ""
echo "  Useful commands:"
echo "    sudo systemctl status $SERVICE_NAME"
echo "    sudo journalctl -u $SERVICE_NAME -f"
echo "    sudo systemctl restart $SERVICE_NAME"
