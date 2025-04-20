// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title FarmFusionLiquidityPool
 * @dev Manages liquidity pools for agricultural assets on FarmFusion platform
 */
contract FarmFusionLiquidityPool {
    address public farmToken;
    address public owner;
    
    struct Pool {
        bytes32 assetId;       // Type of asset (wheat, rice, etc.)
        uint256 totalLiquidity; // Total amount of asset contributed
        uint256 totalStaked;   // Total FARM tokens staked
        uint256 apy;           // Annual percentage yield (in basis points, 100 = 1%)
        uint256 duration;      // Lock period in seconds
        uint256 createdAt;     // Creation timestamp
        bool active;           // Whether pool is active
    }
    
    struct Position {
        uint256 stakedAmount;  // Amount of FARM tokens staked
        uint256 timestamp;     // When the position was created
        bool claimed;          // Whether rewards were claimed
    }
    
    // Mapping of pool ID to Pool data
    mapping(uint256 => Pool) public pools;
    
    // Nested mapping: poolId => user => Position
    mapping(uint256 => mapping(address => Position)) public positions;
    
    // Active pool count
    uint256 public poolCount;
    
    // Events
    event PoolCreated(uint256 indexed poolId, bytes32 assetId, uint256 apy, uint256 duration);
    event Staked(address indexed user, uint256 indexed poolId, uint256 amount);
    event Unstaked(address indexed user, uint256 indexed poolId, uint256 amount, uint256 reward);
    
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
     * @dev Create a new liquidity pool
     * @param assetId Unique identifier for the asset
     * @param totalLiquidity Total amount of asset in the pool
     * @param apy Annual percentage yield in basis points
     * @param duration Lock period in seconds
     */
    function createPool(
        bytes32 assetId,
        uint256 totalLiquidity,
        uint256 apy,
        uint256 duration
    ) external onlyOwner {
        uint256 poolId = poolCount;
        pools[poolId] = Pool({
            assetId: assetId,
            totalLiquidity: totalLiquidity,
            totalStaked: 0,
            apy: apy,
            duration: duration,
            createdAt: block.timestamp,
            active: true
        });
        
        poolCount++;
        emit PoolCreated(poolId, assetId, apy, duration);
    }
    
    /**
     * @dev Stake FARM tokens in a pool
     * @param poolId ID of the pool to stake in
     * @param amount Amount of tokens to stake
     */
    function stake(uint256 poolId, uint256 amount) external {
        require(pools[poolId].active, "Pool not active");
        require(amount > 0, "Amount must be greater than 0");
        
        // Transfer tokens from user to this contract
        // Note: Requires prior approval from user
        bool success = IFARM(farmToken).transferFrom(msg.sender, address(this), amount);
        require(success, "Token transfer failed");
        
        positions[poolId][msg.sender] = Position({
            stakedAmount: positions[poolId][msg.sender].stakedAmount + amount,
            timestamp: block.timestamp,
            claimed: false
        });
        
        pools[poolId].totalStaked += amount;
        
        emit Staked(msg.sender, poolId, amount);
    }
    
    /**
     * @dev Calculate rewards for a position
     * @param poolId ID of the pool
     * @param user Address of the user
     * @return Calculated reward amount
     */
    function calculateReward(uint256 poolId, address user) public view returns (uint256) {
        Position memory position = positions[poolId][user];
        Pool memory pool = pools[poolId];
        
        if (position.stakedAmount == 0 || position.claimed) {
            return 0;
        }
        
        uint256 timeStaked = block.timestamp - position.timestamp;
        if (timeStaked < pool.duration) {
            return 0; // Not eligible yet
        }
        
        // Calculate reward: principal * APY * time / year
        return position.stakedAmount * pool.apy * timeStaked / (365 days * 10000);
    }
    
    /**
     * @dev Unstake tokens and claim rewards
     * @param poolId ID of the pool
     */
    function unstake(uint256 poolId) external {
        Position storage position = positions[poolId][msg.sender];
        require(position.stakedAmount > 0, "No stake found");
        require(!position.claimed, "Already claimed");
        
        Pool storage pool = pools[poolId];
        require(block.timestamp >= position.timestamp + pool.duration, "Lock period not over");
        
        uint256 reward = calculateReward(poolId, msg.sender);
        uint256 amount = position.stakedAmount;
        
        position.claimed = true;
        pool.totalStaked -= amount;
        
        // Transfer tokens back to user plus reward
        bool success = IFARM(farmToken).transfer(msg.sender, amount + reward);
        require(success, "Token transfer failed");
        
        emit Unstaked(msg.sender, poolId, amount, reward);
    }
    
    /**
     * @dev Emergency withdraw by admin (for Arbitrum Stylus gas optimization)
     * @param token Address of the token to withdraw
     * @param amount Amount to withdraw
     */
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        bool success = IFARM(token).transfer(owner, amount);
        require(success, "Token transfer failed");
    }
    
    /**
     * @dev Update pool status
     * @param poolId ID of the pool
     * @param active New active status
     */
    function updatePoolStatus(uint256 poolId, bool active) external onlyOwner {
        require(poolId < poolCount, "Pool does not exist");
        pools[poolId].active = active;
    }
    
    /**
     * @dev Update pool APY
     * @param poolId ID of the pool
     * @param apy New APY in basis points
     */
    function updatePoolAPY(uint256 poolId, uint256 apy) external onlyOwner {
        require(poolId < poolCount, "Pool does not exist");
        pools[poolId].apy = apy;
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