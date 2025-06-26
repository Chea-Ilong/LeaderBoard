'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname()
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <h1 className="text-xl font-semibold">Data CFCC</h1>
        <div className="flex gap-4">
          <Link
            href="/"
            className={`text-sm text-gray-500 hover:text-gray-900 transition-colors ${pathname === '/' ? "text-gray-900" : ""}`}
          >
            Upload Data
          </Link>
          <Link
            href="/update"
            className={`text-sm text-gray-500 hover:text-gray-900 transition-colors ${pathname === '/update' ? "text-gray-900" : ""}`}
          >
            Manage Data
          </Link>
        </div>
      </div>
    </nav>
  );
}
