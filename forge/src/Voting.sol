// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "node_modules/@openzeppelin/contracts/utils/Pausable.sol";
import "node_modules/@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract VotingSystem is Ownable, Pausable, ReentrancyGuard {
    struct Proposal {
        string name;
        string description;
        uint256 voteCount;
        bool exists;
    }

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint256 votedProposalId;
        
    }

    enum VotingStatus {
        NotStarted,
        Active,
        Ended
    }

    mapping(address => Voter) public voters;
    mapping(uint256 => Proposal) public proposals;
    
    uint256 public proposalCount;
    uint256 public startTime;
    uint256 public endTime;
    VotingStatus public votingStatus;
    uint256 public totalVoters;
    uint256 public totalVotes;

    event VoterRegistered(address indexed voter);
    event ProposalRegistered(uint256 indexed proposalId, string name);
    event Voted(address indexed voter, uint256 indexed proposalId);
    event VotingStarted(uint256 startTime, uint256 endTime);
    event VotingEnded(uint256 endTime);

    modifier onlyDuringVoting() {
        require(votingStatus == VotingStatus.Active, "Voting is not active");
        require(block.timestamp >= startTime && block.timestamp <= endTime, "Outside voting period");
        _;
    }

    constructor() Ownable(msg.sender) {
        votingStatus = VotingStatus.NotStarted;
    }

    function addProposal(string memory _name, string memory _description) external onlyOwner {
        require(votingStatus == VotingStatus.NotStarted, "Voting has already started");
        
        proposalCount++;
        proposals[proposalCount] = Proposal({
            name: _name,
            description: _description,
            voteCount: 0,
            exists: true
        });

        emit ProposalRegistered(proposalCount, _name);
    }

    function registerVoter(address _voter) external onlyOwner {
        require(!voters[_voter].isRegistered, "Voter already registered");
        require(votingStatus == VotingStatus.NotStarted, "Cannot register after voting starts");

        voters[_voter] = Voter({
            isRegistered: true,
            hasVoted: false,
            votedProposalId: 0
        });

        totalVoters++;
        emit VoterRegistered(_voter);
    }

    function startVoting(uint256 _durationInMinutes) external onlyOwner {
        require(votingStatus == VotingStatus.NotStarted, "Voting has already started");
        require(proposalCount > 0, "No proposals registered");
        require(_durationInMinutes > 0, "Duration must be positive");

        startTime = block.timestamp;
        endTime = startTime + (_durationInMinutes * 1 minutes);
        votingStatus = VotingStatus.Active;

        emit VotingStarted(startTime, endTime);
    }

    function vote(uint256 _proposalId) external onlyDuringVoting nonReentrant {
        require(voters[msg.sender].isRegistered, "Voter not registered");
        require(!voters[msg.sender].hasVoted, "Already voted");
        require(proposals[_proposalId].exists, "Proposal does not exist");

        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedProposalId = _proposalId;
        proposals[_proposalId].voteCount++;
        totalVotes++;

        emit Voted(msg.sender, _proposalId);
    }

    function endVoting() external onlyOwner {
        require(votingStatus == VotingStatus.Active, "Voting is not active");
        require(block.timestamp >= endTime, "Voting period not ended yet");

        votingStatus = VotingStatus.Ended;
        emit VotingEnded(block.timestamp);
    }

    function getProposal(uint256 _proposalId) external view returns (
        string memory name,
        string memory description,
        uint256 voteCount
    ) {
        require(proposals[_proposalId].exists, "Proposal does not exist");
        Proposal storage proposal = proposals[_proposalId];
        return (proposal.name, proposal.description, proposal.voteCount);
    }

    function getWinningProposal() external view returns (
        uint256 winningProposalId,
        string memory winningProposalName,
        uint256 winningVoteCount
    ) {
        require(votingStatus == VotingStatus.Ended, "Voting not ended");
        
        uint256 winningVoteCount_ = 0;
        uint256 winningProposalId_;
        
        for (uint256 i = 1; i <= proposalCount; i++) {
            if (proposals[i].voteCount > winningVoteCount_) {
                winningVoteCount_ = proposals[i].voteCount;
                winningProposalId_ = i;
            }
        }
        
        return (
            winningProposalId_,
            proposals[winningProposalId_].name,
            winningVoteCount_
        );
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}
