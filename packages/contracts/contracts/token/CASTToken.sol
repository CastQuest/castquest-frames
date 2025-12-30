// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {Errors} from "../libs/Errors.sol";

/**
 * @title CASTToken
 * @notice Main protocol token for CastQuest
 * @dev ERC-20 token with controlled minting by owner/governance
 * 
 * ABI Stability:
 * - Standard ERC-20 interface (transfer, approve, etc.)
 * - mint(address to, uint256 amount) - Owner only
 * - Events: Transfer, Approval
 */
contract CASTToken is ERC20, Ownable {
    /// @notice Maximum supply cap (100M tokens)
    uint256 public constant MAX_SUPPLY = 100_000_000 ether;

    /// @notice Emitted when tokens are minted
    event Minted(address indexed to, uint256 amount);

    constructor(address initialOwner) ERC20("CastQuest", "CAST") Ownable(initialOwner) {
        // Initial supply can be minted by owner after deployment
    }

    /**
     * @notice Mint new CAST tokens
     * @param to Address to receive tokens
     * @param amount Amount to mint (in wei units)
     */
    function mint(address to, uint256 amount) external onlyOwner {
        require(to != address(0), Errors.ZERO_ADDRESS);
        require(amount > 0, Errors.ZERO_AMOUNT);
        require(totalSupply() + amount <= MAX_SUPPLY, Errors.EXCEEDS_MAX_SUPPLY);
        _mint(to, amount);
        emit Minted(to, amount);
    }

    /**
     * @notice Burn tokens from caller's balance
     * @param amount Amount to burn
     */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}
