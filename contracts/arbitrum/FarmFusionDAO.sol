// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title FarmFusionDAO
 * @dev Governance contract for FarmFusion platform
 */
contract FarmFusionDAO {
    address public farmToken;
    address public owner;
    
    struct Proposal {
        uint256 id;
        address proposer;
        string description;
        bytes32 proposalHash;  // Hash of the proposal details
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 startTime;
        uint256 endTime;
        bool executed;
    }
    
    // Mapping of proposal ID to Proposal
    mapping(uint256 => Proposal) public proposals;
    
    // Mapping to track if an address has voted on a proposal
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    
    // Proposal count
    uint256 public proposalCount;
    
    // Minimum token balance to create a proposal
    uint256 public proposalThreshold = 100 * 10**18; // 100 FARM tokens
    
    // Minimum duration of a proposal voting period (in seconds)
    uint256 public minVotingPeriod = 3 days;
    
    // Events
    event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string description);
    event VoteCast(uint256 indexed proposalId, address indexed voter, bool support, uint256 weight);
    event ProposalExecuted(uint256 indexed proposalId);
    
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
     * @dev Create a new proposal
     * @param description Description of the proposal
     * @param proposalHash Hash of the proposal details
     * @param votingPeriod Duration of the voting period in seconds
     */
    function createProposal(
        string calldata description,
        bytes32 proposalHash,
        uint256 votingPeriod
    ) external {
        require(IFARM(farmToken).balanceOf(msg.sender) >= proposalThreshold, "Below proposal threshold");
        require(votingPeriod >= minVotingPeriod, "Voting period too short");
        
        uint256 proposalId = proposalCount;
        proposalCount++;
        
        proposals[proposalId] = Proposal({
            id: proposalId,
            proposer: msg.sender,
            description: description,
            proposalHash: proposalHash,
            votesFor: 0,
            votesAgainst: 0,
            startTime: block.timestamp,
            endTime: block.timestamp + votingPeriod,
            executed: false
        });
        
        emit ProposalCreated(proposalId, msg.sender, description);
    }
    
    /**
     * @dev Cast a vote on a proposal
     * @param proposalId ID of the proposal
     * @param support Whether to support the proposal
     */
    function castVote(uint256 proposalId, bool support) external {
        Proposal storage proposal = proposals[proposalId];
        
        require(block.timestamp >= proposal.startTime, "Voting not started");
        require(block.timestamp < proposal.endTime, "Voting ended");
        require(!hasVoted[proposalId][msg.sender], "Already voted");
        
        uint256 votes = IFARM(farmToken).balanceOf(msg.sender);
        require(votes > 0, "No voting power");
        
        hasVoted[proposalId][msg.sender] = true;
        
        if (support) {
            proposal.votesFor += votes;
        } else {
            proposal.votesAgainst += votes;
        }
        
        emit VoteCast(proposalId, msg.sender, support, votes);
    }
    
    /**
     * @dev Execute a successful proposal
     * @param proposalId ID of the proposal
     */
    function executeProposal(uint256 proposalId) external {
        Proposal storage proposal = proposals[proposalId];
        
        require(block.timestamp >= proposal.endTime, "Voting still active");
        require(!proposal.executed, "Already executed");
        require(proposal.votesFor > proposal.votesAgainst, "Proposal failed");
        
        proposal.executed = true;
        
        emit ProposalExecuted(proposalId);
        // Actual execution logic handled by governance multisig or external calls
    }
    
    /**
     * @dev Update proposal threshold
     * @param _proposalThreshold New threshold in tokens
     */
    function setProposalThreshold(uint256 _proposalThreshold) external onlyOwner {
        proposalThreshold = _proposalThreshold;
    }
    
    /**
     * @dev Update minimum voting period
     * @param _minVotingPeriod New minimum voting period in seconds
     */
    function setMinVotingPeriod(uint256 _minVotingPeriod) external onlyOwner {
        minVotingPeriod = _minVotingPeriod;
    }
    
    /**
     * @dev Get proposal details
     * @param proposalId ID of the proposal
     * @return Full proposal details
     */
    function getProposal(uint256 proposalId) external view returns (
        address proposer,
        string memory description,
        bytes32 proposalHash,
        uint256 votesFor,
        uint256 votesAgainst,
        uint256 startTime,
        uint256 endTime,
        bool executed
    ) {
        Proposal storage proposal = proposals[proposalId];
        return (
            proposal.proposer,
            proposal.description,
            proposal.proposalHash,
            proposal.votesFor,
            proposal.votesAgainst,
            proposal.startTime,
            proposal.endTime,
            proposal.executed
        );
    }
    
    /**
     * @dev Check if a proposal has passed
     * @param proposalId ID of the proposal
     * @return Whether the proposal has passed
     */
    function hasProposalPassed(uint256 proposalId) external view returns (bool) {
        Proposal storage proposal = proposals[proposalId];
        return (
            block.timestamp >= proposal.endTime &&
            proposal.votesFor > proposal.votesAgainst
        );
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