// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import {Errors} from "../libs/Errors.sol";

/**
 * @title SponsorToken
 * @notice Creator sponsorship system with ERC-20 tokens
 * @dev Allows users to sponsor creators with fungible tokens
 * 
 * ABI Stability:
 * - sponsor(address creator, uint256 amount)
 * - withdrawSponsorship(address creator, uint256 amount)
 * - Events: Sponsored, SponsorshipWithdrawn, CreatorRegistered
 */
contract SponsorToken is ERC20, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    
    /// @notice Creator sponsorship data
    struct Creator {
        uint256 totalSponsored;
        uint256 sponsorCount;
        bool registered;
        string profile; // IPFS hash or metadata
    }
    
    /// @notice Individual sponsorship record
    struct Sponsorship {
        address sponsor;
        address creator;
        uint256 amount;
        uint256 timestamp;
        bool active;
    }
    
    /// @notice Creator address to creator data
    mapping(address => Creator) public creators;
    
    /// @notice Sponsor to creator to sponsorship amount
    mapping(address => mapping(address => uint256)) public sponsorships;
    
    /// @notice All sponsorship records
    Sponsorship[] public sponsorshipHistory;
    
    /// @notice Emitted when a creator is registered
    event CreatorRegistered(address indexed creator, string profile);
    
    /// @notice Emitted when a creator is sponsored
    event Sponsored(
        address indexed sponsor,
        address indexed creator,
        uint256 amount,
        uint256 totalSponsored
    );
    
    /// @notice Emitted when sponsorship is withdrawn
    event SponsorshipWithdrawn(
        address indexed sponsor,
        address indexed creator,
        uint256 amount,
        uint256 remaining
    );
    
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }
    
    /**
     * @notice Register as a creator
     * @param profile IPFS hash or metadata URL
     */
    function registerCreator(string calldata profile) external {
        require(!creators[msg.sender].registered, "Already registered");
        require(bytes(profile).length > 0, "Empty profile");
        
        creators[msg.sender] = Creator({
            totalSponsored: 0,
            sponsorCount: 0,
            registered: true,
            profile: profile
        });
        
        emit CreatorRegistered(msg.sender, profile);
    }
    
    /**
     * @notice Sponsor a creator
     * @param creator Creator address
     * @param amount Amount of tokens to sponsor
     */
    function sponsor(address creator, uint256 amount) external {
        require(creator != address(0), Errors.ZERO_ADDRESS);
        require(amount > 0, Errors.ZERO_AMOUNT);
        require(creators[creator].registered, "Creator not registered");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        
        // Transfer tokens from sponsor to this contract
        _transfer(msg.sender, address(this), amount);
        
        // Update sponsorship records
        if (sponsorships[msg.sender][creator] == 0) {
            creators[creator].sponsorCount++;
        }
        
        sponsorships[msg.sender][creator] += amount;
        creators[creator].totalSponsored += amount;
        
        // Record sponsorship
        sponsorshipHistory.push(Sponsorship({
            sponsor: msg.sender,
            creator: creator,
            amount: amount,
            timestamp: block.timestamp,
            active: true
        }));
        
        emit Sponsored(msg.sender, creator, amount, creators[creator].totalSponsored);
    }
    
    /**
     * @notice Withdraw sponsorship tokens
     * @param creator Creator address
     * @param amount Amount to withdraw
     */
    function withdrawSponsorship(address creator, uint256 amount) external {
        require(creator != address(0), Errors.ZERO_ADDRESS);
        require(amount > 0, Errors.ZERO_AMOUNT);
        require(sponsorships[msg.sender][creator] >= amount, "Insufficient sponsorship");
        
        sponsorships[msg.sender][creator] -= amount;
        creators[creator].totalSponsored -= amount;
        
        // Transfer tokens back to sponsor
        _transfer(address(this), msg.sender, amount);
        
        uint256 remaining = sponsorships[msg.sender][creator];
        if (remaining == 0) {
            creators[creator].sponsorCount--;
        }
        
        emit SponsorshipWithdrawn(msg.sender, creator, amount, remaining);
    }
    
    /**
     * @notice Mint tokens (for rewards, airdrops, etc.)
     * @param to Recipient address
     * @param amount Amount to mint
     */
    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        require(to != address(0), Errors.ZERO_ADDRESS);
        require(amount > 0, Errors.ZERO_AMOUNT);
        _mint(to, amount);
    }
    
    /**
     * @notice Get creator details
     * @param creator Creator address
     */
    function getCreator(address creator) external view returns (Creator memory) {
        return creators[creator];
    }
    
    /**
     * @notice Get sponsorship amount
     * @param sponsor Sponsor address
     * @param creator Creator address
     */
    function getSponsorship(address sponsor, address creator)
        external
        view
        returns (uint256)
    {
        return sponsorships[sponsor][creator];
    }
    
    /**
     * @notice Get total sponsorships count
     */
    function getSponsorshipCount() external view returns (uint256) {
        return sponsorshipHistory.length;
    }
}
