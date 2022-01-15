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
import Collection, { UPLOAD_ITEMS_PUBSUB_KEY } from "./Collection.model";
import { createCanvas, Image } from "canvas";
import redis from "../utils/redis";
import { pl8 } from "../utils/helpers";

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

  async drawBadge(
    rarity: "common" | "uncommon" | "rare"
  ): Promise<Buffer | null> {
    const collection = await this.$get("collection");
    const { hugImage, bgColor, fontStrokeColor, fontFillColor, rarityMapping } =
      collection.badge_metadata;

    const size = 256;
    const paddingColor = rarityMapping[rarity].color;

    function RGBAColorToString(color: any): string {
      return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
    }
    function roundRect(ctx, x, y, width, height, radius) {
      if (typeof radius === "undefined") {
        radius = 5;
      }
      if (typeof radius === "number") {
        radius = {
          tl: radius,
          tr: radius,
          br: radius,
          bl: radius,
        };
      } else {
        var defaultRadius = {
          tl: 0,
          tr: 0,
          br: 0,
          bl: 0,
        };
        for (var side in defaultRadius) {
          // @ts-ignore
          radius[side] = radius[side] || defaultRadius[side];
        }
      }
      ctx.beginPath();
      ctx.moveTo(x + radius.tl, y);
      ctx.lineTo(x + width - radius.tr, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
      ctx.lineTo(x + width, y + height - radius.br);
      ctx.quadraticCurveTo(
        x + width,
        y + height,
        x + width - radius.br,
        y + height
      );
      ctx.lineTo(x + radius.bl, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
      ctx.lineTo(x, y + radius.tl);
      ctx.quadraticCurveTo(x, y, x + radius.tl, y);
      ctx.closePath();
    }
    const canvas = createCanvas(256, 256);

    // we need to account for the border
    const sizeOfImage = hugImage ? (8 / 10) * size : (6.4 / 10) * size;
    const borderRadius = (1 / 10) * size;
    const paddingRadius = (1 / 15) * size;
    const borderSize = (1 / 50) * size;
    const innerBorderRadius = (1 / 30) * size;
    const paddingSize = (1 / 10) * size;
    const sizeOfNumber = (1.5 / 10) * size;
    const sizeOfNumberMargin = (0.3 / 10) * size;
    const sizeOfHash = (0.8 / 10) * size;
    const sizeOfHashMargin = (0.1 / 10) * size;
    const calculatedSizeOfPaddingPerSide = hugImage ? 0 : (0.8 / 10) * size;
    const renderedImgDrawPosX = paddingSize + calculatedSizeOfPaddingPerSide;
    const renderedImgDrawPosY = renderedImgDrawPosX;

    if (canvas) {
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas?.getContext("2d");
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        ctx.clearRect(0, 0, size, size);
        ctx.fillStyle = RGBAColorToString(bgColor);

        const image = new Image();
        image.src = this.s3_url;

        ctx.fillRect(
          paddingSize / 2,
          paddingSize / 2,
          size - paddingSize,
          size - paddingSize
        );
        await new Promise((resolve, reject) => {
          image.onload = function () {
            ctx.drawImage(
              image,
              renderedImgDrawPosX,
              renderedImgDrawPosY,
              sizeOfImage,
              sizeOfImage
            );
            console.log("image drawn", {
              renderedImgDrawPosX,
              renderedImgDrawPosY,
              sizeOfImage,
            });
            resolve(image);
          };
        });

        // if (svgBorder != null) {
        //   ctx.drawImage(svgBorder, 0, 0, size, size);
        // } else {
        console.log("rendering border");
        if (paddingColor != null) {
          roundRect(
            ctx,
            paddingSize / 2,
            paddingSize / 2,
            size - paddingSize,
            size - paddingSize,
            paddingRadius
          );
          ctx.lineWidth = paddingSize;
          ctx.strokeStyle = RGBAColorToString(paddingColor);
          ctx.stroke();
        }
        roundRect(
          ctx,
          borderSize / 2,
          borderSize / 2,
          size - borderSize,
          size - borderSize,
          borderRadius
        );
        ctx.lineWidth = borderSize;
        ctx.strokeStyle = "black";
        ctx.stroke();

        roundRect(
          ctx,
          paddingSize,
          paddingSize,
          size - paddingSize * 2,
          size - paddingSize * 2,
          innerBorderRadius
        );
        ctx.lineWidth = borderSize;
        ctx.strokeStyle = "white";
        ctx.stroke();

        ctx.shadowColor = "transparent";

        ctx.font = `bold ${sizeOfNumber}px Itim`;
        const num = this.num;
        const blur = 1;
        const width = ctx.measureText(num.toString()).width;

        const numDrawPosX = size - width - paddingSize - sizeOfNumberMargin;
        const numDrawPosY = size - paddingSize - sizeOfNumber;
        ctx.textBaseline = "top";
        ctx.shadowColor = "pink";
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = blur;
        ctx.strokeStyle = RGBAColorToString(fontStrokeColor);
        ctx.strokeText(num.toString(), numDrawPosX, numDrawPosY);
        ctx.fillStyle = RGBAColorToString(fontFillColor);
        ctx.fillText(num.toString(), numDrawPosX, numDrawPosY);

        ctx.font = `bold ${sizeOfHash}px Itim`;
        var hash = `#`;
        var widthOfHash = ctx.measureText(hash).width;
        ctx.strokeStyle = RGBAColorToString(fontStrokeColor);
        ctx.strokeText(
          hash,
          numDrawPosX - widthOfHash - sizeOfHashMargin,
          numDrawPosY
        );
        ctx.fillText(
          hash,
          numDrawPosX - widthOfHash - sizeOfHashMargin,
          numDrawPosY
        );
      }
      console.log("drawing done");
      return canvas.toBuffer("image/png");
    }
  }

  async addToCloudStorage(
    provider: "pinata" | "arweave" | "aws",
    rarity: "common" | "uncommon" | "rare" = "common"
  ): Promise<Item> {
    if (!this.metadata) {
      return;
    }
    let contents;
    try {
      contents = await this.drawBadge(rarity);
    } catch (e) {
      console.log("error", e);
      throw e;
    }
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
    this.metadata.attributes = [
      ...this.metadata.attributes,
      { trait_type: "rarity", value: rarity },
    ];
    this.status = ItemStatus.UPLOADED_TO_IPFS;
    await this.save();
    return this;
  }

  static async addForCollectionWithRarity(
    provider: "pinata" | "arweave" | "aws",
    items: Item[],
    collection: Collection
  ): Promise<Item[]> {
    console.log("this many items", items.length);
    let numUploaded = 0;
    const rarity = Array(items.length);
    const { common, uncommon, rare } = collection.badge_metadata.rarityMapping;
    const modifier = items.length / (common.pct + uncommon.pct + rare.pct);
    const [commonIdx, uncommonIdx, rareIdx] = [
      Math.round(common.pct * modifier),
      Math.round(uncommon.pct * modifier),
      Math.round(rare.pct * modifier),
    ];
    items.forEach((v, idx) => {
      if (idx < commonIdx) {
        rarity[idx] = "common";
      } else if (idx < commonIdx + uncommonIdx) {
        rarity[idx] = "uncommon";
      } else if (idx < commonIdx + uncommonIdx + rareIdx) {
        rarity[idx] = "rare";
      } else {
        rarity[idx] = "common";
      }
    });
    // Shuffle this
    for (let i = rarity.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rarity[i], rarity[j]] = [rarity[j], rarity[i]];
    }
    console.log("rarity", rarity);

    const uploadPromises = await Promise.allSettled(
      items.map((item, idx) =>
        pl8(
          async () =>
            await item.addToCloudStorage(provider, rarity[idx]).then((res) => {
              numUploaded += 1;
              redis.pubsub.publish(UPLOAD_ITEMS_PUBSUB_KEY(collection.id), {
                statusMessage: `Uploaded ${numUploaded} out of ${items.length}`,
              });
              return res;
            })
        )
      )
    );
    return uploadPromises
      .filter((m) => m.status === "fulfilled")
      .map((m) => (m as any).value);
  }
}
