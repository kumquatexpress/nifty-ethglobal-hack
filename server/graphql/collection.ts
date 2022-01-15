import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { Context } from "koa";
import { GraphQLDateTime } from "graphql-scalars";
import { GraphQLJSON } from "graphql-type-json";
import redis from "../utils/redis";
import Collection, {
  UPLOAD_ITEMS_PUBSUB_KEY,
} from "../models/Collection.model";
import logger from "../utils/logger";
import { ItemType } from "./item";
import { GraphQLUpload } from "graphql-upload";
import User from "../models/User.model";
import {
  GWEI_PER_ETH,
  TOOLBOX_ETH_PUBLIC_KEY,
} from "../utils/smart_contracts/toolbox/constants";
import s3 from "../utils/s3";
import config from "../../config";

const CollectionType = new GraphQLObjectType({
  name: "Collection",
  description: "A collection of items",
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: "The uuid of this collection",
    },
    metadata: {
      type: GraphQLJSON,
      description: "The metadata of this collection",
    },
    template_s3_url: {
      type: GraphQLString,
      description: "The s3 url of the template image",
    },
    machine_address: {
      type: GraphQLString,
      description: "The machine address on the blockchain",
    },
    status: {
      type: new GraphQLNonNull(GraphQLInt),
      description: "An integer corresponding to a status enum",
    },
    mint_start_time: {
      type: GraphQLDateTime,
    },
    price_gwei: {
      type: GraphQLFloat,
    },
    items: {
      type: new GraphQLList(ItemType),
      resolve: async (parent, args, ctx, info) => {
        return await parent.$get("items");
      },
    },
  },
});

const CollectionQueries = {
  collection: {
    type: CollectionType,
    args: {
      id: {
        description: "uuid of the collection",
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (parent, args, ctx, info) => {
      return await Collection.findByPk(args.id);
    },
  },
  collections: {
    type: new GraphQLList(CollectionType),
    args: {
      limit: {
        type: GraphQLInt,
      },
      order: {
        type: GraphQLString,
      },
    },
    resolve: async (parent, args, ctx, info) => {
      return await Collection.findAll({
        limit: args.limit,
        order: args.order,
      });
    },
  },
};

const CollectionMutations = {
  createCollection: {
    type: CollectionType,
    args: {
      name: {
        description: "The name of this collection - shows up on blockchain",
        type: new GraphQLNonNull(GraphQLString),
      },
      maxCount: {
        description: "Maximum number of tickets",
        type: new GraphQLNonNull(GraphQLInt),
      },
      symbol: {
        description: "Symbol for this collection",
        type: new GraphQLNonNull(GraphQLString),
      },
      royalty: {
        description: "Royalty fee percentage (0-100)",
        type: new GraphQLNonNull(GraphQLInt),
      },
      templateImage: {
        description: "Image file",
        type: GraphQLUpload,
      },
      price: {
        type: new GraphQLNonNull(GraphQLFloat),
        description: "The price in SOL (i.e. 1 SOL == 10^9 lamports)",
      },
      mintDate: {
        type: new GraphQLNonNull(GraphQLDateTime),
        description: "The launch date of this collection",
      },
    },
    resolve: async (
      parent,
      { name, templateImage, symbol, royalty, maxCount, mintDate, price },
      ctx: Context,
      info
    ) => {
      const { filename, mimetype, createReadStream, encoding } =
        await templateImage;
      const fileChunks = [];
      const stream = createReadStream();
      stream.on("readable", () => {
        let chunk;
        while (null !== (chunk = stream.read())) {
          fileChunks.push(chunk);
        }
      });

      let imageUrl = null;
      // TODO: handle errors
      await new Promise<void>((resolve) =>
        stream.on("end", async () => {
          const imageBuffer = Buffer.concat(fileChunks);
          imageUrl = await s3.uploadFile(
            config.aws.UPLOAD_BUCKET,
            filename,
            mimetype,
            imageBuffer
          );
          resolve();
        })
      );
      const user: User = ctx.state.user;

      const collection: Collection = await Collection.createCollection(
        {
          totalNFTs: maxCount,
          symbol,
          sellerFeeBasisPoints: royalty * 100,
          creators: [
            {
              address: TOOLBOX_ETH_PUBLIC_KEY,
              // This doesn't actually get set until signed
              verified: true,
              share: 100,
            },
          ],
        },
        name,
        imageUrl,
        user.id,
        mintDate,
        Math.floor(price * GWEI_PER_ETH)
      );
      return collection;
    },
  },
  generateItemsFromTemplate: {
    type: new GraphQLNonNull(GraphQLBoolean),
    args: {
      id: {
        description: "ID of this collection",
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (parent, args, ctx, info) => {
      let collection: Collection = await Collection.findByPk(args.id);
      if (!collection || collection.user_id !== ctx.state.user.id) {
        throw new Error("Collection not found");
      }
      await redis.redisClient.rpush(
        redis.WORKER_LISTEN_QUEUE,
        JSON.stringify({
          type: redis.WORKER_MSG_QUEUES.createItemsFromTemplate.name,
          request: {
            collectionId: collection.id,
          },
        })
      );
      return true;
    },
  },
  addItemsToMachine: {
    type: CollectionType,
    args: {
      id: {
        description: "ID of this collection",
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (parent, args, ctx, info) => {
      try {
        let collection: Collection = await Collection.findByPk(args.id);
        if (!collection || collection.user_id !== ctx.state.user.id) {
          throw new Error("Collection not found");
        }
        await redis.redisClient.rpush(
          redis.WORKER_LISTEN_QUEUE,
          JSON.stringify({
            type: redis.WORKER_MSG_QUEUES.addItemsToMachine.name,
            request: {
              collectionId: collection.id,
            },
          })
        );
        return collection;
      } catch (exx) {
        logger.error("addItemsToSolana: ", exx);
        throw new Error(exx);
      }
    },
  },
  createMachine: {
    type: CollectionType,
    args: {
      id: {
        description: "ID of this collection",
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (parent, args, ctx, info) => {
      try {
        let collection: Collection = await Collection.findByPk(args.id);
        if (!collection) {
          throw new Error("Collection not found");
        }
        await collection.createMachine();
        return collection;
      } catch (exx) {
        logger.error("createCandyMachine: ", exx);
        throw new Error(exx);
      }
    },
  },
};

const CollectionSubscriptions = {
  subscribeToItemUploadStatus: {
    type: GraphQLString,
    args: {
      id: {
        description: "ID of the collection",
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (payload, args, ctx, _) => {
      /*
          payload is { statusMessage }
          ctx is {userId: 'something'}
          */
      return payload.statusMessage;
    },
    subscribe: (_, args) =>
      redis.pubsub.asyncIterator(UPLOAD_ITEMS_PUBSUB_KEY(args.id)),
  },
};

export {
  CollectionType,
  CollectionQueries,
  CollectionMutations,
  CollectionSubscriptions,
};
