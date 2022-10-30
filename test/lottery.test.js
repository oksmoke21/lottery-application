const hre = require("hardhat");
const { ethers } = require("hardhat");

describe("Lottery test", async function() {
    let participants, lottery;
    
    beforeEach(async () => {
        // six addresses chosen for testing, must have minimum balance more than 2 ETH
        const [_owner, address1, address2, address3, address4, address5, address6] = await hre.ethers.getSigners();
        participants = [address1, address2, address3, address4, address5, address6]; // selecting 6 accounts for testing

        const LotteryHRE = await hre.ethers.getContractFactory("Lottery", _owner);
        lottery = await LotteryHRE.deploy();
        console.log("Lottery contract deployed to: ", lottery.address);
    });
    
    it("allows users to enter lottery and owner can choose winners", async() => {
        const ownerAddress = await lottery.owner();
        console.log("Owner: ", ownerAddress);
        
        // Entering lottery =>

        for(let i = 0; i < participants.length; i++) {
            await lottery.connect(participants[i]).enterLottery({
                value: ethers.utils.parseEther("2"),
            });
        }

        // Participants wallet ballance before lottery =>

        console.log("\nParticipants balance before lottery: ");
        for(let i = 0; i < participants.length; i++) {
            const balanceAcc = await ethers.provider.getBalance(participants[i].address);
            console.log(`${participants[i].address}: ${ethers.utils.formatEther(balanceAcc)}`);
        }
        console.log('\n');

        // Contract balance after participants have entered lottery =>

        const contractBalanceBefore = await lottery.contractBalance();
        console.log("Contract balance after participants have entered lottery: ", ethers.utils.formatEther(contractBalanceBefore));

        // No of winners to be chosen: 2
        await lottery.setNoOfWinners(4);
        const nWinners = await lottery.nWinners();
        console.log("No of winners to be chosen: ", nWinners);
                
        await lottery.chooseWinner();
        
        console.log("\nParticipants balance after lottery: ");
        for(let i = 0; i < participants.length; i++) {
            const balanceAcc = await ethers.provider.getBalance(participants[i].address);
            console.log(`${participants[i].address}: ${ethers.utils.formatEther(balanceAcc)}`);
        }
        console.log('\n');

        // Contract balance after participants have entered lottery =>
        const contractBalanceAfter = await lottery.contractBalance();
        console.log("Contract balance after lottery has ended: ", ethers.utils.formatEther(contractBalanceAfter));
        
        // Winner array should be reset after lottery has ended =>
        // const winnerAfter = await lottery.winners(0); // should throw error
    });
});