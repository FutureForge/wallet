import React, { useState } from "react";
import Sidebar, { Nav_Links } from "./Sidebar";
import Header from "./Header";
import { ScrollArea } from "@/modules/app/scroll-area/scroll-area";
import Head from "next/head";
import { useRouter } from "next/router";
import { Divide, Divide as Hamburger } from "hamburger-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/modules/utils";
import dynamic from "next/dynamic";

interface LayoutProps {
  children: React.ReactNode;
}

const Toast = dynamic(() => import("@/components/toast/toast"), {
  ssr: false,
});
const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false)

  const pathname = router.pathname;
  const headerName = pathname === "/" ? "Home" : pathname.replace("/", "");

  return (
    <>
      <Head>
        <title className="first-letter:uppercase">
          Mint Mingle CrossFi Wallet - {headerName}
        </title>
        <meta name="description" content="Manage Your Portfolio" />
      </Head>
      <div className="flex h-screen text-white font-inter overflow-hidden relative">
        <Sidebar />
        <MobileNav isOpen={isOpen} setIsOpen={setIsOpen} />
        <div className="flex flex-col flex-1 w-full justify-center lg:pr-3 px-3 lg:px-0">
          <main className="lg:bg-primary lg:border relative border-dialog-border p-6 h-[calc(100vh-20px)] rounded-lg flex flex-col w-full overflow-hidden">
            <div className="absolute lg:top-5 top-3 !z-40 right-5 bg-new-secondary lg:bg-transparent flex items-center justify-between lg:justify-end w-full">
              <div className="ml-10 lg:hidden">
                <Divide size={24} toggled={isOpen} toggle={setIsOpen} />
              </div>

              <div className="flex justify-end float-right">
                <Header />
              </div>
            </div>
            {isOpen && (
              <div className="w-full h-screen bg-black/60 absolute inset-0 z-30" />
            )}

            <ScrollArea.Root className="[&>div]:!block">
              {children}
            </ScrollArea.Root>
            <Toast/>
          </main>
        </div>
      </div>
    </>
  );
};

export default Layout;

type MobileNavProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};
function MobileNav({isOpen, setIsOpen}:MobileNavProps){
  const router = useRouter();
  return (
    <motion.aside
      initial={{ x: "100%" }}
      animate={{ x: isOpen ? 0 : "100%" }}
      exit={{ x: "100%" }}
      transition={{ type: "tween", duration: 0.5 }}
      className="absolute lg:hidden top-20 w-[80%] border-l border-t border-t-dialog-border border-l-dialog-border right-0 bg-new-secondary h-full z-40"
    >
      <div className="divide-y divide-dialog-border">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        </div>

        <nav className="p-4">
          <ul>
            {Nav_Links.map(({ label, icon, path }) => {
              const isActive = router.pathname === path;
              return (
                <li className="mb-4" key={label}>
                  <Link
                    href={path}
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-lg text-muted-foreground transition-colors duration-300 ease-in-out",
                      {
                        "bg-sec-btn/15 font-semibold text-sec-btn": isActive,
                        "hover:bg-sec-btn/15 hover:text-sec-btn": !isActive,
                      }
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {icon}
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </motion.aside>
  );
}