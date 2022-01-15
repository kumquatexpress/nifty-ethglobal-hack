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
import { v4 } from "uuid";
import Web3PublicKey from "./Web3PublicKey.model";
import Profile from "./Profile.model";
import * as crypto from "../utils/crypto";
import Collection from "./Collection.model";
import DiscordGuild from "./DiscordGuild.model";
import { getTokensOwnedByAccount } from "../utils/smart_contracts/toolbox/machine";

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
    const tokens = await getTokensOwnedByAccount(this.public_key.key);
    return tokens;
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
