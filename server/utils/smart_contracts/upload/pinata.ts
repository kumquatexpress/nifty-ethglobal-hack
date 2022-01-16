import logger from "../../logger";
import pinataSDK from "@pinata/sdk";
import { Readable } from "stream";
import config from "../../../../config";
import Bottleneck from "bottleneck";

const limiter = new Bottleneck({
  maxConcurrent: 2,
  minTime: 200,
});

const pinata = pinataSDK(config.pinata.KEY, config.pinata.SECRET);

export async function pinataUploadFile(
  filename: string,
  content: Buffer
): Promise<string> {
  logger.debug("pinataUploadFile", [filename]);
  const stream = Readable.from(content);
  // @ts-ignore
  stream.path = filename;
  const result = await limiter.schedule(() => pinata.pinFileToIPFS(stream));
  return result.IpfsHash;
}
