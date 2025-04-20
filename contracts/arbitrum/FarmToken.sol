// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title FarmToken
 * @dev ERC-20 Token for FarmFusion platform with Arbitrum Stylus optimization
 */
contract FarmToken {
    string public name = "FarmFusion Token";
    string public symbol = "FARM";
    uint8 public decimals = 18;
    uint256 public totalSupply;
    
    // Owner of the contract
    address public owner;
    
    // Balances for each account
    mapping(address => uint256) public balanceOf;
    
    // Owner of account approves the transfer of an amount to another account
    mapping(address => mapping(address => uint256)) public allowance;
    
    // Token pricing for agricultural assets (in tokens per kg/unit)
    mapping(bytes32 => uint256) public assetPrices;
    
    // Verified farmers
    mapping(address => bool) public verifiedFarmers;
    
    // Events - make it easy to track token activity
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event AssetPriceUpdated(bytes32 indexed assetId, uint256 price);
    event FarmerVerified(address indexed farmer, bool status);
    
    /**
     * @dev Constructor assigns the initial supply to the creator
     */
    constructor() {
        owner = msg.sender;
        // Initial supply for platform reserves (1 million tokens)
        totalSupply = 1_000_000 * 10**uint256(decimals);
        balanceOf[owner] = totalSupply;
        
        emit Transfer(address(0), owner, totalSupply);
    }
    
    /**
     * @dev Modifier to restrict function access to contract owner
     */
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    /**
     * @dev Transfer tokens from sender to another account
     * @param _to The address to transfer to
     * @param _value The amount to be transferred
     * @return success True if the transfer was successful
     */
    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(_to != address(0), "Cannot transfer to zero address");
        require(balanceOf[msg.sender] >= _value, "Insufficient balance");
        
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        
        emit Transfer(msg.sender, _to, _value);
        return true;
    }
    
    /**
     * @dev Approve the passed address to spend the specified amount of tokens on behalf of msg.sender
     * @param _spender The address which will spend the funds
     * @param _value The amount of tokens to be spent
     * @return success True if the approval was successful
     */
    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }
    
    /**
     * @dev Transfer tokens from one address to another
     * @param _from The address which you want to send tokens from
     * @param _to The address which you want to transfer to
     * @param _value The amount of tokens to be transferred
     * @return success True if the transfer was successful
     */
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(_to != address(0), "Cannot transfer to zero address");
        require(balanceOf[_from] >= _value, "Insufficient balance");
        require(allowance[_from][msg.sender] >= _value, "Allowance exceeded");
        
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        
        emit Transfer(_from, _to, _value);
        return true;
    }
    
    /**
     * @dev Update the price of an agricultural asset
     * @param assetId The unique identifier for the asset
     * @param price The price per unit in tokens
     */
    function updateAssetPrice(bytes32 assetId, uint256 price) external onlyOwner {
        assetPrices[assetId] = price;
        emit AssetPriceUpdated(assetId, price);
    }
    
    /**
     * @dev Set the verification status for a farmer
     * @param farmer The address of the farmer
     * @param status The verification status
     */
    function setFarmerVerification(address farmer, bool status) external onlyOwner {
        verifiedFarmers[farmer] = status;
        emit FarmerVerified(farmer, status);
    }
    
    /**
     * @dev Mint tokens to verified farmers based on asset contributions
     * @param farmer The address of the farmer
     * @param assetId The unique identifier for the contributed asset
     * @param amount The amount of the asset contributed
     */
    function mintForAssetContribution(
        address farmer,
        bytes32 assetId,
        uint256 amount
    ) external onlyOwner {
        require(verifiedFarmers[farmer], "Not a verified farmer");
        require(assetPrices[assetId] > 0, "Asset not priced");
        
        uint256 tokensToMint = amount * assetPrices[assetId];
        
        totalSupply += tokensToMint;
        balanceOf[farmer] += tokensToMint;
        
        emit Transfer(address(0), farmer, tokensToMint);
    }
    
    /**
     * @dev Mint tokens (owner only)
     * @param to The address to mint tokens to
     * @param amount The amount to mint
     */
    function mint(address to, uint256 amount) external onlyOwner {
        totalSupply += amount;
        balanceOf[to] += amount;
        
        emit Transfer(address(0), to, amount);
    }
    
    /**
     * @dev Burn tokens (reduced from sender's balance)
     * @param amount The amount to burn
     */
    function burn(uint256 amount) external {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        
        balanceOf[msg.sender] -= amount;
        totalSupply -= amount;
        
        emit Transfer(msg.sender, address(0), amount);
    }
    
    /**
     * @dev Transfer ownership of the contract
     * @param newOwner The address of the new owner
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "New owner cannot be zero address");
        owner = newOwner;
    }
}