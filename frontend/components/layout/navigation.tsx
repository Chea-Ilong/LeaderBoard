"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { ChevronDown, ChevronRight, Home, Trophy, Users, Settings } from "lucide-react"

const NAVIGATION_LINKS = {
  main: [
    { href: "/", label: "OVERALL LEADERBOARD", icon: Home },
    { href: "/leaderboard/round1", label: "INDIVIDUAL ROUND 1", icon: Trophy },
    { href: "/leaderboard/round2", label: "INDIVIDUAL ROUND 2", icon: Trophy },
    { href: "/leaderboard/team", label: "TEAM LEADERBOARD", icon: Users },
  ],
  rankings: [
    { href: "/rankings/top-10", label: "TOP 10" },
    { href: "/rankings/top-20", label: "TOP 20" },
  ],
  admin: [{ href: "/admin", label: "ADMIN PANEL", icon: Settings }],
} as const

// Custom Button Component with original styling
interface CustomButtonProps {
  to?: string
  label?: string
  bgColor?: string
  textColor?: string
}

const CustomButton = ({
  to = "admin",
  label = "Admin",
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
    <nav className="bg-white shadow-lg p-4 flex px-5 items-center border-b-2 border-orange-100">
      <Link href="/" className="flex items-center">
        <Image src="/CADTIDTLogo.png" width={200} height={100} alt="CADT IDT Logo" className="cursor-pointer" />
      </Link>

      <div className="flex space-x-6 ml-auto items-center font-bold relative">
        {/* MAIN NAVIGATION DROPDOWN */}
        <div
          className="relative"
          onMouseEnter={() => setDropdownOpen(true)}
          onMouseLeave={() => setDropdownOpen(false)}
        >
          <div className="flex justify-between items-center cursor-pointer text-blue-950 hover:text-orange-400 transition-colors duration-300">
            <Trophy className="w-5 h-5 mr-2" />
            <span>LEADERBOARDS</span>
            <ChevronDown size={18} className="ml-2" />
          </div>
          {isDropdownOpen && (
            <div className="absolute top-full left-0 bg-white border-t-4 border-blue-950 shadow-xl w-80 z-50 p-6 rounded-b-lg">
              <div className="space-y-3">
                {NAVIGATION_LINKS.main.map(({ href, label, icon: Icon }) => {
                  const isActive = pathname === href
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`flex items-center px-4 py-3 text-sm rounded-lg transition-all duration-200 ${
                        isActive
                          ? "text-white bg-orange-400 shadow-md"
                          : "text-blue-950 hover:bg-orange-50 hover:text-orange-400"
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-3" />
                      {label}
                    </Link>
                  )
                })}
              </div>
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
              className={`flex items-center px-3 py-2 rounded-lg transition-colors duration-300 ${
                isActive ? "text-orange-400 bg-orange-50" : "text-blue-950 hover:text-orange-400 hover:bg-orange-50"
              }`}
            >
              <Trophy className="w-4 h-4 mr-2" />
              {label}
            </Link>
          )
        })}

        <CustomButton to="admin" label="Admin Panel" />
      </div>
    </nav>
  )
}
