import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import StripePayment from "../models/StripePayment.model";
import { Context } from "koa";
import { GraphQLPositiveInt } from "graphql-scalars";

const PaymentType = new GraphQLObjectType({
  name: "Payment",
  description: "A single non-crypto payment",
  fields: {
    stripe_payment_id: {
      type: GraphQLString,
      description: "The stripe id if this payment was made with stripe",
    },
    user_id: {
      type: GraphQLString,
    },
    collection_id: {
      type: GraphQLString,
      description: "The collection that this payment was made to mint from",
    },
  },
});

const PaymentQueries = {
  payment: {
    type: PaymentType,
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (parent, args, ctx: Context, info) => {
      const payment = await StripePayment.findByPk(args.id);
      if (payment.user_id === ctx.state.user?.id) {
        return payment;
      }
      return null;
    },
  },
};

const PaymentMutations = {
  getPaymentIntent: {
    type: new GraphQLNonNull(GraphQLString),
    args: {
      amountCents: {
        type: new GraphQLNonNull(GraphQLPositiveInt),
      },
      collectionId: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (parent, args, ctx: Context, info) => {
      const intent = await StripePayment.createNewPaymentIntent(
        ctx.state.user.id,
        args.collectionId,
        args.amountCents,
      );
      return intent.client_secret;
    },
  },
};

export { PaymentType, PaymentQueries, PaymentMutations };
