// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {VotingSystem} from "../src/Voting.sol";

contract VotingrScript is Script {
    VotingSystem public voting;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        voting = new VotingSystem();

        vm.stopBroadcast();
    }
}
