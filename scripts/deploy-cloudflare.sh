#!/usr/bin/env bash
# ============================================================
# Deploy SHŠ Heretik na Cloudflare Pages (přímý upload přes wrangler)
#
# Varianta A (doporučená): Git integrace v dashboardu Cloudflare
#   → Pages → Create project → Connect to Git → heretik-web-scena
#   Build command:  npm run build
#   Build output:   dist
#   (CF_PAGES=1 nastaví Cloudflare sám, build jde na kořen domény)
#   → auto-deploy při každém pushi na main
#
# Varianta B (tento skript): ruční upload
#   Před prvním použitím:  npx wrangler login   (OAuth v prohlížeči)
#   Pak stačí:             ./scripts/deploy-cloudflare.sh
# ============================================================
set -euo pipefail
cd "$(dirname "$0")/.."

echo "── 1/2 Build (CF_PAGES=1 → cesty na kořeni domény) ──"
CF_PAGES=1 npm run build

echo "── 2/2 Upload na Cloudflare Pages ──"
if ! npx wrangler pages project list 2>/dev/null | grep -q "heretik-web-scena"; then
  echo "Projekt neexistuje — vytvářím (production branch: main)..."
  npx wrangler pages project create heretik-web-scena --production-branch main
fi
npx wrangler pages deploy dist --project-name=heretik-web-scena
echo "✅ Hotovo — web je na <projekt>.pages.dev (nebo vlastní doméně)"
