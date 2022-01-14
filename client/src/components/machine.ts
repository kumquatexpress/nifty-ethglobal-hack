import web3 from "../web3";
import configJSON from "../contracts/polygon-contracts/Machine.json";

const address = "0xbfb3a7eB76d67205c91FC4EDaC78E9E29B7D9d83";

const abi = configJSON.abi;

// @ts-ignore
export default new web3.eth.Contract(abi, address);
