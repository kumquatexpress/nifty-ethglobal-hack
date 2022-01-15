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
  ) {
    createCollection(
      name: $name
      maxCount: $maxCount
      symbol: $symbol
      royalty: $royalty
      templateImage: $templateImage
      price: $price
      mintDate: $mintDate
    ) {
      id
      metadata
      status
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
    }
  }
`;
