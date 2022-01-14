import { MachineData } from "./collections";
import MachineContract, { address } from "../machine";
import { web3, account } from "../web3";
import { GWEI_PER_ETH } from "./constants";
import logger from "../../logger";

export async function createMachine(
  data: MachineData
): Promise<{ machineAddress: string }> {
  logger.info("createMachine", [data]);
  const ts = Math.floor(Number(Date.now() / 1000) + 5000);
  const priceWei = web3.utils.toWei(
    web3.utils.toBN(data.price * GWEI_PER_ETH),
    "gwei"
  );
  const transaction = MachineContract.methods.create(
    data.name,
    data.symbol,
    priceWei,
    ts,
    [],
    [],
    []
  );

  const tx = {
    from: account.address,
    to: transaction._parent._address,
    gas: await transaction.estimateGas({ from: account.address }),
    gasPrice: await web3.eth.getGasPrice(),
    data: transaction.encodeABI(),
  };
  console.log("tx", tx);

  const signed = await web3.eth.accounts.signTransaction(
    tx,
    account.privateKey
  );
  const result = await web3.eth.sendSignedTransaction(signed.rawTransaction);
  const createEvent = MachineContract.options.jsonInterface.filter((token) => {
    return token.type === "event" && token.name == "Create";
  })[0];

  let address;
  result.logs.forEach((l) => {
    // @ts-ignore
    if (l.topics[0] === createEvent.signature) {
      try {
        const logRes = web3.eth.abi.decodeLog(
          [
            { type: "string", name: "configAddress", indexed: true },
            { type: "string", name: "sender", indexed: true },
          ],
          l.data,
          l.topics.slice(1)
        );
        address = logRes["configAddress"];
        address = `0x${address.substring(address.length - 40)}`;
        console.log("address", address);
      } catch (e) {
        console.log("no parse", e);
      }
    }
  });

  return {
    machineAddress: address,
  };
}
export function getTokensOwnedByAccount(address: string): string[] {
  // TODO call something to get the tokens for this public key
  return [];
}
export function getTokensFromMachine(address: string): string[] {
  // TODO call something to get the tokens for this machine
  return [];
}

export function getMetadataForToken(address: string): any {
  // TODO call something to get metadata for this NFT
  return {};
}
