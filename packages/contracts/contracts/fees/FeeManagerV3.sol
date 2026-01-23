// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Errors} from "../libs/Errors.sol";

/**
 * @title FeeManagerV3
 * @notice Transparent fee management system for CastQuest V3
 * @dev Handles protocol, developer, and treasury fees with governance control
 * 
 * TRANSPARENT FEE STRUCTURE:
 * - Protocol Fee: 2.5% (250 bps) - Protocol development, audits, grants
 * - Developer Fee: 0.5% (50 bps) - Core team compensation (monads.skr / solanamobile.base.eth)
 * - Treasury Fee: 2.0% (200 bps) - DAO-controlled treasury for liquidity incentives
 * 
 * Total Trading Fee: 5.0%
 * 
 * All fees are publicly documented, on-chain, and adjustable by governance.
 * Maximum caps: Trading fees ≤10%, Creation fees ≤0.01 ETH
 * 
 * ABI Stability:
 * - setFeeConfiguration(FeeConfiguration config)
 * - collectFees(address token, uint256 amount)
 * - distributeFees()
 * - Events: FeesCollected, FeesDistributed, FeeConfigUpdated
 */
contract FeeManagerV3 is AccessControl {
    using SafeERC20 for IERC20;
    
    bytes32 public constant GOVERNANCE_ROLE = keccak256("GOVERNANCE_ROLE");
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    
    /// @notice Fee configuration structure
    struct FeeConfiguration {
        uint256 protocolFeeBps;      // Protocol fee in basis points (e.g., 250 = 2.5%)
        uint256 developerFeeBps;     // Developer fee in basis points (e.g., 50 = 0.5%)
        uint256 treasuryFeeBps;      // Treasury fee in basis points (e.g., 200 = 2.0%)
        address protocolTreasury;    // Protocol treasury address
        address developerTreasury;   // Developer treasury (monads.skr or solanamobile.base.eth)
        address daoTreasury;         // DAO-controlled treasury
        bool feesActive;             // Global fee switch
    }
    
    /// @notice Fee collection record
    struct FeeRecord {
        address token;
        uint256 amount;
        uint256 timestamp;
        address collector;
    }
    
    /// @notice Maximum fee caps (10% total max)
    uint256 public constant MAX_TOTAL_FEE_BPS = 1000; // 10%
    uint256 public constant MAX_CREATION_FEE = 0.01 ether;
    uint256 public constant BPS_DENOMINATOR = 10000;
    
    /// @notice Minimum timelock for fee changes (48 hours)
    uint256 public constant FEE_CHANGE_TIMELOCK = 48 hours;
    
    /// @notice Current fee configuration
    FeeConfiguration public feeConfig;
    
    /// @notice Pending fee configuration (for timelock)
    FeeConfiguration public pendingFeeConfig;
    uint256 public pendingConfigTimestamp;
    
    /// @notice Fee collection history
    FeeRecord[] public feeHistory;
    
    /// @notice Total fees collected per token
    mapping(address => uint256) public totalFeesCollected;
    
    /// @notice Pending fees to distribute
    mapping(address => uint256) public pendingFees;
    
    /// @notice Emitted when fees are collected
    event FeesCollected(
        address indexed token,
        uint256 amount,
        address indexed collector,
        uint256 timestamp
    );
    
    /// @notice Emitted when fees are distributed
    event FeesDistributed(
        address indexed token,
        uint256 protocolAmount,
        uint256 developerAmount,
        uint256 treasuryAmount
    );
    
    /// @notice Emitted when fee configuration is updated
    event FeeConfigUpdated(
        address indexed updater,
        FeeConfiguration oldConfig,
        FeeConfiguration newConfig
    );
    
    /// @notice Emitted when fee configuration change is proposed
    event FeeConfigProposed(
        FeeConfiguration newConfig,
        uint256 effectiveTimestamp
    );
    
    constructor(
        address _protocolTreasury,
        address _developerTreasury,
        address _daoTreasury,
        uint256 _protocolFeeBps,
        uint256 _developerFeeBps,
        uint256 _treasuryFeeBps
    ) {
        require(_protocolTreasury != address(0), Errors.ZERO_ADDRESS);
        require(_developerTreasury != address(0), Errors.ZERO_ADDRESS);
        require(_daoTreasury != address(0), Errors.ZERO_ADDRESS);
        require(
            _protocolFeeBps + _developerFeeBps + _treasuryFeeBps <= MAX_TOTAL_FEE_BPS,
            "Total fees exceed maximum"
        );
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(GOVERNANCE_ROLE, msg.sender);
        _grantRole(OPERATOR_ROLE, msg.sender);
        
        feeConfig = FeeConfiguration({
            protocolFeeBps: _protocolFeeBps,
            developerFeeBps: _developerFeeBps,
            treasuryFeeBps: _treasuryFeeBps,
            protocolTreasury: _protocolTreasury,
            developerTreasury: _developerTreasury,
            daoTreasury: _daoTreasury,
            feesActive: true
        });
    }
    
    /**
     * @notice Propose fee configuration change (timelock required)
     * @param newConfig New fee configuration
     */
    function proposeFeeConfiguration(FeeConfiguration calldata newConfig)
        external
        onlyRole(GOVERNANCE_ROLE)
    {
        require(newConfig.protocolTreasury != address(0), Errors.ZERO_ADDRESS);
        require(newConfig.developerTreasury != address(0), Errors.ZERO_ADDRESS);
        require(newConfig.daoTreasury != address(0), Errors.ZERO_ADDRESS);
        require(
            newConfig.protocolFeeBps + newConfig.developerFeeBps + newConfig.treasuryFeeBps
                <= MAX_TOTAL_FEE_BPS,
            "Total fees exceed maximum"
        );
        
        pendingFeeConfig = newConfig;
        pendingConfigTimestamp = block.timestamp + FEE_CHANGE_TIMELOCK;
        
        emit FeeConfigProposed(newConfig, pendingConfigTimestamp);
    }
    
    /**
     * @notice Apply pending fee configuration after timelock
     */
    function applyFeeConfiguration() external onlyRole(GOVERNANCE_ROLE) {
        require(pendingConfigTimestamp > 0, "No pending configuration");
        require(block.timestamp >= pendingConfigTimestamp, "Timelock not expired");
        
        FeeConfiguration memory oldConfig = feeConfig;
        feeConfig = pendingFeeConfig;
        
        // Clear pending
        delete pendingFeeConfig;
        pendingConfigTimestamp = 0;
        
        emit FeeConfigUpdated(msg.sender, oldConfig, feeConfig);
    }
    
    /**
     * @notice Collect fees from a transaction
     * @param token Token address (address(0) for ETH)
     * @param amount Amount of fees collected
     */
    function collectFees(address token, uint256 amount) external payable onlyRole(OPERATOR_ROLE) {
        require(feeConfig.feesActive, "Fees are disabled");
        require(amount > 0, Errors.ZERO_AMOUNT);
        
        if (token == address(0)) {
            // ETH
            require(msg.value == amount, "Incorrect ETH amount");
            pendingFees[address(0)] += amount;
        } else {
            // ERC20
            IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
            pendingFees[token] += amount;
        }
        
        totalFeesCollected[token] += amount;
        
        feeHistory.push(FeeRecord({
            token: token,
            amount: amount,
            timestamp: block.timestamp,
            collector: msg.sender
        }));
        
        emit FeesCollected(token, amount, msg.sender, block.timestamp);
    }
    
    /**
     * @notice Distribute collected fees to treasuries
     * @param token Token address (address(0) for ETH)
     */
    function distributeFees(address token) external {
        uint256 totalFees = pendingFees[token];
        require(totalFees > 0, "No fees to distribute");
        
        uint256 totalBps = feeConfig.protocolFeeBps + feeConfig.developerFeeBps + feeConfig.treasuryFeeBps;
        require(totalBps > 0, "Fee configuration not set");
        
        // Calculate distribution amounts
        uint256 protocolAmount = (totalFees * feeConfig.protocolFeeBps) / totalBps;
        uint256 developerAmount = (totalFees * feeConfig.developerFeeBps) / totalBps;
        uint256 treasuryAmount = totalFees - protocolAmount - developerAmount; // Remaining goes to treasury
        
        // Clear pending fees
        pendingFees[token] = 0;
        
        // Distribute fees
        if (token == address(0)) {
            // ETH distribution
            _transferETH(feeConfig.protocolTreasury, protocolAmount);
            _transferETH(feeConfig.developerTreasury, developerAmount);
            _transferETH(feeConfig.daoTreasury, treasuryAmount);
        } else {
            // ERC20 distribution
            IERC20(token).safeTransfer(feeConfig.protocolTreasury, protocolAmount);
            IERC20(token).safeTransfer(feeConfig.developerTreasury, developerAmount);
            IERC20(token).safeTransfer(feeConfig.daoTreasury, treasuryAmount);
        }
        
        emit FeesDistributed(token, protocolAmount, developerAmount, treasuryAmount);
    }
    
    /**
     * @notice Get current fee configuration
     */
    function getFeeConfiguration() external view returns (FeeConfiguration memory) {
        return feeConfig;
    }
    
    /**
     * @notice Calculate fees for an amount
     * @param amount Transaction amount
     */
    function calculateFees(uint256 amount) external view returns (uint256) {
        if (!feeConfig.feesActive) return 0;
        
        uint256 totalFeeBps = feeConfig.protocolFeeBps + feeConfig.developerFeeBps + feeConfig.treasuryFeeBps;
        return (amount * totalFeeBps) / BPS_DENOMINATOR;
    }
    
    /**
     * @notice Get fee history count
     */
    function getFeeHistoryCount() external view returns (uint256) {
        return feeHistory.length;
    }
    
    /**
     * @notice Internal ETH transfer
     */
    function _transferETH(address to, uint256 amount) internal {
        require(to != address(0), Errors.ZERO_ADDRESS);
        if (amount == 0) return;
        
        (bool success, ) = to.call{value: amount}("");
        require(success, Errors.TRANSFER_FAILED);
    }
    
    /**
     * @notice Emergency withdraw (governance only)
     */
    function emergencyWithdraw(address token, address to) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(to != address(0), Errors.ZERO_ADDRESS);
        
        if (token == address(0)) {
            uint256 balance = address(this).balance;
            _transferETH(to, balance);
        } else {
            uint256 balance = IERC20(token).balanceOf(address(this));
            IERC20(token).safeTransfer(to, balance);
        }
    }
    
    /**
     * @notice Receive ETH
     */
    receive() external payable {}
}
