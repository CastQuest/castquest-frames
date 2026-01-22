#!/bin/bash
# Deploy CastQuest V3 to Testnets
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "🚀 CastQuest V3 Testnet Deployment"
echo "===================================="
echo ""

# Check for required environment variables
if [ -z "${PRIVATE_KEY:-}" ]; then
    echo "❌ Error: PRIVATE_KEY environment variable not set"
    echo "Please set your deployer private key:"
    echo "export PRIVATE_KEY=0x..."
    exit 1
fi

# Change to contracts directory
cd "$ROOT_DIR/packages/contracts"

# Function to deploy to a network
deploy_to_network() {
    local network=$1
    local rpc_url_var=$2
    local etherscan_key_var=$3
    
    echo "📡 Deploying to $network..."
    echo ""
    
    # Check if RPC URL is set
    if [ -z "${!rpc_url_var:-}" ]; then
        echo "⚠️  Warning: $rpc_url_var not set, skipping $network"
        echo ""
        return 0
    fi
    
    # Run deployment
    forge script script/DeployV3.s.sol \
        --rpc-url "${!rpc_url_var}" \
        --broadcast \
        --verify \
        --etherscan-api-key "${!etherscan_key_var:-}" \
        -vvv || {
            echo "❌ Deployment to $network failed"
            return 1
        }
    
    echo "✅ Deployment to $network complete"
    echo ""
}

# Deploy to Base Sepolia (recommended testnet)
if [ -n "${BASE_SEPOLIA_RPC_URL:-}" ]; then
    deploy_to_network "Base Sepolia" "BASE_SEPOLIA_RPC_URL" "BASESCAN_API_KEY"
fi

# Deploy to Base Goerli (legacy testnet)
if [ -n "${BASE_GOERLI_RPC_URL:-}" ]; then
    deploy_to_network "Base Goerli" "BASE_GOERLI_RPC_URL" "BASESCAN_API_KEY"
fi

# Deploy to Optimism Sepolia
if [ -n "${OPTIMISM_SEPOLIA_RPC_URL:-}" ]; then
    deploy_to_network "Optimism Sepolia" "OPTIMISM_SEPOLIA_RPC_URL" "OPTIMISM_ETHERSCAN_API_KEY"
fi

# Deploy to Optimism Goerli (legacy testnet)
if [ -n "${OPTIMISM_GOERLI_RPC_URL:-}" ]; then
    deploy_to_network "Optimism Goerli" "OPTIMISM_GOERLI_RPC_URL" "OPTIMISM_ETHERSCAN_API_KEY"
fi

echo "🎉 Testnet Deployment Complete!"
echo ""
echo "Next Steps:"
echo "1. Check deployment addresses in the output above"
echo "2. Verify contracts on block explorers"
echo "3. Update frontend with new addresses"
echo "4. Run integration tests"
echo "5. Test on testnets before mainnet deployment"
echo ""
echo "Deployment artifacts saved in:"
echo "  packages/contracts/broadcast/"
echo "  packages/contracts/deployments/"
