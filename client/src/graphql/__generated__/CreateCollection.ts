/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateCollection
// ====================================================

export interface CreateCollection_createCollection_items {
  __typename: "Item";
  /**
   * The uuid of this item
   */
  id: string;
  /**
   * The metadata about where this item is uploaded
   */
  ipfs_metadata: any | null;
  /**
   * The metadata attached to this item
   */
  metadata: any | null;
  /**
   * The s3 url of this item asset
   */
  s3_url: string | null;
}

export interface CreateCollection_createCollection {
  __typename: "Collection";
  /**
   * The uuid of this collection
   */
  id: string;
  /**
   * The metadata of this collection
   */
  metadata: any | null;
  /**
   * An integer corresponding to a status enum
   */
  status: number;
  /**
   * The badge metadata of this collection
   */
  badge_metadata: any | null;
  items: (CreateCollection_createCollection_items | null)[] | null;
}

export interface CreateCollection {
  createCollection: CreateCollection_createCollection | null;
}

export interface CreateCollectionVariables {
  name: string;
  maxCount: number;
  symbol: string;
  royalty: number;
  templateImage: any;
  mintDate: any;
  price: number;
  badgeMetadata: any;
}
