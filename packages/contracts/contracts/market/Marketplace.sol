// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import {Errors} from "../libs/Errors.sol";

/**
 * @title Marketplace
 * @notice Unified marketplace for trading all CastQuest tokens (NFTs and ERC20s)
 * @dev Supports listings, offers, and auctions with fee collection
 * 
 * ABI Stability:
 * - listItem(address token, uint256 tokenId, uint256 price, bool isNFT)
 * - buyItem(uint256 listingId)
 * - cancelListing(uint256 listingId)
 * - Events: ItemListed, ItemSold, ListingCancelled
 */
contract Marketplace is ReentrancyGuard, AccessControl {
    using SafeERC20 for IERC20;
    
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    
    /// @notice Listing structure
    struct Listing {
        uint256 listingId;
        address seller;
        address tokenContract;
        uint256 tokenId;
        uint256 price;
        bool isNFT;
        bool active;
        uint256 listedAt;
    }
    
    /// @notice Sale record
    struct Sale {
        uint256 listingId;
        address buyer;
        address seller;
        uint256 price;
        uint256 timestamp;
    }
    
    /// @notice Fee manager address
    address public feeManager;
    
    /// @notice Market fee in basis points (5% total to match FeeManagerV3)
    uint256 public marketFeeBps = 500;
    uint256 public constant BPS_DENOMINATOR = 10000;
    
    /// @notice Listing counter
    uint256 private _listingIdCounter;
    
    /// @notice Listing ID to listing data
    mapping(uint256 => Listing) public listings;
    
    /// @notice Sale history
    Sale[] public salesHistory;
    
    /// @notice User to their listings
    mapping(address => uint256[]) public userListings;
    
    /// @notice Emitted when item is listed
    event ItemListed(
        uint256 indexed listingId,
        address indexed seller,
        address indexed tokenContract,
        uint256 tokenId,
        uint256 price,
        bool isNFT
    );
    
    /// @notice Emitted when item is sold
    event ItemSold(
        uint256 indexed listingId,
        address indexed buyer,
        address indexed seller,
        uint256 price,
        uint256 fee
    );
    
    /// @notice Emitted when listing is cancelled
    event ListingCancelled(uint256 indexed listingId, address indexed seller);
    
    /// @notice Emitted when market fee is updated
    event MarketFeeUpdated(uint256 oldFee, uint256 newFee);
    
    constructor(address _feeManager) {
        require(_feeManager != address(0), Errors.ZERO_ADDRESS);
        feeManager = _feeManager;
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(OPERATOR_ROLE, msg.sender);
    }
    
    /**
     * @notice List an NFT for sale
     * @param tokenContract NFT contract address
     * @param tokenId Token ID
     * @param price Sale price in wei
     * @param isNFT Must be true (ERC-20 listings not supported)
     */
    function listItem(
        address tokenContract,
        uint256 tokenId,
        uint256 price,
        bool isNFT
    ) external nonReentrant returns (uint256) {
        require(tokenContract != address(0), Errors.ZERO_ADDRESS);
        require(price > 0, Errors.ZERO_AMOUNT);
        require(isNFT, "ERC20 listings not supported");
        
        // Verify NFT ownership
        require(
            IERC721(tokenContract).ownerOf(tokenId) == msg.sender,
            "Not token owner"
        );
        // Transfer NFT to marketplace
        IERC721(tokenContract).transferFrom(msg.sender, address(this), tokenId);
        
        uint256 listingId = ++_listingIdCounter;
        
        listings[listingId] = Listing({
            listingId: listingId,
            seller: msg.sender,
            tokenContract: tokenContract,
            tokenId: tokenId,
            price: price,
            isNFT: isNFT,
            active: true,
            listedAt: block.timestamp
        });
        
        userListings[msg.sender].push(listingId);
        
        emit ItemListed(listingId, msg.sender, tokenContract, tokenId, price, isNFT);
        
        return listingId;
    }
    
    /**
     * @notice Buy a listed item
     * @param listingId Listing ID
     */
    function buyItem(uint256 listingId) external payable nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.active, "Listing not active");
        require(msg.value == listing.price, "Incorrect payment amount");
        require(msg.sender != listing.seller, "Cannot buy own listing");
        
        // Mark as sold
        listing.active = false;
        
        // Calculate fees
        uint256 fee = (listing.price * marketFeeBps) / BPS_DENOMINATOR;
        uint256 sellerAmount = listing.price - fee;
        
        // Transfer NFT to buyer
        IERC721(listing.tokenContract).transferFrom(
            address(this),
            msg.sender,
            listing.tokenId
        );
        
        // Transfer payment to seller
        (bool successSeller, ) = listing.seller.call{value: sellerAmount}("");
        require(successSeller, Errors.TRANSFER_FAILED);
        
        // Transfer fee to fee manager via collectFees
        if (fee > 0) {
            // Note: Marketplace has OPERATOR_ROLE granted in deployment
            (bool successFee, ) = feeManager.call{value: fee}(
                abi.encodeWithSignature("collectFees(address,uint256)", address(0), fee)
            );
            require(successFee, "Fee collection failed");
        }
        
        // Record sale
        salesHistory.push(Sale({
            listingId: listingId,
            buyer: msg.sender,
            seller: listing.seller,
            price: listing.price,
            timestamp: block.timestamp
        }));
        
        emit ItemSold(listingId, msg.sender, listing.seller, listing.price, fee);
    }
    
    /**
     * @notice Cancel a listing
     * @param listingId Listing ID
     */
    function cancelListing(uint256 listingId) external nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.active, "Listing not active");
        require(msg.sender == listing.seller, "Not listing owner");
        
        listing.active = false;
        
        // Return NFT to seller if applicable
        if (listing.isNFT) {
            IERC721(listing.tokenContract).transferFrom(
                address(this),
                listing.seller,
                listing.tokenId
            );
        }
        
        emit ListingCancelled(listingId, msg.sender);
    }
    
    /**
     * @notice Update market fee
     * @param newFeeBps New fee in basis points
     */
    function setMarketFee(uint256 newFeeBps) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newFeeBps <= 1000, "Fee too high"); // Max 10%
        uint256 oldFee = marketFeeBps;
        marketFeeBps = newFeeBps;
        emit MarketFeeUpdated(oldFee, newFeeBps);
    }
    
    /**
     * @notice Update fee manager
     * @param newFeeManager New fee manager address
     */
    function setFeeManager(address newFeeManager) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newFeeManager != address(0), Errors.ZERO_ADDRESS);
        feeManager = newFeeManager;
    }
    
    /**
     * @notice Get listing details
     * @param listingId Listing ID
     */
    function getListing(uint256 listingId) external view returns (Listing memory) {
        return listings[listingId];
    }
    
    /**
     * @notice Get user listings
     * @param user User address
     */
    function getUserListings(address user) external view returns (uint256[] memory) {
        return userListings[user];
    }
    
    /**
     * @notice Get sales count
     */
    function getSalesCount() external view returns (uint256) {
        return salesHistory.length;
    }
    
    /**
     * @notice Get active listings count
     */
    function getActiveListingsCount() external view returns (uint256 count) {
        for (uint256 i = 1; i <= _listingIdCounter; i++) {
            if (listings[i].active) {
                count++;
            }
        }
    }
}
