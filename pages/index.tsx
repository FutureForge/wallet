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
import {
  useTransferNFTMutation,
  useTransferTokenMutation,
} from "@/modules/mutation";
import { useState } from "react";

export default function Home() {
  const { data: tokenData } = useGetUserTokensQuery();
  console.log({ tokenData });

  const { data: nftData } = useGetUserNFTsQuery();
  console.log({ nftData });

  const { data: tokenTransfers } = useGetTokenTransfersQuery();
  console.log({ tokenTransfers });

  const { data: nftTransfers } = useGetNFTsTransfersQuery();
  console.log({ nftTransfers });

  const transferTokenMutation = useTransferTokenMutation();
  const transferNFTMutation = useTransferNFTMutation();

  const [tokenAddress, setTokenAddress] = useState(
    "0x1a35a38630b6f56637268f437493601dbf72e61a"
  );
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState(
    "0xB02CE519342f2b50a8bc49bdD3b85A5312A86463"
  );
  const [tokenId, setTokenId] = useState("3");

  const handleTokenTransfer = async () => {
    if (!tokenAddress || !amount || !recipient) return;

    await transferTokenMutation.mutateAsync({
      tokenAddress,
      amount,
      recipient,
    });
  };

  const handleNFTTransfer = async () => {
    if (!tokenAddress || !tokenId || !recipient) return;

    await transferNFTMutation.mutateAsync({
      tokenAddress,
      tokenId,
      recipient,
    });
  };

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
      <br />
      <br />

      <input
        type="text"
        value={tokenAddress}
        onChange={(e) => setTokenAddress(e.target.value)}
        placeholder="Token Address"
        className="text-black w-80"
      />
      <br />
      <br />

      <input
        type="text"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        className="text-black w-80"
      />
      <br />
      <br />

      <input
        type="text"
        value={tokenId}
        onChange={(e) => setTokenId(e.target.value)}
        placeholder="TokenId"
        className="text-black w-80"
      />
      <br />
      <br />

      <input
        type="text"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        placeholder="Recipient"
        className="text-black w-80"
      />
      <br />
      <br />

      <button onClick={handleTokenTransfer}>Transfer Token</button>
      <button onClick={handleNFTTransfer}>Transfer NFT</button>

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

// token address: 0x63019ee1b42737e262145f767946cc2a78462532
// wallet address: 0xB02CE519342f2b50a8bc49bdD3b85A5312A86463

// nft address: 0x6af8860ba9eed41c3a3c69249da5ef8ac36d20de
// tokenId 5
