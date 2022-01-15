import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  BelongsTo,
  Default,
  DataType,
  PrimaryKey,
  ForeignKey,
} from "sequelize-typescript";
import { v4 } from "uuid";
import fetch from "node-fetch";
import { uploadToCloudFS } from "../utils/smart_contracts/toolbox/collections";
import { UploadResult } from "../utils/smart_contracts/toolbox/collections";
import { NFTManifest } from "../utils/smart_contracts/toolbox/types";
import Collection from "./Collection.model";

export enum ItemStatus {
  UNKNOWN = 0,
  NOT_IN_IPFS = 1,
  UPLOADED_TO_IPFS = 2,
  IN_MACHINE = 3,
}

@Table({
  timestamps: true,
  tableName: "items",
  underscored: true,
})
export default class Item extends Model {
  static Collection;

  @Default(v4)
  @PrimaryKey
  @Column(DataType.UUID)
  id: string;

  @Column(DataType.JSON)
  metadata: NFTManifest;

  @Column(DataType.STRING)
  s3_url: string;

  @Column(DataType.JSON)
  ipfs_metadata: UploadResult;

  @Default(0)
  @Column(DataType.INTEGER)
  status: ItemStatus;

  @Column(DataType.INTEGER)
  num: number;

  @CreatedAt
  created_at!: Date;
  @UpdatedAt
  updated_at!: Date;

  @ForeignKey(() => Collection)
  @Column(DataType.UUID)
  collection_id: string;

  @BelongsTo(() => Collection, "collection_id")
  collection: Collection;

  async addToCloudStorage(
    provider: "pinata" | "arweave" | "aws"
  ): Promise<Item> {
    if (!this.metadata) {
      return;
    }
    const resp = await fetch(this.s3_url);
    const contents = await resp.buffer();
    const filename = encodeURIComponent(
      `${this.collection_id}_${this.metadata.name}`
    ).replaceAll("%", "");
    const result = await uploadToCloudFS(
      filename,
      contents,
      this.metadata,
      provider
    );
    this.ipfs_metadata = result;
    this.status = ItemStatus.UPLOADED_TO_IPFS;
    this.save();
    return this;
  }
}
