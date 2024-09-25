import React, { useState } from "react";
import Layout from "@/components/Layout";
import { MediaRenderer } from "thirdweb/react";
import { client } from "@/utils/configs";
import {
  useGetUserTokensQuery,
  useGetUserNFTsQuery,
  useGetTokenTransfersQuery,
  useGetNFTsTransfersQuery,
  useUserChainInfo,
} from "@/modules/query";
import { decimalOffChain, getFormatAddress, stringFormat } from "@/utils";
import {
  DollarSign,
  ImageIcon,
  ArrowUpDownIcon,
  ExternalLinkIcon,
  CoinsIcon,
} from "lucide-react";
import Link from "next/link";
import NFTModal from "@/components/NFTModal";
import { NFTActivity, SingleNFTResponse } from "@/utils/types";

const TabButton: React.FC<{
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active, onClick, children }) => (
  <button
    className={`px-4 py-2 font-semibold rounded-t-lg ${
      active
        ? "bg-gray-700 text-white"
        : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
    }`}
    onClick={onClick}
  >
    {children}
  </button>
);

export default function Home() {
  const [activeTab, setActiveTab] = useState("tokens");
  const [selectedNFT, setSelectedNFT] = useState(null);
  const { activeAccount } = useUserChainInfo();
  const owner = activeAccount?.address;

  const { data: tokenData } = useGetUserTokensQuery();
  const { data: nftData } = useGetUserNFTsQuery();
  const { data: tokenTransfers } = useGetTokenTransfersQuery();
  const { data: nftTransfers } = useGetNFTsTransfersQuery();

  const groupTransfersByDate = (transfers: Partial<NFTActivity>[]) => {
    return transfers.reduce((acc, transfer) => {
      if (transfer.timestamp) {
        const date = new Date(transfer.timestamp).toDateString();
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(transfer);
        return acc;
      }
      return acc;
    }, {} as Record<string, any>);
  };

  const groupedTokenTransfers = groupTransfersByDate(tokenTransfers || []);
  const groupedNFTTransfers = groupTransfersByDate(nftTransfers || []);

  return (
    <Layout>
      <div className="mb-6">
        <div className="flex space-x-2 mb-4">
          <TabButton
            active={activeTab === "tokens"}
            onClick={() => setActiveTab("tokens")}
          >
            <DollarSign className="mr-2" />
            Tokens
          </TabButton>
          <TabButton
            active={activeTab === "nfts"}
            onClick={() => setActiveTab("nfts")}
          >
            <ImageIcon className="mr-2" />
            NFTs
          </TabButton>
          <TabButton
            active={activeTab === "tokenTransfers"}
            onClick={() => setActiveTab("tokenTransfers")}
          >
            <ImageIcon className="mr-2" />
            <ArrowUpDownIcon className="mr-2" />
            Token Transfers
          </TabButton>
          <TabButton
            active={activeTab === "nftTransfers"}
            onClick={() => setActiveTab("nftTransfers")}
          >
            <ImageIcon className="mr-2" />
            <ArrowUpDownIcon className="mr-2" />
            NFT Transfers
          </TabButton>
        </div>
        <div className="bg-gray-700 p-6 rounded-lg">
          {activeTab === "tokens" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Tokens</h2>
              <table className="w-full">
                <thead>
                  <tr className="text-left">
                    <th className="pb-2">Token</th>
                    <th className="pb-2">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {tokenData &&
                    tokenData.map((token, index) => (
                      <tr key={index} className="border-t border-gray-600">
                        <td className="py-4 flex items-center">
                          <CoinsIcon className="w-4 h-4 mr-2" />
                          <div>
                            <div className="font-bold">
                              {token.tokenSymbol || "Unknown"}
                            </div>
                            <div className="text-sm text-gray-400">
                              {token.tokenName || "Unknown"}
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          {stringFormat(
                            decimalOffChain(token.balance, token.decimals)
                          )}{" "}
                          {token.tokenSymbol}
                          <div className="text-sm text-gray-400">
                            No $USD value
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
          {activeTab === "nfts" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">NFTs</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {nftData &&
                  nftData.map((nft, index) => (
                    <div
                      key={index}
                      className="cursor-pointer"
                      // @ts-ignore
                      onClick={() => setSelectedNFT(nft)}
                    >
                      <MediaRenderer
                        client={client}
                        src={nft.nft.metadata.image}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  ))}
              </div>
              {selectedNFT && (
                <NFTModal
                  nft={selectedNFT}
                  onClose={() => setSelectedNFT(null)}
                />
              )}
            </div>
          )}
          {activeTab === "tokenTransfers" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Token Transfers</h2>
              {Object.entries(groupedTokenTransfers).map(
                ([date, transfers]) => (
                  <div key={date} className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">{date}</h3>
                    <div className="space-y-4">
                      {transfers &&
                        // @ts-ignore
                        transfers.map((transfer, index) => (
                          <div
                            key={transfer.id || index}
                            className="bg-gray-800 p-4 rounded-lg flex items-center justify-between"
                          >
                            <div className="flex items-center space-x-4">
                              <div
                                className={`p-2 rounded-full ${
                                  transfer.type === "send"
                                    ? "bg-red-500"
                                    : "bg-green-500"
                                }`}
                              >
                                <ArrowUpDownIcon className="w-6 h-6" />
                              </div>
                              <div>
                                <p className="font-semibold">
                                  {transfer.type === "send"
                                    ? "Sent"
                                    : "Received"}{" "}
                                  {transfer.amount} {transfer.tokenSymbol}
                                </p>
                                <p className="text-sm text-gray-400">
                                  {transfer.type === "send" ? "To" : "From"}:{" "}
                                  {getFormatAddress(
                                    transfer.type === "send"
                                      ? transfer.addressTo
                                      : transfer.addressFrom
                                  )}
                                </p>
                              </div>
                            </div>
                            <Link
                              href={`https://test.xfiscan.com/tx/${transfer.txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLinkIcon className="w-5 h-5 text-blue-400 hover:text-blue-300" />
                            </Link>
                          </div>
                        ))}
                    </div>
                  </div>
                )
              )}
            </div>
          )}
          {activeTab === "nftTransfers" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">NFT Transfers</h2>
              {Object.entries(groupedNFTTransfers).map(([date, transfers]) => (
                <div key={date} className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">{date}</h3>
                  <div className="space-y-4">
                    {transfers &&
                      // @ts-ignore
                      transfers.map((transfer, index) => (
                        <div
                          key={index}
                          className="bg-gray-800 p-4 rounded-lg flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-4">
                            <MediaRenderer
                              client={client}
                              src={
                                transfer.nft?.metadata.image ||
                                transfer.nft?.tokenURI
                              }
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div>
                              <p className="font-semibold">
                                {transfer.type === "send" ? "Sent" : "Received"}{" "}
                                NFT
                              </p>
                              <p className="text-sm text-gray-400">
                                {transfer.type === "send" ? "To" : "From"}:{" "}
                                {getFormatAddress(
                                  transfer.type === "send"
                                    ? transfer.addressTo
                                    : transfer.addressFrom
                                )}
                              </p>
                            </div>
                          </div>
                          <Link
                            href={`https://test.xfiscan.com/tx/${transfer.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLinkIcon className="w-5 h-5 text-blue-400 hover:text-blue-300" />
                          </Link>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
