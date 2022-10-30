const path = require("path");
const fs = require("fs");

const lotteryContractPath = path.join(__dirname, '../', "lotteryContract.json");
const lotteryContract = JSON.parse(fs.readFileSync(lotteryContractPath));
const contractAddress = lotteryContract.address;
const contractAbi = lotteryContract.abi;

export default { contractAddress, contractAbi };