import { Sequelize } from "sequelize-typescript";
import config from "../../config";
import User from "./User.model";
import Collection from "./Collection.model";
import Web3PublicKey from "./Web3PublicKey.model";
import Item from "./Item.model";
import Profile from "./Profile.model";
import StripePayment from "./StripePayment.model";
import DiscordGuild from "./DiscordGuild.model";

export default function init() {
  const sequelize = new Sequelize(
    config.mysql.DATABASE,
    config.mysql.USER,
    config.mysql.PASSWORD,
    {
      host: config.mysql.HOST,
      dialect: "mariadb",
      pool: {
        max: 16,
        min: 0,
        idle: 10000,
      },
      logging: false,
    }
  );

  sequelize.addModels([
    User,
    Item,
    Collection,
    Web3PublicKey,
    Profile,
    StripePayment,
    DiscordGuild,
  ]);
  postInit();
  return sequelize;
}

// This sucks, what even is this
function postInit() {
  Collection.Items = Collection.hasMany(Item);
  Collection.User = Collection.belongsTo(User);
  User.Profile = User.hasOne(Profile);
  User.PublicKey = User.hasOne(Web3PublicKey);
  User.Collections = User.hasMany(Collection);
  User.DiscordGuilds = User.hasMany(DiscordGuild);
  Profile.User = Profile.belongsTo(User);
  StripePayment.User = StripePayment.belongsTo(User);
  StripePayment.Collection = StripePayment.belongsTo(Collection);
  DiscordGuild.User = DiscordGuild.belongsTo(User);
}
