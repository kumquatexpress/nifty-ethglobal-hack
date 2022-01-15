import { GraphQLObjectType, GraphQLSchema } from "graphql";
import {
  CollectionQueries,
  CollectionMutations,
  CollectionSubscriptions,
} from "./collection";
import { ItemMutations, ItemQueries } from "./item";
import { UserQueries, UserMutations } from "./user";

const rootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: Object.assign(CollectionQueries, ItemQueries, UserQueries),
});
const rootMutation = new GraphQLObjectType({
  name: "RootMutation",
  fields: Object.assign(CollectionMutations, ItemMutations, UserMutations),
});

let schema = new GraphQLSchema({
  query: rootQuery,
  mutation: rootMutation,
  subscription: new GraphQLObjectType({
    name: "RootSubscription",
    fields: Object.assign(CollectionSubscriptions),
  }),
});

// const checkAuth = async (resolve, root, args, ctx, info) => {
//   if (!ctx.state.user) {
//     return null;
//   }
//   const result = await resolve(root, args, ctx, info);
//   return result;
// };

// schema = applyMiddleware(schema, checkAuth);

export default schema;
