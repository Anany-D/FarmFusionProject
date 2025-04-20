import { ethers } from 'ethers';

// ABI for FarmToken contract (simplified for essential functions)
export const farmTokenABI = [
  // Read functions
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function owner() view returns (address)",
  "function assetPrices(bytes32 assetId) view returns (uint256)",
  "function verifiedFarmers(address farmer) view returns (bool)",
  
  // Write functions
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  
  // Events
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
  "event AssetPriceUpdated(bytes32 indexed assetId, uint256 price)",
  "event FarmerVerified(address indexed farmer, bool status)"
];

// ABI for FarmFusionLiquidityPool contract
export const liquidityPoolABI = [
  // Read functions
  "function farmToken() view returns (address)",
  "function owner() view returns (address)",
  "function pools(uint256 poolId) view returns (bytes32 assetId, uint256 totalLiquidity, uint256 totalStaked, uint256 apy, uint256 duration, uint256 createdAt, bool active)",
  "function positions(uint256 poolId, address user) view returns (uint256 stakedAmount, uint256 timestamp, bool claimed)",
  "function poolCount() view returns (uint256)",
  
  // Write functions
  "function createPool(bytes32 assetId, uint256 totalLiquidity, uint256 apy, uint256 duration)",
  "function stake(uint256 poolId, uint256 amount)",
  "function calculateReward(uint256 poolId, address user) view returns (uint256)",
  "function unstake(uint256 poolId)",
  
  // Events
  "event PoolCreated(uint256 indexed poolId, bytes32 assetId, uint256 apy, uint256 duration)",
  "event Staked(address indexed user, uint256 indexed poolId, uint256 amount)",
  "event Unstaked(address indexed user, uint256 indexed poolId, uint256 amount, uint256 reward)"
];

// ABI for FarmFusionMarketplace contract
export const marketplaceABI = [
  // Read functions
  "function farmToken() view returns (address)",
  "function owner() view returns (address)",
  "function items(uint256 itemId) view returns (address seller, bytes32 assetId, uint256 price, uint256 quantity, bool active)",
  "function offers(uint256 offerId) view returns (address buyer, address seller, uint256 itemId, uint256 quantity, uint256 price, bool accepted)",
  "function itemCount() view returns (uint256)",
  "function offerCount() view returns (uint256)",
  "function feePercentage() view returns (uint256)",
  
  // Write functions
  "function listItem(bytes32 assetId, uint256 price, uint256 quantity)",
  "function buyItem(uint256 itemId, uint256 quantity)",
  "function makeOffer(uint256 itemId, uint256 quantity, uint256 price)",
  "function acceptOffer(uint256 offerId)",
  "function executeBarter(address party2, bytes32 myAssetId, bytes32 theirAssetId)",
  
  // Events
  "event ItemListed(uint256 indexed itemId, address indexed seller, bytes32 assetId, uint256 price, uint256 quantity)",
  "event ItemSold(uint256 indexed itemId, address indexed buyer, address indexed seller, uint256 quantity, uint256 price)",
  "event OfferMade(uint256 indexed offerId, address indexed buyer, uint256 indexed itemId, uint256 quantity, uint256 price)",
  "event OfferAccepted(uint256 indexed offerId, address indexed seller, address indexed buyer)",
  "event BarterCompleted(address indexed party1, address indexed party2, bytes32 asset1, bytes32 asset2)"
];

// ABI for FarmFusionDAO contract
export const daoABI = [
  // Read functions
  "function farmToken() view returns (address)",
  "function owner() view returns (address)",
  "function proposals(uint256 proposalId) view returns (uint256 id, address proposer, string description, bytes32 proposalHash, uint256 votesFor, uint256 votesAgainst, uint256 startTime, uint256 endTime, bool executed)",
  "function hasVoted(uint256 proposalId, address voter) view returns (bool)",
  "function proposalCount() view returns (uint256)",
  "function proposalThreshold() view returns (uint256)",
  "function minVotingPeriod() view returns (uint256)",
  
  // Write functions
  "function createProposal(string description, bytes32 proposalHash, uint256 votingPeriod)",
  "function castVote(uint256 proposalId, bool support)",
  "function executeProposal(uint256 proposalId)",
  "function getProposal(uint256 proposalId) view returns (address proposer, string description, bytes32 proposalHash, uint256 votesFor, uint256 votesAgainst, uint256 startTime, uint256 endTime, bool executed)",
  "function hasProposalPassed(uint256 proposalId) view returns (bool)",
  
  // Events
  "event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string description)",
  "event VoteCast(uint256 indexed proposalId, address indexed voter, bool support, uint256 weight)",
  "event ProposalExecuted(uint256 indexed proposalId)"
];

// Contract addresses on Arbitrum (these would be updated after deployment)
export const CONTRACT_ADDRESSES = {
  // These are placeholder addresses - they should be updated after deployment
  FARM_TOKEN: "0x0000000000000000000000000000000000000000",
  LIQUIDITY_POOL: "0x0000000000000000000000000000000000000000",
  MARKETPLACE: "0x0000000000000000000000000000000000000000",
  DAO: "0x0000000000000000000000000000000000000000",
};

// Function to get contract instances
export async function getContracts(provider: ethers.BrowserProvider) {
  if (!provider) {
    throw new Error("Provider not available");
  }
  
  const signer = await provider.getSigner();
  
  const farmToken = new ethers.Contract(CONTRACT_ADDRESSES.FARM_TOKEN, farmTokenABI, signer);
  const liquidityPool = new ethers.Contract(CONTRACT_ADDRESSES.LIQUIDITY_POOL, liquidityPoolABI, signer);
  const marketplace = new ethers.Contract(CONTRACT_ADDRESSES.MARKETPLACE, marketplaceABI, signer);
  const dao = new ethers.Contract(CONTRACT_ADDRESSES.DAO, daoABI, signer);
  
  return {
    farmToken,
    liquidityPool,
    marketplace,
    dao
  };
}

// Helper function to convert raw amounts to token amounts with decimals
export function parseAmount(amount: string, decimals = 18) {
  return ethers.parseUnits(amount, decimals);
}

// Helper function to format token amounts from wei to standard units
export function formatAmount(amount: bigint, decimals = 18) {
  return ethers.formatUnits(amount, decimals);
}

// Helper function to convert string to bytes32
export function stringToBytes32(str: string) {
  return ethers.encodeBytes32String(str);
}

// Helper function to convert bytes32 to string
export function bytes32ToString(bytes32: string) {
  return ethers.decodeBytes32String(bytes32);
}

// Function to check if the user is on the correct network (Arbitrum)
export async function isArbitrumNetwork(provider: ethers.BrowserProvider) {
  if (!provider) return false;
  
  const network = await provider.getNetwork();
  // Arbitrum One chainId is 42161 (0xa4b1 in hex)
  return network.chainId.toString() === '42161';
}