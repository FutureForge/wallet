import { ethers } from "ethers";
import { formatDistanceToNow } from "date-fns";
import {
  getContract as getContractThirdweb,
  Hex,
  waitForReceipt,
} from "thirdweb";
import { chainInfo, client } from "./configs";

export const STAKING_CONTRACT_ADDRESS =
  "0x3b7eeb5FA1fCe83cCABcE2bbF921B931274912eb";

const providerUrl =
  "https://crossfi-testnet.g.alchemy.com/v2/LyMEMlI9ehqzPfajiDhvBXZ4MGjUQ6L-";

export const provider = new ethers.providers.JsonRpcProvider(providerUrl);

export function getContractEthers({
  contractAddress,
  abi,
}: {
  contractAddress: string;
  abi: any;
}) {
  const contract = new ethers.Contract(contractAddress, abi, provider);
  return contract;
}

export function formatBlockchainTimestamp(timestamp: string) {
  // Convert the timestamp to a Date object
  const date = new Date(parseInt(timestamp) * 1000);

  // Fix the error by specifying the correct types for the options object
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    // second: 'numeric',
    // timeZone: 'UTC',
  };

  // Format the date and time
  const formattedDate = date?.toLocaleString("en-US", options);

  return formattedDate;
}

export function getFormatAddress(address: string, width?: number): string {
  //   const xxl = 1800;
  //   if (address && address.length !== 42) {
  //     return "Invalid Ethereum Address";
  //   }
  //   if (width && width >= xxl) {
  //     return address;
  //   }
  const start = address?.slice(0, 4);
  const end = address?.slice(-4);
  return `${start}...${end}`;
}

export function ensureSerializable(data: any): any {
  if (data === null || data === undefined) return data;

  if (typeof data === "bigint") return data.toString();

  if (Array.isArray(data)) return data.map(ensureSerializable);
  if (typeof data === "object") {
    return Object.keys(data).reduce((result, key) => {
      result[key] = ensureSerializable(data[key]);
      return result;
    }, {} as Record<string, any>);
  }

  return data;
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

export const getActivityAge = (timestamp: string) => {
  return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
};
