'use client'

import BodyRound from "@/components/BodyRound";
import HeaderRound from "@/components/HeaderRound";
import { useState } from "react";

export default function individualLeaderboard() {
  const [isLoading, setIsLoading] = useState(false)
  return (
    <main className="p-8">
      <h1 className="text-3xl text-center font-bold mb-10">Welcome to the Individual Leaderboard page</h1>
      <div className={`flex justify-center items-center ${isLoading ? "opacity-70" : ""}`}>
        <div className="bg-slate-800 rounded-md p-2 sm:p-5 overflow-x max-w-full sm:w-10/12">
          <HeaderRound/>
          <BodyRound/>
        </div>
      </div>
    </main>
  )
}
