// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import {Errors} from "../libs/Errors.sol";

/**
 * @title QuestToken
 * @notice Quest completion rewards system with NFT-based achievements
 * @dev ERC-721 tokens representing completed quests with reward tracking
 * 
 * ABI Stability:
 * - completeQuest(address user, uint256 questId, uint256 reward)
 * - claimReward(uint256 tokenId)
 * - Events: QuestCreated, QuestCompleted, RewardClaimed
 */
contract QuestToken is ERC721, AccessControl {
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    
    /// @notice Quest metadata structure
    struct Quest {
        uint256 questId;
        uint256 rewardAmount;
        uint256 completedAt;
        bool rewardClaimed;
        string questType;
    }
    
    /// @notice Counter for token IDs
    uint256 private _tokenIdCounter;
    
    /// @notice Token ID to quest data
    mapping(uint256 => Quest) public quests;
    
    /// @notice User address to completed quest IDs
    mapping(address => uint256[]) public userQuests;
    
    /// @notice Quest ID to token ID
    mapping(uint256 => uint256) public questToToken;
    
    /// @notice Emitted when a new quest is created
    event QuestCreated(uint256 indexed questId, string questType, uint256 rewardAmount);
    
    /// @notice Emitted when a quest is completed
    event QuestCompleted(
        address indexed user,
        uint256 indexed questId,
        uint256 indexed tokenId,
        uint256 rewardAmount
    );
    
    /// @notice Emitted when a reward is claimed
    event RewardClaimed(address indexed user, uint256 indexed tokenId, uint256 amount);
    
    constructor(address admin) ERC721("CastQuest Quest", "QUEST") {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(OPERATOR_ROLE, admin);
    }
    
    /**
     * @notice Complete a quest and mint achievement NFT
     * @param user Address of the user completing the quest
     * @param questId Unique quest identifier
     * @param reward Reward amount for completion
     * @param questType Type of quest (e.g., "social", "game", "code")
     */
    function completeQuest(
        address user,
        uint256 questId,
        uint256 reward,
        string calldata questType
    ) external onlyRole(OPERATOR_ROLE) returns (uint256) {
        require(user != address(0), Errors.ZERO_ADDRESS);
        require(questToToken[questId] == 0, "Quest already completed");
        
        uint256 tokenId = ++_tokenIdCounter;
        _safeMint(user, tokenId);
        
        quests[tokenId] = Quest({
            questId: questId,
            rewardAmount: reward,
            completedAt: block.timestamp,
            rewardClaimed: false,
            questType: questType
        });
        
        questToToken[questId] = tokenId;
        userQuests[user].push(tokenId);
        
        emit QuestCompleted(user, questId, tokenId, reward);
        
        return tokenId;
    }
    
    /**
     * @notice Claim reward for completed quest
     * @param tokenId Token ID of the completed quest
     */
    function claimReward(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Not quest owner");
        Quest storage quest = quests[tokenId];
        require(!quest.rewardClaimed, "Reward already claimed");
        require(quest.rewardAmount > 0, "No reward available");
        
        quest.rewardClaimed = true;
        
        // Transfer reward (assumes contract has been funded)
        (bool success, ) = msg.sender.call{value: quest.rewardAmount}("");
        require(success, Errors.TRANSFER_FAILED);
        
        emit RewardClaimed(msg.sender, tokenId, quest.rewardAmount);
    }
    
    /**
     * @notice Get all quest tokens for a user
     * @param user User address
     */
    function getUserQuests(address user) external view returns (uint256[] memory) {
        return userQuests[user];
    }
    
    /**
     * @notice Get quest details
     * @param tokenId Token ID
     */
    function getQuestDetails(uint256 tokenId) external view returns (Quest memory) {
        require(_ownerOf(tokenId) != address(0), "Quest does not exist");
        return quests[tokenId];
    }
    
    /**
     * @notice Fund contract with ETH for rewards
     */
    receive() external payable {}
    
    /**
     * @notice Emergency withdraw funds
     * @param to Recipient address
     */
    function emergencyWithdraw(address payable to) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(to != address(0), Errors.ZERO_ADDRESS);
        uint256 balance = address(this).balance;
        (bool success, ) = to.call{value: balance}("");
        require(success, Errors.TRANSFER_FAILED);
    }
    
    // Required overrides
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
