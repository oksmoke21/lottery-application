const { ethers } = require("hardhat");
const path = require("path");
const fs = require("fs");

async function main() {
    const [signerAccount] = await ethers.getSigners();
    console.log("Signer address: ", signerAccount.address);
    const Lottery = await ethers.getContractFactory("Lottery", signerAccount.address);
    const lottery = await Lottery.deploy();

    console.log("Lottery contract address ", lottery.address);

    const lotteryAbiPath = path.join(__dirname, '../', "artifacts", "contracts", "Lottery.sol", "Lottery.json");
    const lotteryAbi = JSON.parse(fs.readFileSync(lotteryAbiPath)).abi;
    const lotteryContract = path.join(__dirname, '../', "lotteryContract.json");
    fs.writeFileSync(lotteryContract, JSON.stringify({address: lottery.address, abi: lotteryAbi}));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });