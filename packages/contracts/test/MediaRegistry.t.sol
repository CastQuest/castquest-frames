// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "forge-std/Test.sol";
import "../contracts/registry/MediaRegistry.sol";

contract MediaRegistryTest is Test {
    MediaRegistry public registry;
    
    address public owner = address(this);
    address public operator = address(0x123);
    address public token1 = address(0x456);
    address public token2 = address(0x789);
    address public mediaOwner = address(0xABC);
    
    function setUp() public {
        registry = new MediaRegistry(owner);
        registry.grantRole(registry.OPERATOR_ROLE(), operator);
    }

    function testRegisterMedia() public {
        string[] memory flags = new string[](0);
        
        vm.prank(operator);
        registry.registerMedia(
            "media-1",
            token1,
            mediaOwner,
            "ipfs://metadata1",
            flags
        );
        
        assertTrue(registry.isMediaRegistered("media-1"));
        
        MediaRegistry.MediaInfo memory info = registry.getMediaInfo("media-1");
        assertEq(info.tokenAddress, token1);
        assertEq(info.owner, mediaOwner);
        assertEq(info.metadataURI, "ipfs://metadata1");
        assertEq(info.riskFlags.length, 0);
    }

    function testRegisterMultipleMedia() public {
        string[] memory flags = new string[](0);
        
        vm.startPrank(operator);
        registry.registerMedia("media-1", token1, mediaOwner, "ipfs://1", flags);
        registry.registerMedia("media-2", token2, mediaOwner, "ipfs://2", flags);
        vm.stopPrank();
        
        assertTrue(registry.isMediaRegistered("media-1"));
        assertTrue(registry.isMediaRegistered("media-2"));
    }

    function testSetRiskFlags() public {
        string[] memory emptyFlags = new string[](0);
        
        vm.prank(operator);
        registry.registerMedia("media-1", token1, mediaOwner, "ipfs://1", emptyFlags);
        
        string[] memory riskFlags = new string[](2);
        riskFlags[0] = "NSFW";
        riskFlags[1] = "SPAM";
        
        vm.prank(operator);
        registry.setRiskFlags("media-1", riskFlags);
        
        MediaRegistry.MediaInfo memory info = registry.getMediaInfo("media-1");
        assertEq(info.riskFlags.length, 2);
        assertEq(info.riskFlags[0], "NSFW");
        assertEq(info.riskFlags[1], "SPAM");
    }

    function testSetStatus() public {
        string[] memory flags = new string[](0);
        
        vm.prank(operator);
        registry.registerMedia("media-1", token1, mediaOwner, "ipfs://1", flags);
        
        vm.prank(operator);
        registry.setStatus("media-1", MediaRegistry.MediaStatus.FLAGGED);
        
        MediaRegistry.MediaInfo memory info = registry.getMediaInfo("media-1");
        assertEq(uint8(info.status), uint8(MediaRegistry.MediaStatus.FLAGGED));
    }

    function testGetMediaByOwner() public {
        string[] memory flags = new string[](0);
        
        vm.startPrank(operator);
        registry.registerMedia("media-1", token1, mediaOwner, "ipfs://1", flags);
        registry.registerMedia("media-2", token2, mediaOwner, "ipfs://2", flags);
        vm.stopPrank();
        
        string[] memory mediaIds = registry.getMediaByOwner(mediaOwner);
        assertEq(mediaIds.length, 2);
    }

    function testGetMediaByToken() public {
        string[] memory flags = new string[](0);
        
        vm.prank(operator);
        registry.registerMedia("media-1", token1, mediaOwner, "ipfs://1", flags);
        
        string memory mediaId = registry.getMediaByToken(token1);
        assertEq(mediaId, "media-1");
    }

    function testRegisterFailsWhenNotOperator() public {
        string[] memory flags = new string[](0);
        
        vm.prank(address(0x999));
        vm.expectRevert();
        registry.registerMedia("media-1", token1, mediaOwner, "ipfs://1", flags);
    }

    function testRegisterFailsDuplicateMediaId() public {
        string[] memory flags = new string[](0);
        
        vm.startPrank(operator);
        registry.registerMedia("media-1", token1, mediaOwner, "ipfs://1", flags);
        
        vm.expectRevert("MediaRegistry: media already registered");
        registry.registerMedia("media-1", token2, mediaOwner, "ipfs://2", flags);
        vm.stopPrank();
    }

    function testSetRiskFlagsFailsForUnregisteredMedia() public {
        string[] memory flags = new string[](1);
        flags[0] = "SPAM";
        
        vm.prank(operator);
        vm.expectRevert("MediaRegistry: media not registered");
        registry.setRiskFlags("nonexistent", flags);
    }
}
