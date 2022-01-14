import crypto from "crypto";
import config from "../../config";

const algorithm = "aes-256-ctr";
const secretKey = config.encode.SECRET;
const secretIv = config.encode.IV;
const key = crypto.createHash("sha256").update(secretKey).digest();
const iv32 = crypto.createHash("sha256").update(secretIv).digest();
const iv = Buffer.allocUnsafe(16);
iv32.copy(iv);

interface Hash {
  iv: string;
  content: string;
}

export function encrypt(text: string): Hash {
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return {
    iv: iv.toString("hex"),
    content: encrypted.toString("hex"),
  };
}

export function decrypt(hash: Hash): string {
  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(hash.iv, "hex")
  );

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(hash.content, "hex")),
    decipher.final(),
  ]);

  return decrypted.toString();
}

export function toBase64WithDelimiter(hash: Hash): string {
  return (
    Buffer.from(hash.iv, "hex").toString("base64") +
    Buffer.from(Buffer.from("|").toString("hex"), "hex").toString("base64") +
    Buffer.from(hash.content, "hex").toString("base64")
  );
}

export function fromBase64WithDelimiter(str: string): Hash {
  const [eiv, econtent] = str.split(Buffer.from("|").toString("base64"));
  const [biv, bcontent] = [
    Buffer.from(eiv, "base64"),
    Buffer.from(econtent, "base64"),
  ];

  return {
    iv: biv.toString("hex"),
    content: bcontent.toString("hex"),
  };
}
