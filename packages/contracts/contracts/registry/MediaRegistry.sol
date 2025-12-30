// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title MediaRegistry
 * @notice Registry for all media tokens and their metadata
 * @dev Tracks mediaId → token, owner, metadata, risk flags
 * 
 * ABI Stability:
 * - registerMedia(mediaId, token, owner, metadataURI)
 * - setRiskFlags(mediaId, flags)
 * - getMediaInfo(mediaId) returns (MediaInfo)
 * - Events: MediaRegistered, RiskFlagsUpdated
 */
contract MediaRegistry is AccessControl {
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    bytes32 public constant FACTORY_ROLE = keccak256("FACTORY_ROLE");

    /// @notice Risk flag enumeration
    enum RiskFlag {
        NONE,
        SPAM,
        NSFW,
        SCAM,
        BLOCKED
    }

    /// @notice Media information structure
    struct MediaInfo {
        address tokenAddress;
        address owner;
        string metadataURI;
        RiskFlag[] riskFlags;
        uint256 createdAt;
        bool exists;
    }

    /// @notice Mapping from mediaId to MediaInfo
    mapping(string => MediaInfo) private _mediaRegistry;

    /// @notice Array of all mediaIds
    string[] private _allMediaIds;

    /// @notice Mapping from token address to mediaId
    mapping(address => string) public tokenToMediaId;

    /// @notice Emitted when media is registered
    event MediaRegistered(
        string indexed mediaId, address indexed tokenAddress, address indexed owner, string metadataURI
    );

    /// @notice Emitted when risk flags are updated
    event RiskFlagsUpdated(string indexed mediaId, RiskFlag[] flags);

    /// @notice Emitted when metadata URI is updated
    event MetadataURIUpdated(string indexed mediaId, string newURI);

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(OPERATOR_ROLE, admin);
    }

    /**
     * @notice Register a new media token
     * @param mediaId Unique media identifier
     * @param tokenAddress Address of media token
     * @param owner Address of media owner
     * @param metadataURI URI to media metadata
     */
    function registerMedia(string calldata mediaId, address tokenAddress, address owner, string calldata metadataURI)
        external
        onlyRole(FACTORY_ROLE)
    {
        require(!_mediaRegistry[mediaId].exists, "MediaRegistry: already exists");
        require(tokenAddress != address(0), "MediaRegistry: zero token address");
        require(owner != address(0), "MediaRegistry: zero owner");

        MediaInfo storage info = _mediaRegistry[mediaId];
        info.tokenAddress = tokenAddress;
        info.owner = owner;
        info.metadataURI = metadataURI;
        info.createdAt = block.timestamp;
        info.exists = true;

        _allMediaIds.push(mediaId);
        tokenToMediaId[tokenAddress] = mediaId;

        emit MediaRegistered(mediaId, tokenAddress, owner, metadataURI);
    }

    /**
     * @notice Set risk flags for a media token
     * @param mediaId Media identifier
     * @param flags Array of risk flags
     */
    function setRiskFlags(string calldata mediaId, RiskFlag[] calldata flags) external onlyRole(OPERATOR_ROLE) {
        require(_mediaRegistry[mediaId].exists, "MediaRegistry: not found");

        _mediaRegistry[mediaId].riskFlags = flags;

        emit RiskFlagsUpdated(mediaId, flags);
    }

    /**
     * @notice Update metadata URI
     * @param mediaId Media identifier
     * @param newURI New metadata URI
     */
    function updateMetadataURI(string calldata mediaId, string calldata newURI) external onlyRole(OPERATOR_ROLE) {
        require(_mediaRegistry[mediaId].exists, "MediaRegistry: not found");

        _mediaRegistry[mediaId].metadataURI = newURI;

        emit MetadataURIUpdated(mediaId, newURI);
    }

    /**
     * @notice Get media information
     * @param mediaId Media identifier
     * @return info Media information struct
     */
    function getMediaInfo(string calldata mediaId) external view returns (MediaInfo memory info) {
        require(_mediaRegistry[mediaId].exists, "MediaRegistry: not found");
        return _mediaRegistry[mediaId];
    }

    /**
     * @notice Check if media exists
     * @param mediaId Media identifier
     * @return exists True if media exists
     */
    function mediaExists(string calldata mediaId) external view returns (bool exists) {
        return _mediaRegistry[mediaId].exists;
    }

    /**
     * @notice Get token address for mediaId
     * @param mediaId Media identifier
     * @return tokenAddress Token address
     */
    function getTokenAddress(string calldata mediaId) external view returns (address tokenAddress) {
        require(_mediaRegistry[mediaId].exists, "MediaRegistry: not found");
        return _mediaRegistry[mediaId].tokenAddress;
    }

    /**
     * @notice Get total number of registered media
     * @return count Total count
     */
    function getTotalMediaCount() external view returns (uint256 count) {
        return _allMediaIds.length;
    }

    /**
     * @notice Get mediaId at index
     * @param index Index in array
     * @return mediaId Media identifier
     */
    function getMediaIdAt(uint256 index) external view returns (string memory mediaId) {
        require(index < _allMediaIds.length, "MediaRegistry: index out of bounds");
        return _allMediaIds[index];
    }
}
