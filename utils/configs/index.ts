import { createThirdwebClient, getRpcClient } from "thirdweb";
import { defineChain, sepolia } from "thirdweb/chains";

export const CROSSFI_API = "https://test.xfiscan.com/api/1.0";

export const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

export const chainInfo = defineChain({
  id: 4157,
  rpc: "https://crossfi-testnet.g.alchemy.com/v2/LyMEMlI9ehqzPfajiDhvBXZ4MGjUQ6L-",
  nativeCurrency: {
    decimals: 18,
    name: "XFI",
    symbol: "XFI",
  },
  testnet: true,
  blockExplorers: [
    { name: "Testnet Explorer", url: "https://test.xfiscan.com/" },
  ],
});

export const rpcRequest = getRpcClient({ client, chain: chainInfo });
