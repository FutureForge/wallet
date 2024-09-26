import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { ScrollArea } from "@/modules/utils/scroll-area/scroll-area";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen text-white font-inter overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 w-full justify-center pr-3">
        <main className="bg-primary border border-dialog-border p-6 h-[calc(100vh-20px)] relative rounded-lg flex flex-col w-full overflow-hidden">
          <ScrollArea.Root>{children}</ScrollArea.Root>
        </main>
      </div>
    </div>
  );
};

export default Layout;
