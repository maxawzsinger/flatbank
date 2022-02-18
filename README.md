# About project

WIP DAO launcher based around the molochDAO DAO template, but without using The Graph to pull data.

# How to run

Due to the contract size limitation (~25KB) this contract in its current iteration cannot be deployed except on a local blockchain with size limit turned off.
The contract is still in the process of being split.

To run on a local blockchain:
- Install MetaMask
- Install the hardhat development environment.
- Install node.js
- Download flatbank and hardhat-flatbank (separate maxawzsinger repository) 
- Install necessary packages for each project.
- In directory "hardhat-flatbank", run:
- npx hardhat node (for starting local blockchain. Note provided addresses and private keys)
- npx hardhat run --network localhost scripts/deployMolochDynamic.js (deploys contracts on your local blockchain)
- Note console logged addresses for deployed contracts, update these if necessary in contractConfigs.js in contractConfigs directory in flatbank project
- In directory "flatbank", run: 
- npm start (to start react server)
- Start interacting. Note MetaMask interactions are buggy on hardhat local blockchain due to sync issues.
