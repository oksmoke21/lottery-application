// SPDX-License-Identifier: MIT

pragma solidity ^0.8;

import "hardhat/console.sol";

contract Lottery {
    uint public nWinners; // number of winners as selected by contract owner
    address public owner; // address of contract owner
    address payable[] public participants; // array of participants in the lottery pool
    mapping (address => bool) public chosen; // mapping of whether a participant address has been chosen as a winner
    mapping (address => bool) public hasEntered; // mapping of whether a participant has already entered the lottery

    address payable[] public winners; // array of winning participants of the lottery prize

    event enteredLottery(address indexed);
    event wonLottery(address indexed);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "caller is not owner");
        _;
    }

    function setNoOfWinners(uint _nWinners) external onlyOwner {
        nWinners = _nWinners;
    }

    function contractBalance() public view onlyOwner returns (uint){
        return address(this).balance;
    }

    function enterLottery() external payable
    {
        require(hasEntered[msg.sender] == false, "cannot enter lottery twice in same round");
        // minimum value to enter lottery has been hardcoded to 0.05 ETH
        require(msg.value == 0.05 ether, "value sent should be 0.05 ETH i.e 50000000000000000 wei");
        participants.push(payable(msg.sender));
        hasEntered[msg.sender] == true;
        emit enteredLottery(msg.sender);
    }

    function randomNumber(uint i) private view returns(uint)
    {
        uint randomNo = uint(keccak256(abi.encodePacked(block.difficulty,block.timestamp,participants.length, i)));
        uint randomIndex = randomNo % participants.length;
        return randomIndex;
    }

    function selectionOfNWinners() private returns (uint) {
        uint i;
        uint j;
        uint randomIndex;
        bool winnersChosen = false;
        while(!winnersChosen) {
            randomIndex = randomNumber(i); // received randomIndex
            console.log("Random index: %s", randomIndex);            
            if(!chosen[participants[randomIndex]]) { // checks if a randomIndex is repeated
                winners.push(participants[randomIndex]);
                console.log("Winner %s: %s", j+1, winners[j]);
                chosen[participants[randomIndex]] = true;
                emit wonLottery(participants[randomIndex]);
                j++;
            }
            i++;
            if(j == nWinners) {
                winnersChosen = true;
                break;
            }
        }
        return randomIndex;
    }

    function chooseWinner() external onlyOwner {
        require(nWinners >= 1, "winners must be greater than one");
        require(participants.length > nWinners, "not enough participants in lottery pool to choose winner");

        selectionOfNWinners();
        
        uint awardPerWinner = contractBalance()/nWinners;
        for(uint i = 0; i < nWinners; i++) {
            winners[i].transfer(awardPerWinner); // each winner is payed 1/n th of the total prize
        }
        resetLottery();
    }

    function resetLottery() private {
        participants = new address payable[](0);
        for(uint i = 0; i < nWinners; i++) {
            chosen[winners[i]] = false;
        }
        winners = new address payable[](0);
        nWinners = 0;
    }
}