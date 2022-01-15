import Stripe from "stripe";
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
import User from "./User.model";
import config from "../../config";
import Collection from "./Collection.model";

@Table({
  timestamps: true,
  tableName: "stripe_payments",
  underscored: true,
})
export default class StripePayment extends Model {
  static User;
  static Collection;

  @Default(v4)
  @PrimaryKey
  @Column(DataType.UUID)
  id: string;

  @Column(DataType.STRING)
  stripe_payment_id: string;
  @CreatedAt
  created_at!: Date;
  @UpdatedAt
  updated_at!: Date;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  user_id: string;

  @ForeignKey(() => Collection)
  @Column(DataType.UUID)
  collection_id: string;

  @BelongsTo(() => User, "user_id")
  user: User;

  @BelongsTo(() => Collection, "collection_id")
  collection: Collection;

  public static async createNewPaymentIntent(
    userId: string,
    collectionId: string,
    amountCents: number
  ): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    const stripe = new Stripe(config.stripe.SECRET_KEY, {
      apiVersion: "2020-08-27",
    });
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: "usd",
      payment_method_types: ["card"],
    });
    await StripePayment.create({
      stripe_payment_id: paymentIntent.id,
      user_id: userId,
      collection_id: collectionId,
    });
    return paymentIntent;
  }
}
