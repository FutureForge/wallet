// export interface TokenData {
//   contractAddress: string;
//   blockNumberCreate: string;
//   creatorAddress: string;
//   decimals: number;
//   name: string;
//   timestamp: string;
//   tokenSymbol: string;
//   tokenType: string;
//   totalSupply: string;
//   txHashCreate: string;
//   holderCount: number;
//   transferCount: number;
// }

export interface TokenData {
  address: string;
  balance: string;
  blockNumber: number;
  contractAddress: string;
  decimals: number;
  timestamp: string;
  tokenIds: string[];
  tokenName: string;
  tokenSymbol: string;
  tokenType: string;
}

export interface TokenDataResponse {
  docs: TokenData[];
  hasNext: boolean;
  limit: number;
  page: number;
}

interface NFTData {
  address: string;
  balance: string;
  blockNumber: number;
  contractAddress: string;
  decimals: string | null;
  timestamp: string;
  tokenIds: string[];
  tokenName: string;
  tokenSymbol: string;
  tokenType: string;
}

export interface UserNFTResponse {
  docs: NFTData[];
  hasNext: boolean;
  limit: number;
  page: number;
}

export type SingleNFTResponse = {
  contractAddress: string;
  tokenId: string;
  blockNumber: number;
  creatorAddress: string;
  ownerAddress: string;
  timestamp: string;
  tokenName: string;
  tokenSymbol: string;
  tokenType: string;
  tokenURI: string;
  transferCount: number;
  metadata: NFTMetadata;
};

export type NFTMetadata = {
  image: string;
  external_url: string;
  description: string;
  name: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
  background_color: string;
  animation_url: string;
};

export type NFTActivity = {
  addressFrom: string;
  addressTo: string;
  blockNumber: number;
  contractAddress: string;
  decimals: number | null;
  timestamp: string;
  tokenId: string;
  tokenName: string;
  tokenSymbol: string;
  tokenType: string;
  txHash: string;
  uniqueHash: string;
};

export type NFTActivityResponse = {
  docs: NFTActivity[];
  hasNext: boolean;
  limit: number;
  page: number;
};
