import web3 from "../web3";
import configJSON from "../contracts/polygon-contracts/MintToken.json";

const abi = configJSON.abi;

export default function mintConfigContract(addr: string) {
  // @ts-ignore
  return new web3.eth.Contract(abi, addr);
}

export async function getBalance(configContract: any) {
  const result = await configContract.methods.getBalance().call();
  // console.log("getBalance", result);
  // result is a number like 10000000
  return result;
}

export async function getTotalMined(configContract: any) {
  const result = await configContract.methods.getTotalMined().call();
  console.log("getTotalMined", result);
  // result is a number like 5
  return result;
}

export async function getAllCandidates(configContract: any) {
  const result = await configContract.methods.getAllCandidates().call();
  // console.log("getAllCandidates", result);
  // result is a string[] like ["url1", "url2", etc]
  return result;
}

export async function priceWei(configContract: any) {
  const priceWei = await configContract.methods.priceWei().call();
  // console.log("priceWei", priceWei);
  // result is a number like 100000000000000
  return priceWei;
}

export async function mintRandom(configContract: any, account: any) {
  // console.log("mintRandom", { account });
  const price = await priceWei(configContract);
  const result = await configContract.methods.mintRandom().send({
    from: account,
    value: web3.utils.toBN(price),
  });
  // console.log("mintRandom", result);
  return result;
}
