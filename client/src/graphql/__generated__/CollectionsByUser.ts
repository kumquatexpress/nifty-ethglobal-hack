/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CollectionsByUser
// ====================================================

export interface CollectionsByUser_collections_by_user_items {
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
  /**
   * An integer corresponding to a status enum
   */
  status: number;
}

export interface CollectionsByUser_collections_by_user {
  __typename: "Collection";
  /**
   * The name of this collection
   */
  name: string;
  /**
   * The id of the owner of this collection
   */
  user_id: any | null;
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
   * The machine address on the blockchain
   */
  machine_address: string | null;
  items: (CollectionsByUser_collections_by_user_items | null)[] | null;
  mint_start_time: any | null;
  price_gwei: number | null;
  /**
   * The s3 url of the template image
   */
  template_s3_url: string | null;
  /**
   * The badge metadata of this collection
   */
  badge_metadata: any | null;
}

export interface CollectionsByUser {
  collections_by_user: (CollectionsByUser_collections_by_user | null)[] | null;
}

export interface CollectionsByUserVariables {
  id: string;
}
