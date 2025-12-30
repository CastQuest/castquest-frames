// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

/**
 * @title Errors
 * @notice Centralized error constants for CastQuest protocol
 * @dev All error messages use SCREAMING_SNAKE_CASE for consistency
 */
library Errors {
    // === Core Validation Errors ===
    string public constant ZERO_ADDRESS = "ZERO_ADDRESS";
    string public constant INVALID_ADDRESS = "INVALID_ADDRESS";
    string public constant NOT_AUTHORIZED = "NOT_AUTHORIZED";
    string public constant NOT_FOUND = "NOT_FOUND";
    
    // === Amount & Supply Errors ===
    string public constant ZERO_AMOUNT = "ZERO_AMOUNT";
    string public constant INVALID_AMOUNT = "INVALID_AMOUNT";
    string public constant INVALID_SUPPLY = "INVALID_SUPPLY";
    string public constant EXCEEDS_MAX_SUPPLY = "EXCEEDS_MAX_SUPPLY";
    
    // === String & Array Errors ===
    string public constant EMPTY_STRING = "EMPTY_STRING";
    string public constant EMPTY_ARRAY = "EMPTY_ARRAY";
    
    // === Registry & Existence Errors ===
    string public constant ALREADY_EXISTS = "ALREADY_EXISTS";
    string public constant MEDIA_EXISTS = "MEDIA_EXISTS";
    string public constant LIQUIDITY_EXISTS = "LIQUIDITY_EXISTS";
    
    // === Liquidity & Trading Errors ===
    string public constant NO_LIQUIDITY = "NO_LIQUIDITY";
    string public constant INSUFFICIENT_LIQUIDITY = "INSUFFICIENT_LIQUIDITY";
    string public constant INSUFFICIENT_BALANCE = "INSUFFICIENT_BALANCE";
    string public constant SLIPPAGE_EXCEEDED = "SLIPPAGE_EXCEEDED";
    
    // === Fee & Transfer Errors ===
    string public constant INSUFFICIENT_FEE = "INSUFFICIENT_FEE";
    string public constant FEE_TOO_HIGH = "FEE_TOO_HIGH";
    string public constant TRANSFER_FAILED = "TRANSFER_FAILED";
    string public constant NO_FEES = "NO_FEES";
    string public constant TREASURY_NOT_SET = "TREASURY_NOT_SET";
    
    // === Factory Errors ===
    string public constant ONLY_FACTORY = "ONLY_FACTORY";
    
    // === Legacy Aliases (ABI Compatibility) ===
    string public constant NotAuthorized = "NOT_AUTHORIZED";
    string public constant InvalidAddress = "INVALID_ADDRESS";
    string public constant AlreadyExists = "ALREADY_EXISTS";
    string public constant ZeroAddress = "ZERO_ADDRESS";
}
