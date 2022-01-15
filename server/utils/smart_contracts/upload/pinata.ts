import logger from "../../logger";
import pinataSDK from "@pinata/sdk";
import config from "../../../../config";

const pinata = pinataSDK(config.pinata.KEY, config.pinata.SECRET);

export async function pinataUploadFile(content: Buffer): Promise<string> {
  logger.debug("pinataUploadFile");
  const result = await pinata.pinFileToIPFS(content);
  return result.IpfsHash;
}
