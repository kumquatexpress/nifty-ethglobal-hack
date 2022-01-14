import {
  Table,
  Column,
  Model,
  CreatedAt,
  BelongsTo,
  ForeignKey,
  UpdatedAt,
} from "sequelize-typescript";
import User from "./User.model";

@Table({
  timestamps: true,
  tableName: "web3_public_keys",
  underscored: true,
})
export default class Web3PublicKey extends Model {
  @Column({ primaryKey: true })
  key: string;
  @CreatedAt
  created_at!: Date;
  @UpdatedAt
  updated_at!: Date;

  @ForeignKey(() => User)
  @Column
  user_id: string;

  @BelongsTo(() => User, "user_id")
  user: User;
}
