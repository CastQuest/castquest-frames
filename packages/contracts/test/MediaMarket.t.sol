// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "forge-std/Test.sol";
import "../contracts/market/MediaMarket.sol";
import "../contracts/token/MediaToken.sol";
import "../contracts/fees/FeeRouter.sol";

contract MediaMarketTest is Test {
    MediaMarket public market;
    FeeRouter public feeRouter;
    MediaToken public token;
    
    address public owner = address(this);
    address public treasury = address(0x123);
    address public trader1 = address(0x456);
    address public trader2 = address(0x789);
    
    function setUp() public {
        feeRouter = new FeeRouter(owner, treasury);
        market = new MediaMarket(owner, address(feeRouter));
        
        // Create test token
        token = new MediaToken(
            "Test Token",
            "TEST",
            "test-media-1",
            "ipfs://test",
            owner,
            1_000_000 ether
        );
        
        // Add initial liquidity
        token.approve(address(market), 100_000 ether);
        market.addLiquidity{value: 10 ether}(address(token), 100_000 ether);
        
        vm.deal(trader1, 100 ether);
        vm.deal(trader2, 100 ether);
    }

    function testBuyTokens() public {
        uint256 ethAmount = 1 ether;
        
        vm.prank(trader1);
        uint256 tokensBought = market.buyTokens{value: ethAmount}(address(token), 0);
        
        assertGt(tokensBought, 0);
        assertEq(token.balanceOf(trader1), tokensBought);
    }

    function testSellTokens() public {
        // First buy tokens
        vm.prank(trader1);
        uint256 tokensBought = market.buyTokens{value: 1 ether}(address(token), 0);
        
        // Then sell them
        vm.startPrank(trader1);
        token.approve(address(market), tokensBought);
        uint256 ethReceived = market.sellTokens(address(token), tokensBought, 0);
        vm.stopPrank();
        
        assertGt(ethReceived, 0);
        assertEq(token.balanceOf(trader1), 0);
    }

    function testProtocolFee() public {
        uint256 initialTreasuryBalance = treasury.balance;
        uint256 ethAmount = 1 ether;
        
        vm.prank(trader1);
        market.buyTokens{value: ethAmount}(address(token), 0);
        
        // Protocol fee should have been collected
        assertGt(treasury.balance, initialTreasuryBalance);
    }

    function testGetQuoteBuy() public view {
        uint256 ethAmount = 1 ether;
        (uint256 tokenAmount, uint256 fee) = market.getQuoteBuy(address(token), ethAmount);
        
        assertGt(tokenAmount, 0);
        assertGt(fee, 0);
    }

    function testGetQuoteSell() public {
        uint256 tokenAmount = 1000 ether;
        (uint256 ethAmount, uint256 fee) = market.getQuoteSell(address(token), tokenAmount);
        
        assertGt(ethAmount, 0);
        assertGt(fee, 0);
    }

    function testSetProtocolFee() public {
        uint256 newFee = 200; // 2%
        market.setProtocolFee(newFee);
        assertEq(market.protocolFee(), newFee);
    }

    function testSetProtocolFeeFailsWhenTooHigh() public {
        vm.expectRevert("MediaMarket: fee too high");
        market.setProtocolFee(1100); // 11%
    }

    function testPauseUnpause() public {
        market.pause();
        
        vm.prank(trader1);
        vm.expectRevert();
        market.buyTokens{value: 1 ether}(address(token), 0);
        
        market.unpause();
        
        vm.prank(trader1);
        market.buyTokens{value: 1 ether}(address(token), 0);
    }

    function testAddLiquidity() public {
        MediaToken newToken = new MediaToken(
            "New Token",
            "NEW",
            "new-media-1",
            "ipfs://new",
            owner,
            1_000_000 ether
        );
        
        newToken.approve(address(market), 50_000 ether);
        market.addLiquidity{value: 5 ether}(address(newToken), 50_000 ether);
        
        assertEq(newToken.balanceOf(address(market)), 50_000 ether);
    }

    function testRemoveLiquidity() public {
        uint256 initialBalance = token.balanceOf(owner);
        
        market.removeLiquidity(address(token), 10_000 ether, 0);
        
        assertGt(token.balanceOf(owner), initialBalance);
    }
}
