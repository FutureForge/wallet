import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { ScrollArea } from "@/modules/app/scroll-area/scroll-area";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen text-white font-inter overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 w-full justify-center pr-3">
        <main className="bg-primary border relative border-dialog-border p-6 h-[calc(100vh-20px)] rounded-lg flex flex-col w-full overflow-hidden">
          <div className="flex justify-end float-right absolute top-5 right-5 z-50">
            <Header />
          </div>
          <ScrollArea.Root className="[&>div]:!block">
            {children}
          </ScrollArea.Root>
        </main>
      </div>
    </div>
  );
};

export default Layout;
