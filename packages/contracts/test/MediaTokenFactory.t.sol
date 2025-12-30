// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "forge-std/Test.sol";
import "../contracts/factory/MediaTokenFactory.sol";
import "../contracts/registry/MediaRegistry.sol";
import "../contracts/token/MediaToken.sol";

contract MediaTokenFactoryTest is Test {
    MediaTokenFactory public factory;
    MediaRegistry public registry;
    
    address public owner = address(this);
    address public feeRecipient = address(0x123);
    address public creator = address(0x456);
    
    event MediaTokenCreated(
        string indexed mediaId,
        address indexed token,
        address indexed owner,
        string symbol,
        uint256 totalSupply,
        string metadataURI
    );

    function setUp() public {
        registry = new MediaRegistry(owner);
        registry.grantRole(registry.OPERATOR_ROLE(), address(factory));
        
        factory = new MediaTokenFactory(address(registry), owner, feeRecipient);
        
        // Grant operator role to factory
        registry.grantRole(registry.OPERATOR_ROLE(), address(factory));
        
        vm.deal(creator, 10 ether);
    }

    function testCreateMediaToken() public {
        MediaTokenFactory.CreateMediaTokenConfig memory config = MediaTokenFactory.CreateMediaTokenConfig({
            name: "Test Picture",
            symbol: "PIC",
            mediaId: "test-media-1",
            metadataURI: "ipfs://QmTest",
            owner: creator,
            totalSupply: 10_000_000 ether
        });
        
        vm.prank(creator);
        address tokenAddress = factory.createMediaToken{value: 0.001 ether}(config);
        
        MediaToken token = MediaToken(tokenAddress);
        assertEq(token.name(), "Test Picture");
        assertEq(token.symbol(), "PIC");
        assertEq(token.totalSupply(), 10_000_000 ether);
        assertEq(token.balanceOf(creator), 10_000_000 ether);
        assertEq(token.mediaId(), "test-media-1");
        assertEq(token.metadataURI(), "ipfs://QmTest");
    }

    function testCreateWithDefaultSupply() public {
        MediaTokenFactory.CreateMediaTokenConfig memory config = MediaTokenFactory.CreateMediaTokenConfig({
            name: "Test Video",
            symbol: "VID",
            mediaId: "test-video-1",
            metadataURI: "ipfs://QmVideo",
            owner: creator,
            totalSupply: 0 // Will use default
        });
        
        vm.prank(creator);
        address tokenAddress = factory.createMediaToken{value: 0.001 ether}(config);
        
        MediaToken token = MediaToken(tokenAddress);
        assertEq(token.totalSupply(), factory.DEFAULT_SUPPLY());
    }

    function testCreateFailsWithInsufficientFee() public {
        MediaTokenFactory.CreateMediaTokenConfig memory config = MediaTokenFactory.CreateMediaTokenConfig({
            name: "Test",
            symbol: "TST",
            mediaId: "test-1",
            metadataURI: "ipfs://test",
            owner: creator,
            totalSupply: 10_000_000 ether
        });
        
        vm.prank(creator);
        vm.expectRevert("MediaTokenFactory: insufficient fee");
        factory.createMediaToken{value: 0.0005 ether}(config);
    }

    function testCreateFailsWithInvalidSupply() public {
        MediaTokenFactory.CreateMediaTokenConfig memory config = MediaTokenFactory.CreateMediaTokenConfig({
            name: "Test",
            symbol: "TST",
            mediaId: "test-1",
            metadataURI: "ipfs://test",
            owner: creator,
            totalSupply: 500 ether // Below minimum
        });
        
        vm.prank(creator);
        vm.expectRevert("MediaTokenFactory: invalid supply");
        factory.createMediaToken{value: 0.001 ether}(config);
    }

    function testCreateFailsWhenPaused() public {
        factory.pause();
        
        MediaTokenFactory.CreateMediaTokenConfig memory config = MediaTokenFactory.CreateMediaTokenConfig({
            name: "Test",
            symbol: "TST",
            mediaId: "test-1",
            metadataURI: "ipfs://test",
            owner: creator,
            totalSupply: 10_000_000 ether
        });
        
        vm.prank(creator);
        vm.expectRevert();
        factory.createMediaToken{value: 0.001 ether}(config);
    }

    function testSetCreationFee() public {
        uint256 newFee = 0.002 ether;
        factory.setCreationFee(newFee);
        assertEq(factory.creationFee(), newFee);
    }

    function testSetFeeRecipient() public {
        address newRecipient = address(0x789);
        factory.setFeeRecipient(newRecipient);
        assertEq(factory.feeRecipient(), newRecipient);
    }

    function testFeeCollection() public {
        uint256 initialBalance = feeRecipient.balance;
        
        MediaTokenFactory.CreateMediaTokenConfig memory config = MediaTokenFactory.CreateMediaTokenConfig({
            name: "Test",
            symbol: "TST",
            mediaId: "test-1",
            metadataURI: "ipfs://test",
            owner: creator,
            totalSupply: 10_000_000 ether
        });
        
        vm.prank(creator);
        factory.createMediaToken{value: 0.001 ether}(config);
        
        assertEq(feeRecipient.balance, initialBalance + 0.001 ether);
    }
}
