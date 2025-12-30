// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "../token/MediaToken.sol";
import "../registry/MediaRegistry.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import {Errors} from "../libs/Errors.sol";

/**
 * @title MediaTokenFactory
 * @notice Factory for creating per-media ERC-20 tokens
 * @dev Integrates with MediaRegistry for tracking
 * 
 * ABI Stability:
 * - createMediaToken(CreateMediaTokenConfig) returns (address)
 * - Events: MediaTokenCreated(mediaId, token, owner, symbol, totalSupply)
 */
contract MediaTokenFactory is Ownable, Pausable {
    /// @notice Configuration for creating a media token
    struct CreateMediaTokenConfig {
        string name;
        string symbol;
        string mediaId;
        string metadataURI;
        address owner;
        uint256 totalSupply;
    }

    /// @notice MediaRegistry contract
    MediaRegistry public immutable registry;

    /// @notice Default total supply if not specified
    uint256 public constant DEFAULT_SUPPLY = 10_000_000 ether;

    /// @notice Minimum total supply
    uint256 public constant MIN_SUPPLY = 1_000 ether;

    /// @notice Maximum total supply
    uint256 public constant MAX_SUPPLY = 1_000_000_000 ether;

    /// @notice Creation fee in ETH
    uint256 public creationFee;

    /// @notice Fee recipient
    address public feeRecipient;

    /// @notice Emitted when a media token is created
    event MediaTokenCreated(
        string indexed mediaId,
        address indexed token,
        address indexed owner,
        string symbol,
        uint256 totalSupply,
        string metadataURI
    );

    /// @notice Emitted when creation fee is updated
    event CreationFeeUpdated(uint256 oldFee, uint256 newFee);

    /// @notice Emitted when fee recipient is updated
    event FeeRecipientUpdated(address oldRecipient, address newRecipient);

    constructor(address _registry, address initialOwner, address _feeRecipient)
        Ownable(initialOwner)
    {
        require(_registry != address(0), Errors.ZERO_ADDRESS);
        require(_feeRecipient != address(0), Errors.ZERO_ADDRESS);
        registry = MediaRegistry(_registry);
        feeRecipient = _feeRecipient;
        creationFee = 0.001 ether; // 0.001 ETH default
    }

    /**
     * @notice Create a new media token
     * @param config Token configuration
     * @return token Address of created token
     */
    function createMediaToken(CreateMediaTokenConfig calldata config)
        external
        payable
        whenNotPaused
        returns (address token)
    {
        require(msg.value >= creationFee, Errors.INSUFFICIENT_FEE);
        require(bytes(config.mediaId).length > 0, Errors.EMPTY_STRING);
        require(bytes(config.symbol).length > 0, Errors.EMPTY_STRING);
        require(config.owner != address(0), Errors.ZERO_ADDRESS);

        uint256 supply = config.totalSupply > 0 ? config.totalSupply : DEFAULT_SUPPLY;
        require(supply >= MIN_SUPPLY && supply <= MAX_SUPPLY, Errors.INVALID_SUPPLY);

        // Check mediaId not already used
        require(!registry.mediaExists(config.mediaId), Errors.MEDIA_EXISTS);

        // Deploy new MediaToken
        MediaToken newToken = new MediaToken(
            config.name,
            config.symbol,
            config.mediaId,
            config.metadataURI,
            config.owner,
            supply
        );

        token = address(newToken);

        // Register in MediaRegistry
        registry.registerMedia(config.mediaId, token, config.owner, config.metadataURI);

        emit MediaTokenCreated(config.mediaId, token, config.owner, config.symbol, supply, config.metadataURI);

        // Send fee to recipient
        if (msg.value > 0 && feeRecipient != address(0)) {
            (bool success,) = feeRecipient.call{value: msg.value}("");
            require(success, Errors.TRANSFER_FAILED);
        }

        return token;
    }

    /**
     * @notice Set creation fee
     * @param newFee New fee amount in wei
     */
    function setCreationFee(uint256 newFee) external onlyOwner {
        uint256 oldFee = creationFee;
        creationFee = newFee;
        emit CreationFeeUpdated(oldFee, newFee);
    }

    /**
     * @notice Set fee recipient
     * @param newRecipient New recipient address
     */
    function setFeeRecipient(address newRecipient) external onlyOwner {
        require(newRecipient != address(0), Errors.ZERO_ADDRESS);
        address oldRecipient = feeRecipient;
        feeRecipient = newRecipient;
        emit FeeRecipientUpdated(oldRecipient, newRecipient);
    }

    /**
     * @notice Pause token creation
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Unpause token creation
     */
    function unpause() external onlyOwner {
        _unpause();
    }
}
