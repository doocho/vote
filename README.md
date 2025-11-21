# Date Voting DApp

A decentralized voting application for choosing dates. Built with Solidity smart contracts (using Foundry) and React frontend. Perfect for coordinating meetings, events, and gatherings!

## Features

- **Create Date Polls**: Anyone can create a poll with multiple date options
- **Vote on Dates**: Users vote for their preferred date/time
- **Real-time Results**: See live voting results with progress bars
- **Winner Selection**: Automatically determines the winning date
- **Blockchain-based**: Transparent and tamper-proof voting on Ethereum

## Project Structure

```
vote/
├── src/                    # Solidity smart contracts (Foundry)
│   └── Voting.sol         # Main voting contract
├── script/                # Deployment scripts
│   └── Deploy.s.sol       # Contract deployment script
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── CreatePoll.jsx
│   │   │   ├── PollsList.jsx
│   │   │   └── PollDetails.jsx
│   │   ├── contracts/     # Contract ABIs and addresses
│   │   ├── App.jsx        # Main app component
│   │   └── index.css      # Styles
│   └── index.html
├── foundry.toml           # Foundry configuration
├── copy-abi.sh            # Script to copy ABI to frontend
└── package.json
```

## Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- Node.js (v22.10.0 or later LTS)
- pnpm
- MetaMask browser extension

## Installation

```bash
# Install frontend dependencies
cd frontend && pnpm install && cd ..
```

## Smart Contract

### Voting.sol Features

- **Date-based voting**: Vote on specific date/time options
- **Anyone can create polls**: No restrictions on poll creation
- **One vote per address**: Prevents double voting
- **Creator controls**: Poll creators can close their polls
- **Winner calculation**: Automatically determines most popular date

### Main Functions

- `createPoll(title, timestamps[], displayDates[])`: Create a new date poll
- `vote(pollId, dateId)`: Cast a vote for a date option
- `endPoll(pollId)`: Close a poll (creator only)
- `getAllPolls()`: Get all polls
- `getAllPollDateOptions(pollId)`: Get all date options for a poll
- `getPollWinner(pollId)`: Get the winning date

## Usage

### 1. Start Local Blockchain

```bash
pnpm node
# or
anvil
```

This starts a local Anvil blockchain with 10 test accounts.

### 2. Compile and Deploy Contract

In a new terminal:

```bash
# Compile the contract
pnpm compile
# or
forge build

# Deploy to local network
pnpm deploy
# or use the full command:
# PRIVATE_KEY=0xac09... forge script script/Deploy.s.sol:DeployScript --rpc-url http://127.0.0.1:8545 --broadcast

# Copy ABI to frontend
pnpm copy-abi
# or
./copy-abi.sh
```

### 3. Configure MetaMask

Add Anvil local network to MetaMask:
- **Network Name**: Anvil Local
- **RPC URL**: http://127.0.0.1:8545
- **Chain ID**: 31337
- **Currency Symbol**: ETH

Import a test account using one of Anvil's private keys (shown when you start anvil).

### 4. Start Frontend

```bash
pnpm frontend
# or
cd frontend && pnpm dev
```

Frontend will be available at http://localhost:3000

### 5. Using the DApp

#### Create a Poll:

1. Connect your MetaMask wallet
2. Click "+ Create New Poll"
3. Enter a title (e.g., "When should we have the team lunch?")
4. Add multiple date options (e.g., "Jan 15 at 2 PM", "Jan 20 at 6 PM")
5. Submit the poll

#### Vote on Dates:

1. Open any active poll from the list
2. Select your preferred date
3. Click "Cast Vote"
4. Confirm the transaction in MetaMask

#### View Results:

- Real-time vote counts and percentages
- Progress bars for each date option
- Winner displayed when poll is closed

## Development Commands

```bash
# Compile contracts
pnpm compile

# Run tests
pnpm test

# Start local blockchain
pnpm node

# Deploy contract
pnpm deploy

# Copy ABI to frontend
pnpm copy-abi

# Start frontend dev server
pnpm frontend
```

## Technologies Used

- **Foundry**: Ethereum development toolkit
  - Forge: Compile and test contracts
  - Anvil: Local blockchain
- **Solidity ^0.8.27**: Smart contract language
- **React 19**: Frontend framework
- **Ethers.js v6**: Ethereum library for Web3 interactions
- **Vite**: Build tool and development server
- **MetaMask**: Web3 wallet integration

## Use Cases

- Team meeting scheduling
- Event date coordination
- Class schedule voting
- Party planning
- Workshop timing selection
- Any group decision requiring date selection

## Security Features

- Immutable vote records on blockchain
- One vote per address
- Creator-only poll closure
- Transparent vote counting
- Event emission for all state changes

## License

ISC
