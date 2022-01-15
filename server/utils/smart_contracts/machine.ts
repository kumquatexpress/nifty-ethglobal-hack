import { web3 } from "./web3";
import configJSON from "../../../web3/build/polygon-contracts/Machine.json";

export const address = "0x8098cc7b5659E3BF47bc2b495820275dd53c97A8";

const abi = configJSON.abi;

// @ts-ignore
export default new web3.eth.Contract(abi, address);
