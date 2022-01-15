export type RGBAColor = {
  r: number;
  g: number;
  b: number;
  a: number;
};

export type BadgeDataColor =
  | "fontStroke"
  | "fontFill"
  | "background"
  | "rare"
  | "common"
  | "uncommon";

export type BadgeDataType = {
  imgSrc: string | null;
  imgFile: string | null;
  colors: {
    [key in BadgeDataColor]: RGBAColor;
  };
  hugImage: boolean;
};

// import { CollectionStatus } from "../../../server/models/Collection.model";
// export { CollectionStatus as BadgerCollectionStatus };
// Note: this should be 1:1 with CollectionStatus, but CRA does not allow imports outside of src
export enum BadgerCollectionStatus {
  UNKNOWN = 0,
  NOT_ON_BLOCKCHAIN = 1,
  ON_BLOCKCHAIN_ITEMS_NOT_CREATED = 2,
  READY_TO_MINT = 3,
  MINTING_COMPLETE_SUPPLY_EXHAUSTED = 5,
}
