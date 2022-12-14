import web3 from './web3';
import { contractAddress, contractAbi } from './contractConfig';

const address = contractAddress;
const abi = contractAbi;
const contract = web3 ? new web3.eth.Contract(abi, address) : null;

export default contract;