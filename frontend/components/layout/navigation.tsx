"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"

const NAVIGATION_LINKS = {
  leaderboard: [
    { href: "/leaderboard/overall", label: "OVERALL LEADERBOARD" },
    { href: "/leaderboard/individual", label: "INDIVIDUAL LEADERBOARD" },
    { href: "/leaderboard/team", label: "TEAM LEADERBOARD" },
  ],
  rankings: [
    { href: "/rankings/top-10", label: "TOP 10" },
    { href: "/rankings/top-20", label: "TOP 20" },
  ],
} as const

// Custom Button Component with original styling
interface CustomButtonProps {
  to?: string
  label?: string
  bgColor?: string
  textColor?: string
}

const CustomButton = ({
  to = "rankings/top-20",
  label = "Sign Up",
  bgColor = "bg-orange-400",
  textColor = "text-white",
}: CustomButtonProps) => {
  return (
    <Link
      href={`/${to}`}
      className={`group relative flex items-center ${bgColor} ${textColor} transition-all duration-300 px-4 py-2 clip-angle overflow-hidden hover:bg-orange-500`}
    >
      <span className="transition-all duration-300 group-hover:pr-6">{label}</span>
      <span className="absolute right-3 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-in-out">
        <ChevronRight size={18} />
      </span>
    </Link>
  )
}

export function Navigation() {
  const pathname = usePathname()
  const [isDropdownOpen, setDropdownOpen] = useState(false)

  return (
    <nav className="bg-white shadow p-4 flex px-5 items-center">
      <Link href="/">
        <Image src="/CADTIDTLogo.png" width={200} height={100} alt="CADT IDT Logo" className="cursor-pointer" />
      </Link>

      <div className="flex space-x-4 ml-auto items-center font-bold relative">
        {/* LEADERBOARD DROPDOWN */}
        <div
          className="relative"
          onMouseEnter={() => setDropdownOpen(true)}
          onMouseLeave={() => setDropdownOpen(false)}
        >
          <div className="flex justify-between items-center cursor-pointer text-blue-950 hover:text-orange-400 transition-colors duration-300">
            <span>LEADERBOARD</span>
            <ChevronDown size={18} />
          </div>
          {isDropdownOpen && (
            <div className="absolute top-full bg-white border-t-4 border-blue-950 shadow-lg w-65 z-10 p-5">
              {NAVIGATION_LINKS.leaderboard.map(({ href, label }) => {
                const isActive = pathname === href
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`block px-4 py-2 text-xs transition-colors duration-200 ${
                      isActive ? "text-orange-400" : "text-blue-950 hover:bg-gray-100 hover:text-orange-400"
                    }`}
                  >
                    {label}
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* RANKINGS LINKS */}
        {NAVIGATION_LINKS.rankings.map(({ href, label }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`transition-colors duration-300 ${
                isActive ? "text-orange-400" : "text-blue-950 hover:text-orange-400"
              }`}
            >
              {label}
            </Link>
          )
        })}

        <CustomButton to="rankings/top-20" label="Sign Up" />
      </div>
    </nav>
  )
}
