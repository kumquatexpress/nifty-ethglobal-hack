import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  Default,
  DataType,
  PrimaryKey,
} from "sequelize-typescript";
import { v4 } from "uuid";

@Table({
  timestamps: true,
  tableName: "livepeer_collections",
  underscored: true,
})
export default class LivepeerCollections extends Model {
  @Default(v4)
  @PrimaryKey
  @Column(DataType.UUID)
  id: string;

  @Column(DataType.STRING)
  livepeer_stream_id: string;
  @Column(DataType.UUID)
  collection_id: string;
  @CreatedAt
  created_at!: Date;
  @UpdatedAt
  updated_at!: Date;
}
