#!/bin/bash

# 🏆 CastQuest Hackathon 2026 - Deployment Script
# This script deploys the supercharged system for Hackathon 2026

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT"

echo "🏆 CastQuest Hackathon 2026 - Deployment"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored status
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running in production mode
ENVIRONMENT=${ENVIRONMENT:-"development"}
print_status "Deploying in $ENVIRONMENT mode"

# 1. Verify dependencies
print_status "Verifying dependencies..."
if ! command -v pnpm &> /dev/null; then
    print_error "pnpm not found. Install with: npm install -g pnpm"
    exit 1
fi

if ! command -v node &> /dev/null; then
    print_error "Node.js not found. Please install Node.js 18+"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js 18+ required. Current version: $(node -v)"
    exit 1
fi

print_success "Dependencies verified"

# 2. Install packages
print_status "Installing packages..."
pnpm install --frozen-lockfile
print_success "Packages installed"

# 3. Build packages
print_status "Building packages..."
pnpm build || print_warning "Some packages may not have build scripts"
print_success "Packages built"

# 4. Check environment configuration
print_status "Checking environment configuration..."
if [ ! -f ".env" ]; then
    print_warning ".env file not found. Creating from example..."
    cat > .env << 'EOF'
# Oracle Database Configuration
ORACLE_HOST=localhost
ORACLE_PORT=1521
ORACLE_DATABASE=castquest
ORACLE_USER=admin
ORACLE_PASSWORD=changeme

# Smart Brain Configuration
BRAIN_PARALLEL_WORKERS=4
BRAIN_DEEP_THINKING=true
BRAIN_ORACLE_OPTIMIZED=true

# Worker System Configuration
MAX_PARALLEL_WORKERS=5
WORKER_SCHEDULING_ENABLED=true

# Dashboard Configuration
DASHBOARD_REFRESH_INTERVAL=5000
NEXT_PUBLIC_API_URL=http://localhost:3010

# JWT Secret (CHANGE IN PRODUCTION!)
JWT_SECRET=hackathon_2026_secret_key_change_me

# Admin Credentials (CHANGE IN PRODUCTION!)
ADMIN_EMAIL=admin@castquest.xyz
ADMIN_PASSWORD=admin123
EOF
    print_warning "Please update .env with your actual configuration!"
fi
print_success "Environment configuration ready"

# 5. Initialize Oracle Database (if available)
print_status "Checking Oracle database..."
if command -v sqlplus &> /dev/null; then
    print_status "Oracle client found. You can initialize the database with:"
    print_status "  sqlplus $ORACLE_USER/$ORACLE_PASSWORD@$ORACLE_HOST:$ORACLE_PORT/$ORACLE_DATABASE < scripts/init-oracle.sql"
else
    print_warning "Oracle client not found. Database initialization skipped."
    print_warning "Install Oracle Instant Client for Oracle integration"
fi

# 6. Create necessary directories
print_status "Creating necessary directories..."
mkdir -p logs
mkdir -p data/backups
mkdir -p data/uploads
print_success "Directories created"

# 7. Initialize permissions
print_status "Initializing permissions system..."
cat > data/default-permissions.json << 'EOF'
{
  "roles": [
    {
      "id": "super_admin",
      "name": "Super Administrator",
      "permissions": ["system.admin"]
    },
    {
      "id": "operator",
      "name": "Operator",
      "permissions": [
        "frames.read", "frames.write",
        "quests.read", "quests.write",
        "mints.read", "mints.write",
        "workers.read", "workers.control",
        "brain.read", "brain.control",
        "dashboard.read", "dashboard.admin"
      ]
    },
    {
      "id": "developer",
      "name": "Developer",
      "permissions": [
        "frames.read", "frames.write",
        "quests.read", "quests.write",
        "workers.read",
        "brain.read",
        "dashboard.read"
      ]
    },
    {
      "id": "viewer",
      "name": "Viewer",
      "permissions": [
        "frames.read",
        "quests.read",
        "mints.read",
        "workers.read",
        "brain.read",
        "dashboard.read"
      ]
    }
  ],
  "users": [
    {
      "id": "admin",
      "username": "admin",
      "email": "admin@castquest.xyz",
      "roles": ["super_admin"]
    }
  ]
}
EOF
print_success "Default permissions initialized"

# 8. Start the system
print_status "Starting CastQuest Hackathon 2026 System..."
echo ""
print_status "🚀 System starting in $ENVIRONMENT mode..."
echo ""

if [ "$ENVIRONMENT" = "production" ]; then
    # Production mode
    print_status "Starting production servers..."
    pnpm --filter ./apps/admin build
    pnpm --filter ./apps/web build
    
    # Start with PM2 if available
    if command -v pm2 &> /dev/null; then
        print_status "Using PM2 for process management..."
        pm2 start ecosystem.config.js
        print_success "Servers started with PM2"
        print_status "Monitor with: pm2 monit"
        print_status "Logs: pm2 logs"
    else
        print_warning "PM2 not found. Starting manually..."
        print_status "Install PM2 with: npm install -g pm2"
        pnpm --filter ./apps/admin start &
        pnpm --filter ./apps/web start &
    fi
else
    # Development mode
    print_status "Starting development servers..."
    print_status "Admin Dashboard: http://localhost:3010/dashboard"
    print_status "Web App: http://localhost:3000"
    print_status ""
    print_status "Press Ctrl+C to stop"
    pnpm --filter ./apps/admin dev -- -p 3010 &
    ADMIN_PID=$!
    pnpm --filter ./apps/web dev &
    WEB_PID=$!
    
    # Wait for both processes
    wait $ADMIN_PID $WEB_PID
fi

echo ""
print_success "🏆 CastQuest Hackathon 2026 System Deployed!"
echo ""
print_status "📊 Access Points:"
print_status "  Dashboard: http://localhost:3010/dashboard"
print_status "  API: http://localhost:3010/api"
print_status "  Web: http://localhost:3000"
echo ""
print_status "📚 Documentation:"
print_status "  Hackathon Guide: docs/hackathon-2026-supercharged.md"
print_status "  API Docs: http://localhost:3010/api/openapi"
echo ""
print_status "🔧 Management:"
print_status "  Health: http://localhost:3010/api/status"
print_status "  Oracle Stats: http://localhost:3010/api/oracle/stats"
print_status "  Brain Deep Think: POST http://localhost:3010/api/brain/deep-think"
echo ""
print_success "System ready for Hackathon 2026! 🚀"
