import { ethers } from "ethers";
import {
  getContract as getContractThirdweb,
  Hex,
  waitForReceipt,
} from "thirdweb";

import { chainInfo, client } from "./configs";

export function getFormatAddress(address: string, width?: number): string {
  const xxl = 1800;
  if (address && address.length !== 42) {
    return "Invalid Ethereum Address";
  }
  if (width && width >= xxl) {
    return address;
  }
  const start = address?.slice(0, 4);
  const end = address?.slice(-4);
  return `${start}...${end}`;
}

export function to3DP(value: number | string | undefined): string {
  return Number(value).toFixed(3);
}

export function stringFormat(value: string | number | undefined): string {
  if (value === undefined) return "0";

  const stringValue = typeof value === "number" ? value.toString() : value;
  const [wholePart, fractionalPart] = stringValue.split(".");

  if (!fractionalPart) return wholePart;

  const truncatedFractional = fractionalPart.slice(0, 3);
  return `${wholePart}.${truncatedFractional}`;
}

export const tryParseJSON = (jsonString: string) => {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    return null;
  }
};

export function decimalOffChain(
  number: bigint | string | number,
  decimals: number = 18
) {
  if (!number) return;
  //   const value = ethers.utils.formatEther(number);
  const value = ethers.utils.formatUnits(number, decimals);

  return value;
}

export function decimalOnChain(number: bigint | string | number) {
  if (!number) return;
  const value = ethers.utils.parseEther(number.toString());

  return value;
}

export async function waitForTransaction(txHash: string) {
  const receipt = await waitForReceipt({
    client,
    chain: chainInfo,
    transactionHash: txHash as Hex,
  });

  return receipt;
}

export function getContractCustom({
  contractAddress,
}: {
  contractAddress: string;
}) {
  const contract = getContractThirdweb({
    client,
    chain: chainInfo,
    address: contractAddress!,
  });

  return contract;
}
