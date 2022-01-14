export interface NFTManifest {
  name: string;
  symbol: string;
  description: string;
  seller_fee_basis_points: number;
  image: string;
  animation_url: string;
  external_url: string;
  attributes: {
    trait_type: string;
    value: string;
  }[];
  collection: {
    name: string;
    family: string;
  };
  properties: {
    files: {
      uri: string;
      type: string;
      cdn?: boolean;
    }[];
    category: string;
    creators: {
      address: string;
      share: number;
    }[];
  };
}

export interface CollectionMetadata {
  totalNFTs: number;
  symbol: string;
  sellerFeeBasisPoints: number;
  creators: {
    address: string;
    verified: boolean;
    share: number;
  }[];
}
