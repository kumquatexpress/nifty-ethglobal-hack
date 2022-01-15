import web3 from "../web3";

import mintConfigContract from "../components/config";
import * as constants from "./constants";

const mintRandom = async (addy: string) => {
  const config = mintConfigContract(addy);
  const priceWei = await config.methods.priceWei().call();
  const accounts = await web3.eth.getAccounts();
  try {
    const v = await config.methods.mintRandom().send({
      from: accounts[0],
      value: web3.utils.toBN(priceWei),
    });
    console.log("random", v);
    const { sender, url, tokenId } = v.events.Mint.returnValues;
    console.log("sender", sender);
    console.log("url", url);
    console.log("tokenId", tokenId);
  } catch (e) {
    console.log("err", e);
  }
};

export function gweiToMatic(gwei: number) {
  return gwei / constants.TO_GWEI;
}
