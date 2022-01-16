import { gql } from "@apollo/client";

export const GET_BADGES = gql`
  query GetBadges {
    getBadges
  }
`;

export const HAS_COLLECTION_TOKEN = gql`
  query HasCollectionToken($id: String!) {
    hasCollectionToken(collectionId: $id)
  }
`;

export const JOIN_LIVESTREAM = gql`
  query JoinLivestream($streamId: String!) {
    joinLivestream(streamId: $streamId)
  }
`;
