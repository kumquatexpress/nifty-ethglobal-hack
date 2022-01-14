import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  HasMany,
  Default,
  DataType,
  PrimaryKey,
  HasOne,
} from "sequelize-typescript";
import * as anchor from "@project-serum/anchor";
import { v4 } from "uuid";
import Web3PublicKey from "./Web3PublicKey.model";
import Profile from "./Profile.model";
import config from "../../config";
import {
  decodeTokenMetadata,
  getOwnedTokenAccounts,
  getSolanaMetadataAddress,
} from "../utils/smart_contracts/toolbox/token_lookup";
import * as crypto from "../utils/crypto";
import Collection from "./Collection.model";
import { pl13 } from "../utils/helpers";
import DiscordGuild from "./DiscordGuild.model";

@Table({
  timestamps: true,
  tableName: "users",
  underscored: true,
})
export default class User extends Model {
  static Profile;
  static PublicKey;
  static Collections;
  static Events;
  static DiscordGuilds;

  @Default(v4)
  @PrimaryKey
  @Column(DataType.UUID)
  id: string;

  @Default(0)
  @Column
  flags!: number;

  @Column(DataType.STRING)
  discord_user_id: string;

  @CreatedAt
  created_at!: Date;
  @UpdatedAt
  updated_at!: Date;

  @HasMany(() => Collection, "user_id")
  collections: Collection[];

  @HasMany(() => DiscordGuild, "user_id")
  discord_guilds: DiscordGuild[];

  @HasOne(() => Profile, "user_id")
  profile: Profile;

  @HasOne(() => Web3PublicKey, "user_id")
  public_key: Web3PublicKey;

  async createProfileIfNotExists() {
    if (!this.profile) {
      await Profile.create({
        user_id: this.id,
      });
      await this.reload({ include: [{ model: Profile }] });
    }
  }

  async getOwnedBadges() {
    const connection = new anchor.web3.Connection(config.solana.RPC_ENDPOINT);
    const accounts = await getOwnedTokenAccounts(
      connection,
      new anchor.web3.PublicKey(this.public_key.key)
    );
    let metadataPromise = await Promise.allSettled(
      accounts.map((acc) =>
        pl13(
          async () =>
            await getSolanaMetadataAddress(
              new anchor.web3.PublicKey(acc.accountInfo.data.mint)
            )
        )
      )
    );
    const metadata: anchor.web3.PublicKey[] = metadataPromise
      .filter((m) => m.status === "fulfilled")
      .map((m) => (m as any).value);

    const accountsRawMetadata = await connection.getMultipleAccountsInfo(
      metadata
    );
    const accountsDecodedMetadata = accountsRawMetadata.map((acc) =>
      decodeTokenMetadata((acc as anchor.web3.AccountInfo<Buffer>)?.data)
    );
    /*
    {
        "key": 4,
        "updateAuthority": "mmRwXF6RSZ6XYpEjgPR8SdYjAtjuEb1ud5iooEHPJhb",
        "mint": "2gAg1vpMJByU6iKXnG6tobTKcEMU8rNCLc5vVmuhNrzV",
        "data": {
            "name": "A Sponge from BOBO",
            "symbol": "BOBO",
            "uri": "http://localstack:4566/toolbox-uploads/sponge.json",
            "sellerFeeBasisPoints": 800,
            "creators": [
            {
                "address": "3kvH7uRv2bKjoK4bdaNBbvXrokVdjKAUVnbRRgr1ce8J",
                "verified": 1,
                "share": 0
            },
            {
                "address": "mmRwXF6RSZ6XYpEjgPR8SdYjAtjuEb1ud5iooEHPJhb",
                "verified": 0,
                "share": 38
            },
            {
                "address": "BWXdDapLo31xq6vE8erZC2amNNn1fWmx91vu7ZjZ4NAp",
                "verified": 0,
                "share": 62
            }
            ]
        },
        "primarySaleHappened": 1,
        "isMutable": 1,
        "editionNonce": 254
    },
    */
    return accountsDecodedMetadata;
  }

  /*
   * Generates an encrypted hash containing the public key of this user with some timestamp
   * to fake nondeterminism.
   */
  async getQRCodeHash(): Promise<string> {
    const now = Date.now() / 1000;
    const hash = crypto.encrypt(`${this.public_key.key} ${now}`);
    return crypto.toBase64WithDelimiter(hash);
  }

  static decodeQRCodeHash(str: string): string {
    const hash = crypto.fromBase64WithDelimiter(str);
    const [key, _] = crypto.decrypt(hash).split(" ");
    return key;
  }
}
