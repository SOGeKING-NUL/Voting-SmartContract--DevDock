# Voting Smart Contract - DevDock

## Overview
This repository contains a robust Voting Smart Contract built with Solidity. The contract enforces a secure, transparent, and efficient voting process through clear role segregation and adherence to industry best practices.

## Key Features

### Role Segregation
- **Admin Role:**  
  Utilizes OpenZeppelin’s `Ownable` to restrict critical actions—such as registering voters, submitting proposals, and managing the voting lifecycle—to trusted administrators.
- **Voter Role:**  
  Only addresses explicitly registered by the admin are permitted to cast a vote, ensuring that only authorized participants influence the outcome.

### Controlled Voting Lifecycle
- **Phased Process:**  
  The voting process is segmented into distinct phases (voter registration, proposal submission, active voting, and voting conclusion) to prevent unauthorized actions outside designated periods.
- **Time-Bound Operations:**  
  Voting functions are available only during the specified voting period.

### Security and Best Practices
- **Robust Security:**  
  Implements OpenZeppelin’s `Pausable` and `ReentrancyGuard` to mitigate risks such as accidental misuse and reentrancy attacks.
- **Event-Driven Architecture:**  
  Key actions (voter registration, proposal submission, vote casting, voting start/end) emit events for real-time monitoring and seamless frontend integration.

### Robust Vote Counting
- **Single Vote Enforcement:**  
  Ensures each registered voter can vote only once, maintaining the integrity of the election.
- **Real-Time Monitoring:**  
  The event architecture supports real-time updates on election progress and results.

## Contract Details
- **Contract Location:** `forge/src/Voting.sol`
- **Admin Dashboard:** [View Dashboard](https://voting-smart-contract-dev-dock.vercel.app/)
- **Contract Address:** `0xC34412bE5B5d9DA566981Bc883db81846cD28128`

![Screenshot](https://github.com/user-attachments/assets/21a709ca-893e-4068-b511-9cdc502a5487)

