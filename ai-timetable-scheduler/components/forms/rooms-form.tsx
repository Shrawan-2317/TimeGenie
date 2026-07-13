"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Edit } from "lucide-react"
import type { InputData } from "@/lib/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface RoomsFormProps {
  data: InputData
  setData: (data: InputData) => void
}

export function RoomsForm({ data, setData }: RoomsFormProps) {
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formValues, setFormValues] = useState({
    id: "",
    type: "classroom",
    capacity: "",
    facilities: "",
  })

  const handleAdd = () => {
    if (!formValues.id) return

    const newRoom = {
      type: formValues.type,
      capacity: Number.parseInt(formValues.capacity) || 0,
      facilities: formValues.facilities
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    }

    setData({
      ...data,
      rooms: {
        ...data.rooms,
        [formValues.id]: newRoom,
      },
    })

    setFormValues({ id: "", type: "classroom", capacity: "", facilities: "" })
    setOpen(false)
    setEditingId(null)
  }

  const handleEdit = (id: string) => {
    const room = data.rooms[id]
    setFormValues({
      id,
      type: room.type,
      capacity: room.capacity.toString(),
      facilities: room.facilities.join(", "),
    })
    setEditingId(id)
    setOpen(true)
  }

  const handleDelete = (id: string) => {
    const newRooms = { ...data.rooms }
    delete newRooms[id]
    setData({ ...data, rooms: newRooms })
  }

  return (
    <div className="space-y-4">
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Rooms</CardTitle>
              <CardDescription>Add all available rooms and labs</CardDescription>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setFormValues({ id: "", type: "classroom", capacity: "", facilities: "" })
                    setEditingId(null)
                  }}
                  className="bg-primary text-primary-foreground gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Room
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border">
                <DialogHeader>
                  <DialogTitle>{editingId ? "Edit Room" : "Add New Room"}</DialogTitle>
                  <DialogDescription>Enter the details for the room</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="room-id">Room ID *</Label>
                    <Input
                      id="room-id"
                      placeholder="e.g., S403, LAB1"
                      value={formValues.id}
                      onChange={(e) => setFormValues({ ...formValues, id: e.target.value })}
                      disabled={!!editingId}
                      className="bg-background border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="room-type">Type *</Label>
                    <Select
                      value={formValues.type}
                      onValueChange={(value) => setFormValues({ ...formValues, type: value })}
                    >
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="classroom">Classroom</SelectItem>
                        <SelectItem value="lab">Lab</SelectItem>
                        <SelectItem value="auditorium">Auditorium</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacity</Label>
                    <Input
                      id="capacity"
                      type="number"
                      placeholder="e.g., 60"
                      value={formValues.capacity}
                      onChange={(e) => setFormValues({ ...formValues, capacity: e.target.value })}
                      className="bg-background border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="facilities">Facilities (comma-separated)</Label>
                    <Input
                      id="facilities"
                      placeholder="e.g., projector, whiteboard, computers"
                      value={formValues.facilities}
                      onChange={(e) => setFormValues({ ...formValues, facilities: e.target.value })}
                      className="bg-background border-border"
                    />
                  </div>
                  <Button onClick={handleAdd} className="w-full bg-primary text-primary-foreground">
                    {editingId ? "Update Room" : "Add Room"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {Object.keys(data.rooms).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No rooms added yet. Click "Add Room" to get started.
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(data.rooms).map(([id, room]) => (
                <div
                  key={id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border bg-background"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{id}</span>
                      <span className="px-2 py-0.5 rounded text-xs bg-primary/10 text-primary">{room.type}</span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Capacity: {room.capacity} | Facilities: {room.facilities.join(", ")}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(id)}
                      className="text-primary hover:text-primary hover:bg-primary/10"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
