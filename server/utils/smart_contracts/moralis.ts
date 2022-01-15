import Moralis from "moralis/node";
import config from "../../../config";

Moralis.start({ serverUrl: config.moralis.URL, appId: config.moralis.ID });

export async function getAllTokensForWalletAndContract(
  address: string,
  contractAddr: string
): Promise<any[]> {
  const options = { chain: "mumbai", address, token_address: contractAddr };
  // @ts-ignore
  const resp = await Moralis.Web3API.account.getNFTsForContract(options);
  return resp.result;
}

export async function getAllTokensForWallet(address: string): Promise<any[]> {
  const options = { chain: "mumbai", address };
  // @ts-ignore
  const resp = await Moralis.Web3API.account.getNFTs(options);
  return resp.result;
}

export async function getTokenIdsForContract(
  contractAddr: string
): Promise<any[]> {
  const options = { address: contractAddr, chain: "mumbai" };
  // @ts-ignore
  const resp = await Moralis.Web3API.token.getAllTokenIds(options);
  return resp.result;
}
