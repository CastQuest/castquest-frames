// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FeeRouter
 * @notice Routes protocol fees to CAST token or treasury
 * @dev Collects ETH fees and can swap to CAST if liquidity available
 * 
 * ABI Stability:
 * - collectFees() - Called by market contracts
 * - swapToCASTAndDistribute() - Convert ETH to CAST
 * - Events: FeesCollected, FeesDistributed
 */
contract FeeRouter is Ownable {
    using SafeERC20 for IERC20;

    /// @notice CAST token address
    address public immutable castToken;

    /// @notice Treasury address for ETH fees
    address public treasury;

    /// @notice Market contract (can send fees)
    address public market;

    /// @notice Total fees collected in ETH
    uint256 public totalFeesCollected;

    /// @notice Emitted when fees are received
    event FeesCollected(address indexed from, uint256 amount);

    /// @notice Emitted when fees are distributed
    event FeesDistributed(address indexed recipient, uint256 amount);

    /// @notice Emitted when treasury is updated
    event TreasuryUpdated(address oldTreasury, address newTreasury);

    constructor(address _castToken, address _treasury, address initialOwner) Ownable(initialOwner) {
        castToken = _castToken;
        treasury = _treasury;
    }

    /**
     * @notice Receive fees from market
     */
    receive() external payable {
        totalFeesCollected += msg.value;
        emit FeesCollected(msg.sender, msg.value);
    }

    /**
     * @notice Distribute collected fees to treasury
     */
    function distributeFees() external {
        uint256 balance = address(this).balance;
        require(balance > 0, "FeeRouter: no fees to distribute");
        require(treasury != address(0), "FeeRouter: treasury not set");

        (bool success,) = treasury.call{value: balance}("");
        require(success, "FeeRouter: transfer failed");

        emit FeesDistributed(treasury, balance);
    }

    /**
     * @notice Set treasury address
     * @param newTreasury New treasury address
     */
    function setTreasury(address newTreasury) external onlyOwner {
        require(newTreasury != address(0), "FeeRouter: zero address");
        address oldTreasury = treasury;
        treasury = newTreasury;
        emit TreasuryUpdated(oldTreasury, newTreasury);
    }

    /**
     * @notice Set market address
     * @param newMarket New market address
     */
    function setMarket(address newMarket) external onlyOwner {
        market = newMarket;
    }

    /**
     * @notice Emergency withdraw ETH
     * @param to Recipient address
     */
    function emergencyWithdraw(address payable to) external onlyOwner {
        require(to != address(0), "FeeRouter: zero address");
        uint256 balance = address(this).balance;
        (bool success,) = to.call{value: balance}("");
        require(success, "FeeRouter: transfer failed");
    }

    /**
     * @notice Emergency withdraw tokens
     * @param token Token address
     * @param to Recipient address
     */
    function emergencyWithdrawTokens(address token, address to) external onlyOwner {
        require(to != address(0), "FeeRouter: zero address");
        uint256 balance = IERC20(token).balanceOf(address(this));
        IERC20(token).safeTransfer(to, balance);
    }
}
