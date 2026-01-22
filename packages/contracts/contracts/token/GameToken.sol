// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import {Errors} from "../libs/Errors.sol";

/**
 * @title GameToken
 * @notice Game asset minting and management system
 * @dev ERC-721 tokens representing in-game assets with play tracking
 * 
 * ABI Stability:
 * - mintGameAsset(address to, string uri, string gameType)
 * - playGame(uint256 tokenId, uint256 score, bytes gameData)
 * - Events: GameMinted, GamePlayed, GameScored
 */
contract GameToken is ERC721URIStorage, AccessControl {
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    
    /// @notice Game asset metadata
    struct GameAsset {
        uint256 tokenId;
        string gameType;
        uint256 mintedAt;
        uint256 lastPlayedAt;
        uint256 playCount;
        uint256 highScore;
        address creator;
    }
    
    /// @notice Counter for token IDs
    uint256 private _tokenIdCounter;
    
    /// @notice Token ID to game asset data
    mapping(uint256 => GameAsset) public gameAssets;
    
    /// @notice User address to owned game tokens
    mapping(address => uint256[]) public userGameTokens;
    
    /// @notice Emitted when a game asset is minted
    event GameMinted(
        address indexed to,
        uint256 indexed tokenId,
        string gameType,
        address indexed creator
    );
    
    /// @notice Emitted when a game is played
    event GamePlayed(
        address indexed player,
        uint256 indexed tokenId,
        uint256 score,
        uint256 playCount
    );
    
    /// @notice Emitted when a new high score is achieved
    event GameScored(
        address indexed player,
        uint256 indexed tokenId,
        uint256 oldScore,
        uint256 newScore
    );
    
    constructor(address admin) ERC721("CastQuest Game", "GAME") {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(OPERATOR_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
    }
    
    /**
     * @notice Mint a new game asset
     * @param to Recipient address
     * @param uri Token URI (metadata)
     * @param gameType Type of game (e.g., "puzzle", "action", "strategy")
     */
    function mintGameAsset(
        address to,
        string calldata uri,
        string calldata gameType
    ) external onlyRole(MINTER_ROLE) returns (uint256) {
        require(to != address(0), Errors.ZERO_ADDRESS);
        require(bytes(uri).length > 0, "Empty URI");
        require(bytes(gameType).length > 0, "Empty game type");
        
        uint256 tokenId = ++_tokenIdCounter;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        
        gameAssets[tokenId] = GameAsset({
            tokenId: tokenId,
            gameType: gameType,
            mintedAt: block.timestamp,
            lastPlayedAt: 0,
            playCount: 0,
            highScore: 0,
            creator: msg.sender
        });
        
        userGameTokens[to].push(tokenId);
        
        emit GameMinted(to, tokenId, gameType, msg.sender);
        
        return tokenId;
    }
    
    /**
     * @notice Record a game play session
     * @param tokenId Game token ID
     * @param score Score achieved
     * @param gameData Additional game data (encoded)
     */
    function playGame(
        uint256 tokenId,
        uint256 score,
        bytes calldata gameData
    ) external {
        require(_ownerOf(tokenId) != address(0), "Game does not exist");
        
        GameAsset storage asset = gameAssets[tokenId];
        asset.lastPlayedAt = block.timestamp;
        asset.playCount++;
        
        emit GamePlayed(msg.sender, tokenId, score, asset.playCount);
        
        // Check for high score
        if (score > asset.highScore) {
            uint256 oldScore = asset.highScore;
            asset.highScore = score;
            emit GameScored(msg.sender, tokenId, oldScore, score);
        }
    }
    
    /**
     * @notice Get game asset details
     * @param tokenId Token ID
     */
    function getGameAsset(uint256 tokenId) external view returns (GameAsset memory) {
        require(_ownerOf(tokenId) != address(0), "Game does not exist");
        return gameAssets[tokenId];
    }
    
    /**
     * @notice Get all game tokens for a user
     * @param user User address
     */
    function getUserGameTokens(address user) external view returns (uint256[] memory) {
        return userGameTokens[user];
    }
    
    /**
     * @notice Get leaderboard for a specific game type
     * @param gameType Type of game
     * @param limit Maximum number of results
     */
    function getLeaderboard(string calldata gameType, uint256 limit)
        external
        view
        returns (uint256[] memory tokenIds, uint256[] memory scores)
    {
        // Simplified leaderboard - in production, use off-chain indexing
        uint256[] memory tempIds = new uint256[](limit);
        uint256[] memory tempScores = new uint256[](limit);
        uint256 count = 0;
        
        for (uint256 i = 1; i <= _tokenIdCounter && count < limit; i++) {
            if (keccak256(bytes(gameAssets[i].gameType)) == keccak256(bytes(gameType))) {
                tempIds[count] = i;
                tempScores[count] = gameAssets[i].highScore;
                count++;
            }
        }
        
        return (tempIds, tempScores);
    }
    
    // Required overrides
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
