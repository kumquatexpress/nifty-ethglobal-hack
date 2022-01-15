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
import User from "./User.model";

@Table({
  timestamps: true,
  tableName: "discord_guilds",
  underscored: true,
})
export default class DiscordGuild extends Model {
  static User;

  @PrimaryKey
  @Column(DataType.STRING)
  guild_id: string;

  @Column(DataType.STRING)
  main_channel_id: string; // the channel where users register/interact with the bot

  @Column(DataType.STRING)
  collections_category_id: string; // the category under which we put collections

  @PrimaryKey
  @ForeignKey(() => User)
  @Column(DataType.UUID)
  user_id: string;

  // Holds channel id => collection id and collection id => channel id
  @Default({})
  @Column(DataType.JSON)
  channel_mapping: {
    [key: string]: string;
  };

  @CreatedAt
  created_at!: Date;
  @UpdatedAt
  updated_at!: Date;

  @BelongsTo(() => User, "user_id")
  user: User;
}
