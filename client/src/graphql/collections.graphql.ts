import { gql } from "@apollo/client";
export const CREATE_COLLECTION = gql`
  mutation CreateCollection(
    $name: String!
    $maxCount: Int!
    $symbol: String!
    $royalty: Int!
    $templateImage: Upload!
    $mintDate: DateTime!
    $price: Float!
    $badgeMetadata: JSON!
  ) {
    createCollection(
      name: $name
      maxCount: $maxCount
      symbol: $symbol
      royalty: $royalty
      templateImage: $templateImage
      price: $price
      mintDate: $mintDate
      badgeMetadata: $badgeMetadata
    ) {
      name
      id
      metadata
      status
      badge_metadata
      items {
        id
        ipfs_metadata
        metadata
        s3_url
      }
    }
  }
`;

export const COLLECTION = gql`
  query Collection($id: String!) {
    collection(id: $id) {
      name
      id
      metadata
      status
      machine_address
      items {
        id
        ipfs_metadata
        metadata
        s3_url
        status
      }
      mint_start_time
      price_gwei
      template_s3_url
      badge_metadata
    }
  }
`;

export const COLLECTIONS_BY_USER = gql`
  query CollectionsByUser($id: String!) {
    collections_by_user(id: $id) {
      name
      user_id
      id
      metadata
      status
      machine_address
      items {
        id
        ipfs_metadata
        metadata
        s3_url
        status
      }
      mint_start_time
      price_gwei
      template_s3_url
      badge_metadata
    }
  }
`;
