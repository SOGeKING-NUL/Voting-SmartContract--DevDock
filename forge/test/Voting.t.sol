// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/Voting.sol";

contract VotingSystemTest is Test {
    VotingSystem public votingSystem;
    address public owner;
    address public voter1;
    address public voter2;

    function setUp() public {
        owner = address(this);
        voter1 = address(0x1);
        voter2 = address(0x2);
        votingSystem = new VotingSystem();
    }

    function testAddProposal() public {
        votingSystem.addProposal("Proposal 1", "Description 1");
        (string memory name, string memory description, uint256 voteCount) = votingSystem.getProposal(1);
        assertEq(name, "Proposal 1");
        assertEq(description, "Description 1");
        assertEq(voteCount, 0);
    }

    function testRegisterVoter() public {
        votingSystem.registerVoter(voter1);
        (bool isRegistered, bool hasVoted,) = votingSystem.voters(voter1);
        assertTrue(isRegistered);
        assertFalse(hasVoted);
    }

    function testVoting() public {
        votingSystem.addProposal("Proposal 1", "Description 1");
        votingSystem.registerVoter(voter1);
        votingSystem.startVoting(60);

        vm.prank(voter1);
        votingSystem.vote(1);

        (bool isRegistered, bool hasVoted, uint256 votedProposalId) = votingSystem.voters(voter1);
        assertTrue(isRegistered);
        assertTrue(hasVoted);
        assertEq(votedProposalId, 1);
    }

    function testFailDoubleVoting() public {
        votingSystem.addProposal("Proposal 1", "Description 1");
        votingSystem.registerVoter(voter1);
        votingSystem.startVoting(60);

        vm.startPrank(voter1);
        votingSystem.vote(1);
        votingSystem.vote(1); // This should fail
        vm.stopPrank();
    }

    function testGetWinningProposal() public {
        votingSystem.addProposal("Proposal 1", "Description 1");
        votingSystem.addProposal("Proposal 2", "Description 2");
        
        votingSystem.registerVoter(voter1);
        votingSystem.registerVoter(voter2);
        
        votingSystem.startVoting(60);

        vm.prank(voter1);
        votingSystem.vote(1);
        
        vm.prank(voter2);
        votingSystem.vote(1);

        // Fast forward time
        vm.warp(block.timestamp + 61 minutes);
        
        votingSystem.endVoting();
        
        (uint256 winningId, string memory winningName, uint256 winningVotes) = votingSystem.getWinningProposal();
        assertEq(winningId, 1);
        assertEq(winningName, "Proposal 1");
        assertEq(winningVotes, 2);
    }
}
