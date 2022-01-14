import web3 from "../web3";
import configJSON from "../contracts/polygon-contracts/MintToken.json";

const address = "0xd61e8A88fa87E02CB6007D1CAE6b1CA704F2c01A";

const abi = configJSON.abi;

const mintConfigContract = (addr: string) => {
  // @ts-ignore
  return new web3.eth.Contract(abi, addr);
};

// @ts-ignore
export default new web3.eth.Contract(abi, address);
