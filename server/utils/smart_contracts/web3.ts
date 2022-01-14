// @ts-nocheck
import Web3 from "web3";
import config from "../../../config";

console.log("loading", config.eth.GETH_URL);
export const web3 = new Web3(config.eth.GETH_URL);
export const account = web3.eth.accounts.privateKeyToAccount(config.eth.KEY);
