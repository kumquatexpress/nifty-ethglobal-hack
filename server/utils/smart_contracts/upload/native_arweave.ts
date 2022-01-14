import fs from "fs";
import Arweave from "arweave";
import logger from "../../logger";

let arweave, arweaveJWK;
export const getARInstance = () => {
  if (!arweave) {
    arweave = Arweave.init({
      host: "arweave.net",
      port: 443,
      protocol: "https",
    });
  }
  return arweave;
};
export const getArweaveJWK = () => {
  if (!arweaveJWK) {
    arweaveJWK = JSON.parse(
      fs.readFileSync(process.env.ARWEAVE_JWK_PATH).toString()
    );
  }
  return arweaveJWK;
};

export const uploadToArweave = async (transaction) => {
  const arweave = getARInstance();
  const uploader = await arweave.transactions.getUploader(transaction);
  while (!uploader.isComplete) {
    await uploader.uploadChunk();
    logger.debug(
      `${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`
    );
  }
};

/* Uploads a single image to Arweave using native wallet and returns its id */
export async function nativeArweaveUploadFile(
  filename: string,
  filetype: string,
  content: Buffer
): Promise<string> {
  logger.debug(`nativeArweaveUploadImage: starting ${filename}`);
  const arweave = getARInstance();
  const arwaveJWK = getArweaveJWK();
  const imgTx = await arweave.createTransaction({ data: content }, arwaveJWK);
  imgTx.addTag("Content-Type", filetype);
  await arweave.transactions.sign(imgTx, arwaveJWK);
  await uploadToArweave(imgTx);
  const link = `https://arweave.net/${imgTx.id}`;
  logger.debug(`nativeArweaveUploadImage: uploaded ${filename} as ${link}`);
  return link;
}
