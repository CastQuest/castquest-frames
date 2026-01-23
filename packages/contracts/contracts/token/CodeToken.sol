// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import {Errors} from "../libs/Errors.sol";

/**
 * @title CodeToken
 * @notice AI-generated code NFTs with execution tracking
 * @dev ERC-721 tokens representing AI-generated code snippets
 * 
 * ABI Stability:
 * - generateCode(address to, string prompt, string language, string codeHash)
 * - executeCode(uint256 tokenId, bytes input, bytes output)
 * - Events: CodeGenerated, CodeExecuted
 */
contract CodeToken is ERC721URIStorage, AccessControl {
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    bytes32 public constant GENERATOR_ROLE = keccak256("GENERATOR_ROLE");
    
    /// @notice Code metadata structure
    struct CodeAsset {
        uint256 tokenId;
        string language;
        string prompt;
        string codeHash; // IPFS hash or content hash
        uint256 generatedAt;
        uint256 executionCount;
        address generator;
        bool verified;
    }
    
    /// @notice Execution record
    struct Execution {
        uint256 timestamp;
        bytes32 inputHash;
        bytes32 outputHash;
        bool success;
    }
    
    /// @notice Counter for token IDs
    uint256 private _tokenIdCounter;
    
    /// @notice Token ID to code asset data
    mapping(uint256 => CodeAsset) public codeAssets;
    
    /// @notice Token ID to execution history
    mapping(uint256 => Execution[]) public executionHistory;
    
    /// @notice User address to owned code tokens
    mapping(address => uint256[]) public userCodeTokens;
    
    /// @notice Emitted when code is generated
    event CodeGenerated(
        address indexed to,
        uint256 indexed tokenId,
        string language,
        string prompt,
        address indexed generator
    );
    
    /// @notice Emitted when code is executed
    event CodeExecuted(
        address indexed executor,
        uint256 indexed tokenId,
        bool success,
        uint256 executionCount
    );
    
    /// @notice Emitted when code is verified
    event CodeVerified(uint256 indexed tokenId, address indexed verifier);
    
    constructor(address admin) ERC721("CastQuest Code", "CODE") {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(OPERATOR_ROLE, admin);
        _grantRole(GENERATOR_ROLE, admin);
    }
    
    /**
     * @notice Generate and mint a code NFT
     * @param to Recipient address
     * @param prompt AI prompt used to generate code
     * @param language Programming language
     * @param codeHash Hash or IPFS CID of the code
     */
    function generateCode(
        address to,
        string calldata prompt,
        string calldata language,
        string calldata codeHash
    ) external onlyRole(GENERATOR_ROLE) returns (uint256) {
        require(to != address(0), Errors.ZERO_ADDRESS);
        require(bytes(prompt).length > 0, "Empty prompt");
        require(bytes(language).length > 0, "Empty language");
        require(bytes(codeHash).length > 0, "Empty code hash");
        
        uint256 tokenId = ++_tokenIdCounter;
        _safeMint(to, tokenId);
        
        // Set token URI to IPFS hash
        _setTokenURI(tokenId, codeHash);
        
        codeAssets[tokenId] = CodeAsset({
            tokenId: tokenId,
            language: language,
            prompt: prompt,
            codeHash: codeHash,
            generatedAt: block.timestamp,
            executionCount: 0,
            generator: msg.sender,
            verified: false
        });
        
        userCodeTokens[to].push(tokenId);
        
        emit CodeGenerated(to, tokenId, language, prompt, msg.sender);
        
        return tokenId;
    }
    
    /**
     * @notice Record code execution
     * @param tokenId Code token ID
     * @param input Execution input (hashed)
     * @param output Execution output (hashed)
     * @param success Whether execution was successful
     */
    function executeCode(
        uint256 tokenId,
        bytes calldata input,
        bytes calldata output,
        bool success
    ) external {
        require(_ownerOf(tokenId) != address(0), "Code does not exist");
        
        CodeAsset storage asset = codeAssets[tokenId];
        asset.executionCount++;
        
        executionHistory[tokenId].push(Execution({
            timestamp: block.timestamp,
            inputHash: keccak256(input),
            outputHash: keccak256(output),
            success: success
        }));
        
        emit CodeExecuted(msg.sender, tokenId, success, asset.executionCount);
    }
    
    /**
     * @notice Verify code quality/safety
     * @param tokenId Code token ID
     */
    function verifyCode(uint256 tokenId) external onlyRole(OPERATOR_ROLE) {
        require(_ownerOf(tokenId) != address(0), "Code does not exist");
        require(!codeAssets[tokenId].verified, "Already verified");
        
        codeAssets[tokenId].verified = true;
        
        emit CodeVerified(tokenId, msg.sender);
    }
    
    /**
     * @notice Get code asset details
     * @param tokenId Token ID
     */
    function getCodeAsset(uint256 tokenId) external view returns (CodeAsset memory) {
        require(_ownerOf(tokenId) != address(0), "Code does not exist");
        return codeAssets[tokenId];
    }
    
    /**
     * @notice Get execution history for a code token
     * @param tokenId Token ID
     */
    function getExecutionHistory(uint256 tokenId)
        external
        view
        returns (Execution[] memory)
    {
        require(_ownerOf(tokenId) != address(0), "Code does not exist");
        return executionHistory[tokenId];
    }
    
    /**
     * @notice Get all code tokens for a user
     * @param user User address
     */
    function getUserCodeTokens(address user) external view returns (uint256[] memory) {
        return userCodeTokens[user];
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
