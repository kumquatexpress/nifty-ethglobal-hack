import { gql } from "@apollo/client";

export const GET_BADGES = gql`
  query GetBadges {
    getBadges
  }
`;
