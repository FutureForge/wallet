import React, { useState } from "react";
import Layout from "@/components/Layout";
import {
  useTransferNFTMutation,
  useTransferTokenMutation,
} from "@/modules/mutation";

const Transfer: React.FC = () => {
  const [tokenAddress, setTokenAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [tokenId, setTokenId] = useState("");

  const transferTokenMutation = useTransferTokenMutation();
  const transferNFTMutation = useTransferNFTMutation();

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
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Transfer</h1>
        <div className="bg-gray-700 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Transfer Token</h2>
          <input
            type="text"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
            placeholder="Token Address"
            className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg mb-4"
          />
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg mb-4"
          />
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Recipient"
            className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg mb-4"
          />
          <button
            onClick={handleTokenTransfer}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            Transfer Token
          </button>
        </div>
        <div className="bg-gray-700 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Transfer NFT</h2>
          <input
            type="text"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
            placeholder="NFT Address"
            className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg mb-4"
          />
          <input
            type="text"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
            placeholder="Token ID"
            className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg mb-4"
          />
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Recipient"
            className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg mb-4"
          />
          <button
            onClick={handleNFTTransfer}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            Transfer NFT
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Transfer;
