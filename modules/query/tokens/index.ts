import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useUserChainInfo } from "../user";
import axios from "axios";
import { chainInfo, client, CROSSFI_API } from "@/utils/configs";
import {
  TokenDataResponse,
  TokenData,
  UserNFTResponse,
  SingleNFTResponse,
} from "@/utils/types";
import {
  decimalOffChain,
  ensureSerializable,
  formatBlockchainTimestamp,
  getContractCustom,
  getContractEthers,
  STAKING_CONTRACT_ADDRESS,
  tryParseJSON,
} from "@/utils";
import { getNFT } from "thirdweb/extensions/erc721";
import { useWalletBalance } from "thirdweb/react";
import StakingAbi from "@/utils/abi/staking.json";

export function useGetUserTokensQuery() {
  const { activeAccount } = useUserChainInfo();
  const { data: userBalance } = useUserBalanceQuery();

  return useQuery({
    queryKey: ["userTokens", activeAccount],
    queryFn: async () => {
      const response = await axios.get<TokenDataResponse>(
        `${CROSSFI_API}/token-holders?address=0x1FFE2134c82D07227715af2A12D1406165A305BF&tokenType=CFC-20&page=1&limit=1000&sort=-balance`
      );

      const tokenList = response.data.docs as TokenData[];

      const nativeToken = {
        address: activeAccount?.address!,
        balance: userBalance?.value!,
        blockNumber: 0,
        contractAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        decimals: 18,
        name: "XFI",
        symbol: "XFI",
        timestamp: new Date().toISOString(),
        tokenIds: [],
        tokenName: "XFI",
        tokenSymbol: "XFI",
        tokenType: "CFC-20",
        usdValue: 0.7,
      };

      tokenList.unshift(nativeToken);

      return tokenList;
    },
    enabled: !!activeAccount && !!userBalance,
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
        `${CROSSFI_API}/token-holders?address=0x1FFE2134c82D07227715af2A12D1406165A305BF&tokenType=CFC-721&page=1&limit=1000&sort=-balance`
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

export function useUserBalanceQuery() {
  const { activeAccount } = useUserChainInfo();

  const { data: xfiBalance, isLoading: xfiBalanceLoading } = useWalletBalance({
    chain: chainInfo,
    address: activeAccount?.address,
    client,
  });

  return useQuery({
    queryKey: ["balance"],
    queryFn: async () => {
      return ensureSerializable(xfiBalance);
    },
    enabled: !!activeAccount?.address,
    refetchInterval: 5000,
  });
}

export function useGetInterestAndLockPeriodsQuery() {
  return useQuery({
    queryKey: ["interestAndLockPeriods"],
    queryFn: async () => {
      const StakingContract = getContractEthers({
        contractAddress: STAKING_CONTRACT_ADDRESS,
        abi: StakingAbi,
      });

      const lockPeriods = await StakingContract.getLockPeriods();
      const lockPeriodsArray = lockPeriods.map((period: BigInt) => {
        const days = Number(period) / 86400;
        return `${days} day${days !== 1 ? "s" : ""}`;
      });
      const interestRates = await StakingContract.getInterestRate();
      const interestRatesArray = interestRates.map((rate: BigInt) =>
        rate.toString()
      );

      // @ts-ignore
      const LockPeriod = lockPeriodsArray.map((period, index) => ({
        lockPeriod: parseInt(period.split(" ")[0]),
        rate: parseFloat(interestRates[index]),
        index: index,
      }));

      return LockPeriod;
    },
    enabled: true,
    refetchInterval: 5000,
  });
}

export function useGetStakingPosition() {
  const { activeAccount } = useUserChainInfo();

  return useQuery({
    queryKey: ["stakingContract", activeAccount],
    queryFn: async () => {
      const StakingContract = getContractEthers({
        contractAddress: STAKING_CONTRACT_ADDRESS,
        abi: StakingAbi,
      });

      const userPosition = await StakingContract.getPositionIdsForAddress(
        activeAccount?.address
      );

      const userPositionDetails = await Promise.all(
        userPosition.map(async (position: BigInt) => {
          const positionDetails = await StakingContract.getPositionById(
            position
          );

          const updatedPositionDetails = {
            positionId: positionDetails[0].toString(),
            walletAddress: positionDetails[1],
            createdDate: formatBlockchainTimestamp(
              positionDetails[2].toString()
            ),
            unlockDate: formatBlockchainTimestamp(
              positionDetails[3].toString()
            ),
            percentInterest: positionDetails[4].toString(),
            amountStaked: decimalOffChain(positionDetails[5].toString()),
            amountEarned: decimalOffChain(positionDetails[6].toString()),
            open: positionDetails[7].toString(),
          };

          return updatedPositionDetails;
        })
      );

      return userPositionDetails;
    },
    enabled: !!activeAccount,
    refetchInterval: 5000,
  });
}

export function useGetPlatformStatsQuery() {
  return useQuery({
    queryKey: ["platformStats"],
    queryFn: async () => {
      const StakingContract = getContractEthers({
        contractAddress: STAKING_CONTRACT_ADDRESS,
        abi: StakingAbi,
      });

      const totalStakedTokens = await StakingContract.totalStakedTokens();
      const totalActiveStakers = await StakingContract.totalActiveStakers();
      const totalRenewalPaid = await StakingContract.totalRenewalPaid();

      return {
        totalStakedTokens: decimalOffChain(totalStakedTokens.toString()),
        totalActiveStakers: totalActiveStakers.toString(),
        totalRenewalPaid: decimalOffChain(totalRenewalPaid.toString()),
      };
    },
  });
}
