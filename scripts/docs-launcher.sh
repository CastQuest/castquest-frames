#!/bin/bash
# CastQuest Documentation Tooling Setup and Launcher
# This script sets up and runs the complete documentation system

set -e

echo "🚀 CastQuest Documentation Tooling"
echo "===================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Must be run from the workspace root"
    exit 1
fi

# Function to print status
print_status() {
    echo -e "${BLUE}==>${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Check dependencies
print_status "Checking dependencies..."

if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm not found. Please install: npm install -g pnpm"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

print_success "Dependencies OK"

# Install packages
print_status "Installing workspace dependencies..."
pnpm install --no-frozen-lockfile || {
    print_warning "Installation encountered issues, but continuing..."
}

# Check if docs-site exists
if [ ! -d "docs-site" ]; then
    echo "❌ docs-site directory not found"
    exit 1
fi

print_success "Workspace configured"

# Build SDK docs
print_status "Generating SDK documentation..."
if pnpm --filter @castquest/sdk docs 2>/dev/null; then
    print_success "SDK docs generated"
else
    print_warning "SDK docs generation skipped (TypeDoc may need installation)"
fi

# Menu
echo ""
echo "What would you like to do?"
echo ""
echo "1) Start documentation dev server (VitePress)"
echo "2) Build documentation for production"
echo "3) Generate API docs from OpenAPI spec"
echo "4) Generate SDK docs with TypeDoc"
echo "5) Preview production build"
echo "6) Run all generators + build"
echo "7) Start admin dashboard (for OpenAPI endpoint)"
echo "0) Exit"
echo ""

read -p "Select an option: " choice

case $choice in
    1)
        print_status "Starting VitePress dev server..."
        pnpm docs:dev
        ;;
    2)
        print_status "Building documentation..."
        pnpm docs:build
        print_success "Build complete! Files in docs-site/.vitepress/dist"
        ;;
    3)
        print_status "Generating API documentation..."
        print_warning "Make sure the admin dashboard is running on port 3010"
        read -p "Is the admin dashboard running? (y/n) " dashboard_running
        if [ "$dashboard_running" = "y" ]; then
            pnpm docs:api
            print_success "API docs generated"
        else
            echo "Start the dashboard with: pnpm --filter ./apps/admin dev -- -p 3010"
        fi
        ;;
    4)
        print_status "Generating SDK documentation..."
        pnpm docs:sdk
        print_success "SDK docs generated"
        ;;
    5)
        print_status "Starting preview server..."
        pnpm docs:preview
        ;;
    6)
        print_status "Running complete documentation generation..."
        pnpm docs:sdk
        print_warning "For API docs, start admin dashboard first: pnpm --filter ./apps/admin dev -- -p 3010"
        pnpm docs:build
        print_success "Complete! Ready to preview with: pnpm docs:preview"
        ;;
    7)
        print_status "Starting admin dashboard..."
        pnpm --filter ./apps/admin dev -- -p 3010
        ;;
    0)
        echo "Goodbye!"
        exit 0
        ;;
    *)
        echo "Invalid option"
        exit 1
        ;;
esac
