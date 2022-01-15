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

@Table({
  timestamps: true,
  tableName: "profiles",
  underscored: true,
})
export default class Profile extends Model {
  static User;

  @Default(v4)
  @PrimaryKey
  @Column(DataType.UUID)
  id: string;

  @Column(DataType.STRING)
  image_url: string;
  @Column(DataType.STRING)
  fullname: string;
  @CreatedAt
  created_at!: Date;
  @UpdatedAt
  updated_at!: Date;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  user_id: string;

  @BelongsTo(() => User, "user_id")
  user: User;
}
