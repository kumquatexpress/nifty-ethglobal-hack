import { S3Client, PutObjectCommand, S3ClientConfig } from "@aws-sdk/client-s3";
import logger from "./logger";
import config from "../../config";

/* If we're running locally we point to a docker compose container running localstack */
function s3ClientParams(): S3ClientConfig {
  if (config.app.IS_LOCAL) {
    return {
      region: config.aws.REGION,
      credentials: {
        accessKeyId: "test",
        secretAccessKey: "test",
      },
      endpoint: "http://localstack:4566",
      forcePathStyle: true,
    };
  } else {
    return {
      region: config.aws.REGION,
      credentials: {
        accessKeyId: config.aws.UPLOAD_KEY,
        secretAccessKey: config.aws.UPLOAD_SECRET,
      },
    };
  }
}
function getS3URI(bucket: string, filename: string): string {
  if (config.app.IS_LOCAL) {
    return `http://localstack:4566/${bucket}/${filename}`;
  }
  return `https://${bucket}.s3.amazonaws.com/${filename}`;
}
const s3Client = new S3Client(s3ClientParams());

const uploadFile = async (
  awsS3Bucket: string,
  filename: string,
  contentType: string,
  body: string | Uint8Array | Buffer | ReadableStream<any>
): Promise<string> => {
  const mediaUploadParams = {
    Bucket: awsS3Bucket,
    Key: filename,
    Body: body,
    ACL: "public-read",
    ContentType: contentType,
  };

  try {
    await s3Client.send(new PutObjectCommand(mediaUploadParams));
  } catch (err) {
    logger.debug("Error", err);
    throw new Error(err);
  }

  const url = getS3URI(awsS3Bucket, filename);
  logger.debug(`Location: ${url}`);
  return url;
};

export default {
  uploadFile,
  s3Client,
};
