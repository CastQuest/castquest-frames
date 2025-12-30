// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {Errors} from "../libs/Errors.sol";

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

    /// @notice Emitted when market is updated
    event MarketUpdated(address oldMarket, address newMarket);

    constructor(address _castToken, address _treasury) Ownable(msg.sender) {
        require(_castToken != address(0), Errors.ZERO_ADDRESS);
        require(_treasury != address(0), Errors.ZERO_ADDRESS);
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
        require(balance > 0, Errors.NO_FEES);
        require(treasury != address(0), Errors.TREASURY_NOT_SET);

        (bool success,) = treasury.call{value: balance}("");
        require(success, Errors.TRANSFER_FAILED);

        emit FeesDistributed(treasury, balance);
    }

    /**
     * @notice Set treasury address
     * @param newTreasury New treasury address
     */
    function setTreasury(address newTreasury) external onlyOwner {
        require(newTreasury != address(0), Errors.ZERO_ADDRESS);
        address oldTreasury = treasury;
        treasury = newTreasury;
        emit TreasuryUpdated(oldTreasury, newTreasury);
    }

    /**
     * @notice Set market address
     * @param newMarket New market address
     */
    function setMarket(address newMarket) external onlyOwner {
        require(newMarket != address(0), Errors.ZERO_ADDRESS);
        address oldMarket = market;
        market = newMarket;
        emit MarketUpdated(oldMarket, newMarket);
    }

    /**
     * @notice Emergency withdraw ETH
     * @param to Recipient address
     */
    function emergencyWithdraw(address payable to) external onlyOwner {
        require(to != address(0), Errors.ZERO_ADDRESS);
        uint256 balance = address(this).balance;
        (bool success,) = to.call{value: balance}("");
        require(success, Errors.TRANSFER_FAILED);
    }

    /**
     * @notice Emergency withdraw tokens
     * @param token Token address
     * @param to Recipient address
     */
    function emergencyWithdrawTokens(address token, address to) external onlyOwner {
        require(to != address(0), Errors.ZERO_ADDRESS);
        uint256 balance = IERC20(token).balanceOf(address(this));
        IERC20(token).safeTransfer(to, balance);
    }
}
