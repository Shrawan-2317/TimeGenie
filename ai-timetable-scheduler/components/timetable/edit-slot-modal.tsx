"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { TimetableSlot } from "@/lib/types"
import { AlertCircle } from "lucide-react"

interface EditSlotModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  slot: TimetableSlot
  onSave: (slot: TimetableSlot) => void
}

export function EditSlotModal({ open, onOpenChange, slot, onSave }: EditSlotModalProps) {
  const [editedSlot, setEditedSlot] = useState<TimetableSlot>(slot)
  const [validationError, setValidationError] = useState<string>("")

  useEffect(() => {
    setEditedSlot(slot)
    setValidationError("")
  }, [slot])

  const handleSave = () => {
    // Basic validation
    if (editedSlot.type !== "lunch" && editedSlot.type !== "special" && !editedSlot.subject) {
      setValidationError("Subject is required for theory and lab slots")
      return
    }

    if (editedSlot.type === "theory" || editedSlot.type === "lab") {
      if (!editedSlot.faculty) {
        setValidationError("Faculty is required")
        return
      }
      if (!editedSlot.room) {
        setValidationError("Room is required")
        return
      }
    }

    onSave(editedSlot)
  }

  const handleDelete = () => {
    onSave({
      day: slot.day,
      slot: slot.slot,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle>Edit Slot</DialogTitle>
          <DialogDescription>
            {slot.day} • {slot.slot}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="type">Slot Type</Label>
            <Select
              value={editedSlot.type || "theory"}
              onValueChange={(value) => setEditedSlot({ ...editedSlot, type: value as TimetableSlot["type"] })}
            >
              <SelectTrigger id="type" className="bg-background border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="theory">Theory</SelectItem>
                <SelectItem value="lab">Lab</SelectItem>
                <SelectItem value="special">Special</SelectItem>
                <SelectItem value="lunch">Lunch Break</SelectItem>
                <SelectItem value="online">Online</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {editedSlot.type === "special" ? (
            <div className="space-y-2">
              <Label htmlFor="label">Label</Label>
              <Input
                id="label"
                value={editedSlot.label || ""}
                onChange={(e) => setEditedSlot({ ...editedSlot, label: e.target.value })}
                placeholder="e.g., Mentor Meeting, PBL Review"
                className="bg-background border-border"
              />
            </div>
          ) : editedSlot.type !== "lunch" ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={editedSlot.subject || ""}
                  onChange={(e) => setEditedSlot({ ...editedSlot, subject: e.target.value })}
                  placeholder="e.g., DBMS, SE, CN"
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="faculty">Faculty</Label>
                <Input
                  id="faculty"
                  value={editedSlot.faculty || ""}
                  onChange={(e) => setEditedSlot({ ...editedSlot, faculty: e.target.value })}
                  placeholder="e.g., Dr. A, Dr. B"
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="room">Room</Label>
                <Input
                  id="room"
                  value={editedSlot.room || ""}
                  onChange={(e) => setEditedSlot({ ...editedSlot, room: e.target.value })}
                  placeholder="e.g., S403, LAB1"
                  className="bg-background border-border"
                />
              </div>
            </>
          ) : null}

          {validationError && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{validationError}</span>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          {slot.subject && (
            <Button variant="destructive" onClick={handleDelete}>
              Delete Slot
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-primary text-primary-foreground">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
