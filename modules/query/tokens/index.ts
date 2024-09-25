import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useUserChainInfo } from "../user";
import axios from "axios";
import { CROSSFI_API } from "@/utils/configs";
import {
  TokenDataResponse,
  TokenData,
  UserNFTResponse,
  SingleNFTResponse,
} from "@/utils/types";
import { getContractCustom, tryParseJSON } from "@/utils";
import { getNFT } from "thirdweb/extensions/erc721";

export function useGetUserTokensQuery() {
  const { activeAccount } = useUserChainInfo();

  return useQuery({
    queryKey: ["userTokens", activeAccount],
    queryFn: async () => {
      const response = await axios.get<TokenDataResponse>(
        `${CROSSFI_API}/token-holders?address=${activeAccount?.address}&tokenType=CFC-20&page=1&limit=1000&sort=-balance`
      );

      const tokenList = response.data.docs as TokenData[];
      return tokenList;
    },
    enabled: !!activeAccount,
    refetchInterval: 5000,
  });
}

export function useGetUserNFTsQuery() {
  const { activeAccount } = useUserChainInfo();
  const userAddress = activeAccount?.address;

  return useQuery({
    queryKey: ["userNFTs", activeAccount],
    queryFn: async () => {
      const response = await axios.get<UserNFTResponse>(
        `${CROSSFI_API}/token-holders?address=${userAddress}&tokenType=CFC-721&page=1&limit=1000&sort=-balance`
      );

      const userNFTs = response.data.docs;

      const updatedNFTs = await Promise.all(
        userNFTs.map(async (nfts) => {
          const { tokenIds, contractAddress } = nfts;

          const uniqueTokenIds = Array.from(new Set(tokenIds));

          const tokenIdNFTs = await Promise.all(
            uniqueTokenIds.map(async (ids) => {
              const response = await axios.get<SingleNFTResponse>(
                `${CROSSFI_API}/token-inventory/${contractAddress}/${ids}`
              );
              const nft = response.data;

              let updatedNFT = nft;

              const uri = nft.tokenURI;
              const parsedMetadata =
                typeof uri === "string" ? tryParseJSON(uri) : uri;

              if (parsedMetadata && typeof parsedMetadata === "object") {
                updatedNFT = {
                  ...nft,
                  tokenURI: parsedMetadata.image,
                  metadata: {
                    ...parsedMetadata,
                  },
                };
              }

              const metadata = updatedNFT?.metadata;
              if (metadata === undefined) {
                const contract = getContractCustom({
                  contractAddress: updatedNFT?.contractAddress,
                });
                const tokenId = updatedNFT?.tokenId;

                const newUpdatedNFTs = await getNFT({
                  contract: contract,
                  tokenId: BigInt(tokenId),
                  includeOwner: true,
                });

                return { ...nfts, nft: newUpdatedNFTs };
              } else {
                return { ...nfts, nft: updatedNFT };
              }
            })
          );

          return tokenIdNFTs;
        })
      );

      const flatNFTs = updatedNFTs.flat();

      return flatNFTs;
    },
    enabled: !!userAddress && !!activeAccount,
    refetchInterval: 5000,
  });
}
