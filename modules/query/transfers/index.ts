import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useUserChainInfo } from "../user";
import {
  NFTActivity,
  NFTActivityResponse,
  SingleNFTResponse,
} from "@/utils/types";
import axios from "axios";
import { CROSSFI_API } from "@/utils/configs";
import { getContractCustom, tryParseJSON } from "@/utils";
import { getNFT } from "thirdweb/extensions/erc721";
import { NFT } from "thirdweb";

export function useGetTokenTransfersQuery() {
  const { activeAccount } = useUserChainInfo();

  return useQuery({
    queryKey: ["userTransfers-tokens", activeAccount],
    queryFn: async () => {
      const response = await axios.get<Partial<NFTActivityResponse>>(
        `${CROSSFI_API}/token-transfers?address=${activeAccount?.address}&tokenType=CFC-20&page=1&limit=100&sort=-blockNumber`
      );

      const transfers = response.data.docs as Partial<NFTActivity>[];

      return transfers;
    },
    enabled: !!activeAccount,
    refetchInterval: 5000,
  });
}

export function useGetNFTsTransfersQuery() {
  const { activeAccount } = useUserChainInfo();

  return useQuery({
    queryKey: ["userTransfers-nfts", activeAccount],
    queryFn: async () => {
      const response = await axios.get<NFTActivityResponse>(
        `${CROSSFI_API}/token-transfers?address=${activeAccount?.address}&tokenType=CFC-721&page=1&limit=100&sort=-blockNumber`
      );

      const transfers = response.data.docs as NFTActivity[];

      const updatedTransfersWithNFTs = await Promise.all(
        transfers.map(async (transfer) => {
          let nft: SingleNFTResponse | NFT | null = null;
          const contract = getContractCustom({
            contractAddress: transfer.contractAddress,
          });

          nft = await getNFT({
            contract: contract,
            tokenId: BigInt(transfer.tokenId),
            includeOwner: true,
          });

          const uri = nft.tokenURI;
          const parsedMetadata =
            typeof uri === "string" ? tryParseJSON(uri) : uri;

          if (parsedMetadata && typeof parsedMetadata === "object") {
            nft = {
              ...nft,
              tokenURI: parsedMetadata.image,
              metadata: {
                ...parsedMetadata,
              },
            };
          }

          return { ...transfer, nft };
        })
      );

      return updatedTransfersWithNFTs;
    },
    enabled: !!activeAccount,
    refetchInterval: 5000,
  });
}
