"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Edit, Save, X, RefreshCw, Users, Trophy, Gamepad2 } from "lucide-react"
import axios from "axios"
import { toast } from "react-toastify"

interface Participant {
  id: string
  email: string
  group: string
}

interface Team {
  id: string
  name: string
  member_1_email: string
  member_2_email: string
}

interface Game {
  id: string
  member_1_email: string
  member_2_email: string
  member_3_email: string
  member_4_email: string
  score: number
}

type DataType = "participants" | "teams" | "games"

export default function UpdateData() {
  const [selectedType, setSelectedType] = useState<DataType>("participants")
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({})

  const dataConfig = {
    participants: {
      title: "Participants",
      icon: Users,
      color: "text-blue-600",
      fields: ["email", "group"],
    },
    teams: {
      title: "Teams",
      icon: Trophy,
      color: "text-green-600",
      fields: ["name", "member_1_email", "member_2_email"],
    },
    games: {
      title: "Games",
      icon: Gamepad2,
      color: "text-purple-600",
      fields: ["member_1_email", "member_2_email", "member_3_email", "member_4_email", "score"],
    },
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_FIREBASE_URL}/${selectedType}.json`)
      const fetchedData = response.data

      if (fetchedData) {
        const formattedData = Object.keys(fetchedData).map((key) => ({
          id: key,
          ...fetchedData[key],
        }))
        setData(formattedData)
        toast.success(`Loaded ${formattedData.length} ${selectedType} records`)
      } else {
        setData([])
        toast.info(`No ${selectedType} data found`)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error(`Failed to fetch ${selectedType} data`)
      setData([])
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (item: any) => {
    setEditingId(item.id)
    setEditForm({ ...item })
  }

  const handleSave = async () => {
    if (!editingId) return

    try {
      const { id, ...updateData } = editForm
      await axios.patch(`${process.env.NEXT_PUBLIC_FIREBASE_URL}/${selectedType}/${editingId}.json`, updateData)

      setData((prev) => prev.map((item) => (item.id === editingId ? { ...editForm } : item)))
      setEditingId(null)
      setEditForm({})
      toast.success("Record updated successfully")
    } catch (error) {
      console.error("Error updating data:", error)
      toast.error("Failed to update record")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_FIREBASE_URL}/${selectedType}/${id}.json`)
      setData((prev) => prev.filter((item) => item.id !== id))
      toast.success("Record deleted successfully")
    } catch (error) {
      console.error("Error deleting data:", error)
      toast.error("Failed to delete record")
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditForm({})
  }

  const renderField = (field: string, value: any, isEditing: boolean) => {
    if (!isEditing) {
      return <span className="text-sm">{value}</span>
    }

    if (field === "score") {
      return (
        <Input
          type="number"
          value={editForm[field] || ""}
          onChange={(e) => setEditForm((prev: any) => ({ ...prev, [field]: Number(e.target.value) }))}
          className="h-8 text-sm"
        />
      )
    }

    return (
      <Input
        type={field.includes("email") ? "email" : "text"}
        value={editForm[field] || ""}
        onChange={(e) => setEditForm((prev: any) => ({ ...prev, [field]: e.target.value }))}
        className="h-8 text-sm"
      />
    )
  }

  useEffect(() => {
    fetchData()
  }, [selectedType])

  const config = dataConfig[selectedType]
  const Icon = config.icon

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Data Management</h1>
        <p className="text-muted-foreground">View, edit, and manage your uploaded data</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon className={`h-6 w-6 ${config.color}`} />
              <CardTitle>Manage {config.title}</CardTitle>
            </div>
            <div className="flex items-center gap-3">
              <Select value={selectedType} onValueChange={(value: DataType) => setSelectedType(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="participants">Participants</SelectItem>
                  <SelectItem value="teams">Teams</SelectItem>
                  <SelectItem value="games">Games</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={fetchData} disabled={loading} variant="outline" size="sm">
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              <span>Loading {selectedType}...</span>
            </div>
          ) : data.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Icon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No {selectedType} data found</p>
              <p className="text-sm">Upload some data first to see it here</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Showing {data.length} {selectedType} records
              </div>
              <div className="space-y-2">
                {data.map((item) => (
                  <Card key={item.id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground font-mono">ID: {item.id}</span>
                        <div className="flex gap-2">
                          {editingId === item.id ? (
                            <>
                              <Button onClick={handleSave} size="sm" className="h-8">
                                <Save className="h-3 w-3 mr-1" />
                                Save
                              </Button>
                              <Button onClick={handleCancel} size="sm" variant="outline" className="h-8">
                                <X className="h-3 w-3 mr-1" />
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button onClick={() => handleEdit(item)} size="sm" variant="outline" className="h-8">
                                <Edit className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                              <Button
                                onClick={() => handleDelete(item.id)}
                                size="sm"
                                variant="outline"
                                className="h-8 text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-3 w-3 mr-1" />
                                Delete
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {config.fields.map((field) => (
                          <div key={field} className="space-y-1">
                            <Label className="text-xs font-medium capitalize">{field.replace(/_/g, " ")}</Label>
                            {renderField(field, item[field], editingId === item.id)}
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
