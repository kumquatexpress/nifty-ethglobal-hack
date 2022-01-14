import Web3 from "web3";
import BN from "bn";
import logger from "../../logger";
import { awsUploadFile } from "../upload/aws";
import { nativeArweaveUploadFile } from "../upload/native_arweave";
import { NFTManifest } from "./types";
import config from "../../../../config";
import Collection from "../../../models/Collection.model";
import mintConfigContract from "../config";
import { account, web3 } from "../web3";

export interface UploadResult {
  link: string;
  name: string;
  onChain: boolean;
}

export interface MachineData {
  name: string;
  itemsAvailable: BN;
  uuid: null | string;
  symbol: string;
  sellerFeeBasisPoints: number;
  price: BN;
  goLiveDate: null | BN;
  creators: {
    address: string;
    verified: boolean;
    share: number;
  }[];
}

export function machineDataFromCollection(collection: Collection): MachineData {
  logger.info(`machineDataFromCollection: `, {
    collection,
  });
  const secondsSinceEpoch = Math.floor(
    Number(collection.mint_start_time) / 1000
  );
  const metadata = collection.metadata;
  return {
    name: collection.name,
    itemsAvailable: Web3.utils.toBN(metadata.totalNFTs),
    uuid: null,
    symbol: metadata.symbol,
    sellerFeeBasisPoints: metadata.sellerFeeBasisPoints,
    price: Web3.utils.toBN(collection.price_gwei),
    goLiveDate: Web3.utils.toBN(secondsSinceEpoch),
    creators: metadata.creators.map((creator) => {
      return {
        address: creator.address,
        verified: true,
        share: creator.share,
      };
    }),
  };
}

export async function uploadToCloudFS(
  filename: string,
  imageBytes: Buffer,
  manifest: NFTManifest,
  provider: "arweave" | "aws"
): Promise<UploadResult> {
  logger.info("uploadToCloudFS: ", {
    filename,
    manifest,
    provider,
  });
  try {
    let imgUrl;
    if (provider === "arweave") {
      imgUrl = await nativeArweaveUploadFile(filename, "image/png", imageBytes);
    } else {
      imgUrl = await awsUploadFile(
        filename,
        "image/png",
        imageBytes,
        config.aws.UPLOAD_BUCKET
      );
    }
    // Edit the manifest json with the newly uploaded image url
    manifest.image = imgUrl;
    manifest.properties = {
      ...manifest.properties,
      files: [{ type: "image/png", uri: imgUrl }],
    };
    // This is just to set the manifest filename to {imagename}.json
    const manifestName = `${filename}.json`;
    let manifestUrl;
    if (provider === "arweave") {
      manifestUrl = await nativeArweaveUploadFile(
        manifestName,
        "application/json",
        Buffer.from(JSON.stringify({ ...manifest }))
      );
    } else {
      manifestUrl = await awsUploadFile(
        manifestName,
        "application/json",
        Buffer.from(JSON.stringify({ ...manifest })),
        config.aws.UPLOAD_BUCKET
      );
    }
    if (manifestUrl) {
      return {
        link: manifestUrl,
        name: manifest.name,
        onChain: false,
      };
    }
  } catch (er) {
    logger.error("uploadToCloudFS: ", er);
  }
}

export async function addLinksToCollection(
  items: UploadResult[],
  // public key of this machine
  machineAddr: string
) {
  const ConfigContract = mintConfigContract(machineAddr);
  const transaction = ConfigContract.methods.addBatch(items.map((i) => i.link));
  const tx = {
    from: account.address,
    to: transaction._parent._address,
    gas: await transaction.estimateGas({ from: account.address }),
    gasPrice: await web3.eth.getGasPrice(),
    data: transaction.encodeABI(),
  };
  logger.info("addLinksToCollection: ", [tx]);

  const signed = await web3.eth.accounts.signTransaction(
    tx,
    account.privateKey
  );
  const result = await web3.eth.sendSignedTransaction(signed.rawTransaction);
  return result.status;
}