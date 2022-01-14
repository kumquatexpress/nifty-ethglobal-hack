import {
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import Collection from "../models/Collection.model";
import Item, { ItemStatus } from "../models/Item.model";
import Profile from "../models/Profile.model";
import User from "../models/User.model";
import { NFTManifest } from "../utils/smart_contracts/toolbox/types";

const ItemType = new GraphQLObjectType({
  name: "Item",
  description: "A single item",
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: "The uuid of this item",
    },
    metadata: {
      type: GraphQLJSONObject,
      description: "The metadata attached to this item",
    },
    s3_url: {
      type: GraphQLString,
      description: "The s3 url of this item asset",
    },
    ipfs_metadata: {
      type: GraphQLJSONObject,
      description: "The metadata about where this item is uploaded",
    },
    status: {
      type: new GraphQLNonNull(GraphQLInt),
      description: "An integer corresponding to a status enum",
    },
  },
});

const ItemQueries = {
  item: {
    type: ItemType,
    args: {
      id: {
        description: "uuid of the collection",
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (parent, args, ctx, info) => {
      return await Item.findByPk(args.id);
    },
  },
};

const ItemMutations = {
  createItem: {
    type: ItemType,
    args: {
      name: {
        type: new GraphQLNonNull(GraphQLString),
      },
      description: {
        type: GraphQLString,
      },
      collectionId: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (parent, args, ctx, info) => {
      const collection = await Collection.findByPk(args.collectionId);
      if (!collection || collection.user_id !== ctx.state.user.id) {
        throw new Error("No collection found");
      }
      const user = await User.findByPk(ctx.state.user.id, {
        include: Profile,
      });
      const itemMetadata: NFTManifest = {
        name: args.name,
        symbol: collection.metadata.symbol,
        description: args.description,
        seller_fee_basis_points: collection.metadata.sellerFeeBasisPoints,
        image: null,
        animation_url: null,
        external_url: null,
        attributes: [],
        properties: {
          files: [],
          creators: collection.metadata.creators,
          category: "image",
        },
        collection: {
          name: collection.name,
          family: user.profile?.fullname,
        },
      };
      const item: Item = await Item.create({
        collection_id: args.collectionId,
        s3_url: collection.template_s3_url,
        metadata: itemMetadata,
        status: ItemStatus.NOT_IN_IPFS,
      });
      return item;
    },
  },
  addToCloudStorage: {
    type: ItemType,
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (parent, args, ctx, info) => {
      const item: Item = await Item.findByPk(args.id);
      if (!item) {
        return null;
      }
      return await item.addToCloudStorage("aws");
    },
  },
  createHashForQRCode: {
    type: new GraphQLNonNull(GraphQLString),
    args: {
      id: {
        description: "ID of this item",
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (parent, args, ctx, info) => {
      try {
        let item: Item = await Item.findByPk(args.id, { include: Collection });
        if (!item) {
          throw new Error("Item not found");
        }
        item.collection.id;
      } catch (exx) {
        throw new Error(exx);
      }
    },
  },
};

export { ItemType, ItemQueries, ItemMutations };
