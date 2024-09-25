import { getContractCustom } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserChainInfo } from "../query";
import { sendAndConfirmTransaction } from "thirdweb";
import { transfer } from "thirdweb/extensions/erc20";
import { transferFrom } from "thirdweb/extensions/erc721";

export function useTransferTokenMutation() {
  const { activeAccount } = useUserChainInfo();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      tokenAddress,
      amount,
      recipient,
    }: {
      tokenAddress: string;
      amount: string;
      recipient: string;
    }) => {
      if (!activeAccount) {
        throw new Error("No active account found");
      }

      const contract = getContractCustom({ contractAddress: tokenAddress });

      const transaction = transfer({ contract, amount, to: recipient });

      const transactionReceipt = await sendAndConfirmTransaction({
        account: activeAccount,
        transaction,
      });

      if (transactionReceipt.status === "reverted") {
        throw new Error("Transaction failed");
      }

      return transactionReceipt;
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["userTokens", activeAccount],
      });
    },
    onError: (error, variables, context) => {},
    meta: {
      successMessage: {
        description: "Token transferred successfully",
      },
      errorMessage: {
        description: "Failed to transfer token",
      },
    },
  });
}

export function useTransferNFTMutation() {
  const { activeAccount } = useUserChainInfo();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      tokenAddress,
      tokenId,
      recipient,
    }: {
      tokenAddress: string;
      tokenId: string;
      recipient: string;
    }) => {
      if (!activeAccount) {
        throw new Error("No active account found");
      }

      const contract = getContractCustom({ contractAddress: tokenAddress });

      const transaction = transferFrom({
        contract,
        from: activeAccount.address,
        to: recipient,
        tokenId: BigInt(tokenId),
      });

      const transactionReceipt = await sendAndConfirmTransaction({
        account: activeAccount,
        transaction,
      });

      if (transactionReceipt.status === "reverted") {
        throw new Error("Transaction failed");
      }

      return transactionReceipt;
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["userTokens", activeAccount],
      });
    },
    onError: (error, variables, context) => {},
    meta: {
      successMessage: {
        description: "NFT transferred successfully",
      },
      errorMessage: {
        description: "Failed to transfer nft",
      },
    },
  });
}

export function useMutationExample() {
  // call needed functions

  return useMutation({
    mutationFn: async () => {
      // your mutation logic here
    },
    onSuccess: (data, variables, context) => {
      // your success callback here
    },
    onError: (error, variables, context) => {
      // your error callback here
    },
    // other options like retry, etc.
  });
}
