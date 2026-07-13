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
import { Checkbox } from "@/components/ui/checkbox"

interface SubjectsFormProps {
  data: InputData
  setData: (data: InputData) => void
}

export function SubjectsForm({ data, setData }: SubjectsFormProps) {
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formValues, setFormValues] = useState({
    code: "",
    name: "",
    type: "theory",
    hours_per_week: "",
    faculties: "",
    requires_lab: false,
    duration: "",
  })

  const handleAdd = () => {
    if (!formValues.code || !formValues.name) return

    const newSubject: any = {
      name: formValues.name,
      code: formValues.code,
      type: formValues.type,
      hours_per_week: Number.parseInt(formValues.hours_per_week) || 0,
      faculties: formValues.faculties
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    }

    if (formValues.type === "theory") {
      newSubject.requires_lab = formValues.requires_lab
    }

    if (formValues.type === "lab" && formValues.duration) {
      newSubject.duration = Number.parseInt(formValues.duration)
    }

    setData({
      ...data,
      subjects: {
        ...data.subjects,
        [formValues.code]: newSubject,
      },
    })

    setFormValues({
      code: "",
      name: "",
      type: "theory",
      hours_per_week: "",
      faculties: "",
      requires_lab: false,
      duration: "",
    })
    setOpen(false)
    setEditingId(null)
  }

  const handleEdit = (code: string) => {
    const subject = data.subjects[code]
    setFormValues({
      code,
      name: subject.name,
      type: subject.type,
      hours_per_week: subject.hours_per_week.toString(),
      faculties: subject.faculties.join(", "),
      requires_lab: (subject as any).requires_lab || false,
      duration: (subject as any).duration?.toString() || "",
    })
    setEditingId(code)
    setOpen(true)
  }

  const handleDelete = (code: string) => {
    const newSubjects = { ...data.subjects }
    delete newSubjects[code]
    setData({ ...data, subjects: newSubjects })
  }

  return (
    <div className="space-y-4">
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Subjects</CardTitle>
              <CardDescription>Add all subjects to be scheduled</CardDescription>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setFormValues({
                      code: "",
                      name: "",
                      type: "theory",
                      hours_per_week: "",
                      faculties: "",
                      requires_lab: false,
                      duration: "",
                    })
                    setEditingId(null)
                  }}
                  className="bg-primary text-primary-foreground gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Subject
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingId ? "Edit Subject" : "Add New Subject"}</DialogTitle>
                  <DialogDescription>Enter the details for the subject</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject-code">Subject Code *</Label>
                    <Input
                      id="subject-code"
                      placeholder="e.g., DBMS, SE, CN"
                      value={formValues.code}
                      onChange={(e) => setFormValues({ ...formValues, code: e.target.value })}
                      disabled={!!editingId}
                      className="bg-background border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject-name">Subject Name *</Label>
                    <Input
                      id="subject-name"
                      placeholder="e.g., Database Management Systems"
                      value={formValues.name}
                      onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                      className="bg-background border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject-type">Type *</Label>
                    <Select
                      value={formValues.type}
                      onValueChange={(value) => setFormValues({ ...formValues, type: value })}
                    >
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="theory">Theory</SelectItem>
                        <SelectItem value="lab">Lab</SelectItem>
                        <SelectItem value="special">Special</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hours">Hours per Week *</Label>
                    <Input
                      id="hours"
                      type="number"
                      placeholder="e.g., 4"
                      value={formValues.hours_per_week}
                      onChange={(e) => setFormValues({ ...formValues, hours_per_week: e.target.value })}
                      className="bg-background border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="faculties">Faculties (comma-separated)</Label>
                    <Input
                      id="faculties"
                      placeholder="e.g., Dr. A, Dr. B"
                      value={formValues.faculties}
                      onChange={(e) => setFormValues({ ...formValues, faculties: e.target.value })}
                      className="bg-background border-border"
                    />
                  </div>
                  {formValues.type === "theory" && (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="requires-lab"
                        checked={formValues.requires_lab}
                        onCheckedChange={(checked) =>
                          setFormValues({ ...formValues, requires_lab: checked as boolean })
                        }
                      />
                      <Label htmlFor="requires-lab" className="cursor-pointer">
                        Requires Lab
                      </Label>
                    </div>
                  )}
                  {formValues.type === "lab" && (
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration (hours)</Label>
                      <Input
                        id="duration"
                        type="number"
                        placeholder="e.g., 2"
                        value={formValues.duration}
                        onChange={(e) => setFormValues({ ...formValues, duration: e.target.value })}
                        className="bg-background border-border"
                      />
                    </div>
                  )}
                  <Button onClick={handleAdd} className="w-full bg-primary text-primary-foreground">
                    {editingId ? "Update Subject" : "Add Subject"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {Object.keys(data.subjects).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No subjects added yet. Click "Add Subject" to get started.
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(data.subjects).map(([code, subject]) => (
                <div
                  key={code}
                  className="flex items-center justify-between p-4 rounded-lg border border-border bg-background"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{code}</span>
                      <span className="text-muted-foreground">-</span>
                      <span>{subject.name}</span>
                      <span className="px-2 py-0.5 rounded text-xs bg-primary/10 text-primary">{subject.type}</span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {subject.hours_per_week} hrs/week | Faculties: {subject.faculties.length}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(code)}
                      className="text-primary hover:text-primary hover:bg-primary/10"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(code)}
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
