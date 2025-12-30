// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title MediaToken
 * @notice Per-media ERC-20 token (e.g., $PIC, $VID)
 * @dev Created by MediaTokenFactory, minted once to owner
 * 
 * ABI Stability:
 * - Standard ERC-20 interface
 * - Immutable: name, symbol, totalSupply set at creation
 * - mediaId: Unique identifier linking to media metadata
 * - metadataURI: IPFS/HTTP link to media metadata
 */
contract MediaToken is ERC20 {
    /// @notice Unique media identifier
    string public mediaId;

    /// @notice URI to media metadata (IPFS, HTTP, etc.)
    string public metadataURI;

    /// @notice Address that owns this media token
    address public owner;

    /// @notice Factory that created this token
    address public immutable factory;

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _mediaId,
        string memory _metadataURI,
        address _owner,
        uint256 _totalSupply
    ) ERC20(_name, _symbol) {
        mediaId = _mediaId;
        metadataURI = _metadataURI;
        owner = _owner;
        factory = msg.sender;

        // Mint total supply to owner
        _mint(_owner, _totalSupply);
    }

    /**
     * @notice Update metadata URI (only factory can call)
     * @param newURI New metadata URI
     */
    function updateMetadataURI(string memory newURI) external {
        require(msg.sender == factory, "MediaToken: only factory");
        metadataURI = newURI;
    }
}
