import React from "react";
import { ConnectButton } from "thirdweb/react";
import { chainInfo, client } from "@/utils/configs";
import { createWallet } from "thirdweb/wallets";

const Header: React.FC = () => {
  return (
    <header className="text-white flex justify-between items-center">
      <div className="flex items-center">
        {/* <input
          type="text"
          placeholder="Search for a token..."
          className="bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        /> */}
      </div>
      <div className="flex items-center space-x-4">
        <ConnectButton
          client={client}
          chain={chainInfo}
          wallets={[createWallet("io.metamask")]}
          connectButton={{
            label: "Connect Wallet",
            className:
              "!font-inter !rounded-xl lg:!w-36 !w-[75%] max-sm:!w-full !flex !items-center !justify-center hover:!bg-primary/65 hover:!text-foreground !duration-300 !ease-in-out !transition !bg-sec-bg !text-muted-foreground !h-10",
          }}
        />
      </div>
    </header>
  );
};

export default Header;
