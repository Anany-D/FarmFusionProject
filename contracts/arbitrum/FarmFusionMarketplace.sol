// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title FarmFusionMarketplace
 * @dev Marketplace contract for buying, selling, and bartering agricultural products
 */
contract FarmFusionMarketplace {
    address public farmToken;
    address public owner;
    
    struct Item {
        address seller;
        bytes32 assetId;
        uint256 price;
        uint256 quantity;
        bool active;
    }
    
    struct Offer {
        address buyer;
        address seller;
        uint256 itemId;
        uint256 quantity;
        uint256 price;
        bool accepted;
    }
    
    mapping(uint256 => Item) public items;
    mapping(uint256 => Offer) public offers;
    
    uint256 public itemCount;
    uint256 public offerCount;
    uint256 public feePercentage = 200; // 2% fee (in basis points)
    
    // Events
    event ItemListed(uint256 indexed itemId, address indexed seller, bytes32 assetId, uint256 price, uint256 quantity);
    event ItemSold(uint256 indexed itemId, address indexed buyer, address indexed seller, uint256 quantity, uint256 price);
    event OfferMade(uint256 indexed offerId, address indexed buyer, uint256 indexed itemId, uint256 quantity, uint256 price);
    event OfferAccepted(uint256 indexed offerId, address indexed seller, address indexed buyer);
    event BarterCompleted(address indexed party1, address indexed party2, bytes32 asset1, bytes32 asset2);
    
    /**
     * @dev Constructor sets the FarmToken address and owner
     * @param _farmTokenAddress Address of the FarmToken contract
     */
    constructor(address _farmTokenAddress) {
        farmToken = _farmTokenAddress;
        owner = msg.sender;
    }
    
    /**
     * @dev Modifier to restrict function access to contract owner
     */
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    /**
     * @dev List a new item for sale
     * @param assetId Unique identifier for the asset
     * @param price Price per unit in FARM tokens
     * @param quantity Quantity available for sale
     */
    function listItem(bytes32 assetId, uint256 price, uint256 quantity) external {
        require(price > 0, "Price must be greater than 0");
        require(quantity > 0, "Quantity must be greater than 0");
        
        uint256 itemId = itemCount;
        
        items[itemId] = Item({
            seller: msg.sender,
            assetId: assetId,
            price: price,
            quantity: quantity,
            active: true
        });
        
        itemCount++;
        
        emit ItemListed(itemId, msg.sender, assetId, price, quantity);
    }
    
    /**
     * @dev Buy an item directly
     * @param itemId ID of the item to buy
     * @param quantity Quantity to buy
     */
    function buyItem(uint256 itemId, uint256 quantity) external {
        Item storage item = items[itemId];
        
        require(item.active, "Item not active");
        require(quantity > 0 && quantity <= item.quantity, "Invalid quantity");
        
        uint256 totalPrice = item.price * quantity;
        uint256 fee = totalPrice * feePercentage / 10000;
        uint256 sellerAmount = totalPrice - fee;
        
        // Update item quantity
        item.quantity -= quantity;
        if (item.quantity == 0) {
            item.active = false;
        }
        
        // Transfer tokens
        bool transferToSeller = IFARM(farmToken).transferFrom(msg.sender, item.seller, sellerAmount);
        require(transferToSeller, "Transfer to seller failed");
        
        bool transferToOwner = IFARM(farmToken).transferFrom(msg.sender, owner, fee);
        require(transferToOwner, "Transfer of fee failed");
        
        emit ItemSold(itemId, msg.sender, item.seller, quantity, totalPrice);
    }
    
    /**
     * @dev Make an offer for an item
     * @param itemId ID of the item
     * @param quantity Quantity to buy
     * @param price Offered price per unit
     */
    function makeOffer(uint256 itemId, uint256 quantity, uint256 price) external {
        require(items[itemId].active, "Item not active");
        require(quantity > 0 && quantity <= items[itemId].quantity, "Invalid quantity");
        
        uint256 offerId = offerCount;
        
        offers[offerId] = Offer({
            buyer: msg.sender,
            seller: items[itemId].seller,
            itemId: itemId,
            quantity: quantity,
            price: price,
            accepted: false
        });
        
        offerCount++;
        
        emit OfferMade(offerId, msg.sender, itemId, quantity, price);
    }
    
    /**
     * @dev Accept an offer
     * @param offerId ID of the offer to accept
     */
    function acceptOffer(uint256 offerId) external {
        Offer storage offer = offers[offerId];
        require(!offer.accepted, "Offer already accepted");
        require(offer.seller == msg.sender, "Not the seller");
        
        Item storage item = items[offer.itemId];
        require(item.active, "Item not active");
        require(offer.quantity <= item.quantity, "Insufficient quantity");
        
        uint256 totalPrice = offer.price * offer.quantity;
        uint256 fee = totalPrice * feePercentage / 10000;
        uint256 sellerAmount = totalPrice - fee;
        
        // Update item and offer
        item.quantity -= offer.quantity;
        if (item.quantity == 0) {
            item.active = false;
        }
        offer.accepted = true;
        
        // Transfer tokens
        bool transferToSeller = IFARM(farmToken).transferFrom(offer.buyer, msg.sender, sellerAmount);
        require(transferToSeller, "Transfer to seller failed");
        
        bool transferToOwner = IFARM(farmToken).transferFrom(offer.buyer, owner, fee);
        require(transferToOwner, "Transfer of fee failed");
        
        emit OfferAccepted(offerId, msg.sender, offer.buyer);
    }
    
    /**
     * @dev Execute a barter trade directly (no tokens needed)
     * @param party2 Address of the second party
     * @param myAssetId ID of the asset offered
     * @param theirAssetId ID of the asset requested
     */
    function executeBarter(
        address party2,
        bytes32 myAssetId,
        bytes32 theirAssetId
    ) external {
        emit BarterCompleted(msg.sender, party2, myAssetId, theirAssetId);
        // Actual asset transfer happens off-chain but is recorded on blockchain
    }
    
    /**
     * @dev Set marketplace fee
     * @param _feePercentage New fee percentage in basis points
     */
    function setFeePercentage(uint256 _feePercentage) external onlyOwner {
        require(_feePercentage <= 1000, "Fee too high"); // Max 10%
        feePercentage = _feePercentage;
    }
    
    /**
     * @dev Update item status
     * @param itemId ID of the item
     * @param active New active status
     */
    function updateItemStatus(uint256 itemId, bool active) external {
        require(items[itemId].seller == msg.sender || msg.sender == owner, "Not authorized");
        items[itemId].active = active;
    }
    
    /**
     * @dev Transfer ownership of the contract
     * @param newOwner Address of the new owner
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "New owner cannot be zero address");
        owner = newOwner;
    }
}

/**
 * @dev Interface for FarmToken to enable interaction
 */
interface IFARM {
    function transferFrom(address from, address to, uint256 value) external returns (bool);
    function transfer(address to, uint256 value) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}