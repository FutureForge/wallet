import React, { useState } from "react";
import Layout from "@/components/Layout";
import {
  useGetInterestAndLockPeriodsQuery,
  useGetStakingPosition,
  useUserBalanceQuery,
  useGetPlatformStatsQuery,
  useUserChainInfo,
} from "@/modules/query";
import { formatBlockchainTimestamp, to3DP } from "@/utils";
import { useStakeMutation, useUnstakeMutation } from "@/modules/mutation";
import { ConnectButton } from "thirdweb/react";
import { chainInfo, client } from "@/utils/configs";
import { createWallet } from "thirdweb/wallets";
import { TabButton } from ".";
import { ScrollArea } from "@/modules/app/scroll-area/scroll-area";
import { cn } from "@/modules/utils";

// const LockPeriod = [
//   { lockPeriod: 30, rate: 10, index: 0 },
//   { lockPeriod: 60, rate: 20, index: 1 },
//   { lockPeriod: 90, rate: 30, index: 2 },
//   { lockPeriod: 180, rate: 40, index: 3 },
//   { lockPeriod: 360, rate: 50, index: 4 },
// ];

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

  const isTxLoading = stakeMutation.isPending || unstakeMutation.isPending;

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
  const tabs = [
    {
      key: "stake",
      label: "Stake Token",
    },
    {
      key: "unstake",
      label: "Unstake Token",
    },
  ];
  if (!activeAccount) {
    return (
      <Layout>
        <div className="flex items-center justify-center w-full h-full">
          <div className="max-w-4xl mx-auto bg-new-secondary border border-dialog-border rounded-[24px] p-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Welcome to Mint Mingle XFI Staking
            </h2>
            <p className="text-gray-300 mb-6">
              Connect your wallet to start staking and earning rewards.
            </p>
            <div className="flex w-full items-center justify-center">
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
          </div>
        </div>
      </Layout>
    );
  }
  const Stats = [
    {
      label: "Total Staked Tokens",
      value: platformStats?.totalStakedTokens,
    },
    {
      label: "Total Active Stakers",
      value: platformStats?.totalActiveStakers,
    },
    {
      label: "Total Withdrawal Paid",
      value: platformStats?.totalRenewalPaid,
    },
  ];
  return (
    <Layout>
      <div className="flex justify-center items-center w-full h-full">
        <div className="max-w-[600px] w-full mx-auto mt-8 md:mt-0 bg-new-secondary border p-6 h-[90%] border-dialog-border rounded-[24px]">
          <ScrollArea.Root>
            {/* Platform Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-new-secondary border border-dialog-border p-4 mb-6 rounded-2xl">
              {Stats.map((stat) => {
                const { label, value } = stat;
                return (
                  <div className="flex flex-col gap-2 border bg-new-terciary border-dialog-border p-2 rounded-xl">
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="text-xl font-medium text-foreground">
                      {value} {label === "Total Staked Tokens" && "XFI"}
                    </p>
                  </div>
                );
              })}
              {/* Balance and Exchange Rate */}
              <div className="border bg-new-terciary border-dialog-border md:col-span-3 col-span-1 p-2 rounded-xl flex justify-between items-center">
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-muted-foreground">Your Balance</p>
                  <p className="text-xl font-medium text-foreground">
                    {to3DP(balance?.displayValue! || 0)} {balance?.symbol}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-muted-foreground">Exchange Rate</p>
                  <p className="text-xl font-medium text-foreground">
                    1 XFI = $0.7
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-t-dialog-border my-6 mt-8">
              <div className="flex justify-start my-6 gap-6">
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

              <div className="space-y-6">
                {activeTab === "stake" && (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="block text-sm font-medium text-muted-foreground">
                        Stake Amount
                      </label>
                      <input
                        type="text"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                        className="w-full bg-transparent h-[45px] placeholder:text-muted-foreground text-sm text-white px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-sec-btn border border-dialog-border"
                      />
                    </div>

                    {/* Lock Period Section */}
                    <div className="bg-new-secondary border border-dialog-border p-4 rounded-xl">
                      <h3 className="text-lg font-semibold text-white mb-3">
                        Lock Period
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        {LockPeriod &&
                          LockPeriod.map((period: any, index: number) => {
                            return (
                              <button
                                key={index}
                                onClick={() => setLockPeriodIndex(period.index)}
                                className={`py-2 px-3 rounded-xl transition-colors duration-200 flex justify-between items-center text-sm ${
                                  lockPeriodIndex === period.index
                                    ? "bg-sec-btn/50 border border-sec-btn text-white"
                                    : "bg-transparent border border-dialog-border text-muted-foreground hover:text-foreground transition-all duration-300 ease-in-out hover:bg-new-terciary"
                                }`}
                              >
                                <span>
                                  {period.lockPeriod}{" "}
                                  {period.lockPeriod !== 1 ? "days" : "day"}
                                </span>
                                <span className="font-bold">
                                  {period.rate}%
                                </span>
                              </button>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "unstake" && (
                  <div className="overflow-x-scrollmax-w-[600px]">
                    <ScrollArea.Root>
                      <table className="w-full text-left">
                        <thead>
                          <tr className="">
                            <th className="p-3 text-sm font-normal">
                              Amount Staked
                            </th>
                            <th className="p-3 text-sm font-normal">
                              Amount Earned
                            </th>
                            <th className="p-3 text-sm font-normal">
                              Unlock Date
                            </th>
                            <th className="p-3 text-sm font-normal">
                              Created Date
                            </th>
                            <th className="p-3 text-sm font-normal">
                              Interest
                            </th>
                            {/* <th className="p-3 text-sm font-normal">Status</th> */}
                            <th className="p-3 text-sm font-normal">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {userPosition &&
                            userPosition.map((position: any, index: number) => {
                              const currentTime = new Date().getTime();
                              const unlockTime = new Date(
                                position.unlockDate
                              ).getTime();
                              const isUnlocked = currentTime >= unlockTime;

                              return (
                                <tr
                                  key={index}
                                  className="border-b border-gray-700"
                                >
                                  <td className="p-3">
                                    {position.amountStaked}
                                  </td>
                                  <td className="p-3">
                                    {position.amountEarned}
                                  </td>
                                  <td className="p-3">{position.unlockDate}</td>
                                  <td className="p-3">
                                    {position.createdDate}
                                  </td>
                                  <td className="p-3">
                                    {position.percentInterest}%
                                  </td>
                                  {/* <td className="p-3">
                                    {position.open ? "Open" : "Closed"}
                                  </td> */}
                                  <td className="p-3 relative group">
                                    <button
                                      disabled={!isUnlocked || isTxLoading}
                                      onClick={() =>
                                        handleUnstake(position.positionId)
                                      }
                                      className={`px-3 py-1 rounded ${
                                        isUnlocked
                                          ? "bg-blue-500 hover:bg-blue-600 text-white"
                                          : "bg-gray-500 text-gray-300 cursor-not-allowed"
                                      }`}
                                    >
                                      Unstake
                                    </button>
                                    {!isUnlocked && (
                                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                                        Cannot unstake until{" "}
                                        {position.unlockDate}
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </ScrollArea.Root>
                  </div>
                )}

                {activeTab === "stake" && (
                  <button
                    disabled={!amount || !lockPeriodIndex || isTxLoading}
                    onClick={handleClick}
                    className={cn(
                      "w-full bg-sec-btn hover:bg-sec-btn/80 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out",
                      {
                        "pointer-events-none opacity-35":
                          !amount || !lockPeriodIndex || isTxLoading,
                      }
                    )}
                  >
                    Stake Token
                  </button>
                )}
              </div>
            </div>
          </ScrollArea.Root>
        </div>
      </div>
    </Layout>
  );
};

export default Stake;
