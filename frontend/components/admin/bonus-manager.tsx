"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Zap, Plus } from "lucide-react"
import type { LeaderboardEntry } from "@/types/leaderboard"

export function BonusManager() {
  const [participants, setParticipants] = useState<LeaderboardEntry[]>([])
  const [selectedParticipant, setSelectedParticipant] = useState("")
  const [bonusPoints, setBonusPoints] = useState("")
  const [energizerPoints, setEnergizerPoints] = useState("")

  // Mock data for demonstration
  useEffect(() => {
    const mockParticipants: LeaderboardEntry[] = [
      {
        id: 1,
        rank: 1,
        fullName: "Chheang Sovanpanha",
        hackerRankId: "chheang.sovanpanha@student.cadt.edu.kh",
        group: "G1",
        scores: [10, 30, 50, 10, 10, 30],
        totalPoints: 140,
        bonus: 5,
        energizer: 3,
      },
      {
        id: 2,
        rank: 2,
        fullName: "Sok Pisey",
        hackerRankId: "sok.pisey@student.cadt.edu.kh",
        group: "G2",
        scores: [10, 25, 45, 10, 8, 25],
        totalPoints: 123,
        bonus: 2,
        energizer: 1,
      },
    ]
    setParticipants(mockParticipants)
  }, [])

  const handleAddBonus = () => {
    if (!selectedParticipant || (!bonusPoints && !energizerPoints)) return

    setParticipants((prev) =>
      prev.map((p) => {
        if (p.id.toString() === selectedParticipant) {
          const newBonus = (p.bonus || 0) + (Number.parseInt(bonusPoints) || 0)
          const newEnergizer = (p.energizer || 0) + (Number.parseInt(energizerPoints) || 0)
          return {
            ...p,
            bonus: newBonus,
            energizer: newEnergizer,
            totalPoints: p.scores.reduce((sum, score) => sum + score, 0) + newBonus + newEnergizer,
          }
        }
        return p
      }),
    )

    setSelectedParticipant("")
    setBonusPoints("")
    setEnergizerPoints("")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Bonus & Energizer Points</CardTitle>
          <CardDescription>Award additional points to participants</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Select Participant</label>
              <Select value={selectedParticipant} onValueChange={setSelectedParticipant}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose participant" />
                </SelectTrigger>
                <SelectContent>
                  {participants.map((participant) => (
                    <SelectItem key={participant.id} value={participant.id.toString()}>
                      {participant.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Bonus Points</label>
              <Input
                type="number"
                placeholder="0"
                value={bonusPoints}
                onChange={(e) => setBonusPoints(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Energizer Points</label>
              <Input
                type="number"
                placeholder="0"
                value={energizerPoints}
                onChange={(e) => setEnergizerPoints(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddBonus} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Points
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Bonus & Energizer Points</CardTitle>
          <CardDescription>Overview of all awarded bonus and energizer points</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Participant</TableHead>
                  <TableHead>Group</TableHead>
                  <TableHead>Base Score</TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-500" />
                      Bonus
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      <Zap className="w-4 h-4 mr-1 text-purple-500" />
                      Energizer
                    </div>
                  </TableHead>
                  <TableHead>Total Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {participants.map((participant) => {
                  const baseScore = participant.scores.reduce((sum, score) => sum + score, 0)
                  return (
                    <TableRow key={participant.id}>
                      <TableCell className="font-medium">{participant.fullName}</TableCell>
                      <TableCell>{participant.group}</TableCell>
                      <TableCell>{baseScore}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          {participant.bonus || 0}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {participant.energizer || 0}
                        </span>
                      </TableCell>
                      <TableCell className="font-bold">{participant.totalPoints}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
