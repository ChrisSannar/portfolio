#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORTFOLIO_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
REACT_WINDOWS_DIR="$(cd "$PORTFOLIO_DIR/../react-windows" && pwd)"
BACKEND_DIR="$(cd "$PORTFOLIO_DIR/../portfolio-server" && pwd)"

PORTFOLIO_REACT_WINDOWS_DIR="$PORTFOLIO_DIR/public/react-windows"
BACKEND_PUBLIC_DIR="$BACKEND_DIR/public"

echo "🔨 Building React Windows for /react-windows"
"$REACT_WINDOWS_DIR/copy-to-portfolio.sh" "$PORTFOLIO_REACT_WINDOWS_DIR"

echo "🔨 Building portfolio for /"
(
	cd "$PORTFOLIO_DIR"
	PUBLIC_URL="${PUBLIC_URL:-/}" \
		npm run build
)

if [ ! -d "$PORTFOLIO_DIR/build" ]; then
	echo "❌ Error: portfolio build directory not found. Build may have failed."
	exit 1
fi

echo "📋 Copying portfolio build to $BACKEND_PUBLIC_DIR"
rm -rf "$BACKEND_PUBLIC_DIR"
mkdir -p "$BACKEND_PUBLIC_DIR"
cp -R "$PORTFOLIO_DIR/build"/. "$BACKEND_PUBLIC_DIR/"

echo "✅ Frontend build synced to backend"
