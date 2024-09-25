import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { HomeIcon, FlipHorizontalIcon } from "lucide-react";

const Sidebar: React.FC = () => {
  const router = useRouter();

  const isActive = (path: string) => router.pathname === path;

  return (
    <aside className="w-64 bg-gray-900 text-white">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <nav>
          <ul>
            <li className="mb-4">
              <Link
                href="/"
                className={`flex items-center p-2 rounded-lg ${
                  isActive("/") ? "bg-blue-600" : "hover:bg-gray-700"
                }`}
              >
                <HomeIcon className="mr-2" />
                Home
              </Link>
            </li>
            <li className="mb-4">
              <Link
                href="/transfer"
                className={`flex items-center p-2 rounded-lg ${
                  isActive("/transfer") ? "bg-blue-600" : "hover:bg-gray-700"
                }`}
              >
                <FlipHorizontalIcon className="mr-2" />
                Transfer
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
