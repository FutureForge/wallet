import React from "react";
import { ConnectButton } from "thirdweb/react";
import { chainInfo, client } from "@/utils/configs";
import { createWallet } from "thirdweb/wallets";

const Header: React.FC = () => {
  return (
    <header className="bg-gray-900 text-white p-4 flex justify-between items-center">
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
              "bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300",
          }}
        />
        {/* <button className="bg-gray-800 p-2 rounded-full">
          <span className="material-icons">notifications</span>
        </button>
        <button className="bg-gray-800 p-2 rounded-full">
          <span className="material-icons">account_circle</span>
        </button> */}
      </div>
    </header>
  );
};

export default Header;
