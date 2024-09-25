import React, { useState } from "react";
import Layout from "@/components/Layout";
import {
  useTransferNFTMutation,
  useTransferTokenMutation,
} from "@/modules/mutation";
import {
  useGetUserTokensQuery,
  useGetUserNFTsQuery,
  useUserChainInfo,
} from "@/modules/query";
import { MediaRenderer } from "thirdweb/react";
import { client } from "@/utils/configs";
import { ChevronDown, CoinsIcon } from "lucide-react";
import { decimalOffChain, stringFormat, tryParseJSON } from "@/utils";

const TabButton: React.FC<{
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active, onClick, children }) => (
  <button
    className={`px-4 py-2 font-semibold ${
      active
        ? "text-blue-500 border-b-2 border-blue-500"
        : "text-gray-400 hover:text-white"
    }`}
    onClick={onClick}
  >
    {children}
  </button>
);

const Transfer: React.FC = () => {
  const [activeTab, setActiveTab] = useState("token");
  const [selectedAsset, setSelectedAsset] = useState("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  console.log({ selectedAsset });

  const { data: tokenData } = useGetUserTokensQuery();
  const { data: nftData } = useGetUserNFTsQuery();

  console.log({ tokenData });
  console.log({ nftData });

  const transferTokenMutation = useTransferTokenMutation();
  const transferNFTMutation = useTransferNFTMutation();

  console.log({ parsedJson: tryParseJSON(selectedAsset) });

  const handleTokenTransfer = async () => {
    const parsedJson = tryParseJSON(selectedAsset);

    const tokenAddress = parsedJson?.contractAddress;

    if (!tokenAddress || !amount || !recipient) return;
    await transferTokenMutation.mutateAsync({
      tokenAddress,
      amount,
      recipient,
    });
  };

  const handleNFTTransfer = async () => {
    const parsedJson = tryParseJSON(selectedAsset);

    const tokenAddress = parsedJson?.contractAddress;
    const tokenId = parsedJson?.nft?.tokenId;

    if (!tokenAddress || !tokenId || !recipient) return;
    await transferNFTMutation.mutateAsync({
      tokenAddress,
      tokenId,
      recipient,
    });
  };

  const handleTransfer = () => {
    if (activeTab === "token") {
      handleTokenTransfer();
    } else if (activeTab === "nft") {
      handleNFTTransfer();
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg">
        <div className="flex justify-center mb-6">
          <TabButton
            active={activeTab === "token"}
            onClick={() => setActiveTab("token")}
          >
            Transfer Token
          </TabButton>
          <TabButton
            active={activeTab === "nft"}
            onClick={() => setActiveTab("nft")}
          >
            Transfer NFT
          </TabButton>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Send to
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Enter public address (0x) or ENS name"
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Asset
            </label>
            <div className="relative">
              <label htmlFor="asset-select" className="sr-only">
                Select asset
              </label>
              {activeTab === "token" ? (
                <select
                  id="token-select"
                  title="Select token"
                  value={selectedAsset}
                  onChange={(e) => setSelectedAsset(e.target.value)}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Token</option>
                  {tokenData?.map((token, index) => (
                    <option
                      key={index}
                      value={JSON.stringify(token)}
                      title={token.tokenSymbol || "Unknown"}
                    >
                      {token.tokenSymbol || "Unknown"} - Balance:{" "}
                      {stringFormat(
                        decimalOffChain(token.balance, token.decimals)
                      )}
                    </option>
                  ))}
                </select>
              ) : (
                <select
                  id="nft-select"
                  title="Select NFT"
                  value={selectedAsset}
                  onChange={(e) => setSelectedAsset(e.target.value)}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select NFT</option>
                  {nftData?.map((nft, index) => (
                    <option key={index} value={JSON.stringify(nft)}>
                      <MediaRenderer
                        client={client}
                        src={nft.nft.metadata.image || nft.nft.tokenURI}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      {nft.nft.metadata.name}
                    </option>
                  ))}
                </select>
              )}
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {activeTab === "token" && (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Amount
              </label>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`0.00 ${
                  selectedAsset
                    ? tokenData?.find(
                        (t) => t.contractAddress === selectedAsset
                      )?.tokenSymbol || "Unknown"
                    : ""
                }`}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <button
            onClick={handleTransfer}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            {activeTab === "token" ? "Transfer Token" : "Transfer NFT"}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Transfer;
