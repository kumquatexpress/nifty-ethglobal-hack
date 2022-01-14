import { web3 } from "./web3";
import configJSON from "../../../web3/build/polygon-contracts/MintToken.json";

const abi = configJSON.abi;

export default function mintConfigContract(addr: string) {
  // @ts-ignore
  return new web3.eth.Contract(abi, addr);
}
