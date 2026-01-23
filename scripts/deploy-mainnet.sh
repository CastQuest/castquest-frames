#!/bin/bash
# Deploy CastQuest V3 to Mainnet
# WARNING: This deploys to production networks with real funds
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "🚨 CastQuest V3 MAINNET Deployment"
echo "===================================="
echo ""
echo "⚠️  WARNING: You are about to deploy to MAINNET!"
echo "⚠️  This will use REAL FUNDS and deploy PRODUCTION contracts."
echo ""
echo "Please confirm the following:"
echo "1. You have tested on testnets"
echo "2. All contracts have been audited"
echo "3. You have sufficient ETH for gas fees"
echo "4. You have backed up your deployment keys"
echo "5. The team has reviewed the deployment plan"
echo ""

# Require explicit confirmation
read -p "Type 'DEPLOY TO MAINNET' to continue: " confirmation
if [ "$confirmation" != "DEPLOY TO MAINNET" ]; then
    echo "❌ Deployment cancelled"
    exit 1
fi

echo ""
echo "Starting mainnet deployment in 10 seconds..."
echo "Press Ctrl+C to cancel"
sleep 10

# Check for required environment variables
if [ -z "${PRIVATE_KEY:-}" ]; then
    echo "❌ Error: PRIVATE_KEY environment variable not set"
    exit 1
fi

# Change to contracts directory
cd "$ROOT_DIR/packages/contracts"

# Function to deploy to a network
deploy_to_network() {
    local network=$1
    local rpc_url_var=$2
    local etherscan_key_var=$3
    
    echo ""
    echo "📡 Deploying to $network..."
    echo "===================================="
    echo ""
    
    # Check if RPC URL is set
    if [ -z "${!rpc_url_var:-}" ]; then
        echo "⚠️  Warning: $rpc_url_var not set, skipping $network"
        return 0
    fi
    
    # Final confirmation for this network
    read -p "Deploy to $network? (yes/no): " network_confirm
    if [ "$network_confirm" != "yes" ]; then
        echo "⏭️  Skipping $network"
        return 0
    fi
    
    # Run deployment
    forge script script/DeployV3.s.sol \
        --rpc-url "${!rpc_url_var}" \
        --broadcast \
        --verify \
        --etherscan-api-key "${!etherscan_key_var:-}" \
        --slow \
        -vvv || {
            echo "❌ Deployment to $network failed"
            read -p "Continue with other networks? (yes/no): " continue_confirm
            if [ "$continue_confirm" != "yes" ]; then
                exit 1
            fi
            return 1
        }
    
    echo "✅ Deployment to $network complete"
    echo ""
    
    # Save deployment info
    local timestamp=$(date +%s)
    local deployment_file="deployments/${network}-${timestamp}.json"
    echo "📝 Saving deployment to $deployment_file"
    
    # Wait for user to verify
    echo ""
    echo "⏸️  Please verify the deployment on block explorer before continuing"
    read -p "Press Enter when verified..."
    echo ""
}

# Deploy to Base Mainnet
if [ -n "${BASE_RPC_URL:-}" ]; then
    deploy_to_network "Base Mainnet" "BASE_RPC_URL" "BASESCAN_API_KEY"
fi

# Deploy to Optimism Mainnet
if [ -n "${OPTIMISM_RPC_URL:-}" ]; then
    deploy_to_network "Optimism Mainnet" "OPTIMISM_RPC_URL" "OPTIMISM_ETHERSCAN_API_KEY"
fi

# Deploy to Ethereum Mainnet (if needed)
if [ -n "${MAINNET_RPC_URL:-}" ]; then
    echo ""
    echo "⚠️  Ethereum mainnet deployment is expensive!"
    read -p "Deploy to Ethereum Mainnet? (yes/no): " eth_confirm
    if [ "$eth_confirm" == "yes" ]; then
        deploy_to_network "Ethereum Mainnet" "MAINNET_RPC_URL" "ETHERSCAN_API_KEY"
    fi
fi

echo ""
echo "🎉 Mainnet Deployment Complete!"
echo "===================================="
echo ""
echo "✅ Critical Next Steps:"
echo "1. ✅ Verify all contracts on block explorers"
echo "2. ✅ Update protocolTreasury to multi-sig wallet"
echo "3. ✅ Update daoTreasury to DAO-controlled wallet"
echo "4. ✅ Transfer admin roles to appropriate addresses"
echo "5. ✅ Update frontend with new contract addresses"
echo "6. ✅ Run smoke tests on mainnet"
echo "7. ✅ Announce deployment to community"
echo "8. ✅ Monitor for any issues in first 24 hours"
echo ""
echo "📁 Deployment artifacts saved in:"
echo "  packages/contracts/broadcast/"
echo "  packages/contracts/deployments/"
echo ""
echo "📚 Documentation:"
echo "  docs/FEE_STRUCTURE.md - Fee structure details"
echo "  docs/DEPLOYMENT_GUIDE_V3.md - V3 deployment guide"
echo ""
echo "🔒 Security Reminders:"
echo "  - Revoke deployer privileges after setup"
echo "  - Enable 2FA on all admin accounts"
echo "  - Set up monitoring and alerts"
echo "  - Schedule security audit if not done"
