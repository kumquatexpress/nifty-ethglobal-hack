import { createMessage, encrypt as pgpEncrypt, readKey } from "openpgp";
import axios from "axios";

interface PublicKey {
  keyId: string;
  publicKey: string;
}

export interface CreateCardPayload {
  idempotencyKey: string;
  keyId: string;
  encryptedData: string;
  billingDetails: {
    name: string;
    city: string;
    country: string;
    line1: string;
    line2: string;
    district: string;
    postalCode: string;
  };
  expMonth: number;
  expYear: number;
  metadata: any;
}

export interface BasePaymentPayload {
  idempotencyKey: string;
  amount: {
    amount: string;
    currency: string;
  };
  source: {
    id: string;
    type: string;
  };
  description: string;
  channel: string;
  metadata: any;
}

export interface CreateCardPaymentPayload extends BasePaymentPayload {
  verification?: string;
  autoCapture?: boolean;
  verificationSuccessUrl?: string;
  verificationFailureUrl?: string;
  keyId?: string;
  encryptedData?: string;
}

const instance = axios.create({
  baseURL: "https://api-sandbox.circle.com",
});

export async function getPCIPublicKey(): Promise<PublicKey> {
  const url = "/v1/encryption/public";

  const resp = await instance.get(url);
  return resp.data;
}

export async function createCard(payload: CreateCardPayload): Promise<any> {
  const url = "/v1/cards";
  if (payload.metadata) {
    payload.metadata.phoneNumber = payload.metadata.phoneNumber || null;
  }
  const resp = await instance.post(url, payload);
  /*
    {
    "data":{
        "id":"1e38dcef-a947-493a-a674-f623e4418ace"
        "status":"pending"
        "billingDetails":{...}
        "expMonth":1
        "expYear":2020
        "network":"VISA"
        "last4":"0123"
        "bin":"401230"
        "issuerCountry":"US"
        "fundingType":"credit"
        "fingerprint":"eb170539-9e1c-4e92-bf4f-1d09534fdca2"
        "errorCode":"verification_failed"
        "verification":{...}
        "riskEvaluation":{...}
        "metadata":{...}
        "createDate":"2019-09-18T19:19:01Z"
        "updateDate":"2019-09-18T19:20:00Z"
    }
  }
  */
  return resp.data?.data;
}

export async function createPayment(payload: BasePaymentPayload): Promise<any> {
  const url = "/v1/payments";
  if (payload.metadata) {
    payload.metadata.phoneNumber = payload.metadata.phoneNumber || null;
  }
  /*
  {
    "data":{
        "id":"fc988ed5-c129-4f70-a064-e5beb7eb8e32"
        "type":"payment"
        "merchantId":"fc988ed5-c129-4f70-a064-e5beb7eb8e32"
        "merchantWalletId":"212000"
        "amount":{...}
        "source":{...}
        "description":"Payment"
        "status":"pending"
        "captured":false
        "captureAmount":{...}
        "captureDate":"2020-04-10T02:13:30.000Z"
        "requiredAction":{...}
        "verification":{...}
        "cancel":{...}
        "refunds":[...]
        "fees":{...}
        "trackingRef":"24910599141085313498894"
        "errorCode":"payment_failed"
        "metadata":{...}
        "riskEvaluation":{...}
        "channel":"ba943ff1-ca16-49b2-ba55-1057e70ca5c7"
        "createDate":"2020-04-10T02:13:30.000Z"
        "updateDate":"2020-04-10T02:13:30.000Z"
    }
  }
  */
  return instance.post(url, payload);
}

export async function getPaymentById(id: string): Promise<any> {
  const url = `/v1/payments/${id}`;

  const resp = await instance.get(url);
  /*
  {
    "data":{
        "id":"fc988ed5-c129-4f70-a064-e5beb7eb8e32"
        "type":"payment"
        "merchantId":"fc988ed5-c129-4f70-a064-e5beb7eb8e32"
        "merchantWalletId":"212000"
        "amount":{...}
        "source":{...}
        "description":"Payment"
        "status":"pending"
        "requiredAction":{...}
        "verification":{...}
        "originalPayment":{...}
        "cancel":{...}
        "refunds":[...]
        "fees":{...}
        "trackingRef":"24910599141085313498894"
        "externalRef":"YYYYMMDDXXXXXXXX012345"
        "errorCode":"payment_failed"
        "metadata":{...}
        "channel":"ba943ff1-ca16-49b2-ba55-1057e70ca5c7"
        "riskEvaluation":{...}
        "createDate":"2020-04-10T02:13:30.000Z"
        "updateDate":"2020-04-10T02:13:30.000Z"
    }
 }
*/
  return resp.data?.data;
}

export async function encrypt(
  dataToEncrypt: object,
  { keyId, publicKey }: PublicKey
) {
  if (!publicKey || !keyId) {
    throw new Error("Unable to encrypt data");
  }

  const decodedPublicKey = await readKey({
    armoredKey: Buffer.from(publicKey, "base64").toString("utf-8"),
  });
  const message = await createMessage({ text: JSON.stringify(dataToEncrypt) });
  return pgpEncrypt({
    message,
    encryptionKeys: decodedPublicKey,
  }).then((ciphertext) => {
    return {
      encryptedMessage: Buffer.from(ciphertext, "utf-8").toString("base64"),
      keyId,
    };
  });
}
