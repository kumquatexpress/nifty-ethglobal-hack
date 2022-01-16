import { web3 } from "./web3";
import configJSON from "../../../web3/build/polygon-contracts/Machine.json";

export const address = "0x60699E5BC448480C6683d9FC5156a657e65D9732";

const abi = configJSON.abi;

// @ts-ignore
export default new web3.eth.Contract(abi, address);
