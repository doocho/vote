// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {Voting} from "../src/Voting.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        Voting voting = new Voting();

        console.log("Voting contract deployed to:", address(voting));

        vm.stopBroadcast();

        // Save contract address for frontend
        string memory contractAddress = vm.toString(address(voting));
        string memory json = string(abi.encodePacked('{\n  "Voting": "', contractAddress, '"\n}'));

        vm.writeFile("frontend/src/contracts/contract-address.json", json);
        console.log("Contract address saved to frontend/src/contracts/contract-address.json");
    }
}
