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

interface FacultiesFormProps {
  data: InputData
  setData: (data: InputData) => void
}

export function FacultiesForm({ data, setData }: FacultiesFormProps) {
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formValues, setFormValues] = useState({
    id: "",
    name: "",
    subjects: "",
    max_hours_per_day: "",
  })

  const handleAdd = () => {
    if (!formValues.id || !formValues.name) return

    const newFaculty = {
      name: formValues.name,
      subjects: formValues.subjects
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      max_hours_per_day: Number.parseInt(formValues.max_hours_per_day) || 6,
      unavailable_slots: [],
    }

    setData({
      ...data,
      faculties: {
        ...data.faculties,
        [formValues.id]: newFaculty,
      },
    })

    setFormValues({ id: "", name: "", subjects: "", max_hours_per_day: "" })
    setOpen(false)
    setEditingId(null)
  }

  const handleEdit = (id: string) => {
    const faculty = data.faculties[id]
    setFormValues({
      id,
      name: faculty.name,
      subjects: faculty.subjects.join(", "),
      max_hours_per_day: faculty.max_hours_per_day.toString(),
    })
    setEditingId(id)
    setOpen(true)
  }

  const handleDelete = (id: string) => {
    const newFaculties = { ...data.faculties }
    delete newFaculties[id]
    setData({ ...data, faculties: newFaculties })
  }

  return (
    <div className="space-y-4">
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Faculties</CardTitle>
              <CardDescription>Add all faculty members who will teach</CardDescription>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setFormValues({ id: "", name: "", subjects: "", max_hours_per_day: "" })
                    setEditingId(null)
                  }}
                  className="bg-primary text-primary-foreground gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Faculty
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border">
                <DialogHeader>
                  <DialogTitle>{editingId ? "Edit Faculty" : "Add New Faculty"}</DialogTitle>
                  <DialogDescription>Enter the details for the faculty member</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="faculty-id">Faculty ID *</Label>
                    <Input
                      id="faculty-id"
                      placeholder="e.g., Dr. A, Prof. B"
                      value={formValues.id}
                      onChange={(e) => setFormValues({ ...formValues, id: e.target.value })}
                      disabled={!!editingId}
                      className="bg-background border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="faculty-name">Full Name *</Label>
                    <Input
                      id="faculty-name"
                      placeholder="e.g., Dr. Alice Anderson"
                      value={formValues.name}
                      onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                      className="bg-background border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subjects">Subjects (comma-separated)</Label>
                    <Input
                      id="subjects"
                      placeholder="e.g., DBMS, DBMS_LAB"
                      value={formValues.subjects}
                      onChange={(e) => setFormValues({ ...formValues, subjects: e.target.value })}
                      className="bg-background border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-hours">Max Hours per Day</Label>
                    <Input
                      id="max-hours"
                      type="number"
                      placeholder="e.g., 6"
                      value={formValues.max_hours_per_day}
                      onChange={(e) => setFormValues({ ...formValues, max_hours_per_day: e.target.value })}
                      className="bg-background border-border"
                    />
                  </div>
                  <Button onClick={handleAdd} className="w-full bg-primary text-primary-foreground">
                    {editingId ? "Update Faculty" : "Add Faculty"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {Object.keys(data.faculties).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No faculties added yet. Click "Add Faculty" to get started.
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(data.faculties).map(([id, faculty]) => (
                <div
                  key={id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border bg-background"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{id}</span>
                      <span className="text-muted-foreground">-</span>
                      <span>{faculty.name}</span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Subjects: {faculty.subjects.length} | Max {faculty.max_hours_per_day} hrs/day
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
