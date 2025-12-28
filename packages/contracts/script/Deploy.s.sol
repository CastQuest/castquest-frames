// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "forge-std/Script.sol";
import "../contracts/token/CASTToken.sol";
import "../contracts/registry/MediaRegistry.sol";
import "../contracts/factory/MediaTokenFactory.sol";
import "../contracts/fees/FeeRouter.sol";
import "../contracts/market/MediaMarket.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Deploying contracts with account:", deployer);
        console.log("Account balance:", deployer.balance);
        
        vm.startBroadcast(deployerPrivateKey);
        
        // 1. Deploy CAST token
        CASTToken castToken = new CASTToken(deployer);
        console.log("CASTToken deployed at:", address(castToken));
        
        // 2. Deploy MediaRegistry
        MediaRegistry registry = new MediaRegistry(deployer);
        console.log("MediaRegistry deployed at:", address(registry));
        
        // 3. Deploy FeeRouter
        FeeRouter feeRouter = new FeeRouter(deployer, deployer); // Use deployer as treasury initially
        console.log("FeeRouter deployed at:", address(feeRouter));
        
        // 4. Deploy MediaTokenFactory
        MediaTokenFactory factory = new MediaTokenFactory(
            address(registry),
            deployer,
            deployer // Use deployer as fee recipient initially
        );
        console.log("MediaTokenFactory deployed at:", address(factory));
        
        // Grant operator role to factory
        registry.grantRole(registry.OPERATOR_ROLE(), address(factory));
        console.log("Granted OPERATOR_ROLE to factory");
        
        // 5. Deploy MediaMarket
        MediaMarket market = new MediaMarket(deployer, address(feeRouter));
        console.log("MediaMarket deployed at:", address(market));
        
        // 6. Initial CAST mint (10M tokens to deployer)
        castToken.mint(deployer, 10_000_000 ether);
        console.log("Minted 10M CAST to deployer");
        
        vm.stopBroadcast();
        
        console.log("\n=== Deployment Complete ===");
        console.log("CASTToken:", address(castToken));
        console.log("MediaRegistry:", address(registry));
        console.log("FeeRouter:", address(feeRouter));
        console.log("MediaTokenFactory:", address(factory));
        console.log("MediaMarket:", address(market));
    }
}
