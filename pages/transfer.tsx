import React, { useState, useEffect } from "react";
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
import { cn } from "@/modules/utils";
import { Select } from "@/modules/app/select";
import { isAddress } from "ethers/lib/utils";

const TabButton: React.FC<{
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active, onClick, children }) => (
  <button
    className={cn(
      "px-2 py-2 text-sm flex gap-1.5 text-muted-foreground font-medium duration-500 ease-in-out transition-colors border-b-2 border-transparent !rounded-none",

      {
        "text-foreground border-sec-btn": active,
        "hover:border-muted-foreground/50  hover:text-foreground": !active,
      }
    )}
    onClick={onClick}
  >
    {children}
  </button>
);

const Transfer: React.FC = () => {
  const { activeAccount } = useUserChainInfo();
  const [activeTab, setActiveTab] = useState("token");
  const [selectedAsset, setSelectedAsset] = useState("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const { data: tokenData, isLoading: isTokenDataLoading } =
    useGetUserTokensQuery();
  const { data: nftData } = useGetUserNFTsQuery();

  const transferTokenMutation = useTransferTokenMutation();
  const transferNFTMutation = useTransferNFTMutation();

  useEffect(() => {
    if (tokenData && tokenData.length > 0 && !selectedAsset) {
      setSelectedAsset(JSON.stringify(tokenData[0]));
    }
  }, [tokenData, selectedAsset]);

  useEffect(() => {
    if (recipient && !isAddress(recipient)) {
      setError("Invalid Ethereum Address");
    } else if (recipient === activeAccount?.address) {
      setError("You cannot send to yourself");
    } else {
      setError("");
    }
  }, [recipient]);

  const handleTokenTransfer = async () => {
    console.log('inside handle token transfer')
    const parsedJson = tryParseJSON(selectedAsset);

    const tokenAddress = parsedJson?.contractAddress;

    console.log({ tokenAddress, amount, recipient });

    if (!tokenAddress || !amount || !recipient) return;


    await transferTokenMutation.mutateAsync(
      {
        tokenAddress,
        amount,
        recipient,
      },
      {
        onSuccess: () => {
          setSelectedAsset("");
          setAmount("");
          setRecipient("");
        },
        onError: () => {
          setSelectedAsset("");
          setAmount("");
          setRecipient("");
        },
      }
    );
  };

  const isTxPending =
    transferTokenMutation.isPending || transferNFTMutation.isPending;

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
  const tabs = [
    {
      key: "token",
      label: "Transfer Token",
    },
    {
      key: "nft",
      label: " Transfer NFT",
    },
  ];
  return (
    <Layout>
      <div className="flex justify-center items-center h-full w-full">
        <div className="max-w-[400px] w-full p-6 relative bg-new-secondary border border-dialog-border rounded-[24px] flex flex-col">
          <div className="flex justify-center mb-6 gap-6">
            {tabs.map((tab) => (
              <TabButton
                key={tab.key}
                active={activeTab === tab.key}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </TabButton>
            ))}
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-muted-foreground mb-1"
              >
                Send to
              </label>
              <input
                type="text"
                id="address"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Enter public address (0x) or ENS name"
                className="w-full bg-transparent h-[45px] placeholder:text-muted-foreground text-sm text-white px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-sec-btn border border-dialog-border"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Asset
              </label>
              <div className="">
                <label htmlFor="asset-select" className="sr-only">
                  Select asset
                </label>
                <Select.Root
                  onValueChange={setSelectedAsset}
                  value={selectedAsset}
                >
                  <Select.Trigger placeholder="Select Asset" />

                  <Select.Content>
                    {activeTab === "token"
                      ? tokenData?.map((token:any, index:number) => (
                          <Select.Item
                            key={index}
                            value={JSON.stringify(token)}
                          >
                            {token.tokenSymbol || "Unknown"} - Balance:{" "}
                            {stringFormat(
                              decimalOffChain(token.balance, token.decimals)
                            )}
                          </Select.Item>
                        ))
                      : nftData?.map((nft:any, index:number) => (
                          <Select.Item key={index} value={JSON.stringify(nft)}>
                            <MediaRenderer
                              client={client}
                              src={nft.nft.metadata.image || nft.nft.tokenURI}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                            {nft.nft.metadata.name}
                          </Select.Item>
                        ))}
                  </Select.Content>
                </Select.Root>
              </div>
            </div>

            {activeTab === "token" && (
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Amount
                </label>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={`0.00 ${
                    selectedAsset
                      ? tokenData?.find(
                          (t:any) => t.contractAddress === selectedAsset
                        )?.tokenSymbol || "Unknown"
                      : ""
                  }`}
                  className="w-full bg-transparent border text-sm h-[45px] placeholder:text-muted-foreground border-dialog-border text-white px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-sec-btn"
                />
              </div>
            )}

            <button
              disabled={!amount || !selectedAsset || !recipient}
              onClick={handleTransfer}
              className={cn(
                "w-full bg-sec-btn hover:bg-sec-btn/80 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out",
                {
                  "pointer-events-none opacity-35":
                    !amount || !selectedAsset || !recipient,
                }
              )}
            >
              {activeTab === "token" ? "Transfer Token" : "Transfer NFT"}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Transfer;

// {
//   activeTab === "token" ? (
//     <select
//       id="token-select"
//       title="Select token"
//       value={selectedAsset}
//       onChange={(e) => setSelectedAsset(e.target.value)}
//       className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
//     >
//       <option value="">Select Token</option>
//       {tokenData?.map((token, index) => (
//         <option
//           key={index}
//           value={JSON.stringify(token)}
//           title={token.tokenSymbol || "Unknown"}
//         >
//           {token.tokenSymbol || "Unknown"} - Balance:{" "}
//           {stringFormat(
//             decimalOffChain(token.balance, token.decimals)
//           )}
//         </option>
//       ))}
//     </select>
//   ) : (
//     <select
//       id="nft-select"
//       title="Select NFT"
//       value={selectedAsset}
//       onChange={(e) => setSelectedAsset(e.target.value)}
//       className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
//     >
//       <option value="">Select NFT</option>
//       {nftData?.map((nft, index) => (
//         <option key={index} value={JSON.stringify(nft)}>
//           <MediaRenderer
//             client={client}
//             src={nft.nft.metadata.image || nft.nft.tokenURI}
//             className="w-full h-48 object-cover rounded-lg"
//           />
//           {nft.nft.metadata.name}
//         </option>
//       ))}
//     </select>
//   );
// }
// <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />;
