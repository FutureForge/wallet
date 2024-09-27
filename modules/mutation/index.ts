import {
  decimalOnChain,
  getContractCustom,
  getContractEthers,
  STAKING_CONTRACT_ADDRESS,
  waitForTransaction,
} from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserChainInfo } from "../query";
import { sendAndConfirmTransaction, toWei } from "thirdweb";
import { transfer } from "thirdweb/extensions/erc20";
import { transferFrom } from "thirdweb/extensions/erc721";
import StakingAbi from "@/utils/abi/staking.json";
import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum: any;
  }
}

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

      console.log({ tokenAddress, amount, recipient });
      console.log('inside transfer')

      if (
        tokenAddress.toLowerCase() ===
        "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE".toLowerCase()
      ) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();

          const amountInWei = ethers.utils.parseEther(amount);

          const tx = await signer.sendTransaction({
            to: recipient,
            value: amountInWei,
          });

          const receipt = await tx.wait();

          return receipt;
        } catch (error) {
          throw error;
        }
      } else {
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
      }
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

export function useStakeMutation() {
  const { activeAccount } = useUserChainInfo();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      lockPeriodIndex,
      value,
    }: {
      lockPeriodIndex: number;
      value: string;
    }) => {
      const StakingContract = getContractEthers({
        contractAddress: STAKING_CONTRACT_ADDRESS,
        abi: StakingAbi,
      });

      const stakeTxData = await StakingContract.populateTransaction.stakeEther(
        lockPeriodIndex,
        {
          value: decimalOnChain(value),
        }
      );

      // @ts-ignore
      const tx = await activeAccount.sendTransaction(stakeTxData);
      const receipt = await waitForTransaction(tx.transactionHash);

      if (receipt.status === "reverted") {
        throw new Error("Transaction failed");
      }

      return receipt;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userTokens", "balance", activeAccount],
      });
    },
    onError: () => {},
    meta: {
      successMessage: {
        description: "Stake successfully",
      },
      errorMessage: {
        description: "Failed to stake",
      },
    },
  });
}

export function useUnstakeMutation() {
  const { activeAccount } = useUserChainInfo();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ positionId }: { positionId: string }) => {
      const StakingContract = getContractEthers({
        contractAddress: STAKING_CONTRACT_ADDRESS,
        abi: StakingAbi,
      });

      const unstakeTxData = await StakingContract.populateTransaction.withdraw(
        positionId
      );

      // @ts-ignore
      const tx = await activeAccount.sendTransaction(unstakeTxData);
      const receipt = await waitForTransaction(tx.transactionHash);

      if (receipt.status === "reverted") {
        throw new Error("Transaction failed");
      }

      return receipt;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userTokens", "balance", activeAccount],
      });
    },
    onError: () => {},
    meta: {
      successMessage: {
        description: "Unstake successfully",
      },
      errorMessage: {
        description: "Failed to unstake",
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
