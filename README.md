To connect: Add, and switch to custom network in MetaMask: RPC-URL http://da0e-119-18-0-18.ngrok.io and Chain ID 31337

# About project

WIP DAO launcher based around the molochDAO DAO template, but without using The Graph to pull data.

The heart of the app is molochMessenger.js (which imports molochFetchData.js) in utilities.

This packages methods from 3 web3.js contract objects - one for the DAO creation contract (which also holds information about all DAOs created through flatbank, one for the treasury contract itself, and one for the token contract - a token created for development purposes which the DAOs are hardcoded to accept.

These methods are themselves abstractions over transactions requests for MetaMask, which is the current gold standard for in-browser wallets, and handles talking to nodes (via Infura by default) to communicate data to and from the network. 

molochMessenger is passed as props to all children that want to call its methods. When transactions produce receipts, these are passed to App.js via a callback method, stored in state, and passed down to children. 

The UI is divided into a treasury creation section - triggering deployment of new smart contracts defining DAOs- and a DAO interaction section - for users to vote on proposals of existing DAOs of which they have shares in.

# How to run on a local blockchain:

- Install MetaMask
- Install the hardhat development environment.
- Install node.js
- Download flatbank and hardhat-flatbank (https://github.com/maxawzsinger/hardhat-flatbank) 
- Install necessary packages for each project.
- In directory "hardhat-flatbank", run:
- npx hardhat node (for starting local blockchain. Note provided addresses and private keys)
- npx hardhat run --network localhost scripts/deployMolochDynamic.js (deploys contracts on your local blockchain)
- Note console logged addresses for deployed contracts, update these if necessary in contractConfigs.js in contractConfigs directory in flatbank project
- In directory "flatbank", run: 
- npm start (to start react server)
- Start interacting. Note MetaMask interactions are buggy on hardhat local blockchain due to sync issues.
