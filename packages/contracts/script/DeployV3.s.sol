// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "forge-std/Script.sol";
import "../contracts/token/CASTToken.sol";
import "../contracts/token/QuestToken.sol";
import "../contracts/token/GameToken.sol";
import "../contracts/token/CodeToken.sol";
import "../contracts/token/SponsorToken.sol";
import "../contracts/registry/MediaRegistry.sol";
import "../contracts/factory/MediaTokenFactory.sol";
import "../contracts/fees/FeeManagerV3.sol";
import "../contracts/fees/FeeRouter.sol";
import "../contracts/market/MediaMarket.sol";
import "../contracts/market/Marketplace.sol";
import "../contracts/governance/GovernanceV2.sol";

/**
 * @title DeployV3Script
 * @notice Comprehensive deployment script for CastQuest V3 system
 * @dev Deploys all V3 contracts with transparent fee configuration
 */
contract DeployV3Script is Script {
    // Fee configuration (basis points)
    uint256 constant PROTOCOL_FEE_BPS = 250;  // 2.5%
    uint256 constant DEVELOPER_FEE_BPS = 50;   // 0.5%
    uint256 constant TREASURY_FEE_BPS = 200;   // 2.0%
    
    // Governance configuration
    uint256 constant TIMELOCK_DELAY = 48 hours;
    
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        // Get network-specific addresses
        address developerTreasury = getDeveloperTreasury();
        address protocolTreasury = deployer; // Update with multi-sig after deployment
        address daoTreasury = deployer; // Update with DAO treasury after deployment
        
        console.log("=== CastQuest V3 Deployment ===");
        console.log("Network:", getChainName());
        console.log("Chain ID:", block.chainid);
        console.log("Deployer:", deployer);
        console.log("Deployer Balance:", deployer.balance / 1e18, "ETH");
        console.log("Developer Treasury:", developerTreasury);
        console.log("Protocol Treasury:", protocolTreasury);
        console.log("DAO Treasury:", daoTreasury);
        console.log("");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // ===== Phase 1: Deploy Core Tokens =====
        console.log("Phase 1: Deploying Core Tokens...");
        
        CASTToken castToken = new CASTToken(deployer);
        console.log("  CASTToken:", address(castToken));
        
        SponsorToken sponsorToken = new SponsorToken("CastQuest Sponsor", "SPONSOR");
        console.log("  SponsorToken:", address(sponsorToken));
        
        // ===== Phase 2: Deploy Registries =====
        console.log("\nPhase 2: Deploying Registries...");
        
        MediaRegistry registry = new MediaRegistry(deployer);
        console.log("  MediaRegistry:", address(registry));
        
        // ===== Phase 3: Deploy Fee Management =====
        console.log("\nPhase 3: Deploying Fee Management...");
        
        FeeManagerV3 feeManagerV3 = new FeeManagerV3(
            protocolTreasury,
            developerTreasury,
            daoTreasury,
            PROTOCOL_FEE_BPS,
            DEVELOPER_FEE_BPS,
            TREASURY_FEE_BPS
        );
        console.log("  FeeManagerV3:", address(feeManagerV3));
        console.log("    - Protocol Fee: 2.5% ->", protocolTreasury);
        console.log("    - Developer Fee: 0.5% ->", developerTreasury);
        console.log("    - Treasury Fee: 2.0% ->", daoTreasury);
        
        // Legacy fee router for backwards compatibility
        FeeRouter feeRouter = new FeeRouter(address(castToken), protocolTreasury);
        console.log("  FeeRouter (Legacy):", address(feeRouter));
        
        // ===== Phase 4: Deploy Factories =====
        console.log("\nPhase 4: Deploying Factories...");
        
        MediaTokenFactory factory = new MediaTokenFactory(
            address(registry),
            deployer,
            address(feeManagerV3)
        );
        console.log("  MediaTokenFactory:", address(factory));
        
        // ===== Phase 5: Deploy Markets =====
        console.log("\nPhase 5: Deploying Markets...");
        
        MediaMarket mediaMarket = new MediaMarket(deployer, address(feeRouter));
        console.log("  MediaMarket:", address(mediaMarket));
        
        Marketplace marketplace = new Marketplace(address(feeManagerV3));
        console.log("  Marketplace:", address(marketplace));
        
        // ===== Phase 6: Deploy Quest/Game/Code Systems =====
        console.log("\nPhase 6: Deploying Quest/Game/Code Systems...");
        
        QuestToken questToken = new QuestToken(deployer);
        console.log("  QuestToken:", address(questToken));
        
        GameToken gameToken = new GameToken(deployer);
        console.log("  GameToken:", address(gameToken));
        
        CodeToken codeToken = new CodeToken(deployer);
        console.log("  CodeToken:", address(codeToken));
        
        // ===== Phase 7: Deploy Governance =====
        console.log("\nPhase 7: Deploying Governance...");
        
        GovernanceV2 governance = new GovernanceV2(
            address(castToken),
            address(feeManagerV3),
            TIMELOCK_DELAY
        );
        console.log("  GovernanceV2:", address(governance));
        console.log("    - Timelock Delay:", TIMELOCK_DELAY / 1 hours, "hours");
        
        // ===== Phase 8: Configure Permissions =====
        console.log("\nPhase 8: Configuring Permissions...");
        
        // Grant roles to factory
        registry.grantRole(registry.OPERATOR_ROLE(), address(factory));
        console.log("  Granted OPERATOR_ROLE to factory");
        
        // Grant roles to quest/game/code systems
        registry.grantRole(registry.OPERATOR_ROLE(), address(questToken));
        registry.grantRole(registry.OPERATOR_ROLE(), address(gameToken));
        registry.grantRole(registry.OPERATOR_ROLE(), address(codeToken));
        console.log("  Granted OPERATOR_ROLE to quest/game/code systems");
        
        // Grant operator role to marketplace for fee collection
        feeManagerV3.grantRole(feeManagerV3.OPERATOR_ROLE(), address(marketplace));
        feeManagerV3.grantRole(feeManagerV3.OPERATOR_ROLE(), address(factory));
        console.log("  Granted FeeManager OPERATOR_ROLE to marketplace and factory");
        
        // Grant governance role to governance contract
        feeManagerV3.grantRole(feeManagerV3.GOVERNANCE_ROLE(), address(governance));
        console.log("  Granted GOVERNANCE_ROLE to governance contract");
        
        // ===== Phase 9: Initial Setup =====
        console.log("\nPhase 9: Initial Setup...");
        
        // Mint initial CAST supply (10M tokens to deployer)
        castToken.mint(deployer, 10_000_000 ether);
        console.log("  Minted 10M CAST to deployer");
        
        // Mint initial sponsor tokens for testing
        sponsorToken.mint(deployer, 1_000_000 ether);
        console.log("  Minted 1M SPONSOR to deployer");
        
        vm.stopBroadcast();
        
        // ===== Summary =====
        console.log("\n=== Deployment Summary ===");
        console.log("\nCore Tokens:");
        console.log("  CASTToken:", address(castToken));
        console.log("  SponsorToken:", address(sponsorToken));
        
        console.log("\nInfrastructure:");
        console.log("  MediaRegistry:", address(registry));
        console.log("  MediaTokenFactory:", address(factory));
        
        console.log("\nFee Management:");
        console.log("  FeeManagerV3:", address(feeManagerV3));
        console.log("  FeeRouter (Legacy):", address(feeRouter));
        
        console.log("\nMarkets:");
        console.log("  MediaMarket:", address(mediaMarket));
        console.log("  Marketplace:", address(marketplace));
        
        console.log("\nQuest/Game/Code:");
        console.log("  QuestToken:", address(questToken));
        console.log("  GameToken:", address(gameToken));
        console.log("  CodeToken:", address(codeToken));
        
        console.log("\nGovernance:");
        console.log("  GovernanceV2:", address(governance));
        
        console.log("\nFee Configuration:");
        console.log("  Protocol Fee: 2.5% (250 bps) ->", protocolTreasury);
        console.log("  Developer Fee: 0.5% (50 bps) ->", developerTreasury);
        console.log("  Treasury Fee: 2.0% (200 bps) ->", daoTreasury);
        console.log("  Total Trading Fee: 5.0%");
        
        console.log("\n=== Deployment Complete ===");
        console.log("Next Steps:");
        console.log("1. Update protocolTreasury to multi-sig wallet");
        console.log("2. Update daoTreasury to DAO-controlled wallet");
        console.log("3. Verify contracts on block explorer");
        console.log("4. Update frontend with contract addresses");
        console.log("5. Run integration tests");
        
        // Export addresses to JSON for frontend integration
        exportAddresses(
            address(castToken),
            address(sponsorToken),
            address(registry),
            address(factory),
            address(feeManagerV3),
            address(feeRouter),
            address(mediaMarket),
            address(marketplace),
            address(questToken),
            address(gameToken),
            address(codeToken),
            address(governance)
        );
    }
    
    function getDeveloperTreasury() internal view returns (address) {
        uint256 chainId = block.chainid;
        
        // Base mainnet (8453) or Base Sepolia (84532)
        if (chainId == 8453 || chainId == 84532 || chainId == 84531) {
            // In production, resolve solanamobile.base.eth
            // For now, return deployer as placeholder
            return vm.addr(vm.envUint("PRIVATE_KEY"));
        }
        
        // Other EVM chains - resolve monads.skr
        // For now, return deployer as placeholder
        return vm.addr(vm.envUint("PRIVATE_KEY"));
    }
    
    function getChainName() internal view returns (string memory) {
        uint256 chainId = block.chainid;
        if (chainId == 1) return "Ethereum Mainnet";
        if (chainId == 8453) return "Base Mainnet";
        if (chainId == 10) return "Optimism Mainnet";
        if (chainId == 84531) return "Base Goerli";
        if (chainId == 84532) return "Base Sepolia";
        if (chainId == 420) return "Optimism Goerli";
        if (chainId == 11155420) return "Optimism Sepolia";
        if (chainId == 31337) return "Local Anvil";
        return "Unknown Network";
    }
    
    function exportAddresses(
        address castToken,
        address sponsorToken,
        address registry,
        address factory,
        address feeManagerV3,
        address feeRouter,
        address mediaMarket,
        address marketplace,
        address questToken,
        address gameToken,
        address codeToken,
        address governance
    ) internal {
        string memory json = string(abi.encodePacked(
            '{\n',
            '  "network": "', getChainName(), '",\n',
            '  "chainId": ', vm.toString(block.chainid), ',\n',
            '  "timestamp": ', vm.toString(block.timestamp), ',\n',
            '  "contracts": {\n',
            '    "CASTToken": "', vm.toString(castToken), '",\n',
            '    "SponsorToken": "', vm.toString(sponsorToken), '",\n',
            '    "MediaRegistry": "', vm.toString(registry), '",\n',
            '    "MediaTokenFactory": "', vm.toString(factory), '",\n',
            '    "FeeManagerV3": "', vm.toString(feeManagerV3), '",\n',
            '    "FeeRouter": "', vm.toString(feeRouter), '",\n',
            '    "MediaMarket": "', vm.toString(mediaMarket), '",\n',
            '    "Marketplace": "', vm.toString(marketplace), '",\n',
            '    "QuestToken": "', vm.toString(questToken), '",\n',
            '    "GameToken": "', vm.toString(gameToken), '",\n',
            '    "CodeToken": "', vm.toString(codeToken), '",\n',
            '    "GovernanceV2": "', vm.toString(governance), '"\n',
            '  }\n',
            '}'
        ));
        
        string memory filename = string(abi.encodePacked(
            "deployments/",
            vm.toString(block.chainid),
            "-",
            vm.toString(block.timestamp),
            ".json"
        ));
        
        vm.writeFile(filename, json);
        console.log("\nExported deployment addresses to:", filename);
    }
}
