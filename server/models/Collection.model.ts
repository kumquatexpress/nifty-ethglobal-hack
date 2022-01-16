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
  BelongsTo,
  ForeignKey,
} from "sequelize-typescript";
import { Op } from "sequelize";
import { v4 } from "uuid";
import redis from "../utils/redis";
import logger from "../utils/logger";
import {
  createMachine,
  getTokensFromMachine,
} from "../utils/smart_contracts/toolbox/machine";

import {
  addLinksToCollection,
  machineDataFromCollection,
} from "../utils/smart_contracts/toolbox/collections";
import {
  TOOLBOX_ROYALTY,
  TOOLBOX_ETH_PUBLIC_KEY,
} from "../utils/smart_contracts/toolbox/constants";
import {
  CollectionMetadata,
  NFTManifest,
} from "../utils/smart_contracts/toolbox/types";
import Item, { ItemStatus } from "./Item.model";
import User from "./User.model";
import Profile from "./Profile.model";
import { numberToNthString, pl13, pl8 } from "../utils/helpers";
import { getAllTokensForWalletAndContract } from "../utils/smart_contracts/moralis";

export const UPLOAD_ITEMS_PUBSUB_KEY = (collectionId: string) => {
  return `${collectionId}-upload-items`;
};
export class InvalidCollectionStatus extends Error {}

export enum CollectionStatus {
  UNKNOWN = 0,
  NOT_ON_BLOCKCHAIN = 1,
  ON_BLOCKCHAIN_ITEMS_NOT_CREATED = 2,
  READY_TO_MINT = 3,
  MINTING_COMPLETE_SUPPLY_EXHAUSTED = 5,
}

export interface BadgeMetadata {
  size: number;
  hugImage: boolean;
  bgColor: { r: number; g: number; b: number; a: number };
  fontStrokeColor: { r: number; g: number; b: number; a: number };
  fontFillColor: { r: number; g: number; b: number; a: number };
  rarityMapping: {
    ["common"]: {
      pct: number;
      color: { r: number; g: number; b: number; a: number };
    };
    ["uncommon"]: {
      pct: number;
      color: { r: number; g: number; b: number; a: number };
    };
    ["rare"]: {
      pct: number;
      color: { r: number; g: number; b: number; a: number };
    };
  };
}

@Table({
  timestamps: true,
  tableName: "collections",
  underscored: true,
})
export default class Collection extends Model {
  static Items;
  static User;

  @Default(v4)
  @PrimaryKey
  @Column(DataType.UUID)
  id: string;

  @Column(DataType.JSON)
  metadata: CollectionMetadata;

  @Column(DataType.JSON)
  badge_metadata: BadgeMetadata;

  @Column(DataType.STRING)
  template_s3_url: string;

  @Default(0)
  @Column(DataType.INTEGER)
  status: CollectionStatus;

  @Column(DataType.STRING)
  machine_address: string;

  @Column(DataType.DATE)
  mint_start_time: Date;

  @Column(DataType.INTEGER)
  price_gwei: number;

  @Column(DataType.STRING)
  name: string;

  @Column(DataType.STRING)
  discord_guild_id: string;

  @Column(DataType.STRING)
  discord_role_id: string;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  user_id: string;

  @BelongsTo(() => User, "user_id")
  user: User;

  @CreatedAt
  created_at!: Date;
  @UpdatedAt
  updated_at!: Date;

  @HasMany(() => Item, "collection_id")
  items: Item[];

  static async createCollection(
    metadata: CollectionMetadata,
    name: string,
    templateS3Url: string,
    userId: string,
    mintDate: Date,
    priceGwei: number,
    badgeMetadata: BadgeMetadata
  ): Promise<Collection> {
    // Set the royalty to be 5% higher
    const adjustedRoyalty =
      metadata.sellerFeeBasisPoints + TOOLBOX_ROYALTY * 100;
    // Set the creators shares to be such that the platform always gets 5% of the total
    // e.g. if the creator wants 15% royalty, the total royalty will be 20% and share will be 75/25
    // TODO fix this, share has to sum up to 100 and can only be integers
    // We assume right now that there can only be 1 metadata.creator (other than the platform)
    // Which is why share is always set to 100 at first
    const platformPctShare = Math.floor(
      ((TOOLBOX_ROYALTY * 100) / adjustedRoyalty) * 100
    );
    // Small hack for testing/making collections belonging to the platform
    // If the creator is the platform key, then don't do anything since we can't
    // have duplicate public keys in the creators array.
    const adjustedCreators =
      metadata.creators[0].address === TOOLBOX_ETH_PUBLIC_KEY
        ? metadata.creators
        : [
            ...metadata.creators.map((c) => {
              return { ...c, share: 100 - platformPctShare };
            }),
            {
              address: TOOLBOX_ETH_PUBLIC_KEY,
              share: platformPctShare,
              verified: true,
            },
          ];
    const adjustedMetadata = {
      ...metadata,
      sellerFeeBasisPoints: adjustedRoyalty,
      creators: adjustedCreators,
    };
    const collection: Collection = await Collection.create({
      name: name,
      metadata: adjustedMetadata,
      status: CollectionStatus.NOT_ON_BLOCKCHAIN,
      template_s3_url: templateS3Url,
      user_id: userId,
      mint_start_time: mintDate,
      price_gwei: priceGwei,
      badge_metadata: badgeMetadata,
    });
    await redis.redisClient.rpush(
      redis.WORKER_LISTEN_QUEUE,
      JSON.stringify({
        type: redis.WORKER_MSG_QUEUES.syncCollectionToDiscord.name,
        request: {
          collectionId: collection.id,
        },
      })
    );
    return collection;
  }

  /*
   * Generates N items with assets uploaded to S3 from the template image
   * and adds each item to this collection.
   */
  async generateItemsFromTemplate(): Promise<Item[]> {
    const user = await User.findByPk(this.user_id, {
      include: Profile,
    });
    const creatorName = user.profile?.fullname || "blah";
    const itemMetadatas = [...Array(this.metadata.totalNFTs).keys()].map(
      (itemNum) => {
        const metadata: NFTManifest = {
          name: `${this.name} #${itemNum + 1}`,
          symbol: this.metadata.symbol,
          description: `The ${numberToNthString(
            itemNum + 1
          )} badge in ${creatorName}'s collection ${this.name}`,
          seller_fee_basis_points: this.metadata.sellerFeeBasisPoints,
          image: null,
          animation_url: null,
          external_url: null,
          attributes: [],
          properties: {
            files: [],
            creators: this.metadata.creators,
            category: "image",
          },
          collection: {
            name: this.name,
            family: creatorName,
          },
        };
        return metadata;
      }
    );

    const existingItems: Item[] = await this.$get("items");
    const existingNums = {};
    existingItems.forEach((i) => (existingNums[i.num] = true));

    const itemPromises = await Promise.allSettled(
      itemMetadatas.map((itemMetadata, idx) => {
        const num = idx + 1;
        if (existingNums[num]) {
          return;
        }
        return Item.create({
          collection_id: this.id,
          s3_url: this.template_s3_url,
          metadata: itemMetadata,
          status: ItemStatus.NOT_IN_IPFS,
          num: num,
        });
      })
    );
    redis.pubsub.publish(UPLOAD_ITEMS_PUBSUB_KEY(this.id), {
      statusMessage: "Created all items, now uploading...",
    });

    const items: Item[] = itemPromises
      .filter((m) => m.status === "fulfilled")
      .map((m) => (m as any).value);

    const toUpload = items
      .concat(existingItems)
      .filter((item) => item && item.status === ItemStatus.NOT_IN_IPFS);
    console.log("about to upload", toUpload.length);
    return await Item.addForCollectionWithRarity("pinata", toUpload, this);
  }

  /*
   * Coverts the items on this collection into metadata that is saved into the collection
   * program on solana. The items must have been UPLOADED_TO_IPFS by this time, otherwise
   * they will be ignored. Each item is marked as ADDED_TO_COLLECTION during this step.
   */
  async addNFTsToMachine(): Promise<Collection> {
    if (this.status < CollectionStatus.ON_BLOCKCHAIN_ITEMS_NOT_CREATED) {
      const message =
        "Attempted to add NFTs to a Machine that was not created yet";
      logger.error(message);
      throw new InvalidCollectionStatus(message);
    }
    try {
      const items = await this.$get("items");
      const eligibleItems = items.filter(
        (i) => i.status == ItemStatus.UPLOADED_TO_IPFS
      );
      const itemMetadata = eligibleItems.map((i) => {
        return {
          link: i.ipfs_metadata.link,
          name: i.ipfs_metadata.name,
          onChain: false,
        };
      });
      await addLinksToCollection(itemMetadata, this.machine_address);
      // Set item statuses and upsert
      await Item.update(
        { status: ItemStatus.IN_MACHINE },
        {
          where: {
            id: eligibleItems.map((i) => i.id),
          },
        }
      );
      // Set collection status
      this.status = CollectionStatus.READY_TO_MINT;
      await this.save();
      return this;
    } catch (e) {
      logger.error("addLinksToCollection failed, ", e);
      throw e;
    }
  }

  async createMachine(): Promise<Collection> {
    if (this.status !== CollectionStatus.NOT_ON_BLOCKCHAIN) {
      const message =
        "Attempted to generate machine from a collection with no items on the blockchain";
      logger.error(message);
      throw new InvalidCollectionStatus(message);
    }
    const machineResp = await createMachine(machineDataFromCollection(this));
    // Set collection status
    this.machine_address = machineResp.machineAddress;
    this.status = CollectionStatus.ON_BLOCKCHAIN_ITEMS_NOT_CREATED;
    await this.save();
    return;
  }

  /*
  "result": [
    {
      "token_address": "0x057Ec652A4F150f7FF94f089A38008f49a0DF88e",
      "token_id": "15",
      "contract_type": "ERC721",
      "owner_of": "0x057Ec652A4F150f7FF94f089A38008f49a0DF88e",
      "block_number": "88256",
      "block_number_minted": "88256",
      "token_uri": "string",
      "metadata": "string",
      "synced_at": "string",
      "amount": "1",
      "name": "CryptoKitties",
      "symbol": "RARI"
    }
  ]
  */
  async getNFTsInWallet(walletPublicKey: string): Promise<any[]> {
    const addresses = await getAllTokensForWalletAndContract(
      walletPublicKey,
      this.machine_address
    );
    return addresses;
  }

  async getNFTsMatchingOwnedTokens(ownedTokens: string[]): Promise<any[]> {
    const mints = await getTokensFromMachine(this.machine_address);
    console.log("mints", mints);
    const matchingAddrs = mints
      .map((m) => m.token_address)
      .filter((v) => ownedTokens.includes(v));
    return matchingAddrs;
  }
}
