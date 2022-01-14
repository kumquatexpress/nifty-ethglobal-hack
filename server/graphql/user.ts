import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import config from "../../config";
import Web3PublicKey from "../models/Web3PublicKey.model";
import Profile from "../models/Profile.model";
import User from "../models/User.model";

const ProfileType = new GraphQLObjectType({
  name: "Profile",
  description: "The profile attached to a user",
  fields: {
    fullname: {
      type: GraphQLString,
      description: "The profile fullname",
    },
    image_url: {
      type: GraphQLString,
      description: "The profile image URL",
    },
    user_id: {
      type: GraphQLString,
    },
  },
});

const PublicKeyType = new GraphQLObjectType({
  name: "PublicKey",
  description: "The public key of the user's wallet",
  fields: {
    key: {
      type: new GraphQLNonNull(GraphQLString),
      description: "The base58 encoded public key",
    },
  },
});

const UserType = new GraphQLObjectType({
  name: "User",
  description: "A single user",
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: "The uuid of this user",
    },
    profile: {
      type: ProfileType,
      description: "The user's profile",
      resolve: async (parent, args, ctx, info) => {
        return await parent.$get("profile");
      },
    },
    publicKey: {
      type: PublicKeyType,
      description: "The user's public key",
      resolve: async (parent, args, ctx, info) => {
        return await parent.$get("public_key");
      },
    },
  },
});

const UserQueries = {
  user: {
    type: UserType,
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (parent, args, ctx, info) => {
      return await User.findByPk(args.id);
    },
  },
  currentUser: {
    type: UserType,
    description: "The current logged in user",
    resolve: (parent, args, ctx, info) => {
      return ctx.state.user;
    },
  },
  getBadges: {
    type: new GraphQLList(GraphQLJSONObject),
    description: "Retrieves a list of all badge metadata for the user",
    resolve: async (parent, args, ctx, info) => {
      const user = await User.findByPk(ctx.state.user.id, {
        include: Web3PublicKey,
      });
      return await user.getOwnedBadges();
    },
  },
  getQRCode: {
    type: new GraphQLNonNull(GraphQLString),
    description: "Retrieves the QR code for this user's public wallet",
    resolve: async (parent, args, ctx, info) => {
      const user = await User.findByPk(ctx.state.user.id, {
        include: Web3PublicKey,
      });
      const code = await user.getQRCodeHash();
      return `${config.app.CLIENT_HOSTNAME}/scan?code=${code}`;
    },
  },
  resolveQRCode: {
    type: new GraphQLNonNull(GraphQLString),
    args: {
      code: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    description: "Retrieves user public key from a QR code",
    resolve: async (parent, args, ctx, info) => {
      const key = await User.decodeQRCodeHash(args.code);
      return key;
    },
  },
};

const UserMutations = {
  editUserProfile: {
    type: UserType,
    args: {
      imageUrl: {
        type: GraphQLString,
      },
      fullname: {
        type: GraphQLString,
      },
    },
    resolve: async (parent, args, ctx, info) => {
      const user: User = await User.findByPk(ctx.state.user?.id, {
        include: [{ model: Profile }],
      });
      await user.createProfileIfNotExists();
      if (args.imageUrl) {
        user.profile.image_url = args.imageUrl;
      }
      if (args.fullname) {
        user.profile.fullname = args.fullname;
      }

      user.profile.save();
      return user;
    },
  },
};

export { UserType, UserQueries, UserMutations };
