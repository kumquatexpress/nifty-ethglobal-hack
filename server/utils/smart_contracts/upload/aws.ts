import logger from "../../logger";
import s3 from "../../s3";

export async function awsUploadFile(
  filename: string,
  filetype: string,
  content: Buffer,
  awsS3Bucket: string
): Promise<string> {
  logger.debug("awsUploadFile starting:", filename);

  const mediaUrl = await s3.uploadFile(
    awsS3Bucket,
    filename,
    filetype,
    content
  );
  logger.debug(`awsUploadFile uploaded ${filename} to ${mediaUrl}`);
  return mediaUrl;
}
