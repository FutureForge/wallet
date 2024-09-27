import React, { useState } from "react";
import Layout from "@/components/Layout";
import {
  useGetInterestAndLockPeriodsQuery,
  useGetStakingPosition,
  useUserBalanceQuery,
  useGetPlatformStatsQuery,
  useUserChainInfo,
} from "@/modules/query";
import { to3DP } from "@/utils";
import { useStakeMutation, useUnstakeMutation } from "@/modules/mutation";
import { ConnectButton } from "thirdweb/react";
import { chainInfo, client } from "@/utils/configs";
import { createWallet } from "thirdweb/wallets";

// const LockPeriod = [
//   { lockPeriod: 30, rate: 10, index: 0 },
//   { lockPeriod: 60, rate: 20, index: 1 },
//   { lockPeriod: 90, rate: 30, index: 2 },
//   { lockPeriod: 180, rate: 40, index: 3 },
//   { lockPeriod: 360, rate: 50, index: 4 },
// ];

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

const Stake: React.FC = () => {
  const { activeAccount } = useUserChainInfo();
  const { data: balance } = useUserBalanceQuery();
  const { data: userPosition } = useGetStakingPosition();
  const { data: LockPeriod } = useGetInterestAndLockPeriodsQuery();
  const { data: platformStats } = useGetPlatformStatsQuery();

  const stakeMutation = useStakeMutation();
  const unstakeMutation = useUnstakeMutation();

  const [activeTab, setActiveTab] = useState("stake");
  const [amount, setAmount] = useState("");
  const [lockPeriodIndex, setLockPeriodIndex] = useState(0);

  const handleStake = () => {
    if (!amount) return;

    stakeMutation.mutate({
      lockPeriodIndex: 0,
      value: amount,
    });
  };

  const handleUnstake = (positionId: string) => {
    unstakeMutation.mutate({
      positionId,
    });
  };

  const handleClick = () => {
    if (activeTab === "stake") {
      handleStake();
    }
    // if (activeTab === "unstake") {
    //   if (!positionId) return;
    //   handleUnstake(positionId);
    // }
  };

  if (!activeAccount) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Welcome to Mint Mingle XFI Staking
          </h2>
          <p className="text-gray-300 mb-6">
            Connect your wallet to start staking and earning rewards.
          </p>
          <ConnectButton
            client={client}
            chain={chainInfo}
            wallets={[createWallet("io.metamask")]}
            connectButton={{
              label: "Connect Wallet",
              className:
                "!font-inter !rounded-xl lg:!w-36 !border !border-dialog-border !w-[75%] max-sm:!w-full !flex !items-center !justify-center hover:!bg-primary/65 hover:!text-foreground !duration-300 !ease-in-out !transition !bg-sec-bg !text-muted-foreground !h-10",
            }}
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg">
        <div className="flex justify-center mb-6">
          <TabButton
            active={activeTab === "stake"}
            onClick={() => setActiveTab("stake")}
          >
            Stake Token
          </TabButton>
          <TabButton
            active={activeTab === "unstake"}
            onClick={() => setActiveTab("unstake")}
          >
            Unstake Token
          </TabButton>
        </div>

        {/* Balance and Exchange Rate */}
        <div className="bg-gray-700 p-4 rounded-lg mb-6 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-400">Your Balance</p>
            <p className="text-xl font-bold text-white">
              {to3DP(balance?.displayValue! || 0)} {balance?.symbol}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Exchange Rate</p>
            <p className="text-xl font-bold text-white">1 XFI = $0.7</p>
          </div>
        </div>

        <div className="space-y-4">
          {activeTab === "stake" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Stake Amount
                </label>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Lock Period Section */}
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Lock Period
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {LockPeriod &&
                    LockPeriod.map((period: any, index: number) => (
                      <button
                        key={index}
                        onClick={() => setLockPeriodIndex(period.index)}
                        className={`p-3 rounded-lg transition-colors duration-200 flex justify-between items-center ${
                          lockPeriodIndex === period.index
                            ? "bg-blue-600 text-white"
                            : "bg-gray-600 text-gray-300 hover:bg-gray-500"
                        }`}
                      >
                        <span>{period.lockPeriod} days</span>
                        <span className="font-bold">{period.rate}%</span>
                      </button>
                    ))}
                </div>
              </div>
            </>
          )}

          {activeTab === "unstake" && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="p-3">Amount Staked</th>
                    <th className="p-3">Amount Earned</th>
                    <th className="p-3">Unlock Date</th>
                    <th className="p-3">Created Date</th>
                    <th className="p-3">Interest</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {userPosition &&
                    userPosition.map((position: any, index: number) => (
                      <tr key={index} className="border-b border-gray-700">
                        <td className="p-3">{position.amountStaked}</td>
                        <td className="p-3">{position.amountEarned}</td>
                        <td className="p-3">{position.unlockDate}</td>
                        <td className="p-3">{position.createdDate}</td>
                        <td className="p-3">{position.percentInterest}%</td>
                        <td className="p-3">
                          {position.open ? "Open" : "Closed"}
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => handleUnstake(position.positionId)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                          >
                            Unstake
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "stake" && (
            <button
              onClick={handleClick}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
            >
              Stake Token
            </button>
          )}
        </div>
      </div>

      {/* Platform Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-700 p-4 rounded-lg">
          <p className="text-sm text-gray-400">Total Staked Tokens</p>
          <p className="text-2xl font-bold text-white">
            {platformStats?.totalStakedTokens}
          </p>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <p className="text-sm text-gray-400">Total Active Stakers</p>
          <p className="text-2xl font-bold text-white">
            {platformStats?.totalActiveStakers}
          </p>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <p className="text-sm text-gray-400">Total Withdrawal Paid</p>
          <p className="text-2xl font-bold text-white">
            {platformStats?.totalRenewalPaid}
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Stake;
