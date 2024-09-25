import localFont from "next/font/local";
import { ConnectButton, MediaRenderer } from "thirdweb/react";
import { chainInfo, client } from "@/utils/configs";
import { createWallet } from "thirdweb/wallets";
import {
  useGetUserTokensQuery,
  useGetUserNFTsQuery,
  useGetTokenTransfersQuery,
  useGetNFTsTransfersQuery,
} from "@/modules/query";
import { decimalOffChain, stringFormat } from "@/utils";

export default function Home() {
  const { data: tokenData } = useGetUserTokensQuery();
  console.log({ tokenData });

  const { data: nftData } = useGetUserNFTsQuery();
  console.log({ nftData });

  const { data: tokenTransfers } = useGetTokenTransfersQuery();
  console.log({ tokenTransfers });

  const { data: nftTransfers } = useGetNFTsTransfersQuery();
  console.log({ nftTransfers });

  return (
    <>
      <ConnectButton
        client={client}
        chain={chainInfo}
        wallets={[createWallet("io.metamask")]}
        connectButton={{
          label: "Connect Wallet",
          className:
            "!font-inter !rounded-xl lg:!w-36 !w-[75%] max-sm:!w-full !flex !items-center !justify-center hover:!bg-primary/65 hover:!text-foreground !duration-300 !ease-in-out !transition !bg-primary !text-muted-foreground !h-10",
        }}
      />

      <div>
        <h1>Tokens</h1>
        {tokenData &&
          tokenData.map((token, index: number) => (
            <div key={index}>
              <p>{token.contractAddress}</p>
              <p>
                {stringFormat(decimalOffChain(token.balance, token.decimals))}{" "}
                {token.tokenSymbol || "Unknown"}
              </p>
              <hr />
            </div>
          ))}
      </div>

      <div>
        <h1>NFTs</h1>
        {nftData &&
          nftData.map((nft, index) => (
            <div key={index}>
              <MediaRenderer client={client} src={nft.nft.metadata.image} />
              <h4>Description: {nft.nft.metadata.description}</h4>
              <h4>
                Attributes:{" "}
                {nft.nft.metadata.attributes?.map((attribute: any) => (
                  <p key={attribute.trait_type}>
                    {attribute.trait_type}: {attribute.value}
                  </p>
                ))}
              </h4>
              <hr />
            </div>
          ))}
      </div>
    </>
  );
}
