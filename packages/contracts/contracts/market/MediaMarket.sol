// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title MediaMarket
 * @notice Simple market for trading media tokens
 * @dev Supports ETH <-> Token swaps with protocol fees
 * 
 * ABI Stability:
 * - buyTokens(token, minAmount) payable
 * - sellTokens(token, amount, minETH)
 * - Events: TokensPurchased, TokensSold, FeesCollected
 * 
 * Note: This is a simplified market. Production should use Uniswap V2/V3 or similar.
 */
contract MediaMarket is Ownable, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    /// @notice Protocol fee in basis points (100 = 1%)
    uint256 public protocolFeeBps = 100; // 1%

    /// @notice Fee recipient address
    address public feeRecipient;

    /// @notice Constant product AMM k value per token
    mapping(address => uint256) public k;

    /// @notice ETH reserves per token
    mapping(address => uint256) public ethReserves;

    /// @notice Token reserves per token
    mapping(address => uint256) public tokenReserves;

    /// @notice Emitted when tokens are purchased
    event TokensPurchased(
        address indexed buyer, address indexed token, uint256 ethAmount, uint256 tokenAmount, uint256 fee
    );

    /// @notice Emitted when tokens are sold
    event TokensSold(address indexed seller, address indexed token, uint256 tokenAmount, uint256 ethAmount, uint256 fee);

    /// @notice Emitted when liquidity is added
    event LiquidityAdded(address indexed provider, address indexed token, uint256 ethAmount, uint256 tokenAmount);

    /// @notice Emitted when fees are collected
    event FeesCollected(address indexed recipient, uint256 amount);

    /// @notice Emitted when protocol fee is updated
    event ProtocolFeeUpdated(uint256 oldFee, uint256 newFee);

    constructor(address initialOwner, address _feeRecipient) Ownable(initialOwner) {
        feeRecipient = _feeRecipient;
    }

    /**
     * @notice Add initial liquidity for a token
     * @param token Token address
     * @param tokenAmount Amount of tokens to add
     */
    function addLiquidity(address token, uint256 tokenAmount) external payable onlyOwner {
        require(msg.value > 0, "MediaMarket: zero ETH");
        require(tokenAmount > 0, "MediaMarket: zero tokens");
        require(k[token] == 0, "MediaMarket: liquidity exists");

        // Transfer tokens from sender
        IERC20(token).safeTransferFrom(msg.sender, address(this), tokenAmount);

        // Set reserves
        ethReserves[token] = msg.value;
        tokenReserves[token] = tokenAmount;
        k[token] = msg.value * tokenAmount;

        emit LiquidityAdded(msg.sender, token, msg.value, tokenAmount);
    }

    /**
     * @notice Buy tokens with ETH
     * @param token Token to buy
     * @param minTokenAmount Minimum tokens to receive (slippage protection)
     */
    function buyTokens(address token, uint256 minTokenAmount) external payable whenNotPaused nonReentrant {
        require(msg.value > 0, "MediaMarket: zero ETH");
        require(k[token] > 0, "MediaMarket: no liquidity");

        // Calculate fee
        uint256 fee = (msg.value * protocolFeeBps) / 10_000;
        uint256 ethAfterFee = msg.value - fee;

        // Calculate tokens to receive using constant product formula
        uint256 newEthReserve = ethReserves[token] + ethAfterFee;
        uint256 newTokenReserve = k[token] / newEthReserve;
        uint256 tokenAmount = tokenReserves[token] - newTokenReserve;

        require(tokenAmount >= minTokenAmount, "MediaMarket: slippage exceeded");
        require(tokenAmount <= tokenReserves[token], "MediaMarket: insufficient liquidity");

        // Update reserves
        ethReserves[token] = newEthReserve;
        tokenReserves[token] = newTokenReserve;

        // Transfer tokens to buyer
        IERC20(token).safeTransfer(msg.sender, tokenAmount);

        // Send fee to recipient
        if (fee > 0 && feeRecipient != address(0)) {
            (bool success,) = feeRecipient.call{value: fee}("");
            require(success, "MediaMarket: fee transfer failed");
            emit FeesCollected(feeRecipient, fee);
        }

        emit TokensPurchased(msg.sender, token, msg.value, tokenAmount, fee);
    }

    /**
     * @notice Sell tokens for ETH
     * @param token Token to sell
     * @param tokenAmount Amount of tokens to sell
     * @param minEthAmount Minimum ETH to receive (slippage protection)
     */
    function sellTokens(address token, uint256 tokenAmount, uint256 minEthAmount)
        external
        whenNotPaused
        nonReentrant
    {
        require(tokenAmount > 0, "MediaMarket: zero tokens");
        require(k[token] > 0, "MediaMarket: no liquidity");

        // Transfer tokens from seller
        IERC20(token).safeTransferFrom(msg.sender, address(this), tokenAmount);

        // Calculate ETH to receive using constant product formula
        uint256 newTokenReserve = tokenReserves[token] + tokenAmount;
        uint256 newEthReserve = k[token] / newTokenReserve;
        uint256 ethAmount = ethReserves[token] - newEthReserve;

        // Calculate fee
        uint256 fee = (ethAmount * protocolFeeBps) / 10_000;
        uint256 ethAfterFee = ethAmount - fee;

        require(ethAfterFee >= minEthAmount, "MediaMarket: slippage exceeded");
        require(ethAfterFee <= address(this).balance, "MediaMarket: insufficient ETH");

        // Update reserves
        ethReserves[token] = newEthReserve;
        tokenReserves[token] = newTokenReserve;

        // Transfer ETH to seller
        (bool success,) = msg.sender.call{value: ethAfterFee}("");
        require(success, "MediaMarket: ETH transfer failed");

        // Send fee to recipient
        if (fee > 0 && feeRecipient != address(0)) {
            (bool feeSuccess,) = feeRecipient.call{value: fee}("");
            require(feeSuccess, "MediaMarket: fee transfer failed");
            emit FeesCollected(feeRecipient, fee);
        }

        emit TokensSold(msg.sender, token, tokenAmount, ethAfterFee, fee);
    }

    /**
     * @notice Get quote for buying tokens
     * @param token Token address
     * @param ethAmount ETH amount to spend
     * @return tokenAmount Tokens to receive
     * @return fee Protocol fee
     */
    function getQuoteBuy(address token, uint256 ethAmount) external view returns (uint256 tokenAmount, uint256 fee) {
        require(k[token] > 0, "MediaMarket: no liquidity");

        fee = (ethAmount * protocolFeeBps) / 10_000;
        uint256 ethAfterFee = ethAmount - fee;

        uint256 newEthReserve = ethReserves[token] + ethAfterFee;
        uint256 newTokenReserve = k[token] / newEthReserve;
        tokenAmount = tokenReserves[token] - newTokenReserve;
    }

    /**
     * @notice Get quote for selling tokens
     * @param token Token address
     * @param tokenAmount Token amount to sell
     * @return ethAmount ETH to receive
     * @return fee Protocol fee
     */
    function getQuoteSell(address token, uint256 tokenAmount) external view returns (uint256 ethAmount, uint256 fee) {
        require(k[token] > 0, "MediaMarket: no liquidity");

        uint256 newTokenReserve = tokenReserves[token] + tokenAmount;
        uint256 newEthReserve = k[token] / newTokenReserve;
        uint256 ethGross = ethReserves[token] - newEthReserve;

        fee = (ethGross * protocolFeeBps) / 10_000;
        ethAmount = ethGross - fee;
    }

    /**
     * @notice Set protocol fee
     * @param newFeeBps New fee in basis points
     */
    function setProtocolFee(uint256 newFeeBps) external onlyOwner {
        require(newFeeBps <= 1000, "MediaMarket: fee too high"); // Max 10%
        uint256 oldFee = protocolFeeBps;
        protocolFeeBps = newFeeBps;
        emit ProtocolFeeUpdated(oldFee, newFeeBps);
    }

    /**
     * @notice Set fee recipient
     * @param newRecipient New recipient address
     */
    function setFeeRecipient(address newRecipient) external onlyOwner {
        require(newRecipient != address(0), "MediaMarket: zero address");
        feeRecipient = newRecipient;
    }

    /**
     * @notice Pause market
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Unpause market
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @notice Receive ETH
     */
    receive() external payable {}
}
