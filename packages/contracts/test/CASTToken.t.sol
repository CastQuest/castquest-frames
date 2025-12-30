// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "forge-std/Test.sol";
import "../contracts/token/CASTToken.sol";

contract CASTTokenTest is Test {
    CASTToken public token;
    address public owner = address(this);
    address public user1 = address(0x1);
    address public user2 = address(0x2);

    event Minted(address indexed to, uint256 amount);

    function setUp() public {
        token = new CASTToken(owner);
    }

    function testInitialState() public {
        assertEq(token.name(), "CastQuest");
        assertEq(token.symbol(), "CAST");
        assertEq(token.decimals(), 18);
        assertEq(token.totalSupply(), 0);
        assertEq(token.MAX_SUPPLY(), 100_000_000 ether);
    }

    function testMint() public {
        uint256 amount = 1_000 ether;
        
        vm.expectEmit(true, false, false, true);
        emit Minted(user1, amount);
        
        token.mint(user1, amount);
        
        assertEq(token.balanceOf(user1), amount);
        assertEq(token.totalSupply(), amount);
    }

    function testMintMultiple() public {
        token.mint(user1, 1_000 ether);
        token.mint(user2, 2_000 ether);
        
        assertEq(token.balanceOf(user1), 1_000 ether);
        assertEq(token.balanceOf(user2), 2_000 ether);
        assertEq(token.totalSupply(), 3_000 ether);
    }

    function testMintFailsWhenExceedsMaxSupply() public {
        token.mint(user1, 99_000_000 ether);
        
        vm.expectRevert("CASTToken: exceeds max supply");
        token.mint(user1, 2_000_000 ether);
    }

    function testMintFailsWhenNotOwner() public {
        vm.prank(user1);
        vm.expectRevert();
        token.mint(user1, 1_000 ether);
    }

    function testBurn() public {
        token.mint(user1, 1_000 ether);
        
        vm.prank(user1);
        token.burn(500 ether);
        
        assertEq(token.balanceOf(user1), 500 ether);
        assertEq(token.totalSupply(), 500 ether);
    }

    function testTransfer() public {
        token.mint(user1, 1_000 ether);
        
        vm.prank(user1);
        token.transfer(user2, 300 ether);
        
        assertEq(token.balanceOf(user1), 700 ether);
        assertEq(token.balanceOf(user2), 300 ether);
    }

    function testApproveAndTransferFrom() public {
        token.mint(user1, 1_000 ether);
        
        vm.prank(user1);
        token.approve(user2, 500 ether);
        
        vm.prank(user2);
        token.transferFrom(user1, user2, 300 ether);
        
        assertEq(token.balanceOf(user1), 700 ether);
        assertEq(token.balanceOf(user2), 300 ether);
        assertEq(token.allowance(user1, user2), 200 ether);
    }
}
