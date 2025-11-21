#!/bin/bash

# Create contracts directory if it doesn't exist
mkdir -p frontend/src/contracts

# Copy the ABI from the Foundry output
jq '{abi: .abi}' out/Voting.sol/Voting.json > frontend/src/contracts/Voting.json

echo "ABI copied to frontend/src/contracts/Voting.json"
