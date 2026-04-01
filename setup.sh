#!/usr/bin/env bash
set -euo pipefail

echo "🔧 Starting Next.js environment setup for Google Jules..."

###############################################
# 1. Ensure we're in the repo root (/app)
###############################################
cd /app
echo "📁 Working directory: $(pwd)"

###############################################
# 2. Verify Node.js is available
###############################################
if ! command -v node >/dev/null 2>&1; then
  echo "❌ Node.js is not installed in this environment."
  exit 1
fi

echo "🟢 Node version: $(node -v)"
echo "🟢 NPM version:  $(npm -v)"

###############################################
# 3. Install Node dependencies
###############################################
if [ -f "package.json" ]; then
  echo "📦 Installing Node dependencies..."
  npm install --legacy-peer-deps || npm install
else
  echo "⚠️ No package.json found — skipping Node install."
fi

###############################################
# 4. Validate required environment variables
###############################################
REQUIRED_VARS=(
  "NEXT_PUBLIC_API_URL"
  "GOOGLE_API_KEY"
  "GOOGLE_PROJECT_ID"
)

echo "🔍 Validating required environment variables..."
for VAR in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!VAR:-}" ]; then
    echo "❌ Missing required environment variable: $VAR"
    exit 1
  fi
done
echo "✅ Environment variables validated."

###############################################
# 5. Build the Next.js project (optional but recommended)
###############################################
if [ -f "next.config.js" ] || [ -d "app" ] || [ -d "pages" ]; then
  echo "🏗️ Building Next.js project..."
  npm run build || {
    echo "⚠️ Next.js build failed — continuing anyway."
  }
else
  echo "⚠️ No Next.js config detected — skipping build."
fi

###############################################
# 6. Prepare directories for Jules (if needed)
###############################################
mkdir -p gitlab/duo/agents
mkdir -p gitlab/duo/flows
mkdir -p gitlab/duo/tools

echo "📁 Jules directory structure ready."

###############################################
# 7. Finalize
###############################################
echo "✨ Setup complete. Environment ready for snapshotting."
