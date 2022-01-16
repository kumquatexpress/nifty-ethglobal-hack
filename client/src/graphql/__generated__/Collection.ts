/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Collection
// ====================================================

export interface Collection_collection_items {
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

export interface Collection_collection_owner_profile {
  __typename: "Profile";
  /**
   * The profile fullname
   */
  fullname: string | null;
}

export interface Collection_collection_owner {
  __typename: "User";
  /**
   * The user's profile
   */
  profile: Collection_collection_owner_profile | null;
}

export interface Collection_collection {
  __typename: "Collection";
  /**
   * The name of this collection
   */
  name: string;
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
  items: (Collection_collection_items | null)[] | null;
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
  /**
   * The owner of this collection
   */
  owner: Collection_collection_owner | null;
}

export interface Collection {
  collection: Collection_collection | null;
}

export interface CollectionVariables {
  id: string;
}
