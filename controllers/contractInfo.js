const dotenv = require('dotenv').config();
const hre = require('hardhat');
const fs = require('fs');
const path = require('path');

const lotteryContractDetailsPath = path.join(__dirname, '../', 'lotteryContract.json');
const lotteryContractDetails = JSON.parse(fs.readFileSync(lotteryContractDetailsPath));

const provider = new hre.ethers.providers.JsonRpcProvider(`https://goerli.infura.io/v3/${process.env.apiPublicKeyEthereum}`)
const privateKey = process.env.privateKey;

async function main() {
    const wallet = new hre.ethers.Wallet(privateKey, provider);
    const signer = await hre.ethers.getSigner();
    const lottery = new hre.ethers.Contract(lotteryContractDetails.address, lotteryContractDetails.abi, provider);
    
    const manager = await lottery.owner();
    const participantsNo = await lottery.noOfParticipants();
    const contractBalance = await lottery.contractBalance();
    const nWinners = await lottery.nWinners();
    return { manager, participantsNo, contractBalance, nWinners }
}

exports.getContractInfo = async (req, res, next) => {
    try {
        const { manager, participantsNo, contractBalance, nWinners } = await main();
        res.json({
            manager: manager, 
            playersNo: participantsNo.toNumber(), 
            balanceEther: hre.ethers.utils.formatEther(contractBalance),
            noOfWinners: nWinners.toNumber()
        })
    } catch (error) {
        console.log("Contract-Info server error: ", error)
    }
}