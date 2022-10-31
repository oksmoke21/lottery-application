Lottery smart contract is deployed to Goerli testnet at address 0xdBD4A4EF3099e48355A34174a92527679CA1f4cC. You can monitor contract at https://goerli.etherscan.io/address/0xdBD4A4EF3099e48355A34174a92527679CA1f4cC

Steps to running app: 

Install all dependencies in root folder & client folder (/client/) by navigating to both directories and running npm install --save
Set environment variables as defined in .env.example
Both the server and client must be up and running for interacting with frontend React application

SMART CONTRACT:

Configure your preferred network in hardhat.config.js

Deploying smart contracts => 
1) Run the script inside deploy folder as npx hardhat run deploy/00-deploy-lottery.js --network <whichever network you choose>
2) The contract address and abi will be updated in lotteryContract.json

Testing smart contracts =>
1) Run the script inside test folder as npx hardhat test --network <whichever network you choose>
2) All desirable test parameters will be reflected in console

SERVER:

1) Run npm start in root folder, this will run app.js and spin a NodeJS server at port 5000. 
2) The port 5000 is hardcoded to be read in the frontend (client/src/App.js line 28). If changing this port be sure to reflect the change in App.js.
3) You can perform get request to /contract-info to fetch info about the smart contract

CLIENT:

1) Run npm start in folder /client/, this will start React app at port 3000 by default.
2) The frontend is hardcoded to read the address and abi of the contract deployed at Goerli testnet (/client/src/utils/contractConfig.js). Be sure to manually change it in case of using your own deployment of contract
