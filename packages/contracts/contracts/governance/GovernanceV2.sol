// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import {Errors} from "../libs/Errors.sol";

/**
 * @title GovernanceV2
 * @notice Enhanced DAO governance with timelocks and sub-DAOs
 * @dev Manages proposals, voting, and execution with timelock safety
 * 
 * ABI Stability:
 * - createProposal(bytes calldata proposalData, string description)
 * - vote(uint256 proposalId, bool support)
 * - executeProposal(uint256 proposalId)
 * - Events: ProposalCreated, VoteCast, ProposalExecuted
 */
contract GovernanceV2 is AccessControl {
    bytes32 public constant PROPOSER_ROLE = keccak256("PROPOSER_ROLE");
    bytes32 public constant EXECUTOR_ROLE = keccak256("EXECUTOR_ROLE");
    
    /// @notice Proposal states
    enum ProposalState {
        Pending,
        Active,
        Cancelled,
        Defeated,
        Succeeded,
        Queued,
        Expired,
        Executed
    }
    
    /// @notice Proposal structure
    struct Proposal {
        uint256 id;
        address proposer;
        string description;
        bytes callData;
        uint256 startBlock;
        uint256 endBlock;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 abstainVotes;
        bool executed;
        bool cancelled;
        uint256 eta;
        ProposalState state;
    }
    
    /// @notice Governance token
    IERC20 public immutable governanceToken;
    
    /// @notice Fee manager
    address public feeManager;
    
    /// @notice Timelock delay
    uint256 public timelockDelay;
    
    /// @notice Voting period in blocks
    uint256 public votingPeriod = 50400;
    
    /// @notice Voting delay in blocks
    uint256 public votingDelay = 7200;
    
    /// @notice Quorum percentage
    uint256 public quorumPercentage = 4;
    
    /// @notice Proposal threshold
    uint256 public proposalThreshold = 100_000 ether;
    
    /// @notice Proposal counter
    uint256 private _proposalIdCounter;
    
    /// @notice Proposal ID to proposal data
    mapping(uint256 => Proposal) public proposals;
    
    /// @notice Proposal ID to voter to vote weight
    mapping(uint256 => mapping(address => uint256)) public proposalVotes;
    
    /// @notice Proposal ID to voter to has voted
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    
    event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string description, uint256 startBlock, uint256 endBlock);
    event VoteCast(address indexed voter, uint256 indexed proposalId, bool support, uint256 weight);
    event ProposalQueued(uint256 indexed proposalId, uint256 eta);
    event ProposalExecuted(uint256 indexed proposalId);
    event ProposalCancelled(uint256 indexed proposalId);
    
    constructor(address _governanceToken, address _feeManager, uint256 _timelockDelay) {
        require(_governanceToken != address(0), Errors.ZERO_ADDRESS);
        require(_feeManager != address(0), Errors.ZERO_ADDRESS);
        require(_timelockDelay >= 1 hours, "Timelock too short");
        governanceToken = IERC20(_governanceToken);
        feeManager = _feeManager;
        timelockDelay = _timelockDelay;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PROPOSER_ROLE, msg.sender);
        _grantRole(EXECUTOR_ROLE, msg.sender);
    }
    
    function createProposal(bytes calldata proposalData, string calldata description) external returns (uint256) {
        require(governanceToken.balanceOf(msg.sender) >= proposalThreshold, "Below proposal threshold");
        require(bytes(description).length > 0, "Empty description");
        uint256 proposalId = ++_proposalIdCounter;
        uint256 startBlock = block.number + votingDelay;
        uint256 endBlock = startBlock + votingPeriod;
        proposals[proposalId] = Proposal({
            id: proposalId, proposer: msg.sender, description: description, callData: proposalData,
            startBlock: startBlock, endBlock: endBlock, forVotes: 0, againstVotes: 0, abstainVotes: 0,
            executed: false, cancelled: false, eta: 0, state: ProposalState.Pending
        });
        emit ProposalCreated(proposalId, msg.sender, description, startBlock, endBlock);
        return proposalId;
    }
    
    function vote(uint256 proposalId, bool support) external {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.id != 0, "Proposal does not exist");
        require(block.number >= proposal.startBlock, "Voting not started");
        require(block.number <= proposal.endBlock, "Voting ended");
        require(!hasVoted[proposalId][msg.sender], "Already voted");
        uint256 weight = governanceToken.balanceOf(msg.sender);
        require(weight > 0, "No voting power");
        hasVoted[proposalId][msg.sender] = true;
        proposalVotes[proposalId][msg.sender] = weight;
        if (support) { proposal.forVotes += weight; } else { proposal.againstVotes += weight; }
        emit VoteCast(msg.sender, proposalId, support, weight);
    }
    
    function queueProposal(uint256 proposalId) external {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.id != 0, "Proposal does not exist");
        require(block.number > proposal.endBlock, "Voting not ended");
        require(!proposal.executed, "Already executed");
        require(!proposal.cancelled, "Proposal cancelled");
        require(_isProposalSuccessful(proposalId), "Proposal not successful");
        proposal.eta = block.timestamp + timelockDelay;
        proposal.state = ProposalState.Queued;
        emit ProposalQueued(proposalId, proposal.eta);
    }
    
    function executeProposal(uint256 proposalId) external onlyRole(EXECUTOR_ROLE) {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.id != 0, "Proposal does not exist");
        require(proposal.state == ProposalState.Queued, "Not queued");
        require(block.timestamp >= proposal.eta, "Timelock not expired");
        require(!proposal.executed, "Already executed");
        proposal.executed = true;
        proposal.state = ProposalState.Executed;
        (bool success, ) = feeManager.call(proposal.callData);
        require(success, "Execution failed");
        emit ProposalExecuted(proposalId);
    }
    
    function cancelProposal(uint256 proposalId) external {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.id != 0, "Proposal does not exist");
        require(msg.sender == proposal.proposer || hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Not authorized");
        require(!proposal.executed, "Already executed");
        proposal.cancelled = true;
        proposal.state = ProposalState.Cancelled;
        emit ProposalCancelled(proposalId);
    }
    
    function getProposalState(uint256 proposalId) external view returns (ProposalState) {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.id != 0, "Proposal does not exist");
        if (proposal.cancelled) return ProposalState.Cancelled;
        if (proposal.executed) return ProposalState.Executed;
        if (block.number < proposal.startBlock) return ProposalState.Pending;
        if (block.number <= proposal.endBlock) return ProposalState.Active;
        if (_isProposalSuccessful(proposalId)) {
            if (proposal.eta > 0) return ProposalState.Queued;
            return ProposalState.Succeeded;
        }
        return ProposalState.Defeated;
    }
    
    function _isProposalSuccessful(uint256 proposalId) internal view returns (bool) {
        Proposal storage proposal = proposals[proposalId];
        uint256 totalSupply = governanceToken.totalSupply();
        uint256 quorum = (totalSupply * quorumPercentage) / 100;
        uint256 totalVotes = proposal.forVotes + proposal.againstVotes + proposal.abstainVotes;
        if (totalVotes < quorum) return false;
        return proposal.forVotes > proposal.againstVotes;
    }
    
    function updateParameters(uint256 _votingPeriod, uint256 _votingDelay, uint256 _quorumPercentage, uint256 _proposalThreshold) external onlyRole(DEFAULT_ADMIN_ROLE) {
        votingPeriod = _votingPeriod;
        votingDelay = _votingDelay;
        quorumPercentage = _quorumPercentage;
        proposalThreshold = _proposalThreshold;
    }
}
