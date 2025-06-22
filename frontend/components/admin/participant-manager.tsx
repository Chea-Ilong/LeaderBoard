"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Search } from "lucide-react"
import type { LeaderboardEntry } from "@/types/leaderboard"

export function ParticipantManager() {
  const [participants, setParticipants] = useState<LeaderboardEntry[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [editingParticipant, setEditingParticipant] = useState<LeaderboardEntry | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

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

  const filteredParticipants = participants.filter(
    (p) =>
      p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.hackerRankId.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSave = (participant: LeaderboardEntry) => {
    if (editingParticipant) {
      setParticipants((prev) => prev.map((p) => (p.id === participant.id ? participant : p)))
    } else {
      setParticipants((prev) => [...prev, { ...participant, id: Date.now() }])
    }
    setIsDialogOpen(false)
    setEditingParticipant(null)
  }

  const handleDelete = (id: number) => {
    setParticipants((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Participant Management</CardTitle>
        <CardDescription>Add, edit, and manage competition participants</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search participants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingParticipant(null)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Participant
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingParticipant ? "Edit Participant" : "Add New Participant"}</DialogTitle>
                <DialogDescription>
                  {editingParticipant ? "Update participant information" : "Enter participant details"}
                </DialogDescription>
              </DialogHeader>
              <ParticipantForm participant={editingParticipant} onSave={handleSave} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Group</TableHead>
                <TableHead>Total Points</TableHead>
                <TableHead>Bonus</TableHead>
                <TableHead>Energizer</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredParticipants.map((participant) => (
                <TableRow key={participant.id}>
                  <TableCell className="font-medium">{participant.fullName}</TableCell>
                  <TableCell>{participant.hackerRankId}</TableCell>
                  <TableCell>{participant.group}</TableCell>
                  <TableCell>{participant.totalPoints}</TableCell>
                  <TableCell>{participant.bonus || 0}</TableCell>
                  <TableCell>{participant.energizer || 0}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingParticipant(participant)
                          setIsDialogOpen(true)
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(participant.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

interface ParticipantFormProps {
  participant: LeaderboardEntry | null
  onSave: (participant: LeaderboardEntry) => void
}

function ParticipantForm({ participant, onSave }: ParticipantFormProps) {
  const [formData, setFormData] = useState<Partial<LeaderboardEntry>>({
    fullName: "",
    hackerRankId: "",
    group: "G1",
    scores: [0, 0, 0, 0, 0, 0],
    bonus: 0,
    energizer: 0,
    ...participant,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const totalPoints =
      (formData.scores || []).reduce((sum, score) => sum + score, 0) + (formData.bonus || 0) + (formData.energizer || 0)
    onSave({
      ...formData,
      totalPoints,
      rank: 0, // Will be calculated
    } as LeaderboardEntry)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Full Name</label>
          <Input
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium">Email</label>
          <Input
            value={formData.hackerRankId}
            onChange={(e) => setFormData({ ...formData, hackerRankId: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Group</label>
        <Select value={formData.group} onValueChange={(value) => setFormData({ ...formData, group: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="G1">Group G1</SelectItem>
            <SelectItem value="G2">Group G2</SelectItem>
            <SelectItem value="G3">Group G3</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium">Question Scores</label>
        <div className="grid grid-cols-6 gap-2 mt-1">
          {(formData.scores || []).map((score, index) => (
            <Input
              key={index}
              type="number"
              placeholder={`Q${index + 1}`}
              value={score}
              onChange={(e) => {
                const newScores = [...(formData.scores || [])]
                newScores[index] = Number.parseInt(e.target.value) || 0
                setFormData({ ...formData, scores: newScores })
              }}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Bonus Points</label>
          <Input
            type="number"
            value={formData.bonus || 0}
            onChange={(e) => setFormData({ ...formData, bonus: Number.parseInt(e.target.value) || 0 })}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Energizer Points</label>
          <Input
            type="number"
            value={formData.energizer || 0}
            onChange={(e) => setFormData({ ...formData, energizer: Number.parseInt(e.target.value) || 0 })}
          />
        </div>
      </div>

      <Button type="submit" className="w-full">
        {participant ? "Update Participant" : "Add Participant"}
      </Button>
    </form>
  )
}
