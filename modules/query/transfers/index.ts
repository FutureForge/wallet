import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useUserChainInfo } from "../user";
import { NFTActivity, NFTActivityResponse } from "@/utils/types";
import axios from "axios";
import { CROSSFI_API } from "@/utils/configs";

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

      return transfers;
    },
    enabled: !!activeAccount,
    refetchInterval: 5000,
  });
}
