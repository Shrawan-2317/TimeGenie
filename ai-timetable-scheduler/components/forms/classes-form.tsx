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

interface ClassesFormProps {
  data: InputData
  setData: (data: InputData) => void
}

export function ClassesForm({ data, setData }: ClassesFormProps) {
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formValues, setFormValues] = useState({
    id: "",
    name: "",
    class_teacher: "",
    strength: "",
    subjects: "",
  })

  const handleAdd = () => {
    if (!formValues.id || !formValues.name) return

    const newClass = {
      name: formValues.name,
      subjects: formValues.subjects
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      class_teacher: formValues.class_teacher,
      strength: Number.parseInt(formValues.strength) || 0,
    }

    setData({
      ...data,
      classes: {
        ...data.classes,
        [formValues.id]: newClass,
      },
    })

    setFormValues({ id: "", name: "", class_teacher: "", strength: "", subjects: "" })
    setOpen(false)
    setEditingId(null)
  }

  const handleEdit = (id: string) => {
    const classData = data.classes[id]
    setFormValues({
      id,
      name: classData.name,
      class_teacher: classData.class_teacher,
      strength: classData.strength.toString(),
      subjects: classData.subjects.join(", "),
    })
    setEditingId(id)
    setOpen(true)
  }

  const handleDelete = (id: string) => {
    const newClasses = { ...data.classes }
    delete newClasses[id]
    setData({ ...data, classes: newClasses })
  }

  return (
    <div className="space-y-4">
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Classes</CardTitle>
              <CardDescription>Add all classes that need timetables</CardDescription>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setFormValues({ id: "", name: "", class_teacher: "", strength: "", subjects: "" })
                    setEditingId(null)
                  }}
                  className="bg-primary text-primary-foreground gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Class
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border">
                <DialogHeader>
                  <DialogTitle>{editingId ? "Edit Class" : "Add New Class"}</DialogTitle>
                  <DialogDescription>Enter the details for the class</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="class-id">Class ID *</Label>
                    <Input
                      id="class-id"
                      placeholder="e.g., TY1, BE2, etc."
                      value={formValues.id}
                      onChange={(e) => setFormValues({ ...formValues, id: e.target.value })}
                      disabled={!!editingId}
                      className="bg-background border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="class-name">Class Name *</Label>
                    <Input
                      id="class-name"
                      placeholder="e.g., Third Year Section 1"
                      value={formValues.name}
                      onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                      className="bg-background border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="class-teacher">Class Teacher</Label>
                    <Input
                      id="class-teacher"
                      placeholder="e.g., Dr. John Doe"
                      value={formValues.class_teacher}
                      onChange={(e) => setFormValues({ ...formValues, class_teacher: e.target.value })}
                      className="bg-background border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="strength">Student Strength</Label>
                    <Input
                      id="strength"
                      type="number"
                      placeholder="e.g., 60"
                      value={formValues.strength}
                      onChange={(e) => setFormValues({ ...formValues, strength: e.target.value })}
                      className="bg-background border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subjects">Subjects (comma-separated)</Label>
                    <Input
                      id="subjects"
                      placeholder="e.g., DBMS, SE, CN"
                      value={formValues.subjects}
                      onChange={(e) => setFormValues({ ...formValues, subjects: e.target.value })}
                      className="bg-background border-border"
                    />
                  </div>
                  <Button onClick={handleAdd} className="w-full bg-primary text-primary-foreground">
                    {editingId ? "Update Class" : "Add Class"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {Object.keys(data.classes).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No classes added yet. Click "Add Class" to get started.
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(data.classes).map(([id, classData]) => (
                <div
                  key={id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border bg-background"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{id}</span>
                      <span className="text-muted-foreground">-</span>
                      <span>{classData.name}</span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Teacher: {classData.class_teacher} | Strength: {classData.strength} | Subjects:{" "}
                      {classData.subjects.length}
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
